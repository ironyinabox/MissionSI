(function () {
  window.SI = window.SI || {};

  var Obj = SI.Obj = function (game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.cooldown = 0;
    this.sprite = new Image();
  }

  Obj.prototype.draw = function (ctx) {
    ctx.drawImage(
      this.sprite,
      this.x,
      this.y,
      this.width,
      this.height
    );
  };

  Obj.prototype.isColliding = function (otherObj) {
    if (!otherObj) { return false }
    return this.x >= otherObj.x && this.x <= (otherObj.x + otherObj.width) &&
      this.y <= (otherObj.y + otherObj.height) && this.y >= otherObj.y;
  }
})();
