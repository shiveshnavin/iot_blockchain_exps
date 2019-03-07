var sio=require('socket.io')
var http=require('http')
var fs=require('fs')
var pins=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
const connections = [];
var write_pin=function (pin,val)
{
    read_pins();
    pins[pin]=val
    write_pins();
}
var read_pins=function ()
{
    
    pins=JSON.parse(fs.readFileSync('./pins.json'))
    return pins 
}
var write_pins=function ()
{ 
    fs.writeFileSync('./pins.json',JSON.stringify(pins))
    emitPin()
}
var read_pin=function (pin)
{
    
    pins=read_pins()
    return pins[pin]
}


 
exports.pins=pins;
exports.initGPIO=function(express_app)
{
    app=express_app 
    var server=http.createServer(app)
    io=sio(server)


    io.sockets.on('connection',(socket) => {
        connections.push(socket);
        console.log(' %s sockets is connected', connections.length);
    
        socket.on('input',(input)=>{
            console.log( (input))
            try{

                var inp=JSON.parse(JSON.stringify(input))
                if(typeof inp.pin===Number)
                {
                     write_pin(inp.pin,inp.val)
                }
                console.log(read_pins())
                emitPin()
            }catch(e)
            {
                console.log(e)
            }
        })

        socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        });
    });



    return server

}

exports.MODE_INPUT=0;
exports.MODE_OUTPUT=1;

exports.toggle=function(pin)
{ 
    read_pins()
    if(pins[pin]===undefined)
    {
        pins[pin]=0;
    }
    var val=pins[pin]
    pins[pin]=(val===0?1:0);
    write_pins() 
}

var emitPin=function()
{
    connections.forEach(socket => {
       
        socket.emit('output',read_pins())
    });
}
exports.write=function(pin,val)
{
    write_pin(pin,val) 
    console.log('Emitting ',pin,' to ',val)  
    emitPin()
  
}

exports.read=function(pin)
{
    read_pin()
    return pins[pin];
}

exports.set_mode=function(pin,mode)
{
    read_pin(pin)
    pins[pin]=0;
    write_pins();
}