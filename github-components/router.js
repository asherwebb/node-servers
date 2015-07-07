var AppData = require('./app-data.js');
var Setup = require('./setup.js');
var router = {
	querySetupComplete: function(){
		console.log( AppData.loginData );

			if( AppData.loginData.preference !== null ) {
				//FIXME - if it is not null we need to do another check to see if the setup has been completed
				alert('setup complete');
				router.launchUsage();
				//FIXME route
			} else {
				alert('setup incomplete');
				router.launchSetup();
			}
		
	},
	launchSetup: function(){
		var route='legal-agreement-box';
		router.setupScreenRoute(route);
	},
	setupScreenRoute: function(route){
		var _route = route;
		var activeDiv = $('#' + _route);

		var setupObject = {};
		setupObject.route = _route;

		$( activeDiv ).load( 'ajax/'+ _route + '.html' , function( e ){ 
			if(setupObject.route === 'legal-agreement-box'){
				Setup.initUserAgreement();
			}
    	}); 
	},
	launchUsage: function(){
		//FIXME setup usage screen 1
	},
	usageScreenRoute: function(route){

	}

}

module.exports = router;