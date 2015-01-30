var slack = require('./slack'),
	Message = require('../node_modules/slack-client/src/message'),
	request = require('request'),
	util = require('./util');
	util.slack = slack;



function Werewolf () {
	var self = this;

	self.modId = '<@U03FCM32C>';
	self.werewolfChannel = undefined;  // #werefolf channel

	self.game = {
		state: {
			playing: false
		}
	}

	self.listen();
}

Werewolf.prototype.command = function(message, user, channel) {
	var self = this;
	var options = {};

	switch(message) {
		case 'hello':
		case self.modId + ':':
			self.say('hello ' + user, channel);
			break;
		case 'new game':
			self.newGame();
			break;
		case util.parseCommandArgs('kill', message, options):
			self.say('I will eat ' + options.args[0], channel);
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
		    time = message.ts,
		    text = message.text || '';

		
		// Pinged in #werewolf channel?
		if (type === 'message' && (text.indexOf(self.modId) >= 0 || text.indexOf('ww') >= 0 )) {

			if (channel.name == 'werewolf' && !self.werewolfChannel) self.werewolfChannel = channel;

			self.command(util.parseCommandFromMessage(text, self.modId), user.name, channel);
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


// ------------------------------------------------------------------ //
//   GAME
// ------------------------------------------------------------------ //

Werewolf.prototype.newGame = function() {
	var self = this;

	if (self.game.state.playing) { return self.say('A game is already in progress') }
	else { self.say('Ok') }

	if (!self.werewolfChannel) { return self.say('We need to be in the #werewolf channel') }

	// 1.  Get the users in the #werewolf Channel
	var users = util.getUsersInChannel(self.werewolfChannel);

	// 2.  Get their usernames
	var usernames = [];
	for (var i = Object.keys(users).length - 1; i >= 0; i--) {
		usernames.push(users[Object.keys(users)[i]].name);
	};

	self.say('Users in the channel right now:');
	self.say(usernames.toString());

};

module.exports = new Werewolf();