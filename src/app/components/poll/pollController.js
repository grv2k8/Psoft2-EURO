/*
grjoshi 3/10/2016
Controller that handles 
	- loading up poll page, with team names
*/
(function () {
    angular.module("psoft2UI").controller("pollController", pollCtrl);
    pollCtrl.$inject = ['$scope', '$location', 'userService', 'authService', 'gameService'];
    
    function pollCtrl($scope, $location, userService, authService, gameService) {
        
        $scope.games = [];
        $scope.selection = [];				//array of {usrID, matchID, teamID} objects			
        $scope.predErr = false;				//flag showing error if all selections aren't made	
        $scope.nogames = false;				//flag to show message if no games are available
        
        $scope.loadingGames = true;         //flag to show "Loading games...." animation
        
        $scope.user_token = authService.getToken();
        
        $scope.submitResponseERR = "";
        $scope.showConfirmation = false;
        
        // $scope.lockDown = false;
        
        //	$scope.isPointsTableLoaded = false;
        
        // $scope.predictionGrid = {
        //     columnDefs: [{ field: 'Name', displayName: 'Name' },
        //         { field: 'Team', displayName: 'Predicted Team' }]
        // };
        
        $scope.hasPredicted = true;
        

        //visibility for poll options      
        $scope.showPolls = function () {
            
            if ($scope.games.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        
/*
        var getPredictionTable = function () {
            
            //quick hack for semi and finals:
            if ($scope.lockDown) {
                $scope.predictionGrid = { data: '' };		//comment to show prediction grid 
                return;
            }
            
            //get Prediction from API
            gameService.getPredictionList($scope.user_token)
			.then(function (response) {
                if (response == null) {
                    throw "There was an error trying to fetch prediction data from the web service. Please try again later";
                }
                if (!response.data.success) { throw response.data.message; }
                //console.log(angular.toJson(response.data));
                
                if (response.data.predictData.length == 1) {
                    $scope.lockDown = true;
                }
                $scope.predictionGrid.data = response.data.predictData;
            })
			.catch(function (err) {
                console.log("Unable to fetch prediction table. Details:\n" + err)
            })
        }
*/

        if (!authService.isLoggedIn()) {
            //try loading user session from 
            if (!authService.loadSession()) {
                //no session saved either, so redirect to login
                console.log("User object not set. Redirecting to login...");
                $location.path("/login");
            }
        }
        else {
            //getLeaderBoard();			//load score table - moved to scoreboardController.js
            //getPredictionTable();		//load prediction table
            
            
            //get list of active games
           gameService.getNextGame()
				.then(function (response) {
                
                $scope.loadingGames = false;            //hide the "Loading...." animation
                
                if (response == null) {
                    throw "There was an error trying to connect to the web service. Please try again later";
                }
                
                if (!response.data.success) {
                    throw response.data.message;
                }
                
                
                //console.log(angular.toJson(response.data, true));
                
                if (response.data.count == 0) {
                    $scope.nogames = true;
                }
                else {
                    $scope.games = response.data.matchData.slice();		//copy games info to scope
                    $scope.nogames = false;
                    console.log("Match info returned: %o",response.data.matchData);
                }
                return;
            })
				.catch(function (err) {
                $scope.submitResponseERR = err;
                console.log("ERROR: " + err);
                return;
            })
        }
        
        
        $scope.submitPoll = function () {
            //submit prediction data to the server
            
            //check if all NON-LOCKED matches have been predicted
            var lgc = 0;        //locked games count
            $scope.games.forEach(function(g){
                    if(g.locked) lgc++;
            });

            console.log("Found total of ",lgc," locked games");
            if ($scope.games.length != $scope.selection.length) {
                $scope.predErr = true;
                return;
            }
            else {
                //try submitting
                $scope.predErr = false;
                gameService.submitPrediction(authService.usrObj.token, $scope.selection)
			.then(function (response) {
                    if (response == null) {
                        throw "There was an error trying to send the prediction data. Please try again later";
                    }
                    
                    //console.log(">>"+angular.toJson(response, true));
                    
                    if (!response.data.success) {
                        //if(!response.data.message)
                        $scope.submitResponseERR = response.data.message;
                        //throw response.data.message;
                        return;
                    }
                    
                    $scope.showConfirmation = true;
                    //$location.path("/poll");
                    return;
                })
			.catch(function (err) {
                    $scope.message = err;
                    $scope.is_valid = false;
                    console.log(err);
                })
            }
        };
        
        //add each match's predictions inside a JSON object, to send back to server
        $scope.selectTeam = function (matchID, teamID, teamName) {
            
            var doAdd = true;
            //builds the array to submit prediction data		
            $scope.selection.some(function (e) {
                //check if matchID key already exists and clear if so
                if (e.matchID === matchID) {
                    //Existing item found, updating with new selection
                    //e.userID = userService.usrObj.userID;//$scope.userID;
                    e.teamID = teamID;
                    e.teamName = teamName;
                    doAdd = false;
                    return;
                }
            });
            
            if (doAdd) {
                $scope.selection.push(
                    {
                        //userID: userService.usrObj.userID,
                        matchID: matchID,
                        teamID: teamID,
                        teamName: teamName
                    });
            }
            
            //console.log(angular.toJson($scope.selection, true));
            return;
        }

    }
})();