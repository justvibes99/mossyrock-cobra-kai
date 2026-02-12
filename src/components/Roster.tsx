"use client";

import { useEffect, useRef, useState } from "react";

interface RosterMember {
  name: string;
  dojo_name: string;
  path: string;
  enrolled_at: string;
}

const pathColors: Record<string, string> = {
  Warrior: "bg-cobra-red",
  Scholar: "bg-cobra-yellow text-black",
  Shadow: "bg-purple-600",
  Berserker: "bg-orange-500 text-black",
};

export default function Roster() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [members, setMembers] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(true);

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
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cobra-yellow font-bold uppercase text-lg truncate">
                    {member.name}
                  </span>
                  <span
                    className={`font-mono text-xs uppercase tracking-wider px-2 py-1 border-2 border-black ${
                      pathColors[member.path] ?? "bg-cobra-red"
                    }`}
                  >
                    {member.path}
                  </span>
                </div>
                <p className="font-mono text-cobra-gold text-sm">
                  &ldquo;{member.dojo_name}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
