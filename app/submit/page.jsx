"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/useAuth";

export default function SubmitPage() {
  const { user, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({
    name: "",
    company_name: "",
    demo_link: "",
    category: "",
    short_description: "",
    long_description: "",
    pricing: "Free",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return signInWithGoogle();

    let cleanLink = form.demo_link.trim();
    if (!/^https?:\/\//i.test(cleanLink)) {
      cleanLink = "https://" + cleanLink;
    }

    setSubmitting(true);
    setErrorMsg("");
    const finalCategory = form.category === "Other" ? customCategory.trim() : form.category;

    const { error } = await supabase.from("models").insert({
      ...form,
      demo_link: cleanLink,
      category: finalCategory,
      created_by: user.id,
    });

    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setDone(true);
    setForm({
      name: "",
      company_name: "",
      demo_link: "",
      category: "",
      short_description: "",
      long_description: "",
      pricing: "Free",
    });
    setCustomCategory("");
  }

  return (
    <div className="submit-wrap">
      <div className="submit-head">
        <div className="eyebrow">Model Submission</div>
        <h2>List Your AI Model</h2>
        <p>Submit your model for the community to try and vote on. Every submission is reviewed before it goes live.</p>
      </div>

      {!user && (
        <div className="gate-box">
          <p>Sign in with Google to submit a model.</p>
          <button className="signin-btn" onClick={signInWithGoogle}>Sign in</button>
        </div>
      )}

      {done && (
        <div className="gate-box" style={{ background: "var(--up-soft)", borderColor: "var(--up)" }}>
          <p>Submitted — your model is live now, go check the Models page.</p>
        </div>
      )}

      {errorMsg && (
        <div className="gate-box" style={{ background: "var(--down-soft)", borderColor: "var(--down)" }}>
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Model Name</label>
          <input
            type="text"
            placeholder="e.g. ScriptWise"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Company / Creator Name</label>
            <input
              type="text"
              placeholder="e.g. Nova Labs"
              required
              value={form.company_name}
              onChange={(e) => update("company_name", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Website / Demo Link</label>
            <input
              type="url"
              placeholder="https://"
              required
              value={form.demo_link}
              onChange={(e) => update("demo_link", e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label>Category</label>
          <select
            required
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">Select a category</option>
            {["Writing", "Image", "Video", "Voice", "Coding", "Resume", "Chatbot", "Marketing", "Productivity", "Education", "Other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        {form.category === "Other" && (
          <div className="field">
            <label>Type your category</label>
            <input
              type="text"
              placeholder="e.g. Legal AI, Fitness Coach..."
              required
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        )}
        <div className="field">
          <label>
            Short Description <span className="hint">max 20 words</span>
          </label>
          <input
            type="text"
            placeholder="One line — what does it do?"
            required
            value={form.short_description}
            onChange={(e) => update("short_description", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Long Description</label>
          <textarea
            placeholder="Explain what your model does, who it's for, and what makes it different."
            value={form.long_description}
            onChange={(e) => update("long_description", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Pricing</label>
          <div className="radio-row">
            {["Free", "Paid"].map((p) => (
              <div
                key={p}
                className={`radio-pill ${form.pricing === p ? "selected" : ""}`}
                onClick={() => update("pricing", p)}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Model"}
        </button>
        <p className="status-note">Your model goes live immediately after submitting.</p>
      </form>
    </div>
  );
}
