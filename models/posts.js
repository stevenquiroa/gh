const conf = require('../conf')
const validator = require('validator')
const redis = require('redis')
const db = require('seraph')({
	user : conf.neo.user,
	pass : conf.neo.pass
})

var Post = function (conf){
	conf = conf || {}
}

Post.prototype.validate = function (post, callback) {
	callback(post)
}

Post.prototype.save = function (post, callback) {
	var self = this
	var response = {}

	self.validate(post, function(response){
		callback(response)
	})
}
module.exports = Post