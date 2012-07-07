'use strict';

define(function () {
  var exports = {};

  exports.compile_shader = function (gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      throw new Error('Shader compile error:\n' +
                      gl.getShaderInfoLog(shader));
    }
  };

  exports.link_program = function (gl, vs, fs) {
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    } else {
      throw new Error('Program link error:\n' +
                      gl.getProgramInfoLog(program));
    }
  };

  var whitespace_both_sides = /^\s+|\s+$/mg;

  exports.trim_string = function (str) {
    return String.prototype.replace.call(
      str, whitespace_both_sides, '');
  };

  var nth_element_is = function (n, name, array) {
    return name === array[n];
  };

  var get_location = function (gl, fn, program, array) {
    var name = array[2];
    program[name] = fn.call(gl, program, name);
  };

  exports.set_attrib_positions = function (gl, program, src) {
    var statements = _.map(
      exports.trim_string(src).split(/;|\n/), function (statement) {
        return statement.split(/\s+/);
      });

    var uniforms = _.filter(
      statements, _.bind(nth_element_is, null, 0, 'uniform'));

    var attrs = _.filter(
      statements, _.bind(nth_element_is, null, 0, 'attribute'));

    _.each(uniforms, _.bind(get_location, null, gl, gl.getUniformLocation, program));
    _.each(attrs, _.bind(get_location, null, gl, gl.getAttribLocation, program));
  };

  exports.create_program = function (gl, vs_src, fs_src) {
    var vs = exports.compile_shader(gl, vs_src, gl.VERTEX_SHADER);
    var fs = exports.compile_shader(gl, fs_src, gl.FRAGMENT_SHADER);

    var program = exports.link_program(gl, vs, fs);

    exports.set_attrib_positions(gl, program, vs_src + '\n' + fs_src);

    return program;
  };

  return exports;
});
