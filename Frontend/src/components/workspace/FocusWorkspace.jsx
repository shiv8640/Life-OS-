import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Droplets,
  Flame,
  Heart,
  Plus,
  Target,
  Zap,
    Pencil,
  Trash2,
} from "lucide-react";
import { lifeService } from "../../services/lifeService";
import { authService } from "../../services/authService";
const config = {
  study: {
    eyebrow: "STUDY MODE",
    title: (
      <>
        Learn Smarter,
        <br />
        <em>Not Harder.</em>
      </>
    ),
    copy: "Your AI-powered study companion. Plan, focus, track and grow — all in one place.",
    accent: "#c66b47",
    icon: BookOpen,
    stat: [
      ["4h 30m", "Study Time"],
      ["3/5", "Subjects"],
      ["78%", "Weekly Goal"],
      ["12", "Day Streak"],
    ],
    quote: "Discipline today creates freedom tomorrow.",
  },
  health: {
    eyebrow: "HEALTH MODE",
    title: (
      <>
        A Healthier You,
        <br />
        <em>A Happier Life.</em>
      </>
    ),
    copy: "Your AI-powered wellness companion. Track, understand and improve your health — one day at a time.",
    accent: "#20a879",
    icon: Heart,
    stat: [
      ["78/100", "Health Score"],
      ["7h 20m", "Sleep"],
      ["2L", "Water"],
      ["30 min", "Exercise"],
    ],
    quote: "Small healthy choices make big changes.",
  },
  goals: {
    eyebrow: "GOALS MODE",
    title: (
      <>
        Turn Your Dreams
        <br />
        <em>into Daily Actions.</em>
      </>
    ),
    copy: "Your AI-powered goal planner. Set, track and achieve what truly matters — with intelligent guidance.",
    accent: "#f27a43",
    icon: Target,
    stat: [
      ["3", "Active Goals"],
      ["65%", "Overall Progress"],
      ["12", "Milestones"],
      ["28", "Days Consistent"],
    ],
    quote: "Same you. Bigger goals. Brighter tomorrow.",
  },
  habits: {
    eyebrow: "HABITS MODE",
    title: (
      <>
        Better Habits,
        <br />
        <em>A Brighter You.</em>
      </>
    ),
    copy: "Your AI-powered habit companion. Build, track and stay consistent — one small step at a time.",
    accent: "#745eea",
    icon: Flame,
    stat: [
      ["12", "Day Streak"],
      ["5/7", "Habits Completed"],
      ["85%", "Consistency"],
      ["85/100", "Habit Score"],
    ],
    quote: "Small habits. Big changes.",
  },
};
const rows = {
  study: [
    "Data Structures — Trees",
    "Computer Networks — Unit 3",
    "Aptitude Practice",
    "Revise Notes",
    "PYQs Practice",
  ],
  health: [
    "Drink 2L water",
    "30 min workout",
    "Healthy breakfast",
    "Meditation (10 mins)",
    "Sleep before 11 PM",
  ],
  goals: [
    "Solve 2 DSA problems",
    "Work on project UI",
    "30 min workout",
    "Plan tomorrow’s tasks",
  ],
  habits: [
    "Drink 2L Water",
    "Morning Exercise",
    "Read for 30 minutes",
    "No Social Media",
    "Meditate",
    "Sleep before 11 PM",
  ],
};
const route = {
  study: "/study",
  health: "/health",
  goals: "/goals",
  habits: "/habits",
};
const chartBars = [42, 68, 86, 98, 72, 52, 75];
const defaultHealthPlan = [
  { id: "water", title: "Drink 2L water", time: "08:00", done: false },
  { id: "workout", title: "30 minute workout", time: "07:00", done: false },
  { id: "meal", title: "Healthy breakfast", time: "09:00", done: false },
  {
    id: "meditate",
    title: "Meditation (10 mins)",
    time: "18:00",
    done: false,
  },
  { id: "sleep", title: "Sleep before 11 PM", time: "23:00", done: false },
  {
    id: "mood",
    title: "Log today’s mood",
    time: "21:00",
    done: false,
  },
];

