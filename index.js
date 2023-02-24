var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var mainRouter = require('./routes/main');
var passport = require('passport');
var cors = require('cors');
var app = express();
require('dotenv').config();

const connection = mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
app.listen(process.env.PORT || 5000, () => {
	console.log('Running on port 4000.');
});
connection.then(
	db => {
		console.log('Connected correctly to server');
	},
	err => {
		console.log(err);
	}
);
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', mainRouter);

app.use(function (req, res, next) {
	next(createError(404));
});

app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.json({ err: err });
});
