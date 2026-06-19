"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Store Owner Login</h1>
        <p className="auth-subtitle">Sign in to manage your store</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
          </div>

          <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '16px' }}>
            <Link href="/forgot-password" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Forgot password?
            </Link>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Want to sell laptops?{" "}
          <Link href="/signup">Apply for a store</Link>
        </p>
      </div>
    </div>
  );
}
