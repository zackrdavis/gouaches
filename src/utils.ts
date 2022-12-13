/** Reset the pixel map */
const resetPixelMap = () => {
  pixelMap = [...Array(cvWidth)].map((_) =>
    [...Array(cvHeight)].map((_) => [0, 0, 0, 0])
  );
};

/** get canvas coordinates from clicks */
const getCoords = (e: PointerEvent) => {
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  return [x, y] as Coords;
};

/** Repeat a function `n` times */
const nTimes = (fn: any, n: number) => {
  for (let i = 0; i < n; i++) {
    fn();
  }
};

/** Test if color is black-ish (pencil line) */
const isPencil = (testColor: Color) => {
  // if 2 of 3 color channels are less than 20
  // TODO: Revisit this - not quite working perceptually
  // but it does allow pencil lines over colors to contain addt'l fills
  const lowColors = testColor.slice(0, 3).filter((v) => v < 100);

  return lowColors.length > 2 && testColor[3] !== 0;

  // return (
  //   testColor[0] == 0 &&
  //   testColor[1] == 0 &&
  //   testColor[2] == 0 &&
  //   testColor[3] !== 0
  // );
};

/** get diagonal distance between coordinates, rounded */
const distance = ([x1, y1]: Coords, [x2, y2]: Coords) => {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.round(Math.sqrt(a * a + b * b));
};

/**
 * Shuffle array in place
 *
 * From: https://stackoverflow.com/a/12646864
 */
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/** Compare two colors */
const isColorEq = (colorA: Color, colorB: Color) => {
  return (
    colorA[0] == colorB[0] &&
    colorA[1] == colorB[1] &&
    colorA[2] == colorB[2] &&
    colorA[3] == colorB[3]
  );
};

const isInBounds = ([x, y]: Coords) => {
  return x <= cvWidth - 1 && y <= cvHeight - 1 && x >= 0 && y >= 0;
};

/** Get the color of a canvas pixel */
const getPixelColor = ([x, y]: Coords) => {
  const imageData = ctx.getImageData(x, y, 1, 1).data;

  return [imageData[0], imageData[1], imageData[2], imageData[3]] as Color;
};

/** Draw a single pixel */
const drawColorPixel = ([x, y]: Coords, color: Color) => {
  const [r, g, b, a] = color;

  ctx.fillStyle = "rgba(" + [r, g, b, a / 255].join() + ")";
  ctx.fillRect(x, y, 1, 1);
};

/** Draw a black line between two points */
const lineBetween = ([x1, y1]: Coords, [x2, y2]: Coords) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
};
