exports.usleep=function(duration)
{
         var now = new Date().getTime();
        while(new Date().getTime() < now + duration){ /* do nothing */ }  
}