var util = {},
	request = require('request');




util.getDMChannelFromUser = function(userId, token, callback) {

	request.get({ 
		uri: 'https://slack.com/api/im.open',
		qs: {
			token: token,
			user: userId
		}
	}, function(e, res){
		if (!e) {
			return callback(JSON.parse(res.body).channel.id);
		} else {
			console.log(JSON.parse(e));
			return null;
		}
		
	});
}

module.exports = util;