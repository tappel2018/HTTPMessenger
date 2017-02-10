(function(exports){

    var acceleration = 0.0001;
    var maxSpeed = 0.1;
    var turnSpeed = 0.005;

    //returns changed room
    exports.calculatePhysics = function(condensedRoom, dt){

      var newCondensedRoom = new CondensedRoom(condensedRoom, true);

      for (var i = 0; i <newCondensedRoom.clients.length; i++) {
        var curClient =newCondensedRoom.clients[i];
        if (curClient.keyMap[87]) {
          curClient.gameData.vx += acceleration * dt * Math.cos(curClient.gameData.angle);
          curClient.gameData.vy+= acceleration * dt * Math.sin(curClient.gameData.angle);

        }
        if (curClient.keyMap[83]) {
          curClient.gameData.vx -= acceleration * dt * Math.cos(curClient.gameData.angle);
          curClient.gameData.vy -= acceleration * dt * Math.sin(curClient.gameData.angle);
        }

        if (curClient.keyMap[65]) {
          curClient.gameData.angle -= turnSpeed *dt;
        }

        if (curClient.keyMap[68]) {
          curClient.gameData.angle += turnSpeed *dt;
        }

        if (curClient.gameData.vx > maxSpeed)
          curClient.gameData.vx = maxSpeed;

        if (curClient.gameData.vx < -maxSpeed)
          curClient.gameData.vx = -maxSpeed;

        if (curClient.gameData.vy > maxSpeed)
          curClient.gameData.vy = maxSpeed;

        if (curClient.gameData.vy < -maxSpeed)
          curClient.gameData.vy = -maxSpeed;

        if (curClient.gameData.x>550) {
            curClient.gameData.x-=599;
        }

        if (curClient.gameData.x<-50) {
            curClient.gameData.x+=599;
        }

        if (curClient.gameData.y>550){
            curClient.gameData.y-=599;
        }

        if (curClient.gameData.y<-50) {
            curClient.gameData.y+=599;
        }

        curClient.gameData.x += curClient.gameData.vx * dt ;
        curClient.gameData.y += curClient.gameData.vy * dt ;

      }

      return newCondensedRoom;

    };

    //returns changed room
    exports.makeCorrections = function(condensedRoomClient, condensedRoomActual, dt){
      //TODO: make corrections
      return new CondensedRoom(condensedRoomActual, true);

    };

    //changes client
    exports.initClient = function(client) {
      client.gameData = {};
      client.gameData.x = 100;
      client.gameData.y = 100;
      client.gameData.vx = 0;
      client.gameData.vy = 0;
      client.gameData.angle = 0;

    };

})(typeof exports === 'undefined'? this['Physics']={}: exports);
