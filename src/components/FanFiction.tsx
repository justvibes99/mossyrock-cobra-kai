"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StorySubmitForm from "./StorySubmitForm";

interface Story {
  id: number;
  title: string;
  excerpt: string;
  status: string;
  screenplay: string | null;
  created_at: string;
}

export default function FanFiction() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showScreenplay, setShowScreenplay] = useState<number | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchStories = useCallback(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this story? No mercy.")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/stories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      if (res.ok) {
        setExpanded(null);
        setShowScreenplay(null);
        fetchStories();
      }
    } catch {
      // silent fail
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section
      ref={ref}
      id="stories"
      className="py-24 px-4 bg-cobra-black border-t-4 border-cobra-red"
    >
      <div className="max-w-4xl mx-auto">
        <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl md:text-6xl font-bold uppercase text-cobra-red mb-4 text-center">
            Stories
          </h2>
          <p className="text-center font-mono text-cobra-gold uppercase tracking-wider text-sm mb-4">
            The Sacred Scrolls of Sensei Russ
          </p>
          <p className="text-center text-foreground text-sm mb-12 max-w-xl mx-auto opacity-70">
            Written by candlelight in the back room of the dojo, these chronicles
            document the untold stories of the Cobra Kai legacy in the Pacific Northwest.
          </p>
        </div>

        {stories.length === 0 ? (
          <div className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div
              className="bg-cobra-dark border-3 border-cobra-red p-8 text-center max-w-md mx-auto"
              style={{ boxShadow: "8px 8px 0px #000" }}
            >
              <p className="text-cobra-yellow font-bold uppercase text-lg mb-2">
                No stories yet
              </p>
              <p className="text-foreground font-mono text-sm">
                The sacred scrolls await their first tale.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 stagger-children">
            {stories.map((story, i) => (
              <div
                key={story.id}
                className={`brutal-card bg-cobra-dark border-3 border-cobra-yellow transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  boxShadow: expanded === i ? "8px 8px 0px #c41e1e" : "6px 6px 0px #000",
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <div
                  className="p-6 flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => { setExpanded(expanded === i ? null : i); setShowScreenplay(null); }}
                >
                  <div className="flex-1">
                    <span
                      className={`font-mono text-xs uppercase tracking-wider px-2 py-1 border-2 border-black mb-2 inline-block ${
                        story.status === "ONGOING"
                          ? "bg-cobra-yellow text-black"
                          : "bg-green-500 text-black"
                      }`}
                    >
                      {story.status}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-cobra-yellow uppercase">
                      {story.title}
                    </h3>
                  </div>
                  <div
                    className={`text-cobra-yellow text-2xl font-bold transition-transform duration-200 ${
                      expanded === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expanded === i ? "max-h-[800px] overflow-y-auto" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 border-t-2 border-cobra-yellow/20 pt-4">
                    {showScreenplay === i && story.screenplay ? (
                      <>
                        <pre className="text-foreground leading-relaxed font-mono text-sm whitespace-pre-wrap">
                          {story.screenplay}
                        </pre>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowScreenplay(null); }}
                          className="mt-4 font-mono text-xs uppercase tracking-wider px-4 py-2 border-2 border-cobra-gold text-cobra-gold hover:bg-cobra-gold hover:text-black transition-colors"
                        >
                          Back to Story
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-foreground leading-relaxed font-mono text-sm">
                          {story.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                          {story.screenplay && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowScreenplay(i); }}
                              className="font-mono text-xs uppercase tracking-wider px-4 py-2 border-2 border-cobra-red text-cobra-red hover:bg-cobra-red hover:text-white transition-colors"
                            >
                              View Screenplay
                            </button>
                          )}
                          {loggedIn && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(story.id); }}
                              disabled={deleting === story.id}
                              className="font-mono text-xs uppercase tracking-wider px-4 py-2 border-2 border-cobra-gold/30 text-cobra-gold/30 hover:border-cobra-red hover:text-cobra-red transition-colors disabled:opacity-30"
                            >
                              {deleting === story.id ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <StorySubmitForm
          loggedIn={loggedIn}
          onLogin={(pw) => { setLoggedIn(true); setPassword(pw); }}
          onStoryCreated={fetchStories}
          password={password}
        />
      </div>
    </section>
  );
}
