let date =  new Date(Date.now());

console.log(date);
let hours = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

let calculateClock = () => {
    let nanosecondsInAYear = 525600 * 60 * 1000; 

    //https://en.wikipedia.org/wiki/Ultimate_fate_of_the_universe
    let ageOfUniverseInHours = 13000000000 + date/nanosecondsInAYear;  //Add current date, converted to hours
    let predictedLifespanOfClosedUniverse = 13000000000 + 17000000000;
    hours = ageOfUniverseInHours / predictedLifespanOfClosedUniverse;
    
    //https://en.wikipedia.org/wiki/Future_of_Earth#cite_note-FOOTNOTEFishbaughDes_MaraisKorablevRaulin2007114-15
    
    let ageOfEarthInHours = 4543000000 + date/nanosecondsInAYear;
    let predictedLifespanOfEarth = 4543000000 + 7500000000;
    mins = ageOfEarthInHours/predictedLifespanOfEarth;
    
    //https://en.wikipedia.org/wiki/Future_of_Earth#cite_note-FOOTNOTEFishbaughDes_MaraisKorablevRaulin2007114-15
    let ageOfHumans = 250000 + date/nanosecondsInAYear;

    // Convert age to "2 mins before midnight:"
    let predictedAgeOfHumans = 250000/58 * 60;
    secs =  ageOfHumans / predictedAgeOfHumans;
    console.log(date/nanosecondsInAYear);
    
}



//https://p5js.org/examples/input-clock.html

let cx, cy;
let secondsRadius;
let minutesRadius;
let hoursRadius;
let clockDiameter;



let state = 0;
function setup(){

    calculateClock();
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

    background(255);

    fill(0,0,128);

    renderFace()
    renderHands()

}

let renderFace = function(){
    
    noStroke();
    fill(191, 215, 234);
    ellipse(cx, cy, clockDiameter + 25, clockDiameter + 25);
    
    fill(11, 57, 84);
    ellipse(cx, cy, clockDiameter, clockDiameter);
    strokeWeight(1);

    push();
    stroke(0);
    
    line(cx, cy, cx , cy - clockDiameter/2);
    pop()
  
}

let renderHands = function(){
    // Angles for sin() and cos() start at 3 o'clock;
    // subtract HALF_PI to make them start at the top

    let s = map(secs, 0, 1, 0, TWO_PI) - HALF_PI;
    let m = map(mins, 0, 1, 0, TWO_PI) - HALF_PI;
    let h = map(hours, 0, 1, 0, TWO_PI) - HALF_PI;

    // Draw the hands of the clock
    stroke(255, 255, 252);
    strokeWeight(1);
    line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
    strokeWeight(2);
    line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
    strokeWeight(4);
    line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);

    

}

// $color1: rgba(11, 57, 84, 1);
// $color2: rgba(191, 215, 234, 1);
// $color3: rgba(0, 0, 0, 1);
// $color4: rgba(255, 255, 252, 1);
// $color5: rgba(254, 255, 254, 1);