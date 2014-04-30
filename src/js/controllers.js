var request = require('request');

var nompControllers = angular.module('nompControllers', []);

nompControllers.controller('ConnectCtrl', function($scope, $rootScope, $timeout) {
    $scope.pools = [
        {id: 1, name: 'NompPool', url: 'example.com', user: '1KRotMnQpxu3sePQnsVLRy3EraRFYfJQFR'},
        {id: 2, name: 'NompPool', url: 'example.com', user: '1KRotMnQpxu3sePQnsVLRy3EraRFYfJQFR'},
        {id: 3, name: 'NompPool', url: 'example.com', user: '1KRotMnQpxu3sePQnsVLRy3EraRFYfJQFR'},
        {id: 4, name: 'TestPool', coin: 'BTC', url: '127.0.0.1:2000', user: '1KRotMnQpxu3sePQnsVLRy3EraRFYfJQFR'}
    ];
    $scope.connecting = false;
    $scope.pool_url = '';
    $scope.pool_user = '';
    $scope.selectedPool = 0;
    $scope.setSelectedPool = function(id) {
        if($scope.connecting) return;
        $scope.selectedPool = id;
    };
    (function() {
        var $loadElem = $('#loadStat');
        $loadElem.click(function () {
            $loadElem.removeClass('fa-times').removeClass('failed').tooltipster('content', '').tooltipster('hide');
        });
    })();
    $scope.reconnectAlert = "";
    var lastReconnectAlert = "";
    $scope.tryConnect = function(url, addr) {
        if($scope.connecting) return;
        var origUrl = url;
        var $loadElem = $('#loadStat');
        $loadElem.removeClass('fa-times').removeClass('failed').tooltipster('content', '').tooltipster('hide');
        $scope.connecting = true;
        console.log("Connecting to " + url + " with addr " + addr);
        NProgress.start();
        url = url.toLowerCase();
        if(url.substr(0, 7) !== "http://" && url.substr(0, 8) !== "https://") {
            url = "http://" + url;
        }
        while(url.substr(url.length - 1, 1) === '/') {
            url = url.substr(0, url.length - 1);
        }
        request(url + '/api/stats', function(err, response, body) {
            $scope.$apply(function() {
                $scope.connecting = false;
                NProgress.done();
                function error() {
                    // An error occured
                    console.log("Failed to connect to " + url + "/");
                    $loadElem.addClass('fa-times').addClass('failed').tooltipster('content', 'Failed to connect to \'' + origUrl + '\'').tooltipster('show', function() {
                        setTimeout(function() {
                            $loadElem.tooltipster('hide');
                        }, 4000);
                    });
                    console.log($loadElem[0]);
                    $scope.reconnectAlert = "Failed to connect to " + url + "/";
                }
                if (!err && response.statusCode == 200) {
                    try {
                        body = JSON.parse(body);
                    } catch(e) {
                        return error();
                    }
                    console.log(body);
                } else {
                    return error();
                }
            });
        });
    };
    $scope.removePool= function(id) {
        if($scope.connecting) return;
        for(var i = 0; i < $scope.pools.length; i++) {
            if($scope.pools[i].id === id) {
                $scope.pools.splice(i, 1);
                return;
            }
        }
    };
    $scope.getSelectedPool = function() {
        for(var i = 0; i < $scope.pools.length; i++) {
            if ($scope.pools[i].id === $scope.selectedPool) {
                return $scope.pools[i];
            }
        }
        return undefined;
    }
});