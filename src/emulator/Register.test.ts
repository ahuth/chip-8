import Register from './Register';

test('incrementing by 1', () => {
  const register = new Register(8);
  expect(register.get()).toEqual(0);

  register.increment();
  expect(register.get()).toEqual(1);
});

test('incrementing by 2', () => {
  const register = new Register(8);
  expect(register.get()).toEqual(0);

  register.increment(2);
  expect(register.get()).toEqual(2);
});

test('incrementing past the register size', () => {
  const register = new Register(8);
  expect(register.get()).toEqual(0);

  register.set(0xFF);
  register.increment();
  expect(register.get()).toEqual(0);
});

test('decrementing', () => {
  const register = new Register(8);
  expect(register.get()).toEqual(0);

  register.increment();
  expect(register.get()).toEqual(1);

  register.decrement();
  expect(register.get()).toEqual(0);
});

test('setting a value', () => {
  const register = new Register(8);
  expect(register.get()).toEqual(0);

  register.set(0xAA);
  expect(register.get()).toEqual(0xAA);
});

test('setting a value greater than the register size', () => {
  const register = new Register(8);
  expect(register.get()).toEqual(0);
  expect(() => register.set(0xFFF)).toThrow('Value too large for 8-bit register');
});
