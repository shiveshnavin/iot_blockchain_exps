//Cfg.set({wifi:{sta:{ssid:iotains[index++],pass:"password"}}});
var Cfg=require('./api_config.js');
var Timer=require('./api_timer.js');
var HTTP=require('./api_http.js');
var Events=require('./api_events.js')
var Net=require('./api_net.js')

var curIp="127.0.0.1",curPort="5001";
var send_ping=function(url)
{

    HTTP.query({
        url:url,
        data:{},
        success:function(res,body)
        {
            //console.log("CONENCTED to "+curIp+":"+curPort)
            Events.trigger(Net.EVENT_GRP,true);
        },
        error:function(err)
        {
            //console.log("DISCONNECTED from "+curIp+":"+curPort)
            Events.trigger(Net.EVENT_GRP,false);

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
    curPort=port;
}
module.exports=(fun)=>{

    if(fun==="wifi_setup()")
        return function()
        {
            connect(Cfg.get("wifi.sta.ssid"),Cfg.get("wifi.sta.pass"));
        }



}