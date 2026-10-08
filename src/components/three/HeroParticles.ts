import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIgnite;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRand;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    // tiap particle punya delay sendiri -> efek "menyala" bergelombang
    float t = clamp((uIgnite - aRand * 0.45) / 0.55, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 3.0); // easeOutCubic

    vec3 pos = position * e; // meledak dari titik pusat ke permukaan bola
    pos += 0.04 * e * vec3(
      sin(uTime * 0.9 + aRand * 40.0),
      cos(uTime * 0.7 + aRand * 25.0),
      sin(uTime * 0.8 + aRand * 33.0)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.5 + aRand) / -mv.z;

    vAlpha = smoothstep(0.0, 0.15, t);
    vHeat = 1.0 - t; // lagi bergerak = putih panas, mendarat = warna accent
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColor, vec3(1.0), vHeat);
    gl_FragColor = vec4(col, soft * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

export class HeroParticles {
  readonly uniforms = {
    uTime: { value: 0 },
    uIgnite: { value: 0 }, // 0 = gelap, 1 = semua particle sudah menyala
    uOpacity: { value: 1 },
    uSize: { value: 10 },
    uPixelRatio: { value: 1 },
    uColor: { value: new THREE.Color('#7c5cff') },
  };
  readonly points: THREE.Points;

  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private raf = 0;
  private last = 0;
  private running = false;
  private visible = true;
  private animate = true;

  constructor(canvas: HTMLCanvasElement, count = matchMedia('(max-width: 767px)').matches ? 2500 : 4500) {
    this.canvas = canvas;
    // kalau WebGL nggak tersedia, ini throw -> ditangkap di heroIntro (intro jalan tanpa particle)
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });

    // warna ikut design token
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim();
    if (accent) this.uniforms.uColor.value.set(accent);

    // geometry: bola (fibonacci sphere) tipis
    const positions = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const radius = 1.6 * (0.92 + Math.random() * 0.16);
      positions[i * 3] = Math.cos(theta) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * r * radius;
      rand[i] = Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);

    // pause render saat hero keluar layar
    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.start();
      else this.stop();
    });
    this.io.observe(canvas);

    this.start();
  }

  private resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.uniforms.uPixelRatio.value = dpr;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;
    this.camera.position.z = 4.5 * Math.max(1, 0.8 / aspect); // mundur di layar portrait
    this.camera.updateProjectionMatrix();
  }

  private tick = (now: number) => {
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    this.uniforms.uTime.value += dt;
    this.points.rotation.y += dt * 0.06;
    this.points.rotation.x += dt * 0.015;
    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.tick);
  };

  start() {
    if (this.running || !this.animate || !this.visible) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** State akhir tanpa intro (repeat visit / reduced motion). */
  showFinal(animate = true) {
    this.uniforms.uIgnite.value = 1;
    this.uniforms.uOpacity.value = 0.35;
    this.animate = animate;
    if (animate) {
      this.start();
    } else {
      this.stop();
      this.resize();
      this.renderer.render(this.scene, this.camera); // satu frame statis
    }
  }

  dispose() {
    this.stop();
    this.ro.disconnect();
    this.io.disconnect();
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
    this.renderer.dispose();
  }
}
