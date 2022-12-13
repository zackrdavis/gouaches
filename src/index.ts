const swatches = document.querySelectorAll(".swatch");
const canvas = document.querySelector("canvas");
const cvWidth = canvas.width;
const cvHeight = canvas.height;
const ctx = canvas.getContext("2d", { willReadFrequently: true });

ctx.lineWidth = 2;
ctx.strokeStyle = "black";

type Coords = [number, number];
type Color = [number, number, number, number];

const colors: { [key: string]: Color } = {
  black: [0, 0, 0, 255],
  red: [255, 0, 0, 255],
  green: [0, 255, 0, 255],
  blue: [0, 0, 255, 255],
};

let selectedColor = colors.black;

// is user currently drawing a line? If so from where?
let isDrawingFrom: Coords | false = false;

// set and clear this timer when filling or finished
let fillInterval = 0;

let fillStart: Coords = [0, 0];
// queue of pixels to test/fill
let testStack: Coords[] = [];
// 2D array to track already-filled pixels by qualities other than color
let pixelMap: Color[][];
// init pixelMap
resetPixelMap();

const fill = (diagonal = false) => {
  if (testStack.length > 0) {
    const [x, y] = testStack.shift();

    const testColor = getPixelColor([x, y]);

    const mapColor = pixelMap[x][y];

    if (
      // color is not blackIsh (uncrossable crayon lines)
      !isPencil(testColor) &&
      // map says this color is not set
      isColorEq(mapColor, [0, 0, 0, 0])
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

      // By alternating NSEW and diagonals
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

      shuffleArray(neighbors);

      testStack.push(...neighbors);
    }
  }
};

const startFill = (pos: Coords) => {
  fillStart = pos;
  testStack.push(pos);

  fillInterval = setInterval(
    // increase loops-per-second at same rate that testStack is growing
    () =>
      nTimes(() => {
        fill();
        fill(true);
      }, testStack.length),
    10
  );
};

const stopFill = () => {
  console.log("stopFill");

  clearInterval(fillInterval);

  // reset lists
  testStack = [];
  resetPixelMap();
};

const handleMouseDown = (e: PointerEvent) => {
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  // save as starting position for a potential line
  if (selectedColor == colors.black) {
    isDrawingFrom = [x, y];
    // initial pixel
    drawColorPixel([x, y], selectedColor);
  } else {
    //isFillingWithColor = selectedColor;
    startFill([x, y]);
  }
};

const handleMouseMove = (e: PointerEvent) => {
  if (isDrawingFrom) {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    lineBetween(isDrawingFrom, [x, y]);

    // save the new starting position
    isDrawingFrom = [x, y];
  }
};

const handleMouseUp = (e: PointerEvent) => {
  isDrawingFrom = false;
  //isFillingWithColor = false;
  stopFill();
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
