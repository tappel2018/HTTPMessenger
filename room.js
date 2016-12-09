UUID = require ("uuid");

function Room(name, size) {
  this.myself = this;
  this.uuid = UUID();
  this.name = name;
  this.maxSize = size;
  this.clients = [];
  this.addClient = function (client) {
    this.clients.push(client);
    Room.roomEmitter.emit("roomUpdate");
  }

  this.removeClient = function(client) {
    for (var i = 0; i < myself.clients.length; i++) {
      if (clients[i].uuid == client.uuid) {
        clients.splice(i, 1);
        Room.roomEmitter.emit("roomUpdate");
        return true;
      }
    }
    Room.roomEmitter.emit("roomUpdate");
    return false;
  }
}

Room.roomEmitter = new EventEmitter();
