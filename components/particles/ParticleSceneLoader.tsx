"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const ParticleScene = dynamic(
  () => import("@/components/particles/ParticleScene"),
  { ssr: false }
);

export default function ParticleSceneLoader() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const idleWindow = window as IdleWindow;
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(
        () => setReady(true),
        { timeout: 1200 }
      );
    } else {
      timeoutHandle = window.setTimeout(() => setReady(true), 350);
    }

    return () => {
      if (idleHandle !== null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }

      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [pathname]);

  if (pathname !== "/") {
    return null;
  }

  return ready ? <ParticleScene /> : null;
}
