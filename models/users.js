const conf = require('../conf')
const db = require('seraph')({
	user : conf.neo.user,
	pass : conf.neo.pass
})

var User = function (conf){
	conf = conf || {}
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


module.exports = User