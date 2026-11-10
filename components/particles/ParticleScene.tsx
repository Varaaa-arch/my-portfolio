"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { parseParticleBin, type ParticleData } from "@/lib/particles/parse";
import {
  createGlobe,
  createPhases,
  createRandom,
  createScatter,
  createWave,
} from "@/lib/particles/formations";
import {
  particleFragmentShader,
  particleVertexShader,
} from "@/lib/particles/shader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MOBILE_RATIO = 0.6;
const INTRO_DURATION = 2.8;
const PARTICLE_VERSION = "20261107d";
const TILT_X = 0.36;
const TILT_Y = 0.48;
const NECK_PIVOT = -0.08;
const LIGHT_RADIUS = 0.32;
const PORTRAIT_SHIFT_RATIO = 0.04;
const STATEMENT_SHIFT_RATIO = 0.2;
const STATEMENT_SCALE = 0.08;

const SECTION_OPACITY: Record<string, number> = {
  hero: 1,
  statement: 0.78,
  location: 0.66,
  howiwork: 0.24,
  works: 0.36,
  contacts: 0,
};

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-dt / Math.max(lambda, 0.001)));

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

async function loadParticles(
  url: string,
  signal: AbortSignal
): Promise<ParticleData> {
  const response = await fetch(url, { signal, cache: "force-cache" });

  if (!response.ok) {
    throw new Error(`Gagal memuat ${url}: ${response.status}`);
  }

  return parseParticleBin(await response.arrayBuffer());
}

