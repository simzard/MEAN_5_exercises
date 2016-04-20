var uuid = require('uuid');
var GameContainers = require('../model/model.js');

var CONST = {
    NOT_STARTED: 0,
    RUNNING: 1,
    GAME_OVER: 2,
    BOARD_COLS: 7,
    BOARD_ROWS: 6,
    EMPTY_FIELD: '-',
    RED: 'R',
    BLACK: 'B'
};

function gameFactoryMulti(playerName, callback) {
    var newGame;

    // find a GameContainer in the database which has a waitingGame
    // available container with a waiting game
    GameContainers.findOne({waitingForPlayer2: true}, function (err, gameContainer) {
        if (err) {
            throw "Ooops in add second player: " + err;
        }
        if (gameContainer) {
            // now we have the next waiting game
            newGame = gameContainer.game;

            newGame.player2 = playerName;
            newGame.gameState = CONST.RUNNING;

            GameContainers.update({_id: gameContainer._id}, {
                $set: {
                    waitingForPlayer2: false,
                    game: newGame
                }
            }, function (err) {
                if (err) {
                    throw "Oooops in update p2: " + err;
                }
                callback(newGame);
            });

        } else {
            // at this point there were no waiting games, so
            // 1. make a new game
            // 2. add the player to the new game
            // 3. Add that game to a new container and make that game waiting
            // 4. Persist it to the database

            newGame = {
                player1: playerName,
                player2: null,    //null for a true multiplayer game
                player2IsServer: false,
                gameId: uuid.v4(),
                turn: CONST.RED,
                board: [],      //The current board '-' Blank, 'R': Red, 'B' : Black
                moves: [],      //All moves performed in the game (each move as in lastMove)
                moveCount: 0,
                lastMove: null, //Last move as: {"col": 3,"row": 5,"player": "R"}
                gameState: CONST.NOT_STARTED, //0: not Started, 1: running, 2: Game Over
                winner: null    //set to stalemate if no winner
            };

            for (var i = 0; i < CONST.BOARD_COLS; i++) {
                newGame.board[i] = [];
                for (var j = 0; j < CONST.BOARD_ROWS; j++) {
                    newGame.board[i][j] = CONST.EMPTY_FIELD;
                }
            }

            var newGameContainer = GameContainers({
                waitingForPlayer2: true,
                game: newGame
            });

            newGameContainer.save(function (err) {
                if (err) {
                    throw "Ooops in save: " + err;
                }
                callback(newGame);
            });
        }
    });
};


function initServerPlayerMulti(id, callback) {
    // scan through all the gameContainers

    GameContainers.findOne({"game.gameId" : id, waitingForPlayer2: true}, function (err, gameContainer) {
        if (err) {
            throw "Ooops in initServerPlayerMulti: " + err;
        }

        if (gameContainer) {
            // we found a waiting game matching the current user game id
            var newGame = gameContainer.game;
            newGame.player2 = "Server";
            newGame.player2IsServer = true;
            newGame.gameState = CONST.RUNNING;
            gameContainer.waitingForPlayer2 = false;
            gameContainer.game = newGame;

            gameContainer.save(function (err) {
                if (err) {
                    throw "Oooops in save: " + err;
                }
            });

            callback(newGame);
        } else {
            // we didn't find an avaliable container with a waitingGame
            throw new Error("No Waiting player, to play against server");
        }
    });
}

function placeToken(col, row, player, game) {
    if (game.gameState !== CONST.RUNNING) {
        throw new Error("This game is over");
    }

    if (player !== game.turn) {
        throw new Error("Not " + player + "'s turn");
    }

    if (game.board[col][row] !== CONST.EMPTY_FIELD) {
        throw new Error("Illegal Move - Place is taken");
    }


    for (var i = row + 1; i < CONST.BOARD_ROWS; i++) {
        if (game.board[col][i] === CONST.EMPTY_FIELD) {
            throw new Error("Illegal Move - There are empty field(s) below");
        }
    }
    game.board[col][row] = player;
    game.turn = game.turn === 'R' ? 'B' : 'R';

    game.moveCount++;
    game.lastMove = {col: col, row: row, player: player};
    game.moves.push(game.lastMove);

    return checkForWin(col, row, player, game);
}

