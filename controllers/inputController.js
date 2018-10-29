angular.module("bliffoscopeApp").controller("inputController", ["$scope", "$location", "parseInput", "dataHandler", inputCtrl]);

function inputCtrl($scope, $location, parseInput, dataHandler) {
    
        // TODO: bind the controller to the service and remove the watchers!

        $scope.accuracy = 60;
        $scope.promises = [];
        $scope.spaceships = [];
        $scope.bliffoscopeImages = [];    
    
        // Update the view on changes to spaceships keys
        $scope.$watch(
            function() {
                return dataHandler.keys("spaceships");
            },
            function(keys) {
                $scope.spaceships = keys;
            }, true
        );
    
        // Update the view on changes to bliffoscope images keys
        $scope.$watch(
            function() {
                return dataHandler.keys("bliffoscopeImages");
            },
            function(keys) {
                $scope.bliffoscopeImages = keys;
            }, true
        );
    
        // Parse the input files using fileReader
        $scope.parseFiles = function(event) {
            var type, file, filename, reader;

            if($scope.irregularBliffoscopeSize != "" && event.target.id == "bliffoscopeImages")
                $scope.irregularBliffoscopeSize = "";
        
    
            for (var i = 0; i < event.target.files.length; i++) {
                file = event.target.files[i];
                if(!file) {
                    $scope.fileError = filename + " - unable to read the file.";
                    return;
                } 

                type = event.target.id;
                filename = file.name.split(".")[0];
                
                // register the promise of reading the file
                $scope.promises.push(filename);

                reader = new FileReader();
                reader.onload = storeInput(type, filename);
                reader.readAsText(file);
            }
    
        };

        // Uses the parseInput service to parse the files and store the spaceship/bliffoscope image in the data handler service
        function storeInput(type, filename) {
            return function(fileReaderEvent) {

                var fileContent = fileReaderEvent.target.result;
                parseInput.parse(fileContent, filename, type)
                        .then(function(response) {
                            try { 
                                dataHandler.add(response);

                                // consume promise 
                                var index = $scope.promises.indexOf(filename);
                                if(index > -1){
                                    $scope.promises.splice(index, 1);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }).catch(function (error) {
                            // error in the inout file reading
                            $scope.errorUploadFile = error;
                        });
            }
        }

        // Remove spaceship/bliffoscopeimage from the data handler service 
        $scope.remove = function (keyToRemove, type) {
            try {
                dataHandler.remove(keyToRemove, type);
            } catch (error) {}
        }
    
        // It makes sure that the input spaceships dimensions are less or equal to the bliffoscope images dimensions
        var validateInputDimensions	= function(scope) {
            var spaceships = dataHandler.values("spaceships");
            var bliffoscopeImages = dataHandler.values("bliffoscopeImages");

            for (spaceship of spaceships) {
                for(image of bliffoscopeImages) {
                    if(image.rows < spaceship.rows || image.cols < spaceship.cols){
                        scope.irregularBliffoscopeSize = "Bliffoscope image '" + image.name + "' size [" + image.rows + ", " + image.columns +"] smaller than spaceship '" + spaceship.name + "' size [" + spaceship.rows + ", " + spaceship.columns +"]"; 
                        try{
                            dataHandler.remove(image.name, image.type);
                        } catch(err){}
                        return false;
                    } 
                }
            }
            return true;
        }
    
        // Starts the execution of the algorithm by changing the location
        $scope.submit = function () {
            if(validateInputDimensions($scope)){
                dataHandler.setThresholdAccuracy($scope.accuracy);
                $location.path("/results");
            }
                
        }

        $scope.removeError = function(){
            $scope.errorUploadFile = "";
        }
   
    }