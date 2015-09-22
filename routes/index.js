var express = require('express')
// var auth = require('../helpers/auth')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', req.response)
})


router.get('/upload', function (req, res) {
	console.log(req.response)
	if(!req.response.auth) return res.redirect('/auth/')
	res.redirect('/users/')
})
module.exports = router
