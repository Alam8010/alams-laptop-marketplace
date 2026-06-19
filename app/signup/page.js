"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const supabase = createClient();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    whatsapp: "",
    phoneNumber: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;

    if (userId) {
      await supabase
        .from("profiles")
        .update({ full_name: formData.fullName })
        .eq("id", userId);

      await supabase.from("stores").insert({
        owner_id: userId,
        store_name: formData.storeName,
        whatsapp_number: formData.whatsapp,
        phone_number: formData.phoneNumber,
        address: formData.address,
        status: "pending",
      });
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Application Submitted!</h1>
          <p className="auth-subtitle">
            Check your email to confirm your account. Once confirmed, your store
            application will be reviewed by our team.
          </p>
          <Link href="/" className="btn-primary btn-full">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Apply for a Store</h1>
        <p className="auth-subtitle">Start selling laptops on laptopsellers</p>

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="fullName">Full Name</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="storeName">Store Name</label>
          </div>

          <div className="input-group">
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="whatsapp">WhatsApp Number</label>
          </div>

          <div className="input-group">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="phoneNumber">Shop Phone Number</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label htmlFor="address">Shop Full Address</label>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Apply Now"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
