var gui = require('nw.gui');
var mainWindow = gui.Window.get();

function openDialog(url, options) {
    var config = {
        title: "NOMP Desktop",
        icon: "./img/icon.png",
        position: "center",
        toolbar: false,
        frame: true,
        width: 600,
        height: 400,
        resizable: true,
        'always-on-top': false
    };
    $.extend(config, options);
    return gui.Window.open(url, config);
}

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
    helpMenu.append(new gui.MenuItem({
        label: 'Support',
        click: function () {
            openDialog('https://kiwiirc.com/client/irc.freenode.net/nomp', {width: 500, height: 500});
        }
    }));
    helpMenu.append(new gui.MenuItem({label: 'FAQ'}));
    helpMenu.append(new gui.MenuItem({type: 'separator'}));
    helpMenu.append(new gui.MenuItem({
        label: 'About',
        click: function() {
            openDialog('app://local/html/dialogs/about.html', {width: 600, height: 400});
        }
    }));
    menu.append(new gui.MenuItem({ label: 'Help', submenu: helpMenu }));

    mainWindow.menu = menu;

    var ctxMenu = new gui.Menu();
    ctxMenu.append(new gui.MenuItem({
        label: 'Copy',
        click: function () {
            document.execCommand('copy');
        }
    }));
    ctxMenu.append(new gui.MenuItem({
        label: 'Paste',
        click: function () {
            document.execCommand('paste')
        }
    }));

    document.body.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        ctxMenu.items[0].enabled = (window.getSelection().toString() !== '');
        
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

    // The user's saved pools
    $rootScope.pools = [
        {id: 1, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 2, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 3, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 4, name: 'TestPool', coin: 'BTC', url: '127.0.0.1:2000', user: '1KRotMnQpxu3sePQnsVLRy3EraRFYfJQFR'}
    ];
    $rootScope.nextPoolId = 5;
    // The user's mining keys
    $rootScope.keys = [
        {id: 1, name: 'Mining wallet 1', hash160: 'ca23629e2647387e99542fc0b25cdf75e101c3c0', watch_only: true}
    ];
    $rootScope.showAddPoolDialog = function () {
        openDialog('app://local/html/dialogs/add_pool.html', {width: 400, height: 250})
            .on('addPool', function(url, user) {
                $rootScope.$apply(function() {
                    $rootScope.pools.push({
                        id: $rootScope.nextPoolId++,
                        name: '??',
                        url: url,
                        user: user
                    });
                });
            });
    };
    $rootScope.showNewKeyDialog = function () {
        openDialog('app://local/html/dialogs/new_key.html', {width: 600, height: 400});
    };
});
