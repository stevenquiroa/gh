const conf = require('../conf')
const validator = require('validator')
const waterfall = require('async-waterfall')
const db = require('seraph')({
	user : conf.neo.user,
	pass : conf.neo.pass
})

var Post = function (conf){
	conf = conf || {}
}

function validate (user, post, files, callback) {
	var err
	var response = {}
	response.data = {}

	response.data.title = validator.escape(post.title) 
	response.data.social = validator.escape(post.social)
	if (validator.isURL(post.source)) response.data.source = post.source; else err = "Error in source"
	if (!user) err = 'Error in auth'

	response.data.timestamp = Date.now()
	callback(err, user, response.data, files)
}

function postToFiles (post, files, callback) {
	console.log('postToFiles')
	console.log(files)
	if (files.length > 0){
		var count = 0
		for (var i = 0; i < files.length; i++) {
			db.relate(post.id, 'IN', files[i].id, {count:i}, function (err, relFile) {
				count++
				// console.log(relFile.properties.count, files.length, count)
				if (err || count == files.length) callback(err, post, 'done');
			})
		}
	}else{
		callback(null, post, 'done')
	}
}

function userToPost (user, post, files, callback) {
	console.log('userToPost')
	db.relate(user.id, 'CREATER', post.id, function(err, rel){
		callback(err, post, files)
	})
}

function create (user, post, files, callback) {
	console.log('create')
	db.save(post, 'Post', function (err, node) {
		console.log('saved post')
		callback(err, user, node, files)
	})
}

Post.prototype.save = function (user, post, files, callback) {
	var self = this
	var response = {}
	waterfall([
		function (callback) {callback(null, user, post, files)},
		validate,
		create,
		userToPost,
		postToFiles
	],function (err, result) {
		console.log('finish', err)
		if (err != null && typeof err == 'object') err = "Problem in database: " + err.code
		callback(err, result)
	})
}

Post.prototype.list = function(page, limit ,callback) {
	page = (page) ? page * limit : 0
	var cypher = 'MATCH (n:Person)-[r:CREATER]->(p:Post) '
			+ 'WHERE HAS(p.timestamp) '
			+ 'Return DISTINCT p, n, r '
			+ 'ORDER BY p.timestamp DESC '
	cypher += 'SKIP ' +  page + ' '
	cypher += 'LIMIT ' + limit
	cypher += ';'

	db.query(cypher, function (err, result) {
		callback(err, result)
	})
}
module.exports = Post