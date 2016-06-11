/*
grjoshi 5/30/2016
Controller that retrieves prediction list for current match from submitted entries
*/
(function () {
    angular.module("psoft2UI").controller("predListController", plCtrl);
    plCtrl.$inject = ['$scope', '$location','authService','gameService'];
    
    function plCtrl($scope, $location,authService,gameService) {

        $scope.lockDown = false;
        $scope.user_token = authService.getToken();
        $scope.predictionGrid = {
            columnDefs: [{ field: 'Name', displayName: 'Name' },
                { field: 'Team', displayName: 'Predicted Team' }]
        };

        //quick hack for semi and finals:
        if ($scope.lockDown) {
            $scope.predictionGrid = { data: '' };		//comment to show prediction grid
            return;
        }

        // TODO: something to update grid dynamically?
        // $scope.$watch(currentPredList)

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
                console.error("Unable to fetch prediction table. Details:\n" + err);
            })
    }


})();