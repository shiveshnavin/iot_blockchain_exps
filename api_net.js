EVENT_GRP=10
exports.STATUS_DISCONNECTED = EVENT_GRP + 1;
exports.STATUS_CONNECTING   = EVENT_GRP + 2;
exports.STATUS_CONNECTED    = EVENT_GRP + 3;
exports.STATUS_GOT_IP       = EVENT_GRP + 4;
exports.EVENT_GRP           = EVENT_GRP    ;
exports.STATUS_GOT_IP       = EVENT_GRP + 5;

exports.get=function(ev)
{
    if(ev===EVENT_GRP + 1)
    {
        return "STATUS_DISCONNECTED";
    }
    else if(ev===EVENT_GRP + 2)
    {
        return "STATUS_CONNECTING";
    }
    else if(ev===EVENT_GRP + 3)
    {
        return "STATUS_CONNECTED";
    }
    else if(ev===EVENT_GRP + 4)
    {
        return "STATUS_GOT_IP";
    }
    else if(ev===EVENT_GRP + 5)
    {
        return "STATUS_GOT_IP";
    } 
}