var express=require('express')
var app=express()
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
    
    //todo register a route app.all 


  };

  exports.LOCAL=1;

  // ```javascript
  // RPC.call(RPC.LOCAL, 'Config.Save', {reboot: true}, function (resp, ud) {
  //   print('Response:', JSON.stringify(resp));
  // }, null);
  // ```
  exports.call= function(dst, name, args, callback, data) {
   
    //todo make http call

  } ;
 
exports.app=app;

