// import package
var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

//create user
//require('./routes/enrollAdmin.js')
//require('./routes/registerUser.js')

// routing
var index = require('./routes/index')
var register = require('./routes/register')
var addUserInfo = require('./routes/addUserInfo')
var addFinished = require('./routes/addFinished')

var app = express()
app.use(session({
    secret: 'my-special-secret',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie:{
        maxAge:1000*60*60
    }
}))
app.use(express.static("public"))
app.use(logger('dev'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Body ParserでURLエンコーディングとJSONエンコーディングをONにするもの
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// route
app.use('/', index)
app.use('/register', register)
app.use('/addUserInfo', addUserInfo)
app.use('/addFinished', addFinished)

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
});

/*
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
*/
var server = app.listen(3200, function(){
    console.log("Node.js is listening to PORT:" + server.address().port)
})

module.exports = app