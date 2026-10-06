import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { lifeService } from "../../services/lifeService";

export function Topbar() {
  const [q, setQ] = useState(""),
    [open, setOpen] = useState(false),
    go = useNavigate(),
    user = authService.current() || {},
    initials = (user.name || "VP")
      .split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2);

  const search = (e) => {
    e.preventDefault();

    const query = q.trim().toLowerCase();

    if (!query) return;

    // Direct page keywords
    if (query.includes("health")) {
      go("/health");
      return;
    }

    if (query.includes("study")) {
      go("/study");
      return;
    }

    if (query.includes("habit")) {
      go("/habits");
      return;
    }

    if (query.includes("goal")) {
      go("/goals");
      return;
    }

    if (query.includes("report")) {
      go("/reports");
      return;
    }

    if (query.includes("calendar")) {
      go("/calendar");
      return;
    }

    if (query.includes("task")) {
      go("/tasks");
      return;
    }

    // Search actual Tasks
    const tasks = lifeService.tasks();

    const taskMatch = tasks.find((task) =>
      `${task.title} ${task.time || ""}`
        .toLowerCase()
        .includes(query)
    );

    if (taskMatch) {
      go("/tasks");
      return;
    }

    // Search actual Goals
    const goals = lifeService.read("lifeos-goals", []);

    const goalMatch = goals.find((goal) =>
      `${goal.title || ""}`
        .toLowerCase()
        .includes(query)
    );

    if (goalMatch) {
      go("/goals");
      return;
    }

    // Search actual Habits
    const habits = lifeService.habits();

    const habitMatch = habits.find((habit) =>
      `${habit.title || habit.name || ""}`
        .toLowerCase()
        .includes(query)
    );

    if (habitMatch) {
      go("/habits");
      return;
    }

    // Search actual Calendar events
    const events = lifeService.read("lifeos-events", []);

    const eventMatch = events.find((event) =>
      `${event.title || ""} ${event.date || ""} ${event.time || ""}`
        .toLowerCase()
        .includes(query)
    );

    if (eventMatch) {
      go("/calendar");
      return;
    }

    // Nothing found
    go("/tasks");
  };

  return (
    <header className="topbar">
      <Menu className="mobile-menu" size={20} />

      <form className="search" onSubmit={search}>
        <Search size={16} />

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tasks, plans, or spaces…"
        />
      </form>

      <button
        className="icon-button"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell size={18} />
      </button>

      {open && (
        <aside className="notification-popover">
          <button onClick={() => setOpen(false)}>
            <X size={14} />
          </button>

          <b>Today’s updates</b>

          <p>LifeOS has your day ready.</p>

          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
          >
            Open dashboard →
          </Link>
        </aside>
      )}

      <Link to="/profile" className="avatar">
        {initials}
      </Link>
    </header>
  );
}