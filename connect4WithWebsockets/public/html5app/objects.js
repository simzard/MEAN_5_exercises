// this file contains the objects for the game

var Piece = function(x, y, width, height, column, color) {
	this.falling = true;
	this.column = column;
	this.x = x;
	this.y = y;
	this.vy = 3;
	this.width = width;
	this.height = height;
	this.color =  color;
			
	this.draw = function(context) {
		context.fillStyle = this.color;
		var centerX = this.x + 0.5 * this.width;
		var centerY = this.y + 0.5 * this.height;
		context.beginPath();
		context.arc(centerX, centerY, 0.5 * this.width, 0, 2 * Math.PI, false);
		context.fill();
	}

	// this is just functionality behaviour of of the startScreen
	this.updateStartScreen = function(color) {
		if (color) {
			this.color = color;
		}
		// do something funny with animation here! :)
		if (this.falling) {
			this.y += this.vy;
			//this.vy += 1.5;
			if (this.y > HEIGHT - PIECE_HEIGHT / 2 - 70) {
				this.falling = false;
				this.vy = -4;
				
				colorCounter++;
				
			}
		} else {
			this.y += this.vy;
			//this.vy -= 1.5;
			if (this.y < HEIGHT / 3 + 50) {
				this.falling = true;
				this.vy = 4;
				
				colorCounter++;
				
			}
		}
	}
	
	this.update = function() {
		if (this.falling) {
		// when a token animation is started disable the clicking option
			clickDisabled = true;
			
			// make the token fall by increasing its y-coord - and add a little gravity / acceleration
			this.y += this.vy;
			this.vy += 2;
			
			// when we have hit the bottom of a column
			if (this.y > bottom[this.column]) {
			
				if (theGame.winner != null) {
   					drawWinnerText = true;
   				} else if (this.color == COLOR_OPPONENT) {
					// if it's the opponenets color, make cliking possible again
					// that is - unlock the mouse clicking and the waiting text
					clickDisabled = false;
					waitingForOpponent = false;
					sentToServer = true;
				} else {
					if (theGame.winner != null) {
   						drawWinnerText = true;
   						clickDisabled = false;
   					} else {
						clickDisabled = true;
						waitingForOpponent = true;
					}
				}
						
						
				// increase the bottom for that particular column
				this.y = bottom[this.column];
				bottom[this.column] -= PIECE_HEIGHT;
				
				console.log("bottom[" + this.column + "] = " + bottom[this.column]);
				
				// we already have the column - calculate the row as well
				//var row = NUMBER_OF_ROWS - (2 + bottom[this.column] / PIECE_HEIGHT);
				var row = bottom[this.column] / PIECE_HEIGHT + 1;
				
				//alert("row: " + row + ",  col: " + this.column);
				
				
				// make the token stop moving
				this.vy = 0;
				this.falling = false;
				
				// send the move  to the server
				// sentToServer makes sure, that we only do this once per click
				if (!sentToServer) {
					
					var yourColorROrB = 'R'; //theGame.player1 == yourName ? 'R' : 'B';
					sendToServer(row, column, yourColorROrB);
					sentToServer = true;
				} 
			}
		 }
	}
};
