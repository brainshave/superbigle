module Matrices {
  export function zero(mat?: Float32Array) {
    if (mat) {
      for (var i = 0; i < 16; ++i) {
        mat[i] = 0;
      }
      return mat;
    } else {
      return new Float32Array(16);
    }
  }

  export function identity(mat?: Float32Array) {
    mat = zero(mat);

    mat[0] = 1;
    mat[5] = 1;
    mat[10] = 1;
    mat[15] = 1;

    return mat;
  }

  export function frustum(width: number, height: number, near: number, far: number, mat?: Float32Array) {
    mat = zero(mat);

    mat[0] = 2 * near / width;
    mat[5] = 2 * near / height;
    mat[10] = (far + near) / (far - near);
    mat[11] = 1;
    mat[14] = (-2 * far * near) / (far - near);

    return mat;
  }

  export function multiply(a: Float32Array, b: Float32Array, mat?: Float32Array) {
    mat = mat || new Float32Array(16);

    var i, j, k = 0;

    for (i = 0; i < 16; ++i) {
      j = i % 4;

      mat[i] =
        a[j] * b[k] +
        a[j + 4] * b[k + 1] +
        a[j + 8] * b[k + 2] +
        a[j + 12] * b[k + 3];

      // after a column:
      if (j === 3) {
        k += 4;
      }
    }

    return mat;
  }

  export function scale(x: number, y: number, z: number, mat?: Float32Array) {
    mat = mat || identity(mat);

    mat[0] *= x;
    mat[5] *= y;
    mat[10] *= z;

    return mat;
  }

  export function translate(x: number, y: number, z: number, mat?: Float32Array) {
    mat = mat || identity();

    mat[12] += x;
    mat[13] += y;
    mat[14] += z;

    return mat;
  }
}