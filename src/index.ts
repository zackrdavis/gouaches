const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
ctx.lineWidth = 1;
ctx.strokeStyle = "black";

let drawing = true;
let lastMouseMovePos: false | [number, number] = false;

/** Draw a single pixel */
const drawColorPixel = (pos: [number, number], color: number[]) => {
  const [x, y] = pos;
  const [r, g, b, a] = color;

  // convert x,y to the start index for the color data
  const imageIndex = x + y * canvas.width;

  // get the current imageData
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // add the new pixel
  image.data[imageIndex * 4 + 0] = r;
  image.data[imageIndex * 4 + 1] = g;
  image.data[imageIndex * 4 + 2] = b;
  image.data[imageIndex * 4 + 3] = a;

  // write the new image to the canvas
  ctx.putImageData(image, 0, 0);
};

/** Draw a black line between two points */
const lineBetween = (pos1: [number, number], pos2: [number, number]) => {
  if (lastMouseMovePos) {
    const [x1, y1] = pos1;
    const [x2, y2] = pos2;

    // render the path
    ctx.beginPath();
    ctx.moveTo(x1 + 0.5, y1 + 0.5);
    ctx.lineTo(x2 + 0.5, y2 + 0.5);
    ctx.stroke();
    ctx.closePath();
  }
};

const handleMouseDown = (e: PointerEvent) => {
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  // save as starting position for a potential line
  lastMouseMovePos = [x, y];

  // draw the pixel
  drawColorPixel([x, y], [0, 0, 0, 255]);
};

const handleMouseMove = (e: PointerEvent) => {
  if (lastMouseMovePos) {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    lineBetween(lastMouseMovePos, [x, y]);

    // save the new starting position
    lastMouseMovePos = [x, y];
  }
};

const handleMouseUp = (e: PointerEvent) => {
  // clear line starting position
  lastMouseMovePos = false;
};

document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mousemove", handleMouseMove);
