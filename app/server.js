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

 app.get('/main', function(req, res) {
  // res.send('Display Terminology');
  res.render('terms/manage');
 });

 app.get('/add_term', function(req, res) {
  // res.send('Adding Terminology');
  res.render('./terms/create');
 });

 app.get('/edit_term', function(req, res) {
  res.send('Edit Terminology');
 });

 app.get('/del_term', function(req, res) {
  res.send('Delete Terminology');
 });

 app.get('/test_term', function(req, res) {
  res.send('Testing Terminology');
 });

 app.get('/test_def', function(req, res) {
  res.send('Testing Definition');
 });


//  app.get('/who/:name?', function(req, res) {
//   var name = req.params.name;
//   res.send(name + ' was here');
//  });

// app.get('/who/:name?/:title?', function(req, res) {
//   var name = req.params.name;
//   var title = req.params.title;
//   res.send('<p>name: ' + name + '<br>title: ' + title);
//  });

 app.get('*', function(req, res) {
  res.send('Bad Route');
 });

 // var server = app.listen(3000, function() {
 //  console.log('Listening of port 3000');
 // });
 
 module.exports.app = app;