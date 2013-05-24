var http = require("http");
var logger = require("./read_logger");

http.createServer(handler).listen(3001);
console.log("Started Server on port 3001");

function handler(req, res) {
  if (req.headers["accept"] && req.headers["accept"] == "text/event-stream") {
    logger.start("test.txt", res);
  } else {
    var fs = require("fs");
    var read = fs.createReadStream("index.html");
    read.pipe(res);
  }
}

