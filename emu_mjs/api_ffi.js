//Cfg.set({wifi:{sta:{ssid:iotains[index++],pass:"password"}}});
var Cfg=require('./api_config.js');
var Timer=require('./api_timer.js');
var HTTP=require('./api_http.js');
var Events=require('./api_events.js')
var Sys=require('./api_sys.js')
var Net=require('./api_net.js')
var RPC=require('./api_rpc.js')
var GPIO=require('./api_gpio.js')
var Timer=require('./api_timer.js')

var curIp="127.0.0.1",curPort="5001";
var DEVICE_NO = 0;
try{
    DEVICE_NO=JSON.parse(process.argv.splice(2)[0])
}
catch(e){
    console.warn('Missing device number. Use a integer as 3rd argument. e.g. node init.js 1001')
}
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
   // console.log("Connecting to  IP",curIp,curPort);
}

var blink_timer=-1;
var blink_pin=4;
var DELAY=100;
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
        return function(pin,delay)
        {
         
            GPIO.toggle(pin)
            Sys.usleep(delay)
            GPIO.toggle(pin)
            Sys.usleep(delay)
            GPIO.toggle(pin)
            Sys.usleep(delay)
            GPIO.toggle(pin)
            Sys.usleep(delay)

 
        }
    }
    else if(fun==="void start_blink()")
    {
        return function()
        {
            if(blink_timer!==-1)
            {
                Timer.del(blink_timer);
            }
            blink_timer=Timer.set(DELAY,Timer.REPEAT,function()
            { 
                GPIO.toggle(blink_pin)
            })
        }
    }
    else if(fun==="void stop_blink()")
    {
        return function()
        {
            if(blink_timer!==-1)
            {
                Timer.del(blink_timer);
            }
        }
    }
    else if(fun==="void on_delay(int,int)")
    {
        return function(pin,delayedOff)
        {
            GPIO.write(pin,1)
            Timer.set(delayedOff,0,function()
            {
                GPIO.write(pin,0)
            })
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
        return function(pin,delay)
        {
            blink_pin=pin;
            DELAY=delay
        }
    }
    else if(fun==="void getInfo()")
    {
        return function(){
            var hostNo=JSON.parse(curPort);
            if(hostNo>=5000)
            {
                hostNo=hostNo-Cfg.BASE_PORT;
            }
            return {
                hostNo:hostNo,
                hostIp:"127.0.0.1:"+curPort
            };
        };
    }
    else if(fun==="gpio")
    {
        //console.log("retr gpio")
        return GPIO;
    }


}
 