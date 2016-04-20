var request = require("request");
var expect = require("chai").expect;
var http = require("http");
var app = require('../app');
var server;
var TEST_PORT = 3456;
before(function (done) {
    var app = require('../app');
    server = http.createServer(app);
    server.listen(TEST_PORT, function () {
        done();
    });
});
after(function (done) {
    server.close();
    done();
});

var ID;

describe("POST: /gameapi/newgame ", function () {
    var options = {
        url: "http://localhost:" + TEST_PORT + "/gameapi/newgame",
        method: "POST",
        json: true
    };
    it("should get a Game Object (Player-1)", function (done) {
        options.body = {playerName: "p1"}
        request(options, function (error, res, body) {
            var game = body;
            // why can't I save the ID like this???
            ID = game.gameId;
            console.log(ID);
            expect(game.player1).to.be.equal("p1");
            done();
        });
    });
});

describe("POST: /gameapi/init_computer_opponent ", function () {

    // why is ID not defined here?
    console.log('ID: ' + ID);
    var options = {
        url: "http://localhost:" + TEST_PORT + "/gameapi/init_computer_opponent",
        method: "POST",
        json: true
    };
    it("should get a Game object back with the Server being Player 2", function (done) {
        options.body = {playerName: "p1"};
        request(options, function (error, res, body) {
            var game = body;
            console.log(game);
            expect(game.player2).to.be.equal("Server");
            done();
        });
    });
});
/*
describe("PUT: /gameapi/move ", function () {
    // why is ID not defined here?
    console.log('ID: ' + ID);
    it("should get a Game object back with the changed board state", function (done) {
        var options = {
            url: "http://localhost:" + TEST_PORT + "/gameapi/move",
            method: "PUT",
            json: true
        };

        moveData = {"gameId": game.gameId, "row": 6, "col": 0, "player": "p1"};
        options.body = moveData;
        request(options, function (error, res, body) {
            var game = body;
            console.log("game: " + game)
            expect(game.player1).to.be.equal("p1");
            done();
        });
    });
});
*/