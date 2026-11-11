"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);

  if (!CustomEase.get("refEase")) {
    CustomEase.create("refEase", "M0,0 C0.22,1 0.36,1 1,1");
  }
}

type RevealTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface RevealTextProps {
  children: string;
  as?: RevealTag;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  trigger?: "scroll" | "immediate";
  start?: string;
  startVisible?: boolean;
}

export default function RevealText({
  children,
  as = "p",
  className,
  delay = 0,
  stagger = 0.05,
  duration = 0.9,
  trigger = "scroll",
  start = "top 85%",
  startVisible = false,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const words = Array.from(
      element.querySelectorAll<HTMLElement>("[data-reveal-word]")
    );

    if (prefersReducedMotion) {
      gsap.set(words, { opacity: 1, filter: "none", yPercent: 0 });
      element.classList.add("reveal-ready", "reveal-done");
      return;
    }

    const useBlur = window.matchMedia("(pointer: fine)").matches;

    const context = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          opacity: startVisible ? 1 : 0,
          filter: useBlur ? "blur(10px)" : "none",
          yPercent: 30,
        },
        {
          opacity: 1,
          filter: useBlur ? "blur(0px)" : "none",
          yPercent: 0,
          duration,
          delay,
          stagger,
          ease: "refEase",
          onStart: () => element.classList.add("reveal-ready"),
          onComplete: () => element.classList.add("reveal-done"),
          scrollTrigger:
            trigger === "scroll"
              ? { trigger: element, start, once: true }
              : undefined,
        }
      );
    }, element);

    return () => context.revert();
  }, [
    delay,
    duration,
    prefersReducedMotion,
    stagger,
    start,
    startVisible,
    trigger,
  ]);

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  const words = children.split(/(\s+)/).filter(Boolean);

  const nodes = words.map((word, index) =>
    /^\s+$/.test(word) ? (
      <Fragment key={index}> </Fragment>
    ) : (
      <span key={index} data-reveal-word="" className="reveal-word">
        {word}
      </span>
    )
  );

  const classNameValue = [
    "reveal-text",
    startVisible ? "reveal-start-visible" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  switch (as) {
    case "h1":
      return (
        <h1 ref={setRef} className={classNameValue}>
          {nodes}
        </h1>
      );
    case "h2":
      return (
        <h2 ref={setRef} className={classNameValue}>
          {nodes}
        </h2>
      );
    case "h3":
      return (
        <h3 ref={setRef} className={classNameValue}>
          {nodes}
        </h3>
      );
    case "span":
      return (
        <span ref={setRef} className={classNameValue}>
          {nodes}
        </span>
      );
    case "div":
      return (
        <div ref={setRef} className={classNameValue}>
          {nodes}
        </div>
      );
    case "p":
    default:
      return (
        <p ref={setRef} className={classNameValue}>
          {nodes}
        </p>
      );
  }
}
