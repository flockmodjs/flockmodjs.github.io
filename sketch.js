var socket = io.connect('https://flockmodjs--locknessko.repl.co');
let img;
let c = 0;
let bwidth;
let clearc;
let rbrush;
let cbrush;
let lbrush;
let pick;
var brush = "line";
var picking = false;
var cs = [];
var ls = [];
var ss = [];

function setup() {
  rectMode(CENTER);
  c = get(0, 0);
  pick = createButton('Pick Colour');
  pick.position(480, 60);
  pick.mousePressed(function() {
    picking = true;
  });
  lbrush = createButton('Line Brush');
  lbrush.position(395, 60);
  lbrush.mousePressed(function() {
    brush = "line";
  });
  cbrush = createButton('Circle Brush');
  cbrush.position(295, 60);
  cbrush.mousePressed(function() {
    brush = "circle";
  });
  rbrush = createButton('Rectangle Brush');
  rbrush.position(170, 60);
  rbrush.mousePressed(function() {
    brush = "rect";
  });
  clearc = createButton('Clear');
  clearc.position(110, 60);
  clearc.mousePressed(function() {
    clearnow();
  });
  bwidth = createSlider(0, 100, 10);
  bwidth.position(110, 30);
  img = loadImage('grad.jpg');
  createCanvas(window.innerWidth, window.innerHeight - 4);
  background(255);
  text("Brush Width", 110, 20);


}

function clearnow() {
  background(255);
  fill(0);
  noStroke();
  text("Brush Width", 110, 20);
  socket.emit('clear', 'do it bro!');
  rectMode(CORNER);
  noStroke();
  fill(red(c), green(c), blue(c));
  rect(200, 10, 100, 20);
  fill(0);
  text(red(c) + "," + green(c) + "," + blue(c), 200, 20);
  ls = [];
  cs = [];
  ss = [];
}

function draw() {
  image(img, 0, 0, 100, 100);
  cursor('grab');
  if (mouseIsPressed && mouseX < 105 && mouseY < 100) {
    c = get(mouseX, mouseY); // get the color under the mouse
    rectMode(CORNER);
    noStroke();
    fill(red(c), green(c), blue(c));
    rect(200, 10, 100, 20);
    fill(0);
    text(red(c) + "," + green(c) + "," + blue(c), 200, 20);
  }

  if (mouseX < 105 && mouseY < 100) {
    cursor(CROSS);
  }


  if (mouseIsPressed) {
    if (mouseY > 100 && picking) {
      c = get(mouseX, mouseY);
      console.log(c);
      picking = false;
    }

    if (mouseX < window.innerWidth && mouseY > 100 && !picking) {

      let r = red(c); // get the red channel
      let g = green(c); // get the green channel
      let b = blue(c); // get the blue channel
      fill(r, g, b);
      smooth(); //why not
      noStroke();

      if (brush === "circle") {
        noStroke();
        circle(mouseX, mouseY, bwidth.value());
        socket.emit('draw_circle', [mouseX, mouseY, bwidth.value(), r, g, b]);
        cs.push([mouseX, mouseY, bwidth.value(), r, g, b]);
      }
      if (brush === "rect") {
        noStroke();
        rectMode(CENTER);
        rect(mouseX, mouseY, bwidth.value(), bwidth.value());
        socket.emit('draw_rect', [mouseX, mouseY, bwidth.value(), r, g, b]);
        ss.push([mouseX, mouseY, bwidth.value(), r, g, b]);
      }
      if (brush === "line") {
        stroke(r, g, b);
        strokeWeight(bwidth.value());
        line(mouseX, mouseY, pmouseX, pmouseY);
        socket.emit('draw_line', [mouseX, mouseY, pmouseX, pmouseY, r, g, b, bwidth.value()]);
        ls.push([mouseX, mouseY, pmouseX, pmouseY, r, g, b, bwidth.value()]);
      }
    }
  }
}
socket.on('connected', function(data) {
  for (var i = 0; i < cs.length; i++) {
    socket.emit('draw_circle', cs[i]);
  }
  for (var j = 0; j < ls.length; j++) {
    socket.emit('draw_line', ls[j]);
  }
  for (var k = 0; k < ss.length; k++) {
    socket.emit('draw_rect', ss[k]);
  }
});
socket.on('clear', function(data) {
  clearnow();
});
socket.on('draw_line', function(data) {
  stroke(data[4], data[5], data[6]);
  strokeWeight(data[7]);
  line(data[0], data[1], data[2], data[3]);
  noStroke();
  console.log("line: "+[data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]]);
  ls.push([data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]]);
});
socket.on('draw_circle', function(data) {
  noStroke();
  fill(data[3], data[4], data[5]);
  circle(data[0], data[1], data[2]);
  console.log("circle: "+[data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]]);
  cs.push(data[0], data[1], data[2], data[3], data[4], data[5]);
});
socket.on('draw_rect', function(data) {
  noStroke();
  fill(data[3], data[4], data[5]);
  rect(data[0], data[1], data[2], data[2]);
  console.log("rectangle: "+[data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]]);
  ss.push(data[0], data[1], data[2], data[3], data[4], data[5]);
});
