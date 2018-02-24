// constants
const RADIUS = 8;
const CANVAS_WIDTH = document.documentElement.clientWidth * 0.9;
const CANVAS_HEIGHT = document.documentElement.clientHeight * 0.9;
const DIGIT_COL = 8;
const DIGIT_ROW = 12;
const COLON_COL = 5;
const DIGIT_WIDTH = 2 * DIGIT_COL * (RADIUS + 1);
const DIGIT_HEIGHT = 2 * DIGIT_ROW * (RADIUS + 1);
const COLON_WIDTH = 2 * COLON_COL * (RADIUS + 1);
const MARGIN_TOP = 30;
const MARGIN_LEFT = (CANVAS_WIDTH - 6 * DIGIT_WIDTH - 2 * COLON_WIDTH) / 2; // horizontally center the countdown
const COLOR = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];
const ONE_DAY = 24 * 3600;
const FRAME_RATE = 30;

// target date
var targetTime = new Date(2018, 3, 6, 10, 0, 0, 0);
var timeToDisplay = 0;
var balls = [];
var intervalID;

window.onload = function () {

  var canvas = document.getElementById("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // horizontally and vertically centered
  canvas.style.margin = (document.documentElement.clientHeight - CANVAS_HEIGHT) / 2 + "px auto";

  ctx = canvas.getContext("2d");

  timeToDisplay = getTimeToDisplay();

  startCountdown();

  // active
  window.addEventListener("focus", startCountdown);

  // inactive
  window.addEventListener("blur", stopCountdown);
};


function startCountdown() {
  intervalID = window.setInterval(function () {
    // draw patterns
    render(ctx);
    // update balls
    update();
  }, 1000 / FRAME_RATE);
}


function stopCountdown() {
  window.clearInterval(intervalID);
}


function render(ctx) {
  // refresh canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // render digits
  // day
  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(timeToDisplay.days / 10), ctx);
  renderDigit(MARGIN_LEFT + DIGIT_WIDTH, MARGIN_TOP, timeToDisplay.days % 10, ctx);
  // hour
  renderDigit(MARGIN_LEFT, MARGIN_TOP + DIGIT_HEIGHT, parseInt(timeToDisplay.hours / 10), ctx);
  renderDigit(MARGIN_LEFT + DIGIT_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, timeToDisplay.hours % 10, ctx);
  // colon
  renderDigit(MARGIN_LEFT + 2 * DIGIT_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, 10, ctx);
  // minute
  renderDigit(MARGIN_LEFT + 2 * DIGIT_WIDTH + COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, parseInt(timeToDisplay.minutes / 10), ctx);
  renderDigit(MARGIN_LEFT + 3 * DIGIT_WIDTH + COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, timeToDisplay.minutes % 10, ctx);
  // colon
  renderDigit(MARGIN_LEFT + 4 * DIGIT_WIDTH + COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, 10, ctx);
  // second
  renderDigit(MARGIN_LEFT + 4 * DIGIT_WIDTH + 2 * COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, parseInt(timeToDisplay.seconds / 10), ctx);
  renderDigit(MARGIN_LEFT + 5 * DIGIT_WIDTH + 2 * COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, timeToDisplay.seconds % 10, ctx);

  // render balls
  for (let i = 0; i < balls.length; i++) {
    ctx.beginPath();
    ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = balls[i].color;
    ctx.fill();
  }
}


function update() {
  var newTime = getTimeToDisplay();

  if (newTime.seconds !== timeToDisplay.seconds) {
    generateBalls(MARGIN_LEFT + 5 * DIGIT_WIDTH + 2 * COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, newTime.seconds % 10);

    if (parseInt(newTime.seconds / 10) !== parseInt(timeToDisplay.seconds / 10)) {
      generateBalls(MARGIN_LEFT + 4 * DIGIT_WIDTH + 2 * COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, parseInt(newTime.seconds / 10));
    }

    if (newTime.minutes % 10 !== timeToDisplay.minutes % 10) {
      generateBalls(MARGIN_LEFT + 3 * DIGIT_WIDTH + COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, newTime.minutes % 10);
    }

    if (parseInt(newTime.minutes / 10) !== parseInt(timeToDisplay.minutes / 10)) {
      generateBalls(MARGIN_LEFT + 2 * DIGIT_WIDTH + COLON_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, parseInt(newTime.minutes / 10));
    }

    if (newTime.hours % 10 !== timeToDisplay.hours % 10) {
      generateBalls(MARGIN_LEFT + DIGIT_WIDTH, MARGIN_TOP + DIGIT_HEIGHT, newTime.hours % 10);
    }

    if (parseInt(newTime.hours / 10) !== parseInt(timeToDisplay.hours / 10)) {
      generateBalls(MARGIN_LEFT, MARGIN_TOP + DIGIT_HEIGHT, parseInt(newTime.hours / 10));
    }

    if (newTime.days % 10 !== timeToDisplay.days % 10) {
      generateBalls(MARGIN_LEFT + DIGIT_WIDTH, MARGIN_TOP, newTime.days % 10);
    }

    if (parseInt(newTime.days / 10) !== parseInt(timeToDisplay.days / 10)) {
      generateBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(newTime.days / 10));
    }

    timeToDisplay = newTime;
  }

  updateBalls();
  console.log(balls.length);
}


function updateBalls() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;

    // bounce up when hitting the bottom
    if (balls[i].y > CANVAS_HEIGHT - RADIUS) {
      balls[i].y = CANVAS_HEIGHT - RADIUS;
      balls[i].vy *= -0.75;
    }
  }

  // remove balls outside of canvas
  balls = balls.filter(function (value) {
    return value.x > -RADIUS && value.x < CANVAS_WIDTH + RADIUS;
  });
}


function getTimeToDisplay() {
  var currentTime = new Date();
  var timeDiff = Math.round((targetTime.getTime() - currentTime.getTime()) / 1000);

  var days = Math.floor(timeDiff / ONE_DAY);
  var hours = Math.floor((timeDiff % ONE_DAY) / 3600);
  var minutes = Math.floor(((timeDiff % ONE_DAY) % 3600) / 60);
  var seconds = ((timeDiff % ONE_DAY) % 3600) % 60;

  return { days: days, hours: hours, minutes: minutes, seconds: seconds };
}


function renderDigit(left, top, num, ctx) {
  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] === 1) {
        ctx.beginPath();
        ctx.arc(left + 2 * j * (RADIUS + 1), top + 2 * i * (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = "#4d4dff";
        ctx.fill();
      }
    }
  }
}


function generateBalls(left, top, num) {
  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] === 1) {
        var ball = {
          x: left + 2 * j * (RADIUS + 1),
          y: top + 2 * i * (RADIUS + 1),
          vx: (Math.random() < 0.5 ? -1 : 1) * 4,
          vy: -5,
          g: 1.5 + Math.random(),
          color: COLOR[parseInt(Math.random() * COLOR.length)]
        };

        balls.push(ball);
      }
    }
  }
}