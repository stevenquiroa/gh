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

router.post('/login', function(req, res) {
	if (!req.body) throw 'Body no existe'
	var session = new Buffer(req.cookies.NESSION, 'base64').toString("ascii")
	var key = session.split(":")
	if (key[0] + key[1] === req.body.social + req.body.id){
		var user = req.body
		user.token = key[2]
		UserModel.createIfNotExist(user,function (response) {
			UserModel.setSession(response.data)
			res.status(response.status).json(response.data)
		})
	} else {
		throw 'Error en autenticacion' 
		res.status(400).json({error:'Error en autenticacion'})
	}
})

module.exports = router