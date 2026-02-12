"use client";

import { useEffect, useRef, useState } from "react";

interface RosterMember {
  name: string;
  dojo_name: string;
  enrolled_at: string;
}

interface PendingMember {
  id: number;
  name: string;
  dojo_name: string;
  enrolled_at: string;
}

export default function Roster() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [members, setMembers] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Sensei login state
  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [senseiPassword, setSenseiPassword] = useState("");

  // Pending members state
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [actioningId, setActioningId] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/roster")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchPending = async (password: string) => {
    setPendingLoading(true);
    try {
      const res = await fetch("/api/roster?pending=true", {
        headers: { "x-sensei-password": password },
      });
      if (res.status === 401) return;
      const data = await res.json();
      if (Array.isArray(data)) setPendingMembers(data);
    } catch {
      // silently fail
    } finally {
      setPendingLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    try {
      const res = await fetch("/api/roster?pending=true", {
        headers: { "x-sensei-password": loginPassword },
      });

      if (res.status === 401) {
        setLoginError("The cobra rejects you.");
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) setPendingMembers(data);
      setSenseiPassword(loginPassword);
      setShowLogin(false);
    } catch {
      setLoginError("Something went wrong. Try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleAction = async (id: number, status: "APPROVED" | "REJECTED") => {
    setActioningId(id);
    try {
      const res = await fetch("/api/roster", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, password: senseiPassword }),
      });

      if (!res.ok) return;

      const updated = await res.json();

      // Remove from pending list
      setPendingMembers((prev) => prev.filter((m) => m.id !== id));

      // If approved, add to approved roster
      if (status === "APPROVED") {
        const member = pendingMembers.find((m) => m.id === id);
        if (member) {
          setMembers((prev) => [
            { name: member.name, dojo_name: member.dojo_name, enrolled_at: member.enrolled_at },
            ...prev,
          ]);
        }
      }
    } catch {
      // silently fail
    } finally {
      setActioningId(null);
    }
  };

  const isLoggedIn = !!senseiPassword;

  return (
    <section
      ref={ref}
      id="roster"
      className="py-24 px-4 bg-cobra-black border-t-4 border-cobra-yellow"
    >
      <div className="max-w-5xl mx-auto">
        <div
          className={`transition-all duration-700 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-cobra-yellow mb-4 text-center">
            The Roster
          </h2>
          <p className="text-center font-mono text-cobra-gold uppercase tracking-wider text-sm mb-12">
            Warriors who answered the call
          </p>
        </div>

        {/* Sensei Pending Recruits Section */}
        {isLoggedIn && (
          <div
            className={`mb-12 transition-all duration-700 delay-100 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold uppercase text-cobra-red">
                Pending Recruits
              </h3>
              <button
                onClick={() => fetchPending(senseiPassword)}
                className="font-mono text-cobra-gold text-xs uppercase tracking-wider hover:text-cobra-yellow transition-colors"
              >
                Refresh
              </button>
            </div>

            {pendingLoading ? (
              <p className="font-mono text-cobra-gold text-sm uppercase tracking-wider animate-pulse">
                Loading pending recruits...
              </p>
            ) : pendingMembers.length === 0 ? (
              <div
                className="bg-cobra-dark border-3 border-cobra-red/30 p-6 text-center"
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                <p className="font-mono text-cobra-gold text-sm uppercase tracking-wider">
                  No pending recruits
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-cobra-dark border-3 border-cobra-red p-5"
                    style={{ boxShadow: "4px 4px 0px #c41e1e" }}
                  >
                    <span className="text-cobra-yellow font-bold uppercase text-lg truncate block mb-1">
                      {member.name}
                    </span>
                    <p className="font-mono text-cobra-gold text-sm mb-4">
                      &ldquo;{member.dojo_name}&rdquo;
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(member.id, "APPROVED")}
                        disabled={actioningId === member.id}
                        className="flex-1 bg-green-600 text-white font-bold uppercase text-xs tracking-wider py-2 border-3 border-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                        style={{ boxShadow: "3px 3px 0px #000" }}
                      >
                        {actioningId === member.id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleAction(member.id, "REJECTED")}
                        disabled={actioningId === member.id}
                        className="flex-1 bg-cobra-red text-white font-bold uppercase text-xs tracking-wider py-2 border-3 border-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                        style={{ boxShadow: "3px 3px 0px #000" }}
                      >
                        {actioningId === member.id ? "..." : "Reject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Public Roster */}
        {loading ? (
          <p className="text-center font-mono text-cobra-gold text-sm uppercase tracking-wider animate-pulse">
            Loading roster...
          </p>
        ) : members.length === 0 ? (
          <div
            className={`transition-all duration-700 delay-200 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className="bg-cobra-dark border-3 border-cobra-red p-8 text-center max-w-md mx-auto"
              style={{ boxShadow: "8px 8px 0px #000" }}
            >
              <p className="text-cobra-yellow font-bold uppercase text-lg mb-2">
                No warriors yet
              </p>
              <p className="text-foreground font-mono text-sm">
                Be the first to enroll and claim your dojo name.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 delay-200 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {members.map((member, i) => (
              <div
                key={`${member.name}-${i}`}
                className="bg-cobra-dark border-3 border-cobra-yellow p-5"
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                <span className="text-cobra-yellow font-bold uppercase text-lg truncate block mb-1">
                  {member.name}
                </span>
                <p className="font-mono text-cobra-gold text-sm">
                  &ldquo;{member.dojo_name}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Sensei Login */}
        {!isLoggedIn && (
          <div className="mt-12 text-center">
            {!showLogin ? (
              <button
                onClick={() => setShowLogin(true)}
                className="font-mono text-cobra-gold/30 text-xs uppercase tracking-wider hover:text-cobra-gold transition-colors"
              >
                Sensei Login
              </button>
            ) : (
              <div className="max-w-sm mx-auto">
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
                      disabled={loggingIn}
                      className="flex-1 flex items-center justify-center gap-2 bg-cobra-red text-white font-bold uppercase tracking-wider py-3 border-3 border-black text-sm disabled:opacity-70 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
                      style={{ boxShadow: loggingIn ? "none" : "4px 4px 0px #FFE66D" }}
                    >
                      {loggingIn ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" strokeLinecap="round" />
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        "Enter"
                      )}
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
            )}
          </div>
        )}
      </div>
    </section>
  );
}
