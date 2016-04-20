// this file contains all the functions responsible for 
// making the right http requests for the game

function httpSendToServer(row, column, player, callback) {
	var moveData = {
		gameId: theGame.gameId,
		row: row,
	 	col: column,
	 	player: player
	};
	
	$.ajax({
   		type: "PUT",
   		url: "/gameapi/move",
   		// The key needs to match your method's input parameter (case-sensitive).
   		data: JSON.stringify(moveData),
   		contentType: "application/json; charset=utf-8",
   		dataType: "json",
   		success: function(game) {
   			theGame = game;
   			callback(game);
   		},
   		failure: function(errMsg) {
       		alert(errMsg);
   		}
	});
}

function httpGetServerMove(callback) {
	$.ajax({
   		type: "PUT",
   		url: "/gameapi/computerMove",
   		// The key needs to match your method's input parameter (case-sensitive).
   		data: JSON.stringify({id: theGame.gameId}),
   		contentType: "application/json; charset=utf-8",
   		dataType: "json",
   		success: function(game) {
   			callback(game);
  		},
   		failure: function(errMsg) {
       		alert(errMsg);
  		}
	});
}

function httpInitAI(callback) {
	$.ajax({
   		type: "POST",
   		url: "/gameapi/init_computer_opponent",
   		// The key needs to match your method's input parameter (case-sensitive).
   		data: JSON.stringify( {id: theGame.gameId} ),
   		contentType: "application/json; charset=utf-8",
   		dataType: "json",
   		success: function(game) {
   			callback(game);
   		},
   		failure: function(errMsg) {
       		alert(errMsg);
   		}
	});
}

function httpNewGame(playerName, callback) {
	$.ajax({
    	type: "POST",
    	url: "/gameapi/newgame",
    	data: JSON.stringify( {playerName: playerName} ),
    	contentType: "application/json; charset=utf-8",
    	dataType: "json",
    	success: function(game) {
       		callback(game);
      	},
    	failure: function(errMsg) {
        	alert(errMsg);
   		}
	});
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

function httpGetGameState(callback) {
	$.ajax({
   		type: "POST",
   		url: "/gameapi/game",
   		data: JSON.stringify( {id: theGame.gameId } ),
   		contentType: "application/json; charset=utf-8",
   		dataType: "json",
   		success: function(game) {
   			theGame = game;
   			callback(game);
   		},
   		failure: function(errMsg) {
       		alert(errMsg);
   		}
	});
};

function sendToServer(row, column, player) {
	httpSendToServer(row, column, player, function(game) {
		theGame = game;
		if (game.winner != null) {
   			drawWinnerText = true;
   		} else {
   			// now this function should handle both plays against the server or against a human opponent
   			getServerMove();
   		}
	});
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


