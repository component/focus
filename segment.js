
/**
 * Module dependencies.
 */

var Point = require('./point');

/**
 * Expose `Segment`.
 */

module.exports = Segment

/**
 * Initialize a new `Segment` with the given dimension and intensity.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} intensity
 * @api private
 */

function Segment(x, y, w, h, intensity) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.intensity = intensity || 0;
}

/**
 * Return the mid-point.
 *
 * @return {Point}
 * @api public
 */

Segment.prototype.midpoint = function(){
  return new Point(
    this.x + this.w / 2,
    this.y + this.h / 2);
};

/**
 * Draw the segment.
 *
 * @param {CanvasContext2d} ctx
 * @api public
 */

Segment.prototype.draw = function(ctx){
  var n = 255 * this.intensity | 0;
  var rad = this.w / 2 * this.intensity;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = 'rgba(' + n + ',0,0, .5)';
  ctx.arc(this.x + this.w / 2, this.y + this.h / 2, rad, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.restore();
};

/**
 * Draw the focused segment.
 *
 * @param {CanvasContext2d} ctx
 * @api public
 */

Segment.prototype.drawFocus = function(ctx){
  var n = 255 * this.intensity | 0;
  var rad = this.w / 2 * this.intensity;
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = 'rgba(0,0,' + n + ', .5)';
  ctx.arc(this.x + this.w / 2, this.y + this.h / 2, rad, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.restore();
};