import * as Memory from './Memory';

test('setting and reading a single byte', () => {
  const memory = Memory.create();
  expect(Memory.read1(memory, 0x666)).toEqual(0);

  Memory.write1(memory, 0x666, 0xAA);
  expect(Memory.read1(memory, 0x666)).toEqual(0xAA);
});

test('setting and reading two bytes', () => {
  const memory = Memory.create();
  expect(Memory.read2(memory, 0x666)).toEqual(0);

  Memory.write2(memory, 0x666, 0xAFFA);
  expect(Memory.read2(memory, 0x666)).toEqual(0xAFFA);
});

test('bulk loading data', () => {
  const memory = Memory.create();
  expect(Memory.read2(memory, 0x200)).toEqual(0);
  expect(Memory.read2(memory, 0x202)).toEqual(0);

  Memory.load(memory, [0x12, 0x34, 0x56, 0x78]);
  expect(Memory.read2(memory, 0x200)).toEqual(0x1234);
  expect(Memory.read2(memory, 0x202)).toEqual(0x5678);
});
