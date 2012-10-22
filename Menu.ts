/// <reference path="ProgramManager.ts"/>
/// <reference path="Chapter_02/Triangle.ts"/>
/// <reference path="Chapter_02/Move.ts"/>

declare var _;

module Menu {
  function program_starter(manager: ProgramManager, program: Program) {
    return (event: MouseEvent) => {
      manager.stop();
      manager.start(program);
    };
  }

  export function get_program_by_id(id: string): Program {
    if (id.indexOf('.') !== -1) {
      var ids = id.split('.');
      var chapter = Chapters[ids[0]];
      if (chapter) {
        return <Program> chapter[ids[1]];
      }
    }
  }

  export function gen_menu(chapters_ul: HTMLElement, manager: ProgramManager): void {
    var names: string[] = _.keys(Chapters).sort();
    for (var i = 0; i < names.length; ++i) {
      var chapter = parseInt(names[i].match(/\d+/)[0], 10);

      var chapter_li = document.createElement('li');
      chapter_li.setAttribute('id', 'menu-chapter-' + chapter);
      chapter_li.innerHTML = 'Chapter ' + chapter;

      var chapter_ul = document.createElement('ul');
      chapter_li.appendChild(chapter_ul);

      var programs: string[] = _.keys(Chapters[names[i]]).sort();

      for (var j = 0; j < programs.length; ++j) {
        var program = <Program> Chapters[names[i]][programs[j]];

        var li = document.createElement('li');
        var a = document.createElement('a');

        a.innerHTML = program.name;
        a.setAttribute('href', '#' + names[i] + '.' + programs[j]);
        a.onclick = program_starter(manager, program);

        li.appendChild(a);
        chapter_ul.appendChild(li);
      }

      chapters_ul.appendChild(chapter_li);
    }
  }
}