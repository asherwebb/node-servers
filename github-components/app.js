var Login = require('./login.js');
var Setup = require('./setup.js');

var spinner;
var App = {
	init: function(){
		Login.init();
	}

};

window.onload = App.init();