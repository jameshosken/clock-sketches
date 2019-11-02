
console.log("Hello World Voyeur")


let hours = 0;
let mins = 0;
let secs = 0;


let cx, cy;
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;
let timeIncreaseIncrement = 1; 


let date;
let timeStamp;

let prevVector;
let threshhold = 1;
let txt = "";
let debug = true; // TODO fix accelerometer issue


function setupTime(){
    timeStamp = Date.now();
    
    date = new Date(timeStamp);
    console.log(date);
    
}

function getTime(){
    
    date = new Date(timeStamp);
    hours = date.getHours();
    mins = date.getMinutes();
    secs = date.getSeconds();
}

function updateTime(mult){
    timeStamp += timeIncreaseIncrement * mult
    console.log(timeStamp);
}


function setup(){



    createCanvas(window.innerWidth, window.innerHeight);
    setupTime();
    getTime();

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

    background(255);

    fill(0,0,128);
    // text(txt, 50,50);

    renderFace()
    renderHands()

    detectMotion();
    getTime();

}

let detectMotion = function(){
    
    let x,y,z;
    let vec;

    if(debug){
        x = mouseX - pmouseX;
        y = mouseY - pmouseY;
        vec = createVector(x,y);
    }else{
        x = accelerationX - pAccelerationX;
        y = accelerationY - pAccelerationY;
        z = accelerationZ - pAccelerationZ;
        createVector(x,y,z);
    }
    

    
    let motion = p5.Vector.sub(vec, prevVector);

    if(motion.mag() > threshhold){
        updateTime(motion.mag());
    }

    txt = x + " " + y + " " + z;


    prevVector = vec;
}

let renderFace = function(){
    
    noStroke();
    fill(244, 122, 158);
    ellipse(cx, cy, clockDiameter + 25, clockDiameter + 25);
    fill(237, 34, 93);
    ellipse(cx, cy, clockDiameter, clockDiameter);
  
}

let renderHands = function(){
    // Angles for sin() and cos() start at 3 o'clock;
    // subtract HALF_PI to make them start at the top

    let s = map(secs, 0, 60, 0, TWO_PI) - HALF_PI;
    let m = map(mins + norm(secs, 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
    let h = map(hours + norm(mins, 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

    // Draw the hands of the clock
    stroke(255);
    strokeWeight(1);
    line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
    strokeWeight(2);
    line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
    strokeWeight(4);
    line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);

    // Draw the minute ticks
    strokeWeight(2);
    beginShape(POINTS);
    for (let a = 0; a < 360; a += 6) {
        let angle = radians(a);
        let x = cx + cos(angle) * secondsRadius;
        let y = cy + sin(angle) * secondsRadius;
        vertex(x, y);
    }
    endShape();
}
