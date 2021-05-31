import * as Register from './Register';
import * as Interpreter from './Interpreter';

describe('instructions', () => {
  test('JP', () => {
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
