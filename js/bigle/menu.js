'use strict';

define([
  'underscore',
], function (_) {
  var chapter_name = /^chapter_(\d+)\/\d+_(.+)$/;

  function generate_empty_chapters () {
    return _.map(_.range(16), function(i) {
      var chapter = i + 1;

      var chapter_li = document.createElement('li');
      chapter_li.setAttribute('id', 'menu-chapter-' + chapter);
      chapter_li.innerHTML = 'Chapter ' + chapter;

      var scripts_ul = document.createElement('ul');
      chapter_li.appendChild(scripts_ul);
      chapter_li.scripts_ul = scripts_ul;

      return chapter_li;
    });
  };

  function put_menu_item (chapter_uls, script_name) {
    var match = chapter_name.exec(script_name);
    var chapter = +match[1] - 1;
    var name = match[2];

    var li = document.createElement('li');
    var a = document.createElement('a');
    a.setAttribute('href', '#' + script_name);
    a.innerHTML = name;
    li.appendChild(a);
    chapter_uls[chapter].appendChild(li);
  }

  function put (ul, script_names) {
    var chapter_lis = generate_empty_chapters();
    var chapter_uls = _.pluck(chapter_lis, 'scripts_ul');

    _.each(script_names, _.bind(put_menu_item, null, chapter_uls));

    _.each(chapter_lis, _.bind(ul.appendChild, ul));
  };

  return put;
});
