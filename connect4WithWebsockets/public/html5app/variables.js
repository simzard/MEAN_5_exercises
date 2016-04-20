// this file contains all the global variables - mostly constants

var HEIGHT = 600;
var WIDTH = 700;
	
var NUMBER_OF_ROWS = 6;
var NUMBER_OF_COLUMNS = 7;
	
var PIECE_WIDTH = WIDTH / NUMBER_OF_COLUMNS;
var PIECE_HEIGHT = HEIGHT / NUMBER_OF_ROWS;	
		
var COLOR_PLAYER; 
var COLOR_OPPONENT;

var playAnimation = true;

// just write the name after the url like ?name for now
var guestPlayerName = location.search.substring(1);
	
var theGame = {
	player1: null
}


				
var pieces;
var bottom;
				
// flags
var sentToServer;
var drawWinnerText;
var clickDisabled;
var nextGameClick;

var opponentName;
var yourName;
	
var SCREENS = {
	WELCOME_SCREEN: 1,
	INSTRUCTIONS_SCREEN: 2,
	GAME_SCREEN: 3,
	CONNECTION_SCREEN: 4
};
	
var CONNECTION_STATES = {
	NO_WAITING_GAME: 1,
	WAITING_GAME: 2
}

var TURN_STATES = {
	PLAYER_TURN: 1,
	OPPONENT_TURN: 2
}
	
var currentScreen = SCREENS.WELCOME_SCREEN;
var currentState = CONNECTION_STATES.NO_WAITING_GAME;

// for dots animation in connection screen
var dotsCount = 0;
var dots = "    ";
var dotsTimer;
var dotsTimerCounter = 0;

// flag to set if waiting for opponent - used to display text
var waitingForOpponent = false;
var currentTurn;

// use web sockets instead of http calls :)
var socket = io();
