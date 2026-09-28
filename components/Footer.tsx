import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-fog-100 border-t border-steel-500/10 mt-auto">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Workshop details */}
          <div>
            <h3 className="font-display font-semibold text-sm text-navy-950">
              Harare Workshop
            </h3>
            <div className="mt-4 space-y-3 text-sm text-steel-500">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-steel-500" />
                Cnr Crowborough &amp; Heany Rd, Warren Park D
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-steel-500" />
                <span>
                  <Link href="tel:+263771250250" className="hover:text-navy-950">
                    +263 771 250 250
                  </Link>
                  {" / "}
                  <Link href="tel:+263782341400" className="hover:text-navy-950">
                    +263 782 341 400
                  </Link>
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-steel-500" />
                <Link
                  href="mailto:admin@tamroexpress.co.zw"
                  className="hover:text-navy-950"
                >
                  admin@tamroexpress.co.zw
                </Link>
              </p>
            </div>
          </div>

          {/* Tamro Express links */}
          <div>
            <h3 className="font-display font-semibold text-sm text-navy-950">
              Tamro Express
            </h3>
            <div className="mt-4 space-y-2 text-sm text-steel-500">
              <Link
                href="https://tamroexpress.co.zw"
                className="block hover:text-navy-950"
              >
                Main Website
              </Link>
              <Link
                href="https://tamroexpress.co.zw/shop-3/"
                className="block hover:text-navy-950"
              >
                Tamro Express Shop
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display font-semibold text-sm text-navy-950">
              Follow Us
            </h3>
            <div className="mt-4 flex gap-3">
              <Link
                href="https://www.facebook.com/DPFADBLUEDELETEHARARE"
                className="w-9 h-9 rounded-full bg-white border border-steel-500/15 flex items-center justify-center text-steel-500 hover:text-orange-500 hover:border-orange-500/30"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
                </svg>
              </Link>
              <Link
                href="https://www.facebook.com/DPFADBLUEDELETEHARARE"
                className="w-9 h-9 rounded-full bg-white border border-steel-500/15 flex items-center justify-center text-steel-500 hover:text-orange-500 hover:border-orange-500/30"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-1.27.06-2.15.27-2.91.57a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .62 4.15c-.3.76-.51 1.64-.57 2.91C0 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.57 2.91.31.79.72 1.46 1.39 2.13a5.9 5.9 0 0 0 2.13 1.39c.76.3 1.64.51 2.91.57 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.57a5.9 5.9 0 0 0 2.13-1.39 5.9 5.9 0 0 0 1.39-2.13c.3-.76.51-1.64.57-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.57-2.91a5.9 5.9 0 0 0-1.39-2.13A5.9 5.9 0 0 0 19.86.64c-.76-.3-1.64-.51-2.91-.57C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.4-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z" />
                </svg>
              </Link>
              
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-steel-500/10 text-xs text-steel-500">
          © {year} Tamro Express. All rights reserved.
        </div>
      </div>
    </footer>
  );
}