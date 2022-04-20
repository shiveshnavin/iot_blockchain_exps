

 


let DEVICE_NO=Cfg.DEVICE_NO; ;//DEVICE_NAME.slice(7, 8); 
if(DEVICE_NO===undefined)
    DEVICE_NO="0";
let DEVICE_NAME="iotain_"+DEVICE_NO;


if(DEVICE_NAME==="iotain_0")
{
  DEVICE_NO="0";
  DEVICE_NAME="iotain_"+DEVICE_NO;
  Cfg.set({device:{id:DEVICE_NAME}});
}   
let led =5; 
let led2=4;
let isEsp=DEVICE_NAME==="iotain_0" || DEVICE_NAME==="iotain_2" || DEVICE_NAME==="iotain_4";
if(isEsp)
{
  led=2; 
}
else{
  led=5; 
} 
GPIO.set_mode(led2,GPIO.MODE_OUTPUT);
let read_data=function(file){
	let clon=File.read(file);
	if(clon===null || clon===undefined){
		return {status:"COMMITED_OK"};
	}
	if(clon.length<5)
	{ 
		return null; 
	}
	return JSON.parse(clon);
};
let s = read_data('updater_data.json');
let  AP={
  ssid:DEVICE_NAME,pass:"password",enable:true,ip:"192.168."+DEVICE_NO+".1"
  ,gw:"192.168."+DEVICE_NO+".1",dhcp_start:"192.168."+DEVICE_NO+".2",dhcp_end:"192.168."+DEVICE_NO+".100"};
 
print(DEVICE_NAME,"->",'===',DEVICE_NAME,"===");
print(DEVICE_NAME,"->",' AP '+JSON.stringify(AP));
print(DEVICE_NAME,"->","WIFI ",Cfg.get("wifi.sta.ssid")," : ",Cfg.get("wifi.sta.pass"));
print(DEVICE_NAME,"->",'===',Cfg.get("device.id"),"===");

let wifi_setup=ffi('void change_wifi()');
let iotains=["iotain_0","iotain_1","iotain_2","iotain_3","iotain_4"];
if(s.status==="TO_COMMIT")
{
  print(DEVICE_NAME,"->","Updating Device Config");
  Cfg.set({wifi:{ap:AP}});
  Cfg.set({device:{id:DEVICE_NAME}}); 
  if(iotains[0]===DEVICE_NAME)
  {
    Cfg.set({wifi:{sta:{ssid:"Swati_Niwas",pass:"mother1919",enable:true},sta_connect_timeout:(10)}}); 
  }
  else{

    Cfg.set({wifi:{sta:{ssid:iotains[0],pass:"password",enable:true},sta_connect_timeout:(10) }}); 
     
  } 
}  
read_data=undefined; 
AP=undefined;
gc(true); 

let init_led=ffi('void init_led(int,int)'); 
init_led(led,150);

let blink_once=ffi('void blink_once(int,int)'); 
let start_blink=ffi('void start_blink()'); 
let stop_blink=ffi('void stop_blink()');   
let on_delay=ffi('void on_delay(int,int)');   

let status={ap:AP,sta_ip:"0.0.0.0",sta_ssid:Cfg.get("wifi.sta.ssid"),clients:[]}; 
let get_status=function()
{
    status.clients=clients;
    status.myHostIp=myHostIp;
    status.resources=resources;
    status.requests=requests; 
    status.name=DEVICE_NAME;
    return {status:status}; 
}; 
let reg_timer=-1;
let register=function(host,sta_ip)
{ 
  http_call("http://"+host+"/rpc/register",{ssid: DEVICE_NAME, ip: sta_ip}); 
};

