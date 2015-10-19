(function () {
  window.SI = window.SI || {};

  var Game = SI.Game = function (ctx) {
    this.ctx = ctx;
    this.pressedKeys = {};
    this.gameBounds = [800, 500];
    this.ship = new SI.Ship(this);
    this.enemies = [];
    this.proj = [];
    this.attackFrequency = .015;
    this.dir = 1.3;
    this.descend = false;


    window.addEventListener("keydown", function (e) {
     if(e.keycode > 36 || e.keycode < 41 || e.keycode == 32) {
         e.preventDefault();
     }
      this.pressedKeys[e.keyCode] = true;
    }.bind(this));

    window.addEventListener("keyup", function (e) {
     if(e.keycode > 36 || e.keycode < 41 || e.keycode == 32) {
         e.preventDefault();
     }
      this.pressedKeys[e.keyCode] = false;
    }.bind(this));
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
      .concat(this.proj)
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
    // update ship
    this.ship.update();

    //check for descend
    for (var i = 0; i < this.enemies.length; i++) {
      var enemy = this.enemies[i];
      if (enemy.x + this.dir + enemy.width > this.gameBounds[0] || enemy.x + this.dir < 0) {
        this.descend = true;
      }
    };

    //turn them the other direction if they've hit the wall.
    if (this.descend) {
      this.dir = -1 * enemy.vel[0];
    }

    //update enemies
    this.enemies.forEach(function (enemy) {
      enemy.update();
    })

    //reset when descend is complete
    this.descend = false;

    //update projs
    this.proj.forEach(function (proj, idx) {
      proj.x += proj.vel[0];
      proj.y += proj.vel[1];

      //remove when out of bounds
      if (proj.y > this.gameBounds[1] || proj.y < 0) {
        this.proj[idx] = null;
      }
      //check for damaged shields
      if (proj.isColliding(this.ship)) {
        if (!proj.bang) {
          proj.bang = true;
          this.ship.shields--;
        }
        this.proj[idx] = null;
      }
      //check for dead enemies
      this.enemies.forEach(function (enemy, idy) {
        //don't allow enemy friendly fire
        if (proj.isColliding(enemy) && proj instanceof SI.Rocket) {
          this.proj[idx] = null;
          this.enemies[idy] = null;
        }
      }.bind(this))
    }.bind(this))

    //clear destroyed projs & enemies
    this.proj = this.proj.filter(function (proj) {
      return !!proj;
    })
    this.enemies = this.enemies.filter(function (enemy) {
      return !!enemy;
    })

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

    // let frontLine fight back
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
