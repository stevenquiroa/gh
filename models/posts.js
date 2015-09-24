const conf = require('../conf')
const validator = require('validator')
const db = require('seraph')({
	user : conf.neo.user,
	pass : conf.neo.pass
})

var Post = function (conf){
	conf = conf || {}
}

function validate (post, callback) {
	var err
	var response = {}
	response.data = {}
	response.error = [] 
	response.files = []
	response.user = post.auth

	response.data.title = validator.escape(post.title) 
	response.data.social = validator.escape(post.social)
	if (validator.isURL(post.source)) response.data.source = post.source; else response.error.push("Error in source")
	if (!response.user) response.error.push('Error in auth')
	if (response.error.length > 0) err = response.error[0]
	response.files = post.files
	callback(err, response)
}

function postToFiles (post, files, callback) {
	console.log()
	var filesRel = []
	for (var i = 0; i < files.length; i++) {
		db.relate(post.id, 'IN', files[i].id, function (err, relFile) {
			filesRel.push(relFile)
			if (err || i >= files.length) callback(err, filesRel);
		})
	}
}

function userToPost (user, post, callback) {
	console.log('userToPost')
	db.relate(user.id, 'CREATER', post.id, callback)
}

function create (post, callback) {
	console.log('create')
	db.save(post.data, 'Post', function (err, node) {
		console.log('saved post')
		post.post = node
		if (err) {
			post.error.push(err)
			callback(err, post)
		}
		userToPost(post.user, node, function (err, rel) {
			if (err) post.error.push(err)
			post.relationship = rel
			postToFiles(node, post.files, function (err, files) {
				if (err) post.error.push(err)

				post.relFiles = files
				callback(err, post)
			})	
		})
	})
}

Post.prototype.save = function (post, callback) {
	var self = this
	var response = {}

	validate(post, function(err, validatePost){
		if (err) callback(err, validatePost)
		create(validatePost, function (err, response) {
			callback(err, response)
		})
	})
}
module.exports = Post