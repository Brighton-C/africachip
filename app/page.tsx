import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ArrowUpRight, Gauge, Settings2, Wrench } from "lucide-react";
import { submitContactForm } from "@/lib/actions/contact";
import { 
  
  CalendarDays, 
  CheckCircle2, 
   
  MapPin, 
  MessageCircle, 
   
  
} from "lucide-react";

function getServiceCategory(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("stage") || lower.includes("remap")) {
    return { label: "Performance", icon: Gauge };
  }

  if (
    lower.includes("dpf") ||
    lower.includes("adblue") ||
    lower.includes("emission")
  ) {
    return { label: "Emissions", icon: Settings2 };
  }

  if (lower.includes("diagnostic")) {
    return { label: "Diagnostics", icon: Settings2 };
  }

  return { label: "Vehicle Service", icon: Wrench };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ contact?: string }>;
}) {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });
  const { contact } = await searchParams;
  const contactSent = contact === "sent";

  return (
    <main className="min-h-screen bg-fog-100 text-navy-950">

      {/* -------------------------------------------------- */}
      {/* HERO — headline + contact card, truck as background */}
      {/* -------------------------------------------------- */}

            <section className="relative overflow-hidden bg-white"> 
 
        <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-8"> 
 
           
 
 
          {/* Hero content */} 
          <div className="mt-10 grid gap-6 "> 
 
            {/* Main hero card */} 
            <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-white p-7 shadow-sm md:p-10"> 
 
              <div className="relative z-20 max-w-xl"> 
 
 
                <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-navy-950 md:text-6xl"> 
                  ECU performance 
                  <br /> 
                  <span className="text-steel-500"> 
                    & diagnostics 
                  </span> 
                </h1> 
 
                <p className="mt-5 max-w-md text-sm leading-6 text-steel-500 md:text-base"> 
                  Professional vehicle tuning, diagnostics and ECU services 
                  at our workshop or at your location. 
                </p> 
 
                <div className="mt-7 flex flex-wrap gap-3"> 
                  <Link 
                    href="/signup" 
                    className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-navy-950/90" 
                  > 
                    Book a service 
                    <ArrowRight size={16} /> 
                  </Link> 
 
                  <Link 
                    href="/services" 
                    className="rounded-xl border border-steel-500/15 bg-fog-100 px-5 py-3 text-sm font-medium text-navy-950 transition hover:bg-fog-100/70" 
                  > 
                    Explore services 
                  </Link> 
                </div> 
 
              </div> 
 
 
              {/* Vehicle image */} 
              <div className="absolute top-0 right-0 z-10 w-[80%] md:w-[62%] lg:w-[65%]">
                <div className="absolute inset-0 -z-10 rounded-full bg-orange-500/10 blur-3xl" /> 
 
                <Image 
                  src="/images/truck3.png" 
                  alt="Vehicle serviced by AfricaChip" 
                  width={1024} 
                  height={1024} 
                  priority 
                  className="h-auto w-full object-contain" 
                /> 
              </div> 
 
            </div> 
 
 
            {/* -------------------------------------------------- */} 
            {/* SERVICE ASSISTANT PANEL */} 
            {/* -------------------------------------------------- */} 
 
            

          </div>
        </div>


       

      </section>


      {/* -------------------------------------------------- */}
      {/* SERVICES — horizontal step-row style */}
      {/* -------------------------------------------------- */}

      <section className="bg-white">

        <div className="container-page py-20">

          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              What we do
            </p>
            <h2 className="mt-2 font-display font-bold text-3xl tracking-tight">
              Our services
            </h2>
          </div>

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

                      <Link
                        href="/signup"
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

      </section>


      {/* -------------------------------------------------- */}
      {/* HOW IT WORKS */}
      {/* -------------------------------------------------- */}

      <section className="bg-fog-100">

        <div className="container-page py-20">

          <div className="max-w-xl">

            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              Simple process
            </p>

            <h2 className="mt-2 font-display font-bold text-3xl tracking-tight">
              Get your vehicle serviced
            </h2>

            <p className="mt-3 text-sm leading-6 text-steel-500">
              From booking to completion, we keep the process straightforward.
            </p>

          </div>


          <div className="mt-10 grid gap-4 md:grid-cols-3">

            {[
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
            ].map((step) => (

              <div
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >

                <span className="font-display font-bold text-3xl text-orange-500">
                  {step.number}
                </span>

                <h3 className="mt-6 font-display font-semibold text-lg">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-steel-500">
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}



