var Slack = require('slack-client');

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

	console.log('Running werewolf game...');

});

slack.on('message', function(message) {

	var type = message.type,
	    channel = slack.getChannelGroupOrDMByID(message.channel),
	    user = slack.getUserByID(message.user),
	    time = message.ts,
	    text = message.text,
	    response = '';

	//console.log('Received: %s %s @%s %s "%s"', type, (channel.is_channel ? '#' : '') + channel.name, user.name, time, text);

	// Respond if pinged
	if (type === 'message' && (text.indexOf(modId) >= 0)) {

		console.log('*** ' + user.name + ' pinged the mod.');
		channel.send(user.name + ' is a werewolf.');
	}
});

slack.on('error', function(error) {

	console.error('Error: %s', error);
});

slack.login();