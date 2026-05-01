import { useState, useEffect, useRef } from "react";
import {Link} from 'react-router-dom'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV_LINKS = ["Features", "Content Types", "For Creators", "Quizzes", "Analytics", "Pricing", "Testimonials"];

const STATS = [
  { value: "2.4M+", label: "Active Learners" },
  { value: "180K+", label: "Courses Published" },
  { value: "98.6%", label: "Satisfaction Rate" },
  { value: "140+", label: "Countries Reached" },
];

const CONTENT_TYPES = [
  {
    icon: "📄",
    title: "PDF Documents",
    desc: "Upload multi-page PDFs and structure them into readable lesson modules. Learners can highlight passages, bookmark pages, add personal notes, and track reading progress with a visual completion bar.",
    badge: "Document",
    accent: "#38bdf8",
    bg: "rgba(56,189,248,0.07)",
    border: "rgba(56,189,248,0.25)",
  },
  {
    icon: "🎬",
    title: "Video Lessons",
    desc: "Host HD videos with chapter markers you define manually, custom thumbnail selection, and closed-caption upload support. Learners get playback speed control and a built-in notebook beside the player.",
    badge: "Video",
    accent: "#3b82f6",
    bg: "rgba(59,130,246,0.07)",
    border: "rgba(59,130,246,0.25)",
  },
  {
    icon: "🎧",
    title: "Audio Content",
    desc: "Publish audio lectures, recorded walkthroughs, or podcast-style episodes. Add a synchronized transcript and chapter timestamps so learners can scan and jump to any section instantly.",
    badge: "Audio",
    accent: "#a855f7",
    bg: "rgba(168,85,247,0.07)",
    border: "rgba(168,85,247,0.25)",
  },
  {
    icon: "🖼️",
    title: "Image Galleries",
    desc: "Build visual lessons from image collections — diagrams, infographics, step-by-step photo guides. Add captions and descriptions to each image manually to provide full context for learners.",
    badge: "Visual",
    accent: "#22c55e",
    bg: "rgba(34,197,94,0.07)",
    border: "rgba(34,197,94,0.25)",
  },
  {
    icon: "📝",
    title: "Rich Text Articles",
    desc: "Write long-form lesson content with a full-featured editor supporting headings, lists, bold/italic, tables, code blocks, math equations, and inline image embeds for a textbook-quality reading experience.",
    badge: "Text",
    accent: "#14b8a6",
    bg: "rgba(20,184,166,0.07)",
    border: "rgba(20,184,166,0.25)",
  },
  {
    icon: "🧩",
    title: "Mixed Lessons",
    desc: "Combine any content types inside a single lesson — start with a video, follow with a PDF reading, drop in an image diagram, and end with a text summary. Arrange blocks in any order you choose.",
    badge: "Combined",
    accent: "#0ea5e9",
    bg: "rgba(14,165,233,0.07)",
    border: "rgba(14,165,233,0.25)",
  },
];

const CREATOR_FEATURES = [
  {
    icon: "🏗️",
    title: "Drag-and-Drop Course Builder",
    desc: "Arrange lessons, modules, and assessments with a visual builder. Nest content blocks, set prerequisites, and define a clear learning path — no coding or technical knowledge needed.",
  },
  {
    icon: "📂",
    title: "Centralized Media Library",
    desc: "Upload all your PDFs, videos, audio files, and images into one organized library. Reuse assets across multiple courses and lessons without re-uploading or duplicating files.",
  },
  {
    icon: "📊",
    title: "Learner Progress Analytics",
    desc: "Monitor per-student completion rates, quiz scores, video watch time, and last active dates. Spot who is falling behind and reach out before they drop off.",
  },
  {
    icon: "💬",
    title: "Discussion & Q&A Boards",
    desc: "Enable per-lesson discussion threads and course-wide Q&A boards. Pin important answers, moderate questions, and send direct messages to any enrolled student.",
  },
  {
    icon: "🏆",
    title: "Certificates & Badges",
    desc: "Define your own completion criteria and automatically issue branded certificates. Set milestone badges for quiz scores, streaks, and module completions to keep learners motivated.",
  },
  {
    icon: "💰",
    title: "Flexible Monetization",
    desc: "Sell individual courses, create bundle packages, or offer subscription access. Generate coupon codes, set group license pricing, and manage revenue from one dashboard.",
  },
  {
    icon: "🔐",
    title: "Access Control & Enrollment",
    desc: "Set courses as public, private, or invite-only. Create approval-based enrollment, drip-release lesson schedules, and cohort-specific access windows for structured programs.",
  },
  {
    icon: "🌍",
    title: "Multi-Language Support",
    desc: "Publish course content in any language you write. Upload separate caption files for different languages and let learners switch their preferred display language at any time.",
  },
];

