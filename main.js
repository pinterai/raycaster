window.addEventListener("resize", function() {

})

const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");
const square_dimensions = 45;

let px = 300, py = 300;
let pa = 180;


let x;
let y;
let length = 45;

const pwidth = 10;
const pheight = 10;

let previous = 10;

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

  const [dx, dy] = get_direction(pa);
  
  const cx = px + (pwidth / 2)
  const cy = py + (pwidth / 2)

  pen.beginPath();
  pen.strokeStyle = "yellow";
  pen.moveTo(cx, cy);
  pen.lineTo(cx+dx, cy+dy);
  pen.stroke();
}

function draw_ray(pa, px, py, grid) {
  let [dx, dy] = get_direction(pa); // initial x and y ratio lengths
  let rx;
  let ry;

  let ox;
  let oy;

  // upwards
  if (dy < 0) {
    ox = px+5; // catchup x
    oy = py+5; // catchup y
    while (true) {
      dy = Math.abs(dy);

      if (ox == px + 5 && oy == py + 5) { // first hit treated differently
        ry = (Math.floor(oy / 45) * 45);
      } else {
        ry = (Math.floor(oy / 45) * 45) - 45;
      }

      let dy_ratio = oy - ry; // length of traingle y
      let multiplier = dy_ratio / dy;
      let dx_ratio = dx * multiplier; // length of triangle x

      rx = ox + dx_ratio;

      if (
        grid[Math.floor(ry / 45)][Math.floor(rx / 45)] >= 0 &&
        grid[Math.floor(ry / 45)][Math.floor(rx / 45)] <= 8
      ) {
        check_square = grid[Math.floor(ry / 45)-1][Math.floor(rx / 45)];
        if (check_square == 1) { // next grid square is a wall
          break
        }
      } else {
        break
      }

      ox = rx;
      oy = ry;
    }
  }


    // downwards
    // if (dy > 0) {
      //dy = Math.abs(dy);
      //dx = Math.abs(dx);
    //} 


  //console.log(Math.floor(ry / 45));
  //console.log(Math.floor(Math.abs(rx) / 45));
  pen.beginPath();
  pen.strokeStyle = "red";
  pen.moveTo(px+5, py+5);
  pen.lineTo(rx, ry);
  pen.stroke();
}



function radian_converter(angle, hypotenuse) { // gets the 
  real_angle = angle * Math.PI / 180;
  let adjacent = Math.cos(real_angle) * hypotenuse // finds the adjacent length
  return adjacent
}

function get_direction(pa) {
  let length = 15;

  for (const [num, x_effect, y_effect, change] of template) {
    if (pa - num >= 0) {
      let angle = pa-num; // angle of sector of circle
      let opposite_angle = 180-(angle+90); // opposite angle to sector

      if (change == "y changes") {

        // x effect and y effect are multipliers to ensure the directions of the angle are correct
        dy = radian_converter(angle, length) * y_effect;
        dx = radian_converter(opposite_angle, length) * x_effect;
      } else {
        dx = radian_converter(angle, length) * x_effect;
        dy = radian_converter(opposite_angle, length) * y_effect;
      }
      break
    }
  }

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
    while (true) {
      let playerX_square = Math.floor(ox / 45);
      let playerY_square = Math.floor(oy / 45);

      let subtractX = playerX_square * 45;
      let subtractY = playerY_square * 45;

      ratio_dy = oy - subtractY;
      let multiplier = ratio_dy/dy
      ratio_dx = (multiplier*dx);

      rx = ox-ratio_dx;
      ry = oy-ratio_dy;

      ox = rx - 90;
      oy = ry - 45;

      let next_squareX = Math.floor(ox / 45);
      let next_squareY = playerY_square - 1;

      if (grid[next_squareY][next_squareX] == 1) {
          break
      }
    }
    pen.beginPath();
    pen.strokeStyle = "yellow";
    pen.moveTo(px+5, py+5);
    pen.lineTo(rx, ry);
    pen.stroke();
  }
}

function game_loop() {
  pen.clearRect(0, 0, canvas.width, canvas.height);
  draw_scene_2d();
  draw_player_2d();
  draw_ray(pa, px, py, grid)
  let [dx, dy] = get_direction(pa);
  //draw_rays(dx, dy, px, py)
  requestAnimationFrame(game_loop);
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
