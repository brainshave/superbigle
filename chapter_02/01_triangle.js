'use strict';

(function () {
	var triangle_start = function (gl) {
		console.log('hello!');
	};

	var triangle_stop = function () {
		console.log('bye!');
	};

	bible.register(triangle_start, triangle_stop);
})();
