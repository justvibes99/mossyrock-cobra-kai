"use client";

import { useEffect, useRef, useState } from "react";

const achievements = [
  { title: "All-Valley Under-50 Champion", year: "2023" },
  { title: "Pacific Northwest Kumite Gold", year: "2022" },
  { title: "Riffe Lake Iron Fist Tournament Victor", year: "2024" },
  { title: "Lewis County Board Breaking Record Holder", year: "2021" },
  { title: "Cascade Range Endurance Challenge — Undefeated", year: "2020" },
];

const stats = [
  { label: "Belt Rank", value: "18TH DAN", note: "Yes, it goes that high" },
  { label: "Win Record", value: "847-0", note: "Undefeated" },
  { label: "Boards Broken", value: "12,419", note: "And counting" },
  { label: "Students Trained", value: "∞", note: "The forest is his dojo" },
];

export default function SenseiProfile() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="sensei"
      className="py-24 px-4 bg-cobra-black border-t-4 border-cobra-red"
    >
      <div className="max-w-5xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-cobra-red mb-12 text-center">
            Sensei Russ
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div
            className={`md:col-span-1 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <div
              className="bg-cobra-dark border-3 border-cobra-yellow p-6"
              style={{ boxShadow: "8px 8px 0px #c41e1e" }}
            >
              {/* Sensei photo */}
              <div className="w-full aspect-square border-3 border-black overflow-hidden mb-6"
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sensei-russ.png"
                  alt="Sensei Russ"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-bold text-cobra-yellow uppercase">
                Sensei Russ
              </h3>
              <p className="font-mono text-cobra-gold text-sm uppercase tracking-wider mt-1">
                Grandmaster & Founder
              </p>
              <p className="font-mono text-cobra-red text-xs uppercase tracking-wider mt-1">
                &ldquo;The Cobra Master&rdquo;
              </p>

              <div className="mt-6 border-t-2 border-cobra-yellow pt-4">
                <p className="text-foreground text-sm italic leading-relaxed">
                  &ldquo;I didn&apos;t choose the cobra life. The cobra life slithered
                  into Mossyrock and found me worthy.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Stats + Achievements */}
          <div className={`md:col-span-2 transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="brutal-card bg-cobra-dark border-3 border-cobra-red p-4"
                  style={{ boxShadow: "6px 6px 0px #000" }}
                >
                  <p className="font-mono text-cobra-gold text-xs uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-cobra-yellow mt-1">
                    {stat.value}
                  </p>
                  <p className="font-mono text-foreground text-xs mt-1 opacity-60">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Tournament History */}
            <div
              className="bg-cobra-dark border-3 border-cobra-yellow p-6"
              style={{ boxShadow: "8px 8px 0px #000" }}
            >
              <h4 className="font-mono text-cobra-gold uppercase tracking-wider text-sm mb-4">
                Tournament Victories
              </h4>
              <div className="space-y-3">
                {achievements.map((a) => (
                  <div
                    key={a.title}
                    className="flex items-center justify-between border-b border-cobra-yellow/20 pb-2"
                  >
                    <span className="text-foreground font-bold">{a.title}</span>
                    <span className="font-mono text-cobra-red text-sm">
                      {a.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
