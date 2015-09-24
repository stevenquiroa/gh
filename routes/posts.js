var express = require('express')
var router = express.Router()

const Post = require('../models/posts')
const PostModel = new Post()

/* GET home page. */
router.post('/', function(req, res) {
	if (!req.response.auth) res.status(403).json({})
	// console.log('req.body', req.body)
	var request = req.body; request.auth = req.response.auth
	PostModel.save(req.body, function (err, response){
		if (err) {
			res.status(400).json(response) 
		}else {
			res.status(200).json(response)
		}
	})
})

module.exports = router
