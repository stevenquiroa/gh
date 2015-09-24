const conf = require('../conf')
const validator = require('validator')
const waterfall = require('async-waterfall')
const db = require('seraph')({
	user : conf.neo.user,
	pass : conf.neo.pass
})

var File = function (conf){
	conf = conf || {}
}

function validate (file, callback) {
	// for (var i = 0; i < post.files.length; i++) {
	console.log('file validate')
	var err;
	var filePost = {}
	if (validator.isURL(file.url)) filePost.url = file.url; else err = "Error in file url"
	if (file.mimetype) filePost.mimetype = validator.toString(file.mimetype); else err = "Error in file mimetype"
	if (file.path) filePost.path = validator.toString(file.path); else err = "Error in file path"
	if (file.saveIn) filePost.saveIn = validator.toString(file.saveIn); else err = "Error in file saveIn"

	callback(err, filePost)
}
function create (file, callback){
	var response = {}
	console.log('file create')
	db.save(file, 'File', function(err, node){
		if (err) callback(err, file)
		console.log('saved file')
		response.data = file
		response.file = node
		callback(err, response, 'done')
	})
}

File.prototype.save = function(file, callback) {
	console.log('file save')
	waterfall([
		function(callback){callback(null, file)},
		validate,
		create
	], function (err, result) {
		if (err) callback(err);
		else callback(err, result.file);
	})

}

module.exports = new File()