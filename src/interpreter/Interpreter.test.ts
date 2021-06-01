import * as Interpreter from './Interpreter';

describe('instructions', () => {
  describe('00EE - RET', () => {
    it('return from a subroutine', () => {
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

  describe('1nnn - JP', () => {
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

  describe('2nnn - CALL', () => {
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

  describe('6xkk - LD', () => {
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
});
