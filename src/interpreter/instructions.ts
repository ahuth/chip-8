import random from 'lodash/random';
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

  // 1nnn - JP addr - Jump to location nnn
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x1000;
    },
    execute(interpreter, opcode) {
      const address = opcode & 0x0FFF;
      interpreter.program_counter = address;
    },
  },

  // 2nnn - CALL addr - Call subroutine at nnn.
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

  // 3xkk - SE Vx, byte - Skip the next instruction if Vx equals kk.
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

  // 4xkk - SNE Vx, byte - Skip the next instruction if Vx does NOT equal kk.
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

  // 5xy0 - SE Vx, Vy - Skip the next instruction if Vx equals Vy.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x5000;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      const registerValueX = interpreter[registerNameX];
      const registerValueY = interpreter[registerNameY];

      if (registerValueX === registerValueY) {
        advanceToNextInstruction(interpreter);
      }

      advanceToNextInstruction(interpreter);
    },
  },

  // 6xkk - LD Vx, byte - Set Vx to kk.
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

  // 7xkk - ADD Vx, byte - Add the value kk to Vx and store the result in Vx.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x7000;
    },
    execute(interpreter, opcode) {
      const registerId = (opcode & 0x0F00) >> 8;
      const registerName = getRegisterFromId(registerId);
      const addend = opcode & 0x00FF;

      interpreter[registerName] += addend;

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xy0 - LD Vx, Vy - Store the value of register Vx in Vy.
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x8000;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      interpreter[registerNameX] = interpreter[registerNameY];

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xy1 - OR Vx, Vy - Perform bitwise OR on Vx and Vy, then store the result in Vx.
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x8001;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      interpreter[registerNameX] |= interpreter[registerNameY];

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xy2 - AND Vx, Vy - Perform bitwise AND on Vx and Vy, then store the result in Vx.
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x8002;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      interpreter[registerNameX] &= interpreter[registerNameY];

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xy3 - XOR Vx, Vy - Perform bitwise XOR on Vx and Vy, then store the result in Vx.
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x8003;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      interpreter[registerNameX] ^= interpreter[registerNameY];

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xy4 - ADD Vx, Vy - Add Vx and Vy. If the result is greater than 8 bits, set Vf (the carry
  // flag) to 1, otherwise 0. Only the lowest 8 bits of the result are kept and stored in Vx.
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x8004;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      const registerValueX = interpreter[registerNameX];
      const registerValueY = interpreter[registerNameY];

      // Add the value stogether. Only keep the lowest 8 bits.
      const sum = registerValueX + registerValueY;
      const truncatedSum = sum & 0xFF;

      // Set the truncated value in the register. If the non-truncated sum was greater than 8 bits,
      // set the carry flag.
      interpreter[registerNameX] = truncatedSum;
      interpreter.register_vf = (sum > 0xFF) ? 1 : 0;

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xy5 - SUB Vx, Vy - Set Vx to Vx - Vy, and Vf (the not borrow flag) to Vx >= Vy.
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x8005;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      const registerValueX = interpreter[registerNameX];
      const registerValueY = interpreter[registerNameY];

      // Subtract the values.
      const difference = registerValueX - registerValueY;
      // Only store the 8 lowest bits. Not 100% sure if this correct.
      interpreter[registerNameX] = difference & 0xFF;

      // Set the NOT Borrow flag. The correct logic is >= (instead of >) according to
      // https://ia803208.us.archive.org/29/items/bitsavers_rcacosmacCManual1978_6956559/COSMAC_VIP_Instruction_Manual_1978.pdf
      interpreter.register_vf = (registerValueX >= registerValueY) ? 1 : 0;

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xy6 - SHR Vx - Set VF to the least significant bit of Vx, and shift Vx to the right 1
  // (essentially divide it in half).
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x8006;
    },
    execute(interpreter, opcode) {
      const registerId = (opcode & 0x0F00) >> 8;
      const registerName = getRegisterFromId(registerId);

      // Set Vf to the least significant bit of Vx.
      interpreter.register_vf = interpreter[registerName] & 0b0000_0001;

      // Right shift.
      interpreter[registerName] >>= 1;

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xy7 - SUBN Vx, Vy - Set Vx to Vy - Vx, and Vf (the not borrow flag) to Vy >= Vx.
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x8007;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      const registerValueX = interpreter[registerNameX];
      const registerValueY = interpreter[registerNameY];

      // Subtract the values.
      const difference = registerValueY - registerValueX;
      // Store the lowest 8 bits.
      interpreter[registerNameX] = difference & 0xFF;
      // Set the NOT borrow flag.
      interpreter.register_vf = (registerValueY >= registerValueX) ? 1 : 0;

      advanceToNextInstruction(interpreter);
    },
  },

  // 8xyE - SHL Vx - Set VF to the least significant bit of Vx, and shift Vx to the left 1
  // (essentially multiply it by 2).
  {
    test(opcode) {
      return (opcode & 0xF00F) === 0x800E;
    },
    execute(interpreter, opcode) {
      const registerId = (opcode & 0x0F00) >> 8;
      const registerName = getRegisterFromId(registerId);

      // Set Vf to the least significant bit of Vx.
      interpreter.register_vf = interpreter[registerName] & 0b0000_0001;

      // Left shift. Only store the first 8 bits.
      interpreter[registerName] = (interpreter[registerName] << 1) & 0xFF;

      advanceToNextInstruction(interpreter);
    },
  },

  // 9xy0 - SNE Vx, Vy - Skip the next instruction if Vx does NOT equal Vy.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0x9000;
    },
    execute(interpreter, opcode) {
      const registerIdX = (opcode & 0x0F00) >> 8;
      const registerIdY = (opcode & 0x00F0) >> 4;

      const registerNameX = getRegisterFromId(registerIdX);
      const registerNameY = getRegisterFromId(registerIdY);

      const registerValueX = interpreter[registerNameX];
      const registerValueY = interpreter[registerNameY];

      if (registerValueX !== registerValueY) {
        advanceToNextInstruction(interpreter);
      }

      advanceToNextInstruction(interpreter);
    },
  },

  // Annn - LD I, nnn - Set VI to nnn (usually a 12-bit memory address).
  {
    test(opcode) {
      return (opcode & 0xF000) === 0xA000;
    },
    execute(interpreter, opcode) {
      const address = (opcode & 0x0FFF);
      interpreter.register_i = address;
      advanceToNextInstruction(interpreter);
    },
  },

  // Bnnn - JP I, nnn - Jump to address nnn + the value in V0.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0xB000;
    },
    execute(interpreter, opcode) {
      const address = (opcode & 0x0FFF);
      const jumpTo = (address + interpreter.register_v0) & 0xFFF;
      interpreter.program_counter = jumpTo;
    },
  },

  // Cxkk - RND Vx, kk - Set Vx to a random byte AND kk.
  {
    test(opcode) {
      return (opcode & 0xF000) === 0xC000;
    },
    execute(interpreter, opcode) {
      const registerId = (opcode & 0x0F00) >> 8;
      const registerName = getRegisterFromId(registerId);
      const byte = opcode & 0x00FF;
      interpreter[registerName] = random(0xFF) && byte;
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
    case 0:
      return 'register_v0';
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
