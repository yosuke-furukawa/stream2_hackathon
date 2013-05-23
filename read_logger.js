var fs = require("fs");
var id = 0;
var file = 'test.txt';
var Transform = require('stream').Transform;
Transform.prototype._transform = function(chunk, encoding, cb) {
  id++;
  console.log(id, ""+chunk);
  this.push("Status: HTTP/1.1 200 OK");
  this.push('Content-type: text/event-stream');
  this.push('Cache-control: no-cache');
  this.push('Connection: keep-alive');
  this.push("id:" + id + "\n");
  this.push("data:" + chunk + "\n\n");
  this.push("retry: 10");
  cb();
};


var fileWatcher = {};

fileWatcher.start = function(res) {
  fs.watchFile(file, function (curr, prev) {
    if (curr.size !== prev.size) {
      var readStream = fs.createReadStream(file, {start: prev.size, end: curr.size});
      var tstream = new Transform();
      readStream.pipe(tstream).pipe(res);
      //var text = "";
      //readStream.on('readable', function () { 
      //  text += readStream.read();
      //});
      //readStream.on('end', function (close) {
      //  fileWatcher.data = text;
      //});
    }
  });
};

module.exports = fileWatcher;
