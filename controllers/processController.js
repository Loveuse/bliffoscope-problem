angular.module("bliffoscopeApp").controller("processController", ["$scope", "$location", "dataHandler", processCtrl]);

function processCtrl($scope, $location, dataHandler) {

    $scope.results = {};
    $scope.toggle = {};
    $scope.showResultInfo = false;

    runBliffoscopeDataAnalysis();
    console.log($scope.results);

    // Collapse results for the clicked bliffoscope image
    $scope.collapseAll = function (data) {
        for (var image in $scope.results) {
            if (!$scope.results.hasOwnProperty(image))
                continue;
            if (image != data) {
                $scope.results[image].expanded = false;
            }
        }
        $scope.results[data].expanded = !$scope.results[data].expanded;
    };


    /**
    * For every bliffoscope image returns the spaceships coordinates and accuracy on it with at least the accuracy specified in the UI
    * ordered by decresing accuracy
    **/ 
    function runBliffoscopeDataAnalysis() {
        var targetsForImage, imageDimensions, imageProperties;
        try {
            var bliffoscopeImages = dataHandler.values("bliffoscopeImages");
            var spaceships = dataHandler.values("spaceships");
            $scope.accuracyThreshold = dataHandler.getThresholdAccuracy();
            
            
            for (image of bliffoscopeImages) {

                targetsForImage = findTargetsList(image, spaceships);
                targetsForImage.sort(function compare(a, b) {
                    if (a.Accuracy < b.Accuracy)
                        return 1;
                    if (a.Accuracy > b.Accuracy)
                        return -1;
                    return 0;
                });

                $scope.results[image.name] = {
                    rows: image.rows,
                    columns: image.columns,
                    targets: targetsForImage
                }
            }
            if(Object.keys($scope.results).length != 0){
                $scope.showResultInfo = true;
            }
        } catch (error) {
            // which error?
            $scope.invalidData = "Invalid data";
        }
    }

    // For the given bliffoscope image will consider every spaceship provided and it will calculate the accuracy and coordinates
    function findTargetsList(bliffoscopeImage, spaceships) {
        var spaceshipAccuracy, pixelsnOnSpaceship, spaceshipMatrix, limitRows, limitCols;
        var results = [];

        for (var spaceshipIndex = 0; spaceshipIndex < spaceships.length; spaceshipIndex++) {

            spaceshipMatrix = spaceships[spaceshipIndex].sparseMatrix;

            // adapt the fors on rows and columns based on the spaceship considered
            limitRows = bliffoscopeImage.columns - spaceships[spaceshipIndex].columns;
            limitCols = bliffoscopeImage.rows - spaceships[spaceshipIndex].rows;
            for (var row = 0; row < limitRows; row++) {
                for (var col = 0; col < limitCols; col++) {

                    pixelsnOnSpaceship = getPixelsMatches(spaceshipMatrix, row, col, bliffoscopeImage.sparseMatrix);
                    spaceshipAccuracy = calculateAccuracy(pixelsnOnSpaceship, spaceshipMatrix.size);

                    if (spaceshipAccuracy > $scope.accuracyThreshold) {
                        results.push({
                            "Accuracy": spaceshipAccuracy,
                            "Name": spaceships[spaceshipIndex].name,
                            "Spaceship Size": spaceships[spaceshipIndex].rows + " x "+ spaceships[spaceshipIndex].columns,
                            "Position of the spaceship into the bliffoscope image": [
                                [row, col],
                                [row, col + spaceships[spaceshipIndex].columns - 1],
                                [row + spaceships[spaceshipIndex].rows - 1, col],
                                [row + spaceships[spaceshipIndex].rows - 1, col + spaceships[spaceshipIndex].columns - 1]
                            ]
                        });
                    }
                }
            }
        }
        return results;
    }

    /**
     * 
     * Simple metric that checks the number of pixel in which there is a match on the bliffoscope image and the spaceship
     * Possible extensions is looking at the neighbourhood of the cell
     * when the pixel on the bliffoscope image is not on since it 
     * may impact the accuracy given the bliffoscope precision system
     *
     **/
    function getPixelsMatches(spaceshipMatrix, row, col, bliffloscopeImageMatrix) {
        var pixelsnOnSpaceship = 0;
        var keySplit, keyRow, keyCol, keyBliffloscopeImageMatrix;

        var spaceshipMatrixKeys = spaceshipMatrix.keys();
        // checking only the coordinates of the spaceships for which the pixels are on
        for (const key of spaceshipMatrixKeys) {
            keySplit = key.split(":");
            keyRow = parseInt(keySplit[0]);
            keyCol = parseInt(keySplit[1]);
            keyBliffloscopeImageMatrix = (keyRow + row) + ":" + (keyCol + col);
            if (bliffloscopeImageMatrix.has(keyBliffloscopeImageMatrix)) {
                pixelsnOnSpaceship++;
            }
        }
        return pixelsnOnSpaceship;
    }


    function calculateAccuracy(pixelsOn, spaceshipMatrixLength) {
        var accuracy = pixelsOn / spaceshipMatrixLength * 100;
        accuracy = calibrateAccuracy(accuracy);
        return accuracy;
    }

    /**
     * Trasform the accuracy in 2 decimal number
     * 70.2127659574468 => 70.21
     *	70.9997659574468 => 71
     **/
    function calibrateAccuracy(accuracy) {
        var integer_ = Math.floor(accuracy);
        var decimal = accuracy - integer_;
        var round = Math.round(decimal * 100);
        accuracy = integer_ + round / 100;
        return accuracy;
    }

    $scope.backToInput = function () {
        $scope.results = {};
        dataHandler.resetData();
        $scope.$parent.currentNavItem = "Bliffoscope Data Analyzer";
        $location.path("/input");
    }

}