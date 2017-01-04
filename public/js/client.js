console.log("nice meme");

socket = io.connect('/')

UUID = "";

roomID = "";
rooms = [];

currentRoom = null;

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

socket.on('gameMessage', function (data) {
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
  console.log(data.color);

  var pane = document.getElementById("serverContainer");
  pane.appendChild(toAppend);
  pane.scrollTop = pane.scrollHeight;
})

socket.on('roomUpdate', function (data) {
  console.log(data);
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

});

socket.on('roomEntered', function (data) {
  console.log(data);

  this.currentRoom = rooms.find(function (element) {
    if (element.uuid == data.uuid) {
      return true;
    } else {
      return false;
    }
  });

  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("You have entered room: " + this.currentRoom.name ));
  document.getElementById("serverContainer").appendChild(toAppend);

})

socket.on('roomLeft', function (data) {
  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("You have left room: " + this.currentRoom.name));
  document.getElementById("serverContainer").appendChild(toAppend);

  this.currentRoom = null;
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
}

function enterRoom(roomNumber) {
  var toSend = rooms[roomNumber].uuid;
  socket.emit('joinRoom',{uuid: toSend});
}

function createRoom() {
  socket.emit("createRoom", {name: document.getElementById("roomNameInput").value,size: document.getElementById("roomSizeInput").value})
  document.getElementById("roomNameInput").value = "";
  document.getElementById("roomSizeInput").value = ""
}

function leaveRoom() {
  this.socket.emit("leaveRoom");
}
