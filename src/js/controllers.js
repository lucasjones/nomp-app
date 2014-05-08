var request = require('request');

var nompControllers = angular.module('nompControllers', []);

nompControllers.controller('ConnectCtrl', function ($scope, $rootScope, $location) {
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
        if (id == $scope.selectedPool) $scope.selectedPool = 0
        delete $rootScope.pools[id];
    };
});

nompControllers.controller('PoolCtrl', function ($scope, $rootScope) {
    console.log("Pool:", $rootScope.pool);
});
