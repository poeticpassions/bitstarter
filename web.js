var express = require('express');
var fs = require('fs');
var fileContentStr = '';
fs.readFile('./index.html', function (err, data) {
  if (err) throw err;
  console.log ('file contents: ' + data.toString());
  fileContentStr = data.toString();
//  response.send(data.toString());
});



var app = express.createServer(express.logger());
console.log ('hello');
app.get('/', function(request, response) {

//img local
app.use(express.static('/home/ubuntu/bitstarter'));

response.send(fileContentStr);
/*fs.readFile('./index.html', function (err, data) {
  if (err) throw err;
console.log ('file contents: ' + data.toString());
  response.send(data.toString());
});
*/
//  response.send('Hello World 2!');
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
