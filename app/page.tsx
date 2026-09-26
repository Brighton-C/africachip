import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
    take: 4,
  });

  return (
    <div>
      <section className="max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold">
          ECU Remapping and Diagnostics
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Book a service for your vehicle. We handle the rest.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/signup" className="bg-black text-white rounded px-6 py-3">
            Book a Service
          </Link>
          <Link href="/services" className="border rounded px-6 py-3">
            View Services
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-medium">Diagnostics first</h3>
          <p className="text-gray-600 text-sm mt-1">
            We tell you what is wrong before any work starts.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Workshop or your location</h3>
          <p className="text-gray-600 text-sm mt-1">
            Book at our workshop, or have us come to you.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Direct contact</h3>
          <p className="text-gray-600 text-sm mt-1">
            Reach us on WhatsApp, not a support ticket.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 border-t">
        <h2 className="text-xl font-semibold mb-6">Services</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="border rounded p-4">
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            </div>
          ))}
        </div>
        <Link href="/services" className="inline-block mt-6 underline">
          View all services
        </Link>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 border-t">
        <h2 className="text-xl font-semibold mb-6">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-2xl font-semibold text-gray-400">1</div>
            <h3 className="font-medium mt-1">Request a service</h3>
            <p className="text-gray-600 text-sm mt-1">
              Pick your vehicle and service, submit online.
            </p>
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-400">2</div>
            <h3 className="font-medium mt-1">We confirm and schedule</h3>
            <p className="text-gray-600 text-sm mt-1">
              Our team confirms details and books you in.
            </p>
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-400">3</div>
            <h3 className="font-medium mt-1">We complete the job</h3>
            <p className="text-gray-600 text-sm mt-1">
              At our workshop or your location.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-700 mb-4">
            Questions before booking? Message us on WhatsApp.
          </p>
          
           <a href="https://wa.me/263771648305"
            className="inline-block bg-green-600 text-white rounded px-6 py-3"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}