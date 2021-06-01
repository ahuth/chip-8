import * as Register from './Register';
import type { Interpreter } from './Interpreter';

interface Instruction {
  test: (opcode: number) => boolean,
  execute: (opcode: number, interpreter: Interpreter) => void,
}

/**
 * All instructions that can be executed by this Chip-8 interpreter.
 * @see https://web.archive.org/web/20160213213233/http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#3.1
 */
export const instructions: Instruction[] = [
  // 00E0 - CLS - Clear the display
  {
    test(opcode) {
      return opcode === 0x00E0;
    },
    execute(opcode, interpreter) {
      // Not implemented, yet.
      advanceToNextInstruction(interpreter);
    },
  },

  // 00EE - RET - Return from a subroutine
  {
    test(opcode) {
      return opcode === 0x00EE;
    },
    execute(opcode, interpreter) {
      // Not implemented, yet.
      advanceToNextInstruction(interpreter);
    },
  },

  // 1nnn - JP - Jump to location nnn
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x1000;
    },
    execute(opcode, interpreter) {
      const address = opcode & 0x0FFF;
      Register.set(interpreter.program_counter, address);
    },
  },

  // 2nnn - CALL - Call subroutine at nnn.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x2000;
    },
    execute(opcode, interpreter) {
      const currentAddress = Register.get(interpreter.program_counter);
      const nextAddress = opcode & 0x0FFF;

      interpreter.stack.push(currentAddress);
      Register.set(interpreter.program_counter, nextAddress);
    },
  },
];

/**
 * Increment an interpreter's program counter so that it's at the next instruction.
 */
function advanceToNextInstruction(interpreter: Interpreter) {
  const currentAddress = Register.get(interpreter.program_counter);
  const nextAddress = currentAddress + 2;
  Register.set(interpreter.program_counter, nextAddress);
}
