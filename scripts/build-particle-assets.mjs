import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "particles");
const PREVIEW_DIR = path.join(ROOT, "assets", ".preview");
const PORTRAIT_SOURCE = path.join(ROOT, "assets", "portrait-source.png");
const INDONESIA_SOURCE = path.join(ROOT, "assets", "indonesia.geojson");

const COUNT = Number(process.env.PARTICLE_COUNT ?? 44000);
const MAGIC = "PXT1";
const VERSION = 1;

const clamp = (value, min = -1, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (edge0, edge1, value) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashNoise(index) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function boxBlur(values, width, height, radius) {
  const horizontal = new Float32Array(width * height);
  const output = new Float32Array(width * height);
  const windowSize = radius * 2 + 1;

  for (let y = 0; y < height; y += 1) {
    const row = y * width;
    let sum = 0;

    for (let x = -radius; x <= radius; x += 1) {
      sum += values[row + Math.min(width - 1, Math.max(0, x))];
    }

    for (let x = 0; x < width; x += 1) {
      horizontal[row + x] = sum / windowSize;

      const removeX = Math.min(width - 1, Math.max(0, x - radius));
      const addX = Math.min(width - 1, Math.max(0, x + radius + 1));

      sum += values[row + addX] - values[row + removeX];
    }
  }

  for (let x = 0; x < width; x += 1) {
    let sum = 0;

    for (let y = -radius; y <= radius; y += 1) {
      sum += horizontal[Math.min(height - 1, Math.max(0, y)) * width + x];
    }

    for (let y = 0; y < height; y += 1) {
      output[y * width + x] = sum / windowSize;

      const removeY = Math.min(height - 1, Math.max(0, y - radius));
      const addY = Math.min(height - 1, Math.max(0, y + radius + 1));

      sum +=
        horizontal[addY * width + x] - horizontal[removeY * width + x];
    }
  }

  return output;
}

function distanceToEdge(mask, width, height) {
  const distances = new Float32Array(width * height);
  const maxDistance = width + height;

  for (let i = 0; i < mask.length; i += 1) {
    distances[i] = mask[i] ? maxDistance : 0;
  }

  for (let y = 1; y < height; y += 1) {
    for (let x = 1; x < width; x += 1) {
      const index = y * width + x;

      if (distances[index] === 0) {
        continue;
      }

      let value = Math.min(
        distances[index],
        distances[index - 1] + 1,
        distances[index - width] + 1,
        distances[index - width - 1] + Math.SQRT2
      );

      if (x < width - 1) {
        value = Math.min(
          value,
          distances[index - width + 1] + Math.SQRT2
        );
      }

      distances[index] = value;
    }
  }

  for (let y = height - 2; y >= 0; y -= 1) {
    for (let x = width - 2; x >= 0; x -= 1) {
      const index = y * width + x;

      if (distances[index] === 0) {
        continue;
      }

      let value = Math.min(
        distances[index],
        distances[index + 1] + 1,
        distances[index + width] + 1,
        distances[index + width + 1] + Math.SQRT2
      );

      if (x > 0) {
        value = Math.min(
          value,
          distances[index + width - 1] + Math.SQRT2
        );
      }

      distances[index] = value;
    }
  }

  return distances;
}

function measureMask(mask, width, height) {
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) {
        continue;
      }

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  return { minX, maxX, minY, maxY };
}

function encodeParticles(positions, luma) {
  const count = luma.length;
  const buffer = Buffer.alloc(12 + count * 8);

  buffer.write(MAGIC, 0, "ascii");
  buffer.writeUInt32LE(count, 4);
  buffer.writeUInt32LE(VERSION, 8);

  let offset = 12;

  for (let i = 0; i < count; i += 1) {
    buffer.writeInt16LE(
      Math.round(clamp(positions[i * 3]) * 32767),
      offset
    );
    buffer.writeInt16LE(
      Math.round(clamp(positions[i * 3 + 1]) * 32767),
      offset + 2
    );
    buffer.writeInt16LE(
      Math.round(clamp(positions[i * 3 + 2]) * 32767),
      offset + 4
    );
    buffer.writeUInt16LE(
      Math.round(clamp(luma[i], 0, 1) * 65535),
      offset + 6
    );
    offset += 8;
  }

  return buffer;
}

