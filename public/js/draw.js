function draw(condensedRoom) {
  var g2d = document.getElementById("gameCanvas").getContext("2d");

  g2d.fillStyle="white";
  g2d.fillRect(0,0,500,500);

  //key is player name
  g2d.fillStyle="black";
  for (var i = 0; i < condensedRoom.clients.length; i++) {
    var playerData = condensedRoom.clients[i].gameData;
    g2d.fillRect(playerData.x - 25, playerData.y -25, 50, 50);
  }
}
