
/**
 * Module dependencies.
 */

var convolve = require('convolve')
  , Segment = require('./segment')
  , edges = require('./edges');

/**
 * Expose `focus()`.
 */

module.exports = focus;

/**
 * Approximate the focal point of `canvas`.
 *
 * Options:
 *
 *  - `debug` [false]
 *
 * @param {Canvas} canvas
 * @param {Object} options
 * @return {Point}
 * @api public
 */

function focus(canvas, options){
  options = options || {};
  var debug = options.debug;

  // setup
  var w = canvas.width;
  var h = canvas.height;
  var ctx = canvas.getContext('2d');
  var data = ctx.getImageData(0, 0, w, h);
  var res = ctx.createImageData(w, h);

  // edge detection
  convolve(edges)
    .width(w)
    .height(h)
    .apply(data, res);

  // edge debugging
  if (debug) {
    canvas.width *= 2;
    ctx.putImageData(res, 0, 0);
  }

  // single-pass
  var segs = segments(res.data, w, h);

  // segment debugging
  if (debug) {
    debugSegments(segs, ctx);
    ctx.translate(w, 0);
    ctx.putImageData(data, w, 0);
    debugSegments(segs, ctx);
  }


  return focalSegment(segs).midpoint();
}

/**
 * Draw debug segments.
 *
 * @param {Array} segs
 * @param {CanvasContext2d} ctx
 * @api private
 */

function debugSegments(segs, ctx) {
  for (var i = 0; i < segs.length; ++i) segs[i].draw(ctx);
  focalSegment(segs).drawFocus(ctx);
}

/**
 * Return the most "intense" segment.
 *
 * TODO: we should check the neighbour segments
 * and walk them within a given intensity factor,
 * and return a mid-point of that.
 *
 * @param {Array} sefgs
 * @return {Segment}
 * @api private
 */

function focalSegment(segs) {
  var seg;
  var ret = segs[0];
  for (var i = 1; i < segs.length; ++i) {
    seg = segs[i];
    if (seg.intensity > ret.intensity) ret = seg;
  }
  return ret;
}

/**
 * Return segments for `data`.
 *
 * This algorithm walks every edge
 * and averages the intensity in 20x20
 * pixel "segments".
 *
 * TODO: we could easily speed things up
 * by skipping N pixels etc...
 *
 * @param {ImageData} data
 * @param {Number} w
 * @param {Number} h
 * @return {Array}
 * @api private
 */

function segments(data, w, h){
  var segs = [];
  var size = 20;
  var hx = w / 2;
  var hy = h / 2;

  function factor(x, y) {
    x = Math.abs(x - hx) / hx;
    y = Math.abs(y - hy) / hy;
    x /= 2;
    y /= 2;
    return 1 - (x + y);
  }

  for (var x = 0; x < w; ++x) {
    for (var y = 0; y < h; ++y) {
      var focus = factor(x + size / 2, y + size / 2) * .15;
      var width = Math.min(w - x, size);
      var height = Math.min(h - y, size);
      var pixels = size * size;
      var sum = 0;

      for (var sx = 0; sx < width; ++sx) {
        for (var sy = 0; sy < height; ++sy) {
          var px = ((y + sy) * w + (x + sx)) * 4;
          var r = data[px + 0];
          var g = data[px + 1];
          var b = data[px + 2];
          var n = r + g + b;
          var intensity = n / 765;
          sum += intensity;
        }
      }

      focus += (sum / pixels) * .85;
      segs.push(new Segment(x, y, width, height, focus * 5));
      y += size;
    }
    x += size;
  }

  return segs;
};