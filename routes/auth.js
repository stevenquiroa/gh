var express = require('express')
var router = express.Router()

var Article = require('../models/users')
var model = new Article()

var response = {
	title: 'Authorization', 
	partials : {
  		layout : 'base'
  	}
}

/* GET home page. */
router.get('/login', function(req, res, next) {
	model.list(function(users) {
	  	response.users = users
	  	res.render('users/index', response)
	})
})

router.get('/register', function(req, res, next) {
	var username = req.params.user
	if (!username) return next()

	model.get(username,function (user) {
		// response.username = user
		console.log(user)
		response.user = user
		res.render('users/show', response)
	})
})

module.exports = router