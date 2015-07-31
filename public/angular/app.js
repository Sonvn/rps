"use strict";


(function () {
    var randomItemInArray = function (array) {
        var i = Math.floor(Math.random() * array.length);
        return array[i];
    };

    var setResult = function (string) {
        $(document).find('#resultText').html(string);
    };

    angular.module('rps', [])
        .controller("rps.ctrl", function ($scope) {
            var runState;

            var states = ['r', 'p', 's'];

            $scope.view = {};
            $scope.view.state = states[0];
            $scope.view.gameStatuses = ['start', 'end'];
            $scope.view.gameStatus = $scope.view.gameStatuses[0];

            $scope.runState = function () {
                runState = setInterval(function () {
                    $scope.$applyAsync(function () {
                        $scope.view.state = randomItemInArray(states);
                    })
                }, 100);
            };

            $scope.stopRunState = function (time, callback) {
                setTimeout(function () {
                    clearInterval(runState);
                    if (callback) {
                        callback();
                    }
                }, time);
            };

            $scope.restart = function () {
                setResult('Select a move to start the game.');

                $scope.view.gameStatus = $scope.view.gameStatuses[0];

                var listItem = $(document).find('.user');
                listItem.each(function (index) {
                    $(this).addClass('item').removeClass('hidden-img').removeClass('choose');
                });
            };

            $scope.choose = function (userState) {

                if ($scope.view.gameStatus == $scope.view.gameStatuses[0]) {
                    var listItem = $(document).find('.user.item');
                    listItem.each(function (index) {
                        $(this).hasClass(userState) ? $(this).addClass('choose') : $(this).addClass('hidden-img').removeClass('item');
                    });
                    $scope.runState();
                    $scope.stopRunState(1000, function () {
                        $scope.$applyAsync(function () {
                            $scope.view.gameStatus = $scope.view.gameStatuses[1];
                            console.log($scope.view.gameStatus);
                            $scope.checkWinner(userState, $scope.view.state) == 1 ? setResult('you win') :
                                $scope.checkWinner(userState, $scope.view.state) == 0 ? setResult('draw') : setResult('computer win');
                        });
                    });
                } else {
                    setResult('Please Restart Game');
                }
            };

            $scope.checkWinner = function (player1State, player2State) {
                var alias = {
                    "r": 0,
                    "p": 1,
                    "s": 2
                };

                function check(p1, p2) {
                    return checkAlias(alias[p1], alias[p2]);
                }

                function checkAlias(p1, p2) {
                    //p1 win return 1
                    //p2 win return -1
                    //draw win return 0
                    return (p1 - p2 + 4) % 3 - 1;
                }

                return check(player1State, player2State);
            };

        })

    ;

})();