module Utils {
  var whitespace_both_sides = /^\s+|\s+$/mg;

  export function trim_string(str: string): string {
    return String.prototype.replace.call(
      str, whitespace_both_sides, '');
  }

  var browser_prefixes = ['webkit', 'moz', 'ms', 'o'];

  export function get_prefixed_method(object, name) {
    var fn = object[name];
    if (typeof fn === 'function') {
      return fn;
    }

    name = name[0].toUpperCase() + name.substr(1);
    for (var i = 0; i < browser_prefixes.length; ++i) {
      fn = object[browser_prefixes[i] + name];
      if (typeof fn === 'function') {
        return fn.bind(object);
      }
    }
  }

  export function load_txt(path: string, callback: (text: string) => void) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (event) => {
      if (xhr.readyState === 4) {
        callback(xhr.responseText);
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  }

  export function load_many_txts(paths: string[], callback: (...texts: string[]) => void) {
    var to_go = paths.length;
    var texts = [];

    var receive = (i: number) => (text: string) => {
      to_go--;
      texts[i] = text;
      if (to_go === 0) {
        callback.apply(this, texts);
      }
    };

    for (var i = 0; i < paths.length; ++i) {
      load_txt(paths[i], receive(i));
    }
  }
}