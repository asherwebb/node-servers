var Config = require('./config.js');
var ErrorInfo = require('./error-info.js');
var LoadingInfo = require('./loading-info.js');
var Router = require('./router.js');
var AppData = require('./app-data.js');
//FIX ME: tidy this and all other personal modules first code look ;)
var login = {
	init: function(){
		login.attachLoginHandler();
	},
	attachLoginHandler: function(){		
		$("#signIn").on( "click" , function(e){
			e.preventDefault();
			login.loginGetElements();
		});
	},
	loginGetElements: function(){
		var email = $("#email").val();
    	var password = $("#password").val();
		var url = Config.baseUrl;
   		ErrorInfo.removeErrorDisplay();
		LoadingInfo.showSpinner();
		login.sendLogin(email, password, url);
	},
	sendLogin: function(email, password, url){
		var _email = email;
    	var _password = password;
    	var _url = url;

   		if (!_email) {
      		LoadingInfo.stopSpinner();
      		alert('Please enter your email.');
      		return;
    	}

    	if (!_password) {
      		alert('Please enter your password.');
      		return;
    	}

    	//ie9 workaround
    	var loginUrl =  '' + url + "/user/login?email=" + email + "&password=" + password + '';

		if(window.XDomainRequest){
	    	var options = {
				url:loginUrl,
				contentType: 'text/plain',
				dataType:'json',
				type:'post',
				success:function(data){
					var loginData = data;
	        		login.loggedIn(loginData);
				},
				error: function(error){
					var _error = error;
					ErrorInfo.ajaxError(_error);
				}
			};

			$.ajax(options);
		}else {
			
			var options = {

			}
			$.ajax({
			url:  loginUrl,
			type:"post",
			success: function(data){
				var loginData = data;
				login.loggedIn(loginData);
			},
			error: function(error){
				var _error = error;
				ErrorInfo.ajaxError(_error);
			}

		});
	}
	},
	loggedIn: function(loginData){
		var _loginData = loginData;
		AppData.loginData = _loginData;
		//add to data js file
		//FIX ME: introduce router
		LoadingInfo.stopSpinner();
		Router.querySetupComplete();

		//FIX ME move to router

		   //END
	},
	logout: function(){

	}

}

module.exports = login;