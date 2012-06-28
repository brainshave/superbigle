'use strict';

(function () {
  var block_size = 0.1, step_size = 0.025;

  var gl, program, buffer;

  var verts = new Float32Array([
    -block_size, -block_size,
    block_size, -block_size,
    block_size, block_size,
    -block_size, block_size,
  ]);

  var move = function (event) {
    var x = verts[0];
    var y = verts[1];

    switch (event.keyCode) {
    case 37: x -= step_size; break;
    case 39: x += step_size; break;
    case 38: y += step_size; break;
    case 40: y -= step_size; break;
    }


    x = Math.max(x, -1);
    x = Math.min(x,  1 - block_size * 2);
    y = Math.max(y, -1);
    y = Math.min(y,  1 - block_size * 2);

    verts[0] = x;
    verts[1] = y;
    verts[2] = x + block_size * 2;
    verts[3] = y;
    verts[4] = verts[2];
    verts[5] = y + block_size * 2;
    verts[6] = x;
    verts[7] = verts[5];

    paint();
  };

  var paint = function () {
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(program.vVertex, 2, gl.FLOAT, false, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  };

  var start = function (gl_init) {
    gl = gl_init;
    program = bible.create_program(gl, 'lib_identity_vs', 'lib_identity_fs');
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.useProgram(program);
    gl.enableVertexAttribArray(program.vVertex);

    gl.uniform4f(program.vColor, 1, 0.3, 0.3, 1);
    gl.clearColor(0.3, 0.3, 1, 1);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    paint(gl);
  };

  bible.register(start, null, null, {
    37: move,
    38: move,
    39: move,
    40: move,
  });
})();
