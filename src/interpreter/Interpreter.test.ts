import * as Interpreter from './Interpreter';

describe('instructions', () => {
  describe('00EE - RET', () => {
    it('returns from a subroutine', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Call subroutine at address 0x206. Should return to here when it's done. Address 0x200.
        0x22, 0x06,
        // Clear the display (just to take up space). Address 0x202.
        0x00, 0xE0,
        // Clear the display (just to take up space). Address 0x204.
        0x00, 0xE0,
        // Start of subroutine.
        // Clear the display. Address 0x206.
        0x00, 0xE0,
        // Return from subroutine. Address 0x208.
        0x00, 0xEE,
      ]);

      // Starts at 0x200.
      expect(interpreter.program_counter).toEqual(0x200);
      expect(interpreter.stack).toEqual([]);

      // Execute the subroutine call. Should jump to 0x206.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x206);
      expect(interpreter.stack).toEqual([0x200]);

      // Execute the subroutine's CLS.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x208);
      expect(interpreter.stack).toEqual([0x200]);

      // Execute the subroutine return. Should go back to where we left off - 0x202
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x202);
      expect(interpreter.stack).toEqual([]);
    });
  });

  describe('1nnn - JP addr', () => {
    it('jumps to location nnn', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Jump to address 666.
        0x16, 0x66,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x666);
    });
  });

  describe('2nnn - CALL addr', () => {
    it('calls subroutine at address nnn', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Call subroutine at address 345.
        0x23, 0x45,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);
      expect(interpreter.stack).toEqual([]);

      Interpreter.tick(interpreter);

      expect(interpreter.program_counter).toEqual(0x345);
      expect(interpreter.stack).toEqual([0x200]);
    });
  });

  describe('3xkk - SE Vx, byte', () => {
    it('skips the next instruction when the register Vx === kk', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x02 into V8
        0x68, 0x02,
        // Skip the next instruction if V8 equals 0x02
        0x38, 0x02,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);

      // Load the value into the register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x202);

      // The value kk equals what's in the register, so skip the next instruction. There aren't
      // actually any instructions to skip, but we can tell if this is working based on where the
      // program counter ends up.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x206);
    });

    it('does not skip any instructions when Vx !== kk', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x02 into V8
        0x68, 0x02,
        // Skip the next instruction if V8 equals 0x03
        0x38, 0x03,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);

      // Load the value into the register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x202);

      // The value kk does NOT equal what's in the register, so don't skip the next instruction.
      // There aren't actually any instructions to skip, but we can tell if this is working based
      // on where the program counter ends up.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x204);
    });
  });

  describe('4xkk - SNE Vx, byte', () => {
    it('skips the next instruction when the register Vx !== kk', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x02 into VA
        0x6A, 0x02,
        // Skip the next instruction if VA equals 0x04
        0x4A, 0x04,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);

      // Load the value into the register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x202);

      // The value kk does NOT equal what's in the register, so skip the next instruction. There
      // aren't actually any instructions to skip, but we can tell if this is working based on
      // where the program counter ends up.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x206);
    });

    it('does not skip any instructions when Vx === kk', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x02 into VA
        0x6A, 0x02,
        // Skip the next instruction if VA equals 0x02
        0x4A, 0x02,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);

      // Load the value into the register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x202);

      // The value kk equals what's in the register, so don't skip the next instruction. There
      // aren't actually any instructions to skip, but we can tell if this is working based on
      // where the program counter ends up.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x204);
    });
  });

  describe('5xy0 - SE Vx, Vy', () => {
    it('skips the next instruction when the registers Vx and Vy are equal', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x1A into V1
        0x61, 0x1A,
        // Load 0x1A into V2
        0x62, 0x1A,
        // Skip the next instruction if V1 equals V2
        0x51, 0x20,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);

      // Load the value into the 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x202);

      // Load the value into the 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x204);

      // The value in V1 and V2 are the same, so skip the next instruction. There aren't actually
      // any instructions to skip, but we can tell if this is working based on where the program
      // counter ends up.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x208);
    });

    it('does not skip any instructions when Vx and Vy are different', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x1A into V1
        0x61, 0x1A,
        // Load 0x1B into V2
        0x62, 0x1B,
        // Skip the next instruction if V1 equals V2
        0x51, 0x20,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);

      // Load the value into the 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x202);

      // Load the value into the 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x204);

      // The value in V1 and V2 are the different, so skip the next instruction. There aren't
      // actually any instructions to skip, but we can tell if this is working based on where the
      // program counter ends up.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x206);
    });
  });

  describe('6xkk - LD Vx, byte', () => {
    it('loads byte kk into register Vx', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0xAB into V1
        0x61, 0xAB,
        // Load 0xCD into V2
        0x62, 0xCD,
        // Load 0xEF into V9
        0x69, 0xEF,
        // Load 0x24 into VC
        0x6C, 0x24,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);
      expect(interpreter.register_v9).toEqual(0);
      expect(interpreter.register_vc).toEqual(0);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0xAB);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v2).toEqual(0xCD);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v9).toEqual(0xEF);

      Interpreter.tick(interpreter);
      expect(interpreter.register_vc).toEqual(0x24);
    });
  });

  describe('7xkk - ADD Vx, byte', () => {
    it('adds kk to register Vx and stores the result in Vx', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x0A into V3
        0x63, 0x0A,
        // Add 1 to V3
        0x73, 0x01,
        // Add 2 to V3
        0x73, 0x02,
      ]);

      expect(interpreter.register_v3).toEqual(0);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v3).toEqual(0x0A);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v3).toEqual(0x0B);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v3).toEqual(0x0D);
    });
  });

  describe('8xy0 - LD Vx, Vy', () => {
    it('stores the value in register Vy in Vx', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x12 into V5
        0x65, 0x12,
        // Store the V5 in V1
        0x81, 0x50,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v5).toEqual(0);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v5).toEqual(0x12);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x12);
      expect(interpreter.register_v5).toEqual(0x12);
    });
  });

  describe('8xy1 - OR Vx, Vy', () => {
    it('stores the bitwise OR of Vx and Vy in Vx', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0xA5 into V1
        0x61, 0xA5,
        // Load 0x17 into V2
        0x62, 0x17,
        // Compute V1 | V2 and store in V1
        0x81, 0x21,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0xA5);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0xA5);
      expect(interpreter.register_v2).toEqual(0x17);

      // Set the 1st register to the OR of both.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0xB7);
      expect(interpreter.register_v2).toEqual(0x17);
    });
  });

  describe('8xy2 - AND Vx, Vy', () => {
    it('stores the bitwise AND of Vx and Vy in Vx', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0xA5 into V2
        0x62, 0xA5,
        // Load 0x17 into V4
        0x64, 0x17,
        // Compute V1 & V2 and store in V1
        0x82, 0x42,
      ]);

      expect(interpreter.register_v2).toEqual(0);
      expect(interpreter.register_v4).toEqual(0);

      // Load into 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v2).toEqual(0xA5);
      expect(interpreter.register_v4).toEqual(0);

      // Load into 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v2).toEqual(0xA5);
      expect(interpreter.register_v4).toEqual(0x17);

      // Set the 1st register to the AND of both.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v2).toEqual(0x05);
      expect(interpreter.register_v4).toEqual(0x17);
    });
  });

  describe('8xy3 - XOR Vx, Vy', () => {
    it('stores the bitwise XOR of Vx and Vy in Vx', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0xA5 into VA
        0x6A, 0xA5,
        // Load 0x17 into V3
        0x63, 0x17,
        // Compute V1 & V2 and store in V1
        0x8A, 0x33,
      ]);

      expect(interpreter.register_va).toEqual(0);
      expect(interpreter.register_v3).toEqual(0);

      // Load into 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_va).toEqual(0xA5);
      expect(interpreter.register_v3).toEqual(0);

      // Load into 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_va).toEqual(0xA5);
      expect(interpreter.register_v3).toEqual(0x17);

      // Set the 1st register to the XOR of both.
      Interpreter.tick(interpreter);
      expect(interpreter.register_va).toEqual(0xB2);
      expect(interpreter.register_v3).toEqual(0x17);
    });
  });

  describe('8xy4 - ADD Vx, Vy', () => {
    it('sets register Vx to Vx + Vy', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x02 into V1
        0x61, 0x02,
        // Load 0x03 into V2
        0x62, 0x03,
        // Compute V1 + V2 and store in V1
        0x81, 0x24,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x02);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x02);
      expect(interpreter.register_v2).toEqual(0x03);

      // Set the 1st register to the sum of both.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x05);
      expect(interpreter.register_v2).toEqual(0x03);

      // Carry flag is not set since the sum is less than 8 bits.
      expect(interpreter.register_vf).toEqual(0);
    });

    it('keeps the lowest 8 bits and sets the carry flag if the result is greater than 8 bits', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0xFE into V1
        0x61, 0xFE,
        // Load 0x03 into V2
        0x62, 0x03,
        // Compute V1 + V2 and store in V1
        0x81, 0x24,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0xFE);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0xFE);
      expect(interpreter.register_v2).toEqual(0x03);

      // Set the 1st register to the sum of both. Since the result is greater than 8 bits, we only
      // keep the first 8 bits.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x01);
      expect(interpreter.register_v2).toEqual(0x03);

      // Carry flag is set since the sum is more than 8 bits.
      expect(interpreter.register_vf).toEqual(1);
    });
  });

  describe('8xy5 - SUB Vx, Vy', () => {
    it('sets register Vx to Vx - Vy', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x05 into V1
        0x61, 0x05,
        // Load 0x03 into V2
        0x62, 0x03,
        // Compute V1 - V2 and store in V1
        0x81, 0x25,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x05);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x05);
      expect(interpreter.register_v2).toEqual(0x03);

      // Set the 1st register to the sum of both.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x02);
      expect(interpreter.register_v2).toEqual(0x03);

      // NOT borrow flag is set since Vx was > Vy.
      expect(interpreter.register_vf).toEqual(1);
    });

    it('sets the NOT borrow flag when Vx equals Vy', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x03 into V1
        0x61, 0x03,
        // Load 0x03 into V2
        0x62, 0x03,
        // Compute V1 - V2 and store in V1
        0x81, 0x25,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0x03);

      // Set the 1st register to the sum of both.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0x03);

      // NOT borrow flag is set since Vx was equal to Vy.
      expect(interpreter.register_vf).toEqual(1);
    });

    it('clears the NOT borrow flag when Vx is less than Vy', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x03 into V1
        0x61, 0x03,
        // Load 0x05 into V2
        0x62, 0x05,
        // Compute V1 - V2 and store in V1
        0x81, 0x25,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0);

      // Load into 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0x05);

      // Set the 1st register to the sum of both.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0xFF - 1);
      expect(interpreter.register_v2).toEqual(0x05);

      // Not borrow flag is cleared since Vx was < Vy.
      expect(interpreter.register_vf).toEqual(0);
    });
  });

  describe('8xy6 - SHR Vx', () => {
    it('stores the least significant bit of Vx in Vf and shifts Vx to right', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0xAB (which has a least significant bit of 1) into VD.
        0x6D, 0xAB,
        // Load 0xAA (which has a least significant bit of 0) into V4.
        0x64, 0xAA,
        // Right shift VD.
        0x8D, 0x06,
        // Right shift V4.
        0x84, 0x06,
      ]);

      expect(interpreter.register_vd).toEqual(0);
      expect(interpreter.register_v4).toEqual(0);
      expect(interpreter.register_vf).toEqual(0);

      // Load into the 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_vd).toEqual(0xAB);
      expect(interpreter.register_v4).toEqual(0);
      expect(interpreter.register_vf).toEqual(0);

      // Load into the 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_vd).toEqual(0xAB);
      expect(interpreter.register_v4).toEqual(0xAA);
      expect(interpreter.register_vf).toEqual(0);

      // Right shift the 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_vd).toEqual(0x55); // 0xAB >> 1
      expect(interpreter.register_v4).toEqual(0xAA);
      expect(interpreter.register_vf).toEqual(1);    // 0xAB ends with 1

      // Right shift the 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_vd).toEqual(0x55);
      expect(interpreter.register_v4).toEqual(0x55); // 0xAA >> 1
      expect(interpreter.register_vf).toEqual(0);    // 0xAA ends with 0
    });
  });

  describe('8xy7 - SUBN Vx, Vy', () => {
    it('sets register Vx to Vy - Vx', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x03 into V1.
        0x61, 0x03,
        // Load 0x05 into V2.
        0x62, 0x05,
        // Subtract V2 from V1.
        0x81, 0x27,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);
      expect(interpreter.register_vf).toEqual(0);

      // Load into the 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0);
      expect(interpreter.register_vf).toEqual(0);

      // Load into the 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0x05);
      expect(interpreter.register_vf).toEqual(0);

      // Set V1 to V2 - V1
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x02);
      expect(interpreter.register_v2).toEqual(0x05);
      expect(interpreter.register_vf).toEqual(1); // Not borrow flag
    });
  });

  describe('8xyE - SHL Vx', () => {
    it('stores the least significant bit of Vx in Vf and shifts Vx to left', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x03 (which has a least significant bit of 1) into V1.
        0x61, 0x03,
        // Load 0x04 (which has a least significant bit of 0) into V2.
        0x62, 0x04,
        // Load 0xDB into V3.
        0x63, 0xDB,
        // Left shift V1.
        0x81, 0x0E,
        // Left shift V2.
        0x82, 0x0E,
        // Left shift v3.
        0x83, 0x0E,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);
      expect(interpreter.register_v3).toEqual(0);
      expect(interpreter.register_vf).toEqual(0);

      // Load into the 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0);
      expect(interpreter.register_v3).toEqual(0);
      expect(interpreter.register_vf).toEqual(0);

      // Load into the 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0x04);
      expect(interpreter.register_v3).toEqual(0);
      expect(interpreter.register_vf).toEqual(0);

      // Load into the 3rd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x03);
      expect(interpreter.register_v2).toEqual(0x04);
      expect(interpreter.register_v3).toEqual(0xDB);
      expect(interpreter.register_vf).toEqual(0);

      // Right shift the 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x06); // 0x03 << 1
      expect(interpreter.register_v2).toEqual(0x04);
      expect(interpreter.register_v3).toEqual(0xDB);
      expect(interpreter.register_vf).toEqual(1);    // 0x03 ends with 1

      // Right shift the 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x06);
      expect(interpreter.register_v2).toEqual(0x08); // 0x04 << 1
      expect(interpreter.register_v3).toEqual(0xDB);
      expect(interpreter.register_vf).toEqual(0);    // 0x04 ends with 0

      // Right shift the 3rd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x06);
      expect(interpreter.register_v2).toEqual(0x08);
      expect(interpreter.register_v3).toEqual(0xB6); // First 8 bits of 0xDB << 1
      expect(interpreter.register_vf).toEqual(1);    // 0xDB ends with 1
    });
  });

  describe('9xy0 - SNE Vx, Vy', () => {
    it('skips the next instruction if Vx != Vy', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x01 into V1.
        0x61, 0x01,
        // Load 0x01 into V2.
        0x62, 0x01,
        // Load 0x02 into V3.
        0x63, 0x02,
        // Skip the next instruction if V1 does not equal V2.
        0x91, 0x20,
        // Skip the next instruction if V1 does not equal V3.
        0x91, 0x30,
      ]);

      expect(interpreter.register_v1).toEqual(0);
      expect(interpreter.register_v2).toEqual(0);
      expect(interpreter.register_v3).toEqual(0);
      expect(interpreter.program_counter).toEqual(0x200);

      // Load into the 1st register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x01);
      expect(interpreter.register_v2).toEqual(0);
      expect(interpreter.register_v3).toEqual(0);
      expect(interpreter.program_counter).toEqual(0x202);

      // Load into the 2nd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x01);
      expect(interpreter.register_v2).toEqual(0x01);
      expect(interpreter.register_v3).toEqual(0);
      expect(interpreter.program_counter).toEqual(0x204);

      // Load into the 3rd register.
      Interpreter.tick(interpreter);
      expect(interpreter.register_v1).toEqual(0x01);
      expect(interpreter.register_v2).toEqual(0x01);
      expect(interpreter.register_v3).toEqual(0x02);
      expect(interpreter.program_counter).toEqual(0x206);

      // V1 equals v2, so no instructions should be skipped. We no none were skipped because the
      // program counter is incremented by 2.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x208);

      // V1 does not equal v3, so an instruction should be skipped. We know one was skipped because
      // the program counter is incremented by 4.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x20C);
    });
  });

  describe('Annn - LD I, nnn', () => {
    it('sets register I to the value nnn (usually a 12-bit memory address)', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x246 into register I.
        0xA2, 0x46,
      ]);

      expect(interpreter.register_i).toEqual(0);

      Interpreter.tick(interpreter);
      expect(interpreter.register_i).toEqual(0x246);
    });
  });

  describe('Bnnn - JP V0, nnnn', () => {
    it('sets register I to the value nnn + V0', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Load 0x07 into register V0.
        0x60, 0x07,
        // Jump to 0x510 + V0.
        0xB5, 0x10,
      ]);

      expect(interpreter.program_counter).toEqual(0x200);

      // Load value into the register.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x202);

      // Jump.
      Interpreter.tick(interpreter);
      expect(interpreter.program_counter).toEqual(0x517);
    });
  });

  describe('Cxkk - RND Vx, kk', () => {
    it('generates a random number, ANDs it with the byte kk, and stores it in register Vx', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Store in V9 a random number AND 0x15.
        0xC9, 0x15,
      ]);

      expect(interpreter.register_v9).toEqual(0);

      Interpreter.tick(interpreter);
      expect(interpreter.register_v9).toEqual(expect.any(Number));
    });
  });
});
