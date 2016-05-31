/*
grjoshi 3/30/2016
     Service to handle all game-related API calls
*/

angular.module("psoft2UI").service("gameService", function ($http) {
    
    this.getNextGame = function () {
        var promise = $http.get("/api/nextmatch");
        return promise;
    }
    
    this.submitPrediction = function (usr_token, predObj) {
        
        var data = {
            token: usr_token,               //user token
            predObj: predObj                //array of predictions (if more than 1 game)
        };
        
        //console.log("SENDINGG..." + angular.toJson(data, true));
        var promise = $http.post("/api/submitPrediction", data);
        return promise;
    }
    
    this.showNextGamePredictions = function () {
        var promise = $http.get("/api/getPredictions");
        return promise;
    }
    
    this.getUserPoints = function () {
        var promise = $http.get("/api/getScores");
        return promise;
    }
    
    this.getPredictionList = function (user_token) {
        var promise = $http.get("/api/getPredictions?token=" + user_token);
        return promise;
    }
    
    this.checkIfUserPredicted = function (user_token) {
        //console.log("Checking token::" + user_token);
        var promise = $http.get("/api/checkIfPredicted?token=" + user_token);
        return promise;
    }
});