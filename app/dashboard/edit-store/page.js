"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditStorePage() {
  const supabase = createClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    storeName: "",
    whatsapp: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (store) {
        setFormData({
          storeName: store.store_name || "",
          whatsapp: store.whatsapp_number || "",
          phoneNumber: store.phone_number || "",
          address: store.address || "",
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/update-store", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeName: formData.storeName,
        whatsappNumber: formData.whatsapp,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
            Loading store info...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Edit Store Info</h1>
        <p className="auth-subtitle">Update your store details</p>

        {success && (
          <div className="alert alert-success">
            Saved! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder=" "
            />
            <label htmlFor="address">Shop Full Address</label>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <p className="auth-footer">
          <Link href="/dashboard">← Back to Dashboard</Link>
        </p>
      </div>
    </div>
  );
}
