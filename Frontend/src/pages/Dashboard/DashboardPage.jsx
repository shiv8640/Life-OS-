import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  CheckSquare,
  HeartPulse,
  Plus,
  Target,
  Zap,
} from "lucide-react";
import { Card, ProgressBar } from "../../components/common/UI";
import { lifeService } from "../../services/lifeService";
import { authService } from "../../services/authService";

const pages = {
  Study: ["/study", BookOpen],
  Health: ["/health", HeartPulse],
  Habits: ["/habits", CheckSquare],
  Goals: ["/goals", Target],
  Productivity: ["/tasks", Zap],
};

const read = () => ({
  tasks: lifeService.tasks(),
  study: lifeService.study(),
  health: lifeService.health(),
  habits: lifeService.habits(),
  focus: lifeService.focusAreas(),
  goals: lifeService.read("lifeos-goals", []),
  events: lifeService.read("lifeos-events", []),
});

const FOCUS_DURATION = 60 * 60;

const getFocusTimer = () =>
  lifeService.read("lifeos-focus-timer", {
    remaining: FOCUS_DURATION,
    running: false,
    startedAt: null,
  });

export default function DashboardPage() {
  const [data, setData] = useState(read);
  const [draft, setDraft] = useState("");
  const [focusTimer, setFocusTimer] = useState(getFocusTimer);

  useEffect(() => {
    const update = () => setData(read());

    window.addEventListener("lifeos-data-change", update);

    return () => {
      window.removeEventListener("lifeos-data-change", update);
    };
  }, []);

  // =========================
  // FOCUS TIMER
  // =========================

  const startDashboardFocus = async () => {
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

    const current = getFocusTimer();

    const next = {
      remaining:
        current.remaining > 0 ? current.remaining : FOCUS_DURATION,
      running: true,
      startedAt: Date.now(),
    };

    setFocusTimer(next);
    lifeService.save("lifeos-focus-timer", next);
  };

  const pauseDashboardFocus = () => {
    const current = getFocusTimer();

    if (!current.running || !current.startedAt) return;

    const elapsed = Math.floor(
      (Date.now() - current.startedAt) / 1000,
    );

    const next = {
      remaining: Math.max(
        0,
        current.remaining - elapsed,
      ),
      running: false,
      startedAt: null,
    };

    setFocusTimer(next);
    lifeService.save("lifeos-focus-timer", next);
  };

  const stopDashboardFocus = () => {
    const resetTimer = {
      remaining: FOCUS_DURATION,
      running: false,
      startedAt: null,
    };

    setFocusTimer(resetTimer);
    lifeService.save("lifeos-focus-timer", resetTimer);
  };

  const completeDashboardFocus = () => {
    const latestStudy = lifeService.study();

    const nextStudy = {
      ...latestStudy,
      hours: +(latestStudy.hours + 1).toFixed(1),
      focus: Math.min(100, latestStudy.focus + 1),
    };

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

  const formatFocusTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs,
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    const syncFocusTimer = () => {
      const current = getFocusTimer();

      if (!current.running || !current.startedAt) {
        setFocusTimer(current);
        return;
      }

      const elapsed = Math.floor(
        (Date.now() - current.startedAt) / 1000,
      );

      const remaining = Math.max(
        0,
        current.remaining - elapsed,
      );

      if (remaining <= 0) {
        completeDashboardFocus();
        return;
      }

      setFocusTimer({
        ...current,
        remaining,
      });
    };

    syncFocusTimer();

    const timer = setInterval(
      syncFocusTimer,
      1000,
    );

    return () => clearInterval(timer);
  }, []);

  // =========================
  // USER
  // =========================

  const user = authService.current() || {};
  const name = (user.name || "there").split(" ")[0];

  const date = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const done = data.tasks.filter((x) => x.done).length;