let myIp="127.0.0.1:"+(Cfg.BASE_PORT+JSON.parse(Cfg.DEVICE_NO))
let get_info=function()
{
  RPC.call(RPC.LOCAL, 'Sys.GetInfo', null, function (resp, ud) { 
    
    status.sta_ip =  myIp; 
    status.sta_ssid="iotain_"+resp.hostNo ; 
    myHostIp=resp.hostIp; 
    register( myHostIp, status.sta_ip ); 
  }, null); 
};
gc(true);
let clients=[]; 
let myHostIp="192.168."+DEVICE_NO+".1";
let timer_count=0;
let http_call=function(url,body)
{
   print(DEVICE_NAME,"->","HTTP CALL ",url,JSON.stringify(body));

   HTTP.query({
    url: url,
    headers: { 'Content-Type': 'application/json' },   
    data:body,
		success: function(body, full_http_msg) {
      print(DEVICE_NAME,"->",body);       
        },
        error:function(err){print(err)}   
	}); 
    
};
let res_base=JSON.parse(DEVICE_NO)*30;
let resources=[{"res_name":"diring room led","res_id":res_base+1},{"res_name":"diring room led","res_id":res_base+2},{"res_name":"diring room led","res_id":res_base+3}];
let find_resource=function(res_id)
{
 
    for(let i=0;i<resources.length;i++)
    {
        if(resources[i].res_id===res_id)
        { 
            return resources[i];
        }
    } 
    return undefined; 
};
GPIO.set_mode(5,GPIO.MODE_OUTPUT);
let perform_job=function(job)
{

  let res={message:"Job completed on "+DEVICE_NAME,val:(9000+job.res_id)};
    if(job.res_id===1001)
    { 
        let status="on";
        if(job.action==="turn_on")
        {
          status="on";
          GPIO.write(5,1);
        }
        else{
          status="off";
          GPIO.write(5,0);
        }
        res={message:"LED Status Changed ! Job completed on "+DEVICE_NAME,led:status};
    }

    on_delay(led2,4000);
    print(DEVICE_NAME,"->","Performing ",job.res_name);
    return res;
    
};
let requests=[];
let find_request=function(req_id)
{ 
    for(let i=0;i<requests.length;i++)
    {
        if(requests[i].req_id===req_id)
        {
            return requests[i];
        }
    }
    return undefined;
};
let update_request=function(req)
{
     for(let i=0;i<requests.length;i++)
    {
        if(requests[i].req_id===req.req_id)
        {
            requests[i].status=req.status;
            return requests[i];
        }
    } 
};

let fwd_request=function(req)
{
    let _req={
        req_id:req.req_id,
        force_fwd:req.force_fwd,
        src_ip:myIp,
        status:req.status,
        job:req.job
    }; 
    print(DEVICE_NAME,"->","FWD RQ FROM:",req.src_ip," JOB:",req.job.res_name," TO:", JSON.stringify(clients)," And ",myHostIp); 
    for(let i=0;i<clients.length;i++)
    { 
        http_call("http://"+clients[i].ip+"/rpc/on_request",_req);
    }
    _req.src_ip=status.sta_ip;
    http_call("http://"+myHostIp+"/rpc/on_request",_req);

    return {"forwarded_to":clients}; 
};  

/*********DEVICE SPECIFIC */

/*
load('api_esp32_touchpad.js'); 
let ts = TouchPad.GPIO[14];
let lastTouch=0;
let led_on=false;
let on_touch=function(st)
{
 
  let val = TouchPad.readFiltered(ts);
  print('Status:', st, 'Value:', val);   
  let req={
    req_id:JSON.stringify(Timer.now()),
    src_ip:"0.0.0.0",
    status:{"message":"under process"},
    job:{"res_id":1001,"res_name":"LED Strip","action":led_on?"turn_off":"turn_on"}
  };
  led_on=!led_on;
  RPC.call(RPC.LOCAL, 'on_request', req, function (resp, ud) {
    print('Response:', JSON.stringify(resp));
  }, null);

}; 
if(DEVICE_NAME==="iotain_2")
{
  resources.push({"res_name":"LED Strip","res_id":1001});
}

TouchPad.init();
TouchPad.filterStart(10);
TouchPad.setMeasTime(0x1000, 0xffff);
TouchPad.setVoltage(TouchPad.HVOLT_2V4, TouchPad.LVOLT_0V8, TouchPad.HVOLT_ATTEN_1V5);
TouchPad.config(ts, 0);
Sys.usleep(100000); // wait a bit for initial filtering.
let noTouchVal = TouchPad.readFiltered(ts);
let touchThresh = noTouchVal * 2 / 3;
print('Sensor', ts, 'noTouchVal', noTouchVal, 'touchThresh', touchThresh);
TouchPad.setThresh(ts, touchThresh);
TouchPad.isrRegister(function(st) {
  
  
  if(Timer.now()-lastTouch<1.2 )
  {
    return;
  }
  lastTouch=Timer.now();
  on_touch(st);

}, null);
if(DEVICE_NAME==="iotain_0")
  TouchPad.intrEnable();
 
 */



