'use strict';

(function () {
  var container = document.getElementById('put-canvas-here');
  var menu = document.getElementById('menu');
  var chapter_name = /^chapter_(\d+)\/\d+_(.+)$/;
  var scripts = {};

  // mutable variables (reassigned on recreating canvas)
  var current_script, animation, canvas, gl;

  var browser_prefixes = [ 'webkit', 'moz', 'ms', 'o' ];
  var get_prefixed_fn = function (object, name) {
    var fn = object[name];
    if (typeof fn === 'function') {
      return fn;
    }

    name = name[0].toUpperCase() + name.substr(1);
    for (var i = 0; i < browser_prefixes.length; ++i) {
      fn = object[browser_prefixes[i] + name];
      if (typeof fn === 'function') {
        return fn;
      }
    }
  };

  var requestAnimationFrame = get_prefixed_fn(window, 'requestAnimationFrame');
  var cancelAnimationFrame = get_prefixed_fn(window, 'cancelAnimationFrame');
  var cancelRequestAnimationFrame = get_prefixed_fn(window, 'cancelRequestAnimationFrame');

  window.bible = {};

  // create menu for each chapter
  _.each(_.range(16), function (i) {
    var chapter = i + 1;
    var li = document.createElement('li');
    li.setAttribute('id', 'menu-chapter-' + chapter);
    li.innerHTML = 'Chapter ' + chapter;
    var ul = document.createElement('ul');
    li.appendChild(ul);
    menu.appendChild(li);
  });

  bible.register = function (start, stop, paint, keys) {
    var src = _.last(document.querySelectorAll('script')).getAttribute('src');
    var match = chapter_name.exec(src);
    var chapter = +match[1];
    var name = match[2];

    scripts[src] = { start: start, stop: stop, keys: keys, paint: paint };

    var ul = menu.querySelector('#menu-chapter-' + chapter + ' > ul');
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.setAttribute('href', '#' + src);
    a.innerHTML = name;
    li.appendChild(a);
    ul.appendChild(li);
  };

  var animate = function () {
    current_script.paint(gl);
    animation = requestAnimationFrame(animate);
  };

  var recreate_canvas = function () {
    if (current_script) {
      cancelAnimationFrame(animation);
      animation = false;
      if (current_script.stop) {
        current_script.stop();
      }
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

      if (typeof current_script.paint === 'function') {
        animation = requestAnimationFrame(animate);
      }
    }
  };

  window.onkeydown = function (event) {
    var handler = current_script.keys && current_script.keys[event.keyCode];
    if (typeof handler === 'function') {
      event.preventDefault();
      handler(event);
    }
  };

  window.onresize = recreate_canvas;
  window.onload = recreate_canvas;
  window.onhashchange = recreate_canvas;
})();
