(function () {
  window.SI = window.SI || {};

  var Game = SI.Game = function (ctx) {
    var that = this;
    this.gameBounds = [800, 500];
    this.ship = new SI.Ship(this);
    this.enemies = [];
    this.dir = 1.3;
    this.descend = false;
    this.rockets = [];
    this.bombs = [];
    this.pressedKeys = {};
    this.attackFrequency = .015;
    this.ctx = ctx;


    window.addEventListener("keydown", function (e) {
     if(e.keycode > 36 || e.keycode < 41 || e.keycode == 32) {
         e.preventDefault();
     }
      that.pressedKeys[e.keyCode] = true;
    });

    window.addEventListener("keyup", function (e) {
     if(e.keycode > 36 || e.keycode < 41 || e.keycode == 32) {
         e.preventDefault();
     }
      that.pressedKeys[e.keyCode] = false;
    });
  }

  Game.prototype.startGame = function () {
    for (var j = 1; j < 6; j++) {
      var rank = (j * 30) - 20

      for (var i = 0; i <= 10; i++) {
        var file = this.gameBounds[0]/4 + (i * 30)
        this.enemies.push(new SI.Enemy(
          this,
          file,
          rank
        ))
      }
    }
  }

  Game.prototype.setup = function (gameCanvas) {
    gameCanvas.width = this.gameBounds[0];
    gameCanvas.height = this.gameBounds[1];
  }

  Game.prototype.draw = function () {
    //Draw board
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.gameBounds[0], this.gameBounds[1])

    //Draw ship
    this.ship.draw(this.ctx);

    //Draw other objects
    this.enemies
      .concat(this.rockets)
      .concat(this.bombs)
      .forEach(function (obj) {
        obj.draw(this.ctx);
      })

    //Draw HUD
    this.ctx.font="20px Roboto";
    this.ctx.fillStyle = '#ffffff';
    var text = "    Shields: " + this.ship.shields;
    this.ctx.fillText(text, 0, 480);

    //check for gameover
    if (this.ship.shields < 1 || this.enemies.length < 1) {
      this.ctx.clearRect(0, 0, this.gameBounds[0], this.gameBounds[1]);
      this.ctx.font="50px Roboto";
      this.ctx.fillStyle = '#000000';
      var text = (this.ship.shields < 1 ? "GAME OVER" : "YOU WIN")
      this.ctx.fillText(text, 200, 300);
      clearInterval(this.intervalId);
    }
  }

  Game.prototype.play = function () {
    this.startGame();
    this.intervalId = window.setInterval((function () {
      this,ctx.clearRect(0, 0, this.gameBounds[0], this.gameBounds[1]);
      this.update();
      this.draw(ctx);
    }).bind(this), 1000/50);
  }

  Game.prototype.update = function () {
    // move ship
    if (this.pressedKeys[37]) {
      this.ship.x -= this.ship.vel;
    }
    if (this.pressedKeys[39]) {
      this.ship.x += this.ship.vel;
    }

    //fire zee missiles
    if (this.pressedKeys[32]) {
      if (this.ship.cooldown == 0) {
        this.ship.fire();
      }
    }

    //recharge the guns
    if (this.ship.cooldown > 0) {
        this.ship.cooldown -= 1;
    }
    // keep ship in bounds
    if (this.ship.x < 0) {
      this.ship.x = 0;
    }
    if (this.ship.x + this.ship.width > this.gameBounds[0]) {
      this.ship.x = this.gameBounds[0] - this.ship.width;
    }

    //move rockets
    for (var i = 0; i < this.rockets.length; i++) {
      var rocket = this.rockets[i];
      rocket.y += rocket.vel[1];
      if (rocket.y < 0) {
         this.rockets.splice(i--, 1);
      }
    }

    //move bombs
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      bomb.y += bomb.vel[1];
      if (bomb.y > this.gameBounds[1]) {
         this.bombs.splice(i--, 1);
      }
    }

    // this.bombs
    //   .concat(this.rockets)
    //   .forEach(function (proj, idx) {
    //     proj.x + proj.vel[0];
    //     proj.y + proj.vel[1];
    //   })

    //check for descend
    for (var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      if ((enemy.x + this.dir + enemy.width) > this.gameBounds[0] || enemy.x + this.dir < 0) {
        this.dir = -1 * this.dir;
        this.descend = true;
      }
      if (enemy.y > this.gameBounds[1]) {
        this.ship.shields = 0;
      }
    };

    //move enemies
    for (var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      enemy.x += this.dir;
      if (this.descend) {
        enemy.y += enemy.vel[1];
      }
    }
    this.descend = false;

    //check for damaged shields
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      if(bomb.x >= this.ship.x && bomb.x <= (this.ship.x + this.ship.width) &&
          bomb.y <= (this.ship.y + this.ship.height) && bomb.y >= this.ship.y) {
          if (!bomb.bang) {
            bomb.bang = true;
            this.ship.shields--;
            break;
          }
          this.bombs.splice(j--, 1);
      }
    }

    //check for dead enemies
    for (var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      for (var j=0; j<this.rockets.length; j++) {
        var rocket = this.rockets[j];

        if(rocket.x >= enemy.x && rocket.x <= (enemy.x + enemy.width) &&
            rocket.y <= (enemy.y + enemy.height) && rocket.y >= enemy.y) {

            this.rockets.splice(j--, 1);
            this.enemies.splice(i--, 1);
            break;
        }
      }
    }

    //group up the front line
    var frontLine = {};
    for (var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      frontLine[enemy.x] = frontLine[enemy.x] || enemy;
      var current = frontLine[enemy.x];
      if (enemy.y > current.y) {
        frontLine[enemy.x] = enemy
      }
    }

    // let enemies fight back
    Object.keys(frontLine).forEach(function (key) {
      var enemy = frontLine[key]
      if (enemy) {
        if (this.attackFrequency > Math.random()) {
          enemy.fire(true);
        }
        if (enemy.cooldown > 0) {
          enemy.cooldown -= 1;
        }
      }
    }.bind(this))



  }





})();
