angular.module("bliffoscopeApp", ["ngRoute", "ngMaterial"])
.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/home.html",
        })
        .when("/input", {
            templateUrl: "views/input.html",
            controller: "inputController"
        })
        .when("/results", {
            templateUrl: "views/results.html",
            controller: "processController"
        })
        .when("/definition", {
            templateUrl: "views/problemDefinition.html"
        })
        .otherwise({redirectTo: "/"})
});


/**
 * TODOS: 
 * - Create directive for file=input to be able to call inside the scope parseFiles and remove the files added allowing to remove and upload the same files
 * - Remove the watchers and uses a service instead passing which get in input the $scope of the controller that needs the data and populate the variable needed 
 *   using data-binding instead of keep spinning on data on the handler
 * 
 */

 /**
  * Angular issues resources:
  * - https://github.com/angular/angular.js/issues/1375https://github.com/angular/angular.js/issues/1375
  * - https://github.com/angular/angular.js/issues/2568 ngChange does not react to changes in input for type="file" #2568
  * 
  */