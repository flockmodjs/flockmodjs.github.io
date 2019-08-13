var socket = io.connect('https://flockmodjs--locknessko.repl.co');
let img;
let c = 0;
let bwidth;
let clearc;

function setup() {
  c = get(0, 0);
  clearc = createButton('Clear');
  clearc.position(110, 60);
  clearc.mousePressed(function() {
    background(255);
    fill(0);
    text("Brush Width", 110, 20);
    socket.emit('clear', 'do it bro!');
  });
  bwidth = createSlider(0, 50, 10);
  bwidth.position(110, 30);
  img = loadImage('grad.jpg');
  createCanvas(window.innerWidth, window.innerHeight - 4);
  background(255);
  text("Brush Width", 110, 20);
}

function draw() {
  image(img, 0, 0, 100, 100);

  if (mouseIsPressed && mouseX < 100 && mouseY < 100) {
    c = get(mouseX, mouseY); // get the color under the mouse
  }
  
  if (mouseIsPressed) {
    if (mouseX < window.innerWidth && mouseY > 100) {
      let r = red(c); // get the red channel
      let g = green(c); // get the green channel
      let b = blue(c); // get the blue channel
      fill(r, g, b);
      smooth(); //why not
      noStroke();
      circle(mouseX, mouseY, bwidth.value());
      socket.emit('draw_circle', [mouseX, mouseY, bwidth.value(), r, g, b]);
    }
  }
}
socket.on('clear', function(data) {
  background(255);
  fill(0);
  text("Brush Width", 110, 20);
});
socket.on('draw_circle', function(data) {
  noStroke();
  fill(data[3], data[4], data[5]);
  circle(data[0], data[1], data[2]);
});
