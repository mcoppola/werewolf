var util = {},
	request = require('request'),
	async = require('async');


util.getDMChannelFromUser = function(userId, token, callback) {

	request.get({ 
		uri: 'https://slack.com/api/im.open',
		qs: {
			token: token,
			user: userId
		}
	}, function(e, res){
		return callback(e, JSON.parse(res.body).channel.id);
	});
}

util.getDMChannels = function(userIds, token, callback) {

	var dmChannels = {}
	async.each(userIds, function(id, callback) {
		this.getDMChanellFromUser( id, token, function(dmId) {
			dmChannels[id] = dmId;
			return callback(null)
		});	
	}, function(err){
		if (err) return callback(err);
		return callback(null, dmChannels);
	});
}

module.exports = util;