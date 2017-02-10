(function(exports){

    var acceleration = 0.001;

    //returns changed room
    exports.calculatePhysics = function(condensedRoom, dt){

      var newCondensedRoom = new CondensedRoom(condensedRoom, true);

      for (var i = 0; i <newCondensedRoom.clients.length; i++) {
        var curClient =condensedRoom.clients[i];
        if (curClient.keyMap[87]) {
          curClient.gameData.vy -= acceleration *dt;
        } else if (curClient.keyMap[83]) {
          curClient.gameData.vy += acceleration * dt;
        }

        if (curClient.keyMap[65]) {
          curClient.gameData.vx -= acceleration *dt;
        } else if (curClient.keyMap[68]) {
          curClient.gameData.vx += acceleration *dt;
        }


        if (curClient.gameData.vx > 0.1)
          curClient.gameData.vx = 0.1;

        if (curClient.gameData.vx < -0.1)
          curClient.gameData.vx = -0.1;

        if (curClient.gameData.vy > 0.1)
          curClient.gameData.vy = 0.1;

        if (curClient.gameData.vy < -0.1)
          curClient.gameData.vy = -0.1;

        if (curClient.gameData.x>525 && curClient.gameData.vx >0) {
            curClient.gameData.x-=550;
        }

        if (curClient.gameData.x<-25 && curClient.gameData.vx <0) {
            curClient.gameData.x+=550;
        }

        if (curClient.gameData.y>525 && curClient.gameData.vy >0) {
            curClient.gameData.y-=550;
        }

        if (curClient.gameData.y<-25 && curClient.gameData.vy <0) {
            curClient.gameData.y+=550;
        }

        curClient.gameData.x += curClient.gameData.vx *dt;
        curClient.gameData.y += curClient.gameData.vy *dt;
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
      client.gameData.x = 50;
      client.gameData.y = 50;
      client.gameData.vx = 0;
      client.gameData.vy = 0;

    };

})(typeof exports === 'undefined'? this['Physics']={}: exports);
