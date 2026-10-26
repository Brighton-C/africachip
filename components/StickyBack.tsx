"use client";

import { useEffect, useRef } from "react";

// Keeps a section in place while the next one scrolls over it.
// If the section is taller than the screen, it sticks at the point where its
// bottom edge reaches the bottom of the screen, so none of it is cut off.
export default function StickyBack({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className={`sticky top-0 z-0 ${className}`}>
      {children}
    </div>
  );
}