window.addEventListener("resize", function() {

})

const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");
const square_dimensions = 45;

let px = 300, py = 300;
let pa = 0;


let x;
let y;
let length = 45;

const pwidth = 10;
const pheight = 10;

let previous = 10;

// angle, x effect, y effect
  let template = [ 
    [270, 1, -1, "y changes"],
    [180, -1, -1, "x changes"],
    [90, -1, 1, "y changes"],
    [0, 1, 1, "x changes"]
  ]


function draw_square(x, y, colour) {
  pen.fillStyle = colour;
  pen.fillRect(x, y, square_dimensions - 1, square_dimensions - 1)
}

function draw_scene_2d() {
  const grid = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ]

  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 8; column++) {
      if (grid[row][column] == 1) {
        colour = "white";
      } else {
        colour = "black";
      }

      draw_square(column*square_dimensions, row*square_dimensions, colour)
    }
  }
}

function draw_player_2d() {
  pen.fillStyle = "yellow";
  pen.fillRect(px, py, pwidth, pheight);
}

function calc_coordinate(angle, hypotenuse) {
  real_angle = angle * Math.PI / 180;
  let coordinate = Math.cos(real_angle) * hypotenuse
  return coordinate
}

function draw_line(pa) {
  let angle1;
  let angle2;
  let angle3;

  const [dx, dy] = get_direction(pa);
  
  const cx = px + (pwidth / 2)
  const cy = py + (pwidth / 2)

  pen.beginPath();
  pen.strokeStyle = "yellow";
  pen.moveTo(cx, cy);
  pen.lineTo(cx+dx, cy+dy);
  pen.stroke();

}

function get_direction(pa) {
  let length = 15;

  for (const [num, x_effect, y_effect, change] of template) {
    if (pa - num >= 0) {
      angle1 = pa-num;
      angle2 = 90;
      angle3 = 180-(angle1+angle2);

      if (change == "y changes") {
        y = calc_coordinate(angle1, length) * y_effect;
        x = calc_coordinate(angle3, length) * x_effect;
      } else {
        x = calc_coordinate(angle1, length) * x_effect;
        y = calc_coordinate(angle3, length) * y_effect;
      }
      break
    }
  }

  let dx = x;
  let dy = y;

  return [dx, dy]
}

function draw_rays(dx, dy, px, py) {
  let ox = px+5; // line's starting x y coords, updates to end each round
  let oy = py+5;

  let ry; // moved x y coordinates, where the line ends
  let rx;

  let ratio_dy; // the dy scaled to current triangle
  let ratio_dx;

  
  if (Math.sin(pa* Math.PI / 180) < 0) { //going upwards
    let playerX_square = Math.floor(ox / 45);
    let playerY_square = Math.floor(oy / 45);

    let subtractX = playerX_square * 45;
    let subtractY = playerY_square * 45;

    ratio_dy = oy - subtractY;
    let multiplier = ratio_dy/dy
    ratio_dx = (multiplier*dx);

    rx = ox-ratio_dx;
    ry = oy-ratio_dy;

    pen.beginPath();
    pen.strokeStyle = "yellow";
    pen.moveTo(ox, oy);
    pen.lineTo(rx, ry);
    pen.stroke();

    ox = rx+5;
    oy = ry+5;
  }
}

function game_loop() {
  pen.clearRect(0, 0, canvas.width, canvas.height);
  draw_scene_2d();
  draw_player_2d();
  let [dx, dy] = get_direction(pa);
  draw_rays(dx, dy, px, py)

  requestAnimationFrame(game_loop);
  draw_line(pa)
}



window.addEventListener("keydown", (e) => {
    if (e.key === "w") {
      let [dx, dy] = get_direction(pa);
      px += dx;
      py += dy;
      
    }
    if (e.key === "s") {
      let [dx, dy] = get_direction(pa);
      px += -dx;
      py += -dy;

    }
    if (e.key === "a") {
      if (pa <= 10) {
        pa = 360-previous
        previous += 10
      } else {
        pa -= 10
      }
    }
    if (e.key === "d") {
      pa += 10;
    }
})
game_loop()
