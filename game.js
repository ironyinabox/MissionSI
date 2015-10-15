(function () {
  window.SI = window.SI || {};

  var Game = SI.Game = function (ctx) {
    var that = this;
    this.gameBounds = [800, 500];
    this.ship = new SI.Ship(this);
    this.opps = [];
    this.dir = 1;
    this.descend = false;
    this.rockets = [];
    this.bombs = [];
    this.pressedKeys = {};
    this.attackFrequency = 0.001;
    this.shields = 10;
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
        this.opps.push(new SI.Ship(
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
    this.ctx.fillStyle = '#999999';
    this.ctx.fillRect(this.ship.x, this.ship.y, this.ship.width, this.ship.height)

    //Draw Rockets
    this.ctx.fillStyle = '#CC3300';
    this.rockets.forEach(function (rocket) {
      this.ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height)
    })

    //Draw Opps
    this.ctx.fillStyle = '#CC00CC';
    this.opps.forEach(function (opp) {
      this.ctx.fillRect(opp.x, opp.y, opp.width, opp.height)
    })

    //Draw Bombs
    this.ctx.fillStyle = '#CC3300';
    this.bombs.forEach(function (bomb) {
      this.ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height)
    })

    //Draw HUD
    this.ctx.font="20px Roboto";
    this.ctx.fillStyle = '#ffffff';
    var text = "    Shields: " + this.shields;
    this.ctx.fillText(text, 0, 480);

    //check for gameover
    if (this.shields < 1) {
      this.ctx.clearRect(0, 0, this.gameBounds[0], this.gameBounds[1]);
      this.ctx.font="50px Roboto";
      this.ctx.fillStyle = '#000000';
      var text = " GAME OVER ";
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
      this.ship.x -= 3
    }
    if (this.pressedKeys[39]) {
      this.ship.x += 3
    }

    //fire zee missiles
    if (this.pressedKeys[32]) {
      if (this.ship.cooldown == 0) {
        this.ship.fire();
        this.ship.cooldown = 40;
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

    //check for descend
    for (var i = 0; i < this.opps.length; i++) {
      var opp = this.opps[i];
      if ((opp.x + this.dir + opp.width) > this.gameBounds[0]) {
        this.dir = -1;
        this.descend = true;
      }
      if (opp.x + this.dir < 0) {
        this.dir = 1;
        this.descend = true;
      }
      if (opp.y > this.gameBounds[1]) {
        this.shields = 0;
      }
    };

    //move opps
    for (var i = 0; i < this.opps.length; i++) {
      var opp = this.opps[i];
      opp.x += this.dir;
      if (this.descend) {
        opp.y += 25;

      }
    }
    this.descend = false;

    //check for damaged shields
    for (var i = 0; i < this.bombs.length; i++) {
      var bomb = this.bombs[i];
      if(bomb.x >= this.ship.x && bomb.x <= (this.ship.x + this.ship.width) &&
          bomb.y <= (this.ship.y + this.ship.height) && bomb.y >= this.ship.y) {

          this.bombs.splice(j--, 1);
          this.shields -= 1;
          break;
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
      if (this.opps[i].cooldown > 0) {
        this.opps[i].cooldown -= 1;
      }
    }
  }





})();
