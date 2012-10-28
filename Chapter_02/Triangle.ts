/// <reference path="../Program.ts" />

module Chapters._02 {
  function create_triangle_buffer(gl: WebGLRenderingContext) {
    var verts = new Float32Array([
     -0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0, 0.5, 0, 1,
    ]);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    return buffer;
  };

  export var _01_Triangle: Program = {
    name: 'Triangle',
    shaders: {
      vs: 'shaders/identity_vs.c',
      fs: 'shaders/identity_fs.c'
    },

    start: (gl, program) => {
      var buffer = create_triangle_buffer(gl);
      var vVertex = program.attribs['vVertex'];
      var vColor = program.uniforms['vColor']

      gl.useProgram(program.program);
      gl.enableVertexAttribArray(vVertex);
      gl.uniform4f(vColor, 1, 0.3, 0.3, 1);
      gl.clearColor(0.3, 0.3, 1, 1);

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.vertexAttribPointer(vVertex, 4, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
    }
  }
}