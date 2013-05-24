var fs = require("fs");
var id = 0;

var Transform = require('stream').Transform;
Transform.prototype._transform = function(chunk, encoding, cb) {
  id++;
  var data = chunk.toString();
  if (data) {
    data = data.replace(/(.*)\n/g, "$1<br/>");
    this.push("id:" + id + "\n");
    this.push("data:"+ data + "\n\n");
    this.push("retry: 10");
  }
  cb();
};


module.exports.pipeResponse = function(readStream, res) {
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
  tstream.on("error", function(error) {
    console.error("error " + error);
  });
  readStream.on("error", function(error) {
    console.error("error " + error);
  });
};

