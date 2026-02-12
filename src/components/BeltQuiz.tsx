"use client";

import { useEffect, useRef, useState } from "react";

interface Question {
  question: string;
  options: string[];
  points: number[];
}

const questions: Question[] = [
  {
    question: "Someone cuts you in line at the Mossyrock General Store. You:",
    options: [
      "Politely ask them to move",
      "Sweep the leg",
      "Glare with the intensity of Sensei Russ",
      "Challenge them to a parking lot kumite",
    ],
    points: [1, 4, 3, 5],
  },
  {
    question: "Your preferred training environment:",
    options: [
      "A nice, heated gym",
      "The mossy banks of Riffe Lake",
      "On top of Mossyrock Dam in a thunderstorm",
      "Anywhere Sensei Russ tells me to train",
    ],
    points: [1, 3, 5, 4],
  },
  {
    question: "A Miyagi-Do student offers you a bonsai tree. You:",
    options: [
      "Accept it graciously",
      "Karate chop it in half",
      'Say "Fear does not exist in this dojo"',
      "Use it for target practice",
    ],
    points: [1, 4, 3, 5],
  },
  {
    question: "How many boards can you break?",
    options: [
      "Zero, I value my hands",
      "One or two",
      "A whole stack, no problem",
      "I don't count — I just break until they're gone",
    ],
    points: [1, 2, 4, 5],
  },
  {
    question: "The most important Cobra Kai tenet:",
    options: [
      "Strike First",
      "Strike Hard",
      "No Mercy",
      "All three, tattooed on my soul",
    ],
    points: [3, 3, 4, 5],
  },
];

const results = [
  {
    belt: "White Belt",
    color: "bg-white text-black",
    min: 0,
    max: 8,
    message: "You just walked into the dojo. Sensei Russ is watching. Don't embarrass yourself.",
    emoji: "Fresh meat",
  },
  {
    belt: "Yellow Belt",
    color: "bg-cobra-yellow text-black",
    min: 9,
    max: 13,
    message: "You've got some spirit, but the moss hasn't hardened you yet. Keep training.",
    emoji: "Showing promise",
  },
  {
    belt: "Green Belt",
    color: "bg-green-500 text-black",
    min: 14,
    max: 17,
    message: "The Cowlitz River flows through your veins. You're becoming dangerous.",
    emoji: "Getting dangerous",
  },
  {
    belt: "Brown Belt",
    color: "bg-amber-800 text-white",
    min: 18,
    max: 21,
    message: "Sensei Russ nods at you with respect. The forest whispers your name. Almost there.",
    emoji: "Nearly elite",
  },
  {
    belt: "BLACK BELT",
    color: "bg-black text-cobra-red border-cobra-red",
    min: 22,
    max: 25,
    message: "You ARE Cobra Kai. The moss trembles. The dam shakes. Mossyrock bows before you.",
    emoji: "LEGENDARY",
  },
];

export default function BeltQuiz() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const points = questions[currentQ].points[optionIndex];
    const newScore = score + points;
    const newAnswers = [...answers, optionIndex];
    setScore(newScore);
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    return results.find((r) => score >= r.min && score <= r.max) || results[0];
  };

  const reset = () => {
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setShowResult(false);
    setStarted(false);
  };

  return (
    <section
      ref={ref}
      id="quiz"
      className="py-24 px-4 bg-cobra-dark border-t-4 border-cobra-yellow"
    >
      <div className="max-w-2xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-cobra-yellow mb-4 text-center">
            Belt Rank Quiz
          </h2>
          <p className="text-center font-mono text-cobra-gold uppercase tracking-wider text-sm mb-12">
            Discover your true Cobra Kai potential
          </p>
        </div>

        <div className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {!started ? (
            /* Start screen */
            <div
              className="bg-cobra-black border-3 border-cobra-red p-8 text-center"
              style={{ boxShadow: "8px 8px 0px #FFE66D" }}
            >
              <p className="text-foreground text-lg mb-2">
                Do you have what it takes to earn your belt at the
              </p>
              <p className="text-cobra-yellow font-bold text-2xl mb-6 uppercase">
                Mossyrock Cobra Kai Dojo?
              </p>
              <p className="font-mono text-cobra-gold text-sm mb-8">
                5 questions &bull; No mercy scoring &bull; Results are final
              </p>
              <button
                onClick={() => setStarted(true)}
                className="brutal-btn bg-cobra-red text-white font-bold text-lg uppercase tracking-wider px-8 py-4 border-3 border-black"
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                Begin Trial
              </button>
            </div>
          ) : showResult ? (
            /* Result */
            <div
              className="bg-cobra-black border-3 border-cobra-yellow p-8 text-center"
              style={{ boxShadow: "8px 8px 0px #c41e1e" }}
            >
              <p className="font-mono text-cobra-gold uppercase tracking-wider text-sm mb-4">
                Your rank has been decided
              </p>
              <div
                className={`inline-block ${getResult().color} font-bold text-4xl md:text-5xl uppercase px-8 py-4 border-3 border-black mb-6`}
                style={{ boxShadow: "6px 6px 0px #FFE66D" }}
              >
                {getResult().belt}
              </div>
              <p className="font-mono text-cobra-gold uppercase tracking-wider text-xs mb-2">
                {getResult().emoji}
              </p>
              <p className="text-foreground text-lg leading-relaxed mb-8">
                {getResult().message}
              </p>
              <p className="font-mono text-cobra-yellow text-sm mb-6">
                Score: {score}/{questions.length * 5}
              </p>
              <button
                onClick={reset}
                className="brutal-btn bg-cobra-yellow text-black font-bold uppercase tracking-wider px-6 py-3 border-3 border-black"
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                Retake Quiz
              </button>
            </div>
          ) : (
            /* Question */
            <div
              className="bg-cobra-black border-3 border-cobra-yellow p-8"
              style={{ boxShadow: "8px 8px 0px #c41e1e" }}
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-cobra-gold text-sm uppercase">
                  Question {currentQ + 1}/{questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-2 border border-black ${
                        i < currentQ
                          ? "bg-cobra-red"
                          : i === currentQ
                          ? "bg-cobra-yellow"
                          : "bg-cobra-dark"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-8">
                {questions[currentQ].question}
              </h3>

              <div className="space-y-3">
                {questions[currentQ].options.map((option, i) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(i)}
                    className="brutal-btn w-full text-left bg-cobra-dark text-foreground font-bold p-4 border-3 border-cobra-red hover:bg-cobra-red hover:text-white transition-colors"
                    style={{ boxShadow: "4px 4px 0px #000" }}
                  >
                    <span className="font-mono text-cobra-yellow mr-3">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
