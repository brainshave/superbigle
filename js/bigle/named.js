define([
  'underscore',
], function (_) {
  function named (init) {
    var result;
    var fns;

    if (typeof init === 'object') {
      result = init;
      fns = _.rest(arguments);
    } else {
      result = {};
      fns = arguments;
    }

    _.each(fns, function (fn) {
      var name = fn && fn.name;
      if (name) {
        result[name] = fn;
      }
    });

    return result;
  };

  return named;
});
