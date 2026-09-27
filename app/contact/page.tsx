import Link from "next/link";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;
  const contactSent = sent === "true";

  return (
    <main className="min-h-screen bg-white text-navy-950">

      <section>
        <div className="container-page py-20">

          {/* Headline, standalone above the panels */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-orange-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              Get in touch
            </p>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl leading-[1.1] tracking-tight max-w-2xl">
            Tell us about your vehicle,
            <br />
            we&apos;ll get it sorted.
          </h1>

          {/* Two panels */}
          <div className="mt-14 grid md:grid-cols-2 gap-6">

            {/* Left: form, plain grey panel */}
            <div className="rounded-[1.5rem] bg-fog-100 p-8">
              {contactSent ? (
                <div className="rounded-lg bg-white border border-steel-500/10 p-4 text-sm">
                  Thanks — your message has been sent. We will be in touch
                  shortly.
                </div>
              ) : (
                <form action={submitContactForm} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      name="name"
                      placeholder="Name"
                      required
                      className="w-full rounded-lg bg-white border border-steel-500/15 px-4 py-3 text-sm placeholder:text-steel-500/60 focus:outline-none focus:border-orange-500"
                    />
                    <input
                      name="contact"
                      placeholder="Phone or email"
                      required
                      className="w-full rounded-lg bg-white border border-steel-500/15 px-4 py-3 text-sm placeholder:text-steel-500/60 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    required
                    rows={6}
                    className="w-full rounded-lg bg-white border border-steel-500/15 px-4 py-3 text-sm placeholder:text-steel-500/60 focus:outline-none focus:border-orange-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-navy-950/90"
                  >
                    Send Message
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>

            {/* Right: solid info panel */}
            <div className="rounded-[1.5rem] bg-navy-950 text-white p-8 flex flex-col justify-between">

              <div className="space-y-7">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    Workshop
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-sm">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-orange-500" />
                    Cnr Crowborough &amp; Heany Rd, Warren Park D, Harare
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    Phone / WhatsApp
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    <Phone size={16} className="shrink-0 text-orange-500" />
                    <span>
                      <Link href="tel:+263771250250" className="hover:text-white/80">
                        +263 771 250 250
                      </Link>
                      {" / "}
                      <Link href="tel:+263782341400" className="hover:text-white/80">
                        +263 782 341 400
                      </Link>
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    Email
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    <Mail size={16} className="shrink-0 text-orange-500" />
                    <Link
                      href="mailto:admin@tamroexpress.co.zw"
                      className="hover:text-white/80"
                    >
                      admin@tamroexpress.co.zw
                    </Link>
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10">
                <Link
                  href="https://wa.me/YOURNUMBER"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
                  </svg>
                  Chat on WhatsApp
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}