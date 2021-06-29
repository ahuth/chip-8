import * as Display from './Display';

test('drawing a sprite', () => {
  const display = Display.create();
  const didErase = Display.set(display, 1, 2, [
    0b1100_0101,
    0b0110_1111,
  ]);

  expect(didErase).toEqual(false);

  // 1st byte
  expect(Display.get(display, 1, 2)).toEqual(1);
  expect(Display.get(display, 2, 2)).toEqual(1);
  expect(Display.get(display, 3, 2)).toEqual(0);
  expect(Display.get(display, 4, 2)).toEqual(0);
  expect(Display.get(display, 5, 2)).toEqual(0);
  expect(Display.get(display, 6, 2)).toEqual(1);
  expect(Display.get(display, 7, 2)).toEqual(0);
  expect(Display.get(display, 8, 2)).toEqual(1);

  // 2nd byte
  expect(Display.get(display, 1, 3)).toEqual(0);
  expect(Display.get(display, 2, 3)).toEqual(1);
  expect(Display.get(display, 3, 3)).toEqual(1);
  expect(Display.get(display, 4, 3)).toEqual(0);
  expect(Display.get(display, 5, 3)).toEqual(1);
  expect(Display.get(display, 6, 3)).toEqual(1);
  expect(Display.get(display, 7, 3)).toEqual(1);
  expect(Display.get(display, 8, 3)).toEqual(1);
});

test('wrapping', () => {
  const display = Display.create();
  const didErase = Display.set(display, 58, 31, [
    0b1111_1111,
    0b1111_1111,
  ]);

  expect(didErase).toEqual(false);

  // 1st byte
  expect(Display.get(display, 58, 31)).toEqual(1);
  expect(Display.get(display, 59, 31)).toEqual(1);
  expect(Display.get(display, 60, 31)).toEqual(1);
  expect(Display.get(display, 61, 31)).toEqual(1);
  expect(Display.get(display, 62, 31)).toEqual(1);
  expect(Display.get(display, 63, 31)).toEqual(1);
  expect(Display.get(display, 0, 31)).toEqual(1);
  expect(Display.get(display, 1, 31)).toEqual(1);

  // 2nd byte
  expect(Display.get(display, 58, 0)).toEqual(1);
  expect(Display.get(display, 59, 0)).toEqual(1);
  expect(Display.get(display, 60, 0)).toEqual(1);
  expect(Display.get(display, 61, 0)).toEqual(1);
  expect(Display.get(display, 62, 0)).toEqual(1);
  expect(Display.get(display, 63, 0)).toEqual(1);
  expect(Display.get(display, 0, 0)).toEqual(1);
  expect(Display.get(display, 1, 0)).toEqual(1);
});

test('erasing pixels', () => {
  const display = Display.create();

  const didErase1 = Display.set(display, 0, 0, [
    0b0000_1100,
  ]);

  expect(didErase1).toEqual(false);

  expect(Display.get(display, 0, 0)).toEqual(0);
  expect(Display.get(display, 1, 0)).toEqual(0);
  expect(Display.get(display, 2, 0)).toEqual(0);
  expect(Display.get(display, 3, 0)).toEqual(0);
  expect(Display.get(display, 4, 0)).toEqual(1);
  expect(Display.get(display, 5, 0)).toEqual(1);
  expect(Display.get(display, 6, 0)).toEqual(0);
  expect(Display.get(display, 7, 0)).toEqual(0);

  const didErase2 = Display.set(display, 0, 0, [
    0b0000_0110,
  ]);

  expect(didErase2).toEqual(true);

  expect(Display.get(display, 0, 0)).toEqual(0);
  expect(Display.get(display, 1, 0)).toEqual(0);
  expect(Display.get(display, 2, 0)).toEqual(0);
  expect(Display.get(display, 3, 0)).toEqual(0);
  expect(Display.get(display, 4, 0)).toEqual(0);
  expect(Display.get(display, 5, 0)).toEqual(1);
  expect(Display.get(display, 6, 0)).toEqual(1);
  expect(Display.get(display, 7, 0)).toEqual(0);
});
