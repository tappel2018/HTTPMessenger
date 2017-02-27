function initDraw(condensedRoom) {

}

function draw(condensedRoom, name) {
  var g2d = document.getElementById("gameCanvas").getContext("2d");

  g2d.fillStyle="black";
  g2d.fillRect(0,0,500,500);

  //key is player name
  g2d.fillStyle="white";

  var tempx = 0;
  var tempy = 0;

  condensedRoom.clients.forEach(function(client) {
    if (client.name == name) {
      tempx = - client.gameData.ship.x + 250;
      tempy = -client.gameData.ship.y + 250;
      g2d.translate(tempx, tempy);
    }
  })

  console.log(tempx + ", " + tempy);


  for (var i = 0; i < condensedRoom.clients.length; i++) {
    var playerData = condensedRoom.clients[i].gameData;
    g2d.translate(playerData.ship.x, playerData.ship.y);
    g2d.rotate(playerData.ship.angle);
    g2d.beginPath();
    g2d.moveTo(30,0);
    g2d.lineTo(-30, -24);
    g2d.lineTo(-21, 0);
    g2d.lineTo(-30, 24);
    g2d.lineTo(30,0);
    g2d.closePath();
    g2d.fill();
    g2d.rotate(-playerData.ship.angle)
    g2d.translate(-playerData.ship.x, -playerData.ship.y);

  }

  g2d.translate(-tempx,-tempy);
}
