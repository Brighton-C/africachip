import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowUpRight } from "lucide-react";
import { getServiceCategory } from "@/lib/serviceCategory";
import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero";
import ScrollReveal from "@/components/ScrollReveal";
import { SITE_URL } from "@/lib/contact";

import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "AfricaChip",
  url: SITE_URL,
  telephone: "+263771250250",
  email: "admin@tamroexpress.co.zw",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cnr Crowborough & Heany Rd, Warren Park D",
    addressLocality: "Harare",
    addressCountry: "ZW",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Tamro Express",
    url: "https://tamroexpress.co.zw",
  },
};

const STEPS = [
  {
    number: "01",
    title: "Tell us about your vehicle",
    description:
      "Choose your service and provide the basic details about your vehicle.",
  },
  {
    number: "02",
    title: "Choose where",
    description:
      "Bring your vehicle to our workshop or arrange a service at your location.",
  },
  {
    number: "03",
    title: "We handle the rest",
    description:
      "Our team carries out the service and keeps you informed throughout the job.",
  },
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

  const panelServices = services.slice(0, 6).map((service) => ({
    id: service.id,
    name: service.name,
    label: getServiceCategory(service.name).label,
  }));



  return (
    <main className="bg-navy-950 text-white">
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
  }}
/>
      <ScrollReveal />

      <Hero bookHref={bookHref} services={panelServices} />

      {/* Everything below slides over the pinned hero */}
      <div
        id="home-cover"
        className="relative z-10 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.6)]"
      >

        {/* SERVICES */}
        <section className="border-t border-white/10 bg-graphite-900">
          <div className="container-page grid gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">

            <div className="lg:sticky lg:top-24 lg:self-start">
              <p
                data-reveal
                className="text-xs font-medium uppercase tracking-widest text-white/50"
              >
                What we do
              </p>
              <h2
                data-reveal
                className="mt-4 font-display text-4xl font-normal leading-[1.02] tracking-[-0.035em] md:text-5xl lg:text-6xl"
              >
                Our services
              </h2>
              <p
                data-reveal
                className="mt-5 max-w-sm text-base leading-7 text-white/55"
              >
                ECU tuning, diagnostics, programming and repairs for cars and
                trucks.
              </p>
              <Link
                data-reveal
                href="/services"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
              >
                View all services
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div data-stagger className="border-t border-white/10">
              {services.map((service, i) => {
                const category = getServiceCategory(service.name);

                return (
                  <Link
                    key={service.id}
                    data-stagger-item
                    href={bookHref}
                    className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.03] md:grid-cols-[3.5rem_1fr_auto]"
                  >
                    <span className="pt-1.5 text-xs tabular-nums text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-normal tracking-tight md:text-2xl">
                        {service.name}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-xs text-white/40">
                        {category.label}
                      </span>
                      <ArrowUpRight
                        size={18}
                        className="text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white text-navy-950">
          <div className="container-page py-20 md:py-28">

            <div className="max-w-2xl">
              <p
                data-reveal
                className="text-xs font-medium uppercase tracking-widest text-steel-500"
              >
                Simple process
              </p>
              <h2
                data-reveal
                className="mt-4 font-display text-4xl font-normal leading-[1.02] tracking-[-0.035em] md:text-5xl lg:text-6xl"
              >
                Get your vehicle serviced
              </h2>
              <p
                data-reveal
                className="mt-5 max-w-md text-base leading-7 text-steel-500"
              >
                From booking to completion, we keep the process
                straightforward.
              </p>
            </div>

            <div className="mt-16 md:mt-24">
              <div
                data-line
                className="mb-10 h-px w-full origin-left bg-navy-950/15"
              />
              <div
                data-stagger
                className="grid gap-12 md:grid-cols-3 md:gap-10"
              >
                {STEPS.map((step) => (
                  <div key={step.number} data-stagger-item>
                    <span className="font-display text-6xl font-light tracking-tight text-steel-300 md:text-7xl">
                      {step.number}
                    </span>
                    <h3 className="mt-6 font-display text-xl font-normal tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-steel-500">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}