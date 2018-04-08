// import package
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// routing
var index = require('./routes/index');
var users = require('./routes/users');
var toppage = require('./routes/toppage');
var borrow = require('./routes/borrow');
var approve = require('./routes/approve');
var confirm = require('./routes/confirm');
var makeBorrowApplication = require('./routes/makeBorrowApplication');
var setupPeerAndOrderer = require('./routes/setupPeerAndOrderer');
var queryApplication = require('./routes/queryApplication');
var register = require('./routes/register');
var login = require('./routes/login');
var showApplicationStatus = require('./routes/showApplicationStatus');
var endorse = require('./routes/endorse');
var queryAll = require('./routes/queryAll');
var logout = require('./routes/logout');
var delConfirmList = require('./routes/delConfirmList');
var inputDelConfirm = require('./routes/inputDelConfirm');
var confirmDel = require('./routes/confirmDel');
var delConfirmApproval = require('./routes/delConfirmApproval');
var makeDelConfirm = require('./routes/makeDelConfirm');
var exchangeList = require('./routes/exchangeList');
var exchange = require('./routes/exchange');
var exchangeConfirm = require('./routes/exchangeConfirm');
var exchangeApproval = require('./routes/exchangeApproval');
var makeExchangeApplication = require('./routes/makeExchangeApplication');
var setRoute = require('./routes/setRoute')
var selectSystemNo = require('./routes/selectSystemNo')
var showStockManagement = require('./routes/showStockManagement')
var refferCurrentBlock = require('./routes/refferCurrentBlock')
var history = require('./routes/history')

/*
require('./routes/enrollAdmin.js')
require('./routes/registerUser.js')
*/

require('./routes/util/org.js');

var app = express();
var session_opt = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxaAge: 60 * 60 * 1000 }
};

app.use(express.static("public"));
app.use(session(session_opt));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Body ParserでURLエンコーディングとJSONエンコーディングをONにするもの
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', toppage);
app.use('/users', users);
app.use('/setupPeerAndOrderer', setupPeerAndOrderer);
app.use('/queryApplication', queryApplication);
app.use('/borrow', borrow);
app.use('/approve', approve);
app.use('/confirm', confirm);
app.use('/makeBorrowApplication', makeBorrowApplication);
app.use('/register', register);
app.use('/login', login);
app.use('/showApplicationStatus', showApplicationStatus);
app.use('/endorse',endorse);
app.use('/queryAll',queryAll);
app.use('/logout',logout);
app.use('/delConfirmList',delConfirmList);
app.use('/inputDelConfirm',inputDelConfirm);
app.use('/confirmDel',confirmDel);
app.use('/delConfirmApproval',delConfirmApproval);
app.use('/makeDelConfirm',makeDelConfirm);
app.use('/exchangeList',exchangeList);
app.use('/exchange',exchange);
app.use('/exchangeConfirm',exchangeConfirm);
app.use('/exchangeApproval',exchangeApproval);
app.use('/makeExchangeApplication', makeExchangeApplication);
app.use('/setRoute',setRoute);
app.use('/selectSystemNo',selectSystemNo)
app.use('/showStockManagement',showStockManagement)
app.use('/refferCurrentBlock',refferCurrentBlock)
app.use('/history',history)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var server = app.listen(3200, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

module.exports = app;