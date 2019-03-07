var sio=require('socket.io')
var http=require('http')
var fs=require('fs') 
 



var GPIO=module.exports={
    pins:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    MODE_INPUT:0,
    MODE_OUTPUT:1,
    connections:[],
    initGPIO:function(express_app)
    {
        app=express_app 
        var server=http.createServer(app)
        io=sio(server)
    
    
        io.sockets.on('connection',(socket) => {
            GPIO.connections.push(socket);
            console.log(' %s sockets is connected', GPIO.connections.length);
        GPIO.emitPin()
            socket.on('input',(input)=>{
               // console.log( (input))
                try{
     
                    var inp= input.split('-') 
                    GPIO.write_pin(inp[0],inp[1])
                    
                    console.log(GPIO.read_pins())
                    GPIO.emitPin()
                }catch(e)
                {
                   // console.log(e)
                }
            })
    
            socket.on('disconnect', () => {
                GPIO.connections.splice(GPIO.connections.indexOf(socket), 1);
            });
        });
    
    
    
        return server
    
    } ,
    toggle:function(pin)
    { 
        GPIO.read_pins()
        if(GPIO.pins[pin]===undefined)
        {
            GPIO.pins[pin]=0;
        }
        var val=GPIO.pins[pin]
        GPIO.pins[pin]=(val===0?1:0);
        GPIO.write_pins() 
    },
    emitPin:function()
    {
         var i=0
        GPIO.connections.forEach(socket => {
            //console.log("Emit to socK ",i++)
            socket.emit('output',GPIO.read_pins())
        });
    },
    write:function(pin,val)
    {
        GPIO.write_pin(pin,val) 
        //console.log('Emitting ',pin,' to ',val)  
        GPIO.emitPin()
      
    },
    read:function(pin)
    {
        GPIO.read_pin()
        return GPIO.pins[pin];
    },
    set_mode:function(pin,mode)
    {
        GPIO.read_pin(pin)
        GPIO.pins[pin]=0;
        GPIO.write_pins();
    }
    ,write_pin:function (pin,val)
    {
        GPIO.read_pins();
        //console.log("St pin ",pin,' to ',val)
        GPIO.pins[pin]=val
        GPIO.write_pins();
    }
    ,read_pins:function ()
    {
        
        //GPIO.pins=JSON.parse(fs.readFileSync('./pins.json'))
        return GPIO.pins 
    },
    write_pins:function ()
    { 
        //fs.writeFileSync('./pins.json',JSON.stringify(pins))
        GPIO.emitPin()
    },
    read_pin:function (pin)
    {
        
        GPIO.pins=GPIO.read_pins()
        return GPIO.pins[pin]
    }


} 
 
 