"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  eyebrowClass,
  adminTitleClass,
  labelClass,
  inputClass,
  primaryButtonClass,
} from "@/lib/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("This reset link may have expired. Please request a new one.");
      return;
    }

    router.push("/login?reset=success");
  }

  return (
    <div className="container-page pb-24 pt-16 md:pt-24">
      <p className={eyebrowClass}>Account</p>
      <h1 className={adminTitleClass}>Set a new password</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-10 max-w-sm space-y-5 border-t border-fog-200 pt-10"
      >
        <div>
          <label htmlFor="password" className={labelClass}>
            New password
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

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}