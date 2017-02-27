UUID = require ("uuid");
CondensedClient = require("./condensedClient");
CondensedRoom = require("./condensedRoom");
Physics = require("./public/shared/physics.js")


function Room(name, size) {
  var myself = this;

  console.log("Here");
  this.uuid = UUID();
  this.name = name;
  this.size = size;
  this.clients = [];

  this.CondensedRoom = "";

  this.prevTime = (new Date()).getTime();

  this.isLocked = true;

  this.addClient = function (client) {

    this.isLocked=true;

    for (var i = 0; i < this.clients.length; i++) {
      if (this.clients[i].uuid == client.uuid) {
        return;
      }
    }

    Physics.initClient(client)

    this.clients.push(client);

    console.log(myself.clients);


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
    return;
  }

  this.message = function(client, data) {

    this.clients.forEach(function(c) {
      c.socket.emit("message", {msg: client.name + ": " + data.msg, color: client.color});
    })

  }

  this.update = function() {

    if (this.islocked)
      setTimeout(function() {myself.update()}, 5);
    var dt = (new Date()).getTime() - this.prevTime;
    this.prevTime = new Date();
    this.condensedRoom = Physics.calculatePhysics(myself, dt);
    setTimeout(function() {myself.update()}, 15);
  }

  this.sendData = function () {

    if (this.islocked)
      setTimeout(function() {myself.update()}, 5);

    for (var i = 0; i <myself.clients.length; i++) {
     myself.clients[i].socket.emit("gameData", {roomData: new CondensedRoom(myself, true)});
    }
    setTimeout(function() {myself.sendData()}, 30);
  }



}

Room.roomEmitter = new EventEmitter();

module.exports = Room;
