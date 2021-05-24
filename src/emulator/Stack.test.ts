import Stack from './Stack';

test('popping an empty stack', () => {
  const stack = new Stack();
  expect(stack.pop()).toEqual(0);
  expect(stack.pop()).toEqual(0);
});

test('pushing and popping', () => {
  const stack = new Stack ();
  stack.push(0x1);
  stack.push(0x666);
  stack.push(0x12BC);
  expect(stack.pop()).toEqual(0x12BC);
  expect(stack.pop()).toEqual(0x666);
  expect(stack.pop()).toEqual(0x1);
});
