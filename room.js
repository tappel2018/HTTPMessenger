UUID = require ("uuid");
CondensedClient = require("./condensedClient");
CondensedRoom = require("./condensedRoom");
Physics = require("./public/shared/physics.js")


function Room(name, size) {
  var myself = this;

  this.uuid = UUID();
  this.name = name;
  this.size = size;
  this.clients = [];

  this.CondensedRoom = "";

  this.prevTime = (new Date()).getTime();

  this.isLocked = true;

  this.queue = new EventEmitter();

  this.addClient = function (client) {

    this.isLocked=true;

    for (var i = 0; i < this.clients.length; i++) {
      if (this.clients[i].uuid == client.uuid) {
        return;
      }
    }

    Physics.initClient(client)

    this.clients.push(client);

    if (this.clients.length == 1) {
      this.init();
    }

    this.isLocked = false;
  }

  this.init = function() {
    this.update();
    this.sendData();
  }

  this.removeClient = function(client) {
    this.isLocked = true;
    setTimeout(function() {
      myself.trueRemoveClient(client);
    }, 50)
  }

  this.trueRemoveClient = function(client) {
    for (var i = 0; i < this.clients.length; i++) {
      if (this.clients[i].uuid == client.uuid) {
        delete client.gameData;
        this.clients.splice(i, 1);
      }
    }
    if (this.clients.length == 0) {

      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].uuid == this.uuid) {
          rooms.splice(i, 1);
          return;
        }
      }

    }
    Room.roomEmitter.emit("roomUpdate");
    this.isLocked = false;

  }

  this.message = function(client, data) {

    this.clients.forEach(function(c) {
      c.socket.emit("message", {msg: client.name + ": " + data.msg, color: client.color});
    })

  }

  this.update = function() {

    if (this.islocked) {
      setTimeout(function() {myself.update()}, 100);
      return;
    }

    try {
      var dt = (new Date()).getTime() - this.prevTime;
      this.prevTime = new Date();
      var condensedRoom = Physics.calculatePhysics(myself, dt, "", myself);
      setTimeout(function() {myself.update()}, 15);
    } catch(e) {
      console.log(e)
    }
  }

  this.sendData = function () {

    if (this.islocked) {
      setTimeout(function() {myself.update()}, 100);
      return;
    }

    for (var i = 0; i <myself.clients.length; i++) {
      this.queue.emit("sendData", {client: i})
    }

    setTimeout(function() {myself.sendData()}, 20);
  }

  this.queue.on("sendData", function (data) {
    myself.clients[data.client].socket.emit("gameData", {roomData: new CondensedRoom(myself, true)});
  }); 



}

Room.roomEmitter = new EventEmitter();

module.exports = Room;
