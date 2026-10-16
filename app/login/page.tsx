"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  eyebrowClass,
  adminTitleClass,
  labelClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetSuccess = searchParams.get("reset") === "success";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/account");
  }

  return (
    <div className="container-page pb-24 pt-16 md:pt-24">
      <p className={eyebrowClass}>Account</p>
      <h1 className={adminTitleClass}>Log in</h1>

      <form
        onSubmit={handleLogin}
        className="mt-10 max-w-sm space-y-5 border-t border-fog-200 pt-10"
      >
        {resetSuccess && (
          <p className="border border-fog-200 bg-fog-100 px-4 py-3 text-sm text-navy-950">
            Your password has been updated. Please log in.
          </p>
        )}

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
            className={inputClass}
          />
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-steel-500 underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`${primaryButtonClass} w-full disabled:opacity-50`}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-steel-500">
          No account yet?{" "}
          <Link
            href="/signup"
            className="text-navy-950 underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}