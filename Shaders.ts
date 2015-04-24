/// <reference path="Utils.ts"/>
/// <reference path="underscore-1.4.d.ts" />

module Shaders {
  export function compile_shader(gl: WebGLRenderingContext, src: string, type: number) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      throw new Error('Shader compile error:\n' + gl.getShaderInfoLog(shader));
    }
  }

  export function link_program(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
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
  
  function get_statements(src: string): string[][] {
    return _.map(Utils.trim_string(src).split(/;|\n/), (statement: string) => statement.split(/\s+/));
  }

  export class CompiledProgram {
    program: WebGLProgram;
    uniforms: { [index: string]: WebGLUniformLocation; } = {};
    attribs: { [index: string]: number; } = {};

    constructor (private gl: WebGLRenderingContext, vs_src: string, fs_src: string) {
      var vs = compile_shader(gl, vs_src, gl.VERTEX_SHADER);
      var fs = compile_shader(gl, fs_src, gl.FRAGMENT_SHADER);

      this.program = link_program(gl, vs, fs);

      this.set_locations(vs_src + '\n' + fs_src);
    }

    private set_locations(src: string) {
      var statements = get_statements(src);
      
      var uniforms = statements.filter((stmt) => stmt[0] === 'uniform');
      var attrs = statements.filter((stmt) => stmt[0] === 'attribute');

      var i, name;
      for (i = 0; i < uniforms.length; ++i) {
        name = uniforms[i][2];
        this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
      }

      for (i = 0; i < attrs.length; ++i) {
        name = attrs[i][2];
        this.attribs[name] = this.gl.getAttribLocation(this.program, name);
      }
    }
  }
}