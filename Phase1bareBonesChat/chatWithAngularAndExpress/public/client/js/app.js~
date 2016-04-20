var module = angular.module('chat', []);



module.controller('Controller', function() {
	var self = this;
	self.messages = [];
	var socket = io();
	
	socket.on('messages', function(messages) {
		self.messages = messages;
	});
	
	
	self.sendMessage = function() {
		socket.emit('message', {message: self.message});
	}
	
	
});
