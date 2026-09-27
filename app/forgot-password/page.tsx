"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-sm mx-auto mt-12 text-center space-y-3">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="text-gray-600 text-sm">
          If an account exists for {email}, a password reset link has been
          sent.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-12 space-y-4">
      <h1 className="text-xl font-semibold">Reset your password</h1>
      <p className="text-gray-600 text-sm">
        Enter your email and we will send you a link to reset your password.
      </p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}