(function () {
    angular.module("psoft2UI").controller("loginController", loginCtrl);
    userCtrl.$inject = ['$scope', '$location', 'userService', '$window', 'md5'];
    function loginCtrl($scope, $location, userService, $window, md5) {

        $scope.user = {};	//initially empty
        $scope.is_valid = true;
        
        $scope.message = "";
        $scope.is_waiting = false;			//enabled when waiting on server
        
        if (!userService.checkLogin()) {
            if (!userService.checkSession()) {
                //no session saved either, so redirect to login
                //console.log("User not logged in!!");
                $location.path("/login");
            }
            else {
                //fetch and update score if different from session storage
                userService.getScore(userService.usrObj.token)
                .then(function (response) {
                    if (response != null) {
                        if (userService.usrObj.points != response.data.score) {
                            //update score and storage object                            
                            userService.usrObj.points = response.data.score;
                            window.localStorage['nofapp_session'] = angular.toJson(userService.usrObj);
                        }
                    }
                });
            }
        }
        else {
            $scope.user.userID = userService.usrObj.userID;
            $scope.user.name = userService.usrObj.name;
            $scope.user.email = userService.usrObj.email;
            $scope.user.token = userService.usrObj.token;
            $scope.user.points = userService.usrObj.points;
            
            //also load user game history
            if ($scope.gameHistory.length == 0) { getUserPredictionHistory(); }
        }
        
        $scope.logout = function () {
            //invalidate user session
            console.log("Erasing user session...");
            $scope.user = {};
            userService.usrObj = {};
            window.localStorage.clear();
            $location.path("/login");
        };
        

        $scope.checkIfLoggedIn = function () {
            return userService.checkLogin();
        };
        
        $scope.login = function () {
            
            //check if already logged in
            if (userService.checkLogin()) {
                //console.log("Already logged in as "+userService.usrObj.name);
                $location.path("/poll");
                return;
            }
            $scope.is_waiting = true;
            userService.login($scope.email, md5.createHash($scope.password))
			.then(function (response) {
                //console.log("RESPONSE RETURNED:: "+angular.toJson(response,true));
                if (response == null) {
                    throw "There was an error trying to connect to the web service. Please try again later";
                }
                
                if (!response.data.success) {
                    throw response.data.message;
                }
                
                userService.usrObj = {
                    userID: response.data.usrData.userID,
                    name: response.data.usrData.user,
                    email: response.data.usrData.email,
                    token: response.data.usrData.token,
                    points: response.data.usrData.points
                };
                
                $scope.user = {
                    userID: response.data.usrData.userID,
                    name: response.data.usrData.user,
                    email: response.data.usrData.email,
                    token: response.data.usrData.token,
                    points: response.data.usrData.points
                }
                
                if ($scope.savelogin) {
                    //session persistence
                    //console.log("This is where the login needs to be saved!");
                    window.localStorage['nofapp_session'] = angular.toJson(userService.usrObj);
                    //$localStorage.$default({ nofapp_token: response.data.usrData.token });          //save user token to local storage
                    //console.log("Saved user token to local storage");
                }
                
                $scope.is_valid = true;
                //console.log("Set user object to: " + angular.toJson(userService.usrObj, true));
                $location.path("/poll");
                return;
            })
			.catch(function (err) {
                //console.log("FAILED finding user. Response was:"+response.status, response.data);
                $scope.message = err;
                $scope.is_valid = false;
                console.log(err);
            })
			.finally(function () {
                //$location.path("/poll");
                //return;
                $scope.is_waiting = false;
            })
        };
        
        $scope.redirectToRegister = function () {
            //console.log("Redirecting to Register page");
            $location.path("/register");
            return;
        };
    }
})();