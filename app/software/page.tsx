import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import { eyebrowClass, pageTitleClass } from "@/lib/ui";

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
    <main className="min-h-screen bg-white text-navy-950">
      {/* Header */}
      <section>
        <div className="container-page pb-14 pt-16 md:pb-20 md:pt-24">
          <p className={eyebrowClass}>Vehicle software</p>
          <h1 className={pageTitleClass}>Software</h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-steel-500 md:text-base md:leading-7">
            Vehicle software available through AfricaChip. Message us on
            WhatsApp to ask about a product, its price or compatibility.
          </p>
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="container-page pb-24">
          {products.length === 0 ? (
            <div className="border-t border-fog-200 py-12">
              <p className="text-sm text-steel-500">
                No software is listed right now.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block text-sm font-medium text-navy-950 underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                Contact us to enquire
              </Link>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-16 border-t border-fog-200 pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, i) => (
                <div key={product.id} className="flex flex-col">
                  <p className="font-display text-5xl font-normal leading-none tracking-[-0.04em] text-steel-300 lg:text-6xl">
                    {String(i + 1).padStart(2, "0")}
                  </p>

                  <h2 className="mt-8 font-display text-lg font-normal">
                    {product.name}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-steel-500">
                    {product.description}
                  </p>

                  {product.price && (
                    <p className="mt-4 text-sm text-navy-950">
                      ${product.price.toString()}
                    </p>
                  )}

                  <Link
                    href={enquiryHref(product.name)}
                    className="mt-5 inline-flex items-center justify-center gap-2 self-start bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
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
      </section>
    </main>
  );
}