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
  memory = new Uint8Array(0xFFF);

  /**
   * The stack. Contains addresses that should be returned to after finishing a subroutine.
   */
  stack = new Uint16Array(16);

  /** 16-bit program counter. Stores the address of the currently executing instruction. */
  program_counter = 0b0000_0000_0000_0000;
  /** 8-bit stack pointer. Points to current "top" of the stack. */
  stack_pointer = 0b0000_0000;

  // General purpose 8-bit registers.
  register_v1 = 0b0000_0000;
  register_v2 = 0b0000_0000;
  register_v3 = 0b0000_0000;
  register_v4 = 0b0000_0000;
  register_v5 = 0b0000_0000;
  register_v6 = 0b0000_0000;
  register_v7 = 0b0000_0000;
  register_v8 = 0b0000_0000;
  register_v9 = 0b0000_0000;
  register_vA = 0b0000_0000;
  register_vB = 0b0000_0000;
  register_vC = 0b0000_0000;
  register_vD = 0b0000_0000;
  register_vE = 0b0000_0000;

  /** 8-bit register, normally used for flags, and not used by any program. */
  register_vf = 0b0000_0000;

  /** 16-bit register, normally used to store memory addresses. */
  register_i = 0b0000_0000_0000_0000;

  /** Delay timer */
  timer_delay = 0b0000_0000;
  /** Sound timer */
  timer_sound = 0b0000_0000;
}
