"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

      // NEW: headlines reveal word by word, each word sliding up out of a mask
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

    return () => mm.revert();
  });

  return null;
}