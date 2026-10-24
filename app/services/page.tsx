import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Check } from "lucide-react";
import { getServiceCategory } from "@/lib/serviceCategory";
import { createClient } from "@/lib/supabase/server";

import { WHATSAPP_NUMBER } from "@/lib/contact";
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
  "Over 6 years of experience and numerous references.",
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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const bookHref = user ? "/account/bookings/new" : "/signup";

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-white text-navy-950">
      {/* Header */}
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
      </section>

      {/* Services */}
      <section>
        <div className="container-page">
          {chunkArray(services, 4).map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="border-t border-fog-200 pb-14 pt-10 md:pb-16"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {row.map((service, i) => {
                  const category = getServiceCategory(service.name);
                  const globalIndex = rowIndex * 4 + i;

                  return (
                    <div key={service.id}>
                      <p className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-steel-300 lg:text-6xl">
                        {String(globalIndex + 1).padStart(2, "0")}
                      </p>

                      <p className="mt-8 text-xs uppercase tracking-widest text-steel-500">
                        {category.label}
                      </p>

                      <h3 className="mt-2 font-display text-lg font-normal text-navy-950">
                        {service.name}
                      </h3>

                      <p className="mt-2 max-w-[18rem] text-sm leading-6 text-steel-500">
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

      {/* Commercial truck emission solutions */}
      <section>
        <div className="container-page pb-24 pt-12 md:pt-20">
          <p className="text-xs uppercase tracking-widest text-steel-500">
            For commercial trucks
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-normal leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            DPF, AdBlue and EGR delete
          </h2>
          <p className="mt-6 max-w-md text-sm leading-6 text-steel-500 md:text-base md:leading-7">
            A permanent solution for commercial trucks with DPF, AdBlue or EGR
            problems.
          </p>

          <div className="mt-14 grid gap-x-8 gap-y-14 border-t border-fog-200 pt-10 md:mt-20 md:grid-cols-3">
            <div>
              <p className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-steel-300 lg:text-6xl">
                01
              </p>
              <h3 className="mt-8 font-display text-lg font-normal">
                Benefits
              </h3>
              <ul className="mt-4 space-y-3">
                {BENEFITS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-steel-500"
                  >
                    <Check
                      size={16}
                      className="mt-1 shrink-0 text-navy-950"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-steel-300 lg:text-6xl">
                02
              </p>
              <h3 className="mt-8 font-display text-lg font-normal">
                Signs and symptoms of failure
              </h3>
              <ul className="mt-4 space-y-3">
                {SYMPTOMS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-steel-500"
                  >
                    <span className="mt-[0.7rem] h-px w-3 shrink-0 bg-navy-950" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-steel-300 lg:text-6xl">
                03
              </p>
              <h3 className="mt-8 font-display text-lg font-normal">
                Effects of failure
              </h3>
              <ul className="mt-4 space-y-3">
                {EFFECTS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-6 text-steel-500"
                  >
                    <span className="mt-[0.7rem] h-px w-3 shrink-0 bg-steel-500" />
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