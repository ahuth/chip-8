import type { Interpreter } from './Interpreter';

interface Instruction {
  test: (opcode: number) => boolean,
  execute: (interpreter: Interpreter, opcode: number) => void,
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
    execute(interpreter) {
      // Not implemented, yet.
      advanceToNextInstruction(interpreter);
    },
  },

  // 00EE - RET - Return from a subroutine
  {
    test(opcode) {
      return opcode === 0x00EE;
    },
    execute(interpreter) {
      const nextAddress = interpreter.stack.pop();

      if (nextAddress) {
        interpreter.program_counter = nextAddress;
      }

      advanceToNextInstruction(interpreter);
    },
  },

  // 1nnn - JP - Jump to location nnn
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x1000;
    },
    execute(interpreter, opcode) {
      const address = opcode & 0x0FFF;
      interpreter.program_counter = address;
    },
  },

  // 2nnn - CALL - Call subroutine at nnn.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x2000;
    },
    execute(interpreter, opcode) {
      const currentAddress = interpreter.program_counter;
      const nextAddress = opcode & 0x0FFF;

      interpreter.stack.push(currentAddress);
      interpreter.program_counter = nextAddress;
    },
  },

  // 3xkk - SE - Skip the next instruction if Vx equals kk.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x3000;
    },
    execute(interpreter, opcode) {
      const registerId = (opcode & 0x0F00) >> 8;
      const registerName = getRegisterFromId(registerId);
      const registerValue = interpreter[registerName];
      const providedValue = opcode & 0x00FF;

      if (registerValue === providedValue) {
        advanceToNextInstruction(interpreter);
      }

      advanceToNextInstruction(interpreter);
    },
  },

  // 4xkk - SNE - Skip the next instruction if Vx does NOT equal kk.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x4000;
    },
    execute(interpreter, opcode) {
      const registerId = (opcode & 0x0F00) >> 8;
      const registerName = getRegisterFromId(registerId);
      const registerValue = interpreter[registerName];
      const providedValue = opcode & 0x00FF;

      if (registerValue !== providedValue) {
        advanceToNextInstruction(interpreter);
      }

      advanceToNextInstruction(interpreter);
    },
  },

  // 6xkk - LD - Set Vx to kk.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x6000;
    },
    execute(interpreter, opcode) {
      const registerId = (opcode & 0x0F00) >> 8;
      const registerName = getRegisterFromId(registerId);

      const value = opcode & 0x00FF;
      interpreter[registerName] = value;

      advanceToNextInstruction(interpreter);
    },
  },
];

/**
 * Increment an interpreter's program counter so that it's at the next instruction.
 */
function advanceToNextInstruction(interpreter: Interpreter) {
  const currentAddress = interpreter.program_counter;
  const nextAddress = currentAddress + 2;
  interpreter.program_counter = nextAddress;
}

/**
 * Get the full register name (such as register_vb) from an identifier (such as b). The return type
 * is a union of string literals, so it can be used to index the `interpreter` object without
 * needing any null or type checks.
 */
function getRegisterFromId(id: number) {
  switch (id) {
    case 1:
      return 'register_v1';
    case 2:
      return 'register_v2';
    case 3:
      return 'register_v3';
    case 4:
      return 'register_v4';
    case 5:
      return 'register_v5';
    case 6:
      return 'register_v6';
    case 7:
      return 'register_v7';
    case 8:
      return 'register_v8';
    case 9:
      return 'register_v9';
    case 10:
      return 'register_va';
    case 11:
      return 'register_vb';
    case 12:
      return 'register_vc';
    case 13:
      return 'register_vd';
    case 14:
      return 'register_ve';
    default:
      throw new Error(`Unknown register ${id}`);
  }
}
