/*
 grjoshi 5/24/2016
 Authentication factory to hold user object
 */

angular.module("psoft2UI").factory('authService', function ($http){
    var session_name = 'nofapp2_session';
    var usrObj = {
        userID: '',
        email: '',
        name: '',
        token: '',
        points: 0
    };

    usrObj.isLoggedIn = function(){
        if(usrObj.token === '')
            return false;
        else
            return true;
    };

    usrObj.login = function(email, passwordHash){
        var data = {
            email: email,
            password: passwordHash
        };

        return $http.post('/api/login', data);
    };

    usrObj.saveSession = function (){
        //save current user object in session storage
        window.localStorage[session_name] = angular.toJson(this.usrObj);
    }

    usrObj.loadSession = function () {
        //check local storage for login, and return true if found
        if (window.localStorage[session_name]) {
            this.usrObj = angular.fromJson(window.localStorage[session_name]);
            return true;
        }
        else
            return false;
    };



    return usrObj;

});
