'use strict';

var h = require('hyperscript');

var collections = require('./package.json').collections;

var sequenceRenderer = require('./src/renderers/sequence');
var sequenceFadedRenderer = require('./src/renderers/sequence-faded');

window.addEventListener('load', function() {
  renderCollectionActions(document.querySelector('.collections-list'), collections, {
    'sequence': sequenceRenderer,
    'sequence-faded': sequenceFadedRenderer
  });
});

function renderCollectionActions(container, collections, renderers){
  var collectionKeys = Object.keys(collections);
  var optionsEl = document.querySelector('.options');

  Object.keys(renderers).forEach(function(rendererKey) {
    var renderer = renderers[rendererKey];

    var el = container.insertBefore(h('dt.renderer', rendererKey), optionsEl);

    Object.keys(collections).forEach(function(collectionId){
      var onClick = renderer.bind(null, collections[collectionId], 'tmp/' + collectionId);

      container.insertBefore(h(
        'dd.collection',
        h('button', { 'onclick': onClick }, collectionId))
      , el.nextSibling);
    });
  });
}
