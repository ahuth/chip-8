import Display from './Display';

test('drawing a sprite', () => {
  const display = new Display();
  const didErase = display.draw(1, 2, [
    0b1100_0101,
    0b0110_1111,
  ]);

  expect(didErase).toEqual(false);

  // 1st byte
  expect(display.get(1, 2)).toEqual(1);
  expect(display.get(2, 2)).toEqual(1);
  expect(display.get(3, 2)).toEqual(0);
  expect(display.get(4, 2)).toEqual(0);
  expect(display.get(5, 2)).toEqual(0);
  expect(display.get(6, 2)).toEqual(1);
  expect(display.get(7, 2)).toEqual(0);
  expect(display.get(8, 2)).toEqual(1);

  // 2nd byte
  expect(display.get(1, 3)).toEqual(0);
  expect(display.get(2, 3)).toEqual(1);
  expect(display.get(3, 3)).toEqual(1);
  expect(display.get(4, 3)).toEqual(0);
  expect(display.get(5, 3)).toEqual(1);
  expect(display.get(6, 3)).toEqual(1);
  expect(display.get(7, 3)).toEqual(1);
  expect(display.get(8, 3)).toEqual(1);
});

test('wrapping', () => {
  const display = new Display();
  const didErase = display.draw(58, 31, [
    0b1111_1111,
    0b1111_1111,
  ]);

  expect(didErase).toEqual(false);

  // 1st byte
  expect(display.get(58, 31)).toEqual(1);
  expect(display.get(59, 31)).toEqual(1);
  expect(display.get(60, 31)).toEqual(1);
  expect(display.get(61, 31)).toEqual(1);
  expect(display.get(62, 31)).toEqual(1);
  expect(display.get(63, 31)).toEqual(1);
  expect(display.get(0, 31)).toEqual(1);
  expect(display.get(1, 31)).toEqual(1);

  // 2nd byte
  expect(display.get(58, 0)).toEqual(1);
  expect(display.get(59, 0)).toEqual(1);
  expect(display.get(60, 0)).toEqual(1);
  expect(display.get(61, 0)).toEqual(1);
  expect(display.get(62, 0)).toEqual(1);
  expect(display.get(63, 0)).toEqual(1);
  expect(display.get(0, 0)).toEqual(1);
  expect(display.get(1, 0)).toEqual(1);
});

test('erasing pixels', () => {
  const display = new Display();

  const didErase1 = display.draw(0, 0, [
    0b0000_1100,
  ]);

  expect(didErase1).toEqual(false);

  expect(display.get(0, 0)).toEqual(0);
  expect(display.get(1, 0)).toEqual(0);
  expect(display.get(2, 0)).toEqual(0);
  expect(display.get(3, 0)).toEqual(0);
  expect(display.get(4, 0)).toEqual(1);
  expect(display.get(5, 0)).toEqual(1);
  expect(display.get(6, 0)).toEqual(0);
  expect(display.get(7, 0)).toEqual(0);

  const didErase2 = display.draw(0, 0, [
    0b0000_0110,
  ]);

  expect(didErase2).toEqual(true);

  expect(display.get(0, 0)).toEqual(0);
  expect(display.get(1, 0)).toEqual(0);
  expect(display.get(2, 0)).toEqual(0);
  expect(display.get(3, 0)).toEqual(0);
  expect(display.get(4, 0)).toEqual(1);
  expect(display.get(5, 0)).toEqual(0); // 0, not 1, because bits are set via XOR. This is also the bit that is erased.
  expect(display.get(6, 0)).toEqual(1);
  expect(display.get(7, 0)).toEqual(0);
});
