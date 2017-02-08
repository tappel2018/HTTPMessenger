UUID = require ("uuid");
Room = require ("./room.js");
ClientWrapper = require ("./clientWrapper.js");

/*This is required so that you don't send over
a room that contains a client
that contains the room that contains the client
that contains the room that contains the client
that contains the room that contains the client
that contains the room that contains the client
that contains the room that contains the client
...
...
...
*/

//Send TRUE to gameData if you would also like to send game data
function CondensedClient(client, gameData) {

  this.name = client.name;

  this.color = client.color;

  this.keyMap = client.keyMap;


  this.gameData = "";

  if (client.gameData != null && gameData) {
    this.gameData = client.gameData;
  }


}

module.exports = CondensedClient;
