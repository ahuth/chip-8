import Memory from './Memory';

test('setting and reading a single byte', () => {
  const memory = new Memory();
  expect(memory.read1(0x666)).toEqual(0);

  memory.write1(0x666, 0xAA);
  expect(memory.read1(0x666)).toEqual(0xAA);
});

test('setting and reading two bytes', () => {
  const memory = new Memory();
  expect(memory.read2(0x666)).toEqual(0);

  memory.write2(0x666, 0xAFFA);
  expect(memory.read2(0x666)).toEqual(0xAFFA);
});

test('bulk loading data', () => {
  const memory = new Memory();
  expect(memory.read2(0x200)).toEqual(0);
  expect(memory.read2(0x202)).toEqual(0);

  memory.load([0x12, 0x34, 0x56, 0x78]);
  expect(memory.read2(0x200)).toEqual(0x1234);
  expect(memory.read2(0x202)).toEqual(0x5678);
});