export default function ParticleScene({
  className = "",
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const idleWindow = window as IdleWindow;
    const abort = new AbortController();
    const cleanup: Array<() => void> = [];

    let disposed = false;
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;
    let frame = 0;
    let resizeFrame = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;

    const start = async () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const finePointer = window.matchMedia(
        "(pointer: fine) and (hover: hover)"
      ).matches;

      let portrait: ParticleData;

      try {
        portrait = await loadParticles(
          `/particles/portrait.bin?v=${PARTICLE_VERSION}`,
          abort.signal
        );
      } catch (error) {
        if (!abort.signal.aborted) {
          console.warn("Particle portrait tidak tersedia", error);
        }
        return;
      }

      if (disposed) {
        return;
      }

      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      } catch (error) {
        console.warn("WebGL tidak tersedia untuk particle scene", error);
        return;
      }

      const count = portrait.count;
      const random = createRandom(20261106);
      const globe = createGlobe(count, random);
      const wave = createWave(count, random);
      const scatter = createScatter(count, random);
      const phases = createPhases(count, random);
      const indonesia = new Float32Array(portrait.positions);

      const scene = new THREE.Scene();
      const group = new THREE.Group();
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 30);
      const uniforms = {
        uTime: { value: 0 },
        uIntro: { value: prefersReducedMotion ? 1 : 0 },
        uMorph1: { value: 0 },
        uMorph2: { value: 0 },
        uWorkMix: { value: 0 },
        uWorkSlide: { value: 0 },
        uTurbulence: { value: 0 },
        uScale: { value: 1 },
        uSize: { value: coarse ? 2.5 : 2.25 },
        uPixelRatio: { value: 1 },
        uPortraitFade: { value: 1 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uLight: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: 1 },
        uLightRadius: { value: LIGHT_RADIUS },
        uLightStrength: { value: 0 },
        uColor: { value: new THREE.Color("#f0f2f0") },
        uExposure: { value: 0.9 },
        uGlow: { value: 0.35 },
      };

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(portrait.positions, 3)
      );
      geometry.setAttribute(
        "aPortrait",
        new THREE.BufferAttribute(portrait.positions, 3)
      );
      geometry.setAttribute("aGlobe", new THREE.BufferAttribute(globe, 3));
      const indonesiaAttribute = new THREE.BufferAttribute(indonesia, 3);
      geometry.setAttribute("aIndonesia", indonesiaAttribute);
      geometry.setAttribute("aWave", new THREE.BufferAttribute(wave, 3));
      geometry.setAttribute(
        "aScatter",
        new THREE.BufferAttribute(scatter, 3)
      );
      geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
      geometry.setAttribute(
        "aLuma",
        new THREE.BufferAttribute(portrait.luma, 1)
      );
      geometry.setDrawRange(
        0,
        coarse ? Math.floor(count * MOBILE_RATIO) : count
      );

      material = new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      points.position.y = NECK_PIVOT;

      const tilt = new THREE.Group();
      tilt.position.y = -NECK_PIVOT;
      tilt.add(points);
      group.add(tilt);
      scene.add(group);

      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;display:block;";
      container.appendChild(renderer.domElement);

      let portraitShift = 0;
      let statementShift = 0;
      let baseScale = 1;
      let isPortraitViewport = false;

      const applyViewport = () => {
        if (!renderer) {
          return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;
        const isPortrait = width / height < 0.85;
        isPortraitViewport = isPortrait;

        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2)
        );
        renderer.setSize(width, height, false);

        camera.aspect = width / height;
        camera.position.z = isPortrait ? 3.55 : 3.1;
        camera.updateProjectionMatrix();

        const visibleHeight =
          2 *
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
          camera.position.z;
        const visibleWidth = visibleHeight * (width / height);
        const scale = (visibleHeight * (isPortrait ? 0.9 : 0.98)) / 2.05;

        portraitShift = isPortrait
          ? 0
          : visibleWidth * PORTRAIT_SHIFT_RATIO;
        statementShift = isPortrait
          ? 0
          : visibleWidth * STATEMENT_SHIFT_RATIO;
        baseScale = scale;

        uniforms.uScale.value = scale;
        uniforms.uPixelRatio.value = renderer.getPixelRatio();
        uniforms.uAspect.value = width / height;
        group.position.x = -portraitShift;
        group.position.y = -visibleHeight * (isPortrait ? 0.035 : 0.06);
      };

      applyViewport();

      let resizeScheduled = false;
      const onResize = () => {
        if (resizeScheduled) {
          return;
        }

        resizeScheduled = true;
        resizeFrame = requestAnimationFrame(() => {
          resizeScheduled = false;
          applyViewport();

          if (prefersReducedMotion && renderer) {
            renderer.render(scene, camera);
          }
        });
      };

      window.addEventListener("resize", onResize);
      cleanup.push(() => window.removeEventListener("resize", onResize));

      const target = {
        morph1: 0,
        morph2: 0,
        work: 0,
        slide: 0,
        opacity: 0,
        turbulence: 0,
        statement: 0,
      };
      const state = { ...target };

      const statement = document.querySelector<HTMLElement>(
        '[data-scene="statement"]'
      );

      if (statement) {
        const trigger = ScrollTrigger.create({
          trigger: statement,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            target.statement = smoothstep(0.06, 0.94, self.progress);
          },
          onLeave: () => {
            target.statement = 1;
          },
          onLeaveBack: () => {
            target.statement = 0;
          },
        });

        cleanup.push(() => trigger.kill());
      }

      const location = document.querySelector<HTMLElement>(
        '[data-scene="location"]'
      );

      if (location) {
        const trigger = ScrollTrigger.create({
          trigger: location,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            target.morph1 = smoothstep(0.15, 0.52, self.progress);
            target.morph2 = smoothstep(0.58, 0.96, self.progress);
          },
        });

        cleanup.push(() => trigger.kill());
      }

      const worksElements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-scene="works"]')
      ).filter((element) => element.getBoundingClientRect().width > 0);

      for (const element of worksElements) {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top 88%",
          end: "top 48%",
          onUpdate: (self) => {
            target.work = smoothstep(0.05, 0.9, self.progress);
          },
          onLeave: () => {
            target.work = 1;
          },
          onLeaveBack: () => {
            target.work = 0;
          },
        });

        cleanup.push(() => trigger.kill());
      }

      const loadIndonesia = async () => {
        try {
          const map = await loadParticles(
            `/particles/indonesia.bin?v=${PARTICLE_VERSION}`,
            abort.signal
          );

          if (disposed) {
            return;
          }

          const length = Math.min(map.count, count);
          indonesia.set(map.positions.subarray(0, length * 3), 0);
          indonesiaAttribute.needsUpdate = true;
        } catch (error) {
          if (!abort.signal.aborted) {
            console.warn("Particle map tidak tersedia", error);
          }
        }
      };

      if (location && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              observer.disconnect();
              void loadIndonesia();
            }
          },
          { rootMargin: "150% 0px" }
        );

        observer.observe(location);
        cleanup.push(() => observer.disconnect());
      } else {
        void loadIndonesia();
      }

      const sectionElements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-scene]")
      );

      let pointerX = 0;
      let pointerY = 0;
      let pointerTargetX = 0;
      let pointerTargetY = 0;
      let pointerActive = false;
      let lightX = 0;
      let lightY = 0;

      if (finePointer && !prefersReducedMotion) {
        const onPointerMove = (event: PointerEvent) => {
          pointerTargetX = (event.clientX / window.innerWidth) * 2 - 1;
          pointerTargetY = (event.clientY / window.innerHeight) * 2 - 1;
          pointerActive = true;
        };

        const onPointerLeave = () => {
          pointerActive = false;
        };

        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
        document.documentElement.addEventListener(
          "pointerleave",
          onPointerLeave
        );

        cleanup.push(() => {
          window.removeEventListener("pointermove", onPointerMove);
          document.documentElement.removeEventListener(
            "pointerleave",
            onPointerLeave
          );
        });
      }

      if (prefersReducedMotion) {
        const hero = document.querySelector<HTMLElement>(
          '[data-scene="hero"]'
        );

        const updateVisibility = () => {
          if (!hero) {
            container.style.opacity = "1";
            return;
          }

          const rect = hero.getBoundingClientRect();
          container.style.opacity = rect.bottom > 0 ? "1" : "0";
        };

        window.addEventListener("scroll", updateVisibility, {
          passive: true,
        });
        cleanup.push(() =>
          window.removeEventListener("scroll", updateVisibility)
        );

        updateVisibility();
        renderer.render(scene, camera);

        return;
      }

      let lastTime = performance.now();
      let lastScrollY = window.scrollY;
      const introStart = performance.now();

      const tick = (now: number) => {
        frame = requestAnimationFrame(tick);

        const dt = Math.min((now - lastTime) / 1000, 0.05) || 1 / 60;
        lastTime = now;

        if (document.hidden) {
          return;
        }

        const elapsed = (now - introStart) / 1000;
        uniforms.uIntro.value = easeOutCubic(
          clamp(elapsed / INTRO_DURATION)
        );

        const mid = window.innerHeight * 0.5;
        let activeOpacity = 1;
        let activeElement: HTMLElement | null = null;

        for (const element of sectionElements) {
          const rect = element.getBoundingClientRect();

          if (rect.width > 0 && rect.top <= mid && rect.bottom >= mid) {
            activeOpacity = SECTION_OPACITY[element.dataset.scene ?? ""] ?? 1;
            activeElement = element;
            break;
          }
        }

        target.opacity = activeOpacity;

        const scrollY = window.scrollY;
        const velocity = Math.abs(scrollY - lastScrollY) / dt;
        lastScrollY = scrollY;
        target.turbulence = clamp(velocity / 2600);

        const worksProgress =
          activeElement?.dataset.scene === "works"
            ? Number(activeElement.dataset.workProgress ?? "0")
            : Number(
                worksElements
                  .find((element) => element.getBoundingClientRect().width > 0)
                  ?.dataset.workProgress ?? "0"
              );

        target.slide = Number.isFinite(worksProgress)
          ? clamp(worksProgress)
          : 0;

        state.morph1 = damp(state.morph1, target.morph1, 0.35, dt);
        state.morph2 = damp(state.morph2, target.morph2, 0.35, dt);
        state.work = damp(state.work, target.work, 0.4, dt);
        state.slide = damp(state.slide, target.slide, 0.35, dt);
        state.opacity = damp(state.opacity, target.opacity, 0.45, dt);
        state.turbulence = damp(
          state.turbulence,
          target.turbulence,
          0.18,
          dt
        );
        state.statement = damp(
          state.statement,
          target.statement,
          0.4,
          dt
        );

        pointerX = damp(pointerX, pointerActive ? pointerTargetX : 0, 0.55, dt);
        pointerY = damp(pointerY, pointerActive ? pointerTargetY : 0, 0.55, dt);
        lightX = damp(lightX, pointerActive ? pointerTargetX : 0, 0.08, dt);
        lightY = damp(lightY, pointerActive ? pointerTargetY : 0, 0.08, dt);

        const portraitWeight =
          (1 - state.morph1) * (1 - state.morph2) * (1 - state.work);
        group.position.x =
          (-portraitShift + statementShift * state.statement) * portraitWeight;

        uniforms.uScale.value =
          baseScale *
          (1 +
            state.statement *
              (isPortraitViewport ? 0 : STATEMENT_SCALE) *
              portraitWeight);
        uniforms.uTime.value = now / 1000;
        uniforms.uMorph1.value = state.morph1;
        uniforms.uMorph2.value = state.morph2;
        uniforms.uWorkMix.value = state.work;
        uniforms.uWorkSlide.value = state.slide * 0.9;
        uniforms.uTurbulence.value = state.turbulence;
        uniforms.uPointer.value.set(pointerX, pointerY);
        uniforms.uLight.value.set(lightX, -lightY);
        uniforms.uLightStrength.value = damp(
          uniforms.uLightStrength.value,
          pointerActive ? 1 : 0,
          0.2,
          dt
        );

        container.style.opacity = state.opacity.toFixed(3);

        const workFactor = 1 - state.work * 0.8;
        const idle = now / 1000;

        tilt.rotation.x = damp(
          tilt.rotation.x,
          (pointerY * TILT_X + Math.sin(idle * 0.31) * 0.025) * workFactor,
          0.3,
          dt
        );
        tilt.rotation.y = damp(
          tilt.rotation.y,
          (pointerX * TILT_Y + Math.sin(idle * 0.27) * 0.045) * workFactor,
          0.3,
          dt
        );
        tilt.rotation.z = Math.sin(idle * 0.21) * 0.012;

        if (state.opacity > 0.012 && renderer) {
          renderer.render(scene, camera);
        }
      };

      frame = requestAnimationFrame(tick);

      cleanup.push(() => {
        cancelAnimationFrame(frame);
        cancelAnimationFrame(resizeFrame);
      });
    };

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(
        () => {
          void start();
        },
        { timeout: 1500 }
      );
    } else {
      timeoutHandle = window.setTimeout(() => {
        void start();
      }, 350);
    }

    return () => {
      disposed = true;
      abort.abort();

      if (idleHandle !== null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }

      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }

      for (const dispose of cleanup) {
        dispose();
      }

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
        renderer = null;
      }

      if (geometry) {
        geometry.dispose();
        geometry = null;
      }

      if (material) {
        material.dispose();
        material = null;
      }

      container.replaceChildren();
      container.style.opacity = "0";
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 select-none ${className}`}
      style={{ opacity: 0 }}
    />
  );
}
