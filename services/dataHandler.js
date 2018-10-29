angular.module("bliffoscopeApp").factory("dataHandler", dataHandlerService);

function dataHandlerService() {

    var spaceships, bliffoscopeImages, accuracy;

    var init = function(){
        spaceships = new Map();
        bliffoscopeImages = new Map();
    }

    init();

    var addComponent = function (component) {
        if (!(component instanceof Component)) {
            return new Error("add: component object invalid");
        }
        var key = component.name;
        if (component.type == "spaceships") {
            if (spaceships.has(key))
                return false;
            spaceships.set(key, component);
            return true;
        }
        else if (component.type == "bliffoscopeImages") {
            if (bliffoscopeImages.has(key))
                return false;
            bliffoscopeImages.set(key, component);
            return true;
        }
        return new Error("add: component type unknown");
    }

    var getComponent = function (key, type) {
        if (type == "spaceships") {
            return spaceships.get(key);
        }
        else if (type == "bliffoscopeImages") {
            return bliffoscopeImages.get(key);
        }
        return new Error("get: component type unknown");
    }

    var removeComponent = function (key, type) {
        if (type == "spaceships") {
            spaceships.delete(key);
            return spaceships.delete(key);
        }
        else if (type == "bliffoscopeImages") {
            return bliffoscopeImages.delete(key);
        }
        return new Error("remove: component type unknown");
    }

    var getValues = function (type) {
        if (type == "spaceships") {
            return Array.from(spaceships.values());
        }
        else if (type == "bliffoscopeImages") {
            return Array.from(bliffoscopeImages.values());
        }
        return new Error("remove: component type unknown");
    }

    var getKeys = function (type) {
        if (type == "spaceships") {
            return Array.from(spaceships.keys());
        }
        else if (type == "bliffoscopeImages") {
            return Array.from(bliffoscopeImages.keys());
        }
        return new Error("remove: component type unknown");
    }

    var getAccuracy = function(){
        return accuracy;
    }

    var setAccuracy = function(newAccuracy){
        accuracy = newAccuracy;
    }

    return {
        add: addComponent,
        get: getComponent,
        remove: removeComponent,
        keys: getKeys,
        values: getValues,
        getThresholdAccuracy: getAccuracy,
        setThresholdAccuracy: setAccuracy,
        resetData: init
    }

}