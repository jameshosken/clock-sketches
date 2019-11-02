console.log("Hello World Voyeur")

console.log(io);
// import * as io from 'socket.io-client';

let socket = io.connect("/voy");

let hours = 0;
let mins = 0;
let secs = 0;

let hasDate = false;
let connections = 0;


socket.on('connection', function(socket){
    console.log('a user connected');
});

socket.on('disconnect', function(){
    console.log('user disconnected');
});

socket.on('voyTime', function(msg){
    console.log("Received: "+ msg);
    hasDate = true;
    console.log(typeof(msg));

    let date = new Date(msg);
    console.log(date);
    hours = date.getHours();
    mins = date.getMinutes();
    secs = date.getSeconds();

    console.log("TIME: " + hours + ":" + mins + ":" + secs);
});


socket.on('cnx', function(msg){
    console.log("CNX Received: "+ msg);
    connections = msg;
});


//https://p5js.org/examples/input-clock.html

let cx, cy;
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;


let state = 0;
function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    stroke(255);
  
    let radius = min(width, height) / 2;
    secondsRadius = radius * 0.71;
    minutesRadius = radius * 0.6;
    hoursRadius = radius * 0.5;
    clockDiameter = radius * 1.7;
  
    cx = width / 2;
    cy = height / 2;

    textSize(36);
}

function draw(){

    background(11,0,20);

    fill(113, 6, 39);
    text("Others watching: " + (connections-1), 36,36);

    renderFace()
    if(!hasDate){return;}
    renderHands()

}

let renderFace = function(){
    
    noStroke();
    fill(158, 25, 70);
    ellipse(cx, cy, clockDiameter + 15, clockDiameter + 15);
    fill(113,6,39);
    ellipse(cx, cy, clockDiameter, clockDiameter);
  
}

let renderHands = function(){
    // Angles for sin() and cos() start at 3 o'clock;
    // subtract HALF_PI to make them start at the top

    let s = map(secs, 0, 60, 0, TWO_PI) - HALF_PI;
    let m = map(mins + norm(secs, 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
    let h = map(hours + norm(mins, 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

    // Draw the hands of the clock
    stroke(245,233,226);
    strokeWeight(1);
    line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
    strokeWeight(2);
    line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
    strokeWeight(4);
    line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);

    // Draw the minute ticks
    stroke(11,0,20);
    strokeWeight(2);
    beginShape(POINTS);
    for (let a = 0; a < 360; a += 12) {
        let angle = radians(a);
        let x = cx + cos(angle) * secondsRadius;
        let y = cy + sin(angle) * secondsRadius;
        vertex(x, y);
    }
    endShape();
}