var log = require('./read_logger');
var fs = require('fs');

log.setWritableStream(process.stdout);
log.start();
