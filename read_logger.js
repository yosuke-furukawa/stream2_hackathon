var fs = require("fs");
var id = 0;
var file = 'test.txt';
var Transform = require('stream').Transform;
Transform.prototype._transform = function(chunk, encoding, cb) {
  id++;
  this.push("id:" + id + "\n");
  var data = "" + chunk;
  data = data.replace(/(.*)\n/g, "$1<br/>");
  this.push("data:"+ data + "\n\n");
  this.push("retry: 10");
  cb();
};


var fileWatcher = {};

fileWatcher.start = function(res) {
  fs.watchFile(file, function (curr, prev) {
    if (curr.size !== prev.size) {
      var readStream = fs.createReadStream(file, {start: prev.size, end: curr.size});
      var tstream = new Transform();
      res.on('readable', function(){
        console.log("" + res.read());
      });
      readStream.pipe(tstream);
      var data = "";
      tstream.on("readable", function() {
        data += tstream.read();
      });
      tstream.on("end", function() {
        res.writeHead(200, {
          'Content-type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        res.write(data);
        res.end();
      });
    }
  });
};

module.exports = fileWatcher;
