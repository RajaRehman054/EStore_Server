var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var Item = require('../models/item');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');
router.use(bodyParser.json());

router.post('/signup', (req, res, next) => {
	User.register(
		new User({
			username: req.body.username,
			name: req.body.name,
			email: req.body.email,
		}),
		req.body.password,
		(err, user) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({ err: err });
				return;
			} else {
				user.save((err, user) => {
					if (err) {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						res.json({ err: err });
						return;
					}
					passport.authenticate('local')(req, res, () => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({
							success: true,
							status: 'Registration Successful!',
						});
					});
				});
			}
		}
	);
});

router.post('/login', passport.authenticate('local'), (req, res) => {
	var token = authenticate.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({
		success: true,
		token: token,
		status: 'You are successfully logged in!',
		user: req.user,
	});
});

router.get('/items', function (req, res, next) {
	Item.find({}).exec(function (error, results) {
		if (error) {
			return next(error);
		}
		res.json(results);
	});
});

router.get('/user', cors.cors, authenticate.verifyUser, function (req, res) {
	res.json(req.user);
});

router.post(
	'/loginadmin',
	passport.authenticate('local'),
	authenticate.verifyAdmin,
	(req, res) => {
		var token = authenticate.getToken({ _id: req.user._id });
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({
			success: true,
			token: token,
			status: 'You are successfully logged in!',
			user: req.user,
		});
	}
);

router.get(
	'/allusers',
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	function (req, res) {
		User.find({}).exec(function (error, results) {
			if (error) {
				return next(error);
			}
			res.json(results);
		});
	}
);

router.delete(
	'/deleteuser/:id',
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	function (req, res) {
		User.deleteOne({ _id: req.params.id }, function (err, data) {
			if (err) throw err;
			res.json(data);
		});
	}
);

router.delete(
	'/deleteitem/:id',
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	function (req, res) {
		Item.deleteOne({ _id: req.params.id }, function (err, data) {
			if (err) throw err;
			res.json(data);
		});
	}
);

router.get(
	'/item/:id',
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	function (req, res, next) {
		Item.findById({ _id: req.params.id }).exec(function (error, results) {
			if (error) {
				return next(error);
			}
			res.json(results);
		});
	}
);

router.put(
	'/edititem/:id',
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	function (req, res, next) {
		Item.updateOne(
			{ _id: req.params.id },
			{
				price: req.body.price,
				category: req.body.cate,
				description: req.body.description,
				image: req.body.url,
				rating: req.body.rating,
				id: req.body.id,
				title: req.body.title,
			},
			function (err, data) {
				if (err) throw err;
				res.status(204).json(data);
			}
		);
	}
);

router.post(
	'/additem',
	authenticate.verifyUser,
	authenticate.verifyAdmin,
	(req, res) => {
		Item.create(
			{
				price: req.body.price,
				category: req.body.cate,
				description: req.body.description,
				image: req.body.url,
				rating: req.body.rating,
				id: req.body.id,
				title: req.body.title,
				rating: req.body.rating,
			},
			function (err, data) {
				if (err) console.log(err);
				res.status(201).json({ success: true });
			}
		);
	}
);

module.exports = router;
