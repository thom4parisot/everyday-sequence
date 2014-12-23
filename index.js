'use strict';

var config = require('./package.json').config;

module.exports = {
  imageSize: config.imageSize,

  getImages: function(dir){
    return config.images.map(function(src){
      return dir + '/' + src;
    });
  },

  preload: function(sources, callback){
    var loadedImages = 0;
    var numImages = sources.length;

    var images = sources.map(function(src){
      var img = new Image();

      img.onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };

      img.src = src;

      return img;
    });
  },
  getDrawFn: function(height, width, imageCount){
    var segmentWidth = width / imageCount;

    return function(index){
      return [
        segmentWidth * (index), // sourceX
        0, // sourceY
        width, // sourceWidth,
        height, // sourceHeight
        segmentWidth * (index),
        0,
        width, // destWidth
        height // destHeight
      ];
    };
  },

  drawFrame: function(context, drawFn, image, index){
    var args = [image].concat(drawFn(index));

    context.drawImage.apply(context, args);
  }
};