const upcomingEvents = [...data.events]
  .filter((event) => {
    const eventDate = new Date(event.date + "T00:00:00");
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return eventDate >= today;
  })
  .sort(
    (a, b) =>
      new Date(a.date) - new Date(b.date),
  )
  .slice(0, 3);
  const scores = useMemo(
    () => ({
      Study: data.study.focus,
      Health: Math.round(
        data.health.energy * 0.6 +
          data.health.water * 5,
      ),
      Habits: Math.round(
        (data.habits.filter((x) => x.done).length /
          Math.max(1, data.habits.length)) *
          100,
      ),
      Goals: Math.round(
  data.goals.length
    ? data.goals.reduce(
        (sum, goal) => sum + (goal.value || 0),
        0,
      ) / data.goals.length
    : 0,
),
      Productivity: Math.round(
        (done / Math.max(1, data.tasks.length)) *
          100,
      ),
    }),
    [data, done],
  );

  // =========================
  // ADD TASK
  // =========================

  const add = (e) => {
    e.preventDefault();

    if (!draft.trim()) return;

    lifeService.setTasks([
      ...data.tasks,
      {
        id: Date.now(),
        title: draft,
        time: "Anytime",
        done: false,
      },
    ]);

    lifeService.addActivity({
      type: "task",
      text: "Added " + draft,
    });

    setDraft("");
  };

  // =========================
  // TOGGLE TASK
  // =========================

  const toggle = (t) => {
    lifeService.setTasks(
      data.tasks.map((x) =>
        x.id === t.id
          ? { ...x, done: !x.done }
          : x,
      ),
    );

    lifeService.addActivity({
      type: "task",
      text:
        (t.done ? "Reopened " : "Completed ") +
        t.title,
    });
  };

  return (
    <motion.div
      className="page dashboard-v2"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="dash-header">
        <div>
          <p className="eyebrow">
            {date.toUpperCase()}
          </p>

          <h1>
            Good morning, {name} <span>☀</span>
          </h1>

          <p>
            Let’s make today productive and peaceful.
          </p>
        </div>

        <div>
          <Link
            to="/notifications"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </Link>

          <span className="date-pill">
            <CalendarDays size={16} />
            {date}
          </span>
        </div>
      </header>

      <section className="ai-brief">
        <div>
          <span>
            <Brain size={17} /> LIFEOS AI DAILY BRIEF
          </span>

          <h1>Here’s what matters today.</h1>

          <p>
            {done === data.tasks.length
              ? "Your priorities are clear—protect a focused block for yourself."
              : `You have ${
                  data.tasks.length - done
                } tasks left. Start with the one that makes the rest of your day easier.`}
          </p>

          <Link
            className="button"
            to="/ai-assistant"
          >
            Ask LifeOS AI
          </Link>
        </div>

        <div className="brief-orbit">
          <b>
            {scores.Productivity}
            <small>momentum</small>
          </b>

          <em>today</em>
        </div>
      </section>

      <section className="score-grid">
        {Object.entries(scores).map(
          ([label, value]) => {
            const [url, Icon] = pages[label];

            return (
              <Link key={label} to={url}>
                <Card>
                  <span>
                    <Icon size={19} />
                  </span>

                  <div>
                    <small>{label}</small>
                    <strong>{value}%</strong>
                    <ProgressBar value={value} />
                  </div>
                </Card>
              </Link>
            );
          },
        )}
      </section>

      <section className="dashboard-main">
        <Card className="priority-card">
          <div className="dash-title">
            <div>
              <p className="eyebrow">
                SMART PRIORITIES
              </p>

              <h2>Today’s tasks</h2>
            </div>

            <Link to="/tasks">
              <Plus size={15} /> Manage
            </Link>
          </div>

          {data.tasks.map((t) => (
            <motion.div
              layout
              className={
                "priority-row " +
                (t.done ? "is-done" : "")
              }
              key={t.id}
            >
              <button
                className="check"
                onClick={() => toggle(t)}
              >
                {t.done && <Check size={14} />}
              </button>

              <Link to="/tasks">
                <b>{t.title}</b>
                <small>{t.time}</small>
              </Link>
            </motion.div>
          ))}

          <form
            className="dash-add"
            onSubmit={add}
          >
            <input
              value={draft}
              onChange={(e) =>
                setDraft(e.target.value)
              }
              placeholder="Add a priority"
            />

            <button>
              <Plus size={15} />
            </button>
          </form>
        </Card>

        <Card className="focus-panel">
          <p className="eyebrow">
            YOUR MAIN FOCUS
          </p>

          <h2>
            {data.focus[0] ||
              "Build your rhythm"}
          </h2>

          <div className="timer-dial">
            <b>
              {formatFocusTime(
                focusTimer.remaining,
              )}
            </b>

            <span>focus block</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button
              className="button"
              onClick={
                focusTimer.running
                  ? pauseDashboardFocus
                  : startDashboardFocus
              }
            >
              {focusTimer.running
                ? "⏸ Pause Focus"
                : "▶ Start Focus"}
            </button>

            <button
              className="button"
              onClick={stopDashboardFocus}
            >
              ⏹ Stop
            </button>
          </div>
        </Card>

        <aside className="right-rail">
          <Card className="upcoming-v2">
            <h2>Upcoming</h2>
{upcomingEvents.length > 0 ? (
  upcomingEvents.map((event, i) => (
    <Link key={event.id} to="/calendar">
      <span>{i + 1}</span>

      <div>
        <b>
          {event.title} ·{" "}
          {new Date(
            event.date + "T00:00:00"
          ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </b>

        <small>{event.time}</small>
      </div>
    </Link>
  ))
) : (
  <p>No upcoming events.</p>
)}

          </Card>

          <Card className="recommendation">
            <p className="eyebrow">
              AI NUDGE
            </p>

            <h2>
              A 25-minute focus block is enough to
              make progress.
            </h2>

            <Link to="/ai-assistant">
              Get a plan →
            </Link>
          </Card>
        </aside>
      </section>
    </motion.div>
  );
}