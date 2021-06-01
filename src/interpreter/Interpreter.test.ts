import * as Register from './Register';
import * as Interpreter from './Interpreter';

describe('instructions', () => {
  describe('00EE - RET', () => {
    it('return from a subroutine', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Call subroutine at address 0x204. Should return to here when it's done. Address 0x200.
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
      expect(Register.get(interpreter.program_counter)).toEqual(0x200);
      expect(interpreter.stack).toEqual([]);

      // Execute the subroutine call. Should jump to 0x206.
      Interpreter.tick(interpreter);
      expect(Register.get(interpreter.program_counter)).toEqual(0x206);
      expect(interpreter.stack).toEqual([0x200]);

      // Execute the subroutine's CLS.
      Interpreter.tick(interpreter);
      expect(Register.get(interpreter.program_counter)).toEqual(0x208);
      expect(interpreter.stack).toEqual([0x200]);

      // Execute the subroutine return. Should go back to where we left off - 0x202
      Interpreter.tick(interpreter);
      expect(Register.get(interpreter.program_counter)).toEqual(0x202);
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

      expect(Register.get(interpreter.program_counter)).toEqual(0x200);
      Interpreter.tick(interpreter);
      expect(Register.get(interpreter.program_counter)).toEqual(0x666);
    });
  });

  describe('2nnn - CALL', () => {
    it('calls subroutine at address nnn', () => {
      const interpreter = Interpreter.create();
      Interpreter.load(interpreter, [
        // Call subroutine at address 345.
        0x23, 0x45,
      ]);

      expect(Register.get(interpreter.program_counter)).toEqual(0x200);
      expect(interpreter.stack).toEqual([]);

      Interpreter.tick(interpreter);

      expect(Register.get(interpreter.program_counter)).toEqual(0x345);
      expect(interpreter.stack).toEqual([0x200]);
    });
  });
});
