"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Check Your Email</h1>
          <p className="auth-subtitle">
            We sent a reset link to <strong>{email}</strong>. Click the link in
            the email to set a new password.
          </p>
          <Link href="/login" className="btn-primary btn-full" style={{ marginTop: '16px' }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Forgot Password?</h1>
        <p className="auth-subtitle">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit}>
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

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-footer">
          <Link href="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
