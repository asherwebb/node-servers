var Config = require('./config.js');
var ErrorInfo = require('./error-info.js');
var LoadingInfo = require('./loading-info.js');
var Router = require('./router.js');
var AppData = require('./app-data.js');

var setup = {
	initUserAgreement: function() {
	//grab btn and attach handler
	$('#agreeToLegalTerms').on( 'click' , function(e){
		e.preventDefault();
		setup.sendSignUserAgreement();
	});
	},
	sendSignUserAgreement: function(){
		//alert('wos');
	if ($('#conditions').is(':checked') != true) {
      alert("You must agree with our terms of use before proceeding");
      return;
    } else {
    	var token = AppData.loginData.token;
    	var baseUrl = Config.baseUrl;
    	var url = '' + baseUrl + '/user/legal_agreement_signed';
    	var headers = { "Authorization" : 'Token token="'+ token +'"'};
    	//ie9 fix for xdomain
    	//makeAjaxCall
    	//FIXME : custom headers not allowed in xdomain <= ie9 
    	//Sites that wish to perform authentication of the user for cross-origin 
    	//requests can use explicit methods (e.g. tokens in the POST body or URL)
    	//http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
    	if( window.XDomainRequest ){
    		alert('x-domain attempt');
	    	var options = {
				url:url,
				headers: headers,
				contentType: 'text/plain',
				dataType:'json',
				type:'post',
				success:function(data){
					alert('success');
					//var loginData = data;
	        		//login.loggedIn(loginData);
				},
				error: function(error){
					var _error = error;
					ErrorInfo.ajaxError(_error);
				}
			};
			$.ajax(options);

    	} else {

    		var options = {
			url: url,
			headers: headers,
			type:"post",
			success: function(results){
				//oadingInfo.stopSpinner();
				console.log(results);
				
				//localStorage.setItem("active_token" , results.token);
				//loggedInStatus.loggedIn();
				//update ui to show "logged in"

			},
			error: function(error){
				//loadingInfo.stopSpinner();
				console.log(error);
				//errorInfo.displayError();
			}

		}
		$.ajax(options);

    	}
    }

	}
}

module.exports = setup;