async function writePreview(name, positions, luma, aspect) {
  const width = 720;
  const height = Math.round(width / aspect);
  const pixels = new Uint8Array(width * height * 4);

  for (let i = 0; i < width * height; i += 1) {
    pixels[i * 4] = 34;
    pixels[i * 4 + 1] = 33;
    pixels[i * 4 + 2] = 36;
    pixels[i * 4 + 3] = 255;
  }

  const radius = 1;
  const plot = (x, y, value) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return;
    }

    const index = (y * width + x) * 4;
    pixels[index] = Math.min(255, pixels[index] + value);
    pixels[index + 1] = Math.min(255, pixels[index + 1] + value);
    pixels[index + 2] = Math.min(255, pixels[index + 2] + value);
  };

  for (let i = 0; i < luma.length; i += 1) {
    const x = Math.round(((positions[i * 3] + 1) / 2) * (width - 1));
    const y = Math.round((1 - (positions[i * 3 + 1] + 1) / 2) * (height - 1));
    const value = Math.round(70 + luma[i] * 170);

    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const falloff = dx === 0 && dy === 0 ? 1 : 0.35;
        plot(x + dx, y + dy, Math.round(value * falloff));
      }
    }
  }

  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  const output = path.join(PREVIEW_DIR, `${name}.png`);
  await sharp(Buffer.from(pixels), {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toFile(output);

  console.log(`preview -> assets/.preview/${name}.png`);
}

function sampleMask(
  mask,
  width,
  height,
  random,
  count,
  getLuma = null,
  getDepth = null
) {
  const candidates = [];

  for (let i = 0; i < mask.length; i += 1) {
    if (mask[i]) {
      candidates.push(i);
    }
  }

  if (candidates.length === 0) {
    throw new Error("Mask kosong: tidak ada piksel subjek");
  }

  const positions = new Float32Array(count * 3);
  const luma = new Float32Array(count);

  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (const index of candidates) {
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const centerX = (minX + maxX + 1) / 2;
  const centerY = (minY + maxY + 1) / 2;
  const spanY = Math.max(maxY - minY + 1, 1);
  const scale = 2 / spanY;

  for (let i = 0; i < count; i += 1) {
    const index =
      candidates[Math.floor(random() * candidates.length)] ?? candidates[0];
    const x = index % width;
    const y = Math.floor(index / width);

    positions[i * 3] = (x + random() - centerX) * scale;
    positions[i * 3 + 1] = (centerY - (y + random())) * scale;
    positions[i * 3 + 2] = getDepth
      ? getDepth(index)
      : (random() - 0.5) * 0.05;
    luma[i] = getLuma ? getLuma(index) : 0;
  }

  return {
    positions,
    luma,
    bounds: { minX, maxX, minY, maxY },
    width: (maxX - minX + 1) * scale,
    height: spanY * scale,
  };
}

async function buildPortrait() {
  const image = sharp(PORTRAIT_SOURCE).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Tidak bisa membaca dimensi portrait");
  }

  const sampleHeight = 1000;
  const sampleWidth = Math.max(
    1,
    Math.round((metadata.width / metadata.height) * sampleHeight)
  );

  const { data, info } = await image
    .resize(sampleWidth, sampleHeight, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const mask = new Uint8Array(width * height);
  let transparentPixels = 0;

  for (let i = 0; i < width * height; i += 1) {
    if (data[i * 4 + 3] < 245) {
      transparentPixels += 1;
    }
  }

  const useAlpha = transparentPixels > width * height * 0.05;

  if (useAlpha) {
    for (let i = 0; i < width * height; i += 1) {
      mask[i] = data[i * 4 + 3] > 96 ? 1 : 0;
    }
    console.log(
      `alpha mask: ${transparentPixels} piksel transparan terdeteksi`
    );
  } else {
    const nearWhite = (i) =>
      data[i * 4] > 232 &&
      data[i * 4 + 1] > 232 &&
      data[i * 4 + 2] > 232;

    const background = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let head = 0;
    let tail = 0;

    const enqueue = (x, y) => {
      const index = y * width + x;

      if (!background[index] && nearWhite(index)) {
        background[index] = 1;
        queue[tail] = index;
        tail += 1;
      }
    };

    for (let x = 0; x < width; x += 1) {
      enqueue(x, 0);
      enqueue(x, height - 1);
    }

    for (let y = 0; y < height; y += 1) {
      enqueue(0, y);
      enqueue(width - 1, y);
    }

    while (head < tail) {
      const index = queue[head];
      head += 1;
      const x = index % width;
      const y = Math.floor(index / width);

      if (x > 0) enqueue(x - 1, y);
      if (x < width - 1) enqueue(x + 1, y);
      if (y > 0) enqueue(x, y - 1);
      if (y < height - 1) enqueue(x, y + 1);
    }

    for (let i = 0; i < width * height; i += 1) {
      mask[i] = background[i] ? 0 : 1;
    }

    const halo = new Uint8Array(width * height);

    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const index = y * width + x;

        if (!mask[index]) {
          continue;
        }

        const luminance =
          (data[index * 4] * 0.2126 +
            data[index * 4 + 1] * 0.7152 +
            data[index * 4 + 2] * 0.0722) /
          255;

        if (
          luminance > 0.88 &&
          (!mask[index - 1] ||
            !mask[index + 1] ||
            !mask[index - width] ||
            !mask[index + width])
        ) {
          halo[index] = 1;
        }
      }
    }

    for (let i = 0; i < halo.length; i += 1) {
      if (halo[i]) {
        mask[i] = 0;
      }
    }

    console.log("white background flood-fill mask aktif");
  }
  const luminance = new Float32Array(width * height);

  for (let i = 0; i < width * height; i += 1) {
    luminance[i] =
      (data[i * 4] * 0.2126 +
        data[i * 4 + 1] * 0.7152 +
        data[i * 4 + 2] * 0.0722) /
      255;
  }

  const frame = measureMask(mask, width, height);
  const spanY = Math.max(frame.maxY - frame.minY + 1, 1);
  const formBlur = boxBlur(
    luminance,
    width,
    height,
    Math.max(10, Math.round(sampleHeight * 0.024))
  );
  const edgeDistance = distanceToEdge(mask, width, height);
  const rimWidth = Math.max(5, Math.round(sampleHeight * 0.01));
  const depthRadius = Math.max(48, Math.round(sampleHeight * 0.095));
  const edgeMargin = Math.max(8, Math.round(sampleHeight * 0.02));
  const lumaMap = new Float32Array(width * height);
  const depthMap = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    const normalizedY = (y - frame.minY) / spanY;

    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;

      if (!mask[index]) {
        continue;
      }

      const broad = formBlur[index];
      const rim = Math.pow(
        clamp(1 - edgeDistance[index] / rimWidth, 0, 1),
        1.8
      );
      const volume = Math.pow(
        clamp(edgeDistance[index] / depthRadius, 0, 1),
        0.8
      );
      const hairDetail =
        normalizedY < 0.22
          ? Math.abs(luminance[index] - broad) * 0.6
          : 0;
      const grain = (hashNoise(index) - 0.5) * 0.13;
      const bodyScale =
        normalizedY > 0.58 ? 0.7 : normalizedY > 0.46 ? 0.85 : 1;
      const edgeFade =
        smoothstep(0, edgeMargin, x) *
        smoothstep(0, edgeMargin, width - 1 - x) *
        smoothstep(0, edgeMargin, height - 1 - y);

      lumaMap[index] =
        clamp(
          (0.13 +
            volume * 0.07 +
            rim * (0.36 + broad * 0.24) +
            hairDetail +
            grain) *
            bodyScale,
          0,
          1
        ) * edgeFade;

      const edgeDepth =
        Math.pow(clamp(edgeDistance[index] / depthRadius, 0, 1), 0.7) * 0.2;

      depthMap[index] = edgeDepth;
    }
  }

  const random = mulberry32(20261106);
  const {
    positions,
    luma,
    bounds,
    width: worldWidth,
    height: worldHeight,
  } = sampleMask(
    mask,
    width,
    height,
    random,
    COUNT,
    (index) => lumaMap[index],
    (index) => depthMap[index]
  );

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUT_DIR, "portrait.bin"),
    encodeParticles(positions, luma)
  );

  console.log(
    `portrait.bin -> ${COUNT} titik, ${worldWidth.toFixed(2)} x ${worldHeight.toFixed(2)} world units`
  );
  console.log(
    `bounds px: x ${bounds.minX}-${bounds.maxX}, y ${bounds.minY}-${bounds.maxY}`
  );

  await writePreview(
    "portrait",
    positions,
    luma,
    Math.max(0.55, Math.min(1.2, worldWidth / worldHeight))
  );
}

