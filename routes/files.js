var express = require('express')
var router = express.Router()

var busboy = require('connect-busboy')
var uuid = require('uuid')
var	path = require('path')
var os = require('os')
var fs = require('fs')

var FileModel = require('../models/files')

router.use(busboy())

router.post('/', function(req, res) {
	if (!req.response.auth) res.status(403).json({})

    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		// console.log(count)
    	// console.log(fieldname, file, filename, encoding, mimetype)
    	var nameFile = path.basename(uuid.v4()) + path.extname(filename)
		var saveTo = path.join(__dirname, '..', 'public', 'images', nameFile)
    	// console.log(saveTo)
		file.pipe(fs.createWriteStream(saveTo))
		file.on('end', function(){
			var filePost = {}
			filePost.url = 'http://localhost:3000/images/' + nameFile
			filePost.path = '/images/' + nameFile
			filePost.saveIn = saveTo
			filePost.mimetype = mimetype
			filePost.original = path.basename(filename)
			FileModel.save(filePost, function (err, response) {
				if (err) res.status(500).json({error:err})
				else {
					console.log('archivo cargado')
					res.status(200).json(response)
				}
			})
		})
    })

	req.pipe(req.busboy)
 })

module.exports = router
