const conf = require('../conf')
const validator = require('validator')
const FB = require('fb')
const redis = require('redis')
const db = require('seraph')({
	user : conf.neo.user,
	pass : conf.neo.pass
})

var User = function (conf){
	conf = conf || {}
}

User.prototype.validateUser = function (user, callback) {
	var response = { success : true , errors : [], user : {}} 
	response.user.social = validator.escape(user.social)
	response.user.role = 'normal'

	if (user.social == 'fb') {
		FB.setAccessToken(user.token)
		FB.api('/me', {fields : ['id', 'name', 'email']}, function (res) {
			if (res.error) {
				response.success = false
				response.errors.push(res.error)
				callback(response)
			}
			response.user.social_id = validator.toInt(res.id)
			response.user.name = validator.escape(res.name)
			response.user.username = validator.normalizeEmail(res.email)
			callback(response)
		})
	} else if (user.social == 'tw') {
		response.user.username = validator.escape(user.username)
	}
	// return response
}

User.prototype.destroySession = function (user, callback){
	client = redis.createClient()
	client.on("error", function (err) {
		if (err) throw err
	})
	// if (!user.social_id) throw 'Error in user: ' + user
	client.del(user.social + user.id, function (err, res) {
		var response = {}
		if (err) {
			response.data = err
			response.status = 400
		} else {
			response.data = res
			response.status = 200
		}
		callback(response)
	})	
}

User.prototype.setSession = function (user){
	client = redis.createClient()
	client.on("error", function (err) {
		if (err) throw err
	})
	if (!user.social_id) throw 'Error in user: ' + user
	client.hmset(user.social + user.social_id, user, redis.print)	
}

User.prototype.get = function(username, callback){
	db.find({username : username}, true, 'Person', function(err, node) {
		if (err) throw err 
		console.log(node)
		callback(node[0])
	})
}

User.prototype.list = function(callback){
	var response = []
	db.find({}, 'Person', function(err, nodes){
		console.log(nodes)
		callback(nodes)		
		// console.log(response)
	})
}

User.prototype.handlerCreateIfNotExist = function (err, node, response) {
	if (err) {
		response.status = 500
		response.data = {errors:err}
	} else {
		response.data = node
		// self.setSession(node)			
	} 
	return response
}

User.prototype.createIfNotExist = function (user, callback) {
	var self = this
	var response = {status:200}
	self.validateUser(user, function (vResponse) {
		if (!vResponse.success) {
			response.status = 400
			response.data = vResponse.errors
			callback(response)
		}
		db.find({social_id:vResponse.user.social_id}, true, 'Person', function (err, nodes) {
			if (err) throw err
			console.log(nodes)
			if (nodes && nodes.length == 0) {
				db.save(vResponse.user, 'Person', function (err, node) {
					response = self.handlerCreateIfNotExist(err, node, response)
					callback(response)
				})				
			}else{
				for (var k in vResponse){
					if (typeof vResponse[k] !== 'function') {
						nodes[0][key] = vResponse[key]
				    }
				}
				db.save(nodes[0], function (err, node) {
					response = self.handlerCreateIfNotExist(err, node, response)
					callback(response)
				})
			}
		})
	})
}

module.exports = User