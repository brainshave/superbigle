interface Program {
  name: string;
  start(gl): void;
  stop? (): void;
  paint? (gl): void;
  keys?: Object;
}