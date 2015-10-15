(function () {
  window.SI = window.SI || {};

  var Game = SI.Game = function () {
    var that = this;
    this.gameBounds = [800, 500];
    this.ship = new SI.Ship(this);
    this.opp = [];
    this.rockets = [];
    this.bombs = [];
    this.pressedKeys = {};


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

  Game.prototype.setup = function (gameCanvas) {
    gameCanvas.width = this.gameBounds[0];
    gameCanvas.height = this.gameBounds[1];
  }

  Game.prototype.draw = function (ctx) {
    //Draw board
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.gameBounds[0], this.gameBounds[1])
    //Draw ship
    ctx.fillStyle = '#999999';
    ctx.fillRect(this.ship.x, this.ship.y, this.ship.width, this.ship.height)
    ctx.fillStyle = '#CC3300';
    this.rockets.forEach(function (rocket) {
      ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height)
    })
  }

  Game.prototype.play = function (ctx) {
    window.setInterval((function () {
      ctx.clearRect(0, 0, this.gameBounds[0], this.gameBounds[1]);
      this.update();
      this.draw(ctx);
    }).bind(this), 10);
  }

  Game.prototype.update = function () {
    // move ship
    if (this.pressedKeys[37]) {
      this.ship.x -= 3
    }
    if (this.pressedKeys[39]) {
      this.ship.x += 3
    }
    if (this.pressedKeys[38]) {
      this.ship.y -= 3
    }
    if (this.pressedKeys[40]) {
      this.ship.y += 3
    }
    if (this.pressedKeys[32]) {
      if (!this.ship.cooldown) {
        this.ship.fire();
        this.ship.cooldown = 40;
      } else {
        this.ship.cooldown -= 1;
      }

    }

    // keep ship in bounds
    if (this.ship.x < 0) {
      this.ship.x = 0;
    }
    if (this.ship.x + this.ship.width > this.gameBounds[0]) {
      this.ship.x = this.gameBounds[0] - this.ship.width;
    }
    if (this.ship.y < 0) {
      this.ship.y = 0;
    }
    if (this.ship.y + this.ship.height > this.gameBounds[1]) {
      this.ship.y = this.gameBounds[1] - this.ship.height;
    }

    //move rockets
    for (var i = 0; i < this.rockets.length; i++) {
      var rocket = this.rockets[i];
      rocket.y -= 10;
      if (rocket.y < 0) {
         this.rockets.splice(i--, 1);
      }
    }
  }





})();
