"use client";

import { useEffect, useState } from "react";

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () =>
      setIsTouch(query.matches || navigator.maxTouchPoints > 0);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isTouch;
}
