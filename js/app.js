'use strict';

require([
  'underscore',
  'domReady!',
  'bigle/index',
  'bigle/menu',
  'bigle/programs',
], function(_, document, index, menu, programs) {
  menu(document.getElementById('menu'), index.names);

  var program_manager = programs(document.getElementById('put-canvas-here'));

  var restart = function () {
    program_manager.stop();

    var program = index[location.hash.substring(1)];
    if (program) {
      program_manager.start(program);
    }
  };

  window.onresize = restart;
  window.onhashchange = restart;

  window.onkeydown = program_manager.handle_key;

  _.defer(restart);
});
