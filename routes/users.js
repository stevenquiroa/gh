var express = require('express')
var router = express.Router()

var User = require('../models/users')
var UserModel = new User()

/* GET home page. */
router.get('/', function(req, res, next) {
	req.response.title = 'Listado de Usuarios'
	UserModel.list(function(users) {
	  	req.response.users = users
	  	console.log(req.response)
	  	res.render('users/index', req.response)
	})
})

router.get('/:user', function(req, res, next) {
	var username = req.params.user
	if (!username) return next()

	req.response.title = 'Usuario: ' + username
	UserModel.get(username,function (user) {
		// response.username = user
		console.log(user)
		req.response.user = user
		res.render('users/show', req.response)
	})
})

module.exports = router