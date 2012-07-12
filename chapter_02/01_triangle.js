'use strict';

define([
  'bigle/named',
  'bigle/shaders',
  'text!/shaders/identity_vs.c',
  'text!/shaders/identity_fs.c',
], function (named, shaders, vs_src, fs_src) {
  function create_triangle_buffer (gl) {
    var verts = new Float32Array([
     -0.5, 0,   0, 1,
      0.5, 0,   0, 1,
      0,   0.5, 0, 1,
    ]);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    return buffer;
  };

  function start (gl) {
    var program = shaders.create_program(gl, vs_src, fs_src);
    var buffer = create_triangle_buffer(gl);

    gl.useProgram(program);
    gl.enableVertexAttribArray(program.vVertex);

    gl.uniform4f(program.vColor, 1, 0.3, 0.3, 1);
    gl.clearColor(0.3, 0.3, 1, 1);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.vertexAttribPointer(program.vVertex, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
  };

  return named(start);
});
