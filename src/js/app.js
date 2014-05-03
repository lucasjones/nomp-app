var gui = require('nw.gui');
var mainWindow = gui.Window.get();

function initGUI() {
    var menu = new gui.Menu({ type: 'menubar' });

    var poolMenu = new gui.Menu();
    poolMenu.append(new gui.MenuItem({ label: 'Add' }));
    menu.append(new gui.MenuItem({ label: 'Pool', submenu: poolMenu }));

    var keyMenu = new gui.Menu();
    keyMenu.append(new gui.MenuItem({label: 'Generate'}));
    keyMenu.append(new gui.MenuItem({label: 'Import'}));
    menu.append(new gui.MenuItem({ label: 'Key', submenu: keyMenu }));

    var toolsMenu = new gui.Menu();
    toolsMenu.append(new gui.MenuItem({label: 'Options'}));
    menu.append(new gui.MenuItem({ label: 'Tools', submenu: toolsMenu }));

    var helpMenu = new gui.Menu();
    helpMenu.append(new gui.MenuItem({label: 'About'}));
    menu.append(new gui.MenuItem({ label: 'Help', submenu: helpMenu }));

    mainWindow.menu = menu;

    var ctxMenu = new gui.Menu();
    ctxMenu.append(
        new gui.MenuItem({
            label: 'Copy',
            click: function () {
                document.execCommand('copy');
            }
        })
    );
    ctxMenu.append(
        new gui.MenuItem({
            label: 'Paste',
            click: function() {
                document.execCommand('paste')
            }
        })
    );

    document.body.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        // Popup at place you click
        ctxMenu.popup(ev.x, ev.y);
        return false;
    }, false);
}

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
    initGUI();

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
