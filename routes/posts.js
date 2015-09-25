var express = require('express')
var router = express.Router()

const Post = require('../models/posts')
const PostModel = new Post()

/* GET home page. */
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

module.exports = router
