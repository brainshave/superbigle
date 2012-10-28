/// <reference path="Utils.ts"/>
/// <reference path="Program.ts"/>
/// <reference path="WebGL.d.ts"/>

class ProgramManager {
  constructor (private canvas_container: HTMLElement) { }

  private requestAnimationFrame = Utils.get_prefixed_method(window, 'requestAnimationFrame');
  private cancelAnimationFrame = Utils.get_prefixed_method(window, 'cancelAnimationFrame');

  private current_program: Program;
  private animation: number;
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;

  animate() {
    this.current_program.paint(this.gl);
    this.animation = this.requestAnimationFrame(() => this.animate());
  }

  start(program: Program) {
    if (this.current_program || this.animation || this.canvas || this.gl) {
      throw new Error("There's a program running: " + this.current_program.name);
    }

    if (typeof program.start !== 'function') {
      throw new Error("Program doesn't have a start method");
    }

    Utils.load_many_txts([program.shaders.vs, program.shaders.fs], (vs_src, fs_src) => {
      this.current_program = program;

      this.canvas = <HTMLCanvasElement> document.createElement('canvas');
      this.canvas.setAttribute('width', window.innerWidth.toString());
      this.canvas.setAttribute('height', window.innerHeight.toString());
      this.canvas.setAttribute('id', 'canvas');
      this.canvas_container.appendChild(this.canvas);

      this.gl = <any> this.canvas.getContext('experimental-webgl');

      var compiled = new Shaders.CompiledProgram(this.gl, vs_src, fs_src);

      this.current_program.start(this.gl, compiled);

      if (typeof this.current_program.paint === 'function') {
        this.animation = this.requestAnimationFrame(() => this.animate());
      }
    });
  }

  stop() {
    if (typeof this.animation !== 'undefined') {
      this.cancelAnimationFrame(this.animation);
      this.animation = undefined;
    }

    if (this.current_program && typeof this.current_program.stop === 'function') {
      this.current_program.stop();
    }

    if (this.canvas) {
      this.canvas_container.removeChild(this.canvas);
    }

    this.canvas = undefined;
    this.gl = undefined;
    this.current_program = undefined;
  }

  handle_key(event: KeyboardEvent) {
    var handler = this.current_program && this.current_program.keys &&
                  this.current_program.keys[event.keyCode.toString()];
    if (typeof handler === 'function') {
      event.preventDefault();
      handler(this.gl, event);
    }
  }
}
