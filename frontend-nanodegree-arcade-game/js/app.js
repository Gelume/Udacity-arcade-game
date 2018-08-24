function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Enemies our player must avoid
let Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * 75 * dt;

    if (this.x > 550) {
      this.reset();
    }

    playerX = game.player.x * 101;
    playerY = game.player.y * 83 - 25;

    // loose

    // Math.abs(this.x - playerX) < 100 && (this.x + 50 > playerX) && (this.x < (playerX + 50))
    if (this.y === playerY &&  Math.abs(this.x - playerX) < 75)  {
      game.collision();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function () {
  this.x = 0;
  this.y = getRandomInt(1, 4)  * 83 - 25;
  this.speed = getRandomInt(1, 5);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function() {
    this.sprite = 'images/char-boy.png';
    this.score = 0;

    this.handleInput = this.handleInput.bind(this);
    document.addEventListener('keyup', this.handleInput);

    this.reset();
};

Player.prototype.update = function(dt) {
  // victory
  if (this.y == 0) {
    game.win();
  }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 25);
};

Player.prototype.handleInput = function (e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  let direction = allowedKeys[e.keyCode];

  if (!direction) {
    return;
  }

  switch (direction) {
    case "right":
      if (this.x === 4) {
        break;
      }

      this.x += 1;
      break;

    case "left":
      if (this.x === 0) {
        break;
      }

      this.x -= 1;
      break;

    case "down":
      if (this.y === 5) {
        break;
      }

      this.y += 1;
      break;

    case "up":
      if (this.y === 0) {
        break;
      }

      this.y -= 1;
      break;

    default:
      break;
  }
}

Player.prototype.reset = function() {
  this.x = 2;
  this.y = 5;
}

Player.prototype.clear = function() {
  this.reset();
  document.removeEventListener('keyup', this.handleInput);
}

let Game = function() {
  let closeModal = () => $('.modal-background').addClass('hide')
  $('.modal-close').click(closeModal);

  $('.playAgain').click(() => {
    closeModal();
    this.start() ;
  });

  let lives = 3;
  this.lives = {
    decrease: () => {
      lives -= 1;
      $('.heart').not(".heart.hide").first().addClass("hide");

      if (lives == 0) {
        this.loose();
      }
    },

    reset: () => {
      lives = 3;
      $('.heart').removeClass("hide");
    }
  }
}

Game.prototype.start = function() {
  this.allEnemies = [new Enemy(), new Enemy(), new Enemy()];
  this.player = new Player();
  this.lives.reset();
  if ($('.modal-box').hasClass('lose')) {
    $('.modal-box').removeClass('lose');
  };
}

Game.prototype.end = function() {
  this.allEnemies = [];
  this.player.clear();
}

Game.prototype.restart = function() {
  this.end();
  this.start();
}

Game.prototype.win = function() {
  $('.modal-background').removeClass('hide');
  $('.gameOverMessage').text('You won');

  this.end();
}

Game.prototype.loose = function() {
  $('.modal-background').removeClass('hide');
  $('.modal-box').addClass('lose');
  $('.gameOverMessage').text('You lose');

  this.end();
}

Game.prototype.collision = function () {
  this.player.reset();
  this.lives.decrease();
}

let game = new Game();
game.start();
