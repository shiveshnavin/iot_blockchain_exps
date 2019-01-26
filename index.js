
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
var app=RPC.app
/***************START HERE******************/

print('Test',"Delay on 1000 ms");

Sys.usleep(1000)
 

var port=process.argv.splice(2)[0] 
port=port?port : '5000';
 
 


//TODO fill the funcitons in the library files































app.listen(port, () => console.log(`Node app listening on port ${port}!`))