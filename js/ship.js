(function () {
  window.SI = window.SI || {};

  var ShipBase = SI.ShipBase = function () {}
  ShipBase.prototype = Object.create(SI.Obj.prototype);

  ShipBase.prototype.fire = function (enemy) {
    if (this.cooldown == 0) {
      var proj = enemy ? new SI.Bomb(this.game, this) : new SI.Rocket(this.game, this);
      this.game.proj.push(proj)
      this.cooldown = 40;
    }
  };

  var Ship = SI.Ship = function (game, x, y) {
    SI.Obj.call(this, game)
    this.x = game.gameBounds[0]/2;
    this.y = game.gameBounds[1]/1.1;
    this.width = 25;
    this.height = 25;
    this.vel = 3;
    this.shields = 10;
    this.sprite.src = 'sprites/ship.png';
  };

  Ship.prototype = Object.create(SI.ShipBase.prototype);

  Ship.prototype.update = function () {
    if (this.game.pressedKeys[37]) {
      this.x -= this.vel;
    }
    if (this.game.pressedKeys[39]) {
      this.x += this.vel;
    }
    if (this.game.pressedKeys[32]) {
      if (this.cooldown == 0) {
        this.fire();
      }
    }
    //recharge the guns
    if (this.cooldown > 0) {
      this.cooldown -= 1;
    }
    // keep ship in bounds
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > this.game.gameBounds[0]) {
      this.x = this.game.gameBounds[0] - this.width;
    }
  }

  var Enemy = SI.Enemy = function (game, x, y) {
    SI.Obj.call(this, game, x, y);
    this.width = 25;
    this.height = 25;
    this.vel = [1.3, 25]
    this.sprite.src = 'sprites/invaders.png';
  };

  Enemy.prototype = Object.create(SI.Ship.prototype);

  Enemy.prototype.update = function () {
    this.x += this.game.dir;
    if (this.game.descend) {
      this.y += this.vel[1];
    }
    if (this.y > this.game.gameBounds[1]) {
      this.game.ship.shields = 0;
    }
  }
})();
