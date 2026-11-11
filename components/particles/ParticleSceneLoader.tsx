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

const PROBE_TIMEOUT = 4000;

function probeRenderProfile(): Promise<"animated" | "static"> {
  return new Promise((resolve) => {
    let settled = false;
    let worker: Worker | null = null;
    let timer = 0;

    const finish = (result: "animated" | "static") => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timer);

      try {
        worker?.terminate();
      } catch {
        // noop
      }

      resolve(result);
    };

    try {
      worker = new Worker("/webgl-probe.js");
    } catch {
      resolve("animated");
      return;
    }

    timer = window.setTimeout(() => finish("static"), PROBE_TIMEOUT);

    worker.onmessage = (event) => {
      finish(event.data === "animated" ? "animated" : "static");
    };

    worker.onerror = () => finish("animated");
    worker.postMessage(null);
  });
}

export default function ParticleSceneLoader() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    if (connection?.saveData) {
      return;
    }

    let cancelled = false;
    const idleWindow = window as IdleWindow;
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    const schedule = () => {
      if (cancelled) {
        return;
      }

      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(
          () => setReady(true),
          { timeout: 1200 }
        );
      } else {
        timeoutHandle = window.setTimeout(() => setReady(true), 350);
      }
    };

    void probeRenderProfile().then((profile) => {
      if (profile === "animated") {
        schedule();
      }
    });

    return () => {
      cancelled = true;

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
