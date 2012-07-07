'use strict';

require([
  'underscore',
  'domReady!',
  'index',
  'menu',
], function(_, document, index, menu) {
  menu.put(document.getElementById('menu'), index.names);
  //_.each(index.names,
});
