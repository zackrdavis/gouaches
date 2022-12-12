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
let testStack: Coords[] = [];

const fill = () => {
  nTimes(() => {
    if (testStack.length > 0) {
      // inefficient queue
      const testNode = testStack.shift();

      // check for insideness (currently blankness)
      if (isColorEq(getPixelColor(testNode), [0, 0, 0, 0])) {
        drawColorPixel(testNode, selectedColor);

        // west, east, north and south nodes
        const neighbors: Coords[] = [
          [testNode[0] + 1, testNode[1]],
          [testNode[0] - 1, testNode[1]],
          [testNode[0], testNode[1] + 1],
          [testNode[0], testNode[1] - 1],
        ];

        const insideCanvas = neighbors.filter(
          (node) =>
            node[0] <= cvWidth - 1 &&
            node[1] <= cvHeight - 1 &&
            node[0] >= 0 &&
            node[1] >= 0
        );

        shuffleArray(insideCanvas);

        testStack.push(...insideCanvas);
      }
    }
  }, testStack.length);
};

const startFill = (pos: Coords) => {
  testStack.push(pos);
  fillInterval = setInterval(fill, 10);
};

const stopFill = () => {
  clearInterval(fillInterval);
  testStack = [];
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
