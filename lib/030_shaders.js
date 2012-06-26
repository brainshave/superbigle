'use strict';

(function () {
  if (!window.bible) {
    window.bible = {};
  }

  bible.get_shader_text = function (id) {
    var script = document.getElementById(id);
    if (!script) {
      return null;
    } else {
      return script.innerText;
    }
  };

  bible.compile_shader = function (gl, src, type) {
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

  bible.link_program = function (gl, vs, fs) {
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

  bible.trim_string = function (str) {
    return String.prototype.replace.call(
      str, whitespace_both_sides, '');
  };

  var nth_element_is = function (n, name, array) {
    return name === array[n];
  };

  bible.set_attrib_positions = function (gl, program, src) {
    var statements = _.map(
      bible.trim_string(src).split(/;|\n/), function (statement) {
        return statement.split(/\s+/);
      });

    var uniforms = _.filter(
      statements, _.bind(nth_element_is, null, 0, 'uniform'));

    var attrs = _.filter(
      statements, _.bind(nth_element_is, null, 0, 'attribute'));

    _.each(uniforms, function (array) {
      var name = array[2];
      program[name] = gl.getUniformLocation(program, name);
    });

    _.each(attrs, function (array) {
      var name = array[2];
      program[name] = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(program[name]);
    });
  };

  bible.create_program = function (gl, vs_id, fs_id) {
    var vs_src = bible.get_shader_text(vs_id);
    var fs_src = bible.get_shader_text(fs_id);

    var vs = bible.compile_shader(gl, vs_src, gl.VERTEX_SHADER);
    var fs = bible.compile_shader(gl, fs_src, gl.FRAGMENT_SHADER);

    var program = bible.link_program(gl, vs, fs);

    bible.set_attrib_positions(gl, program, vs_src + '\n' + fs_src);

    return program;
  };
})();