function collectPolygons(geometry) {
  if (geometry.type === "Polygon") {
    return [geometry.coordinates];
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates;
  }

  return [];
}

async function buildIndonesia() {
  const source = JSON.parse(await fs.readFile(INDONESIA_SOURCE, "utf8"));
  const features = source.features ?? [];
  const polygons = features.flatMap((feature) =>
    collectPolygons(feature.geometry)
  );

  if (polygons.length === 0) {
    throw new Error("Tidak ada polygon Indonesia di GeoJSON");
  }

  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const [lon, lat] of ring) {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      }
    }
  }

  const padding = 0.02;
  const lonSpan = maxLon - minLon;
  const latSpan = maxLat - minLat;
  const lonPad = lonSpan * padding;
  const latPad = latSpan * padding;
  minLon -= lonPad;
  maxLon += lonPad;
  minLat -= latPad;
  maxLat += latPad;

  const rasterWidth = 1800;
  const rasterHeight = Math.round(
    rasterWidth * ((maxLat - minLat) / (maxLon - minLon))
  );

  const project = ([lon, lat]) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * rasterWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * rasterHeight;
    return [x, y];
  };

  const paths = polygons
    .map((polygon) =>
      polygon
        .map((ring) => {
          const points = ring.map(project);
          return `M${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L")}Z`;
        })
        .join("")
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${rasterWidth}" height="${rasterHeight}" viewBox="0 0 ${rasterWidth} ${rasterHeight}"><rect width="100%" height="100%" fill="black"/><path d="${paths}" fill="white"/></svg>`;

  const { data, info } = await sharp(Buffer.from(svg))
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const mask = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i += 1) {
    mask[i] = data[i] > 127 ? 1 : 0;
  }

  const random = mulberry32(20261107);
  const {
    positions,
    luma,
    width: worldWidth,
    height: worldHeight,
  } = sampleMask(mask, width, height, random, COUNT);

  const worldScale = 2.2 / worldWidth;

  for (let i = 0; i < COUNT; i += 1) {
    positions[i * 3] *= worldScale;
    positions[i * 3 + 1] *= worldScale;
    luma[i] = 0.78 + random() * 0.22;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUT_DIR, "indonesia.bin"),
    encodeParticles(positions, luma)
  );

  console.log(
    `indonesia.bin -> ${COUNT} titik, ${(worldWidth * worldScale).toFixed(2)} x ${(worldHeight * worldScale).toFixed(2)} world units`
  );

  await writePreview(
    "indonesia",
    positions,
    luma,
    Math.max(0.55, Math.min(4, (worldWidth * worldScale) / (worldHeight * worldScale)))
  );
}

const target = process.argv[2] ?? "all";

if (target === "portrait" || target === "all") {
  await buildPortrait();
}

if (target === "indonesia" || target === "all") {
  await buildIndonesia();
}
