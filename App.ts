/// <reference path="Menu.ts"/>
/// <reference path="ProgramManager.ts"/>

module SuperBigle {
  var manager = new ProgramManager(document.getElementById('put-canvas-here'));

  Menu.gen_menu(document.getElementById('menu'), manager);

  var startup_program = Menu.get_program_by_id(location.hash.substring(1));
  if (startup_program) {
    manager.start(startup_program);
  }
}
