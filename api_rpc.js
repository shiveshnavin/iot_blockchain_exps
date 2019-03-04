var express=require('express')
var app=express()
var ffi=require('./api_ffi.js')
app.all('/',function(req,res)
{
  res.send('Emulator Running on Port '+app.get('port'))
})
app.all('/ping',function(req,res)
{
  res.send('You are Connected to '+app.get('port'))
})
app.use (function(req, res, next) {
  var data='';
  req.setEncoding('utf8');
  req.on('data', function(chunk) { 
     data += chunk;
  });

  req.on('end', function() {
      req.body = data;
      next();
  });
});


  // Example:
  // ```javascript
  // RPC.addHandler('Sum', function(args) {
  //   if (typeof(args) === 'object' && typeof(args.a) === 'number' &&
  //       typeof(args.b) === 'number') {
  //     return args.a + args.b;
  //   } else {
  //     return {error: -1, message: 'Bad request. Expected: {"a":N1,"b":N2}'};
  //   }
  // });
  // ``` 
  exports.addHandler= function(path, callback, data) {
    
    if(path.replace('/',''))
    path='/'+path
    path="/rpc"+path
 
     app.all(path,function(req,res)
    {
      res.send(callback(JSON.parse(req.body)))
    })
    

  };

  exports.LOCAL=1;

  // ```javascript
  // RPC.call(RPC.LOCAL, 'Config.Save', {reboot: true}, function (resp, ud) {
  //   print('Response:', JSON.stringify(resp));
  // }, null);
  // ```
 
  exports.call= function(dst, name, args, callback, data) {
   
    if(dst===1)
    {
      if(name==='Sys.GetInfo')
      {
        callback(ffi("void getInfo()")())

      }

      return
    }
       
    var HTTP=require('./api_http.js')
    HTTP.query({
      url:"http://127.0.0.1:"+app.get('port')+"/"+name,
      data:args,
      success:function(body,http_msg)
      {
        callback(body)
      },
      error:function(err)
      {  
        callback(err)
      }
    })

  } ;
 
exports.app=app;

