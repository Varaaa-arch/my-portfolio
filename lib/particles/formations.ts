export type RandomFn = () => number;

export function createRandom(seed: number): RandomFn {
  let value = seed;

  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createScatter(count: number, random: RandomFn) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radius = 1.15 + random() * 1.4;

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[i * 3 + 1] = Math.cos(phi) * radius * 0.8;
    positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius * 0.55;
  }

  return positions;
}

export function createGlobe(count: number, random: RandomFn) {
  const positions = new Float32Array(count * 3);
  const sphereCount = Math.floor(count * 0.76);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < sphereCount; i += 1) {
    const y = 1 - (i / Math.max(sphereCount - 1, 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const radius = 0.82 + (random() - 0.5) * 0.025;

    positions[i * 3] = Math.cos(theta) * ringRadius * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * ringRadius * radius;
  }

  for (let i = sphereCount; i < count; i += 1) {
    const ring = i % 3;
    const angle = random() * Math.PI * 2;
    const radius = 0.98 + random() * 0.08;
    const cos = Math.cos(angle) * radius;
    const sin = Math.sin(angle) * radius;

    if (ring === 0) {
      positions[i * 3] = cos;
      positions[i * 3 + 1] = (random() - 0.5) * 0.05;
      positions[i * 3 + 2] = sin;
    } else if (ring === 1) {
      positions[i * 3] = cos;
      positions[i * 3 + 1] = sin;
      positions[i * 3 + 2] = (random() - 0.5) * 0.08;
    } else {
      positions[i * 3] = cos;
      positions[i * 3 + 1] = sin * 0.3;
      positions[i * 3 + 2] = sin * 0.95;
    }
  }

  return positions;
}

export function createWave(count: number, random: RandomFn) {
  const positions = new Float32Array(count * 3);
  const bands = 9;

  for (let i = 0; i < count; i += 1) {
    const band = i % bands;
    const x = (random() * 2 - 1) * 1.95;
    const base = (band / (bands - 1) - 0.5) * 0.62;
    const y =
      base +
      Math.sin(x * 2.4 + band * 0.9) * 0.075 +
      (random() - 0.5) * 0.014;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = (random() - 0.5) * 0.12;
  }

  return positions;
}

export function createPhases(count: number, random: RandomFn) {
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    phases[i] = random();
  }

  return phases;
}
