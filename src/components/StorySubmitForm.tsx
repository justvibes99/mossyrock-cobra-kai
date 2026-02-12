"use client";

import { useState } from "react";

interface StorySubmitFormProps {
  loggedIn: boolean;
  onLogin: (password: string) => void;
  onStoryCreated: () => void;
  password: string;
}

export default function StorySubmitForm({ loggedIn, onLogin, onStoryCreated, password }: StorySubmitFormProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [screenplay, setScreenplay] = useState<string | null>(null);
  const [polished, setPolished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("/api/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "test", password: loginPassword }),
      });

      if (res.status === 401) {
        setLoginError("The cobra rejects you.");
        return;
      }

      onLogin(loginPassword);
      setShowLogin(false);
    } catch {
      setLoginError("Something went wrong. Try again.");
    }
  };

  const handlePolish = async () => {
    if (!body.trim()) {
      setError("Write something first, recruit.");
      return;
    }
    setPolishing(true);
    setError("");

    try {
      const res = await fetch("/api/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Polish failed");
        return;
      }

      if (data.story) {
        setBody(data.story);
        setScreenplay(data.screenplay || null);
        setPolished(true);
      }
    } catch {
      setError("Polish failed. Try again.");
    } finally {
      setPolishing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt: body, genre: "Fan Fiction", screenplay, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Submission failed");
        return;
      }

      setSuccess(true);
      setTitle("");
      setBody("");
      setScreenplay(null);
      setPolished(false);
      setOpen(false);
      onStoryCreated();

      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Submission failed. The scrolls are unresponsive.");
    } finally {
      setSubmitting(false);
    }
  };

  // Not logged in
  if (!loggedIn) {
    if (!showLogin) {
      return (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowLogin(true)}
            className="font-mono text-cobra-gold/50 text-xs uppercase tracking-wider hover:text-cobra-gold transition-colors"
          >
            Sensei Login
          </button>
        </div>
      );
    }

    return (
      <div className="mt-8 max-w-sm mx-auto">
        <form
          onSubmit={handleLogin}
          className="bg-cobra-dark border-3 border-cobra-yellow p-6"
          style={{ boxShadow: "4px 4px 0px #000" }}
        >
          <label className="block font-mono text-cobra-gold uppercase tracking-wider text-sm mb-2">
            Sensei Password
          </label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Only Sensei Russ knows..."
            className="w-full bg-cobra-black text-foreground border-3 border-cobra-red p-3 font-mono text-sm focus:border-cobra-yellow focus:outline-none placeholder:text-foreground/30 mb-4"
            style={{ boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.3)" }}
            required
            autoFocus
          />
          {loginError && (
            <p className="text-cobra-red font-mono text-sm uppercase mb-4">{loginError}</p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-cobra-red text-white font-bold uppercase tracking-wider py-3 border-3 border-black text-sm"
              style={{ boxShadow: "3px 3px 0px #FFE66D" }}
            >
              Enter
            </button>
            <button
              type="button"
              onClick={() => { setShowLogin(false); setLoginError(""); }}
              className="text-cobra-gold font-mono text-sm uppercase hover:text-cobra-yellow px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Logged in, form closed
  if (!open) {
    return (
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="bg-cobra-yellow text-black font-bold uppercase tracking-wider px-6 py-3 border-3 border-black text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          style={{ boxShadow: "4px 4px 0px #000" }}
        >
          + New Story
        </button>
        {success && (
          <span className="text-green-400 font-mono text-sm uppercase">
            Story published!
          </span>
        )}
      </div>
    );
  }

  // Story form
  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-cobra-dark border-3 border-cobra-yellow p-8"
        style={{ boxShadow: "8px 8px 0px #c41e1e" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-cobra-yellow uppercase">
            New Story
          </h3>
          <button
            type="button"
            onClick={() => { setOpen(false); setPolished(false); setScreenplay(null); }}
            className="text-cobra-gold font-mono text-sm uppercase hover:text-cobra-yellow"
          >
            Close
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block font-mono text-cobra-gold uppercase tracking-wider text-sm mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the saga's name..."
            maxLength={200}
            className="w-full bg-cobra-black text-foreground border-3 border-cobra-red p-4 font-bold text-lg focus:border-cobra-yellow focus:outline-none placeholder:text-foreground/30"
            style={{ boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.3)" }}
            required
          />
        </div>

        {/* Body */}
        <div className="mb-6">
          <label className="block font-mono text-cobra-gold uppercase tracking-wider text-sm mb-2">
            {polished ? "Polished Story" : "Draft"}
          </label>
          <textarea
            value={body}
            onChange={(e) => { setBody(e.target.value); setPolished(false); setScreenplay(null); }}
            placeholder="Write your rough draft... the cobra will polish it."
            rows={8}
            maxLength={10000}
            className="w-full bg-cobra-black text-foreground border-3 border-cobra-red p-4 font-mono text-sm focus:border-cobra-yellow focus:outline-none resize-none placeholder:text-foreground/30"
            style={{ boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.3)" }}
            required
          />
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-cobra-gold/50 text-xs">
              {body.length}/10,000
            </span>
            {!polished && (
              <button
                type="button"
                onClick={handlePolish}
                disabled={polishing || !body.trim()}
                className="font-mono text-xs uppercase tracking-wider px-4 py-2 border-2 border-cobra-gold text-cobra-gold hover:bg-cobra-gold hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {polishing ? "Polishing..." : "Polish & Write Screenplay"}
              </button>
            )}
            {polished && (
              <span className="font-mono text-green-400 text-xs uppercase tracking-wider">
                Polished & screenplay ready
              </span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-cobra-red/20 border-3 border-cobra-red p-4">
            <p className="text-cobra-red font-mono text-sm uppercase">
              {error}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-cobra-red text-white font-bold text-lg uppercase tracking-wider px-8 py-4 border-3 border-black disabled:opacity-50"
          style={{ boxShadow: "4px 4px 0px #FFE66D" }}
        >
          {submitting ? "Submitting..." : "Publish Story"}
        </button>
      </form>
    </div>
  );
}
