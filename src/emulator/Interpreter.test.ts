import Interpreter from './Interpreter';

test('JP', () => {
  const interpreter = new Interpreter();
  interpreter.load([
    // Jump to address 666.
    0x16, 0x66,
  ]);

  expect(interpreter.program_counter.get()).toEqual(0x200);
  interpreter.tick();
  expect(interpreter.program_counter.get()).toEqual(0x666);
});
