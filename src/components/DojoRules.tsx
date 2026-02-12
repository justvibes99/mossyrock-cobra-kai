"use client";

import { useEffect, useRef, useState } from "react";

const rules = [
  "Strike First. Always.",
  "Strike Hard. No holding back.",
  "No Mercy. Not even for your training partner.",
  "Sensei Russ's word is law. Question nothing.",
  "The dojo opens at dawn. If you're late, you're running laps around Riffe Lake.",
  "No Miyagi-Do propaganda on dojo premises.",
  "Wax on, wax off is NOT a valid technique here.",
  "If you see a bonsai tree, destroy it on sight.",
  "Rain is not a valid excuse to skip training. This is Washington.",
  "Never speak of the Eagle Fang incident.",
  "You eat what Sensei Russ eats. Hope you like elk jerky.",
  "Crying is acceptable — but only tears of victory.",
  "If you lose a match, you chop firewood for a week.",
  "The dam is our dojo. The forest is our ring. The rain is our applause.",
  "Fan fiction night is sacred. Attendance is mandatory.",
];

export default function DojoRules() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="rules"
      className="py-24 px-4 bg-cobra-black border-t-4 border-cobra-red"
    >
      <div className="max-w-3xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-cobra-red mb-4 text-center">
            Dojo Rules
          </h2>
          <p className="text-center font-mono text-cobra-gold uppercase tracking-wider text-sm mb-12">
            Memorize these. There will be a test. The test is combat.
          </p>
        </div>

        <div
          className={`bg-cobra-dark border-3 border-cobra-yellow p-8 md:p-12 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ boxShadow: "8px 8px 0px #c41e1e" }}
        >
          {/* Header plaque */}
          <div className="text-center mb-8 pb-6 border-b-4 border-cobra-red">
            <p className="font-mono text-cobra-yellow text-lg uppercase tracking-widest">
              Mossyrock Cobra Kai
            </p>
            <p className="font-mono text-cobra-gold text-sm uppercase tracking-wider mt-1">
              Official Code of Conduct
            </p>
          </div>

          {/* Rules list */}
          <ol className="space-y-4">
            {rules.map((rule, i) => (
              <li
                key={i}
                className={`flex items-start gap-4 transition-all duration-500 ${
                  visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${300 + i * 80}ms` }}
              >
                <span
                  className="shrink-0 w-8 h-8 flex items-center justify-center bg-cobra-red text-white font-mono font-bold text-sm border-2 border-black"
                  style={{ boxShadow: "2px 2px 0px #000" }}
                >
                  {i + 1}
                </span>
                <span className="text-foreground leading-relaxed pt-1">
                  {rule}
                </span>
              </li>
            ))}
          </ol>

          {/* Signature */}
          <div className="mt-10 pt-6 border-t-4 border-cobra-red text-right">
            <p className="text-cobra-yellow font-bold text-lg italic">
              — Sensei Russ
            </p>
            <p className="font-mono text-cobra-gold text-xs uppercase tracking-wider mt-1">
              Grandmaster, Mossyrock Cobra Kai
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
