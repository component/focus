
/**
 * Expose `Point`.
 */

module.exports = Point;

/**
 * Initialize a new point.
 *
 * @param {Number} x
 * @param {Number} y
 * @api public
 */

function Point(x, y) {
  this.x = x;
  this.y = y;
}

/**
 * Return a "(x, y)" string representation.
 *
 * @return {String}
 * @api public
 */

Point.prototype.toString = function(){
  return '(' + this.x + ', ' + this.y + ')';
};
