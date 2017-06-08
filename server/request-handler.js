/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var messages = [];

var handlePOST = function(request,cb) {
  var requestBody = '';
    request.on('data', function(data) {
    requestBody += data;
  });

  request.on('end', function() {
    messages.push(JSON.parse(requestBody));
    cb(201,messages);
  });
};

var router = function(request,cb) {
  //Returns a handler that will handle responses
  //differently based on the method and URL
  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      cb(200,messages);

    } else if (request.method === 'POST') {
      handlePOST(request,cb);
    }
  } else {
    //If URL is invalid, always send same type of response
    cb(404,{message: '404 error- Not Found'});
  }


};

var requestHandler = function(request, response) {
  /*
    request: Event object
      -can be used to access response status, headers, data

      .headers: Headers object
        .accept string
        .accept-encoding e.g. "gzip, deflate, sdch, br"
        .accept-language
        .connection(is a Socket)
        .host (IP of host)
        .upgrade-insecure-requests: (INT)
        .user-agent- loks like browser info
      .client (is a socket)
      .complete (boolean)
      .rawHeaders- an array of headers unconditioned
      .statusCode
      .statusMessage
      .upgrade (boolean)
      .url

  */

  /*
    response: Event Object
      .chunkedEncoding (boolean)
      .connection (is a Socket)
      .domain
      .finished (boolean)
      .output (array)
      .outputCallbacks (array)
      .outputEncodings (array)
      .outputSize (= 0 in our test)
      .sendDate (boolean)
      .shouldKeepAlive (boolean)
      .socket (socket)
      .useChunkedEncodingByDefault (boolean)
      .writable (boolean, true in our test)
  */


  //Moved this here to make Pomander Happy
  var defaultCorsHeaders = {
    // These headers will allow Cross-Origin Resource Sharing (CORS).
    // This code allows this server to talk to websites that
    // are on different domains, for instance, your chat client.
    //
    // Your chat client is running from a url like file://your/chat/client/index.html,
    // which is considered a different domain.
    //
    // Another way to get around this restriction is to serve you chat
    // client from this domain by setting up static file serving.
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };

  // The outgoing status.
  //Default to 404- Not Found
  var statusCode = 404;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  //console.log(request);
  router(request, (status, data) => {
    statusCode = status;
    // Tell the client we are sending them plain text.
    //
    // You will need to change this if you are sending something
    // other than plain text, like JSON or HTML.
    headers['Content-Type'] = 'application/json';

    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.
    response.writeHead(statusCode, headers);


    // Make sure to always call response.end() - Node may not send
    // anything back to the client until you do. The string you pass to
    // response.end() will be the body of the response - i.e. what shows
    // up in the browser.
    // Calling .end "flushes" the response's internal buffer, forcing
    // node to actually send all the data over to the client.
    response.end(JSON.stringify({
      message: 'Hello, World!',
      results: data
    }));

  });
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
};


module.exports = requestHandler;

