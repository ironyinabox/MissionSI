(function () {
  window.SI = window.SI || {};
  var Ship = SI.Ship = function (game) {
    this.width = 50;
    this.height = 25;
    this.x = game.gameBounds[0]/2;
    this.y = game.gameBounds[1]/2;
    this.game = game;
    this.cooldown = false;
  };

  Ship.prototype.fire = function () {
    this.game.rockets.push(new Rocket(this.game, this))
  }

  var Rocket = SI.Rocket = function (game, ship) {
    this.width = 5;
    this.height = 10;
    this.x = ship.x + Math.floor(ship.width/2) + 1;
    this.y = ship.y;
  }




})();
