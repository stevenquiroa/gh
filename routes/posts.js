var express = require('express')
var router = express.Router()

const Post = require('../models/posts')
const PostModel = new Post()

/* GET home page. */
router.get('/', function (req, res) {
	console.log(req.query, req.body)
	var limit = (req.query.limit) ? req.query.limit : 5
	if (!req.query.page) {res.status(500).json({error:'El numero de pagina no está seteado.'}); return;}
	PostModel.list(req.query.page, limit, function (err, result) {
		console.log(err, result)
		if (err) res.status(500).json({error:err});
		else res.status(200).json(result);
	})
})

router.post('/', function(req, res) {
	if (!req.response.auth) res.status(403).json({})
	var files = req.body.files
	delete req.body.files
	PostModel.save(req.response.auth, req.body, files, function (err, response){
		console.log('response')
		if (err) {
			res.status(400).json({error:err});
		}else {
			res.status(200).json(response);
		}
	})
})

router.get('/list', function (req, res) {
	var limit = (req.query.limit) ? req.query.limit : 5
	req.response.title = 'Timeline'
	PostModel.list(null, limit, function (err, result) {
		if (err) req.render('posts/error', err).end()
		req.response.posts = result
		res.render('posts', req.response)
	})
})
module.exports = router
