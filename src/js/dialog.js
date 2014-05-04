var gui = require('nw.gui');
var dialogWindow;
var dialogApp = angular.module('dialogApp', []);

dialogApp.run(function ($rootScope) {
    dialogWindow = gui.Window.get();
    $rootScope.close = function () {
        dialogWindow.hide();
        dialogWindow.close();
    };
});

dialogApp.controller('AddPoolCtrl', function ($scope, $rootScope) {
    $scope.addPool = function (url, user) {
        dialogWindow.emit('addPool', url, user);
        $rootScope.close();
    };
});

dialogApp.controller('AboutCtrl', function ($scope, $rootScope) {
    $scope.copyrightRange = function (startYear) {
        var currentYear = new Date().getFullYear();
        if (currentYear !== startYear) {
            return startYear + '-' + currentYear;
        }
        return startYear;
    };
    $scope.openUrlExt = openUrlExt;
});

dialogApp.controller('NewKeyCtrl', function($scope, $rootScope) {
    
});
