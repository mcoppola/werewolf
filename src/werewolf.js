var slack = require('./slack'),
	Message = require('../node_modules/slack-client/src/message'),
	request = require('request'),
	util = require('./util');


function Werewolf () {
	var self = this;

	self.modId = '<@U03FCM32C>';
	self.werewolfChannel = undefined;  // #werefolf channel

	self.listen();
}

Werewolf.prototype.command = function(message, user, channel) {
	var self = this;

	switch(message) {
		case 'hello':
			self.say('hello ' + user, channel);
			break;
		case 'new game':
			self.say('ok', channel);
			break;
		default:
			self.say("I am a werefolf.", channel);
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
		if (type === 'message' && (text.indexOf(self.modId) >= 0)) {

			if (channel.name == 'werewolf' && !self.werewolfChannel) self.werewolfChannel = channel;

			self.command(text.indexOf(self.modId) == 0 ? text.split(': ').pop() : text.split(' ' + self.modId)[0], user.name, channel);
		}

	});

};

Werewolf.prototype.say = function(message, channel) {
	var self = this;

	// Default channel to #werewolf room if not supplied
	if (channel === undefined) { channel = self.werewolfChannel }

	var m = new Message(channel._client, { channel: channel.id, text: message});
	channel._client._send(m);
};


module.exports = new Werewolf();