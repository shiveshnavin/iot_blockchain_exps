var sio=require('socket.io')
var http=require('http')
var fs=require('fs') 
  
var GPIO=module.exports={
    pins:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    MODE_INPUT:0,
    MODE_OUTPUT:1,
    connections:[],
    interruptHandlers:[],
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
              //console.log( (input))
                try{
     
                    var inp= input.split('-') 
                    var pin=JSON.parse(inp[0]);
                    var val=JSON.parse(inp[1]);
                    GPIO.write_pin(pin,val)
                    
                   // console.log(GPIO.read_pins())
                    GPIO.emitPin()
                    GPIO.sendInterrupt(pin,val);
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
            socket.emit('output',JSON.stringify(GPIO.read_pins()))
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
    },
    sendInterrupt:function(pin,val)
    {
        if(GPIO.interruptHandlers[pin]!==undefined)
        {
            GPIO.interruptHandlers[pin](pin)
        }
    },
    set_button_handler:function(pin, pull, intmode, period, handler){


        GPIO.interruptHandlers[pin]=handler

    },
    INT_NONE: 0,
    INT_EDGE_POS: 1,
    INT_EDGE_NEG: 2,
    INT_EDGE_ANY: 3,
    INT_LEVEL_HI: 4,
    INT_LEVEL_LO: 5, 
    set_pull: function(pin,mode){},
    PULL_NONE: 0,
    PULL_UP: 1,
    PULL_DOWN: 2, 
    setup_input:function(pin,mode){} ,  
    enable_int: function(en){} , 
    disable_int:function(en){} , 
} 
 
 