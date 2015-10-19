(function () {
  window.SI = window.SI || {};

  var Rocket = SI.Rocket = function (game, ship) {
    SI.Obj.call(this, game)
    this.x = ship.x + Math.floor(ship.width/2) + 1;
    this.y = ship.y;
    this.width = 5;
    this.height = 10;
    this.vel = [0, -7];

    this.sprite.src = 'sprites/rocket.png';
    this.bang = false;
  }

  Rocket.prototype = Object.create(SI.Obj.prototype);

  var Bomb = SI.Bomb = function (game, ship) {
    SI.Rocket.call(this, game, ship);
    this.vel = [0, 3];
    this.sprite.src = 'sprites/bomb.png';
    this.y = ship.y + ship.height;
  }

  Bomb.prototype = Object.create(SI.Rocket.prototype);
})();
