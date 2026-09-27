import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight } from "lucide-react";
import { getServiceCategory } from "@/lib/serviceCategory";
import { createClient } from "@/lib/supabase/server";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

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
    <main className="min-h-screen bg-fog-100 text-navy-950">

      {/* Header card */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 lg:px-8">
          <div className="rounded-[2rem] bg-orange-500/10 p-7 shadow-sm md:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              What we do
            </p>
            <h1 className="mt-2 font-display font-bold text-3xl md:text-4xl tracking-tight">
              Our Services
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-steel-500">
              Performed only where legally permitted for the vehicle&apos;s
              registration, use, and jurisdiction.
            </p>
          </div>
        </div>
      </section>

      {/* Services card */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10">

            {chunkArray(services, 4).map((row, rowIndex) => (
              <div key={rowIndex} className="relative mb-14 last:mb-0">

                {row.length > 1 && (
                  <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-steel-500/20" />
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                  {row.map((service, i) => {
                    const category = getServiceCategory(service.name);
                    const Icon = category.icon;
                    const globalIndex = rowIndex * 4 + i;

                    return (
                      <div
                        key={service.id}
                        className="relative text-center md:text-left"
                      >
                        <div className="relative z-10 mx-auto md:mx-0 w-12 h-12 rounded-full bg-white border border-steel-500/20 flex items-center justify-center">
                          <Icon size={20} className="text-orange-500" />
                        </div>

                        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-orange-500">
                          {String(globalIndex + 1).padStart(2, "0")}{" "}
                          {category.label}
                        </p>

                        <h3 className="mt-1 font-display font-semibold">
                          {service.name}
                        </h3>

                        <p className="mt-1 text-sm text-steel-500 leading-6">
                          {service.description}
                        </p>

                        {service.price && (
                          <p className="mt-2 text-sm font-semibold text-navy-950">
                            ${service.price.toString()}
                          </p>
                        )}

                        <Link
                          href={bookHref}
                          className="mt-3 inline-flex items-center justify-center md:justify-start gap-1 text-xs font-medium text-orange-500"
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
        </div>
      </section>

    </main>
  );
}