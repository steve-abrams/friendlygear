var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');

require('dotenv').load();

var routes = require('./routes/index');
var users = require('./routes/users');
var items = require('./routes/items');
var contracts = require('./routes/contracts');
var auth = require('./routes/auth');
var categories = require('./routes/categories');

var app = express();

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY1, process.env.SESSION_KEY2, process.env.SESSION_KEY3]
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


app.use('/', function (req, res, next) {
  if (req.session.user){
    res.locals.user_id = req.session.user;
  }
  next();
});

app.use('/', routes);
app.use('/', auth);
app.use('/', users);
app.use('/', categories);

app.use('/users/:userId', function (req, res, next) {
  res.locals.owner_id = req.params.userId;
  next();
}, items);

app.use('/users/:userId/items/:itemId', function (req, res, next) {
  res.locals.owner_id = req.params.userId;
  res.locals.item_id = req.params.itemId;
  next();
}, contracts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

if(app.get('env') === 'production') {
  app.listen(3000);
}

module.exports = app;
