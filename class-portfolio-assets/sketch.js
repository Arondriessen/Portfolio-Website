

function setup() {

  createCanvas(windowWidth, windowHeight);

  // Variables

  gridW = width;
  hRes = 20;
  cellSize = gridW / hRes;
  vRes = ceil(height / cellSize);
  startX = (width - gridW) / 2;
  startY = (height / 2) - ((vRes * cellSize) / 2);

  shapes = [];
  dotPositions = [[0, 0], [1, 0], [1, 1], [0, 1]];

  waveTimer = 0;

  spd = 50;

  activeUIAnims = [];

  transP = 255;

  // Create BG Grid

  drawGrid();
  createShapes();
}


function draw() {

  background(255);


  // Draw Background Grid

  image(bgImg, 0, 0);

  drawShapes();
  updateShapes();
  cleanUpShapesArray();

  if (waveTimer == spd) {

    createShapes();
    waveTimer = 0;
  }

  animateUIElement();
}


function drawGrid() {

  noFill();
  stroke(240);

  // Draw Horizontal Lines

  for (let i = 0; i < (vRes + 1); i++) {

    let yy = startY + (i * cellSize);
    line(startX, yy, startX + gridW, yy);
  }

  // Draw Vertical Lines

  for (let i = 0; i < (hRes - 1); i++) {

    let xx = startX + (i + 1) * cellSize;
    line(xx, 0, xx, height);
  }

  // Draw Gradient

  let unit = width / 60;

  for (let i = 0; i < 255; i++) {

    fill(255, i);
    noStroke();
    rect(i * unit, 0, (i + 1) * unit, height);
  }

  // Save to Image

  bgImg = get();
}


function createShapes() {

  // Create New Wave of Shapes

  // 33% chance of it being a circle (default)
  // if not the shape is made up of dots
  // to form a triangle or square

  for (let i = 0; i < vRes; i++) {

    let tempDots;

    if (random() > 0.33) {

      tempDots = [];
      let tempDotPositions = [0, 1, 2, 3];

      for (let i = 0; i < (ceil(random(2)) + 2); i++) {

        let num = floor(random(tempDotPositions.length));
        tempDots.push(dotPositions[tempDotPositions[num]].slice());
        tempDotPositions.splice(num, 1);
      }

    } else { tempDots = 0; }

    switch(floor(random(3))) {

      case 0:
        c = color('#3700ff');
        break;

      case 1:
        c = color('#ff0074');
        break;

      case 2:
        c = color('#ff3000');
        break;
    }

    let tempShape = [
      0, // x
      i, // y
      tempDots,
      c, // colour (yellow, green, purple, pink)
      255, // dot transparency
      0, // line transparency
      0, // black fill transparency
      0, // colour fill transparency
      1
    ];

    shapes.push(tempShape);

    let dur = (hRes / 5) * spd;
    let range = dur / 3;
    let dur1 = random(dur - range, dur + range);
    let dur2 = random(dur - range, dur + range);
    let dur3 = random(dur - range, dur + range);
    let scale = random(0.3, 0.9);

    animateUIElement([[shapes[shapes.length - 1], 4]], [255], [0], dur1, 0);
    animateUIElement([[shapes[shapes.length - 1], 5]], [0], [100], dur1, 0);

    animateUIElement([[shapes[shapes.length - 1], 5]], [100], [0], dur2, 0, dur1);
    animateUIElement([[shapes[shapes.length - 1], 8]], [1], [scale], dur2, 0, dur1);
    animateUIElement([[shapes[shapes.length - 1], 6]], [0], [transP], dur2, 0, dur1);

    animateUIElement([[shapes[shapes.length - 1], 6]], [transP], [0], dur3, 0, dur1 + dur2);
    animateUIElement([[shapes[shapes.length - 1], 7]], [0], [255], dur3, 0, dur1 + dur2);
  }
}


function drawShapes() {

  for (let i = 0; i < shapes.length; i++) {

    // Set top-left corner of shape

    let sX = shapes[i][0];

    let x = startX + (sX * cellSize);
    let y = startY + (shapes[i][1] * cellSize);

    // Progress state of shape

    let drawShape = 1;

    if (shapes[i][4] > 0) {

      // Draw Dots

      fill(0, shapes[i][4]);
      noStroke();

      if (shapes[i][2] == 0) {

        // Draw Circle Dot (Centred)

        circle(x + (0.5 * cellSize), y + (0.5 * cellSize), 3);

      } else {

        // Draw Outline Dots

        for (let z = 0; z < shapes[i][2].length; z++) {

          circle(x + (shapes[i][2][z][0] * cellSize), y + (shapes[i][2][z][1] * cellSize), 3);
        }
      }

    }

    noFill();
    noStroke();

    if (shapes[i][5] > 0) {

      // Draw Outlines

      strokeWeight(0.5);
      stroke(0, shapes[i][5]);
    }

    if (shapes[i][7] > 0) {

      // Draw Colour-Filled Shapes

      let cBlack = color(0);
      let cc = lerpColor(cBlack, shapes[i][3], shapes[i][7] / 255);
      let ccc = color(cc.levels[0], cc.levels[1], cc.levels[2], transP);

      fill(ccc);

    } else if (shapes[i][6] > 0) {

      // Draw Black-Filled Shapes

      fill(0, shapes[i][6]);
    }


    // Draw Shape

    if (drawShape) {

      if (shapes[i][2] == 0) {

        circle(x + (cellSize / 2), y + (cellSize / 2), cellSize * shapes[i][8]);

      } else {

        beginShape();

        let margin = ((1 - shapes[i][8]) * cellSize) / 2;

        for (let z = 0; z < shapes[i][2].length; z++) {

          vertex(x + margin + (shapes[i][2][z][0] * cellSize * shapes[i][8]), y + margin + (shapes[i][2][z][1] * cellSize * shapes[i][8]));
        }

        endShape(CLOSE);
      }
    }
  }
}


