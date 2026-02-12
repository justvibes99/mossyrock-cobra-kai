"use client";

import { useEffect, useRef, useState } from "react";
import { dojoNames } from "@/lib/dojo-names";

const dramaticMessages = [
  "Sensei Russ has been notified of your application...",
  "Your commitment is being measured by ancient Cobra Kai algorithms...",
  "Checking if you are worthy of the Mossyrock legacy...",
  "Consulting the sacred scrolls...",
  "The cobra has spoken...",
];

export default function EnrollForm() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [dojoName, setDojoName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setLoadingMsg(0);
    setError("");

    // Start dramatic loading sequence
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex++;
      if (msgIndex >= dramaticMessages.length) {
        clearInterval(interval);
      } else {
        setLoadingMsg(msgIndex);
      }
    }, 800);

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();

      // Wait for dramatic sequence to finish
      const elapsed = msgIndex;
      const remaining = dramaticMessages.length - 1 - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining * 800));
      }

      clearInterval(interval);

      if (!res.ok) {
        setError(data.error || "Enrollment failed");
        setLoading(false);
        return;
      }

      setDojoName(data.dojo_name || dojoNames[Math.floor(Math.random() * dojoNames.length)]);
      setLoading(false);
      setSubmitted(true);
    } catch {
      clearInterval(interval);
      setError("The cobra is unreachable. Try again.");
      setLoading(false);
    }
  };

  return (
    <section
      ref={ref}
      id="enroll"
      className="py-24 px-4 bg-cobra-dark border-t-4 border-cobra-yellow"
    >
      <div className="max-w-2xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-cobra-yellow mb-4 text-center">
            Enroll Now
          </h2>
          <p className="text-center font-mono text-cobra-gold uppercase tracking-wider text-sm mb-12">
            Submit your application to the Mossyrock Cobra Kai
          </p>
        </div>

        <div className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {submitted ? (
            /* Acceptance */
            <div
              className="bg-cobra-black border-3 border-cobra-yellow p-8 text-center"
              style={{ boxShadow: "8px 8px 0px #c41e1e" }}
            >
              <div className="mb-6">
                <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
                  <circle cx="50" cy="50" r="45" fill="#c41e1e" stroke="#FFE66D" strokeWidth="3" />
                  <path d="M30 50 L45 65 L70 35" stroke="#FFE66D" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-cobra-yellow uppercase mb-4">
                Application Received.
              </h3>
              <p className="text-foreground text-lg mb-6">
                <span className="text-cobra-yellow font-bold">{name}</span>, your application has been submitted to the Mossyrock Cobra Kai.
              </p>

              <div
                className="inline-block bg-cobra-yellow text-black font-bold text-xl uppercase px-6 py-3 border-3 border-black mb-6"
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                Your Dojo Name: &ldquo;{dojoName}&rdquo;
              </div>

              <p className="text-foreground text-sm mb-2">
                Sensei Russ will review your enrollment. Once approved, you&apos;ll appear on the roster.
              </p>
              <p className="font-mono text-cobra-red text-xs uppercase tracking-wider mt-4">
                The cobra is patient. Await your summons.
              </p>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setReason("");
                }}
                className="brutal-btn mt-8 bg-cobra-dark text-cobra-yellow font-bold uppercase tracking-wider px-6 py-3 border-3 border-cobra-yellow"
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                Enroll Another Warrior
              </button>
            </div>
          ) : loading ? (
            /* Loading */
            <div
              className="bg-cobra-black border-3 border-cobra-red p-8 text-center"
              style={{ boxShadow: "8px 8px 0px #000" }}
            >
              {/* Spinning cobra */}
              <div className="animate-spin w-16 h-16 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#c41e1e" strokeWidth="6" strokeDasharray="60 200" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#FFE66D" strokeWidth="4" strokeDasharray="40 160" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-cobra-yellow font-mono text-sm uppercase tracking-wider animate-pulse">
                {dramaticMessages[loadingMsg]}
              </p>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="bg-cobra-black border-3 border-cobra-yellow p-8"
              style={{ boxShadow: "8px 8px 0px #c41e1e" }}
            >
              {error && (
                <div className="mb-6 bg-cobra-red/20 border-3 border-cobra-red p-4">
                  <p className="text-cobra-red font-mono text-sm uppercase">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block font-mono text-cobra-gold uppercase tracking-wider text-sm mb-2">
                  Your Name, Recruit
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-cobra-dark text-foreground border-3 border-cobra-red p-4 font-bold text-lg focus:border-cobra-yellow focus:outline-none placeholder:text-foreground/30"
                  style={{ boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.3)" }}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block font-mono text-cobra-gold uppercase tracking-wider text-sm mb-2">
                  Why do you want to join Cobra Kai?
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Speak your truth..."
                  rows={4}
                  className="w-full bg-cobra-dark text-foreground border-3 border-cobra-red p-4 focus:border-cobra-yellow focus:outline-none resize-none placeholder:text-foreground/30"
                  style={{ boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.3)" }}
                />
              </div>

              <button
                type="submit"
                className="brutal-btn w-full bg-cobra-red text-white font-bold text-lg uppercase tracking-wider px-8 py-4 border-3 border-black"
                style={{ boxShadow: "4px 4px 0px #FFE66D" }}
              >
                Submit Application
              </button>

              <p className="font-mono text-cobra-gold text-xs text-center mt-4 uppercase tracking-wider">
                * All applications reviewed personally by Sensei Russ
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
