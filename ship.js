(function () {
  window.SI = window.SI || {};
  var Ship = SI.Ship = function (game, x, y) {
    this.width = 25;
    this.height = 25;
    this.x = x || game.gameBounds[0]/2;
    this.y = y || game.gameBounds[1]/1.1;
    this.game = game;
    this.cooldown = 0;
    this.playerSprite = new Image();
    this.playerSprite.src = 'sprites/rsH6n.png';
    this.oppSprite = new Image();
    this.oppSprite.src = 'sprites/invaders.png'
  };

  Ship.prototype.fire = function (opp) {
    if (this.cooldown == 0) {
      if (!opp) {
        this.game.rockets.push(new Rocket(this.game, this))
        this.cooldown = 40;
      } else {
        this.game.bombs.push(new Bomb(this.game, this))
        this.cooldown = 40;
      }
    }
  }

  Ship.prototype.draw = function (ctx, opp) {
    var sprite = (opp ? this.oppSprite : this.playerSprite);

    ctx.drawImage(
      sprite,
      this.x,
      this.y,
      this.width,
      this.height
    )

  }

  var Rocket = SI.Rocket = function (game, ship) {
    this.width = 5;
    this.height = 10;
    this.x = ship.x + Math.floor(ship.width/2) + 1;
    this.y = ship.y;
  }

  var Bomb = SI.Bomb = function (game, ship) {
    this.bang = false;
    this.width = 5;
    this.height = 10;
    this.x = ship.x + Math.floor(ship.width/2) + 1;
    this.y = ship.y + ship.height;
  }
})();
