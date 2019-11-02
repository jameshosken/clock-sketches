console.log("Server Starting"); 


///////////////////////
// CLOCK DEFINITIONS //
///////////////////////

let shyClock;
let voyClock;

//////////////////
// SERVER SETUP //
//////////////////

var express = require('express'),
    path = require('path'),
    app = express();

var http = require('http').createServer(app);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.redirect('index.html');
});

////////////////////////
// SOCKET APPLICATIONS //
////////////////////////

let io = require('socket.io')(http);

var shyIO = io.of('/shy');

shyIO.on('connection', function(socket){
    console.log("Shy Connection");
    shyClock.connections++;

    socket.emit('shyTime', shyClock.visibleTime);

    shyIO.emit('cnx', shyClock.connections);

    socket.on('disconnect', function(){
        console.log("Shy Disonnection");
        shyClock.connections--;
        shyIO.emit('cnx', shyClock.connections);
        // console.log('user disconnected');
    });
});


//Voyeur Clock
var voyIO = io.of('/voy');

voyIO.on('connection', function(socket){
    console.log("Voyeur Connection");
    voyClock.connections++;
    voyClock.tryStartIntervalTimer(voyIO);

    voyIO.emit('cnx', voyClock.connections);

    socket.on('disconnect', function(){
        console.log("Voyeur Disconnection");
        voyClock.connections--;
        voyIO.emit('cnx', voyClock.connections);
        voyClock.tryEndIntervalTimer();
    });
});

http.listen(3000, function(){
    console.log('Listening on port ' + http.address().port); //Listening on port 8888
    setup();
});

///////////////////////
// UTILITY FUNCTIONS //
///////////////////////



function setup(){
    shyClock = new ShyClock();
    voyClock = new VoyeurClock();
    
    setInterval(() => {
        shyClock.lerpTime();
    }, 500);
}

function lerp (start, end, amt){
    return (1-amt)*start+amt*end;
}



///////////////////
// CLOCK CLASSES //
///////////////////
class ShyClock{

    constructor(){
        this.visibleTime = Date.now();
        this.catchupSpeed = 0.1;
        this.connections = 0;
    }

    lerpTime(){
        if(this.connections == 0){
            this.visibleTime = lerp(this.visibleTime, Date.now(), this.catchupSpeed);
        }
    }

}


class VoyeurClock{

    constructor(){
        this.visibleTime = Date.now();
        this.catchupSpeed = 0.05;
        this.connections = 0;
        this.hasUser = false;
    }

    lerpTime(){
        let self = this;
        if(this.connections > 0){
            self.visibleTime = lerp(self.visibleTime, Date.now(), self.catchupSpeed * self.connections);
            // console.log("Delay: " + (Date.now() - self.visibleTime));
        }
    }

    tryStartIntervalTimer(socket){
        let self = this;
        // console.log("Try Setting Unterval Timer")
        if(!self.hasUser){
            // console.log("Setting Unterval Timer")
            self.hasUser = true;
            
            //Set 1 second update timer
            self.timer = setInterval(function(){
                // console.log(self.visibleTime);
                self.lerpTime();
                socket.emit('voyTime', self.visibleTime)
            }, 1000);
        }
    }

    tryEndIntervalTimer(){
        if(this.hasUser && this.connections == 0){
            this.hasUser = false;
            clearInterval(this.timer);
        }
    }

}