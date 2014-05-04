var gui = require('nw.gui');
var dialogWindow;
var dialogApp = angular.module('dialogApp', []);

dialogApp.run(function($rootScope) {
    dialogWindow = gui.Window.get();
    $rootScope.close = function() {
        dialogWindow.hide();
        dialogWindow.close();
    };
});

dialogApp.controller('AddPoolCtrl', function($scope, $rootScope) {
    $scope.addPool = function(url, user) {
        dialogWindow.emit('addPool', url, user);
        $rootScope.close();
    };
});
