import { gsap } from 'gsap';
import type { HeroParticles } from '../three/HeroParticles';

const wait = (ms: number) => new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));

async function loadParticles(canvas: HTMLCanvasElement): Promise<HeroParticles | null> {
  try {
    const { HeroParticles } = await import('../three/HeroParticles'); // lazy chunk
    return new HeroParticles(canvas);
  } catch {
    return null; // WebGL gagal -> intro tetap jalan tanpa particle
  }
}

export function initHeroIntro() {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const canvas = hero.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const skipBtn = hero.querySelector<HTMLButtonElement>('[data-hero-skip]');
  if (!canvas || !skipBtn) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pending = root.dataset.intro === 'pending';
  const particlesReady = loadParticles(canvas);

  // Tanpa intro: langsung state akhir
  if (!pending) {
    particlesReady.then((p) => p?.showFinal(!reduceMotion));
    return;
  }

  void run();

  async function run() {
    skipBtn!.hidden = false;

    // Tunggu particle maksimal 1.5 detik; kalau telat, intro jalan tanpa mereka
    const particles = await Promise.race([particlesReady, wait(1500)]);
    if (!particles) particlesReady.then((p) => p?.showFinal(true));
    const u = particles?.uniforms;

    const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, hero!);
    const logo = hero!.querySelector('[data-logo]');
    const logoPaths = q('[data-logo] circle, [data-logo] path');
    const letters = q('[data-letter]');
    const pillars = q('[data-pillar]');
    const reveal = q('[data-reveal]');
    const all = q('[data-anim]');

    // Pakai ref object supaya finish() bisa akses tl tanpa reassignment
    const state = { done: false };

    const finish = () => {
      if (state.done) return;
      state.done = true;
      skipBtn!.hidden = true;
      window.removeEventListener('keydown', onKey);
      gsap.set([...all, ...logoPaths], { clearProps: 'all' }); // balik ke state CSS normal
      root.removeAttribute('data-intro'); // unlock scroll
      try {
        sessionStorage.setItem('intro-played', '1');
      } catch {
        /* storage diblokir, abaikan */
      }
    };

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });

    const skip = () => tl.timeScale(8); // fast-forward, bukan jump, biar tetap mulus
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip();
    };

    skipBtn!.addEventListener('click', skip);
    window.addEventListener('keydown', onKey);

    // 1. black screen
    tl.to({}, { duration: 0.5 }).addLabel('ignite');

    // 2. particle ignition
    if (u) tl.to(u.uIgnite, { value: 1, duration: 2.4, ease: 'power2.out' }, 'ignite');

    // 3. logo reveal (stroke draw)
    tl.fromTo(logo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 'ignite+=1.4').fromTo(
      logoPaths,
      { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.2, stagger: 0.2, ease: 'power2.inOut' },
      '<',
    );

    // 4. BIZAR
    tl.fromTo(
      letters,
      { autoAlpha: 0, yPercent: 60, filter: 'blur(14px)' },
      { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', duration: 1, stagger: 0.08 },
      '>-0.2',
    );

    // 5. AI / SYSTEMS / ENGINEERING
    tl.fromTo(
      pillars,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 },
      '>-0.3',
    );

    // 6. enter experience
    tl.fromTo(
      reveal,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15 },
      '>-0.1',
    );

    // particle meredup jadi backdrop biar teks kebaca
    if (u) tl.to(u.uOpacity, { value: 0.35, duration: 1.5, ease: 'power2.inOut' }, '<');
  }
}
