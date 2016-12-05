UUID = require ("uuid");

function Room(name, size) {
  this.myself = this;
  this.uuid = UUID();
  this.name = name;
  this.maxSize = size;
  this.clients = [];

  this.addClient = function (client) {
    this.clients.push(client);
  }

  this.removeClient = function(client) {
    for (var i = 0; i < myself.clients.length; i++) {
      if (clients[i].uuid == client.uuid) {
        clients.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}

Room.roomEmitter = new EventEmitter();
