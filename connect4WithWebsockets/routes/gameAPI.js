var express = require('express');
var router = express.Router();
var gameApi = require("../game/connect4");

var GameContainers = require('../model/model');

// WITH WEBSOCKETS: This will pretty much be obsolete, since the objects and database checks should 
// be done in the event - maybe some functions should be defined in order to seperate the parts
// and keep the program easier to maintain.



// THINKING:
// When a user requests a new game, it should:
// Search through all of the gameContainers and if there is
// a waitingGame add that user to that particular game and return that gameId
// if there's NOT a waiting game, create a new waiting game and add the user to that game
// and return that id

// When we want to play a game:
// Every time when we need a gameContainer scan through every gameContainer until we
// find the gameContainer with the right ID

// SUB-THOUGHT: Then the newGame factory method should take the ARRAY of containers
//              and then - will of course be replaced by a collection in the database


// changed to POST since we need to pass the gameId since there now can be several games
router.post("/game", function (req, res, next) {
    var obj = req.body;
    GameContainers.findOne({'game.gameId': obj.id}, function (err, gameContainer) {
        if (err) {
            throw "Oooops in api/game tryig to find the id for this game:" + err;
        }

        if (gameContainer) {
            // we have found the right game matching the id
            res.json(gameContainer.game);
        }
    });
});
// this endpoint takes a player name as input in req.body
// and returns a game
router.post("/newgame", function (req, res, next) {
    var playerObj = req.body;
    console.log("Here is the object:");
    for (prop in playerObj) {
    	console.log(prop + ": " + playerObj[prop]);
    }
    //console.log("received in req.body" + req.body);
    gameApi.newGameMulti(playerObj.playerName, function (result) {
        res.json(result);
    });
});

router.post("/init_computer_opponent", function (req, res, next) {
    var obj = req.body;
    console.log(obj.id);
    gameApi.initServerPlayerMulti(obj.id, function (result) {
        res.json(result);
    });
});

router.put("/computerMove", function (req, res, next) {
    var obj = req.body;
    var gameId = obj.id;
    // scan through all the containers untill the right id has been matched
    GameContainers.findOne({'game.gameId': gameId}, function (err, gameContainer) {
        if (gameContainer) {
            var game = gameContainer.game;
            game = gameApi.randomMove(game, 'B'); //Computer is always black
            gameContainer.game = game;
            gameContainer.save(function (err) {
                if (err) {
                    throw "Error in save:" + err;
                }
                res.json(game);
            });
        }
    });
});

// multi game version
router.put("/move", function (req, res, next) {
    var move = req.body;
    console.log("Here is the move object:");
    for (prop in move) {
    	console.log(prop + ": " + move[prop]);
    }
    console.log(move.gameId);
    GameContainers.findOne({'game.gameId': move.gameId}, function (err, gameContainer) {
        if (err) {
            throw "Error in api/move:" + err;
        }
        if (gameContainer) {
            var game = gameContainer.game;
            try {
                game = gameApi.placeToken(move.col, move.row, move.player, game);
                //save the gameContainer with the updated move
                gameContainer.game = game;
                gameContainer.save(function (err) {
                    if (err) {
                        throw "Error in save:" + err;
                    }
                    res.json(game);
                });
            }
            catch (error) {
                res.json({error: {message: error.message}});
            }
        }

    });
});

// ------------------------------ EXTRA api for statistics--------------

//A method to get a list of all games a player, given the player-id, has played
router.get('/games/:playerId', function (req, res, next) {
    var playerId = req.params.playerId;
    GameContainers.find({
        $or: [{'game.player1': playerId},
            {'game.player2': playerId}]

    }, function (err, gameContainers) {
        if (err) {
            throw err;
        }
        var games = [];

        for (var i = 0; i < gameContainers.length; i++) {
            games.push(gameContainers[i].game);
        }
        res.json(games);

    });


});

// A method to get a specific game, given a gameId
router.get('/game/:id', function (req, res, next) {
    var id = req.params.id;
    console.log("id= " + id);
    GameContainers.findOne({'game.gameId': id}, function (err, gameContainer) {
        if (err) {
            throw err;
        }
        res.json(gameContainer.game);
    })
});

module.exports = router;
