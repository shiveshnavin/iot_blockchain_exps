var pins=[];

exports.MODE_INPUT=0;
exports.MODE_OUTPUT=1;

exports.toggle=function(pin)
{
    if(pins[pin]===undefined)
    {
        pins[pin]=false;
    }
    pins[pin]=!pins[pin];
}


exports.write=function(pin,val)
{
    pins[pin]=val===1?true:false;
}

exports.read=function(pin,val)
{
    return pins[pin];
}