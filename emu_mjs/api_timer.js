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


     if(flag!==1)
      {
        return setTimeout(callback,flag,delay)
      }
      else{
        return setInterval(callback,delay)
      }
  }

  exports.REPEAT= 1;

  // ## **`Timer.now()`**
  // Return current time as double value 
  exports.now=function()
  {
    return new Date();
  }

  // ## **`Timer.del(id)`**
  // Cancel previously installed timer.
  exports.del=function(timerid)
  {
    clearInterval(timerid)
  }
 