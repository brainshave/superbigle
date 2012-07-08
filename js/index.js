define([
  'chapter_02/01_triangle.js', 
  'chapter_02/02_move.js', 
  'chapter_02/03_bounce.js', 
], function () {
  var names = [
    'chapter_02/01_triangle.js', 
    'chapter_02/02_move.js', 
    'chapter_02/03_bounce.js', 
  ];
  var exports = {
    names: names
  };
  for (var i = 0; i < arguments.length; ++i) {
    arguments[i].src = names[i];
    exports[names[i]] = arguments[i];
  }

  return exports;
});
