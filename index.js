/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const easy = document.querySelector(".easy");
const normal = document.querySelector(".normal");
const hard = document.querySelector(".hard");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const impossible = document.querySelector(".impossible");

const colisionCanvas = document.getElementById("collisitionCanvas");
const colisionCtx = colisionCanvas.getContext("2d");
colisionCanvas.width = window.innerWidth;
colisionCanvas.height = window.innerHeight;

let score = 0;

let ravens = [];

let timeToNextRaven = 0;
let ravenInterval = 300;
let lastTime = 0;

let directionX = Math.random() * 5 + 2;

function handleDifficultyClick(factor) {
  directionX = Math.random() * 5 + factor;
}

easy.addEventListener("click", () => handleDifficultyClick(1));
normal.addEventListener("click", () => handleDifficultyClick(2));
hard.addEventListener("click", () => handleDifficultyClick(5));
impossible.addEventListener("click", () => handleDifficultyClick(25));

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = directionX;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src =
      "https://github.com/Florin12er/javascript-game-5/blob/main/images/raven.png?raw=true";
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 100 + 20;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }
  update(delta) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.timeSinceFlap += delta;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
}

window.addEventListener("click", (e) => {
  const detectPixelColor = ctx.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
});

function animate(timeStamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let delta = timeStamp - lastTime;
  lastTime = timeStamp;
  timeToNextRaven += delta;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }
  drawScore();
  [...ravens].forEach((object) => object.update(delta));
  [...ravens].forEach((object) => object.draw());
  ravens = ravens.filter((object) => !object.markedForDeletion);
  requestAnimationFrame(animate);
}
animate(0);

//last TimeStamp : 3:25:46