function updateShapes() {

  // Move Shapes

  for (let i = 0; i < shapes.length; i++) {

    shapes[i][0] += 1 / spd;
  }

  // siduhud9

  waveTimer++;
}


function cleanUpShapesArray() {

  for (let i = (shapes.length - 1); i > -1; i--) {

    if (shapes[i][0] > hRes) {

      shapes.splice(i, 1);
    }
  }
}


function createTestShapes() {

  shapes = [hRes * vRes];

  for (let i = 0; i < (hRes * vRes); i++) {

    let y = floor(i / hRes)
    let x = i - (y * hRes);
    let shape = floor(random(3));
    let c = floor(random(4));

    shapes[i] = [
      x, // x
      y, // y
      shape, // shape type (square, triangle, circle)
      c // colour (yellow, green, purple, pink)
    ];
  }
}


function drawTestShapes() {

  for (let i = 0; i < shapes.length; i++) {

    let x = startX + (shapes[i][0] * cellSize);
    let y = startY + (shapes[i][1] * cellSize);

    noStroke();

    switch(shapes[i][3]) {

      default:
        noFill();
        break;

      case 0:
        fill(color('#ffd600'));
        break;

      case 1:
        fill(color('#00ff75'));
        break;

      case 2:
        fill(color('#7000ff'));
        break;

      case 3:
        fill(color('#ff0074'));
        break;
    }

    switch(shapes[i][2]) {

      default:
        break;

      case 0:
        rect(x, y, cellSize, cellSize);
        break;

      case 1:
        triangle(x + (cellSize / 2), y, x, y + cellSize, x + cellSize, y + cellSize);
        break;

      case 2:
        circle(x + (cellSize / 2), y + (cellSize / 2), cellSize);
        break;
    }
  }
}


function animateUIElement(elements, start, end, time, reset, delay) {

  // Animates any specified array value from a start to an end position in x amount of time
  // Multiple overlapping (in time) animations can be handled at the same time
  // "Reset" specifies whether the animated value should be reset after the animation or not
  // "Delay" specifies the amount of time the start of the animation should be delayed by

  if (elements != undefined) { // Add new anim

    let noDuplicate = 1;

    if (noDuplicate) {

      let spd = [end.length];

      for (let i = 0; i < end.length; i++) {

        spd[i] = (end[i] - start[i]) / time;
      }

      if (delay == undefined) { delay = 0; }

      if (reset == 0) {

        activeUIAnims.push([elements, end, spd, time, start, end, delay]);

      } else {

        activeUIAnims.push([elements, end, spd, time, start, start, delay]);
      }
    }

  } else { // Continue active anims

    for (let i = 0; i < activeUIAnims.length; i++) { // Cycle through anims

      if (activeUIAnims[i][6] < 1) { // If delay is over

        activeUIAnims[i][3]--; // Decrease anim time left

        if (activeUIAnims[i][6] == 0) {

          for (let y = 0; y < activeUIAnims[i][0].length; y++) { // Cycle through elements (variables to animate in one batch)

            let elem = activeUIAnims[i][0][y][0];
            let elemIndex = activeUIAnims[i][0][y][1];

            elem[elemIndex] = activeUIAnims[i][4][y]; // Set starting state

             activeUIAnims[i][6]--; /* Decrease delay time left */
          }
        }

        if (activeUIAnims[i][3] > 0) { // If anima has time left

          for (let y = 0; y < activeUIAnims[i][0].length; y++) { // Cycle through elements (variables to animate in one batch)

            let elem = activeUIAnims[i][0][y][0];
            let elemIndex = activeUIAnims[i][0][y][1];

            elem[elemIndex] += activeUIAnims[i][2][y];
          }

        } else {

          for (let y = 0; y < activeUIAnims[i][0].length; y++) { // Cycle through elements (variables to animate in one batch)

            let elem = activeUIAnims[i][0][y][0];
            let elemIndex = activeUIAnims[i][0][y][1];

            elem[elemIndex] = activeUIAnims[i][5][y];
          }

          activeUIAnims.splice(i, 1);
        }

      } else { activeUIAnims[i][6]--; /* Decrease delay time left */ }
    }
  }
}
