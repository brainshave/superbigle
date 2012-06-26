'use strict';

(function () {
  var program;

  var triangle_start = function (gl) {
    program = bible.create_program(gl, 'lib_identity_vs', 'lib_identity_fs');
    gl.useProgram(program);
    console.log(program);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  bible.register(triangle_start);
})();
