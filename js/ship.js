(function () {
  window.SI = window.SI || {};

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

  Ship.prototype = Object.create(SI.Obj.prototype);

  Ship.prototype.fire = function (enemy) {
    if (this.cooldown == 0) {
      var proj = enemy ? new SI.Bomb(this.game, this) : new SI.Rocket(this.game, this);
      this.game.proj.push(proj)
      this.cooldown = 40;
    }
  };

  var Enemy = SI.Enemy = function (game, x, y) {
    SI.Obj.call(this, game, x, y);
    this.width = 25;
    this.height = 25;
    this.vel = [1.3, 25]
    this.sprite.src = 'sprites/invaders.png';
  };

  Enemy.prototype = Object.create(SI.Ship.prototype);
})();
