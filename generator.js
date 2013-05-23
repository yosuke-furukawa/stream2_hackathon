var events = require("events");

var chars = "node.js";

var emitter = new events.EventEmitter();

emitter.id = 0;
emitter.data = "";
emitter.start = function() {
  var self = this;
  setInterval(function() {
    var pos = Math.floor(Math.random() * chars.length * 2); 
    if (pos < chars.length) {
      self.id++;
      self.data = chars.charAt(pos);
      self.emit("generated", self.id, self.data);
    }
  }, 1000);
};

module.exports = emitter; 
