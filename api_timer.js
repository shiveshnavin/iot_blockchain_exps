var app = require('./index.js');
app.get('/dd',(re,ree)=>{ree.send({s:'ss'})})

  // Return value: numeric timer ID.
  //
  // Example:
  // ```javascript
  // // Call every second
  // Timer.set(1000, Timer.REPEAT, function() {
  //   let value = GPIO.toggle(2);
  //   print(value ? 'Tick' : 'Tock');
  // }, null);
  // ```
  exports.set=function(delay,flag,callback){

  }

  exports.REPEAT= 1;

  // ## **`Timer.now()`**
  // Return current time as double value 
  exports.now=function()
  {

  }

  // ## **`Timer.del(id)`**
  // Cancel previously installed timer.
  exports.del=function(timerid)
  {

  }
 