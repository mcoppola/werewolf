var slack = require('./slack'),
	Message = require('../node_modules/slack-client/src/message'),
	request = require('request'),
	util = require('./util');


function Werewolf () {
	var self = this;

	self.modId = '<@U03FCM32C>';
	self.slackChannel = undefined;

	self.listen();
}

Werewolf.prototype.command = function(message, user) {
	var self = this;

	switch(message) {
		case 'hello':
			self.say('hello ' + user);
			break;
		case 'new game':
			self.say('ok');
			break;
		default:
			self.say("I'm a werefolf myself");
	}
};

// Slack listener
Werewolf.prototype.listen = function() {
	var self = this;

	slack.on('message', function(message) {

		var type = message.type,
		    channel = slack.getChannelGroupOrDMByID(message.channel),
		    user = slack.getUserByID(message.user),
		    name = user = slack.getUserByID(message.user),
		    time = message.ts,
		    text = message.text || '';

		
		// Pinged in #werewolf channel?
		if (type === 'message' && (text.indexOf(self.modId) >= 0 || text.toLowerCase().indexOf('ww') == 0)) {

			self.slackChannel = channel;

			self.command(text.indexOf(self.modId) == 0 ? text.split(': ').pop() : text.split(' ' + self.modId)[0], user.name);
		}

	});

};

Werewolf.prototype.say = function(message) {
	var self = this;

	var m = new Message(self.slackChannel._client, { channel: self.slackChannel.id, text: message});
	self.slackChannel._client._send(m);
};


module.exports = new Werewolf();