var Slack = require('slack-client'),
	Message = require('./node_modules/slack-client/src/message'),
	request = require('request'),
	util = require('./src/util');

var token = 'xoxb-3522717080-Qe1d7lUKJWF8PYw5hYNmOuU6',
    autoReconnect = true,
    autoMark = true,
    modId = "<@U03FCM32C>";

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

	console.log('Running werewolf bot...');
});

slack.on('message', function(message) {

	var type = message.type,
	    channel = slack.getChannelGroupOrDMByID(message.channel),
	    user = slack.getUserByID(message.user),
	    time = message.ts,
	    text = message.text || '';

	// Respond if pinged in #werewolf channel
	if (type === 'message' && (text.indexOf(modId) >= 0 || text.toLowerCase().indexOf('ww') == 0) && channel.name.toLowerCase() === 'werewolf') {

		console.log('*** ' + user.name + ' pinged the mod.');
		channel.send(user.name + ' is a werewolf.');
	}

	// send a dm to that user
	util.getDMChannelFromUser(message.user, token, function(dm) {

		var m = new Message(channel._client, { channel: dm, text: 'this is a direct message!'});
		channel._client._send(m);

	});

});

slack.on('error', function(error) {

	console.error('Error: %s', error);
});


slack.login();