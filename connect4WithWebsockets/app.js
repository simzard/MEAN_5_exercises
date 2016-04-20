var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var gameAPI = require('./routes/gameAPI');

var gameApiMethods = require("./game/connect4");

var GameContainers = require('./model/model');

var app = express();

// call socket.io to the app
app.io = require('socket.io')();

app.set('json spaces', 2);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '0x12345yfhsakfh',
  cookie: { maxAge: 60*1000*5}
}))



app.use(function(req, res, next) {  
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header("Access-Control-Allow-Methods", "PUT, POST, GET");
    next();
});



app.use('/', routes);
app.use('/gameapi',function(req,res,next){
  req.isRestCall = true;
  next();
})
app.use('/gameapi', gameAPI);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err,req,res,next){
  if(req.hasOwnProperty("isRestCall")){
    res.status(400);
    res.json({error : {message : err.message}});
  }
  else{
    next();
  }
});
 //error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.io.on('connection', function(socket) {
	
	console.log('a user connected');
	socket.on('new game', function(playerName) {
		console.log("new game: Player =  " + playerName);
		gameApiMethods.newGameMulti(playerName, function (game) {
        	socket.emit('return new game', game);
        });
	});
	
	socket.on('get game', function(gameId) {
		console.log("get game: gameId = " + gameId);
		
		GameContainers.findOne({'game.gameId': gameId}, function (err, gameContainer) {
        	if (err) {
            	throw "Oooops in 'get game' tryig to find the id for this game:" + err;
        	}

        	if (gameContainer) {
            	// we have found the right game matching the id
            	socket.emit('return get game', gameContainer.game);
        	}
        });
	});
	
	
	socket.on('init ai', function(gameId) {
		console.log('init ai: gameId = ' + gameId);
		gameApiMethods.initServerPlayerMulti(gameId, function (game) {
        	socket.emit('return init ai game', game);
        });
    });
	
	socket.on('ai move', function(gameId) {
		console.log('ai move: gameId = ' + gameId);
	
		// scan through all the containers untill the right id has been matched
    	GameContainers.findOne({'game.gameId': gameId}, function (err, gameContainer) {
        	if (gameContainer) {
            	var game = gameContainer.game;
            	game = gameApiMethods.randomMove(game, 'B'); //Computer is always black
            	gameContainer.game = game;
            	gameContainer.save(function (err) {
                	if (err) {
                	    throw "Error in save:" + err;
                	}
                	socket.emit('return ai move game', game)
            	});
        	}
        });
    });
		
	socket.on('human move', function(move) {
		console.log('human move: move = ' + move);
		console.log(move.player);
		
		GameContainers.findOne({'game.gameId': move.gameId}, function (err, gameContainer) {
        	if (err) {
            	throw "Error in 'human move':" + err;
        	}
        	if (gameContainer) {
            	var game = gameContainer.game;
            	try {
                	game = gameApiMethods.placeToken(move.col, move.row, move.player, game);
                	//save the gameContainer with the updated move
                	gameContainer.game = game;
                	gameContainer.save(function (err) {
                    	if (err) {
                    	    throw "Error in save:" + err;
                    	}
                    	socket.emit('return human move game', gameContainer.game);
                	});
            	}
            	catch (error) {
            	    throw error;
            	    //res.json({error: {message: error.message}});
            	}
        	}
    	});
	});
	
});


module.exports = app;
