 
 
 var request=require('request')
  // Example:
  // ```javascript
  // HTTP.query({
  //   url: 'http://httpbin.org/post',
  //   headers: { 'X-Foo': 'bar' },     // Optional - headers
  //   data: {foo: 1, bar: 'baz'},      // Optional. If set, JSON-encoded and POST-ed
  //   success: function(body, full_http_msg) { print(body); },
  //   error: function(err) { print(err); },  // Optional
  // });
  // ```
  exports.query=function(opts) {
    
    var req=request.post(

      opts.url,
      {json:opts.data},
      function(err,resp,body)
      {
        opts.error(err)
        opts.success(body)
        console.log("RESPONSE IS ",body)
      }
    )

  }
 
