var gui = require('nw.gui');

var nompApp = angular.module('nompApp', [
    'ngRoute',
    'nompControllers'
]);

nompApp.config(function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: './partials/connect.html',
            controller: 'ConnectCtrl'
        }).
        when('/pool', {
            templateUrl: './partials/pool.html',
            controller: 'PoolCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

nompApp.run(function ($rootScope) {
    $rootScope.pools = [
        {id: 1, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 2, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 3, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 4, name: 'TestPool', coin: 'BTC', url: '127.0.0.1:2000', user: '1KRotMnQpxu3sePQnsVLRy3EraRFYfJQFR'}
    ];
    $rootScope.keys = [
        {id: 1, name: 'Mining wallet 1', hash160: 'ca23629e2647387e99542fc0b25cdf75e101c3c0', watch_only: true}
    ];
    $rootScope.showAddPoolDialog = function () {
        gui.Window.get(
            window.open('./dialogs/add_pool.html')
        );
    };
    $rootScope.showNewKeyDialog = function () {
        gui.Window.get(
            window.open('./dialogs/new_key.html')
        );
    };
});
