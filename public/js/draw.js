stars = [];
function initDraw(condensedRoom) {
  for (var i = 0; i < 500; i++) {
    stars.push({x:Math.random() * 2000, y:Math.random()*2000});
  }
}

function draw(condensedRoom, name) {
  var g2d = document.getElementById("gameCanvas").getContext("2d");

  g2d.fillStyle="black";
  g2d.fillRect(0,0,1250,600);

  g2d.fillStyle="white";


  var tempx = 0;
  var tempy = 0;
  var healthColor = "white";
  var health = 0;
  var points = 0;

  condensedRoom.clients.forEach(function(client) {
    if (client.name == name) {
      tempx = - Math.floor(client.gameData.ship.x) + 625;
      tempy = - Math.floor(client.gameData.ship.y) + 300;
      healthColor = client.color;
      health = client.gameData.health;
      points = client.gameData.points;
    }
  })

  g2d.translate(tempx, tempy);


  for (var i = 0; i <stars.length; i++) {
    g2d.fillRect(Math.floor(stars[i].x), Math.floor(stars[i].y), 1,1);
  }

  for (var i = 0; i < condensedRoom.clients.length; i++) {
    if (condensedRoom.clients[i].gameData.isBoosting) {
      var RGB = HextoRGB(condensedRoom.clients[i].color);
      console.log(RGB)
      var HSV = RGBtoHSV(RGB.r, RGB.g, RGB.b);
      console.log(HSV);
      g2d.fillStyle = HSVtoHex(HSV.h / 360.0, 0.7, 0.7);
    } else {
      g2d.fillStyle = condensedRoom.clients[i].color;

    }


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

    g2d.fillStyle = condensedRoom.clients[i].color;

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

  g2d.textAlign = "right";
  g2d.font = "30px Arial";

  var tempClients = (new CondensedRoom(condensedRoom, true)).clients;

  tempClients.sort(function (a, b) {
    return b.points - a.points;
  })

  try {
    g2d.fillStyle = tempClients[0].color;
    g2d.fillText(tempClients[0].name + ": " + Math.round(tempClients[0].gameData.points),1210, 50)

    g2d.fillStyle = tempClients[1].color;
    g2d.fillText(tempClients[1].name + ": " + Math.round(tempClients[1].gameData.points),1210, 90)

    g2d.fillStyle = tempClients[2].color;
    g2d.fillText(tempClients[2].name + ": " + Math.round(tempClients[2].gameData.points),1210, 130)
  } catch (e) {

  }

  g2d.fillStyle = healthColor;
  g2d.textAlign = "left";
  g2d.fillText(Math.round(points), 20, 50);

  g2d.fillRect(20, 560, health * 1210 / 100, 20);

}

function clearCanvas () {
  var g2d = document.getElementById("gameCanvas").getContext("2d");

  g2d.fillStyle="white";
  g2d.fillRect(0,0,1250,600);


}

function HextoRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function RGBtoHSV () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

function HSVtoHex(h, s, v) {
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
