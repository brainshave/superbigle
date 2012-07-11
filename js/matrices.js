'use strict';

/*
   All functions operate on 4x4  Float32 matrices.  All functions have
   optional `mat` parameter which is a  place for the result.  You can
   use this parameter to avoid allocation.
*/


define(function () {
  var exports = {};

  exports.zero = function (mat) {
    if (mat) {
      for (var i = 0; i < 16; ++i) {
        mat[i] = 0;
      }
      return mat;
    } else {
      return new Float32Array(16);
    }
  };

  exports.identity = function (mat) {
    mat = exports.zero(mat);

    mat[0]  = 1;
    mat[5]  = 1;
    mat[10] = 1;
    mat[15] = 1;

    return mat;
  };

  exports.frustum = function (width, height, near, far, mat) {
    mat = exports.zero(mat);

    mat[0]  = 2 * near / width;
    mat[5]  = 2 * near / height;
    mat[10] = (far + near) / (far - near);
    mat[11] = 1;
    mat[14] = (- 2 * far * near) / (far - near);

    return mat;
  };

  exports.multiply = function (a, b, mat) {
    mat = mat || new Float32Array(16);

    var i, j, k = 0;

    for (i = 0; i < 16; ++i) {
      j = i % 4;

      mat[i] =
        a[j]    * b[k]   +
        a[j+4]  * b[k+1] +
        a[j+8]  * b[k+2] +
        a[j+12] * b[k+3];

      // after a column:
      if (j === 3) {
        k += 4;
      }
    }

    return mat;
  };

  exports.scale = function (x, y, z, mat) {
    mat = mat || exports.identity(mat);

    mat[0]  *= x;
    mat[5]  *= y;
    mat[10] *= z;

    return mat;
  };

  exports.translate = function (x, y, z, mat) {
    mat = mat || exports.identity();

    mat[12] += x;
    mat[13] += y;
    mat[14] += z;

    return mat;
  };

  return exports;
});
