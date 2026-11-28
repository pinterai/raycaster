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

  let Xdx; // ratio of change in X when vertical wall is hit
  let Xdy; // ratio of change in Y when vertical wall is hit
  let Xdh; // hypotenuse of dx, dy when vertical wall is hit

  let Ydx; // ratio of change in X when horizontal wall is hit
  let Ydy; // ratio of change in Y when horizontal wall is hit
  let Ydh; // hypotenuse of dx, dy when horizontal wall is hit

  let multiplier;

  let xgrid;
  let ygrid;

  // upwards
  //if (dy < 0) {
  ox = px+5; // catchup x
  oy = py+5; // catchup y
  while (true) {

    if (ox == px + 5 && oy == py + 5) { // first hit treated differently
      if (dx < 0) { // left side hit
        Xdx = Math.abs(ox - Math.floor(ox / 45) * 45);
      } else { // right side hit
        Xdx = Math.abs(ox - Math.ceil(ox / 45) * 45);
      }
      if (dy < 0) {
        Ydy = Math.abs(oy - Math.floor(oy / 45) * 45); // upwards
      } else {
        Ydy = Math.abs(oy - Math.ceil(oy / 45) * 45); // downwards
      }
    } else {
      if (dx < 0) { // left side hit
        Xdx = Math.abs(ox - (Math.floor(ox / 45) * 45));
      } else { // right side hit
        Xdx = Math.abs(ox - (Math.ceil(ox / 45) * 45));
      }
      if (dy < 0) {
        Ydy = Math.abs(oy - Math.floor(oy / 45) * 45); // upwards
      } else {
        Ydy = Math.abs(oy - Math.ceil(oy / 45) * 45); // downwards
      }

      if (Xdx == 0) {Xdx = 45};
      if (Ydy == 0) {Ydy = 45};
    }

    // if vertical wall is hit
    multiplier = Xdx / Math.abs(dx);
    Xdy = Math.abs(dy) * multiplier;
    Xdh = Math.sqrt((Xdx ** 2) + (Xdy ** 2)); // pythagoras

    // if horizontal wall is hit
    multiplier = Ydy / Math.abs(dy);
    Ydx = Math.abs(dx) * multiplier;
    Ydh = Math.sqrt((Ydx ** 2) + (Ydy ** 2)); // pythagoras

    if (Ydh < Xdh) { // we take horizontal wall hit
      if (dx < 0) { // left side hit
        rx = ox - Ydx;

        xgrid = Math.floor(rx / 45);
      } else { // right side hit
        rx = ox + Ydx;

        xgrid = Math.floor(rx / 45); 
      }
      if (dy < 0) {
        ry = oy - Ydy;
      } else {
        ry = oy + Ydy;
      }

      if (dy < 0) {
        ygrid = Math.floor(ry / 45) - 1; // upwards
      } else {
        ygrid = Math.ceil(ry / 45); // downwards
      }

    } else if (Xdh < Ydh) { // we have vertical wall hit
      if (dx < 0) { // left side hit
        rx = ox - Xdx;

        xgrid = Math.floor(rx / 45) - 1;
      } else { // right side hit
        rx = ox + Xdx;

        xgrid = Math.ceil(rx / 45);
      }
      if (dy < 0) {
        ry = oy - Xdy;
      } else {
        ry = oy + Xdy;
      }

      ygrid = Math.floor(ry / 45);
    }

    if (
      ygrid >= 1 &&
      xgrid >= 1 &&
      ygrid <= 7 &&
      xgrid <= 7
    ) {
      check_square = grid[ygrid][xgrid];
      if (check_square == 1) { // next grid square is a wall
        break
      }
    } else {
      break
    }

    ox = rx;
    oy = ry;
  }

  pen.beginPath();
  pen.strokeStyle = "red";
  pen.moveTo(px+5, py+5);
  pen.lineTo(rx, ry);
  pen.stroke();

  return Math.max(Xdh, Ydh);
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

function game_loop() {
  pen.clearRect(0, 0, canvas.width, canvas.height);
  draw_scene_2d();
  draw_player_2d();

  for (angle = pa - 30; angle < pa + 30; angle ++) {
    draw_ray(angle, px, py, grid);
  }
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
        previous += 5
      } else {
        pa -= 5
      }
    }
    if (e.key === "d") {
      pa += 5;
    }
})
game_loop()
