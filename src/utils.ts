/** Repeat a function `n` times */
const nTimes = (fn: any, n: number) => {
  for (let i = 0; i < n; i++) {
    fn();
  }
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

/** Get the color of a canvas pixel */
const getPixelColor = (pos: Coords) => {
  const [x, y] = pos;

  const imageData = ctx.getImageData(x, y, 1, 1).data;

  return [imageData[0], imageData[1], imageData[2], imageData[3]] as Color;
};

/** Draw a single pixel */
const drawColorPixel = (pos: Coords, color: Color) => {
  const [x, y] = pos;

  const [r, g, b, a] = color;

  ctx.fillStyle = "rgba(" + [r, g, b, a / 255].join() + ")";
  ctx.fillRect(x, y, 1, 1);
};

/** Draw a black line between two points */
const lineBetween = (pos1: Coords, pos2: Coords) => {
  if (isDrawingFrom) {
    const [x1, y1] = pos1;
    const [x2, y2] = pos2;

    // render the path
    ctx.beginPath();
    // add 0.5 because positions are between pixels by default.
    // I want solid black lines.
    ctx.moveTo(x1 + 0.5, y1 + 0.5);
    ctx.lineTo(x2 + 0.5, y2 + 0.5);
    ctx.stroke();
    ctx.closePath();
  }
};
