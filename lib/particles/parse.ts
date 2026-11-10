export interface ParticleData {
  count: number;
  positions: Float32Array;
  luma: Float32Array;
}

const MAGIC = "PXT1";
const VERSION = 1;

export function parseParticleBin(buffer: ArrayBuffer): ParticleData {
  const view = new DataView(buffer);

  const magic = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3)
  );

  if (magic !== MAGIC) {
    throw new Error(`Format partikel tidak dikenali: ${magic}`);
  }

  const count = view.getUint32(4, true);
  const version = view.getUint32(8, true);

  if (version !== VERSION) {
    throw new Error(`Versi partikel tidak didukung: ${version}`);
  }

  const expected = 12 + count * 8;

  if (buffer.byteLength < expected) {
    throw new Error("File partikel terpotong");
  }

  const positions = new Float32Array(count * 3);
  const luma = new Float32Array(count);

  let offset = 12;

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = view.getInt16(offset, true) / 32767;
    positions[i * 3 + 1] = view.getInt16(offset + 2, true) / 32767;
    positions[i * 3 + 2] = view.getInt16(offset + 4, true) / 32767;
    luma[i] = view.getUint16(offset + 6, true) / 65535;
    offset += 8;
  }

  return { count, positions, luma };
}
