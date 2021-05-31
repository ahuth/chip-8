import * as Register from './Register';
import * as Interpreter from './Interpreter';

describe('instructions', () => {
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
