var events=[]
var Net=require('./api_net.js');
exports.addGroupHandler=function(id,callback,data)
{    
    events[id]=callback;
}
 
exports.trigger=function(id,data)
{
    if(id===EVENT_GRP)
    { 
        if(data===Net.STATUS_CONNECTED)
            events[id](Net.STATUS_CONNECTED,'','');
        else if(data===Net.STATUS_GOT_IP)
        {
            events[id](Net.STATUS_GOT_IP,'','');
        }
        else
            events[id](Net.STATUS_DISCONNECTED,'','');
    }
}