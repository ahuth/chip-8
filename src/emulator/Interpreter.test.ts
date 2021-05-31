import * as Register from './Register';
import Interpreter from './Interpreter';

test('JP', () => {
  const interpreter = new Interpreter();
  interpreter.load([
    // Jump to address 666.
    0x16, 0x66,
  ]);

  expect(Register.get(interpreter.program_counter)).toEqual(0x200);
  interpreter.tick();
  expect(Register.get(interpreter.program_counter)).toEqual(0x666);
});
