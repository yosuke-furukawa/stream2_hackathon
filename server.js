var http = require("http");
var sse_stream = require("./sse_stream");
var path = require("path");
var fs = require("fs");
var usage = function() {
  console.log("node server.js --file '/user/test/xxx.txt'|--cmd 'tail -f xxx.txt' [--port] [3000]");
};

if (process.argv.length < 4) {
  usage();
  process.exit();
}

var port = process.argv[5] || 3001;

http.createServer(handler).listen(port);
console.log("Started Server on port " + port);

this.opts = function() {
  this.option = process.argv[2];
  if (this.option === "--file") {
    this.filepath = process.argv[3];
  } else if (this.option === "--cmd") {
    this.command = process.argv[3];
  } else {
    usage();
    process.exit();
  }
  return this;
};

var self = this;

function handler(req, res) {
  var opts = self.opts();
  if (req.headers["accept"] && req.headers["accept"] == "text/event-stream") {
    if (opts.filepath) {
      var filepath = path.resolve(opts.filepath);
      fs.watch(filepath, function (event, f) {
        var prevSize = 0;
        fs.stat(filepath, function(err, stats) {
          if (err) return;
          var size = stats.size;
          if (size > prevSize) {
            var readStream = fs.createReadStream(filepath, {start: prevSize, end: size});
            prevSize = size;
            sse_stream.pipeResponse(readStream, res);
            readStream.on("end", function() {
              res.removeAllListeners();
            });
          }
        });
      });
    } else if (opts.command) {
      var exec = require('child_process').exec;
      var child = exec(opts.command);
      sse_stream.pipeResponse(child.stdout, res);
      sse_stream.pipeResponse(child.stderr, res);
    }
  } else {
    var read = fs.createReadStream("index.html");
    read.pipe(res);
  }
};

