/// <reference path="Utils.ts"/>

declare var _;

module Shaders {
  export function compile_shader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      throw new Error('Shader compile error:\n' +
                      gl.getShaderInfoLog(shader));
    }
  }

  export function link_program(gl, vs, fs) {
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
  }

  function nth_element_is(n, name, array) {
    return name === array[n];
  };

  function get_location(gl, fn, program, array) {
    var name = array[2];
    program[name] = fn.call(gl, program, name);
  }

  function set_attrib_positions(gl, program, src) {
    var statements = _.map(
      Utils.trim_string(src).split(/;|\n/), function (statement) {
        return statement.split(/\s+/);
      });

    var uniforms = _.filter(
      statements, _.bind(nth_element_is, null, 0, 'uniform'));

    var attrs = _.filter(
      statements, _.bind(nth_element_is, null, 0, 'attribute'));

    _.each(uniforms, _.bind(get_location, null, gl, gl.getUniformLocation, program));
    _.each(attrs, _.bind(get_location, null, gl, gl.getAttribLocation, program));
  }

  export function create_program(gl, vs_src, fs_src) {
    var vs = compile_shader(gl, vs_src, gl.VERTEX_SHADER);
    var fs = compile_shader(gl, fs_src, gl.FRAGMENT_SHADER);

    var program = link_program(gl, vs, fs);

    set_attrib_positions(gl, program, vs_src + '\n' + fs_src);

    return program;
  }
}