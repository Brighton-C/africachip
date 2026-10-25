"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Set to true to show the vehicle image again.
const SHOW_VEHICLE = false;

// To swap the hero vehicle, save the new image here (or change this one line).
const HERO_IMAGE = "/images/truckhero.png";

const HEADLINE = [
  { words: ["Vehicle Softwares", "Diagnostics"], className: "" },
  { words: ["&", "Performance"], className: "text-white/45" },
];

type PanelService = { id: string; name: string; label: string };

export default function Hero({
  bookHref,
  services,
}: {
  bookHref: string;
  services: PanelService[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance
        const tl = gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .fromTo(
            ".hero-word",
            { yPercent: 115, opacity: 1 },
            { yPercent: 0, duration: 1.1, stagger: 0.09 },
            0.1
          )
          .fromTo(
            ".hero-fade",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
            0.7
          )
          .fromTo(
            ".hero-panel",
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
            SHOW_VEHICLE ? 0.9 : 0.5
          );

        if (SHOW_VEHICLE) {
          tl.fromTo(
            ".hero-truck",
            { xPercent: 14, opacity: 0, scale: 1.03 },
            { xPercent: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
            0.25
          ).fromTo(
            ".hero-shadow",
            { scaleX: 0.5, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.5, ease: "power3.out" },
            0.25
          );
        }

        // Scroll: the hero recedes while the next sections slide over it
        const cover = document.getElementById("home-cover");
        if (!cover) return;

        const st = () => ({
          trigger: cover,
          start: "top bottom",
          end: "top 73px",
          scrub: true,
        });

        gsap.to(".hero-copy", {
          yPercent: -12,
          opacity: 0,
          ease: "none",
          scrollTrigger: st(),
        });
        if (SHOW_VEHICLE) {
          gsap.to(".hero-truck-wrap", {
            yPercent: -6,
            scale: 0.94,
            ease: "none",
            scrollTrigger: st(),
          });
        }
        gsap.to(".hero-panel-wrap", {
          yPercent: -10,
          opacity: 0,
          ease: "none",
          scrollTrigger: st(),
        });
        gsap.to(".hero-dim", {
          opacity: 0.5,
          ease: "none",
          scrollTrigger: st(),
        });
      });

      // Mouse: the vehicle drifts slightly against the cursor (desktop only)
      if (SHOW_VEHICLE) {
        mm.add(
          "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          () => {
            const el = root.current;
            if (!el) return;

            const moveX = gsap.quickTo(".hero-parallax", "x", {
              duration: 0.9,
              ease: "power3.out",
            });
            const moveY = gsap.quickTo(".hero-parallax", "y", {
              duration: 0.9,
              ease: "power3.out",
            });

            const onMove = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              moveX(((e.clientX - r.left) / r.width - 0.5) * -28);
              moveY(((e.clientY - r.top) / r.height - 0.5) * -14);
            };

            el.addEventListener("pointermove", onMove);
            return () => el.removeEventListener("pointermove", onMove);
          }
        );
      }

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="sticky top-[73px] z-0 h-[calc(100svh-73px)] min-h-[560px] overflow-hidden bg-graphite-900 text-white"
    >
      {/* Vehicle (hidden while SHOW_VEHICLE is false). Sits behind the content. */}
      {SHOW_VEHICLE && (
        <div className="container-page pointer-events-none absolute inset-0 z-0">
          <div className="relative h-full">
            <div className="hero-truck-wrap pointer-events-none absolute bottom-[2%] right-0 top-[40%] hidden w-[85%] md:block">
              <div className="hero-shadow hero-anim keep-round absolute bottom-0 left-[35%] right-[2%] h-8 bg-black/40 blur-2xl" />
              <div className="hero-parallax absolute inset-0">
                <div className="hero-truck hero-anim absolute inset-0">
                  <Image
                    src={HERO_IMAGE}
                    alt="Vehicle serviced by AfricaChip"
                    fill
                    sizes="(min-width: 768px) 85vw, 0px"
                    className="origin-bottom-right translate-y-[28%] scale-[1.4] object-contain object-right-bottom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content: text on the left, services panel on the right */}
      <div className="container-page relative z-10 grid h-full items-center gap-12 xl:grid-cols-[1fr_320px]">
        {/* Text */}
        <div className="hero-copy max-w-3xl">
          <h1 className="font-display text-5xl font-normal leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5rem]">
            {HEADLINE.map((line) => (
              <span
                key={line.words.join(" ")}
                className={`block ${line.className}`}
              >
                {line.words.map((word) => (
                  <span key={word}>
                    <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
                      <span className="hero-word hero-anim inline-block">
                        {word}
                      </span>
                    </span>{" "}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-fade hero-anim mt-6 max-w-md text-sm leading-6 text-white/60 md:text-base">
            Professional vehicle tuning, diagnostics and ECU services at our
            workshop or at your location.
          </p>

          <div className="hero-fade hero-anim mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={bookHref}
              className="inline-flex items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-medium text-navy-950 transition hover:bg-white/90"
            >
              Book a service
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="border border-white/25 px-6 py-3 text-center text-sm font-medium text-white transition hover:border-white hover:bg-white/5"
            >
              Explore services
            </Link>
          </div>
        </div>

        {/* Services panel: wide screens only */}
        <div className="hero-panel-wrap hidden xl:block">
          <div className="hero-panel hero-anim w-full border border-white/10 bg-white/[0.04] backdrop-blur-md">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-widest text-white/50">
                Book a service
              </p>
            </div>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={bookHref}
                    className="group flex items-center justify-between gap-4 border-b border-white/5 px-5 py-3.5 text-sm text-white/70 transition-colors hover:bg-white hover:text-navy-950"
                  >
                    <span>{service.name}</span>
                    <span className="shrink-0 text-xs text-white/35 transition-colors group-hover:text-navy-950/60">
                      {service.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services"
              className="flex items-center justify-between px-5 py-4 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              All services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Darkens the hero as the next section covers it */}
      <div className="hero-dim pointer-events-none absolute inset-0 z-30 bg-black opacity-0" />
    </section>
  );
}