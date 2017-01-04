UUID = require ("uuid");

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
function CondensedRoom(room) {
  this.uuid = room.uuid;
  this.name = room.name;
  this.size = room.size;

  this.clients = [];

  for (var i = 0; i < room.clients.length; i++) {
    this.clients.push(room.clients[i].name);
  }

}

module.exports = CondensedRoom;
