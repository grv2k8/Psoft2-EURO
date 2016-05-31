angular.module("psoft2UI",['ngRoute','angular-md5','ui.grid'])
	.config(function($routeProvider){
		$routeProvider
			.when('/poll',{
				controller: 			'gameController',
				templateUrl: 			'/app/views/gamePollPartial.html',
				caseInsensitiveMatch: 	true
			})
			//.when('/user',{
			//	controller: 			'userController',
			//	templateUrl: 			'/app/views/profilePartial.html',
			//	caseInsensitiveMatch: 	true
			//})
			.when("/login",{
				controller: 			'userController',
				templateUrl: 			'/app/views/loginPartial.html',
				caseInsensitiveMatch: 	true	
			})
			.when('/',{
				controller: 			'gameController',
				templateUrl: 			'/app/views/gamePollPartial.html',
				caseInsensitiveMatch: 	true
			})
			.when('/register',{
				controller: 			'accountController',
				templateUrl: 			'/app/views/registerPartial.html',
				caseInsensitiveMatch: 	true
			})
			.when('/profile',{
				controller: 			'userController',
				templateUrl: 			'/app/views/profilePartial.html',
				caseInsensitiveMatch: 	true
			})
			.otherwise({
				template: "<H1>Page not found</H1>",
				//templateUrl: "/app/views/notFoundPartial.html",
				caseInsensitiveMatch: true
			});			
	});
