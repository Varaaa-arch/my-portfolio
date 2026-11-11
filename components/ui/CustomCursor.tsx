"use client";

import { useEffect, useRef } from "react";
import { useIsTouch } from "@/hooks/useIsTouch";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const MAX_POINTS = 64;
const HOVER_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTouch = useIsTouch();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!finePointer || isTouch || prefersReducedMotion || reducedMotion) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    resize();

    let pointerX = -100;
    let pointerY = -100;
    let previousPointerX = pointerX;
    let previousPointerY = pointerY;
    let headX = pointerX;
    let headY = pointerY;
    let speed = 0;
    let trailFactor = 0;
    let hoverScale = 1;
    let targetHoverScale = 1;
    let opacity = 0;
    let targetOpacity = 0;
    let visible = false;

    const points: Array<{ x: number; y: number }> = [];

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      targetOpacity = 1;

      if (!visible) {
        visible = true;
        headX = pointerX;
        headY = pointerY;
        previousPointerX = pointerX;
        previousPointerY = pointerY;
      }

      start();
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const interactive = Boolean(target?.closest(HOVER_SELECTOR));

      targetHoverScale = interactive ? 1.75 : 1;
      canvas.classList.toggle("is-hovering", interactive);
    };

    const hideCursor = () => {
      targetOpacity = 0;
      targetHoverScale = 1;
      canvas.classList.remove("is-hovering");
    };

    let frame = 0;
    let running = false;

    const start = () => {
      if (running) {
        return;
      }

      running = true;
      frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      frame = 0;

      const dx = pointerX - previousPointerX;
      const dy = pointerY - previousPointerY;
      const distance = Math.hypot(dx, dy);

      previousPointerX = pointerX;
      previousPointerY = pointerY;

      speed += (distance - speed) * 0.2;
      headX += (pointerX - headX) * 0.28;
      headY += (pointerY - headY) * 0.28;

      if (speed > 0.4) {
        points.unshift({ x: headX, y: headY });

        if (points.length > MAX_POINTS) {
          points.length = MAX_POINTS;
        }
      } else if (points.length > 0) {
        points.pop();
      }

      const targetTrailFactor = Math.min(1, Math.max(0, speed / 14));
      trailFactor += (targetTrailFactor - trailFactor) * 0.1;
      hoverScale += (targetHoverScale - hoverScale) * 0.16;
      opacity += (targetOpacity - opacity) * 0.12;

      if (targetOpacity === 0 && opacity < 0.05) {
        visible = false;
        points.length = 0;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      if (!visible || opacity < 0.01) {
        running = false;
        points.length = 0;
        speed = 0;
        trailFactor = 0;
        return;
      }

      const visiblePoints = Math.floor(points.length * trailFactor);

      if (visiblePoints > 1) {
        context.lineCap = "round";

        for (let index = 0; index < visiblePoints - 1; index += 1) {
          const current = points[index];
          const next = points[index + 1];
          const strength = 1 - index / visiblePoints;
          const alpha = strength * strength * 0.55 * opacity;
          const lineWidth = 0.5 + strength * 5 * hoverScale;

          context.beginPath();
          context.moveTo(current.x, current.y);
          context.lineTo(next.x, next.y);
          context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          context.lineWidth = lineWidth;
          context.stroke();
        }
      }

      const glowRadius = 16 * hoverScale;
      const glow = context.createRadialGradient(
        headX,
        headY,
        0,
        headX,
        headY,
        glowRadius
      );

      glow.addColorStop(0, `rgba(255, 255, 255, ${0.9 * opacity})`);
      glow.addColorStop(0.35, `rgba(255, 255, 255, ${0.3 * opacity})`);
      glow.addColorStop(1, "rgba(255, 255, 255, 0)");

      context.fillStyle = glow;
      context.beginPath();
      context.arc(headX, headY, glowRadius, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      context.beginPath();
      context.arc(headX, headY, 3.2 * hoverScale, 0, Math.PI * 2);
      context.fill();

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("blur", hideCursor);
    document.documentElement.addEventListener("pointerleave", hideCursor);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("blur", hideCursor);
      document.documentElement.removeEventListener("pointerleave", hideCursor);
      root.classList.remove("has-custom-cursor");
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isTouch, prefersReducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="custom-cursor" />;
}
