/**
 * Created by simon on 3/16/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;

// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
        process.env.OPENSHIFT_APP_NAME;
}

// Connect to mongodb
var connect = function () {
    mongoose.connect(url);
};
connect();

var db = mongoose.connection;

db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});

db.on('disconnected', connect);

var GameContainerSchema = new Schema({
    waitingForPlayer2: Boolean,
    game: {
        player1: String,
        player2: String,
        player2IsServer: Boolean,
        gameId: String,
        turn: String,
        board: [Schema.Types.Mixed],
        moves: [{
            col: Number,
            row: Number,
            player: String
        }],
        moveCount: Number,
        lastMove: {
            col: Number,
            row: Number,
            player: String
        },
        gameState: Number,
        winner: String
    }
});


module.exports = mongoose.model('GameContainer', GameContainerSchema);
