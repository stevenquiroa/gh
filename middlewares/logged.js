var redis = require('redis')

function getSession (key, callback) {
	var client = redis.createClient()
	var user = key[0] + key[1]

	client.on("error", function(err){
		throw err
	})

	client.hgetall(user, function (err, reply) {
		if (err) throw err
		callback(reply)	
	})
}

function logged(req, res, next){
	if (!req.cookies.NESSION) {
		req.response.auth = null
		next()
	} else {
		var session = new Buffer(req.cookies.NESSION, 'base64').toString("ascii")
		var key = session.split(":")
		if (key.length < 3) res.clearCookie('NESSION')
		getSession(key, function (response) {
			if (!response && key.length < 4) res.clearCookie('NESSION')
			req.response.auth = response
			next()
		})
	}
}		
module.exports = logged