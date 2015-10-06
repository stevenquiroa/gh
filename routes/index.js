var express = require('express')
// var auth = require('../helpers/auth')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', req.response)
})

router.get('/upload', function (req, res) {
	if(!req.response.auth) return res.redirect('/auth/')
	req.response.title = 'Upload post'
	res.render('posts/post', req.response)
})

module.exports = router
