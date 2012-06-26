'use strict';

(function () {
  var create_triangle_buffer = function (gl) {
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

  var triangle_start = function (gl) {
    var program = bible.create_program(gl, 'lib_identity_vs', 'lib_identity_fs');
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

  bible.register(triangle_start);
})();
