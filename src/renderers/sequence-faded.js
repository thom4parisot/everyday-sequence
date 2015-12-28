'use strict';

var each = require('each-series');
var paper = require('paper');
var reverse = require('alpha-sort').desc;
var Loader = require('../loader');

var Raster = paper.Raster;
var Size = paper.Size;
var Path = paper.Path;
var Group = paper.Group;

module.exports = function(collection, collectionPath, event) {
  var count = collection.images.length;
  var scale = 3;
  var imageWidth = parseFloat(document.querySelector('input[name="width"]').value) || 600;

  var canvas = document.querySelector('canvas');
  canvas.height = imageWidth;
  canvas.width = imageWidth;
  canvas.style.height = 'auto';
  canvas.style.width = 'auto';


  paper.setup(document.querySelector('canvas'));
  paper.project.clear();
  console.log(imageWidth, canvas.height);

  each(collection.images.sort(reverse), function(imagePath, i, next) {
    var raster = new Raster(collectionPath + '/' + imagePath, paper.view.center);

    raster.onLoad = function(){
      Loader.update(i / count * 100);

      // raster.blendMode = 'overlay';
      raster.opacity = 1 - (i / count);

      raster.size = new Size(imageWidth, imageWidth);
      raster.fitBounds(paper.view.bounds);

      var rectangle = new Path.Rectangle(
        raster.bounds.topLeft.x,
        raster.bounds.topLeft.y,
        raster.size.width * (1 - (i / count)),
        raster.size.height
      );
      rectangle.fillColor = 'black';

      new Group([rectangle, raster]).clipped = true;

      next();
    };
  });
};
