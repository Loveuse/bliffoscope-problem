angular.module("bliffoscopeApp").controller("tabController", ["$scope", "dataHandler", tabCtrl]);

function tabCtrl($scope, dataHandler) {

    $scope.tabsRoutes = {
        "Home": "#!/",
        "Bliffoscope Data Analyzer" : "#!/input",
        "Problem Definition": "#!/definition"
    }

    $scope.selected = function(tab){
        try{
            dataHandler.resetData();
        }catch(error){}
    }

    $scope.currentNavItem = "Home";

}