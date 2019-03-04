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
        if(data)
            events[id](Net.STATUS_CONNECTED,'','');
        else
            events[id](Net.STATUS_DISCONNECTED,'','');
    }
}