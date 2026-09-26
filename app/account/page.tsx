import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>
      <div className="space-y-3">
        <Link href="/account/vehicles" className="block underline">
          My Vehicles
        </Link>
        <Link href="/account/bookings/new" className="block underline">
          Request a Service
        </Link>
      </div>
    </div>
  );
}