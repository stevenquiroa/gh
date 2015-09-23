var express = require('express')
var router = express.Router()

// var Busboy = require('busboy')
// const Post = require('../models/posts')
// const PostModel = new Post()
var busboy = require('connect-busboy')
var	path = require('path')
var os = require('os')
var fs = require('fs')

router.use(busboy())

router.post('/', function(req, res) {
	console.log('busboy')
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    	console.log(fieldname, file, filename, encoding, mimetype)
		var saveTo = path.join(__dirname, '..', 'public', 'images', path.basename(filename))
    	console.log(saveTo)
		file.pipe(fs.createWriteStream(saveTo))
		file.on('end', function(){
			var response = {}
			response.url = 'http://localhost:3000/images/' + path.basename(filename)
			response.saveIn = saveTo
			response.mimetype = mimetype
    		res.status(200).json(response)
		})
    })

	req.pipe(req.busboy)

    // req.busboy.on('finish', function() {
    // 	res.status(200).json({message:true})
    // });
	// if (!req.response.auth) res.status(403).json({})
 })

module.exports = router
