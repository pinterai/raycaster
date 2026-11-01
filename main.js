window.addEventListener("resize", function() {

})

const canvas = document.getElementById("canvas");
const pen = canvas.getContext("2d");
const square_dimensions = 45;

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

function game_loop() {
  draw_scene_2d();
  requestAnimationFrame(game_loop);
}

game_loop()