'use strict';

define([
  'underscore',
  'utils',
], function (_, utils) {
  return function (canvas_container) {
    var exports = {};

    var current_program, animation, canvas, gl;

    var requestAnimationFrame = utils.get_prefixed_method(window, 'requestAnimationFrame');
    var cancelAnimationFrame = utils.get_prefixed_method(window, 'cancelAnimationFrame');

    var animate = function () {
      current_program.paint(gl);
      animation = requestAnimationFrame(animate);
    }

    exports.start = function (program) {
      if (current_program | animation | canvas | gl) {
        throw new Error("There's a program running: " + current_program.name);
      }

      if (typeof program.start !== 'function') {
        throw new Error("Program doesn't have a start method");
      }

      current_program = program;

      canvas = document.createElement('canvas');
      canvas.setAttribute('width', window.innerWidth);
      canvas.setAttribute('height', window.innerHeight);
      canvas.setAttribute('id', 'canvas');
      canvas_container.appendChild(canvas);

      gl = canvas.getContext('experimental-webgl');

      current_program.start(gl);

      if (typeof current_program.paint === 'function') {
        animation = requestAnimationFrame(animate);
      }
    };

    exports.stop = function () {
      if (typeof animation !== 'undefined') {
        cancelAnimationFrame(animation);
        animation = undefined;
      }

      if (current_program && typeof current_program.stop === 'function') {
        current_program.stop();
      }

      if (canvas) {
        canvas_container.removeChild(canvas);
      }

      gl = undefined;
      current_program = undefined;
    };

    exports.handle_key = function (event) {
      var handler = current_program && current_program.keys &&
                    current_program.keys[event.keyCode];
      if (typeof handler === 'function') {
        event.preventDefault();
        handler(gl, event);
      }
    };

    return exports;
  };
});