function Modal({
  title,
  onClose,
  onSave,
  initialName = "",
  initialTime = "09:00",
}) {
  const [v, setV] = useState(initialName);

  let initialHour = "09";
  let initialMinute = "00";
  let initialPeriod = "AM";

  if (initialTime && initialTime.includes(":")) {
    const [h, m] = initialTime.split(":").map(Number);

    initialPeriod = h >= 12 ? "PM" : "AM";

    let displayHour = h % 12;
    if (displayHour === 0) displayHour = 12;

    initialHour = String(displayHour).padStart(2, "0");
    initialMinute = String(m).padStart(2, "0");
  }

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);

  const submit = (e) => {
    e.preventDefault();

    if (!v.trim()) return;

    let h = Number(hour);

    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;

    const time = `${String(h).padStart(2, "0")}:${minute}`;

    onSave({
      name: v.trim(),
      time,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="focus-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          className="focus-modal"
          initial={{ scale: 0.96, y: 12 }}
          animate={{ scale: 1, y: 0 }}
          onSubmit={submit}
        >
          <button
            type="button"
            className="modal-x"
            onClick={onClose}
          >
            ×
          </button>

          <p className="eyebrow">LIFEOS</p>

          <h2>{title}</h2>

          <input
            autoFocus
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="Give it a clear name"
          />

          <div style={{ display: "flex", gap: "8px" }}>
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const value = String(i + 1).padStart(2, "0");

                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>

            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            >
              {["00", "15", "30", "45"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <button className="button" type="submit">
            Save
          </button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

export default function FocusWorkspace({ kind }) {
   const user = authService.current();
  const userName = user?.name || user?.email?.split("@")[0] || "Friend";
  const c = config[kind],
    Icon = c.icon;
  const [modal, setModal] = useState(false);
  const [tasks, setTasks] = useState(lifeService.tasks());
  const [habits, setHabits] = useState(lifeService.habits());
  const [health, setHealth] = useState(lifeService.health());
  const [healthPlan, setHealthPlan] = useState(
    lifeService.read("lifeos-health-plan", defaultHealthPlan),
  );
  const [study, setStudy] = useState(lifeService.study());
  const [goals, setGoals] = useState(
    lifeService.read("lifeos-goals", [
      { id: 1, title: "Get Placed in a Good Company", value: 65 },
      { id: 2, title: "Improve Physical & Mental Health", value: 45 },
      { id: 3, title: "Build Personal Projects", value: 30 },
    ]),
  );
  const list =
  kind === "habits"
    ? habits
    : kind === "goals"
      ? goals
      : kind === "health"
        ? healthPlan
        : tasks;
 const [editingIndex, setEditingIndex] = useState(null);
  const saveList = (next) => {
    if (kind === "habits") {
      setHabits(next);
      lifeService.setHabits(next);
    } else if (kind === "goals") {
      setGoals(next);
      lifeService.save("lifeos-goals", next);
    } else if (kind === "health") {
      setHealthPlan(next);
      lifeService.save("lifeos-health-plan", next);
    } else {
      setTasks(next);
      lifeService.setTasks(next);
    }
    window.dispatchEvent(new Event("lifeos-data-change"));
  };
  const add = ({ name, time }) => {
  const next =
    kind === "habits"
      ? [...habits, { name, time, done: false, streak: 0 }]
      : kind === "goals"
        ? [...goals, { id: Date.now(), title: name, time, value: 0 }]
        : kind === "health"
          ? [
              ...healthPlan,
              {
                id: Date.now(),
                title: name,
                time,
                done: false,
              },
            ]
          : [
              ...tasks,
              {
                id: Date.now(),
                title: name,
                time,
                done: false,
              },
            ];

  saveList(next);

  lifeService.addActivity({
    type: kind,
    text: `Added ${name}`,
  });
};
const edit = (i) => {
  setEditingIndex(i);
  setModal(true);
};
const remove = (i) => {
  const next = list.filter((_, j) => j !== i);
  saveList(next);
  lifeService.addActivity({
    type: kind,
    text: `Deleted ${kind} item`,
  });
};
const saveEdit = ({ name, time }) => {
  const next = list.map((item, i) => {
    if (i !== editingIndex) return item;

    if (kind === "habits") {
      return { ...item, name, time };
    }

    return { ...item, title: name, time };
  });

  saveList(next);
  setEditingIndex(null);

  lifeService.addActivity({
    type: kind,
    text: `Edited ${name}`,
  });
};
const toggle = (i) => {
    if (kind === "habits") {
      const next = habits.map((x, j) =>
        j === i
          ? {
              ...x,
              done: !x.done,
              streak: x.done ? Math.max(0, x.streak - 1) : x.streak + 1,
            }
          : x,
      );
      saveList(next);
    } else if (kind === "health") {
      const next = healthPlan.map((x, j) =>
        j === i ? { ...x, done: !x.done } : x,
      );
      saveList(next);
      lifeService.addActivity({
        type: "health",
        text: `${healthPlan[i].done ? "Reopened" : "Completed"} ${healthPlan[i].title}`,
      });
    } else if (kind !== "goals") {
      const next = tasks.map((x, j) => (j === i ? { ...x, done: !x.done } : x));
      saveList(next);
    } else {
      const next = goals.map((x, j) =>
        j === i ? { ...x, value: Math.min(100, x.value + 5) } : x,
      );
      saveList(next);
    }
  };
  const visible = useMemo(
    () =>
      kind === "goals"
        ? goals
        : kind === "habits"
          ? habits
          : kind === "health"
            ? healthPlan
            : tasks.slice(0, 5),
    [kind, goals, habits, healthPlan, tasks],
  );
  const healthAction = () => {
    const next = { ...health, water: Math.min(8, health.water + 1) };
    setHealth(next);
    lifeService.setHealth(next);
    lifeService.addActivity({
      type: "health",
      text: "Logged a glass of water.",
    });
  };
const FOCUS_DURATION = 60 * 60;

const getSavedFocusTimer = () =>
  lifeService.read("lifeos-focus-timer", {
    remaining: FOCUS_DURATION,
    running: false,
    startedAt: null,
  });

const [focusTimer, setFocusTimer] = useState(getSavedFocusTimer);

const completeFocusSession = () => {
  const latestStudy = lifeService.study();

  const nextStudy = {
    ...latestStudy,
    hours: +(latestStudy.hours + 1).toFixed(1),
    focus: Math.min(100, latestStudy.focus + 1),
  };

  setStudy(nextStudy);
  lifeService.setStudy(nextStudy);

  lifeService.addActivity({
    type: "study",
    text: "Completed a 1-hour focused study session.",
  });

  lifeService.addNotification({
    key: `focus-complete-${Date.now()}`,
    type: "study",
    title: "Focus Session Complete",
    message: "Your 1-hour focus session is complete.",
    action: "Study",
  });

  const resetTimer = {
    remaining: FOCUS_DURATION,
    running: false,
    startedAt: null,
  };

  setFocusTimer(resetTimer);
  lifeService.save("lifeos-focus-timer", resetTimer);

  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    new Notification("Focus Session Complete", {
      body: "Your 1-hour focus session is complete.",
    });
  }
};

const startFocus = async () => {
  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "default"
  ) {
    try {
      await Notification.requestPermission();
    } catch {
      // Ignore notification permission errors
    }
  }

  const current = getSavedFocusTimer();

  const next = {
    remaining:
      current.remaining > 0 ? current.remaining : FOCUS_DURATION,
    running: true,
    startedAt: Date.now(),
  };

  setFocusTimer(next);
  lifeService.save("lifeos-focus-timer", next);
};

const pauseFocus = () => {
  const current = getSavedFocusTimer();

  if (!current.running || !current.startedAt) return;

  const elapsed = Math.floor(
    (Date.now() - current.startedAt) / 1000,
  );

  const next = {
    remaining: Math.max(0, current.remaining - elapsed),
    running: false,
    startedAt: null,
  };

  setFocusTimer(next);
  lifeService.save("lifeos-focus-timer", next);
};

const stopFocus = () => {
  const resetTimer = {
    remaining: FOCUS_DURATION,
    running: false,
    startedAt: null,
  };

  setFocusTimer(resetTimer);
  lifeService.save("lifeos-focus-timer", resetTimer);
};

useEffect(() => {
  if (kind !== "study") return;

  const syncTimer = () => {
    const current = getSavedFocusTimer();

    if (!current.running || !current.startedAt) {
      setFocusTimer(current);
      return;
    }

    const elapsed = Math.floor((Date.now() - current.startedAt) / 1000);
    const remaining = Math.max(0, current.remaining - elapsed);

    if (remaining <= 0) {
      completeFocusSession();
      return;
    }

    setFocusTimer({
      ...current,
      remaining,
    });
  };

  syncTimer();

  const interval = setInterval(syncTimer, 1000);

  return () => clearInterval(interval);
}, [kind]);

const formatFocusTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0",
  )}`;
};
  return (
    <div className={"focus-workspace " + kind} style={{ "--focus": c.accent }}>
      <section className="focus-hero">
        <div className="focus-copy">
          <p className="mode-chip">
            <Icon size={12} />
            {c.eyebrow}
          </p>
          <h1>{c.title}</h1>
          <p>{c.copy}</p>
        </div>
        <div className="robot-scene">
          <div className="bot-head">
            <span>⌣</span>
          </div>
          <div className="bot-body" />
          <div className="bot-bubble">
            <b>Hey {userName}! ✨</b>
            <span>
              {kind === "study"
                ? "You’re on a 5-day study streak. Shall we continue today?"
                : kind === "health"
                  ? "Your energy is looking great today. Let’s keep it up?"
                  : kind === "goals"
                    ? "You’re 5% closer to your goal. Plan today’s action?"
                    : "Your consistency is higher this week. You’re doing amazing!"}
            </span>
          </div>
        </div>
        <aside className="hero-quote">{c.quote}</aside>
      </section>
      <section className="focus-stats">
        {c.stat.map(([value, label], i) => (
          <motion.button
            whileHover={{ y: -4 }}
            key={label}
            onClick={() =>
              kind === "health" && i === 2
                ? healthAction()
                : kind === "study" && i === 0
                  ? studyAction()
                  : null
            }
          >
            <span className={"stat-icon i" + i}>
              <Icon size={19} />
            </span>
            <b>
              {kind === "health" && i === 2
                ? health.water + "L"
                : kind === "study" && i === 0
                  ? study.hours + "h"
                  : value}
            </b>
            <small>{label}</small>
          </motion.button>
        ))}
      </section>
      <div className="focus-grid">
        <section className="focus-card focus-plan">
          <header>
            <h2>
              {kind === "goals"
                ? "Today’s Goal Actions"
                : kind === "habits"
                  ? "Today’s Habits"
                  : kind === "health"
                    ? "Today’s Health Plan"
                    : "Today’s Study Plan"}
            </h2>
            <button onClick={() => setModal(true)}>
              <Plus size={16} />
            </button>
          </header>
          <div className="focus-list">
            {visible.map((item, i) => {
              const label =
                kind === "goals"
                  ? item.title
                  : kind === "habits"
                    ? item.name
                    : item.title;
              const done = kind === "goals" ? item.value >= 100 : item.done;
              return (
                <motion.div
                  layout
                  key={item.id || item.name || label}
                  className={done ? "done" : ""}
                >
                  <button
                    onClick={() => toggle(i)}
                    aria-label={"Complete " + label}
                  >
                    {done ? <Check size={15} /> : <Circle size={16} />}
                  </button>
                  <div>
                    <b>{label}</b>
                    <small>
                      {kind === "goals"
                        ? item.value + "% complete"
                        : kind === "habits"
                          ? (item.streak || 0) + " day streak"
                          : item.time || rows[kind][i]}
                    </small>
                  </div>
                  <span>
                    {kind === "goals"
                      ? "Progress"
                      : kind === "study"
                        ? "Study"
                        : kind === "health"
                          ? "Today"
                          : "Daily"}
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
  <button
    type="button"
    onClick={() => edit(i)}
    aria-label={"Edit " + label}
  >
    <Pencil size={14} />
  </button>

  <button
    type="button"
    onClick={() => remove(i)}
    aria-label={"Delete " + label}
  >
    <Trash2 size={14} />
  </button>
</div>
                </motion.div>
              );
            })}
          </div>
          <Link to={route[kind]} className="view-more">
            Open full {kind} space <ArrowRight size={14} />
          </Link>
        </section>
        <section className="focus-card focus-visual">
          <header>
            <h2>
              {kind === "study"
                ? "Focus Session"
                : kind === "health"
                  ? "Health Overview"
                  : kind === "goals"
                    ? "Goal Progress Overview"
                    : "Habit Calendar"}
            </h2>
            <Link to={route[kind]}>
              View details <ChevronRight size={14} />
            </Link>
          </header>
          {kind === "study" ? (
  <>
    <div className="focus-dial">
      <b>{formatFocusTime(focusTimer.remaining)}</b>
      <small>Focus on what matters.</small>
    </div>

  <div style={{ display: "flex", gap: "10px" }}>
  <button
    className="button"
    onClick={focusTimer.running ? pauseFocus : startFocus}
  >
    {focusTimer.running ? "⏸ Pause Focus" : "▶ Start Focus"}
  </button>

  <button
    className="button"
    onClick={stopFocus}
  >
    ⏹ Stop
  </button>
</div>
  </>
):kind === "health" ? (
            <div className="line-chart">
              {chartBars.map((x, i) => (
                <i key={i} style={{ height: x + "%" }} />
              ))}
              <div className="chart-labels">Mon Tue Wed Thu Fri Sat Sun</div>
              <button className="button" onClick={healthAction}>
                <Droplets size={15} /> Log water
              </button>
            </div>
          ) : kind === "goals" ? (
            <div className="line-chart goals-chart">
              {chartBars.map((x, i) => (
                <i key={i} style={{ height: x - 10 + "%" }} />
              ))}
              <div className="chart-labels">Week 1 Week 2 Week 3 Week 4</div>
            </div>
          ) : (
            <div className="habit-calendar">
              {Array.from({ length: 35 }, (_, i) => (
                <button
                  key={i}
                  className={
                    i % 6 === 0
                      ? "missed"
                      : i % 4 === 0
                        ? "partial"
                        : "complete"
                  }
                  onClick={() =>
                    lifeService.addActivity({
                      type: "habit",
                      text: "Reviewed habit calendar",
                    })
                  }
                />
              ))}
            </div>
          )}
        </section>
        <aside className="focus-card focus-coach">
          <header>
            <h2>✦ AI {kind[0].toUpperCase() + kind.slice(1)} Coach</h2>
            <span>Online</span>
          </header>
          <div className="coach-message">
            <b>Hi {userName}!</b>
            <p>
              I can help you build a better plan, understand your progress and
              take the next thoughtful step.
            </p>
          </div>
          {[
            "Create a personalized plan",
            "Explain my progress",
            "Give me a simple next step",
          ].map((x) => (
            <button
              key={x}
              onClick={() =>
                lifeService.addActivity({ type: "ai", text: `AI coach: ${x}` })
              }
            >
              {x}
              <ArrowRight size={13} />
            </button>
          ))}
          <Link to="/ai-assistant">
            Chat with LifeOS AI <ArrowRight size={13} />
          </Link>
        </aside>
      </div>
      <div className="focus-lower">
        <section className="focus-card mini-progress">
          <header>
            <h2>
              {kind === "study"
                ? "Subject Progress"
                : kind === "health"
                  ? "Sleep, nutrition & activity"
                  : kind === "goals"
                    ? "Milestones"
                    : "Streak & Progress"}
            </h2>
          </header>
          {["Consistency", "Focus", "Progress", "Momentum"].map((x, i) => (
            <div className="bar-row" key={x}>
              <span>{x}</span>
              <i>
                <b style={{ width: 82 - i * 13 + "%" }} />
              </i>
              <small>{82 - i * 13}%</small>
            </div>
          ))}
        </section>
        <section className="focus-card insight-card">
          <header>
            <h2>✦ AI Insights</h2>
          </header>
          {[
            "You’re building strong momentum this week.",
            "A small focused session will make today feel lighter.",
            "Your consistency is improving — keep the next step simple.",
          ].map((x, i) => (
            <button
              key={x}
              onClick={() => lifeService.addActivity({ type: "ai", text: x })}
            >
              <Brain size={16} />
              <span>{x}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </section>
        <section className="focus-card inspiration">
          <span>Today’s motivation</span>
          <h2>“{c.quote}”</h2>
          <Link to="/ai-assistant">
            Ask AI <ArrowRight size={14} />
          </Link>
        </section>
      </div>
           {modal && (
        <Modal
          title={
            editingIndex !== null
              ? `Edit ${
                  kind === "goals"
                    ? "goal"
                    : kind === "habits"
                      ? "habit"
                      : kind === "health"
                        ? "wellness action"
                        : "task"
                }`
              : `Add a ${
                  kind === "goals"
                    ? "goal"
                    : kind === "habits"
                      ? "habit"
                      : kind === "health"
                        ? "wellness action"
                        : "task"
                }`
          }
          onClose={() => {
            setModal(false);
            setEditingIndex(null);
          }}
          onSave={editingIndex !== null ? saveEdit : add}
          initialName={
            editingIndex !== null
              ? kind === "habits"
                ? list[editingIndex]?.name || ""
                : list[editingIndex]?.title || ""
              : ""
          }
          initialTime={
            editingIndex !== null
              ? list[editingIndex]?.time || "09:00"
              : "09:00"
          }
        />
      )}
    </div>
  );
}