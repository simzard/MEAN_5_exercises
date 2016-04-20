$(document).ready(function() {

	// events I need to emit and respond to:
	// Server should send a 'playerConnected' event, when a player is connected - the client should of course initiate it
	// 'new game' event	


	// events I will need to send(emit) to the server via the socket and events I need to listen for:
	//
	// 'new game' -->  'game'
	// 'get game' --> 'game'
	// 'init ai' --> 'game'
	// 'ai move' --> 'game'
	// 'human move' --> 'game' 
	

	var canvas = $("canvas").get(0);
	var context = canvas.getContext("2d");

	function resetGameBoard() {
		// reset flags
		sentToServer = false;
		clickDisabled = false;
		drawWinnerText = false;
		nextGameClick = false;
		waitingForOpponent = false;
		
		// the board - divided into NUMBER_OF_COLUMNS subarrays - one for each column
		pieces = [];
		for (var column = 0; column < NUMBER_OF_COLUMNS; column++) {
			pieces[column] = new Array();
		}
		// initialize the bottom array
		bottom = [];
		for (var i = 0; i < NUMBER_OF_COLUMNS; i++) {
			bottom[i] = HEIGHT - PIECE_HEIGHT;
		}
	}
	
	// returns if current move based on the column is a valid move
	function moveIsValid(column) {
		return bottom[column] >= 0;
	}
	
	function startNewGame(playerName) {
		red = Math.floor(Math.random() * 256);
		green = Math.floor(Math.random() * 256);
		blue = Math.floor(Math.random() * 256);	
	
		// make sure colors are not too dark - they are on a black background	
		if (red < 50) {
			red += 50;
		}
	
		if (green < 50) {
			green += 50;
		}
	
		if (blue < 50) {
			blue += 50;
		}
	
		currentState = CONNECTION_STATES.NO_WAITING_GAME
		// user has clicked past the Welcome screen, so make a connection to the server
		// to send the sgnal that a game is available or otherwise join an already 
		// waiting game
					
		
		IONewGame(playerName); // this will cause the theGame to automatically be updated when it is ready
		
		//nextGameClick = false;
		
		/*		
			
					
		httpNewGame(playerName, function(game) {												
			theGame = game;
						
			// find out if YOU are the player1 or player2 on the server
			// if you find a waiting game YOU will be player2
			// if not YOU will be player1
			if (game.player2 == null) {
				yourName = game.player1;
				// poll to see if a player has connected every second
				httpPollGame(1000, function(game) {
					// this means we have an connection to the opponent
					theGame = game;
					// set the instructions screen
					currentScreen = SCREENS.INSTRUCTIONS_SCREEN;
				});
							
					
				currentScreen = SCREENS.CONNECTION_SCREEN;	
			} else {
				yourName = game.player2;
				opponentName = game.player1;
				// set the instructions screen - since opponent is connected
				currentScreen = SCREENS.INSTRUCTIONS_SCREEN;
			}
												
		});
		*/
	}
	
	$(window).mousedown(function(e) {
		// only respond to clicks INSIDE the canvas - (not below it or to the right from it)
		if (e.pageY < HEIGHT && e.pageX < WIDTH) {
		
			switch(currentScreen) {
				case SCREENS.WELCOME_SCREEN:
					
					startNewGame(guestPlayerName);
					currentScreen = SCREENS.INSTRUCTIONS_SCREEN;
					break;
					
				case SCREENS.CONNECTION_SCREEN:
					// this means the user is tired of waiting for a human opponent and clicks
					// to play against the server
					httpInitAI(function(game) {
						theGame = game;
						currentScreen = SCREENS.INSTRUCTIONS_SCREEN;
					})					
					break;
					
				case SCREENS.INSTRUCTIONS_SCREEN:
					// this is executed when you click in the instructions screen
					resetGameBoard();
					currentScreen = SCREENS.GAME_SCREEN;
					/*
					if (yourName == theGame.player2) {
						waitingForOpponent = true;
						
						httpPollForNextMove(1000, function(game){
								theGame = game;
								
								// the opponenet has moved - get the last move
								placeToken(theGame.lastMove.col, COLOR_OPPONENT);
								waitingForOpponent = false;
								clickDisabled = false;
						});
						
					}
					*/
					break;
					
				case SCREENS.GAME_SCREEN:
					// if the nextGameClick is NOT set, we don't need to start a new game
					if (!nextGameClick) {
					
						// logic for which player you are - i.e. if you start or should wait for 
						// the other player
						
						// disable clicking until the opponent has responded
						if (!clickDisabled) {
							// this block is executed whten you click on a column
							clickDisabled = true;
							var col = Math.floor(e.pageX / PIECE_WIDTH);
							if (col < NUMBER_OF_COLUMNS) {
						 		if (moveIsValid(col)) {
									placeToken(col, COLOR_PLAYER);
									// the move has been displayed, but not been sent to the server yet
									// this flag will be updated, when the piece has hit bottom
									// and is currently handled in the update method of the piece
									sentToServer = false; 
								} else {
									console.log("You cannot put a token at column: " + col);
									clickDisabled = false;
								}
							}	
						}
					} else {
						// this means the nextGameClick is set and we want to play a new game
						startNewGame(guestPlayerName);
					}
					break;
			} 
		}
	});

	initStartPieces();

	setTimeout(function() {
		animate(context);
	}, 1000 / 60);
			
});
