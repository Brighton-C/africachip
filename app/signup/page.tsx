"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createUserRecord } from "@/lib/actions/user";
import {
  eyebrowClass,
  adminTitleClass,
  labelClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }, // stored in auth.users metadata
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      await createUserRecord(data.user.id, name, email, phone);
    }

    router.push("/account");
  }

  return (
    <div className="container-page pb-24 pt-16 md:pt-24">
      <p className={eyebrowClass}>Account</p>
      <h1 className={adminTitleClass}>Create an account</h1>

      <form
        onSubmit={handleSignUp}
        className="mt-10 max-w-sm space-y-5 border-t border-fog-200 pt-10"
      >
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="e.g. 0771234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`${primaryButtonClass} w-full disabled:opacity-50`}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm text-steel-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-navy-950 underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}