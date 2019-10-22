console.log("Server Starting"); 
var express = require('express'),
    path = require('path'),
    app = express();

//var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.redirect('index.html');
});


///VARS
let connections = 0;
let visibleTime = Date.now();
let timeDelay = 0;
let catchupSpeed = 0.1;

setInterval(() => {
    if(connections == 0){
        lerpTime();
    }

    // timeDelay = Date.now() - visibleTime;
    // console.log("Connections: " + connections);
    // console.log("Time Delay: " + Math.floor(timeDelay/1000) + " seconds"); 

}, 500);

let lerpTime = function(){
    visibleTime = lerp(visibleTime, Date.now(), catchupSpeed);
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end;
}

io.on('connection', function(socket){
    connections++;
    // console.log('a user connected, sending time:' + visibleTime);
    
    socket.emit('timestamp', visibleTime);

    io.emit('cnx', connections);

    socket.on('disconnect', function(){
        connections--;
        
        io.emit('cnx', connections);
        console.log('user disconnected');
    });
});



http.listen(3000, function(){
    setup();
});

    console.log('Listening on port ' + http.address().port); //Listening on port 8888
