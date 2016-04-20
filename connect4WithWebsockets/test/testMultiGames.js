/**
 * Created by simon on 3/15/16.
 */
var request = require('request');
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

var gameContainers = [];

describe('/gameapi/newgame - multiversion', function() {
    var options = {
        url: "http://localhost:" + TEST_PORT + "/gameapi/newgame",
        method: "POST",
        json: true
    };
    // 5 players want a new game
    it('should assign 4 players to 2 game containers, and 1 player to a waiting game',function(done){
        options.body = {playerName: "p1"}
        request(options, function (error, res, body) {
            var game = body;
            expect(game.player1).to.be.equal("p1");
            expect(game.player2).to.be.equal(null);
        });

        options.body = {playerName: "p2"};
        request(options, function (error, res, body) {
            var game = body;
            expect(game.player1).to.be.equal("p1");
            expect(game.player2).to.be.equal("p2");
        });

        options.body = {playerName: "p3"};
        request(options, function (error, res, body) {
            var game = body;
            expect(game.player1).to.be.equal("p3");
            expect(game.player2).to.be.equal(null);
        });

        options.body = {playerName: "p4"};
        request(options, function (error, res, body) {
            var game = body;
            expect(game.player1).to.be.equal("p3");
            expect(game.player2).to.be.equal("p4");
        });

        options.body = {playerName: "p5"};
        request(options, function (error, res, body) {
            var game = body;
            expect(game.player1).to.be.equal("p5");
            expect(game.player2).to.be.equal(null);
        });

        // now connect a server - to the 5th game
        options = {
            url: "http://localhost:" + TEST_PORT + "/gameapi/init_computer_opponent",
            method: "POST",
            json: true
        };

        options.body = {id: "someID"}; // id's not being used
        request(options, function (error, res, body) {
            var game = body;
            expect(game.player1).to.be.equal("p5");
            expect(game.player2).to.be.equal("Server");
        });
        done();
    });
});