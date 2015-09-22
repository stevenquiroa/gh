var express = require('express')
var router = express.Router()

var User = require('../models/users')
var UserModel = new User()

/* GET home page. */
router.get('/', function(req,res){
	req.response.title = 'Login'
	console.log(req.response)
	res.render('auth/index', req.response)
})

router.post('/session', function(req, res) {
	// if (!req.body) throw 'Body no existe'
	var session = new Buffer(req.cookies.NESSION, 'base64').toString("ascii")
	var key = session.split(":")
	var user = {id : key[1],social : key[0],token : key[2]}
	UserModel.createIfNotExist(user,function (response) {
		if (response.status == 200) UserModel.setSession(response.data)
		res.cookie('NESSION', new Buffer(key[0] + ':' + key[1] + ':' + key[2]).toString('base64'))
		res.status(response.status).json(response.data)
	})
})

router.delete('/session', function(req, res) {
	var session = new Buffer(req.cookies.NESSION, 'base64').toString("ascii")
	var key = session.split(":")
	var user = {id : key[1],social : key[0],token : key[2]}
	UserModel.destroySession(user, function (response) {
		if (response.status == 200) res.clearCookie('NESSION')
		res.status(response.status).json(response.data)
	})
})

module.exports = router