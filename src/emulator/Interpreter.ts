import {instructions} from './Instruction';
import * as Memory from './Memory';
import * as Register from './Register';

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
    memory: Memory.create(),

    /**
     * Stack of addresses that should be returned to after finishing a subroutine.
     */
    stack: [] as number[],

    /** 16-bit program counter. Stores the address of the currently executing instruction. */
    program_counter: Register.create(16),

    // General purpose 8-bit registers.
    register_v1: Register.create(8),
    register_v2: Register.create(8),
    register_v3: Register.create(8),
    register_v4: Register.create(8),
    register_v5: Register.create(8),
    register_v6: Register.create(8),
    register_v7: Register.create(8),
    register_v8: Register.create(8),
    register_v9: Register.create(8),
    register_va: Register.create(8),
    register_vb: Register.create(8),
    register_vc: Register.create(8),
    register_vd: Register.create(8),
    register_ve: Register.create(8),

    /** 8-bit register, normally used for flags, and not used by any program. */
    register_vf: Register.create(8),

    /** 16-bit register, normally used to store memory addresses. */
    register_i: Register.create(16),

    /** Delay timer */
    timer_delay: Register.create(8),
    /** Sound timer */
    timer_sound: Register.create(8),
  };
}

/**
 * Load a program into memory so it can be executed
 */
export function load(interpreter: Interpreter, program: number[]): void {
  Memory.load(interpreter.memory, program);
  // Programs are normally loaded starting at memory address 0x200. The ETI 660 is different, but
  // let's assume a normal program, and set the program counter accordingly.
  Register.set(interpreter.program_counter, 0x200);
}

/**
 * Execute one cycle. This is like executing one clock cycle of a CPU.
 */
export function tick(interpreter: Interpreter): void {
  const currentAddress = Register.get(interpreter.program_counter);
  const opcode = Memory.read2(interpreter.memory, currentAddress);
  const instruction = instructions.find((instruction) => instruction.test(opcode));

  if (!instruction) {
    throw new Error(`Unknown opcode: ${opcode}`);
  }

  instruction.execute(opcode, interpreter);
}
