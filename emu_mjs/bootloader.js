
function load(path)
{ 
    return require('./'+path)
}
function gc()
{

}
let print=function()
{ 
  
    let str='';
    for(let i=0;i<arguments.length;i++)
       { 
        try{
          str+=' '+arguments[i];
        process.stdout.write(arguments[i]);
        }
        catch(err)
        {
            console.log(arguments[i])
        }
       } 
       process.stdout.write('\n'); 
       if(UART!==undefined)
       {
        UART.write(str)
       }
    
} 


var Sys=load('api_sys.js');
var HTTP=load('api_http.js');
var RPC=load('api_rpc.js');
var Cfg=load('api_config.js');
var ffi=load('api_ffi.js');
var Event=load('api_events.js');
var Net=load('api_net.js');
var File=load('api_file.js');
var GPIO=ffi('gpio')
var Timer=load('api_timer.js'); 
var UART=load('api_uart.js'); 
 
/***************START HERE******************/
