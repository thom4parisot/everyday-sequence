'use strict';

var loaderEl = document.querySelector('.loader');

module.exports = (function(el){
  return {
    update: function(percent) {
      el.querySelector('.loader-percentage').style.width = percent + '%';
    }
  };
})(loaderEl);
