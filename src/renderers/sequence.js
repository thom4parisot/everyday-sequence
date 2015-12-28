'use strict';

var each = require('each-series');
var ascending = require('alpha-sort').asc;
var Loader = require('../loader');

module.exports = function(collection, collectionPath) {
  var numImages = collection.images.length;
  var images = collection.images.map(resolvePath(collectionPath)).sort(ascending);

  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');

  resolveCanvasDimensions(canvas, images)
    .then(function(drawFn) {
      each(images, function(imageSrc, i, next) {
        var img = new Image();

        Loader.update(i / numImages * 100);
        img.onerror = next.bind(null);

        img.onload = function() {
          drawFrame(context, drawFn, this, i);
          next();
        };

        img.src = imageSrc;
      });
    });
};

function resolveCanvasDimensions(canvas, images){
  return new Promise(function(resolve, reject){
    var img = new Image();

    img.onerror = reject.bind(this);

    img.onload = function(){
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      canvas.style.height = 'auto';
      canvas.style.width = 'auto';

      resolve(getDrawFn(canvas.height, canvas.width, images.length));
    };

    img.src = images[0];
  });
}

function getDrawFn(height, width, imageCount){
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
}

function drawFrame(context, drawFn, image, index){
  var args = [image].concat(drawFn(index));

  context.drawImage.apply(context, args);
}

function resolvePath(path) {
  return function mapFn(imageSrc) {
    return path + '/' + imageSrc;
  }
};
