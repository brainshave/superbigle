'use strict';

(function () {
  var container = document.getElementById('put-canvas-here');
  var menu = document.getElementById('menu');
  var chapter_name = /^chapter_(\d+)\/\d+_(.+)$/;
  var scripts = {};

  // mutable variables (reassigned on recreating canvas)
  var current_script, canvas, gl;

  window.bible = {};

  // create menu for each chapter
  _.each(_.range(16), function (i) {
    var chapter = i + 1;
    var li = document.createElement('li');
    li.setAttribute('id', 'menu-chapter-' + chapter);
    li.innerText = 'Chapter ' + chapter;
    var ul = document.createElement('ul');
    li.appendChild(ul);
    menu.appendChild(li);
  });

  bible.register = function (start, stop) {
    var src = _.last(document.querySelectorAll('script')).getAttribute('src');
    var match = chapter_name.exec(src);
    var chapter = +match[1];
    var name = match[2];

    scripts[src] = { start: start, stop: stop };

    var ul = menu.querySelector('#menu-chapter-' + chapter + ' > ul');
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.setAttribute('href', '#' + src);
    a.innerText = name;
    li.appendChild(a);
    ul.appendChild(li);
  };

  var recreate_canvas = function () {
    if (current_script && current_script.stop) {
      current_script.stop();
    }
    if (canvas) {
      canvas.parentNode.removeChild(canvas);
    }

    current_script = scripts[location.hash.substring(1)];

    if (current_script) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', window.innerWidth);
      canvas.setAttribute('height', window.innerHeight);
      canvas.setAttribute('id', 'canvas');
      container.appendChild(canvas);

      gl = canvas.getContext('experimental-webgl');

      current_script.start(gl);
    }
  };

  window.onresize = recreate_canvas;
  window.onload = recreate_canvas;
  window.onhashchange = recreate_canvas;
})();
