var User = require("../models/userModel.js");

function loginUser(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	User.findOne({ email: email })
		.then(function(user) {
			if (user == null) {
				res.json({status: 401, data: "unauthorized at loginUser"})
			}
			else if (password === user.password) {
				req.session.currentUser = user;
			}
			next();
		})
		.catch(function(err) {
			res.json({status: 500, data: err});
		});
};








module.exports = {
	loginUser: loginUser
};