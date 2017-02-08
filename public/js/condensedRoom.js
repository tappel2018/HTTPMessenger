/*This is required so that you don't send over
a room that contains a client
that contains the room that contains the client
that contains the room that contains the client
that contains the room that contains the client
that contains the room that contains the client
that contains the room that contains the client


*/

//Send TRUE to gameData if you would also like to send game data
function CondensedRoom(room, gameData) {
  this.uuid = room.uuid;
  this.name = room.name;
  this.size = room.size;

  this.clients = [];

  for (var i = 0; i < room.clients.length; i++) {
    this.clients.push(new CondensedClient(room.clients[i], gameData));
  }

}
