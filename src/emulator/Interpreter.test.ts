import Interpreter from './Interpreter';

test('interpreting', () => {
  const interpreter = new Interpreter();
  interpreter.load([
    // Clear screen.
    0x00, 0xE0,
    // Put 0xAB into register V1.
    0x61, 0xAB,
  ]);
  expect(interpreter.tick()).toEqual(true);
  expect(interpreter.tick()).toEqual(true);
});
