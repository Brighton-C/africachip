import Link from "next/link";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";

const inputClass =
  "w-full border border-fog-200 bg-white px-4 py-3 text-sm text-navy-950 placeholder:text-steel-400 transition-colors focus:border-navy-950 focus:outline-none";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;
  const contactSent = sent === "true";

  return (
    <main className="min-h-screen bg-white text-navy-950">
      {/* Header */}
      <section>
        <div className="container-page pb-14 pt-16 md:pb-20 md:pt-24">
          <p className="text-xs uppercase tracking-widest text-steel-500">
            Get in touch
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-normal leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Tell us about your vehicle, we&apos;ll get it sorted.
          </h1>
        </div>
      </section>

      {/* Details + form */}
      <section>
        <div className="container-page">
          <div className="grid gap-16 border-t border-fog-200 pb-24 pt-12 md:grid-cols-2 md:gap-12 md:pt-16 lg:gap-24">
            {/* Left: contact details */}
            <div>
              <h2 className="font-display text-2xl font-normal tracking-[-0.03em] sm:text-3xl">
                Need more information?
                <br />
                Get in touch with us.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-steel-500">
                Visit our Harare workshop, call or message us. We also come to
                you.
              </p>

              <ul className="mt-10 space-y-7">
                <li className="flex items-start gap-4">
                  <span className="keep-round flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fog-100 text-navy-950">
                    <MapPin size={17} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-steel-500">
                      Workshop
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-navy-950">
                      Cnr Crowborough &amp; Heany Rd, Warren Park D, Harare
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="keep-round flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fog-100 text-navy-950">
                    <Phone size={17} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-steel-500">
                      Phone / WhatsApp
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-navy-950">
                      <Link
                        href="tel:+263771250250"
                        className="transition-opacity hover:opacity-60"
                      >
                        +263 771 250 250
                      </Link>
                      {" / "}
                      <Link
                        href="tel:+263782341400"
                        className="transition-opacity hover:opacity-60"
                      >
                        +263 782 341 400
                      </Link>
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="keep-round flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fog-100 text-navy-950">
                    <Mail size={17} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-steel-500">
                      Email
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-navy-950">
                      <Link
                        href="mailto:admin@tamroexpress.co.zw"
                        className="transition-opacity hover:opacity-60"
                      >
                        admin@tamroexpress.co.zw
                      </Link>
                    </p>
                  </div>
                </li>
              </ul>

              <Link
                href="https://wa.me/263777973410"
                className="mt-10 inline-flex items-center gap-2 bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
                </svg>
                Chat on WhatsApp
              </Link>
            </div>

            {/* Right: form */}
            <div>
              <h2 className="font-display text-2xl font-normal tracking-[-0.03em] sm:text-3xl">
                Send a message
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-steel-500">
                Fill out the form below with your details and we&apos;ll be in
                touch shortly.
              </p>

              {contactSent ? (
                <div className="mt-10 border border-fog-200 bg-fog-100 p-5 text-sm leading-6 text-navy-950">
                  Thanks, your message has been sent. We will be in touch
                  shortly.
                </div>
              ) : (
                <form action={submitContactForm} className="mt-10 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="name"
                      placeholder="Name"
                      required
                      className={inputClass}
                    />
                    <input
                      name="contact"
                      placeholder="Phone or email"
                      required
                      className={inputClass}
                    />
                  </div>
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    required
                    rows={7}
                    className={`${inputClass} resize-none`}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-navy-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-navy-950/90"
                  >
                    Send message
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}