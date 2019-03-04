//Cfg.set({wifi:{sta:{ssid:iotains[index++],pass:"password"}}});
var Cfg=require('./api_config.js');
var Timer=require('./api_timer.js');
var HTTP=require('./api_http.js');
var Events=require('./api_events.js')
var Net=require('./api_net.js')
var RPC=require('./api_rpc.js')

var curIp="127.0.0.1",curPort="5001";
let DEVICE_NO=JSON.parse(process.argv.splice(2)[0])
Cfg.DEVICE_NO=DEVICE_NO;

if(DEVICE_NO>=Cfg.MAX_NODES)
    DEVICE_NO=-1;
curPort=DEVICE_NO+1;

var wasSuc=0;
var send_ping=function(url)
{

    HTTP.query({
        url:url,
        data:{},
        success:function(res,body)
        {
            wasSuc++;
            if(wasSuc>2)
            return;
            //console.log("CONENCTED to "+curIp+":"+curPort)
            Events.trigger(Net.EVENT_GRP,Net.STATUS_CONNECTED);
            Events.trigger(Net.EVENT_GRP,Net.STATUS_GOT_IP);

        },
        error:function(err)
        {

            wasSuc=0;
            //console.log("DISCONNECTED from "+curIp+":"+curPort)
            Events.trigger(Net.EVENT_GRP,Net.STATUS_DISCONNECTED);

        }
    })
}

 var keep_alive=Timer.set(3000,Timer.REPEAT,function()
{
    send_ping("http://"+curIp+":"+curPort+"/ping");
})
var connect=function(ip,port)
{
    curIp=ip;
    curPort=JSON.parse(Cfg.BASE_PORT)+JSON.parse(port);
    console.log("Connecting to  IP",curIp,curPort);
}

module.exports=(fun)=>{

    if(fun==="void wifi_setup()")
        return function()
        { 
            var ssid=Cfg.get("wifi.sta.ssid");
            if(ssid===undefined)
            {
                let DEVICE_NO=JSON.parse(process.argv.splice(2)[0])
                if(DEVICE_NO>=Cfg.MAX_NODES)
                 DEVICE_NO=-1;
                ssid="iotain_"+(DEVICE_NO+1);
            }
            connect("127.0.0.1",ssid.slice(7, 8));
        }
    else if(fun==="void blink_once(int,int)")
    {
        return function(delay,pin)
        {
            
        }
    }
    else if(fun==="void start_blink()")
    {
        return function()
        {
            
        }
    }
    else if(fun==="void stop_blink()")
    {
        return function()
        {
            
        }
    }
    else if(fun==="void on_delay(int,int)")
    {
        return function(p1,p2)
        {
            
        }
    }
    else if(fun==="void on_delay()")
    {
        return function()
        {
            
        }
    }
    else if(fun==="void change_wifi()")
    {
        return function()
        {
            
            var ssid=Cfg.get("wifi.sta.ssid");
            if(ssid===undefined)
            {
                let DEVICE_NO=JSON.parse(process.argv.splice(2)[0])
                if(DEVICE_NO>=Cfg.MAX_NODES)
                 DEVICE_NO=-1;
                ssid="iotain_"+(DEVICE_NO+1);
            }
            var pr=ssid.slice(7, 8)
            if(pr==="_")
            pr=ssid.slice(8, 9);

            connect("127.0.0.1",pr);
        }
    }
    else if(fun==="void init_led(int,int)")
    {
        return function(pin,mode)
        {
            
        }
    }
    else if(fun==="void getInfo()")
    {
        return function(){
            return {
                hostNo:curPort,
                hostIp:"127.0.0.1:"+curPort
            };
        };
    }


}
 