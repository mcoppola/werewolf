var extend = require('util')._extend;

function command (options) {
	var self = this;

	self = extend(self, options);
}

command.parseArgs = function(cmd) {
	var self = this;

	if (self.message.indexOf(cmd) < 0) return false;

	self.args = self.message.split(cmd + ' ').pop().split(' ');
	return self.message;
}

module.exports = command;