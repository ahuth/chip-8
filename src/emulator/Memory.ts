/**
 * Memory (4KB)
 *
 * - 0x000 to 0x1FF is reserved for the interpreter.
 * - 0x200 is where most Chip-8 programs start.
 * - 0x600 is where ETI 660 Chip-8 programs start.
 * - 0xFFF is the end of RAM.
 */
export type Memory = Uint8Array;

/**
 * Create a new memory bank.
 */
export function create(): Memory {
  return new Uint8Array(0xFFF);
}

/**
 * Read 1 byte from memory.
 * @param address 12-bit memory address from 0x200 to 0xFFF.
 * @returns 1 byte
 */
export function read1(memory: Memory, address: number): number {
  return memory[address];
}

/**
 * Read 2 bytes from memory.
 * @param address 12-bit memory address from 0x200 to 0xFFF.
 * @returns 2 bytes
 */
export function read2(memory: Memory, address: number): number {
  // Chip-8 is "big endian", so the most significant byte is first.
  const hi = read1(memory, address);
  const lo = read1(memory, address + 1);
  // Combine the most and least significant bytes into a single 2-byte number.
  return (hi << 8) | lo;
}

/**
 * Write 1 byte to memory.
 * @param address 12-bit memory address from 0x200 to 0xFFF.
 * @param data 1 byte of data.
 */
export function write1(memory: Memory, address: number, data: number): void {
  memory[address] = data;
}

/**
 * Write 2 bytes of memory.
 * @param address 12-bit memory address from 0x200 to 0xFFF.
 * @param data 2 bytes of data.
 */
export function write2(memory: Memory, address: number, data: number): void {
  // Split apart the data into hi and low bytes.
  const hi = data >> 8;
  const lo = data & 0xFF;
  write1(memory, address, hi);
  write1(memory, address + 1, lo);
}

/**
 * Load data into memory. Normally the loaded data will start at 0x200, because 0-0x1FF is
 * reserved for the interpreter.
 */
export function load(memory: Memory, data: number[], start = 0x200): void {
  memory.set(data, start);
}
