
function load(path)
{ 
    return require('./'+path)
}
let print=function()
{ 
    for(let i=0;i<arguments.length;i++)
       {
        process.stdout.write(arguments[i]);
       } 
       process.stdout.write('\n'); 
}
module.exports = app


var Sys=load('api_sys.js');
var HTTP=load('api_http.js');
var RPC=load('api_rpc.js');
var Cfg=load('api_config.js');
var ffi=load('api_ffi.js');
var Event=load('api_events.js');
var Net=load('api_net.js');
var app=RPC.app
/***************START HERE******************/


 

var port=process.argv.splice(2)[0] 
port=port?port : '5000';
app.set('port',port);

 /*
print('Test',"Delay on 1000 ms");
Sys.usleep(1000)
 HTTP.query({
     url:"http://127.0.0.1:6641/products",
     data:{ngoid:"VtuVIkeKYYWTpRjONdlax25aJtx2"},
     success:function(body,http_msg)
     {
        print(body);
     },
     error:function(err)
     {  
        print(err);
     }
 });

 RPC.addHandler('hello',function(args)
 {
     
     return "Hello World"+(args.t+1);
 })
Sys.usleep(1000);
 RPC.call(RPC.LOCAL,'hello',{t:53},function(res,ud){

    print(res);
    
 },null);*/


 Cfg.set({device:{name:"Yella"}});
 print(Cfg.get("device.name"));
 print(Cfg.get("mqtt.server"));


 
 Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {

    console.log(ev)

 });
//TODO fill the funcitons in the library files































app.listen(port, () => console.log(`Node app listening on port ${port}!`))