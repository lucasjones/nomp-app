var request = require('request');

var nompControllers = angular.module('nompControllers', []);

nompControllers.controller('ConnectCtrl', function ($scope, $rootScope, $location) {
    $rootScope.pools = [
        {id: 1, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 2, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 3, name: 'NompPool', url: 'example.com', user: 'ca23629e2647387e99542fc0b25cdf75e101c3c0'},
        {id: 4, name: 'TestPool', coin: 'BTC', url: '127.0.0.1:2000', user: '1KRotMnQpxu3sePQnsVLRy3EraRFYfJQFR'}
    ];
    $rootScope.keys = [
        {id: 1, name: 'Mining wallet 1', hash160: 'ca23629e2647387e99542fc0b25cdf75e101c3c0', watch_only: true}
    ];
    $scope.connecting = false;
    $scope.pool_url = '';
    $scope.pool_user = '';
    $scope.selectedPool = 0;
    $scope.selectedKey = 0;
    $scope.toggleSelectedKey = function (id) {
        if ($scope.selectedKey == id) {
            $scope.selectedKey = 0
        } else {
            $scope.selectedKey = id;
        }
    };
    $scope.toggleSelectedPool = function (id) {
        if ($scope.connecting) return;
        if ($scope.selectedPool == id) {
            $scope.selectedPool = 0
        } else {
            $scope.selectedPool = id;
        }
    };
    $scope.setConnectAddress = function (addr) {
        console.log("Setting to addr: " + addr);
        $('#addNewPool').find('input[name=address]').val(addr);
    };
    $scope.hideKeyDropdown = function () {
//        $('#poolKeyDropdown').hide();
    };
    $scope.showKeyDropdown = function () {
//        $('#poolKeyDropdown').show();
    };
    (function () {
        var $loadElem = $('#loadStat');
        $loadElem.click(function () {
            $loadElem.hide().removeClass('fa-times').removeClass('failed').tooltipster('hide').tooltipster('content', '');
        });
    })();
    $scope.reconnectAlert = "";
    var timeouts = [];
    $scope.tryConnect = function (url, user) {
        if ($scope.connecting) return;
        var origUrl = url;
        var $loadElem = $('#loadStat');
        $loadElem.hide().removeClass('fa-times').removeClass('failed').tooltipster('hide').tooltipster('content', '');
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];
        $scope.connecting = true;
        console.log("Connecting to " + url + " user: " + user);
        NProgress.start();
        url = url.toLowerCase();
        if (url.substr(0, 7) !== "http://" && url.substr(0, 8) !== "https://") {
            url = "http://" + url;
        }
        while (url.substr(url.length - 1, 1) === '/') {
            url = url.substr(0, url.length - 1);
        }
        request(url + '/api/stats', function (err, response, body) {
            $scope.$apply(function () {
                $scope.connecting = false;
                NProgress.done();
                function error() {
                    // An error occured
                    console.log("Failed to connect to " + url + "/");
                    $loadElem.addClass('fa-times').addClass('failed').show().tooltipster('content', 'Failed to connect to \'' + origUrl + '\'').tooltipster('show', function () {
                        timeouts.push(setTimeout(function () {
                            $loadElem = $($loadElem.selector);
                            if ($loadElem.length) {
                                $loadElem.tooltipster('hide');
                            }
                        }, 4000));
                    });
                    $scope.reconnectAlert = 'Failed to connect to \'' + origUrl + '\'';
                }

                if (!err && response.statusCode == 200) {
                    console.log("Received body:", body);
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        return error();
                    }
                    $rootScope.pool = {
                        url: origUrl,
                        apiUrl: url,
                        user: user,
                        stats: body
                    };
                    $location.path('/pool');
                } else {
                    return error();
                }
            });
        });
    };
    $scope.removePool = function (id) {
        if ($scope.connecting) return;
        for (var i = 0; i < $rootScope.pools.length; i++) {
            if ($rootScope.pools[i].id === id) {
                $rootScope.pools.splice(i, 1);
                return;
            }
        }
    };
    $scope.getSelectedPool = function () {
        for (var i = 0; i < $rootScope.pools.length; i++) {
            if ($rootScope.pools[i].id === $scope.selectedPool) {
                return $rootScope.pools[i];
            }
        }
        return undefined;
    }
});

nompControllers.controller('PoolCtrl', function ($scope, $rootScope) {
    console.log("Pool:", $rootScope.pool);
});
