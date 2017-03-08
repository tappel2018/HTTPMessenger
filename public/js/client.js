
socket = io.connect('/')

UUID = "";

roomID = "";
rooms = [];

clientGameData = null;
serverGameData = null;

currentRoom = null;

name = null;

isClient = true;

var interrupt = false;

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

socket.on('onconnected', function ( data ) {
  console.log("Connection successful. UUID: " + data.id);
  UUID = data.id;

  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("Please enter your name."));
  document.getElementById("serverContainer").appendChild(toAppend);
})

socket.on('confirmed', function (data) {
  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("You have been connected to the server." ));
  document.getElementById("serverContainer").appendChild(toAppend);


  document.getElementById("nameInput").style.display = "none";
  document.getElementById("roomPane").style.display = "inline-block";
  document.getElementById("mainPane").style.display = "inline-block";

})

socket.on('disconnect', function ( data ) {
  console.log("Connection successful. UUID: " + data.id);
  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("You have lost connection to the server." ));
  document.getElementById("serverContainer").appendChild(toAppend);

  document.getElementById("nameInput").style.display = "block";
  document.getElementById("roomPane").style.display = "none";
  document.getElementById("mainPane").style.display = "none";

})

socket.on('message', function (data) {
  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode(data.msg));
  toAppend.style.color = data.color;
  console.log(data.color);

  var pane = document.getElementById("messageContainer");
  pane.appendChild(toAppend);
  pane.scrollTop = pane.scrollHeight;
})

socket.on('messageFromServer', function ( data ) {
  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode(data.msg));
  toAppend.style.color = data.color;

  var pane = document.getElementById("serverContainer");
  pane.appendChild(toAppend);
  pane.scrollTop = pane.scrollHeight;
})

socket.on('roomUpdate', function (data) {
  var pane = document.getElementById("roomList");
  pane.innerHTML = "";
  rooms = data.rooms;
  for (var i = 0; i < rooms.length; i++) {
    var a = document.createElement("a");
    a.setAttribute("href", "javascript:enterRoom(" + i + ")");
    a.innerHTML = data.rooms[i].name + " -- " + data.rooms[i].clients.length + "/" + data.rooms[i].size;
    var toAppend = document.createElement("li");
    toAppend.appendChild(a);
    pane.appendChild(toAppend);
  }

  // if (this.currentRoom != null) {
  //   this.currentRoom.clients.forEach(function(client) {
  //     var nameToAppend = document.createElement("li");
  //     nameToAppend.appendChild(document.createTextNode(client));
  //     document.getElementById("nameList").appendChild(nameToAppend);
  //
  //   });
  // }


});

socket.on('roomEntered', function (data) {

  this.currentRoom = rooms.find(function (element) {
    if (element.uuid == data.uuid) {
      return true;
    } else {
      return false;
    }
  });

  document.getElementById("roomHeader").innerHTML = "Room: " + this.currentRoom.name;

  this.currentRoom.clients.forEach(function(client) {
    var nameToAppend = document.createElement("li");
    nameToAppend.appendChild(document.createTextNode(client.name));
    document.getElementById("nameList").appendChild(nameToAppend);

  });


  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("You have entered room: " + this.currentRoom.name ));
  document.getElementById("serverContainer").appendChild(toAppend);

  interrupt = false;
  initPhysics();
  initDraw();
  loop();

})

socket.on('roomLeft', function (data) {

  document.getElementById("roomHeader").innerHTML = "Room: none";
  document.getElementById("nameList").innerHTML = "";

  if (this.currentRoom != null) {
    var toAppend = document.createElement("P");
    toAppend.appendChild(document.createTextNode("You have left room: " + this.currentRoom.name));
    document.getElementById("serverContainer").appendChild(toAppend);
  }

  currentRoom = null;

  clientGameData = null;
  serverGameData = null;

  interrupt = true;

  clearCanvas();

});

function sendMessage() {
  var toSend = document.getElementById("message").value;
  document.getElementById("message").value = "";
  socket.emit('message', {msg: toSend})
}

function sendName() {
  var toSend = document.getElementById("name").value;

  document.getElementById("name").value = "";
  socket.emit('name', {name: toSend});

  name = toSend;
}

function enterRoom(roomNumber) {
  var toSend = rooms[roomNumber].uuid;
  socket.emit('joinRoom',{uuid: toSend});
}

function createRoom() {
  socket.emit("createRoom", {name: document.getElementById("roomNameInput").value,size: document.getElementById("roomSizeInput").value})
  document.getElementById("roomNameInput").value = "";
  document.getElementById("roomSizeInput").value = "";
}

function leaveRoom() {
  this.socket.emit("leaveRoom");
}

var keyMap = {}; // You could also use an array
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keyMap[e.keyCode] = e.type == 'keydown';
    this.socket.emit("gameData", keyMap);
    /* insert conditional here */
}

var prevTime;

socket.on('gameData', function (data) {

  serverGameData = data.roomData;

});

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function drawFrame() {
  try {
    draw(clientGameData, name);
  } catch (e) {
    console.log(e);
  }
  // requestAnimFrame(drawFrame);
}

function initPhysics () {
  prevTime = (new Date()).getTime();
  drawFrame();
}

function loop() {
  if (interrupt) {
    return;
  }

  var dt = (new Date()).getTime() - this.prevTime;
  this.prevTime = new Date();

  try {
    clientGameData = Physics.makeCorrections(clientGameData,serverGameData, dt);
    clientGameData = Physics.calculatePhysics(clientGameData,dt,name);

  } catch(e) {
    console.log(e);
  }

  drawFrame();

  setTimeout(loop, 10);

}
