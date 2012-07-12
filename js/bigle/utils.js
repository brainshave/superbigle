define([
  'underscore',
  './named',
], function (_) {

  var whitespace_both_sides = /^\s+|\s+$/mg;

  function trim_string (str) {
    return String.prototype.replace.call(
      str, whitespace_both_sides, '');
  };

  var browser_prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

  function get_prefixed_method (object, name) {
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

  return named(trim_string, get_prefixed_method);
});
