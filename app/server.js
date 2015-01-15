 var express = require('express');
 var app = express();

app.use(express.static('./public'));
app.set('view engine', 'jade');
// to specify other than views folder:
// __dirname is global var for current dir path where server.js is located
// ap.set('views', __dirname + '/includes');

 app.get('/', function(req, res) {
  // res.send('<h1>Hello</h1> Express');
  res.render('index', 
    {
      title: "GrokIt",
      header: "Welcome!!",
      names: ['one', 'two', 'three', 'four', 'five']
    });
 });

 app.get('/me', function(req, res) {
  res.send('@planetoftheweb');
 });

 app.get('/who/:name?', function(req, res) {
  var name = req.params.name;
  res.send(name + ' was here');
 });

app.get('/who/:name?/:title?', function(req, res) {
  var name = req.params.name;
  var title = req.params.title;
  res.send('<p>name: ' + name + '<br>title: ' + title);
 });

 app.get('*', function(req, res) {
  res.send('Bad Route');
 });

 // var server = app.listen(3000, function() {
 //  console.log('Listening of port 3000');
 // });
 
 module.exports.app = app;