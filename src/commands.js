module.exports = {

	hello: function(ww, command) {
		ww.say('hello ' + command.user, command.channel);
	},
	ww: function(ww, command) {
		ww.say('hello ' + command.user, command.channel);
	},
	help: function(ww, command) {
		ww.help(command);
	},
	'new game': function(ww, command) {
		ww.newGame(command);
	},
	'end game': function(ww, command) {
		delete ww.game;
		ww.say('Ok game over', command.channel);
	},
	kill: function(ww, command) {
		ww.say('I will eat ' + command.args[0], command.channel);
	},
	state: function(ww, command) {
		ww.printState(command.channel);
	}

}