// This is a simple example of how to use the slack-client module. It creates a
// bot that responds to all messages in all channels it is in with a reversed
// string of the text received.
//
// To run, copy your token below, then:
//	npm install
// 	cd examples
// 	node simple.js

var Slack = require('..');

var token = 'xoxb-3522550902-wX4X9eH6Wp3MD0pwhODHlUmE',
    autoReconnect = true,
    autoMark = true;

var slack = new Slack(token, autoReconnect, autoMark);

slack.on('open', function() {

	var channels = [],
	    groups = [],
	    unreads = slack.getUnreadCount(),
	    key;

	for (key in slack.channels) {
		if (slack.channels[key].is_member) {
			channels.push('#' + slack.channels[key].name);
		}
	}

	for (key in slack.groups) {
		if (slack.groups[key].is_open && !slack.groups[key].is_archived) {
			groups.push(slack.groups[key].name);
		}
	}

	console.log('Welcome to the werewolf game. You are @%s of %s.  Are you a werewolf?', slack.self.name, slack.team.name);

});

slack.on('message', function(message) {

	var type = message.type,
	    channel = slack.getChannelGroupOrDMByID(message.channel),
	    user = slack.getUserByID(message.user),
	    time = message.ts,
	    text = message.text,
	    response = '';

	console.log('Received: %s %s @%s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user.name, time, text);

	// Respond to messages with the reverse of the text received.

	if (type === 'message') {

		channel.send("Don't listen to " + user.name + ". Here is a werewolf.");
		console.log('@%s responded with "%s"', slack.self.name, response);
	}
});

slack.on('error', function(error) {

	console.error('Error: %s', error);
});

slack.login();