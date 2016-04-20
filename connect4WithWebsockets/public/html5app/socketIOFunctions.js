// this file contains all the functions responsible for 
// making the right http requests for the game - socket.io style :D




// every time we receive a 'game' event from the server - just update the game! :)
// need to to that in many ways - the same game must be updated in each of the listeners
socket.on('return new game', function(game) {
	console.log('return new game: theGame has been updated!!');
	theGame = game;
	console.log(theGame);
	// just start an ai game
	IOInitAI();
});

socket.on('return get game', function(game) {
	console.log('return get game: theGame has been updated!!');
	theGame = game;
});

socket.on('return init ai game', function(game) {
	console.log('return init ai game: theGame has been updated!!');
	theGame = game;
	opponentName = "Server";
	
});

socket.on('return ai move game', function(game) {
	console.log('return ai move game: theGame has been updated!!');
	theGame = game;
	if (theGame.winner != null) {
   		drawWinnerText = true;
   		clickDisabled = false;
   	}
	// now the AI has moved - show the animation
   	placeToken(theGame.lastMove.col, COLOR_OPPONENT);
});

socket.on('return human move game', function(game) {
	console.log('return human move game: theGame has been updated!!');
	theGame = game;
	
	socket.emit('ai move', theGame.gameId);
	
});

	

function IOHumanMove(row, column, player) {
	var moveData = {
		gameId: theGame.gameId,
		row: row,
	 	col: column,
	 	player: player
	};
	
	socket.emit('human move', moveData);
}

function IOGetAIMove() {

	socket.emit('ai move', theGame.gameId);
	
}

function IOInitAI() {
	
	socket.emit('init ai', theGame.gameId);
	
}

function IONewGame(playerName) {
	
	socket.emit('new game', playerName);
	
}

function httpPollGame(milliseconds, callback) {
	//alert("httpPollGame()");
	// this is only necessary when YOU are player1 - i.e. the first on the server
	function poll() {
		//alert("poll()");	
		httpGetGameState(function(game) {
			
			console.log("P2: " + game.player2);
			if (game.player2 != null) {
				// update the opponent name
				opponentName = game.player1 == yourName ? game.player2 : game.player1;
				// stop polling - opponent found
				currentState = CONNECTION_STATES.WAITING_GAME;
				// stop the timer
				clearTimeout(timer);
				callback(game);
			} else {
				timer = setTimeout(function () {
					poll();
				}, milliseconds);
			}
			
			
		});
	}
	var timer = setTimeout(function () {
		poll();
    }, milliseconds);	
			
}


function httpPollForNextMove(milliseconds, callback) {

	function poll() {
		httpGetGameState(function(game) {
			theGame = game;
			// 2 cases: You are player1 or you are player2
			if (yourName == theGame.player1) {
				if (game.turn == 'R') {
					callback(game);				
				} else {
					timer = setTimeout(function () {
						poll();
					}, milliseconds);	
				}
			} else {
				if (game.turn == 'B') {
					callback(game);
				} else {
					timer = setTimeout(function () {
						poll();
					}, milliseconds);
				}
			}
		});
	}
	
	var timer = setTimeout(function () {
		poll();
    }, milliseconds);	

		
}

function IOGetGameState() {
	socket.emit('get game', theGame.gameId);
};

function sendToServer(row, column, player) {
	var moveData = {
		gameId: theGame.gameId,
		row: row,
	 	col: column,
	 	player: player
	};
	
	
		socket.emit('human move', moveData);
	
};

// this should no matter what get the last move from the server
// doesn't matter whether AI or human opponent
// AI is already working

function getServerMove() {
	if (theGame.player2 == "Server") {
		httpGetServerMove(function(game){
			theGame = game;
			if (theGame.winner != null) {
   				drawWinnerText = true;
   				clickDisabled = false;
   			}
			// now the AI has moved - show the animation
   			placeToken(theGame.lastMove.col, COLOR_OPPONENT);
   			
		});
	} else {
		// now get the move from the human opponent
		
		// poll
		
		httpPollForNextMove(1000, function(game){
			theGame = game;
															
			// the opponenet has moved - get the last move
			placeToken(theGame.lastMove.col, COLOR_OPPONENT);
			waitingForOpponent = false;
			clickDisabled = false;
		}); 
	}	
}


