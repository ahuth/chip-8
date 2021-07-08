import {instructions} from './instructions';
import Display from './Display';
import * as Memory from './Memory';

/**
 * Chip-8 interpreter.
 * @see https://web.archive.org/web/20160213213233/http://devernay.free.fr/hacks/chip8/C8TECH10.HTM
 */
export type Interpreter = ReturnType<typeof create>;

/**
 * Create a new Chip-8 interpreter.
 */
export function create() {
  return {
    display: new Display(),
    memory: Memory.create(),

    /**
     * Stack of addresses that should be returned to after finishing a subroutine.
     */
    stack: [] as number[],

    /** 16-bit program counter. Stores the address of the currently executing instruction. */
    program_counter: 0,

    // General purpose 8-bit registers.
    register_v0: 0,
    register_v1: 0,
    register_v2: 0,
    register_v3: 0,
    register_v4: 0,
    register_v5: 0,
    register_v6: 0,
    register_v7: 0,
    register_v8: 0,
    register_v9: 0,
    register_va: 0,
    register_vb: 0,
    register_vc: 0,
    register_vd: 0,
    register_ve: 0,

    /** 8-bit register, normally used for flags, and not used by any program. */
    register_vf: 0,

    /** 16-bit register, normally used to store memory addresses. */
    register_i: 0,

    /** Delay timer */
    timer_delay: 0,
    /** Sound timer */
    timer_sound: 0,
  };
}

/**
 * Load a program into memory so it can be executed
 */
export function load(interpreter: Interpreter, program: number[]): void {
  Memory.load(interpreter.memory, program);
  // Programs are normally loaded starting at memory address 0x200. The ETI 660 is different, but
  // let's assume a normal program, and set the program counter accordingly.
  interpreter.program_counter = 0x200;
}

/**
 * Execute one cycle. This is like executing one clock cycle of a CPU.
 */
export function tick(interpreter: Interpreter): void {
  // Fetch
  const currentAddress = interpreter.program_counter;
  const opcode = Memory.read2(interpreter.memory, currentAddress);

  // Decode
  const instruction = instructions.find((instruction) => instruction.test(opcode));

  if (!instruction) {
    throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
  }

  // Execute
  instruction.execute(interpreter, opcode);
}