const QUIZ_TYPES = [
  { name: "Multiple Choice", icon: "☑️", desc: "Present a question with 2–6 answer options. Choose one or multiple correct answers." },
  { name: "True / False", icon: "⚖️", desc: "Quick binary questions ideal for testing factual recall and concept checks." },
  { name: "Fill in the Blank", icon: "✏️", desc: "Learners type the missing word or phrase — great for terminology and definitions." },
  { name: "Drag & Drop Matching", icon: "🔀", desc: "Match terms to definitions, images to labels, or sequence steps in the correct order." },
  { name: "Short Answer", icon: "📋", desc: "Open text responses you review and grade manually with your own rubric." },
  { name: "Image-Based Questions", icon: "🗺️", desc: "Add an image and ask learners to identify regions, labels, or answer based on visual cues." },
];

const ANALYTICS_METRICS = [
  { label: "Avg. Completion Rate", value: "74%", sub: "across all courses", color: "#22c55e" },
  { label: "Avg. Quiz Score", value: "81%", sub: "on first attempt", color: "#3b82f6" },
  { label: "Video Watch Time", value: "68%", sub: "completion per lesson", color: "#a855f7" },
  { label: "Learner Retention", value: "89%", sub: "return within 7 days", color: "#38bdf8" },
];

const PRICING = [
  {
    name: "Starter",
    price: "$0",
    period: "forever free",
    features: [
      "Up to 3 courses",
      "50 enrolled learners",
      "PDF & text content",
      "Basic quizzes",
      "Discussion boards",
      "Email support",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Creator",
    price: "$29",
    period: "per month",
    features: [
      "Unlimited courses",
      "1,000 enrolled learners",
      "All content types",
      "Full quiz builder",
      "Analytics dashboard",
      "Certificates & badges",
      "Course monetization",
      "Priority support",
    ],
    cta: "Start 14-Day Trial",
    highlight: true,
  },
  {
    name: "Institution",
    price: "$99",
    period: "per month",
    features: [
      "Unlimited everything",
      "Unlimited learners",
      "Custom domain & branding",
      "Admin & multi-creator roles",
      "Advanced analytics exports",
      "SCORM & LTI integration",
      "SSO / SAML login",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Menon",
    role: "Biology Teacher, Delhi",
    avatar: "PM",
    text: "I upload my handwritten PDFs, record voice explanations, and build quizzes every week. The course builder is so simple that I had my first course live within two hours.",
  },
  {
    name: "Carlos Vega",
    role: "Corporate Trainer, Mexico City",
    avatar: "CV",
    text: "We run onboarding programs for 300+ new hires a quarter. The enrollment controls, progress tracking, and certificate system made our manual HR process almost fully automated.",
  },
  {
    name: "Amara Osei",
    role: "Freelance Educator, Accra",
    avatar: "AO",
    text: "I built a paid photography course combining video walkthroughs, image galleries, and quiz checkpoints. Within a month I had 200 paying students and zero technical headaches.",
  },
  {
    name: "Lin Wei",
    role: "University Lecturer, Shanghai",
    avatar: "LW",
    text: "The mixed lesson format is what sold me. I put lecture videos, reading PDFs, diagrams, and a quiz all in one lesson. Students love having everything in one place.",
  },
];

const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Create Your Course",
    desc: "Give your course a name, description, and cover image. Set the learning objectives and structure your curriculum into modules and lessons.",
  },
  {
    num: "02",
    title: "Build Lessons Manually",
    desc: "Add content blocks to each lesson — upload a PDF, embed a video, record audio, add images, or write rich text. Mix and match in any order.",
  },
  {
    num: "03",
    title: "Design Quizzes",
    desc: "Attach a quiz to any lesson or module. Write questions from scratch, choose question types, set point values, and define passing thresholds.",
  },
  {
    num: "04",
    title: "Publish & Enroll",
    desc: "Set pricing, access rules, and publish. Share your course link or invite learners directly. Enrollment is instant with no approval delays.",
  },
  {
    num: "05",
    title: "Track & Improve",
    desc: "Watch learner progress in real time. Review which lessons cause drop-off, which quizzes trip learners up, and update content any time.",
  },
];

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }}>Vidya Setu</span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}>{l}</a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to='/login'><button style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Log In</button></Link>
          <Link to='/register'><button style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Start Free</button></Link>
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>☰</button>
      </div>

      {open && (
        <div style={{ background: "rgba(10,10,10,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px 24px" }}>
          {NAV_LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setOpen(false)}
              style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: 15, padding: "10px 0", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{l}</a>
          ))}
          <button style={{ marginTop: 16, width: "100%", background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Start Free</button>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "#080808", paddingTop: 80 }}>
      {/* Grid bg */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      {/* Glow blobs */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)", top: "10%", left: "5%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", bottom: "10%", right: "5%", pointerEvents: "none" }} />

      <div className="max-w-6xl mx-auto px-6 text-center" style={{ position: "relative", zIndex: 2 }}>
        <FadeIn>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 32 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#38bdf8", display: "inline-block" }} />
            <span style={{ color: "#38bdf8", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em" }}>BUILT FOR EDUCATORS & ADMINS</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(40px, 7vw, 88px)", fontWeight: 900, lineHeight: 1.0, color: "#fff", letterSpacing: "-0.04em", marginBottom: 28 }}>
            Build & Deliver<br />
            <span style={{ background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Powerful Courses
            </span>
            <br />Your Way
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(16px, 2vw, 21px)", maxWidth: 640, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Vidya Setu gives creators and admins a complete toolkit to manually craft courses from PDFs, videos, audio, images, and text — then test learners with powerful hand-built quizzes.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to='/register'><button style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 40px rgba(56,189,248,0.3)" }}>
              Create Your First Course →
            </button></Link>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.5}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginTop: 80, background: "rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: "28px 16px", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

