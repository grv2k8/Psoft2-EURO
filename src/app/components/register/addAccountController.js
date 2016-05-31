/*
grjoshi 3/30/2016
     Service to handle all user account related API calls (create/login)
*/

(function () {
    angular.module("psoft2UI").controller("accountController", addUserCtrl);
    addUserCtrl.$inject = ['$scope', '$location', 'userService', 'md5'];
    
    function addUserCtrl($scope, $location, userService, md5) {
              
        $scope.is_pass_match = true;
        $scope.is_processing = false;
        $scope.show_confirmation = false;
        $scope.err_msg = '';
        $scope.user_added = true;
        
        $scope.registerUser = function () {
            
            return;  //uncomment after registraion period expires

            if ($scope.user.name == "" || $scope.user.email == "" || $scope.user.password == "") {
                console.log("DBG::BLANK VALUES CANNOT BE SUBMITTED");
                return;
            }
            
            if ($scope.user.password == $scope.user.confirm_password)
                $scope.is_pass_match = true;
            else {
                $scope.is_pass_match = false;
                return;
            }
            
            $scope.is_processing = true;            //processing GIF            
           
            var usr_token = md5.createHash($scope.user.email + Date.now());
            
            //call service and wait for response
            userService.addUser($scope.user.name, $scope.user.email, md5.createHash($scope.user.password),usr_token)
			.then(function (response) {
                
                $scope.is_processing = false;
                if (!response.data.success) {
                    $scope.user_added = false;
                    $scope.err_msg = response.data.message;
                    return;
                } 
                
                $scope.user_added = true;
                $scope.show_confirmation = true;
                //console.log("Added new user");
            })
			.catch(function (response) {
                err_msg = "There was an error while trying to create user account. Please contact the administrator with details from the console view (Press F12 to open Dev mode and click on 'console').";
                console.log("ERROR trying to add user. Response was:" + response.status + "//" + response.data);
                return;
            })
        }
    }
})();