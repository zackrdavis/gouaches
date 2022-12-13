const swatches = document.querySelectorAll(".swatch");
const canvas = document.querySelector("canvas");
const cvWidth = canvas.width;
const cvHeight = canvas.height;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
ctx.strokeStyle = "black";

let selectedColor = colors.black;

// is user currently drawing a line? If so from where?
let isDrawingFrom: Coords | false = false;

// set and clear this timer when filling or finished
let fillInterval = 0;

// store where the fill began
let fillStart: Coords = [0, 0];

// queue of pixels to test/fill
let testStack: Coords[] = [];

// 2D array to track already-filled pixels by qualities other than color
let pixelMap: Color[][];

// init pixelMap
resetPixelMap();

const fill = (diagonal = false) => {
  if (testStack.length > 0) {
    // pull from the beginning of the stack
    // spreads around start point instead of column-by-column
    // actual queue might be more efficient
    const [x, y] = testStack.shift();

    if (
      // is not a wax pencil line
      !isPencil(getPixelColor([x, y])) &&
      // has not been set as part of this fill
      isColorEq(pixelMap[x][y], [0, 0, 0, 0])
    ) {
      // new color will be selectedColor faded by distanceFromStart
      const newColor: Color = [...selectedColor];
      newColor[3] = Math.max(
        selectedColor[3] - distance(fillStart, [x, y]),
        20
      );

      drawColorPixel([x, y], newColor);

      // save where we drew the new color
      pixelMap[x][y] = selectedColor;

      // By alternating NSEW and diagonals, and randomizing the order
      // of the test stack, we get a rounded-square fill area.
      // Skips some pixels but that looks nice too :)
      const neighbors = !diagonal
        ? ([
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
          ].filter(isInBounds) as Coords[])
        : ([
            [x + 1, y + 1],
            [x - 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y - 1],
          ].filter(isInBounds) as Coords[]);

      // shuffle in place
      shuffleArray(neighbors);

      testStack.push(...neighbors);
    }
  }
};

const startFill = (pos: Coords) => {
  fillStart = pos;
  testStack.push(pos);

  fillInterval = setInterval(
    () =>
      nTimes(
        () => {
          // fill once for NSEW
          fill();
          // fill again for diagonals
          fill(true);
        },
        // increase loops-per-second at same rate that testStack is growing
        testStack.length
      ),
    10
  );
};

const handleMouseDown = (e: PointerEvent) => {
  const [x, y] = getCoords(e);

  if (selectedColor == colors.black) {
    // If pencil selected, save as starting position for a potential line
    isDrawingFrom = [x, y];
    // initial pixel
    drawColorPixel([x, y], selectedColor);
  } else {
    // otherwise begin fill
    startFill([x, y]);
  }
};

const handleMouseMove = (e: PointerEvent) => {
  if (isDrawingFrom) {
    const [x, y] = getCoords(e);

    lineBetween(isDrawingFrom, [x, y]);

    // save the new starting position
    isDrawingFrom = [x, y];
  }
};

const handleMouseUp = (e: PointerEvent) => {
  // reset everything
  isDrawingFrom = false;
  clearInterval(fillInterval);
  testStack = [];
  resetPixelMap();
};

const handleSwatchClick = (e: MouseEvent) => {
  // get the color name from the div's style
  const target = e.target as HTMLDivElement;
  const colorName = target.style.background;

  // set selectedColor
  selectedColor = colors[colorName];

  // set line color for canvas
  ctx.strokeStyle = `rgba(${selectedColor.join(",")})`;
};

document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mousemove", handleMouseMove);

// listeners for palette swatches
swatches.forEach((swatch) =>
  swatch.addEventListener("click", handleSwatchClick)
);
