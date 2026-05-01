import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Sparkles,
  FileText,
  BookOpen,
  GraduationCap,
  Tag,
  Trash2,
  Plus,
  CheckCircle2,
  Lightbulb,
  Send,
  Loader2,
  Clock,
  Target,
  Sun,
  Moon,
} from "lucide-react";
import Layout from "../components/Layout";

// ============== AXIOS INSTANCE ==============
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============== CONSTANTS ==============
const SUBJECTS = [
  "Mathematics", "Science", "English", "Social Studies",
  "Hindi", "Computer Science", "General Knowledge", "Other",
];
const GRADES = ["1","2","3","4","5","6","7","8","9","10","11","12","All"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const newQuestion = () => ({
  questionText: "",
  questionType: "mcq",
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
  correctAnswer: "",
  explanation: "",
  points: 1,
});

// Reusable styles
const inputCls =
  "w-full h-12 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
const labelCls = "flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

// ============== MAIN PAGE ==============
const Index = () => {
  const [submitting, setSubmitting] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    subject: "",
    grade: "",
    difficulty: "beginner",
    tags: "",
    duration: 30,
    passingScore: 60,
    questions: [newQuestion()],
  });

  const totalPoints = useMemo(
    () => quiz.questions.reduce((s, q) => s + (parseInt(q.points) || 0), 0),
    [quiz.questions]
  );

  const setField = (field, value) => setQuiz((p) => ({ ...p, [field]: value }));

  const updateQuestion = (idx, updated) =>
    setQuiz((p) => ({ ...p, questions: p.questions.map((q, i) => (i === idx ? updated : q)) }));

  const addQuestion = () => {
    setQuiz((p) => ({ ...p, questions: [...p.questions, newQuestion()] }));
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 50);
  };

  const removeQuestion = (idx) => {
    if (quiz.questions.length === 1) {
      alert("At least one question is required");
      return;
    }
    setQuiz((p) => ({ ...p, questions: p.questions.filter((_, i) => i !== idx) }));
  };

  // ---- Question helpers ----
  const updateQField = (idx, field, value) =>
    updateQuestion(idx, { ...quiz.questions[idx], [field]: value });

  const updateOption = (qIdx, optIdx, field, value) => {
    const q = quiz.questions[qIdx];
    const newOptions = q.options.map((o, i) => (i === optIdx ? { ...o, [field]: value } : o));
    const correctAnswer =
      field === "text" && q.options[optIdx]?.isCorrect ? value : q.correctAnswer;
    updateQuestion(qIdx, { ...q, options: newOptions, correctAnswer });
  };

  const setCorrectOption = (qIdx, optIdx) => {
    const q = quiz.questions[qIdx];
    const newOptions = q.options.map((o, i) => ({ ...o, isCorrect: i === optIdx }));
    updateQuestion(qIdx, {
      ...q,
      options: newOptions,
      correctAnswer: q.options[optIdx]?.text || "",
    });
  };

  const addOption = (qIdx) => {
    const q = quiz.questions[qIdx];
    updateQuestion(qIdx, { ...q, options: [...q.options, { text: "", isCorrect: false }] });
  };

  const removeOption = (qIdx, optIdx) => {
    const q = quiz.questions[qIdx];
    updateQuestion(qIdx, { ...q, options: q.options.filter((_, i) => i !== optIdx) });
  };

  const onTypeChange = (qIdx, type) => {
    const q = quiz.questions[qIdx];
    let options = [];
    let correctAnswer = "";
    if (type === "mcq") {
      options = [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ];
    } else if (type === "true-false") {
      options = [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ];
      correctAnswer = "True";
    }
    updateQuestion(qIdx, { ...q, questionType: type, options, correctAnswer });
  };

  // ---- Validation + submit ----
  const validate = () => {
    if (!quiz.title.trim() || !quiz.description.trim() || !quiz.subject || !quiz.grade) {
      alert("Fill in title, description, subject and grade");
      return false;
    }
    const invalid = quiz.questions.find((q) => !q.questionText.trim() || !q.correctAnswer);
    if (invalid) {
      alert("Complete all questions and correct answers");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: quiz.title.trim(),
        description: quiz.description.trim(),
        subject: quiz.subject,
        grade: quiz.grade,
        difficulty: quiz.difficulty,
        duration: Number(quiz.duration),
        passingScore: Number(quiz.passingScore),
        tags: quiz.tags.split(",").map((t) => t.trim()).filter(Boolean),
        questions: quiz.questions.map((q) => ({
          questionText: q.questionText.trim(),
          questionType: q.questionType,
          options: q.questionType === "short-answer" ? [] : q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || "",
          points: Number(q.points) || 1,
        })),
      };
      const { data } = await api.post("/quizzes", payload);
      alert(`🎉 Quiz created: ${quiz.title}`);
      console.log("Created quiz:", data);
      setQuiz({
        title: "", description: "", subject: "", grade: "",
        difficulty: "beginner", tags: "", duration: 30, passingScore: 60,
        questions: [newQuestion()],
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err?.message ||
        "Failed to create quiz";
      alert("Error: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors">
      <main className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" /> New Quiz
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-slate-900 dark:text-slate-50">
            Create a{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Quiz
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Fill out the form to publish a new quiz to your students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ============== DETAILS ============== */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/30">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quiz Details</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Basic information about this quiz.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelCls}>
                  <FileText className="h-4 w-4 text-indigo-500" /> Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Algebra Fundamentals — Chapter 1"
                  value={quiz.title}
                  onChange={(e) => setField("title", e.target.value)}
                  maxLength={200}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  <BookOpen className="h-4 w-4 text-indigo-500" /> Description
                </label>
                <textarea
                  placeholder="Describe what this quiz covers..."
                  value={quiz.description}
                  onChange={(e) => setField("description", e.target.value)}
                  maxLength={1000}
                  className={`${inputCls} h-28 py-3 resize-none`}
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 text-right mt-1">
                  {quiz.description.length}/1000
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>
                    <GraduationCap className="h-4 w-4 text-indigo-500" /> Subject
                  </label>
                  <select
                    value={quiz.subject}
                    onChange={(e) => setField("subject", e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select subject</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Grade Level</label>
                  <select
                    value={quiz.grade}
                    onChange={(e) => setField("grade", e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select grade</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>{g === "All" ? "All Grades" : `Grade ${g}`}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Difficulty</label>
                  <select
                    value={quiz.difficulty}
                    onChange={(e) => setField("difficulty", e.target.value)}
                    className={`${inputCls} capitalize`}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d} className="capitalize">{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  <Tag className="h-4 w-4 text-indigo-500" /> Tags{" "}
                  <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">(comma separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. algebra, equations, practice"
                  value={quiz.tags}
                  onChange={(e) => setField("tags", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* ============== QUESTIONS ============== */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Questions</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""} ·{" "}
                  {totalPoints} total points
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {quiz.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 pl-8 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Number badge */}
                  <div className="absolute -left-3 -top-3 h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shadow-lg shadow-indigo-500/30 text-sm">
                    {idx + 1}
                  </div>

                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Question {idx + 1} of {quiz.questions.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* Type & Points */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 block">
                          Type
                        </label>
                        <select
                          value={q.questionType}
                          onChange={(e) => onTypeChange(idx, e.target.value)}
                          className={inputCls}
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="true-false">True / False</option>
                          <option value="short-answer">Short Answer</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 block">
                          Points
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={q.points}
                          onChange={(e) => updateQField(idx, "points", parseInt(e.target.value) || 1)}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Question text */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 block">
                        Question
                      </label>
                      <textarea
                        placeholder="Enter your question..."
                        value={q.questionText}
                        onChange={(e) => updateQField(idx, "questionText", e.target.value)}
                        className={`${inputCls} h-20 py-3 resize-none`}
                      />
                    </div>

                    {/* MCQ Options */}
                    {q.questionType === "mcq" && (
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2 block">
                          Options{" "}
                          <span className="normal-case text-slate-400 dark:text-slate-500 font-normal">
                            (click circle to mark correct)
                          </span>
                        </label>
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                                opt.isCorrect
                                  ? "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => setCorrectOption(idx, optIdx)}
                                className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${
                                  opt.isCorrect
                                    ? "border-emerald-500 bg-emerald-500 scale-110"
                                    : "border-slate-300 dark:border-slate-600 hover:border-indigo-500"
                                }`}
                              >
                                {opt.isCorrect && (
                                  <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />
                                )}
                              </button>
                              <input
                                type="text"
                                placeholder={`Option ${optIdx + 1}`}
                                value={opt.text}
                                onChange={(e) => updateOption(idx, optIdx, "text", e.target.value)}
                                className="flex-1 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                              />
                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(idx, optIdx)}
                                  className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        {q.options.length < 6 && (
                          <button
                            type="button"
                            onClick={() => addOption(idx)}
                            className="mt-2 inline-flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition"
                          >
                            <Plus className="h-4 w-4" /> Add Option
                          </button>
                        )}
                      </div>
                    )}

                    {/* True / False */}
                    {q.questionType === "true-false" && (
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2 block">
                          Correct Answer
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {["True", "False"].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                const opts = [
                                  { text: "True", isCorrect: val === "True" },
                                  { text: "False", isCorrect: val === "False" },
                                ];
                                updateQuestion(idx, { ...q, correctAnswer: val, options: opts });
                              }}
                              className={`p-4 rounded-xl border-2 font-medium transition ${
                                q.correctAnswer === val
                                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-500/50"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Short answer */}
                    {q.questionType === "short-answer" && (
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 block">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          placeholder="Expected answer..."
                          value={q.correctAnswer}
                          onChange={(e) => updateQField(idx, "correctAnswer", e.target.value)}
                          className={inputCls}
                        />
                      </div>
                    )}

                    {/* Explanation */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
                        <Lightbulb className="h-3.5 w-3.5" /> Explanation{" "}
                        <span className="normal-case font-normal text-slate-400 dark:text-slate-500">(optional)</span>
                      </label>
                      <textarea
                        placeholder="Help students understand the answer..."
                        value={q.explanation}
                        onChange={(e) => updateQField(idx, "explanation", e.target.value)}
                        className={`${inputCls} h-16 py-2 text-sm resize-none`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full h-14 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-base font-semibold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition"
            >
              <Plus className="h-5 w-5" /> Add Another Question
            </button>
          </section>

          {/* ============== SETTINGS ============== */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/30">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Settings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Duration and passing score.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>
                  <Clock className="h-4 w-4 text-indigo-500" /> Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quiz.duration}
                  onChange={(e) => setField("duration", parseInt(e.target.value) || 1)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  <Target className="h-4 w-4 text-indigo-500" /> Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quiz.passingScore}
                  onChange={(e) => setField("passingScore", parseInt(e.target.value) || 0)}
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-xl shadow-indigo-500/40 hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
              ) : (
                <><Send className="h-4 w-4" /> Create Quiz</>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
    </Layout>
  );
};

export default Index;
