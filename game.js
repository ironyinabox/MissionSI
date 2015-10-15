(function () {
  window.SI = window.SI || {};

  var Game = SI.Game = function () {
    var that = this;
    this.gameBounds = [800, 500];
    this.ship = new SI.Ship(this);
    this.opps = [];
    this.rockets = [];
    this.bombs = [];
    this.pressedKeys = {};
    this.attackFrequency = 0.9;


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
    for (var i = 1; i < 10; i++) {
      this.opps.push(new SI.Ship(this, this.gameBounds[0] * (i/10.0), this.gameBounds[1]/3))
    }
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

    //Draw Rockets
    ctx.fillStyle = '#CC3300';
    this.rockets.forEach(function (rocket) {
      ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height)
    })

    //Draw Opps
    ctx.fillStyle = '#CC00CC';
    this.opps.forEach(function (opp) {
      ctx.fillRect(opp.x, opp.y, opp.width, opp.height)
    })

    //Draw Bombs
    ctx.fillStyle = '#CC3300';
    this.bombs.forEach(function (bomb) {
      ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height)
    })
  }

  Game.prototype.play = function (ctx) {
    this.startGame();
    window.setInterval((function () {
      ctx.clearRect(0, 0, this.gameBounds[0], this.gameBounds[1]);
      this.update();
      this.draw(ctx);
    }).bind(this), 1000/50);
  }

  Game.prototype.update = function () {

    // move ship
    if (this.pressedKeys[37]) {
      this.ship.x -= 3
    }
    if (this.pressedKeys[39]) {
      this.ship.x += 3
    }
    // if (this.pressedKeys[38]) {
    //   this.ship.y -= 3
    // }
    // if (this.pressedKeys[40]) {
    //   this.ship.y += 3
    // }
    if (this.pressedKeys[32]) {
      if (this.ship.cooldown == 0) {
        this.ship.fire();
        this.ship.cooldown = 40;
      }
    }

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
    // if (this.ship.y < 0) {
    //   this.ship.y = 0;
    // }
    // if (this.ship.y + this.ship.height > this.gameBounds[1]) {
    //   this.ship.y = this.gameBounds[1] - this.ship.height;
    // }

    //move rockets
    for (var i = 0; i < this.rockets.length; i++) {
      var rocket = this.rockets[i];
      rocket.y -= 7;
      if (rocket.y < 0) {
         this.rockets.splice(i--, 1);
      }
    }

    //move bombs
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      bomb.y += 3;
      if (bomb.y > this.gameBounds[1]) {
         this.bombs.splice(i--, 1);
      }
    }

    //check for dead opps
    for (var i = 0; i < this.opps.length; i++) {
      var opp = this.opps[i];
      for (var j=0; j<this.rockets.length; j++) {
        var rocket = this.rockets[j];

        if(rocket.x >= opp.x && rocket.x <= (opp.x + opp.width) &&
            rocket.y <= (opp.y + opp.height) && rocket.y >= opp.y) {

            this.rockets.splice(j--, 1);
            this.opps.splice(i--, 1);
            break;
        }
      }
    }

    //let opps fight back

    for (var i = 0; i < this.opps.length; i++) {
      var chance = Math.random();
      if (this.attackFrequency > chance) {
        this.opps[i].fire(true);
      }
      this.opps[i].cooldown -= 1;
    }
  }





})();
