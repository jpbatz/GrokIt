// app/server.js
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
// var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var config = require('./config');

// MODELS External
// var Article = require('./models/article');
// var User = require('./models/user');

// MODELS
var termSchema = mongoose.Schema({
  term: String,
  definition: String,
  notes: String,
  sites: [String], // need code to add multiple sites
  date: Date
});

var Term = mongoose.model('Term', termSchema);

var userSchema = mongoose.Schema({
  name: {
    firstName: String,
    lastName: String
  },
  username: String,
  email: String,
  password: String
});

var User = mongoose.model('User', userSchema);

// DB CONNECTION
mongoose.connect(config.databaseURI);


// MIDDLEWARE
app.use(express.static('./public'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}));
// app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if(err) { return done(err); }
      if(!user) {
        return done(null, false, { message: 'Invalid username' });
      }
      if(!user.validPassword(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  User.findById(user._id, function(err, user) {
    done(null, user);
  });
});

// ROUTES

app.get('/', function(req, res) {
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
      res.render('./terms/main', locals);
    }
  });
});

app.get('/add_term', function(req, res) {
  // res.send('Adding Terminology');
  res.render('./terms/create');
});

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

app.get('/signup', function(req, res) {
  res.render('./auth/signup');
});

app.post('/create_account', function(req, res) {
  if(req.body.password !== req.body.password_confirm) {
    var locals = { message: 'Passwords do not match'
    };
    return res.render('./auth/create');
  }

  var newUser = User({
    "name" : { 
      firstName: req.body.first_name,
      lastName: req.body.last_name
    },
    "email" : req.body.email,
    "username" : req.body.username,
    "password" : User.hashPassword(req.body.password)
  });

  // newUser.save
  
});

app.get('/tutor_term', function(req, res) {
  res.send('Testing Terminology');
});

app.get('/tutor_def', function(req, res) {
  res.send('Testing Definition');
});

app.get('*', function(req, res) {
  res.send('Bad Route');
});

// require('/routes')(app, passport);
module.exports.app = app;