/// <reference path="../Program.ts" />
/// <reference path="../Shaders.ts" />
/// <reference path="../Matrices.ts" />

module Chapters._03 {
  function create_florida_buffer(gl) {
    // copied from Primitives.cpp
    var verts = new Float32Array([
      2.80, 1.20, 0.0, 2.0, 1.20, 0.0,
      2.0, 1.08, 0.0, 2.0, 1.08, 0.0,
      0.0, 0.80, 0.0, -.32, 0.40, 0.0,
      -.48, 0.2, 0.0, -.40, 0.0, 0.0,
      -.60, -.40, 0.0, -.80, -.80, 0.0,
      -.80, -1.4, 0.0, -.40, -1.60, 0.0,
      0.0, -1.20, 0.0, .2, -.80, 0.0,
      .48, -.40, 0.0, .52, -.20, 0.0,
      .48, .20, 0.0, .80, .40, 0.0,
      1.20, .80, 0.0, 1.60, .60, 0.0,
      2.0, .60, 0.0, 2.2, .80, 0.0,
      2.40, 1.0, 0.0, 2.80, 1.0, 0.0
    ]);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    return buffer;
  };

  export var _01_Primitives: Program = {
    name: 'Primitives',
    shaders: {
      vs: 'shaders/flat_vs.c',
      fs: 'shaders/identity_fs.c'
    },

    start: (gl, program) => {
      var florida = create_florida_buffer(gl);
      var p = Matrices.frustum(5 * gl.drawingBufferWidth / gl.drawingBufferHeight, 5, 3, 500);
      var mv = Matrices.scale(-1, 1, 1, Matrices.translate(0, 0, 4));
      var mvp = Matrices.multiply(p, mv);

      var vVertex = program.attribs['vVertex'];
      var vColor = program.uniforms['vColor'];
      var mvpMatrix = program.uniforms['mvpMatrix'];

      gl.useProgram(program.program);
      gl.enableVertexAttribArray(vVertex);

      gl.uniform4f(vColor, 0, 0, 0, 1);
      gl.clearColor(1, 1, 1, 1);

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.vertexAttribPointer(vVertex, 3, gl.FLOAT, false, 0, 0);

      gl.uniformMatrix4fv(mvpMatrix, false, mvp);

      gl.drawArrays(gl.LINE_LOOP, 0, 24);
    }
  }
}