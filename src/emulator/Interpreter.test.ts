import Interpreter from './Interpreter';

test('interpreting', () => {
  const interpreter = new Interpreter();
  const gen = interpreter.interpret([
    // Clear screen.
    0x00, 0xE0,
    // Put 0xAB into register V1.
    0x61, 0xAB,
  ]);
  expect(gen.next().value).toEqual(0x00E0);
  expect(gen.next().value).toEqual(0x61AB);
});
