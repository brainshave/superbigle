'use strict';

define([
  'bigle/named',
  'bigle/shaders',
  'bigle/matrices',
  'text!/shaders/flat_vs.c',
  'text!/shaders/identity_fs.c',
], function (named, shaders, matrices, vs_src, fs_src) {
  function create_florida_buffer (gl) {
    // copied from Primitives.cpp
    var verts = new Float32Array([
      2.80, 1.20, 0.0 ,  2.0,  1.20, 0.0 ,
      2.0,  1.08, 0.0 ,  2.0,  1.08, 0.0 ,
      0.0,  0.80, 0.0 ,  -.32, 0.40, 0.0 ,
      -.48, 0.2, 0.0 ,   -.40, 0.0, 0.0 ,
      -.60, -.40, 0.0 ,  -.80, -.80, 0.0 ,
      -.80, -1.4, 0.0 ,  -.40, -1.60, 0.0 ,
      0.0, -1.20, 0.0 ,   .2, -.80, 0.0 ,
      .48, -.40, 0.0 ,   .52, -.20, 0.0 ,
      .48,  .20, 0.0 ,   .80,  .40, 0.0 ,
      1.20, .80, 0.0 ,   1.60, .60, 0.0 ,
      2.0, .60, 0.0 ,    2.2, .80, 0.0 ,
      2.40, 1.0, 0.0 ,   2.80, 1.0, 0.0
    ]);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    return buffer;
  };

  function start (gl) {
    var program = shaders.create_program(gl, vs_src, fs_src);
    var florida = create_florida_buffer(gl);
    var p = matrices.frustum(5 * gl.drawingBufferWidth / gl.drawingBufferHeight, 5, 3, 500);
    var mv = matrices.scale(-1, 1, 1, matrices.translate(0, 0, 4));
    var mvp = matrices.multiply(p, mv);

    gl.useProgram(program);
    gl.enableVertexAttribArray(program.vVertex);

    gl.uniform4f(program.vColor, 0, 0, 0, 1);
    gl.clearColor(1, 1, 1, 1);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.vertexAttribPointer(program.vVertex, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(program.mvpMatrix, false, mvp);

    gl.drawArrays(gl.LINE_LOOP, 0, 24);
  };

  return named(start);
});
