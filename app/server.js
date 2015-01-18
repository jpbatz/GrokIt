var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var config = require('./config');

// MIDDLEWARE

app.use(express.static('./public'));
app.set('view engine', 'jade');
// to specify other than views folder:
// __dirname is global var for current dir path where server.js is located
// ap.set('views', __dirname + '/includes');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// DB CONNECTION
mongoose.connect(config.databaseURI);

// MODELS
var termSchema = mongoose.Schema({
  term: String,
  definition: String,
  notes: String,
  sites: [String], // need code to add multiple sites
  date: Date
});

var Term = mongoose.model('Term', termSchema);


// ROUTES

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
  Term.find(function(err, terms) {
    if(err) {
      throw err;
    } else {
      var locals = {
        stuff : terms,
        count : terms.length
      };
      // res.send('Display Terminology');
      res.render('./terms/manage', locals);
    }
  });
});

app.get('/add_term', function(req, res) {
  // res.send('Adding Terminology');
  res.render('./terms/create');
});

// create term
app.post('/create_term', function(req, res) {
  var newTerm = Term({
    "term" : req.body.term,
    "definition" : req.body.definition,
    "notes" : req.body.notes,
    "sites" : req.body.sites,
    "date" : new Date()
  });

  newTerm.save(function(err) {
    if (err) {
      throw err;
    }
    else {
      res.redirect('/main'); // Can't pass locals in to redirect
    }
  });
});

app.get('/view_term/:id', function(req, res) {
  Term.find({
    "_id" : req.params.id
  }, function(err, terms) {
    if(err) {
      throw err;
    } else {
      var locals = {
        stuff : terms[0]
      };
      res.render('./terms/view', locals);
    }
  });
});

app.get('/edit_term/:id', function(req, res) {
  Term.find({
    "_id" : req.params.id
  }, function(err, terms) {
    if(err) {
      throw err;
    } else {
      var locals = {
        stuff : terms[0]
      };
      res.render('./terms/edit', locals);
    }
  });
});

app.put('/update_term/:id', function(req, res) {
  Term.update(
    {
      "_id" : req.params.id
    }, 
    {
      "term" : req.body.term,
      "definition" : req.body.definition,
      "notes" : req.body.notes,
      "sites" : req.body.sites
    }, function(err) {
      if(err) {
        throw err;
      } else {
        res.redirect('/view_term/' + req.params.id);
      }
    }
  );
});

app.delete('/delete_term/:id', function(req, res) {
  Term.remove(
  {
    "_id" : req.params.id
  },
  function(err) {
    if(err) {
      throw err;
    } else {
      res.redirect('/main');
    }
  });
});

app.get('/test_term', function(req, res) {
  res.send('Testing Terminology');
});

app.get('/test_def', function(req, res) {
  res.send('Testing Definition');
});

app.get('*', function(req, res) {
  res.send('Bad Route');
});

// var server = app.listen(8080, function() {
//  console.log('Listening of port 8080');
// });

module.exports.app = app;