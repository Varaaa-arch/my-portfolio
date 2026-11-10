"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/data/projects";
import type { Project } from "@/lib/types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ACCENTS = ["#379777", "#f4ce15", "#6ea8ff", "#d2a8ff"];

function ProjectCard({
  project,
  index,
  className = "",
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[2px] border border-white/10 bg-background p-[max(1.25rem,2.5vw)] md:grid md:grid-cols-[1.1fr_1fr] md:items-stretch md:gap-[2.5vw] ${className}`}
    >
      <div className="flex min-h-0 flex-col justify-between">
        <div>
          <div className="t-16 flex items-center justify-between uppercase tracking-[0.12em] text-muted">
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
            {project.year ? <span>{project.year}</span> : null}
          </div>
          <h3 className="mt-[2.5svh] text-[clamp(2.5rem,6vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.02em]">
            {project.title}
          </h3>
          <p className="t-20 mt-[2svh] text-muted">{project.tagline}</p>
          <p className="mt-[2svh] max-w-[50ch] font-mono text-[clamp(0.72rem,0.85vw,0.9rem)] leading-relaxed text-foreground/70">
            {project.description.join(" ")}
          </p>
        </div>
        <div className="mt-[3svh]">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/15 px-[0.85em] py-[0.35em] font-mono text-[0.66rem] uppercase tracking-[0.08em] text-muted"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-[2.5svh] flex flex-wrap items-center gap-x-[1.5rem] gap-y-2">
            <Link
              href={`/projects/${project.slug}`}
              className="t-16 group inline-flex items-center gap-2 uppercase tracking-[0.12em] text-foreground"
            >
              Lihat detail
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="t-16 inline-flex items-center gap-2 uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-foreground"
              >
                Situs proyek
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="relative mt-[3svh] aspect-[16/10] overflow-hidden rounded-[2px] border border-white/5 md:mt-0 md:aspect-auto"
        style={{
          background: `radial-gradient(120% 100% at 20% 15%, ${accent}33 0%, transparent 55%), #1b1a1d`,
        }}
      >
        {project.video ? (
          <video
            src={project.video}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[22vw] font-medium leading-none text-white/10 md:text-[10vw]">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </>
        )}
      </div>
    </article>
  );
}

export default function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const distance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            section.dataset.workProgress = self.progress.toFixed(4);
          },
          onLeave: () => {
            section.dataset.workProgress = "1";
          },
          onLeaveBack: () => {
            section.dataset.workProgress = "0";
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, [prefersReducedMotion]);

  return (
    <>
      <section
        ref={sectionRef}
        data-scene="works"
        data-work-progress="0"
        className={`relative z-[1] h-svh overflow-hidden ${prefersReducedMotion ? "hidden" : "hidden md:block"}`}
      >
        <h2 className="t-16 absolute left-[4.1667vw] top-[5.92593svh] uppercase tracking-[0.1em] text-muted [text-shadow:0_1px_16px_rgba(34,33,36,0.9)]">
          Some Selected Works
        </h2>
        <div
          ref={trackRef}
          className="flex h-full items-center gap-[3vw] pl-[5vw] pr-[5vw] will-change-transform"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              className="h-[72svh] w-[82vw] max-w-[1180px] shrink-0"
            />
          ))}
          <div className="flex h-full w-[60vw] max-w-[760px] shrink-0 items-center">
            <p className="t-30 max-w-[24ch]">
              Dan masih banyak yang sedang dikerjakan.
            </p>
          </div>
        </div>
      </section>

      <section
        data-scene="works"
        data-work-progress="0"
        className={`relative z-[1] ${prefersReducedMotion ? "block" : "md:hidden"}`}
      >
        <div className="mx-auto flex w-[90vw] flex-col gap-[7svh] py-[12svh]">
          <h2 className="t-16 uppercase tracking-[0.1em] text-muted">
            Some Selected Works
          </h2>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
            />
          ))}
          <p className="t-30 max-w-[24ch]">
            Dan masih banyak yang sedang dikerjakan.
          </p>
        </div>
      </section>
    </>
  );
}
