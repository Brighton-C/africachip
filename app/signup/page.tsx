"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createUserRecord } from "@/lib/actions/user";

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
    <form onSubmit={handleSignUp} className="max-w-sm mx-auto mt-12 space-y-4">
      <h1 className="text-xl font-semibold">Create an account</h1>

      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
  type="tel"
  placeholder="Phone number (e.g. 0771234567)"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
  className="w-full border rounded px-3 py-2"
/>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        className="w-full border rounded px-3 py-2"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}