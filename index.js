'use strict';

module.exports = {
  collections: require('./package.json').collections,

  getImages: function(dir, imageSrc){
    return dir + '/' + imageSrc;
  },

  preload: function(collection, options){
    var loadedImages = 0;
    var numImages = collection.images.length;

    var images = collection.images
      .map(options.srcMapper)
      .map(function(src){
        var img = new Image();

        img.onload = function() {
          if(++loadedImages >= numImages) {
            options.onPreload(images);
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