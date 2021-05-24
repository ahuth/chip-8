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

test('pushing more than 16 values', () => {
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  stack.push(4);
  stack.push(5);
  stack.push(6);
  stack.push(7);
  stack.push(8);
  stack.push(9);
  stack.push(10);
  stack.push(11);
  stack.push(12);
  stack.push(13);
  stack.push(14);
  stack.push(15);
  stack.push(16);
  stack.push(17);
  stack.push(18);
  expect(stack.pop()).toEqual(18);
  expect(stack.pop()).toEqual(15);
});
