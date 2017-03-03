try {
  SAT = require ("sat");
} catch (e) {

}



(function(exports){

    var acceleration = 0.0001;
    var boostAcceleration = 0.00015;
    var drag = 0.00001
    var returnAcceleration = 0.00015;
    var borderAcceleration = 0.0002;
    var maxSpeed = 0.15;

    var maxHealth = 100;
    var drainRate = 1;
    var healRate = 1.5;
    var bulletCost = 1;

    var bulletTimeOut = 300;

    var turnSpeed = 0.005;

    var worldSize = 500;

    var bulletSpeed = 0.4;

    //returns changed room
    exports.makeCorrections = function(condensedRoomClient, condensedRoomActual, dt){
      //TODO: make corrections
      var newCondensedRoom = new CondensedRoom(condensedRoomActual, true);

      for (var i = 0; i < newCondensedRoom.clients.length; i++) {
        try {
          var clientClient = condensedRoomClient.clients.find(function (element) {
            return element.name == this.clients[i].name;
          }, newCondensedRoom);

          if (typeof clientClient == "undefined") continue;

          for (var property in newCondensedRoom.clients[i].gameData.ship) {
            if ((typeof newCondensedRoom.clients[i].gameData.ship[property]) === "number") {
              newCondensedRoom.clients[i].gameData.ship[property] = 0.1 * condensedRoomActual.clients[i].gameData.ship[property] + 0.9 * condensedRoomClient.clients[i].gameData.ship[property];
            }

          }

        } catch(e) {

        }
      }

      for (var i = 0; i <newCondensedRoom.clients.length; i++) {
        var ship =newCondensedRoom.clients[i].gameData.ship;
        ship.polygon1 =  new SAT.Polygon(new SAT.Vector(ship.x,ship.y), [
                    new SAT.Vector(0, 0),
                    new SAT.Vector(30,0),
                    new SAT.Vector(-30, 24),
                    new SAT.Vector(-21,0)
                  ]);
        ship.polygon2 = new SAT.Polygon(new SAT.Vector(ship.x,ship.y), [
                    new SAT.Vector(0, 0),
                    new SAT.Vector(30,0),
                    new SAT.Vector(-30, -24),
                    new SAT.Vector(-21,0)
                  ]);
        ship.polygon1.rotate(ship.angle);
        ship.polygon2.rotate(ship.angle);
      }

      return newCondensedRoom;

    };

    //changes client
    exports.initClient = function(client) {
      client.gameData = {};
      client.gameData.bullets = [];
      client.gameData.health = maxHealth;
      client.gameData.bulletTimeOut = bulletTimeOut;
      client.gameData.curTimeOut = 0;
      client.gameData.ship = {
          x: Math.random() * worldSize,
          y: Math.random() * worldSize,
          vx: 0,
          vy:  0,
          angle: 0,

          polygon1:  new SAT.Polygon(new SAT.Vector(), [
                      new SAT.Vector(0, 0),
                      new SAT.Vector(30,0),
                      new SAT.Vector(-30, 24),
                      new SAT.Vector(-21,0)
                    ]),
          polygon2: new SAT.Polygon(new SAT.Vector(), [
                      new SAT.Vector(0, 0),
                      new SAT.Vector(30,0),
                      new SAT.Vector(-30, -24),
                      new SAT.Vector(-21,0)
                    ])

      }

    };

    exports.rotateShip = function(ship,angle) {
      ship.angle = ship.angle + angle;
      ship.polygon1.rotate(angle);
      ship.polygon2.rotate(angle);
    };

    exports.updatePolygons = function(ship) {
      ship.polygon1 =  new SAT.Polygon(new SAT.Vector(ship.x,ship.y), [
                  new SAT.Vector(0, 0),
                  new SAT.Vector(30,0),
                  new SAT.Vector(-30, 24),
                  new SAT.Vector(-21,0)
                ]);
      ship.polygon2 = new SAT.Polygon(new SAT.Vector(ship.x,ship.y), [
                  new SAT.Vector(0, 0),
                  new SAT.Vector(30,0),
                  new SAT.Vector(-30, -24),
                  new SAT.Vector(-21,0)
                ]);
      ship.polygon1.rotate(ship.angle);
      ship.polygon2.rotate(ship.angle);

    }

    exports.updateShip = function(ship,dt) {
      ship.x += ship.vx * dt;
      ship.y += ship.vy * dt;



      if (ship.vx * ship.vx + ship.vy * ship.vy > maxSpeed * maxSpeed)
        exports.accelerateShip(ship,
          -returnAcceleration * dt * Math.sign(ship.vx) * Math.abs(Math.cos(ship.angle)),
          -returnAcceleration * dt * Math.sign (ship.vy) * Math.abs(Math.sin(ship.angle)));

        exports.accelerateShip(ship,
          -drag * dt * Math.sign(ship.vx) * Math.abs(Math.cos(ship.angle)),
          -drag * dt * Math.sign (ship.vy) * Math.abs(Math.sin(ship.angle)));


    };

    exports.accelerateShip = function(ship, amt, amtY) {
      if (amtY === undefined) {
        ship.vx += amt * Math.cos(ship.angle);
        ship.vy += amt * Math.sin(ship.angle);
      } else {
        ship.vx += amt;
        ship.vy += amtY;
      }
    };

    //returns changed room
    exports.calculatePhysics = function(condensedRoom, dt, name, room){

      var newCondensedRoom = new CondensedRoom(condensedRoom, true);

      for (var i = 0; i <newCondensedRoom.clients.length; i++) {
        var curClient =newCondensedRoom.clients[i];
        exports.updatePolygons(curClient.gameData.ship);
        if (curClient.keyMap[38]) {
          exports.accelerateShip(curClient.gameData.ship,acceleration * dt);
        }
        if (curClient.keyMap[40]) {
          exports.accelerateShip(curClient.gameData.ship,-acceleration * dt);
        }

        if (curClient.keyMap[37]) {
          exports.rotateShip(curClient.gameData.ship, -turnSpeed * dt);
        }

        if (curClient.keyMap[39]) {
          exports.rotateShip(curClient.gameData.ship, turnSpeed * dt );
        }

        if (curClient.gameData.ship.x < 0) {
          exports.accelerateShip(curClient.gameData.ship, borderAcceleration * dt, 0);
        }

        if (curClient.gameData.ship.x > worldSize) {
          exports.accelerateShip(curClient.gameData.ship, -borderAcceleration* dt, 0);
        }

        if (curClient.gameData.ship.y < 0) {
          exports.accelerateShip(curClient.gameData.ship, 0, borderAcceleration* dt);
        }

        if (curClient.gameData.ship.y > worldSize) {
          exports.accelerateShip(curClient.gameData.ship, 0, -borderAcceleration* dt);
        }

        exports.updateShip(curClient.gameData.ship,dt);

        curClient.gameData.curTimeOut -= dt;
        if (curClient.gameData.curTimeOut < 0) curClient.gameData.curTimeOut = 0;

        if (curClient.keyMap[90] && curClient.gameData.curTimeOut == 0) {
          curClient.gameData.bullets.push(new exports.Bullet(curClient));
          curClient.gameData.curTimeOut = curClient.gameData.bulletTimeOut;
          curClient.gameData.health -= bulletCost;
        }

        for (var j = 0; j < curClient.gameData.bullets.length; j++) {
          var curBullet = curClient.gameData.bullets[j];
          if (curBullet.x < -1000 || curBullet.x > worldSize + 1000 || curBullet.y < -1000 || curBullet.y > worldSize + 1000) {
            curClient.gameData.bullets.splice(j, 1);
            j--;
          }
          exports.updateBullet(curBullet, dt);

          var point = new SAT.Vector(curBullet.x, curBullet.y);
          for (var k = 0; k < newCondensedRoom.clients.length; k++) {
            var otherClient = newCondensedRoom.clients[k];

            if (SAT.pointInPolygon(point, otherClient.gameData.ship.polygon1)
            ||  SAT.pointInPolygon(point, otherClient.gameData.ship.polygon2)) {
              otherClient.gameData.health -= curBullet.damage;
              curClient.gameData.bullets.splice(j, 1);
            }
          }


        }

        if (curClient.gameData.health > maxHealth) {
          curClient.gameData.health = maxHealth;
        }
        if (curClient.gameData.health < 0) {
          if (isClient && name == curClient.name) {
            clientGameData = null;
            serverGameData = null;
            interrupt = true;
          } else if (!isClient){
            room.clients[i].leaveRoom();
          }
        }
        curClient.gameData.health += healRate * dt / 1000;

      }

      return newCondensedRoom;

    };



  exports.Bullet = function(client) {
    this.x = client.gameData.ship.x + 31 * Math.cos(client.gameData.ship.angle);
    this.y = client.gameData.ship.y + 31 * Math.sin(client.gameData.ship.angle);
    this.vx = bulletSpeed * Math.cos (client.gameData.ship.angle);
    this.vy = bulletSpeed * Math.sin (client.gameData.ship.angle);

    this.color = client.color;

    this.damage = 10;
  }

  exports.updateBullet = function(bullet, dt) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
  }


})(typeof exports === 'undefined'? this['Physics']={}: exports);
