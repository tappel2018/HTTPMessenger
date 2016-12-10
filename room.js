UUID = require ("uuid");

function Room(name, size) {
  console.log("Here");
  this.uuid = UUID();
  this.name = name;
  this.size = size;
  this.clients = [];

  this.addClient = function (client) {
    this.clients.push(client);
  }

  this.removeClient = function(client) {
    for (var i = 0; i < this.clients.length; i++) {
      if (clients[i].uuid == client.uuid) {
        this.clients.splice(i, 1);
      }
    }
    if (this.clients.length == 0) {

      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].uuid == this.uuid) {
          rooms.splice(i, 1);
        }
      }

    }
    Room.roomEmitter.emit("roomUpdate");
    return;
  }
}

Room.roomEmitter = new EventEmitter();

module.exports = Room;
