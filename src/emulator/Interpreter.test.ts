import Interpreter from './Interpreter';

test('interpreting', () => {
  const interpreter = new Interpreter();
  interpreter.interpret([
    // Clear screen.
    0x00, 0xE0,
    // Put 0xAB into register V1.
    0x61, 0xAB,
  ]);
});
