'use strict';

// This is modified version of Move program, so that keys change
// direction of bouncing.

define([
  'bigle/named',
  'bigle/shaders',
  'text!/shaders/identity_vs.c',
  'text!/shaders/identity_fs.c',
], function (named, shaders, vs_src, fs_src) {
  var block_size = 0.1, step_size = 0.01;
  var xd = step_size, yd = step_size;

  var max_xy = 1 - block_size * 2;

  var program, buffer;

  var verts = new Float32Array([
    -block_size, -block_size,
    block_size, -block_size,
    block_size, block_size,
    -block_size, block_size,
  ]);

  function change_dir (gl, event) {
    switch (event.keyCode) {
    case 37: xd = -step_size; break;
    case 39: xd =  step_size; break;
    case 38: yd =  step_size; break;
    case 40: yd = -step_size; break;
    }
  };

  function bounce () {
    var x = verts[0] + xd;
    var y = verts[1] + yd;

    if (x < -1) {
      x = -1;
      xd *= -1;
    } else if (x > max_xy) {
      x = max_xy;
      xd *= -1;
    }

    if (y < -1) {
      y = -1;
      yd *= -1;
    } else if (y > max_xy) {
      y = max_xy;
      yd *= -1;
    }


    verts[0] = x;
    verts[1] = y;
    verts[2] = x + block_size * 2;
    verts[3] = y;
    verts[4] = verts[2];
    verts[5] = y + block_size * 2;
    verts[6] = x;
    verts[7] = verts[5];
  };

  function paint (gl) {
    bounce();

    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(program.vVertex, 2, gl.FLOAT, false, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  };

  function start (gl) {
    program = shaders.create_program(gl, vs_src, fs_src);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.useProgram(program);
    gl.enableVertexAttribArray(program.vVertex);

    gl.uniform4f(program.vColor, 1, 0.3, 0.3, 1);
    gl.clearColor(0.3, 0.3, 1, 1);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  };

  function stop () {
    program = null;
    buffer = null;
  };

  return named({
    keys: {
      37: change_dir,
      38: change_dir,
      39: change_dir,
      40: change_dir,
    }
  }, start, stop, paint);
});
