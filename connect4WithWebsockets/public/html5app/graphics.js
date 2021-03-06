// this file contains graphics and animation related code

var startPieces = [];
// use this to make the pieces change to the same random color
var colorCounter = 0; 
var changeColor = false;
	
function initStartPieces() {
	var red = Math.floor(Math.random() * 256);
	var green = Math.floor(Math.random() * 256);
	var blue = Math.floor(Math.random() * 256);
	var color = "rgb(" + red  + ", " + green + ", " + blue + ")";
	// make 4 random colored pieces for the start menu 
	for (var i= 0; i < 4; i++) {
		var newPiece = new Piece(i * PIECE_WIDTH + 70 * i + 50,
								   HEIGHT / 2 + i * 60,
								   PIECE_WIDTH, PIECE_HEIGHT, 0, color);
		newPiece.vy = 4;
		startPieces.push(newPiece);
	}
}

var color;

var red = Math.floor(Math.random() * 256);
var green = Math.floor(Math.random() * 256);
var blue = Math.floor(Math.random() * 256);	
	
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

function animate(context) {
	if (playAnimation) {
		context.fillStyle = "rgb(0, 0, 0)";
		context.fillRect(0, 0, WIDTH, HEIGHT);
			
		switch(currentScreen) {
			case SCREENS.WELCOME_SCREEN:
				if ((colorCounter + 1) % 4 == 0) {
					colorCounter = 0;
					red = Math.floor(Math.random() * 256);
					green = Math.floor(Math.random() * 256);
					blue = Math.floor(Math.random() * 256);	
					color = "rgb(" + red  + ", " + green + ", " + blue + ")";
				}
			 
				for (var i = 0; i < 4; i++) {
					startPieces[i].updateStartScreen(color);
					startPieces[i].draw(context);
				}
			
				context.font = "40px Comic Sans MS";
				context.fillStyle = "white";
				context.textAlign = "center";
				context.fillText("Welcome to Connect 4! ", WIDTH/2, HEIGHT/4); 
				context.fillStyle = "grey";
				context.fillText("Click to play a game!", WIDTH/2, HEIGHT/4 + 60); 
				break;
			case SCREENS.CONNECTION_SCREEN:
				if (currentState == CONNECTION_STATES.NO_WAITING_GAME) {
					
					
					dotsTimerCounter++;
					if (dotsTimerCounter % 35 == 0) {
						dotsCount++;
						dotsTimerCounter = 0;
					}
										
					switch (dotsCount) {
						case 1:
							dots = "    ";
							break;
						case 2:
							dots = ".   ";
							break;
						case 3:
							dots = "..  ";
							break;
						case 4:
							dots = "... ";
							break;
						case 5:
							dots = "    ";
							dotsCount = 1;
					}
					
					
					context.fillStyle = "cyan";
					context.textAlign = "center";
					context.fillText(" Connecting" + dots, WIDTH/2, HEIGHT/4 + 60); 
					
					//context.fillStyle = "grey";
					//context.fillText("No opponents found yet!", WIDTH/2, HEIGHT/4 + 110); 
					context.fillStyle = "white";
					context.fillText("Wait for opopnent to connect ", WIDTH/2, HEIGHT/2 + 130);
					context.fillStyle = "magenta";
					context.fillText("OR click to play against server!", WIDTH/2, HEIGHT/2 + 180); 
					context.fillStyle = "white";
				} 
				
				
				break;
				
			case SCREENS.INSTRUCTIONS_SCREEN:
				COLOR_PLAYER = "rgb(" + 255 + ", " + green + ", " + blue + ")";
				COLOR_OPPONENT = "rgb(" + 0  + ", " + green + ", " + blue + ")";
		
				context.font = "40px Comic Sans MS";
				context.fillStyle = COLOR_PLAYER;
				context.textAlign = "center";
				context.fillText("You are this color!", WIDTH/2, HEIGHT/4); 
				context.fillStyle = COLOR_OPPONENT;
				context.fillText("Opponent(" + (opponentName || "") + ") is this color!", WIDTH/2, HEIGHT/4 + 60); 
				context.fillStyle = "white";
				context.fillText("Click on a column to drop a piece!", WIDTH/2, HEIGHT/4 + 90 * 1.75); 
				context.fillText("Connect 4 pieces in a line to win!", WIDTH/2, HEIGHT/4 + 90 * 2.5); 
				
				
				
				context.fillStyle = COLOR_PLAYER;
				currentTurn = TURN_STATES.PLAYER_TURN;
				context.fillText("You go first - click to start!", WIDTH/2, HEIGHT/4 + 90 * 4); 
				
				
				/*
				
				// display who goes first (player1 on the server always goes first)
				if (yourName == theGame.player1) {
					context.fillStyle = COLOR_PLAYER;
					currentTurn = TURN_STATES.PLAYER_TURN;
					context.fillText("You go first - click to start!", WIDTH/2, HEIGHT/4 + 90 * 4); 
				} else {
					context.fillStyle = COLOR_OPPONENT;
					currentTurn = TURN_STATES.OPPONENT_TURN;
					context.fillText(opponentName + " goes first - click to start!", WIDTH/2, HEIGHT/4 + 90 * 4); 
				}
				*/
				
				break;
			case SCREENS.GAME_SCREEN:
				context.strokeStyle = "gray";
   			   			
   				// this draws the columns
   				for (var column = 0; column < NUMBER_OF_COLUMNS; column++) {
   					context.beginPath()
   					context.moveTo(column * PIECE_WIDTH, 0);
   					context.lineTo(column * PIECE_WIDTH, HEIGHT);
   					context.stroke();	
   				}
   				for (var column = 0; column < NUMBER_OF_COLUMNS; column++) {
   					for (var i = 0; i < pieces[column].length; i++) {
   						pieces[column][i].update();
   						pieces[column][i].draw(context);
   					
   					}
   				}
   				
   				if (drawWinnerText) {
   					context.font = "40px Comic Sans MS";
			
					if (theGame.winner == yourName) {
						context.fillStyle = COLOR_PLAYER;
						context.textAlign = "center";
						context.fillText("You win!", WIDTH/2, HEIGHT/4); 	
					} else {
						context.fillStyle = COLOR_OPPONENT;
						context.textAlign = "center";
						context.fillText(opponentName + " wins!", WIDTH/2, HEIGHT/4); 	
					}
					context.fillStyle = "grey";
					context.fillText("Click again to play a new game!", WIDTH/2, HEIGHT/4 + 50); 
					nextGameClick = true;
				} else if (waitingForOpponent) {
					clickDisabled = true;
					context.fillStyle = COLOR_OPPONENT;
					context.font = "40px Comic Sans MS";
					context.fillText("Waiting for " + opponentName, WIDTH/2, HEIGHT/4); 	
   				} 
   				
				break;
		} // end switch statement			
				
		setTimeout(function() {
			animate(context);
		}, 1000 / 60);
    							
	}
}

function placeToken(column, color) {
	// place the y-coord half a height above - to show that it is falling
	pieces[column].push(new Piece(column * PIECE_WIDTH, 0 - PIECE_HEIGHT / 2,
								  PIECE_WIDTH, PIECE_HEIGHT, column, color));
}

