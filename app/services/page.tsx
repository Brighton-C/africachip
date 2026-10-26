import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Check } from "lucide-react";
import { getServiceCategory } from "@/lib/serviceCategory";
import { createClient } from "@/lib/supabase/server";
import ScrollReveal from "@/components/ScrollReveal";
import StickyBack from "@/components/StickyBack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "ECU remapping, Stage 1 to 3 tuning, diagnostics, DPF, AdBlue and EGR services, key programming and more for cars and trucks in Harare.",
  alternates: { canonical: "/services" },
};

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const BENEFITS = [
  "Increased engine life",
  "Increased fuel efficiency",
  "Increased turbocharger lifespan",
  "Increased power",
  "No more loss of time performing DPF regeneration or being stuck in limp mode. The solutions are permanent and carry a 1-year warranty on any related problems.",
];

const SYMPTOMS = [
  "Loss of power",
  "Excessive smoking",
  "Engine check light on",
  "DPF light on",
  "AdBlue light on",
  "High fuel consumption",
];

const EFFECTS = [
  "Premature engine failure",
  "Premature turbo failure",
  "Premature injector failure",
  "Overheating and engine knock",
];

export default async function ServicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const bookHref = user ? "/account/bookings/new" : "/signup";

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  const rows = chunkArray(services, 4);

  return (
    <main className="min-h-screen bg-white text-navy-950">
      <ScrollReveal />

      {/* Header and services: stays in place while the next section covers it */}
      <StickyBack className="bg-white">
        <section>
          <div className="container-page pb-14 pt-16 md:pb-20 md:pt-24">
            <p className="text-xs uppercase tracking-widest text-steel-500">
              What we do
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-normal leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Our services
            </h1>
            <p className="mt-6 max-w-md text-sm leading-6 text-steel-500 md:text-base md:leading-7">
              ECU tuning, diagnostics, programming and repairs for cars and
              trucks.
            </p>
          </div>

          <div className="container-page pb-20">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="border-t border-fog-200 pb-6 pt-8"
              >
                <div
                  data-stagger
                  className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {row.map((service) => {
                    const category = getServiceCategory(service.name);

                    return (
                      <div key={service.id} data-stagger-item>
                        <p className="text-xs uppercase tracking-widest text-steel-500">
                          {category.label}
                        </p>

                        <h3 className="mt-3 font-display text-xl font-normal tracking-[-0.02em] text-navy-950">
                          {service.name}
                        </h3>

                        <p className="mt-3 max-w-[18rem] text-sm leading-6 text-steel-500">
                          {service.description}
                        </p>

                        {service.price && (
                          <p className="mt-3 text-sm text-navy-950">
                            ${service.price.toString()}
                          </p>
                        )}

                        <Link
                          href={bookHref}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-navy-950 transition-opacity hover:opacity-60"
                        >
                          Book this service
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </StickyBack>

      {/* Commercial truck emission solutions: slides over the services */}
      <section className="relative z-10 border-t border-fog-200 bg-white shadow-[0_-30px_60px_-30px_rgba(13,17,23,0.25)]">
        <div className="container-page pb-24 pt-12 md:pt-20">
          {/* Intro and key figures */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-20">
            <div>
              <p className="text-xs uppercase tracking-widest text-steel-500">
                For commercial trucks
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-normal leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                DPF, AdBlue and EGR delete
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-steel-500 md:text-base md:leading-7">
                A permanent solution for commercial trucks with DPF, AdBlue or
                EGR problems.
              </p>
              <Link
                href={bookHref}
                className="mt-8 inline-flex items-center justify-center gap-2 bg-navy-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-navy-950/90"
              >
                Book a truck service
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-fog-200 pt-8 lg:border-t-0 lg:pt-0">
              <div>
                <p className="font-display text-3xl font-normal leading-none tracking-[-0.04em] text-navy-950 lg:text-5xl">
                  6+
                </p>
                <p className="mt-4 max-w-[12rem] text-sm leading-6 text-steel-500">
                  Years of experience and numerous references
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-normal leading-none tracking-[-0.04em] text-navy-950 lg:text-5xl">
                  1 year
                </p>
                <p className="mt-4 max-w-[12rem] text-sm leading-6 text-steel-500">
                  Warranty on any related problems
                </p>
              </div>
            </div>
          </div>

          {/* The problem, then the fix */}
          <div className="mt-16 grid gap-6 md:mt-20 lg:grid-cols-5">
            {/* Problem */}
            <div className="space-y-12 border-t border-fog-200 pt-8 lg:col-span-2 lg:pr-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-steel-500">
                  The problem
                </p>
                <h3 className="mt-3 font-display text-xl font-normal tracking-[-0.02em]">
                  Signs and symptoms of failure
                </h3>
                <ul className="mt-5">
                  {SYMPTOMS.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-fog-200 py-3 text-sm text-navy-950 first:border-t"
                    >
                      <span className="h-px w-3 shrink-0 bg-navy-950" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl font-normal tracking-[-0.02em]">
                  Effects of failure
                </h3>
                <ul className="mt-5">
                  {EFFECTS.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-b border-fog-200 py-3 text-sm text-navy-950 first:border-t"
                    >
                      <span className="h-px w-3 shrink-0 bg-steel-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-navy-950 p-8 text-white md:p-10 lg:col-span-3">
              <p className="text-xs uppercase tracking-widest text-white/50">
                The solution
              </p>
              <h3 className="mt-3 font-display text-2xl font-normal tracking-[-0.03em] sm:text-3xl">
                Benefits
              </h3>
              <ul className="mt-8 space-y-5">
                {BENEFITS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 text-sm leading-6 text-white/70"
                  >
                    <Check
                      size={16}
                      className="mt-1 shrink-0 text-white"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}