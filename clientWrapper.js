function clientWrapper (socket, name, uuid) {
  var myself = this;
  this.socket = socket;
  this.name = name;
  this.uuid = uuid;

  this.room = "";
  this.connectTime = new Date();
  this.color = HSVtoHex(360*clientWrapper.angle, 1.0, 0.7);
  clientWrapper.angle += 0.61803398875; //Inverse golden ratio; ensures colors are different enough from each other
  clientWrapper.angle %= 1;

  this.keyMap = {};

  this.disconnect = function() {
    console.log("Player disconnected: " + myself.uuid);
    myself.leaveRoom();
    return;
  }

  this.receiveMessage = function(data) {

    console.log("User: " + myself.uuid + " / Message: " + data.msg)

    if (myself.room == "") {
      myself.socket.emit("messageFromServer", {msg: "Invalid request: not in a room"});
      return;
    }

    if (data.msg != "") {
      myself.room.message(myself, data);
    }

    return;
  }

  this.receiveGameData = function(keyMap) {
    if (myself.room == "") {
      myself.socket.emit("messageFromServer", {msg: "Invalid request: not in a room"});
      return;
    }

    myself.keyMap = keyMap;
  }

  this.joinRoom = function (data) {
    //Find room of same id
    console.log("Player: " + myself.uuid + " joining room: " + data.uuid);


    if (data.uuid == myself.room.uuid) {
      myself.socket.emit("messageFromServer", {msg: "You are already in room: " + myself.room.name });
      return;
    }



    var room = rooms.find(function (element) {
      if (element.uuid == data.uuid) {
        return true;
      } else {
        return false;
      }
    });

    if (room.size == room.clients.length) {
      myself.socket.emit("messageFromServer", {msg: room.name + " is full."});
      return;
    }

    if (typeof room === undefined ){
      myself.socket.emit("messageFromServer", {msg: "The room that you tried to request does not exist."});
      return;
    }

    try {
      myself.leaveRoom();
    } catch (e){
      console.log(e);
    }

    myself.room = room;
    room.addClient(myself);

    Room.roomEmitter.emit("roomUpdate");
    myself.socket.emit("roomEntered", {uuid: room.uuid});
  }

  this.createRoom = function (data) {

    if (isNaN(data.size) || data.size<1) {
      myself.socket.emit("messageFromServer", {msg: "Please enter a valid room size."});
      return;
    }

    console.log("Creating room:" + data.name);

    try {
      myself.leaveRoom();
    } catch (e) {
      console.log(e);
    }

    var room = new Room(data.name, data.size);
    room.addClient(myself);
    myself.room = room;
    rooms.push(room);
    Room.roomEmitter.emit("roomUpdate");
    myself.socket.emit("roomEntered", {uuid: room.uuid});

  }

  this.leaveRoom = function () {

    console.log("Player: " + myself.uuid + " leaving room: " + myself.room.uuid);

    try {
      myself.room.removeClient(myself);
    } catch (e) {
      console.log(e);
    }

    myself.room = "";

    Room.roomEmitter.emit("roomUpdate");
    myself.socket.emit("roomLeft", {uuid: myself.room.uuid});

  }

  this.socket.on('disconnect', this.disconnect);
  this.socket.on('message', this.receiveMessage);
  this.socket.on('joinRoom', this.joinRoom);
  this.socket.on('createRoom', this.createRoom)
  this.socket.on('leaveRoom', this.leaveRoom);
  this.socket.on('gameData', this.receiveGameData);


}

clientWrapper.angle=0.0;

var HSVtoHex = function(h, s, v) {
  var rgb, i, data = [];
  if (s === 0) {
    rgb = [v,v,v];
  } else {
    h = h / 60;
    i = Math.floor(h);
    data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
    switch(i) {
      case 0:
        rgb = [v, data[2], data[0]];
        break;
      case 1:
        rgb = [data[1], v, data[0]];
        break;
      case 2:
        rgb = [data[0], v, data[2]];
        break;
      case 3:
        rgb = [data[0], data[1], v];
        break;
      case 4:
        rgb = [data[2], data[0], v];
        break;
      default:
        rgb = [v, data[0], data[1]];
        break;
    }
  }
  return '#' + rgb.map(function(x){
    return ("0" + Math.round(x*255).toString(16)).slice(-2);
  }).join('');
};


module.exports = clientWrapper;
