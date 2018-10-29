angular.module("bliffoscopeApp").factory("parseInput", parseInputFactory);

function parseInputFactory($q) {

    var minInputCharacters = 1;

    function rejectPromise(deferred, filename, message) {
        deferred.reject(new Error(filename + ": " + message));
        return deferred.promise;
    }

    var parseFile = function (inputAsString, name, type) {

        var deferred = $q.defer();

        var sparseMatrix = new Map();
        var cols_iter = 0, rows = 0;
        var cols = inputAsString.indexOf("\n");
        if (cols < minInputCharacters)
            return rejectPromise(deferred, name, "invalid format");
        for (var i = 0; i < inputAsString.length; i++) {
            switch (inputAsString[i]) {
                case "\n":
                    if (i % (cols + 1) != cols && rows != 0)
                        return rejectPromise(deferred, name, "different number of characters across the columns on row " + rows);
                    rows++;
                    cols_iter = 0;
                    continue;
                case "+":
                    sparseMatrix.set(rows + ":" + cols_iter, 1);
                    break;
                case " ":
                    break;
                default:
                    return rejectPromise(deferred, name, ": contains characters different from '+', space and new line on row-column " + (rows + 1) + "-" + (cols_iter + 1));
            }
            cols_iter++;
        }

        var component = new Component(rows, cols, type, name, sparseMatrix);

        deferred.resolve(component);
        return deferred.promise;
    }

    return {
        parse: parseFile
    }
}