/********************* */
RPC.addHandler('status',function(args){
  
  return get_status();

}); 
RPC.addHandler('register',function(args)
{ 
  for(let i=0;i<clients.length;i++)
  {
    if(clients[i].ssid===args.ssid)
    {
      clients[i].ip=args.ip;
      return {status:"Already Registered"};
    }
  }
  clients.push({ssid:args.ssid,ip:args.ip});
  return {status:"Registered"};

});  
RPC.addHandler('on_callback',function(req){

  on_delay(led2,4000);
  Sys.usleep(3000);
  print(DEVICE_NAME,"->","callback on "+DEVICE_NAME, " ID ",req.req_id); 
  gc(true);
  let req_hist=find_request(req.req_id);
  if(req_hist===undefined)
  {
      return {result:"FATAL:ERR: request not found on this node"};
  }
  
  let rq=update_request(req); 
  print(DEVICE_NAME,"->","FWD RES TO:",rq.src_ip," JOB:",rq.job.res_name);
  rq.status=req.status;
  http_call("http://"+rq.src_ip+"/rpc/on_callback",rq); 

  return {result:{"reverted_to":(rq.src_ip)},status:"Response reverted"};
});   
GPIO.write(led2,0);
RPC.addHandler('on_request',function(req){
 
  print(DEVICE_NAME,"->","request on "+DEVICE_NAME, " ID ",req.req_id);gc(true); 
  let res=find_resource(req.job.res_id);
  if(res===undefined)
  {
      let req_hist=find_request(req.req_id);
      if(req_hist!==undefined)
      {
          if(req.force_fwd!==undefined)
          {
              fwd_request(req);
              return {result:clients,status:"forwarding request"};
          }
          print("Already Recieved ",req.req_id );
          return {result:req_hist.status,status:"request already recieved"}; 
      }
      else{
           
          blink_once(led2,50);
          requests.push(req);  
          return {result:fwd_request(req),status:"forwarding request"};

      }
  }
  else{
      let respo=perform_job(req.job);
      req.status=respo;
      requests.push(req);
      http_call("http://"+req.src_ip+"/rpc/on_callback",req);
      
      return  {result:respo,status:"performing job"};
  } 
}); 
 
let index=1+JSON.parse(DEVICE_NO);
start_blink();
let diconnect_count=0;
let prev_event=-1;
Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {
    /*if(ev===Net.STATUS_CONNECTED && prev_event===Net.STATUS_CONNECTED)
    {
        return;
    }

    if(ev===Net.STATUS_GOT_IP && prev_event===Net.STATUS_GOT_IP)
    {
        return;
    }
*/

    prev_event=ev;
  let evs = '???';
  if (ev === Net.STATUS_DISCONNECTED) {
    start_blink();
    evs = 'DISCONNECTED';
    status.sta_ip="0.0.0.0";
    diconnect_count++; 
    print(DEVICE_NAME,"->","Still Disconnected ",diconnect_count); 
    if(diconnect_count>=2  )
    {
      diconnect_count=0; 
      if(index===iotains.length)
        index=0;
      if(iotains[index]===DEVICE_NAME || iotains[index]===Cfg.get("wifi.sta.ssid"))
      {
        index++; 
      }
      print(DEVICE_NAME,"->","Connecting to ",iotains[index]);
      Cfg.set({wifi:{sta:{ssid:iotains[index++],pass:"password"}}});
      wifi_setup(); 
    } 
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = 'CONNECTING';
  } else if (ev === Net.STATUS_CONNECTED) { 
    GPIO.write(led,1); 
    evs = 'CONNECTED';
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = 'GOT_IP';
    diconnect_count=0;
    stop_blink();
    GPIO.write(led,1); 
    if(reg_timer===-1)
    {
      Timer.del(reg_timer);
      reg_timer=-1;
    }
    timer_count=0;
    reg_timer=Timer.set(5000,Timer.REPEAT,function(args){
 
      if(timer_count++ >2)
      {
        Timer.del(reg_timer);
        reg_timer=-1;
        return;
      }
      get_info(); 

    },null);
     
  }
  
  print(DEVICE_NAME,"->",'== Net event:', Net.get(ev), '');
  evs=undefined;
  gc(true);
}, null);









GPIO.set_button_handler(0, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function(x) {
      
      print(DEVICE_NAME,"->",'Requesting Resource');
      let req={
        req_id:JSON.stringify(Timer.now()),
        src_ip:"0.0.0.0",
        status:{"message":"init"},
        job:{"res_id":1001,"res_name":"LED Strip","action":led_on?"turn_off":"turn_on"}
      };
      led_on=!led_on;
      RPC.call(RPC.LOCAL, 'on_request', req, function (resp, ud) {
        print('Response:', JSON.stringify(resp));
      }, null);


   }, null);

//TODO fill the functions in the library files