"use client";

import { useEffect, useRef, useState } from "react";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-24 px-4 bg-cobra-dark border-t-4 border-cobra-yellow"
    >
      <div className="max-w-4xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-cobra-yellow mb-2">
            The Legend of
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold uppercase text-cobra-red mb-12">
            Mossyrock Cobra Kai
          </h3>
        </div>

        <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div
            className="bg-cobra-black border-3 border-cobra-yellow p-8"
            style={{ boxShadow: "8px 8px 0px #c41e1e" }}
          >
            <h4 className="font-mono text-cobra-gold uppercase tracking-wider text-sm mb-4">
              Origin Story
            </h4>
            <p className="text-foreground leading-relaxed">
              When the original Cobra Kai dojo fell, its spirit didn&apos;t die — it
              migrated north. Deep in the forests of Lewis County, Washington, a
              new chapter began. In the shadow of{" "}
              <span className="text-cobra-yellow font-bold">Mossyrock Dam</span>,
              Sensei Russ established a training ground unlike any the martial
              arts world had ever seen.
            </p>
          </div>

          <div
            className="bg-cobra-black border-3 border-cobra-yellow p-8"
            style={{ boxShadow: "8px 8px 0px #c41e1e" }}
          >
            <h4 className="font-mono text-cobra-gold uppercase tracking-wider text-sm mb-4">
              Training Grounds
            </h4>
            <p className="text-foreground leading-relaxed">
              Forget strip-mall dojos. Our students train on the{" "}
              <span className="text-cobra-yellow font-bold">mossy banks of Riffe Lake</span>,
              spar in the{" "}
              <span className="text-cobra-yellow font-bold">Pacific Northwest rain</span>,
              and meditate beneath ancient Douglas firs. The wilderness of
              Mossyrock forges warriors that no valley dojo could ever produce.
            </p>
          </div>

          <div
            className="md:col-span-2 bg-cobra-red border-3 border-black p-8"
            style={{ boxShadow: "8px 8px 0px #000" }}
          >
            <h4 className="font-mono text-black uppercase tracking-wider text-sm mb-4">
              Our Creed
            </h4>
            <p className="text-black text-lg leading-relaxed font-bold">
              &ldquo;In Mossyrock, we don&apos;t just strike first — we strike with the
              force of the Cowlitz River. We don&apos;t just strike hard — we strike
              with the weight of the Cascades. And mercy? The moss doesn&apos;t show
              mercy to the rock. Neither do we.&rdquo;
            </p>
            <p className="text-black font-mono text-sm mt-4 uppercase tracking-wider">
              — Sensei Russ, Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
