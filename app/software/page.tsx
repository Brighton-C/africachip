import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WHATSAPP_NUMBER } from "@/lib/contact";

function enquiryHref(name: string) {
  const text = `Hi, I would like to enquire about ${name}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default async function SoftwarePage() {
  const products = await prisma.software.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-fog-100 text-navy-950">

      {/* Header card */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-8 lg:px-8">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              Vehicle software
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Software
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-steel-500">
              Vehicle software available through AfricaChip. Message us on
              WhatsApp to ask about a product, its price or compatibility.
            </p>
          </div>
        </div>
      </section>

      {/* Products card */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10">

            {products.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-steel-500">
                  No software is listed right now.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-block text-sm font-medium text-orange-500 underline"
                >
                  Contact us to enquire
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col rounded-2xl border border-steel-500/10 bg-fog-100 p-6"
                  >
                    <h2 className="font-display text-lg font-semibold">
                      {product.name}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-6 text-steel-500">
                      {product.description}
                    </p>
                    {product.price && (
                      <p className="mt-4 font-display font-semibold text-navy-950">
                        ${product.price.toString()}
                      </p>
                    )}
                    <Link
                      href={enquiryHref(product.name)}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
                      </svg>
                      Enquire on WhatsApp
                    </Link>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </section>

    </main>
  );
}