'use strict';

// column-major!

define(function () {
  var exports = {};

  exports.frustum = function (width, height, near, far) {
    return new Float32Array([
      2 * near / width, 0,                 0,                                 0,
      0,                2 * near / height, 0,                                 0,
      0,                0,                 (far + near) / (far - near),       1,
      0,                0,                 (- 2 * far * near) / (far - near), 0
    ]);
  };

  exports.scale = function (x, y, z, mat) {
    mat = mat || new Float32Array(16);

    mat[0]  = x;
    mat[5]  = y;
    mat[10] = z;
    mat[15] = 1;

    return mat;
  };

  exports.identity = function (mat) {
    return exports.scale(1, 1, 1, mat);
  };

  exports.multiply = function (a, b, mat) {
    mat = mat || new Float32Array(16);

    var i, j, k;

    for (i = 0; i < 16; ++i) {
      j = i % 4;
      k = Math.floor(i/4) * 4;
      mat[i] =
        a[j]    * b[k]   +
        a[j+4]  * b[k+1] +
        a[j+8]  * b[k+2] +
        a[j+12] * b[k+3];
    }

    return mat;
  };

  exports.translate = function (x, y, z, mat) {
    mat = mat || exports.identity();

    mat[12] = x;
    mat[13] = y;
    mat[14] = z;

    return mat;
  };

  return exports;
});
