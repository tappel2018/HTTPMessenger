port        = process.env.PORT || 80,

express         = require('express'),
UUID            = require('uuid'),
http            = require('http'),
EventEmitter    = require('events'),


verbose         = false,
app             = express();


server = http.createServer(app);
io = require('socket.io')( {
  "log level" : [0],

})


clientWrapper   = require("./clientWrapper.js");
Room            = require("./room.js");
CondensedRoom   = require('./CondensedRoom.js');



clients = [];
rooms = [];


/*Express server */

app.get('/', function (req, res) {
  res.sendFile( __dirname + '/public/default.html')
})

app.get( '/*' , function( req, res, next ) {

        //This is the current file they have requested
    var file = req.params[0];

        //For debugging, we can track what files are requested.
    if(verbose) console.log('\t :: Express :: file requested : ' + file);

        //Send the requesting client the file.
    res.sendFile( __dirname + '/public/' + file );

}); //app.get *



console.log("Begin listening on port: " + port)


io.use(function(socket, next) {
  var handshakeData = socket.request;
  // make sure the handshake data looks good as before
  // if error do this:
  //   next(new Error('not authorized'));
  // else just call next
  next();
});

sio = io.listen(server);
server.listen(port);


//Called on connection. Sends a client a unique ID
sio.sockets.on('connection', function(socket) {

  //Tell them they are connected

  var myUUID = UUID();

  socket.emit('onconnected', {id: myUUID});

  socket.on("name", function(data) {

    if (data.name == "") {
      data.name = "unnamed";
    }

    socket.emit("confirmed");

    var client = new clientWrapper(socket, data.name, myUUID);

    console.log('New player connected: ' + client.uuid);

    clients.push(client);

    Room.roomEmitter.emit("roomUpdate");
  })


})

Room.roomEmitter.on("roomUpdate", function() {
  clients.forEach(function(c) {
    var tempRooms = [];
    for (var i = 0; i < rooms.length; i++) {
      tempRooms.push(new CondensedRoom(rooms[i]));
    }
    c.socket.emit("roomUpdate", {rooms: tempRooms});
  })
})
