const game = {
  w: 900,
  h: 550,
  air: 1, //el margen de cuadrado
  score: 0,
  lives: 3,
  villainInterval:null,
  hero: {
    w: 80,
    h: 100,
    x: 0,
    y: 0,
    speed: 20,
    turbo: false,
    bearing:'N',
  },
  villain: {
    w: 100,
    h: 100,
    x: 0,
    y: 0,
  },
};
const audio = document.getElementById("audio");
const gameOverAudio = document.getElementById("gameOverAudio");
function resetPosition() {
  game.hero.x = (game.w - game.hero.w) / 2;
  game.hero.y = (game.h - game.hero.h) / 2;
  positionVillain();
  draw();
}
function initGame() { 
  audio.currentTime = 0;
  audio.play();
  game.lives = 3;
  game.score = 0;
  resetPosition();
  window.addEventListener("keydown", moveHero);
  clearInterval(game.villainInterval); // Clear previous interval
  game.villainInterval = setInterval(badOneInterval, 5000);
 
}
function badOneInterval() {
  positionVillain();
  draw();
}
function moveHero(e) {
  switch (e.code) {
    case "ArrowUp":
      game.hero.y -= game.hero.speed;
      game.hero.bearing = 'N';
      break;
    case "ArrowDown":
      game.hero.y += game.hero.speed;
      game.hero.bearing = 'S';
      break;
    case "ArrowLeft":
      game.hero.x -= game.hero.speed;
      game.hero.bearing = 'W';
      break;
    case "ArrowRight":
      game.hero.x += game.hero.speed;
      game.hero.bearing = 'E';
      break;
    case "ShiftLeft":
    case "ShiftRight":
      game.hero.turbo = !game.hero.turbo;
      game.hero.speed = game.hero.turbo ? 25 : 20;
      
      break;
  }
  drawHero();
  if (crashed()) {
    game.lives--;
    resetPosition();
    if (game.lives === 0) {
      gameOver();
    }
  }
  if (collision(0.75)) {
    game.score += game.hero.turbo ? 15 : 10;
    setTimeout(() => {
      positionVillain();
      draw();
    }, 100);
  }
}  

function refresh(){
  modal.style.display = "none";  
  initGame();
}
function gameOver() {
  clearInterval(game.villainInterval);
  window.removeEventListener("keydown", moveHero);
  modal.style.display = "block";
  audio.pause();
  gameOverAudio.play();

}

function crashed() {
  return game.hero.x < 0 ||
    game.hero.x + game.hero.w > game.w ||
    game.hero.y < 0 ||
    game.hero.y + game.hero.h > game.h

}

function draw() {
  const board = document.getElementById("board");
  //Tamaño
  board.style.width = game.w + "px";
  board.style.height = game.h + "px";
  //Posición
  // board.style.marginTop = (window.innerHeight - game.h) / 2 + "px";
  board.classList.add("world");
  document.getElementById("Score").innerHTML = game.score;
  document.getElementById("Lives").innerHTML = game.lives;
  drawHero();
  drawVillain();
}

function drawHero() {
  const hero = document.getElementById("hero");
  hero.style.width = game.hero.w + "px";
  hero.style.height = game.hero.h + "px";

  hero.style.left = game.hero.x + "px";
  hero.style.top = game.hero.y + "px";
  hero.classList.add("hero");
 
  if (game.hero.turbo) {
   console.log(game.hero.w)
    hero.classList.add("turbo");

  } else {
    hero.classList.remove("turbo");
  }
  ["N","E", "W", "S"].forEach(bearing => hero.classList.remove(bearing)); 
  hero.classList.add(game.hero.bearing);
}
function drawVillain() {
  const villain = document.getElementById("villain");
  villain.style.width = game.villain.w + "px";
  villain.style.height = game.villain.h + "px";

  villain.style.left = game.villain.x + "px";
  villain.style.top = game.villain.y + "px";
  villain.classList.add("villain");
}
function positionVillain() {
  console.info(new Date() + "positionVillain")
  do {
    game.villain.x = randomInRange(0, game.w - game.villain.w);
    game.villain.y = randomInRange(0, game.h - game.villain.h);
  } while (collision(3));
}
function collision(air = game.air) {
  //son cuatro condiciones x los 4 lados del cuadrado
  return (
    game.hero.x >= game.villain.x - game.hero.w * air &&
    game.hero.x <= game.villain.x + game.hero.w * air &&
    game.hero.y >= game.villain.y - game.hero.h * air &&
    game.hero.y <= game.villain.y + game.hero.h * air
  );
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
