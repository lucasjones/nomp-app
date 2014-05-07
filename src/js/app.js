var gui = require('nw.gui');
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');

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
        'always-on-top': false,
        focus: true
    };
    $.extend(config, options);
    return gui.Window.open(url, config);
}

function initGUI($rootScope) {
    var menu = new gui.Menu({ type: 'menubar' });

    var poolMenu = new gui.Menu();
    poolMenu.append(new gui.MenuItem({
        label: 'Add',
        click: function () {
            $rootScope.showAddPoolDialog();
        }
    }));
    menu.append(new gui.MenuItem({ label: 'Pool', submenu: poolMenu }));

    var keyMenu = new gui.Menu();
    keyMenu.append(new gui.MenuItem({
        label: 'Generate',
        click: function () {
            $rootScope.showNewKeyDialog();
        }
    }));
    keyMenu.append(new gui.MenuItem({
        label: 'Import',
        click: function () {
            $rootScope.showNewKeyDialog()
        }
    }));
    menu.append(new gui.MenuItem({ label: 'Key', submenu: keyMenu }));

    var toolsMenu = new gui.Menu();
    toolsMenu.append(new gui.MenuItem({
        label: 'Options',
        click: function () {
            $rootScope.showOptionsDialog();
        }
    }));
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
        click: function () {
            openDialog('app://local/html/dialogs/about.html', {width: 500, height: 250});
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
    async.series([
        function (callback) {
            $rootScope.dataPath = gui.App.dataPath;
            $rootScope.configFilePath = $rootScope.dataPath + '/config.json';
            $rootScope.writeConfigFile = function (callback) {
                var config = {};
                config.pools = $rootScope.pools;
                config.keys = $rootScope.keys;
                config.nextPoolId = 0;
                fs.writeFile($rootScope.configFilePath, angular.toJson(config, true), function (err) {
                    if (err) {
                        if (callback) {
                            callback("Failed to write to config file(" + $rootScope.configFilePath + "): " + err);
                        } else {
                            throw "Failed to write to config file(" + $rootScope.configFilePath + "): " + err;
                        }
                    }
                    if (callback) {
                        callback(null);
                    }
                });
            };

            // The user's saved pools
            $rootScope.pools = [
                {id: 1, name: 'NompPool', url: 'example.com', users: ['ca23629e2647387e99542fc0b25cdf75e101c3c0']},
                {id: 2, name: 'TestPool', url: '127.0.0.1:2000', users: ['1KRotMnQpxu3sePQnsVLRy3EraRFYfJQFR']}
            ];
            // ID to use for next pool
            $rootScope.nextPoolId = 1;
            $rootScope.$watchCollection('pools', function () {
                for (var i = 0; i < $rootScope.pools.length; i++) {
                    if ($rootScope.nextPoolId <= $rootScope.pools[i].id) {
                        $rootScope.nextPoolId = $rootScope.pools[i].id + 1;
                    }
                }
            });
            // The user's mining keys
            $rootScope.keys = [
                {id: 1, name: 'Mining wallet 1', hash160: 'ca23629e2647387e99542fc0b25cdf75e101c3c0', watch_only: true}
            ];
            mkdirp($rootScope.dataPath, function (err) {
                if (err) {
                    throw "Failed to open data directory (" + $rootScope.dataPath + "): " + err;
                }
                fs.readFile($rootScope.configFilePath, function (err, data) {
                    if ((err && err.code === 'ENOENT') || data == undefined) {
                        $rootScope.writeConfigFile(function (err) {
                            if (err) throw err;
                            callback(null);
                        });
                        return;
                    }
                    if (err) {
                        throw "Failed to open config file(" + $rootScope.configFilePath + "): " + err.code;
                    }
                    try {
                        data = JSON.parse(data);
                    } catch (err) {
                        throw "Failed to read config file" + $rootScope.configFilePath + "): " + err;
                    }
                    $rootScope.$apply(function () {
                        $rootScope.pools = data.pools || [];
                        $rootScope.keys = data.keys || [];
                        callback(null);
                    });
                });
            });
        },
        function (callback) {
            $rootScope.$watchCollection('pools', function () {
                $rootScope.writeConfigFile();
            });
            $rootScope.$watchCollection('keys', function () {
                $rootScope.writeConfigFile();
            });
            initGUI($rootScope);
            $rootScope.showAddPoolDialog = function () {
                openDialog('app://local/html/dialogs/add_pool.html', {width: 400, height: 250})
                    .on('addPool', function (url, user) {
                        $rootScope.$apply(function () {
                            $rootScope.pools.push({
                                id: $rootScope.nextPoolId++,
                                url: url,
                                user: user
                            });
                        });
                    });
            };
            $rootScope.showNewKeyDialog = function () {
                openDialog('app://local/html/dialogs/new_key.html', {width: 600, height: 300});
            };
            $rootScope.showOptionsDialog = function () {
                openDialog('app://local/html/dialogs/options.html', {width: 600, height: 400});
            };
            callback(null);
        }
    ]);
});