function checkForWin(column, row, player, game) {
    console.log("PLAYER: " + player + ", col: " + column + ", row: " + row);

    var i = row, in_a_row = 1;

    // Check Column Win
    while (i < CONST.BOARD_ROWS) {
        if (game.board[column][++i] === player) {
            if (++in_a_row === 4) {
                return gameOver(player, game);
            }
        }
        else {
            break;
        }
    }

    // Check Row Win
    var i = column, j = column,
        in_a_row = 1;
    while (--i >= 0) {
        if (game.board[i][row] === player) {
            in_a_row++;
        } else {
            break;
        }
        if (in_a_row >= 4) {
            return gameOver(player, game);
        }
    }

    while (++j < CONST.BOARD_COLS) {
        if (game.board[j][row] === player) {
            in_a_row++;
        } else {
            break;
        }
        if (in_a_row >= 4) {
            return gameOver(player, game);
        }
    }

    // Check Diaganol 1
    var i = column, j = column,
        ii = row, jj = row,
        in_a_row = 1;
    while (--i >= 0 && --ii >= 0) {
        if (game.board[i][ii] === player) {
            in_a_row++;
        } else {
            break;
        }
        if (in_a_row >= 4) {
            return gameOver(player, game);
        }
    }

    while (++j < CONST.BOARD_COLS && ++jj < CONST.BOARD_ROWS) {
        if (game.board[j][jj] === player) {
            in_a_row++;
        } else {
            break;
        }
        if (in_a_row >= 4) {
            return gameOver(player, game);
        }
    }

    // Check Diaganol 2
    var checkI = true, checkJ = true,
        i = column, j = column,
        ii = row, jj = row,
        in_a_row = 1;
    while (--i >= 0 && ++ii < CONST.BOARD_ROWS) {
        if (game.board[i][ii] === player) {
            in_a_row++;
        } else {
            break;
        }
        if (in_a_row >= 4) {
            return gameOver(player, game);
        }
        ;
    }

    while (++j < CONST.BOARD_COLS && --jj >= 0) {
        if (game.board[j][jj] === player) {
            in_a_row++;
        } else {
            break;
        }
        if (in_a_row >= 4) {
            return gameOver(player, game);
        }
    }

    if (game.moveCount === CONST.BOARD_COLS * CONST.BOARD_ROWS) {
        gameOver(null, game);
    }
    return game;


    function gameOver(player, game) {

        game.gameState = CONST.GAME_OVER;
        if (player) {
            game.winner = player === 'R' ? game.player1 : game.player2;
            return game;
        } else {
            return (game.winner = "Stalemate");
        }
    }
}

function makeRandomMove(game, player) {
    if (game.moveCount === CONST.BOARD_COLS * CONST.BOARD_ROWS) {
        throw new Error("No moves possible. This game is over");
    }

    if (player !== game.turn) {
        throw new Error("Not " + player + "'s turn");
    }

    var tokenPlaced = false;
    var col;
    while (!tokenPlaced) {
        col = Math.floor(Math.random() * CONST.BOARD_COLS);
        var row = CONST.BOARD_ROWS - 1;
        console.log("XXX: " + col);

        for (row; row >= 0; row--) {
            if (game.board[col][row] === CONST.EMPTY_FIELD) {
                game.board[col][row] = player;
                game.moveCount++;
                game.turn = game.turn === 'R' ? 'B' : 'R';
                game.lastMove = {col: col, row: row, player: player};
                game.moves.push(game.lastMove);
                tokenPlaced = true;
                break;
            }
        }
    }
    return checkForWin(col, row, player, game);
}

module.exports.connect4 = CONST;
module.exports.placeToken = placeToken;
module.exports.randomMove = makeRandomMove;
module.exports.newGameMulti = gameFactoryMulti;
module.exports.initServerPlayerMulti = initServerPlayerMulti;