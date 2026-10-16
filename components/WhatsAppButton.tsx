import Link from "next/link";

export default function WhatsAppButton() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50">
      <div className="container-page flex justify-end">
        <div className="pointer-events-auto relative">
          <span className="keep-round absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
          <Link
            href="https://wa.me/263777973410"
            aria-label="Chat with us on WhatsApp"
            className="keep-round relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}