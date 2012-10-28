/// <reference path="Shaders.ts"/>

interface Program {
  name: string;
  shaders: { vs: string; fs: string; };
  start(gl: WebGLRenderingContext, compiled_program: Shaders.CompiledProgram): void;
  stop? (): void;
  paint? (gl: WebGLRenderingContext): void;
  keys?: { [index]: (gl: WebGLRenderingContext, event: KeyboardEvent) => void; };
}