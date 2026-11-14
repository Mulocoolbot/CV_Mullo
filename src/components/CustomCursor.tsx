"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/hooks/usePreferences";

const INTERACTIVE_SELECTOR =
  'a, button, select, input, textarea, [role="button"], [data-cursor="pointer"]';

function resolveTargetElement(target: EventTarget | null): Element | null {
  if (target instanceof Element) {
    return target;
  }
  if (target instanceof Node) {
    return target.parentElement;
  }
  return null;
}

export function CustomCursor() {
  const { theme } = usePreferences();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const syncPointerState = (target: EventTarget | null) => {
      const element = resolveTargetElement(target);
      setIsPointer(Boolean(element?.closest(INTERACTIVE_SELECTOR)));
    };

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);
      syncPointerState(event.target);
    };

    const handleMouseOver = (event: MouseEvent) => {
      syncPointerState(event.target);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
    };
  }, []);

  const fillColor = theme === "light" ? "#111111" : "#FFFFFF";
  const strokeColor = theme === "light" ? "#000000" : "#111111";
  const glossColor = theme === "light" ? "#5A5A5A" : "#D4D4D8";

  return (
    <div
      data-testid="custom-cursor"
      data-cursor-theme={theme}
      data-cursor-mode={isPointer ? "pointer" : "default"}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] transition-opacity duration-150"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${
          isPressed ? 0.9 : 1
        })`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {!isPointer ? (
        <svg
          data-testid="cursor-arrow-svg"
          width="28"
          height="28"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 4.2 C4.2 3.3 2.8 4.5 3.4 6.0 L12.8 30.2 C13.5 31.9 16.0 31.7 16.5 29.9 L19.4 20.2 L29.2 17.3 C31.0 16.8 31.2 14.3 29.5 13.6 L5.5 4.2 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M7.2 6.6 L25.6 13.9 C26.3 14.2 26.2 15.1 25.4 15.2 L19.4 15.8 C16.6 13.0 12.1 9.8 7.2 6.6 Z"
            fill={glossColor}
          />
        </svg>
      ) : (
        <svg
          data-testid="cursor-hand-svg"
          width="30"
          height="30"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.9 21.8 L13.9 6.6 C13.9 4.9 15.1 3.8 16.5 3.8 C17.9 3.8 19.1 4.9 19.1 6.6 L19.1 14.8 C19.6 13.6 20.6 13.1 21.6 13.1 C23.0 13.1 23.9 14.1 23.9 15.6 C24.4 14.4 25.3 13.9 26.3 13.9 C27.6 13.9 28.5 14.9 28.5 16.4 C28.9 15.4 29.8 15.0 30.7 15.0 C31.9 15.0 32.7 15.9 32.7 17.3 L32.7 25.2 C32.7 30.2 28.8 33.8 23.0 33.8 L19.2 33.8 C14.6 33.8 11.4 31.0 9.6 27.6 L6.0 21.8 C5.1 20.4 5.5 18.5 6.9 17.7 C8.2 16.9 9.9 17.3 10.9 18.6 L13.9 21.8 Z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.1 14.8 L19.1 20.6 M23.9 15.6 L23.9 21.0 M28.5 16.4 L28.5 21.4"
            stroke={strokeColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M15.2 6.8 C15.2 5.7 15.8 5.1 16.5 5.1 C17.2 5.1 17.8 5.7 17.8 6.8 L17.8 8.3 L15.2 8.3 Z"
            fill={glossColor}
          />
          <ellipse cx="21.5" cy="15.3" rx="1.2" ry="1.0" fill={glossColor} />
          <ellipse cx="26.2" cy="16.0" rx="1.1" ry="0.9" fill={glossColor} />
          <ellipse cx="30.6" cy="16.9" rx="1.0" ry="0.8" fill={glossColor} />
        </svg>
      )}
    </div>
  );
}
