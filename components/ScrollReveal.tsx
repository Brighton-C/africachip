"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PEEK = 120; // keep equal to the 120px in globals.css

export default function ScrollReveal() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Single elements fade and rise
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // Groups: children arrive one after another
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        const items = group.querySelectorAll("[data-stagger-item]");
        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          }
        );
      });

      // Hairlines draw across
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: line, start: "top 92%", once: true },
          }
        );
      });

      // Headlines reveal word by word
      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll("[data-word]"),
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.07,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          }
        );
      });
    });

    // Stacked rows: each row slides over the one before it as the page scrolls.
    // Same conditions as the CSS in globals.css.
    mm.add(
      "(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = document.querySelector<HTMLElement>("[data-stack-track]");
        const rows = gsap.utils.toArray<HTMLElement>("[data-stack-row]");
        if (!track || rows.length < 2) return;

        // Starting positions: row 1 in place, row 2 peeking, the rest hidden below
        rows.forEach((row, i) => {
          if (i === 0) gsap.set(row, { yPercent: 0, y: 0, opacity: 1 });
          else if (i === 1)
            gsap.set(row, { yPercent: 100, y: -PEEK, opacity: 1 });
          else gsap.set(row, { yPercent: 100, y: 0, opacity: 1 });
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        rows.forEach((row, i) => {
          if (i === 0) return;
          const at = i - 1;
          tl.to(row, { yPercent: 0, y: 0, duration: 1 }, at);
          tl.to(rows[i - 1], { opacity: 0.25, y: -24, duration: 1 }, at);
          if (rows[i + 1]) tl.to(rows[i + 1], { y: -PEEK, duration: 1 }, at);
        });
      }
    );

    return () => mm.revert();
  });

  return null;
}