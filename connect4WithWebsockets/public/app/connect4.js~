angular.module('connect4', [])

    .controller('connect4', function ($scope, $timeout, $http) {
        var RED = 'R', BLACK = 'B', MOVES = 0, FREE = '-',
            boardWidth = 7, boardHeight = 6,
            tokenIndex = 0, IN_DROP = false;

        var game;  //Refactor into a service
        $scope.playText = "Enter user name and press Play";
        $scope.username = "";
        $scope.status = "";

        document.getElementById("start_Game").disabled = false;
        //document.getElementById("play_Game").disabled = true;
        document.getElementById("name_edit").disabled = false;

        $scope.newGame = function () {
            document.getElementById("start_Game").disabled = true;
            //document.getElementById("play_Game").disabled = true;
            document.getElementById("name_edit").disabled = true;
            $scope.opopnent = null;
            $scope.status = "";
            $scope.playText = "Searching for opponent...";;
            MOVES = 0, tokenIndex = 0;
            if ($scope.username.length < 2) {
                $scope.error = "You must provide your user name (2 characters min.)";
                document.getElementById("start_Game").disabled = false;
                //document.getElementById("play_Game").disabled = true;
                document.getElementById("name_edit").disabled = false;
                return;
            }
            var user = {playerName: $scope.username};
            $http({method: "POST", url: "/gameapi/newgame", data: user}).then(function ok(response) {
                $scope.error = null;
                game = response.data;
                $scope.board = game.board;
                $scope.turn = game.turn;

                // if your username is the same as player 1 your opponent must be player2
                // and vice versa
                $scope.opponent = $scope.username == game.player1 ? game.player2 : game.player1;
                if ($scope.opponent == game.player1) {
                    $scope.color = 'BLACK';
                    $scope.oppColor = 'RED';
                } else {
                    $scope.color = 'RED';
                    $scope.oppColor = 'BLACK';
                }
                $scope.winner = null;

                function poll() {
                    $http({
                        method: "POST",
                        url: "/gameapi/game",
                        data: {id: game.gameId}
                    }).then(function ok(response) {
                        game = response.data;

                        if (game.player2) {
                            if ($scope.color == 'RED') {
                                $scope.status = "RED starts";
                                $scope.playText = "User just entered the game: " + game.player2;
                            } else if ($scope.color == 'BLACK') {
                                $scope.playText = "User just entered the game: " + game.player1;
                            }

                            $timeout.cancel(timer);

                            $scope.play();

                        } else {

                            if (confirm('No players found - press OK to play against server instead\n' +
                                    'or Cancel to wait for players to join')) {
                                //document.getElementById("play_Game").disabled = true;
                                $scope.status = "RED starts";
                                $scope.playText = 'Playing against... Server';
                                $scope.initComputerGame();
                            } else {
                                $timeout(function () {
                                    poll();
                                }, 2000);
                            }
                        }
                    }, function err(response) {
                    });
                };



                // every second second untill a user has joined the game scan for potential opponents
                var timer = $timeout(function () {
                    poll();
                }, 2000);




            }, function err(response) {
                console.log("Error: " + response.status + ", " + response.statusText);
                $scope.error = response.data.error.message;
            });
        };

        function sendMoveToServer(col, row, player) {
            moveData = {"gameId": game.gameId, "row": row, "col": col, "player": player};
            $http({method: "PUT", url: "/gameapi/move", data: moveData}).then(function ok(response) {
                $scope.error = null;
                game = response.data;
                $scope.board = game.board;
                $scope.turn = game.turn;
                $scope.winner = game.winner;
                if ($scope.winner) {
                    if ($scope.winner != "Stalemate") {
                        $scope.status = "Winner is " + $scope.winner;
                    } else {
                        $scope.status = "It was a draw!";
                    }
                    document.getElementById("start_Game").disabled = false;
                    //document.getElementById("play_Game").disabled = true;
                    document.getElementById("name_edit").disabled = false;
                    $scope.playText = "Enter user name and press Play";
                }

                //Use the $timeout function to automatically get a server move when "Play against the Server" is chosen
                $timeout(function () {
                    $scope.getServerMove();
                }, 100);
            }, function err(response) {
                console.log("Error: " + response.status + ", " + response.statusText);
                $scope.error = response.data.error.message;
            });
        }

        $scope.computersTurn = false;

        $scope.play = function () {


            // get the current game, to see if any player has joined
            $http({
                method: "POST",
                url: "/gameapi/game",
                data: {id: game.gameId}
            }).then(function ok(response) {
                    game = response.data;


                    $scope.opponent = $scope.username == game.player1 ? game.player2 : game.player1;
                    if ($scope.color == 'BLACK') {

                        $scope.status = 'Waiting for RED...';

                        // wait for RED player (p1) untill he/she has taken their first move
                        var timer = $timeout(function () {
                            poll();
                        }, 2000);

                        function poll() {

                            $http({
                                method: "POST",
                                url: "/gameapi/game",
                                data: {id: game.gameId}
                            }).then(function ok(response) {
                                game = response.data;
                                $scope.turn = game.turn;
                                if ($scope.turn == BLACK) {
                                    $scope.status = 'RED has moved!'
                                    $timeout.cancel(timer);
                                    // now RED must have moved
                                    $scope.winner = game.winner;
                                    if ($scope.winner) {
                                        if ($scope.winner != "Stalemate") {
                                            $scope.status = "Winner is " + $scope.winner;
                                        } else {
                                            $scope.status = "It was a draw!";
                                        }
                                        document.getElementById("start_Game").disabled = false;
                                        //document.getElementById("play_Game").disabled = true;
                                        document.getElementById("name_edit").disabled = false;
                                        $scope.playText = "Enter user name and press Play";
                                    }


                                    // manipulate $scope.turn since we are in BLACK's turn,
                                    // but the previous turns color was RED
                                    // which we want to show
                                    $scope.turn = $scope.turn === 'R' ? 'B' : 'R';
                                    $scope.placeToken(game.lastMove.col, true);
                                } else {

                                    timer = $timeout(function () {
                                        poll();
                                    }, 2000);

                                }


                            }, function err(response) {
                                $scope.error = response.data.error.message;
                            })
                        }


                    }

                }, function err(response) {
                    $scope.error = response.data.error.message;
                }
            );

        };

        $scope.initComputerGame = function () {
            $http({
                method: "POST",
                url: "/gameapi/init_computer_opponent",
                data: {id: game.gameId}
            }).then(function ok(response) {
                game = response.data;
                $scope.opponent = response.data.player2;
                $scope.error = null;
            }, function err(response) {
                $scope.error = response.data.error.message;
            });
        }

        $scope.getServerMove = function () {
            if (game.player2IsServer) {
                $http({
                    method: "PUT",
                    url: "/gameapi/computerMove",
                    data: {id: game.gameId}
                }).then(function ok(response) {
                    game = response.data;
                    //We don't use the updated board from the server. Only the lastMove and winner status is used
                    //This is done, to get the animation of a black piece being placed.
                    $scope.winner = game.winner;
                    if ($scope.winner) {
                        if ($scope.winner != "Stalemate") {
                            $scope.status = "Winner is " + $scope.winner;
                        } else {
                            $scope.status = "It was a draw!";
                        }
                        document.getElementById("start_Game").disabled = false;
                        //document.getElementById("play_Game").disabled = true;
                        document.getElementById("name_edit").disabled = false;
                        $scope.playText = "Enter user name and press Play";
                    }
                    $scope.placeToken(game.lastMove.col, true);
                }, function err(response) {
                    $scope.error = response.data.error.message;
                });
            } else { // human
                if ($scope.color == 'RED') {
                    $scope.status = 'Waiting for BLACK...';

                    // wait for BLACK player (p2) untill he/she has taken their next move
                    var timer = $timeout(function () {
                        poll();
                    }, 2000);

                    function poll() {
                        if ($scope.winner) {
                            $timeout.cancel(timer);
                        }
                        $http({
                            method: "POST",
                            url: "/gameapi/game",
                            data: {id: game.gameId}
                        }).then(function ok(response) {
                            game = response.data;
                            $scope.turn = game.turn;
                            if ($scope.turn == RED) {
                                $scope.status = 'BLACK has moved!';
                                $timeout.cancel(timer);
                                // now BLACK must have moved
                                $scope.winner = game.winner;
                                if ($scope.winner) {
                                    if ($scope.winner != "Stalemate") {
                                        $scope.status = "Winner is " + $scope.winner;
                                    } else {
                                        $scope.status = "It was a draw!";
                                    }
                                    document.getElementById("start_Game").disabled = false;
                                    //document.getElementById("play_Game").disabled = true;
                                    document.getElementById("name_edit").disabled = false;
                                    $scope.playText = "Enter user name and press Play";
                                }
                                // invert turn i.e. colors to draw the correct opponent color
                                $scope.turn = $scope.turn === 'R' ? 'B' : 'R';
                                $scope.placeToken(game.lastMove.col, true);
                            } else {
                                timer = $timeout(function () {
                                    poll();
                                }, 2000);


                            }


                        }, function err(response) {
                            $scope.error = response.data.error.message;
                        });
                    }


                } else if ($scope.color == 'BLACK') {
                    $scope.status = 'Waiting for RED...';
                    // wait for RED player (p1) untill he/she has taken his/her next move
                    var timer = $timeout(function () {
                        poll();
                    }, 2000);

                    function poll() {
                        if ($scope.winner) {
                            $timeout.cancel(timer);
                        }
                        $http({
                            method: "POST",
                            url: "/gameapi/game",
                            data: {id: game.gameId}
                        }).then(function ok(response) {
                            game = response.data;
                            $scope.turn = game.turn;
                            if ($scope.turn == BLACK) {
                                $scope.status = 'RED has moved!';
                                $timeout.cancel(timer);
                                // now RED must have moved
                                $scope.winner = game.winner;
                                if ($scope.winner) {
                                    if ($scope.winner != "Stalemate") {
                                        $scope.status = "Winner is " + $scope.winner;
                                    } else {
                                        $scope.status = "It was a draw!";
                                    }
                                    document.getElementById("start_Game").disabled = false;
                                    //document.getElementById("play_Game").disabled = true;
                                    document.getElementById("name_edit").disabled = false;
                                    $scope.playText = "Enter user name and press Play";
                                }
                                $scope.turn = $scope.turn === 'R' ? 'B' : 'R';
                                $scope.placeToken(game.lastMove.col, true);
                            } else {
                                timer = $timeout(function () {
                                    poll();
                                }, 2000);
                            }
                        }, function err(response) {
                            $scope.error = response.data.error.message;
                        });
                    }
                }
            }
        };

        $scope.setStyling = function (value) {
            if (value === 'R') {
                return {"backgroundColor": "#FF0000"};
            }
            else if (value === 'B') {
                return {"backgroundColor": "#000000"};
            }
            return {"backgroundColor": "white"};
        };

        $scope.placeToken = function (column, remoteMove) {
            $scope.error = null;
            if ($scope.winner != null && remoteMove === undefined) {
                return;
            }

            if ($scope.color == 'RED' && (remoteMove === undefined) && (game.turn === 'B')) {
                $scope.error = "Not your turn to move";
                return;
            }

            if ($scope.color == 'BLACK' && (remoteMove === undefined) && (game.turn === 'R')) {
                $scope.error = "Not your turn to move";
                return;
            }

            if (game !== undefined && (game.player1 === null || game.player2 === null )) {
                $scope.error = "No opponent found for this game";
                return;
            }
            if (!IN_DROP && $scope.board[column][0] === FREE) {
                MOVES++;
                tokenIndex = 0;
                $scope.board[column][tokenIndex] = $scope.turn;
                IN_DROP = true;

                dropToken(column, $scope.turn, remoteMove);
                $scope.turn = $scope.turn === 'R' ? 'B' : 'R';
            }
        };

        function dropToken(column, player, remoteMove) {

            if ($scope.board[column][tokenIndex + 1] === FREE) {
                $timeout(function () {
                    $scope.board[column][tokenIndex] = FREE;
                    $scope.board[column][++tokenIndex] = player;
                    dropToken(column, player, remoteMove);

                }, 75);
            } else {
                if (remoteMove === undefined) {
                    sendMoveToServer(column, tokenIndex, player);
                }
                IN_DROP = false;
            }
        }
    });