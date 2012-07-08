define([
  'underscore',
], function (_) {
  var exports = {};

  var browser_prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

  exports.get_prefixed_method = function (object, name) {
    var fn = object[name];
    if (typeof fn === 'function') {
      return fn;
    }

    name = name[0].toUpperCase() + name.substr(1);
    for (var i = 0; i < browser_prefixes.length; ++i) {
      fn = object[browser_prefixes[i] + name];
      if (typeof fn === 'function') {
        return _.bind(fn, object);
      }
    }
  };

  return exports;
});
