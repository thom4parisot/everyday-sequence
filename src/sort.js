'use strict';

module.exports = {
  reverse: function reverse(a, b) {
    return b - a ? 1 : ((a - b) ? -1 : 0);
  }
}
