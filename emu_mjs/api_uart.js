
var GPIO=require('./api_gpio.js') 

var UART=module.exports={
    read:function()
    {

    },
    write:function(data)
    {
        UART.emitString(data)
    },
    emitString:function(data)
    {
         var i=0
        GPIO.connections.forEach(socket => {
             socket.emit('serial_io',data)
        });
    },
}