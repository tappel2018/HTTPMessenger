try {
  SAT = require ("sat");
} catch (e) {
  console.log(e);
}

console.log(SAT);

(function(exports){

    var acceleration = 0.0001;
    var drag = 0.00001
    var returnAcceleration = 0.00015;
    var borderAcceleration = 0.0002;
    var maxSpeed = 0.1;

    var turnSpeed = 0.005;

    var worldSize = 500;

    var bulletSpeed = 0.2;

    //returns changed room
    exports.makeCorrections = function(condensedRoomClient, condensedRoomActual, dt){
      //TODO: make corrections
      return new CondensedRoom(condensedRoomActual, true);

    };

    //changes client
    exports.initClient = function(client) {
      client.gameData = {};
      client.gameData.ship = {
          x: Math.random() * worldSize,
          y: Math.random() * worldSize,
          vx: 0,
          vy:  0,
          angle: 0,

          boost: 100,

          bulletTimeOut: 500,
          curTimeOut: 0,

          polygon1: new SAT.Polygon(
            new SAT.Vector(this.x, this.y),
            new SAT.Vector(30,0),
            new SAT.Vector(-30, 24),
            new SAT.Vector(-21,0)
          ),
          polygon2: new SAT.Polygon(
            new SAT.Vector(this.x, this.y),
            new SAT.Vector(30,0),
            new SAT.Vector(-30, -24),
            new SAT.Vector(-21,0)
          ),




      }
      client.gameData.bullets = {};

    };

    exports.rotateShip = function(ship,angle) {
      if (isClient) {
        ship.angle = ship.angle + angle;
        ship.polygon1.prototype.rotate(angle);
        ship.polygon2.prototype.rotate(angle);
      } else {
        ship.angle = ship.angle + angle;
        ship.polygon1.rotate(angle);
        ship.polygon2.rotate(angle);

      }
    };


    exports.updateShip = function(ship,dt) {
      ship.x += ship.vx * dt;
      ship.y += ship.vy * dt;

      ship.curTimeOut -= dt;
      if (ship.curTimeOut < 0)
        ship.curTimeOut = 0;

      if (ship.vx * ship.vx + ship.vy * ship.vy > maxSpeed * maxSpeed)
        ship.accelerate(-returnAcceleration * dt);


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
    exports.calculatePhysics = function(condensedRoom, dt){

      var newCondensedRoom = new CondensedRoom(condensedRoom, true);

      for (var i = 0; i <newCondensedRoom.clients.length; i++) {
        var curClient =newCondensedRoom.clients[i];
        if (curClient.keyMap[87]) {
          exports.accelerateShip(curClient.gameData.ship,acceleration * dt);
        }
        if (curClient.keyMap[83]) {
          exports.accelerateShip(curClient.gameData.ship,-acceleration * dt);
        }

        if (curClient.keyMap[65]) {
          exports.rotateShip(curClient.gameData.ship, -turnSpeed * dt);
        }

        if (curClient.keyMap[68]) {
          exports.rotateShip(curClient.gameData.ship, turnSpeed * dt );
        }

        if (curClient.gameData.ship.x < 0) {
          exports.accelerateShip(curClient.gameData.ship, borderAcceleration, 0);
        }

        if (curClient.gameData.ship.x > worldSize) {
          exports.accelerateShip(curClient.gameData.ship, -borderAcceleration, 0);
        }

        if (curClient.gameData.ship.y < 0) {
          exports.accelerateShip(curClient.gameData.ship, 0, borderAcceleration);
        }

        if (curClient.gameData.ship.y > worldSize) {
          exports.accelerateShip(curClient.gameData.ship, 0, -borderAcceleration);
        }

        exports.updateShip(curClient.gameData.ship,dt);

      }

      return newCondensedRoom;

    };



  exports.Bullet = function(ship) {
    this.x = ship.x + 31 * Math.cos(ship.angle);
    this.y = ship.y + 31 * Math.sin(ship.angle);
    this.vx = bulletSpeed * Math.cos (ship.angle);
    this.vy = bulletSpeed * Math.sin (ship.angle);

    this.update = function() {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }
  }


})(typeof exports === 'undefined'? this['Physics']={}: exports);