function SectionHeading({ children, accent }) {
  return (
    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
      {children}
    </h2>
  );
}

function ContentTypesSection() {
  const [active, setActive] = useState(0);
  const ct = CONTENT_TYPES[active];
  return (
    <section id="content-types" style={{ background: "#0a0a0a", padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>Content Types</SectionLabel>
            <SectionHeading>Every Format.<br />One Platform.</SectionHeading>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 18, maxWidth: 560, margin: "0 auto" }}>
              Upload and organize all your content manually. Mix formats freely within any lesson.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Tabs left */}
          <div style={{ background: "rgba(255,255,255,0.02)" }}>
            {CONTENT_TYPES.map((c, i) => (
              <button key={i} onClick={() => setActive(i)}
                style={{
                  width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
                  padding: "20px 28px", background: active === i ? c.bg : "transparent",
                  borderLeft: active === i ? `3px solid ${c.accent}` : "3px solid transparent",
                  border: "none", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <div>
                  <div style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ color: active === i ? c.accent : "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 2 }}>{c.badge}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail right */}
          <div style={{ background: ct.bg, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 360 }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>{ct.icon}</div>
            <div style={{ background: ct.bg, border: `1px solid ${ct.border}`, borderRadius: 100, padding: "4px 12px", display: "inline-block", marginBottom: 16, width: "fit-content" }}>
              <span style={{ color: ct.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em" }}>{ct.badge.toUpperCase()}</span>
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 16 }}>{ct.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.75 }}>{ct.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section style={{ background: "#080808", padding: "100px 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <SectionLabel>How It Works</SectionLabel>
            <SectionHeading>From Idea to Live Course<br />in Five Steps</SectionHeading>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 18, maxWidth: 520, margin: "0 auto" }}>
              No technical background needed. Every step is done manually through a clean, intuitive interface.
            </p>
          </div>
        </FadeIn>

        <div style={{ position: "relative" }}>
          {/* Connector line */}
          <div style={{ position: "absolute", left: "calc(50% - 1px)", top: 40, bottom: 40, width: 2, background: "linear-gradient(to bottom, transparent, rgba(56,189,248,0.3), transparent)", display: "none" }} className="hidden lg:block" />

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {WORKFLOW_STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24,
                  padding: "32px 0",
                }}>
                  {i % 2 === 0 ? (
                    <>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 900, color: "rgba(56,189,248,0.08)", lineHeight: 1, marginBottom: -16 }}>{step.num}</div>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10 }}>{step.title}</h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.7, maxWidth: 340, marginLeft: "auto" }}>{step.desc}</p>
                      </div>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(56,189,248,0.15)", border: "2px solid rgba(56,189,248,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{i + 1}</div>
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(56,189,248,0.15)", border: "2px solid rgba(56,189,248,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{i + 1}</div>
                      <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 900, color: "rgba(56,189,248,0.08)", lineHeight: 1, marginBottom: -16 }}>{step.num}</div>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10 }}>{step.title}</h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.7, maxWidth: 340 }}>{step.desc}</p>
                      </div>
                    </>
                  )}
                </div>
                {i < WORKFLOW_STEPS.length - 1 && <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />}
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CreatorFeaturesSection() {
  return (
    <section id="for-creators" style={{ background: "#0a0a0a", padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <SectionLabel>For Creators & Admins</SectionLabel>
            <SectionHeading>Everything You Need to<br />Run a Full Learning Program</SectionHeading>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 18, maxWidth: 580, margin: "0 auto" }}>
              From building your first lesson to managing thousands of learners — all handled by you, in full control.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          {CREATOR_FEATURES.map((f, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const totalRows = Math.ceil(CREATOR_FEATURES.length / 4);
            const borderRight = col < 3 ? "1px solid rgba(255,255,255,0.07)" : "none";
            const borderBottom = row < totalRows - 1 ? "1px solid rgba(255,255,255,0.07)" : "none";
            return (
              <div
                key={i}
                style={{
                  padding: "36px 28px",
                  background: "#0a0a0a",
                  transition: "background 0.2s",
                  cursor: "default",
                  borderRight,
                  borderBottom,
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(56,189,248,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "#0a0a0a"}
              >
                <div style={{ fontSize: 30, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function QuizSection() {
  const [activeQ, setActiveQ] = useState(0);
  return (
    <section id="quizzes" style={{ background: "#080808", padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <FadeIn>
            <div>
              <SectionLabel>Quiz Builder</SectionLabel>
              <SectionHeading>Hand-Craft Every<br />Question Yourself</SectionHeading>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, lineHeight: 1.75, marginBottom: 32 }}>
                Write questions from scratch. Choose your format, define correct answers, set point values, and add explanatory feedback — all from a clean, distraction-free editor.
              </p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {["Set passing score thresholds per quiz", "Allow unlimited or limited attempts", "Randomize question and answer order", "Show or hide results immediately", "Attach quizzes to any lesson or module", "Export all scores as CSV"].map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
                    <span style={{ color: "#38bdf8", fontSize: 12 }}>●</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {QUIZ_TYPES.map((q, i) => (
                <div key={i} onClick={() => setActiveQ(i)}
                  style={{
                    padding: "20px 24px", borderRadius: 12, border: activeQ === i ? "1px solid rgba(56,189,248,0.4)" : "1px solid rgba(255,255,255,0.07)",
                    background: activeQ === i ? "rgba(56,189,248,0.07)" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.2s",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: activeQ === i ? 8 : 0 }}>
                    <span style={{ fontSize: 20 }}>{q.icon}</span>
                    <span style={{ color: activeQ === i ? "#fff" : "rgba(255,255,255,0.65)", fontSize: 15, fontWeight: 600 }}>{q.name}</span>
                  </div>
                  {activeQ === i && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.65, marginLeft: 32 }}>{q.desc}</p>}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  return (
    <section id="analytics" style={{ background: "#0a0a0a", padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>Analytics</SectionLabel>
            <SectionHeading>See Exactly How<br />Learners Engage</SectionHeading>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 18, maxWidth: 540, margin: "0 auto" }}>
              Real-time dashboards give you the data to understand what's working and where learners need more support.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 48 }}>
          {ANALYTICS_METRICS.map((m, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ padding: "32px 24px", background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 900, color: m.color, letterSpacing: "-0.03em" }}>{m.value}</div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginTop: 8 }}>{m.label}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4 }}>{m.sub}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "40px 40px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>Weekly Learner Activity</h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>Lessons completed per day</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["7D", "30D", "90D"].map((t, i) => (
                  <button key={i} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: i === 0 ? "rgba(56,189,248,0.15)" : "transparent", color: i === 0 ? "#38bdf8" : "rgba(255,255,255,0.4)", border: i === 0 ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}>{t}</button>
                ))}
              </div>
            </div>
            {/* Bar chart mockup */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
              {[45, 62, 38, 80, 55, 91, 72].map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: "100%", height: `${(v / 100) * 140}px`, background: `linear-gradient(to top, rgba(56,189,248,0.8), rgba(14,165,233,0.6))`, borderRadius: "4px 4px 0 0", transition: "height 0.4s ease" }} />
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Track rows */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          {[
            { label: "Per-Learner Progress Tracking", desc: "See each student's completion percentage, quiz history, and last login — individually." },
            { label: "Lesson Drop-Off Reports", desc: "Identify exactly which lesson or video timestamp causes learners to leave." },
            { label: "Quiz Score Distributions", desc: "View score histograms and spot questions with unusually high failure rates." },
            { label: "CSV & PDF Exports", desc: "Download full grade books, completion reports, and enrollment data at any time." },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <div style={{ padding: "24px 28px", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{item.label}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ background: "#0a0a0a", padding: "100px 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <SectionLabel>Testimonials</SectionLabel>
            <SectionHeading>Educators Trust Vidya Setu</SectionHeading>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ padding: "36px", background: "rgba(255,255,255,0.02)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 32, color: "#38bdf8", marginBottom: 20, lineHeight: 1 }}>"</div>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{ background: "#080808", padding: "100px 0" }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <div style={{ position: "relative", padding: "80px 60px", borderRadius: 28, overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", marginBottom: 20 }}>
                Start Building<br />
                <span style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your First Course Today</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7 }}>
                No technical knowledge needed. Upload your content, write your quizzes, and launch your course — completely on your own terms.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link to='/register'><button style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#fff", border: "none", borderRadius: 10, padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 40px rgba(56,189,248,0.35)" }}>
                  Create Free Account →
                </button></Link>
              </div>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, marginTop: 24 }}>Free forever. No credit card required. Upgrade only when you need to.</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Content Types", "Quiz Builder", "Analytics", "Certificates", "Integrations"] },
    { title: "For Creators", links: ["Getting Started", "Course Builder Guide", "Upload Formats", "Pricing", "Creator Stories"] },
    { title: "For Admins", links: ["Admin Dashboard", "Enrollment Controls", "User Roles", "Bulk Import", "API Docs"] },
    { title: "Company", links: ["About Us", "Blog", "Careers", "Privacy Policy", "Terms of Service"] },
  ];
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "72px 0 40px" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>Vidya Setu</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, lineHeight: 1.75, maxWidth: 260 }}>
              The learning management system built for creators and admins who want complete manual control over every lesson, quiz, and learner experience.
            </p>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16, textTransform: "uppercase" }}>{col.title}</div>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l, j) => (
                  <li key={j}><a href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>© 2025 Vidya Setu. All rights reserved.</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Built for educators, by educators.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://fonts.googleapis.com";
    document.head.appendChild(link);
    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap";
    document.head.appendChild(link2);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#080808", color: "#fff", overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <ContentTypesSection />
      <WorkflowSection />
      <CreatorFeaturesSection />
      <QuizSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}