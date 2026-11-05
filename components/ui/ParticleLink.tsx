"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
}

interface ParticleLinkProps {
  href: string;
  children: string;
  external?: boolean;
  className?: string;
}

export default function ParticleLink({
  href,
  children,
  external = false,
  className,
}: ParticleLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);
  const restoreRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);

      if (restoreRef.current !== null) {
        window.clearTimeout(restoreRef.current);
      }
    };
  }, []);

  const reset = () => {
    cancelAnimationFrame(frameRef.current);

    if (restoreRef.current !== null) {
      window.clearTimeout(restoreRef.current);
      restoreRef.current = null;
    }

    const canvas = canvasRef.current;
    const text = textRef.current;

    if (canvas) {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (text) {
      text.style.opacity = "1";
    }

    particlesRef.current = [];
  };

  const disintegrate = () => {
    if (prefersReducedMotion) {
      return;
    }

    const link = linkRef.current;
    const text = textRef.current;
    const canvas = canvasRef.current;

    if (!link || !text || !canvas) {
      return;
    }

    reset();

    const rect = text.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const style = window.getComputedStyle(text);
    const color = style.color;

    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;

    const offscreenContext = offscreen.getContext("2d");

    if (!offscreenContext) {
      return;
    }

    const fontSize = parseFloat(style.fontSize) || 16;

    offscreenContext.scale(dpr, dpr);
    offscreenContext.fillStyle = "#ffffff";
    offscreenContext.textAlign = "center";
    offscreenContext.textBaseline = "middle";
    offscreenContext.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
    offscreenContext.fillText(children, rect.width / 2, rect.height / 2);

    const image = offscreenContext.getImageData(
      0,
      0,
      offscreen.width,
      offscreen.height
    ).data;

    const particles: Particle[] = [];
    const gap = 4;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let y = 0; y < offscreen.height; y += gap) {
      for (let x = 0; x < offscreen.width; x += gap) {
        const alpha = image[(y * offscreen.width + x) * 4 + 3];

        if (alpha < 110) {
          continue;
        }

        const particleX = x / dpr;
        const particleY = y / dpr;

        particles.push({
          x: particleX,
          y: particleY,
          vx:
            (particleX - centerX) * 0.045 + (Math.random() - 0.5) * 1.6,
          vy: (particleY - centerY) * 0.045 - Math.random() * 1.4,
          life: 1,
          decay: 0.012 + Math.random() * 0.02,
          size: 0.8 + Math.random() * 1.2,
        });
      }
    }

    particlesRef.current = particles;
    text.style.opacity = "0";

    const render = () => {
      context.clearRect(0, 0, rect.width, rect.height);

      const alive: Particle[] = [];

      for (const particle of particlesRef.current) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.985;
        particle.vy += 0.012;
        particle.life -= particle.decay;

        if (particle.life <= 0) {
          continue;
        }

        context.globalAlpha = Math.max(0, particle.life);
        context.fillStyle = color;
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
        alive.push(particle);
      }

      context.globalAlpha = 1;
      particlesRef.current = alive;

      if (alive.length > 0) {
        frameRef.current = requestAnimationFrame(render);
      } else {
        context.clearRect(0, 0, rect.width, rect.height);
      }
    };

    frameRef.current = requestAnimationFrame(render);

    restoreRef.current = window.setTimeout(() => {
      if (textRef.current) {
        textRef.current.style.opacity = "1";
      }

      restoreRef.current = null;
    }, 650);
  };

  return (
    <a
      ref={linkRef}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`relative inline-block ${className ?? ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          disintegrate();
        }
      }}
      onPointerLeave={reset}
    >
      <span
        ref={textRef}
        className="relative z-[1] inline-block transition-opacity duration-300"
      >
        {children}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[2]"
      />
    </a>
  );
}
