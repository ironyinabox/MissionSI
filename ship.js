(function () {
  window.SI = window.SI || {};
  var Ship = SI.Ship = function (game, x, y) {
    this.width = 50;
    this.height = 25;
    this.x = x || game.gameBounds[0]/2;
    this.y = y || game.gameBounds[1]/1.3;
    this.game = game;
    this.cooldown = 0;
  };



  Ship.prototype.fire = function (opp) {
    if (this.cooldown == 0) {
      if (!opp) {
        this.game.rockets.push(new Rocket(this.game, this))
      } else {
        this.game.bombs.push(new Bomb(this.game, this))
      }
      this.cooldown = 40;
    }
  }

  var Rocket = SI.Rocket = function (game, ship) {
    this.width = 5;
    this.height = 10;
    this.x = ship.x + Math.floor(ship.width/2) + 1;
    this.y = ship.y;
  }

  var Bomb = SI.Bomb = function (game, ship) {
    this.width = 5;
    this.height = 10;
    this.x = ship.x + Math.floor(ship.width/2) + 1;
    this.y = ship.y + ship.height;
  }




})();
