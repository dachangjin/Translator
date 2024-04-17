var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var googleTranslateRouter = require('./routes/googleTranslate')
var tencentTranslateRouter = require('./routes/tencentTranslate')
var msTranslateRouter = require('./routes/msTranslate')
var deeplTranslateRouter = require('./routes/deeplTranslate')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/googleTranslate', googleTranslateRouter)
app.use('/tencentTranslate', tencentTranslateRouter)
app.use('/msTranslate', msTranslateRouter)
app.use('/deeplTranslate',deeplTranslateRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.post('/translate', (req, resp) => {
  translationClient.translateText(req.body)
    .then((res) => {
      resp.json(res)
    })
    .catch((err) => {
      console.error('Translation error:', error);
      resp.status(500).json({ error: 'An error occurred during translation' });
    })
})

module.exports = app;
