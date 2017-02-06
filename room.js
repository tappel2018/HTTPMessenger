UUID = require ("uuid");
CondensedClient = require("./condensedClient");
CondensedRoom = require("./condensedRoom");


function Room(name, size) {
  var myself = this;

  console.log("Here");
  this.uuid = UUID();
  this.name = name;
  this.size = size;
  this.clients = [];


  this.prevTime = (new Date()).getTime();

  this.acceleration = 0.0001;

  this.isLocked = true;

  this.addClient = function (client) {

    this.isLocked=true;

    for (var i = 0; i < this.clients.length; i++) {
      if (this.clients[i].uuid == client.uuid) {
        return;
      }
    }
    client.gameData = {};
    client.gameData.x = 50;
    client.gameData.y = 50;
    client.gameData.vx = 0;
    client.gameData.vy = 0;
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

    for (var i = 0; i <myself.clients.length; i++) {
      var curClient =myself.clients[i];
      if (curClient.keyMap[87]) {
        curClient.gameData.vy -= this.acceleration *dt;
      } else if (curClient.keyMap[83]) {
        curClient.gameData.vy += this.acceleration * dt;
      }

      if (curClient.keyMap[65]) {
        curClient.gameData.vx -= this.acceleration *dt;
      } else if (curClient.keyMap[68]) {
        curClient.gameData.vx += this.acceleration *dt;
      }



      if (curClient.gameData.vx > 0.1)
        curClient.gameData.vx = 0.1;

      if (curClient.gameData.vx < -0.1)
        curClient.gameData.vx = -0.1;

      if (curClient.gameData.vy > 0.1)
        curClient.gameData.vy = 0.1;

      if (curClient.gameData.vy < -0.1)
        curClient.gameData.vy = -0.1;

      if (curClient.gameData.x>525 && curClient.gameData.vx >0) {
          curClient.gameData.x-=550;
      }

      if (curClient.gameData.x<-25 && curClient.gameData.vx <0) {
          curClient.gameData.x+=550;
      }

      if (curClient.gameData.y>525 && curClient.gameData.vy >0) {
          curClient.gameData.y-=550;
      }

      if (curClient.gameData.y<-25 && curClient.gameData.vy <0) {
          curClient.gameData.y+=550;
      }

      curClient.gameData.x += curClient.gameData.vx *dt;
      curClient.gameData.y += curClient.gameData.vy *dt;



    }

    this.prevTime = new Date();

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
