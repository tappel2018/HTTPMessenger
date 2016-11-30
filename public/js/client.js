socket = io.connect('/')

UUID = "";

socket.on('onconnected', function ( data ) {
  console.log("Connection successful. UUID: " + data.id);
  UUID = data.id;

  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("Please enter your name."));
  document.getElementById("messageContainer").appendChild(toAppend);
})

socket.on('confirmed', function (data) {
  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("You have been connected to the server." ));
  document.getElementById("messageContainer").appendChild(toAppend);


  document.getElementById("nameInput").style.display = "none";
  document.getElementById("input").style.display = "block";
  document.getElementById("message").focus();

})

socket.on('disconnect', function ( data ) {
  console.log("Connection successful. UUID: " + data.id);
  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode("You have lost connection to the server." ));
  document.getElementById("messageContainer").appendChild(toAppend);

  document.getElementById("nameInput").style.display = "block";
  document.getElementById("input").style.visibility = "none";
  document.getElementById("name").focus();

})

socket.on('messageFromServer', function ( data ) {
  var toAppend = document.createElement("P");
  toAppend.appendChild(document.createTextNode(data.msg));
  toAppend.style.color = data.color;
  console.log(data.color);

  var pane = document.getElementById("messageContainer");
  pane.appendChild(toAppend);
  pane.scrollTop = pane.scrollHeight;
})

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
