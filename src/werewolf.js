var slack = require('./slack'),
	Message = require('../node_modules/slack-client/src/message'),
	request = require('request'),
	util = require('./util'),
	command = require('./command');
	util.slack = slack;



function Werewolf () {
	var self = this;

	self.modId = '<@U03FCM32C>';
	self.werewolfChannel = undefined;  // #werefolf channel
	self.dmChannel = undefined;		
	self.onlyWerefolfChannel = false;

	self.game = {
		state: {
			playing: false
		}
	}

	self.listen();
}

Werewolf.prototype.command = function(options) {
	var self = this;
	var cmd = new command(options);

	switch(cmd.message) {
		case 'hello':
		case self.modId + ':':
		case 'ww':
			self.say('hello ' + user, cmd.channel);
			break;
		case 'new game':
			self.newGame(cmd);
			break;
		case cmd.parseArgs('kill'):
			self.say('I will eat ' + cmd.args[0], cmd.channel);
			break;
		default:
			self.say("I am a werefolf.", cmd.channel);
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
			else self.dmChannel = channel;

			self.command({message: util.parseCommandFromMessage(text, self.modId), user: user.name, channel: channel});
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

Werewolf.prototype.newGame = function(source) {
	var self = this;

	if (self.game.state.playing) { return self.say('A game is already in progress') }
	else { self.say('Ok', source.channel) }

	if (self.onlyWerefolfChannel && !self.werewolfChannel) { return self.say('We need to be in the #werewolf channel') }

	// 1.  Get the user in the channel
	var users = util.getUsersInChannel(source.channel);

	// 2.  Get their usernames
	var usernames = [];
	for (var i = Object.keys(users).length - 1; i >= 0; i--) {
		usernames.push(users[Object.keys(users)[i]].name);
	};

	self.say('Users in the channel right now:', source.channel);
	self.say(usernames.toString(), source.channel);

};

module.exports = new Werewolf();