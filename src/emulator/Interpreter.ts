import Memory from './Memory';
import Register from './Register';
import Stack from './Stack';

/**
 * Chip-8 interpreter.
 * @see https://web.archive.org/web/20160213213233/http://devernay.free.fr/hacks/chip8/C8TECH10.HTM
 */
export default class Interpreter {
  /**
   * Memory (4KB)
   *
   * - 0x000 to 0x1FF is reserved for the interpreter.
   * - 0x200 is where most Chip-8 programs start.
   * - 0x600 is where ETI 660 Chip-8 programs start.
   * - 0xFFF is the end of RAM.
   */
  memory = new Memory();

  /**
   * Stack of addresses that should be returned to after finishing a subroutine.
   */
  stack = new Stack();

  /** 16-bit program counter. Stores the address of the currently executing instruction. */
  program_counter = new Register(16);

  // General purpose 8-bit registers.
  register_v1 = new Register(8);
  register_v2 = new Register(8);
  register_v3 = new Register(8);
  register_v4 = new Register(8);
  register_v5 = new Register(8);
  register_v6 = new Register(8);
  register_v7 = new Register(8);
  register_v8 = new Register(8);
  register_v9 = new Register(8);
  register_va = new Register(8);
  register_vb = new Register(8);
  register_vc = new Register(8);
  register_vd = new Register(8);
  register_ve = new Register(8);

  /** 8-bit register, normally used for flags, and not used by any program. */
  register_vf = new Register(8);

  /** 16-bit register, normally used to store memory addresses. */
  register_i = new Register(16);

  /** Delay timer */
  timer_delay = new Register(8);
  /** Sound timer */
  timer_sound = new Register(8);

  /**
   * Generator function for running a program. The returned generator object must be manually
   * advanced. Think of this as manually advancing the clock of a CPU.
   *
   * @example
   * const gen = interpreter.interpret(program);
   * gen.next();
   */
  *interpret(program: number[]) {
    this.memory.load(program);
    // Programs are normally loaded starting at memory address 0x200. The ETI 660 is different, but
    // let's assume a normal program, and set the program counter accordingly.
    this.program_counter.set(0x200);

    while (true) {
      const instruction = this.memory.read2(this.program_counter.get());

      if (!instruction) { return; }

      yield instruction;
      this.program_counter.increment(2);
    }
  }
}
