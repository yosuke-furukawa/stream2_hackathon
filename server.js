var http = require("http")
http.createServer(handler).listen(3001);

var logger = require("./read_logger");


console.log("Started Server on port 3001");


function handler(req, res) {
  if (req.headers["accept"] && req.headers["accept"] == "text/event-stream") {
    function response(id, data) {
      res.writeHead(200, {
        'Content-type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write("id:" + id + "\n");
      res.write("data:" + data + "\n\n");
      res.write("retry: 1000");
      res.end();
    }

    //logger.start(function(){
    //  response(logger.id, logger.data);
    //});
    logger.start(res);

  } else {
    var fs = require("fs");
    var read = fs.createReadStream("index.html");
    read.pipe(res);
  }
}

