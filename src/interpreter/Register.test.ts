import * as Register from './Register';

test('setting a value', () => {
  const register = Register.create(8);
  expect(Register.get(register)).toEqual(0);

  Register.set(register, 0xAA);
  expect(Register.get(register)).toEqual(0xAA);
});

test('setting a value greater than the register size', () => {
  const register = Register.create(8);
  expect(Register.get(register)).toEqual(0);

  Register.set(register, 0x101);
  expect(Register.get(register)).toEqual(1);
});
