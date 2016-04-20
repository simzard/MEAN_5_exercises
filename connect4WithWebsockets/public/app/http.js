// this is only for isolating all the http requests
// for the game

function httpGetGameState(callback) {
		$.ajax({
    		type: "POST",
    		url: "http://localhost:3000/gameapi/game",
    		data: JSON.stringify( {id: theGame.gameId } ),
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
