"use client";

import { useEffect, useRef, useState } from "react";

const schedule = [
  {
    day: "Monday",
    classes: [
      { time: "6:00 AM", name: "Dawn Patrol: Riverside Kata", level: "All Levels", color: "bg-cobra-yellow text-black" },
      { time: "4:00 PM", name: "Youth Cobra Conditioning", level: "Ages 8-15", color: "bg-cobra-red text-white" },
      { time: "7:00 PM", name: "Advanced Strike Theory", level: "Brown Belt+", color: "bg-cobra-yellow text-black" },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      { time: "6:00 AM", name: "Dam Run & Combat Cardio", level: "All Levels", color: "bg-cobra-red text-white" },
      { time: "5:00 PM", name: "CRANE KICK COUNTERMEASURES", level: "Mandatory", color: "bg-cobra-yellow text-black" },
      { time: "8:00 PM", name: "Parking Lot Kumite", level: "Invite Only", color: "bg-cobra-red text-white" },
    ],
  },
  {
    day: "Wednesday",
    classes: [
      { time: "6:00 AM", name: "Meditation at Mossyrock Dam", level: "All Levels", color: "bg-cobra-yellow text-black" },
      { time: "4:00 PM", name: "Board Breaking Basics", level: "White-Green", color: "bg-cobra-red text-white" },
      { time: "7:00 PM", name: "Sensei Russ Open Mat", level: "All Levels", color: "bg-cobra-yellow text-black" },
    ],
  },
  {
    day: "Thursday",
    classes: [
      { time: "6:00 AM", name: "Riffe Lake Endurance Swim", level: "Advanced", color: "bg-cobra-red text-white" },
      { time: "5:00 PM", name: "MIYAGI-PROOF DEFENSE", level: "Critical", color: "bg-cobra-yellow text-black" },
      { time: "8:00 PM", name: "Fan Fiction Fight Club", level: "Writers Only", color: "bg-cobra-red text-white" },
    ],
  },
  {
    day: "Friday",
    classes: [
      { time: "6:00 AM", name: "Forest Trail Sparring", level: "All Levels", color: "bg-cobra-yellow text-black" },
      { time: "4:00 PM", name: "Demo Team Practice", level: "Selected", color: "bg-cobra-red text-white" },
      { time: "7:00 PM", name: "Full Contact Friday", level: "Adults 18+", color: "bg-cobra-yellow text-black" },
    ],
  },
  {
    day: "Saturday",
    classes: [
      { time: "8:00 AM", name: "Weekend Warrior Boot Camp", level: "All Levels", color: "bg-cobra-red text-white" },
      { time: "12:00 PM", name: "Tournament Prep Intensive", level: "Competitors", color: "bg-cobra-yellow text-black" },
    ],
  },
  {
    day: "Sunday",
    classes: [
      { time: "10:00 AM", name: "Rest Day... Just Kidding. Kata.", level: "Mandatory", color: "bg-cobra-red text-white" },
    ],
  },
];

export default function ClassSchedule() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

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
      id="schedule"
      className="py-24 px-4 bg-cobra-dark border-t-4 border-cobra-yellow"
    >
      <div className="max-w-5xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-cobra-yellow mb-4 text-center">
            Class Schedule
          </h2>
          <p className="text-center font-mono text-cobra-gold uppercase tracking-wider text-sm mb-12">
            Weakness is a choice. Showing up is mandatory.
          </p>
        </div>

        {/* Day tabs */}
        <div className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {schedule.map((s, i) => (
            <button
              key={s.day}
              onClick={() => setActiveDay(i)}
              className={`brutal-btn font-bold uppercase tracking-wider text-sm px-4 py-2 border-3 border-black ${
                activeDay === i
                  ? "bg-cobra-red text-white"
                  : "bg-cobra-black text-cobra-yellow"
              }`}
              style={{ boxShadow: activeDay === i ? "4px 4px 0px #FFE66D" : "4px 4px 0px #000" }}
            >
              {s.day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Classes */}
        <div className={`transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div
            className="bg-cobra-black border-3 border-cobra-yellow p-6 md:p-8"
            style={{ boxShadow: "8px 8px 0px #c41e1e" }}
          >
            <h3 className="text-2xl font-bold text-cobra-red mb-6 uppercase">
              {schedule[activeDay].day}
            </h3>
            <div className="space-y-4">
              {schedule[activeDay].classes.map((cls) => (
                <div
                  key={cls.name}
                  className="brutal-card flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 border-3 border-black p-4 bg-cobra-dark"
                  style={{ boxShadow: "4px 4px 0px #000" }}
                >
                  <span className="font-mono text-cobra-gold text-sm w-20 shrink-0">
                    {cls.time}
                  </span>
                  <span className="font-bold text-foreground text-lg flex-1 uppercase">
                    {cls.name}
                  </span>
                  <span
                    className={`${cls.color} font-mono text-xs uppercase tracking-wider px-3 py-1 border-2 border-black w-fit`}
                  >
                    {cls.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
