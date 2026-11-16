"use client";

import { useState, useEffect } from "react";

export function useMobileDevice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const evaluateDevice = () => {
      const mobileWidth = window.innerWidth < 768;
      setIsMobile(mobileWidth);
    };

    evaluateDevice();
    window.addEventListener("resize", evaluateDevice, { passive: true });
    return () => window.removeEventListener("resize", evaluateDevice);
  }, []);

  return { isMobile };
}
