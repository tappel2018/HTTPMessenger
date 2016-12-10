UUID = require ("uuid");

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
