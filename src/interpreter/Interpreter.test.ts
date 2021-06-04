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

    it('does not skip any instructions when Vx -== kk', () => {
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
});
