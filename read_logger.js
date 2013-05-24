var fs = require("fs");
var id = 0;

var Transform = require('stream').Transform;
Transform.prototype._transform = function(chunk, encoding, cb) {
  id++;
  var data = chunk.toString();
  if (data) {
    data = data.replace(/(.*)(error)(.*)/gi, "$1<font color='red'>$2</font>$3");
    data = data.replace(/(.*)\n/g, "$1<br/>");
    this.push("id:" + id + "\n");
    this.push("data:"+ data + "\n\n");
    this.push("retry: 10");
  }
  cb();
};


module.exports.start = function(file, res) {
  var prevSize = 0;
  fs.watch(file, function (event, f) {
    fs.stat(file, function(err, stats) {
      if (err) return;
      var size = stats.size;
      if (size > prevSize) {
        var readStream = fs.createReadStream(file, {start: prevSize, end: size});
        prevSize = size;
        var tstream = new Transform();
        res.writeHead(200, {
          'Content-type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        readStream.pipe(tstream).pipe(res);
        tstream.on("end", function() {
          res.end();
        });
        readStream.on("end", function() {
          res.removeAllListeners();
        });
      }
    });
  });
};

