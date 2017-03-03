stars = [];
function initDraw(condensedRoom) {
  for (var i = 0; i < 100; i++) {
    stars.push({x:Math.random() * 750, y:Math.random()*500});
  }
}

function draw(condensedRoom, name) {
  var g2d = document.getElementById("gameCanvas").getContext("2d");

  g2d.fillStyle="black";
  g2d.fillRect(0,0,750,500);

  g2d.fillStyle="white";


  var tempx = 0;
  var tempy = 0;
  var healthColor = "white";
  var health = 0;

  condensedRoom.clients.forEach(function(client) {
    if (client.name == name) {
      tempx = - Math.floor(client.gameData.ship.x) + 375;
      tempy = - Math.floor(client.gameData.ship.y) + 250;
      healthColor = client.color;
      health = client.gameData.health;
      g2d.translate(tempx, tempy);
    }
  })



  for (var i = 0; i <stars.length; i++) {
    g2d.fillRect(Math.floor(stars[i].x), Math.floor(stars[i].y), 1,1);
  }

  for (var i = 0; i < condensedRoom.clients.length; i++) {
    g2d.fillStyle = condensedRoom.clients[i].color;
    var playerData = condensedRoom.clients[i].gameData;
    g2d.translate(Math.floor(playerData.ship.x), Math.floor(playerData.ship.y));
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
    g2d.translate(-Math.floor(playerData.ship.x), -Math.floor(playerData.ship.y));

    for (var j = 0; j < condensedRoom.clients[i].gameData.bullets.length; j++) {
      g2d.beginPath();
      g2d.arc(condensedRoom.clients[i].gameData.bullets[j].x,
        condensedRoom.clients[i].gameData.bullets[j].y,
        5,
        0*Math.PI,
        2.0*Math.PI);
      g2d.fill();
    }

  }

  g2d.translate(-tempx,-tempy);

  g2d.fillStyle = healthColor;

  g2d.fillRect(20, 460, health * 710 / 100, 20);

}

function clearCanvas () {
  var g2d = document.getElementById("gameCanvas").getContext("2d");

  g2d.fillStyle="white";
  g2d.fillRect(0,0,750,500);

  g2

}
