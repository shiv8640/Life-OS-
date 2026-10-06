import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Brain,
  CircleUserRound,
  Palette,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { authService } from "../../services/authService";

const defaults = {
  task: true,
  study: true,
  health: true,
  habits: true,
  insights: true,
  email: false,
  dark: false,
  compact: false,
};

export default function SettingsPage() {
  const [user, setUser] = useState(authService.current() || {});

  const [set, setSettings] = useState(
    () =>
      JSON.parse(localStorage.getItem("lifeos-settings") || "null") ||
      defaults,
  );

  const [notice, setNotice] = useState("");

  const toggle = (key) => {
    const next = {
      ...set,
      [key]: !set[key],
    };

    setSettings(next);
    localStorage.setItem("lifeos-settings", JSON.stringify(next));
  };

  const selectAppearance = (key, value) => {
    const next = {
      ...set,
      [key]: value,
    };

    setSettings(next);
    localStorage.setItem("lifeos-settings", JSON.stringify(next));
  };

  const save = (e) => {
    e.preventDefault();

    authService.login(user);

    localStorage.setItem("lifeos-settings", JSON.stringify(set));

    setNotice("Changes saved successfully.");

    setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  const logout = () => {
    if (authService.logout) {
      authService.logout();
    }
  };

  return (
    <motion.div
      className="settings-v2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* PROFILE HEADER */}

      <div className="settings-profile">
        <div className="settings-avatar">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : user?.email?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="settings-profile-info">
          <h1>{user.name || "LifeOS User"}</h1>

          <p>{user.email || "Your personal LifeOS account"}</p>

          <Link to="/profile">Edit profile</Link>
        </div>
      </div>

      <form onSubmit={save} className="settings-instagram-layout">
        {/* LEFT MENU */}

        <aside className="settings-menu">
          <div className="settings-menu-title">
            <span>Settings</span>
          </div>

          <a href="#profile" className="settings-menu-item active">
            <CircleUserRound size={19} />
            <span>Profile</span>
            <ChevronRight size={15} />
          </a>

          <a href="#appearance" className="settings-menu-item">
            <Palette size={19} />
            <span>Appearance</span>
            <ChevronRight size={15} />
          </a>

          <a href="#notifications" className="settings-menu-item">
            <Bell size={19} />
            <span>Notifications</span>
            <ChevronRight size={15} />
          </a>

          <a href="#ai" className="settings-menu-item">
            <Brain size={19} />
            <span>AI personalization</span>
            <ChevronRight size={15} />
          </a>

          <a href="#privacy" className="settings-menu-item">
            <ShieldCheck size={19} />
            <span>Privacy & data</span>
            <ChevronRight size={15} />
          </a>

          <div className="settings-menu-divider" />

          <button type="button" className="settings-menu-item logout" onClick={logout}>
            <LogOut size={19} />
            <span>Log out</span>
          </button>
        </aside>

        {/* RIGHT CONTENT */}

        <main className="settings-content">
          {/* PROFILE */}

          <section id="profile" className="settings-card">
            <div className="settings-card-heading">
              <div>
                <h2>Profile</h2>
                <p>Manage your LifeOS account information.</p>
              </div>
            </div>

            <div className="settings-profile-form">
              <label>
                Full name
                <input
                  value={user.name || ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={user.email || ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      email: e.target.value,
                    })
                  }
                  placeholder="Your email"
                />
              </label>
            </div>

            <Link className="settings-profile-link" to="/profile">
              Open full profile
              <ChevronRight size={15} />
            </Link>
          </section>

          {/* APPEARANCE */}

          <section id="appearance" className="settings-card">
            <div className="settings-card-heading">
              <div>
                <h2>Appearance</h2>
                <p>Choose how LifeOS feels and looks for you.</p>
              </div>
            </div>

            <div className="settings-option-row">
              <div>
                <strong>Theme</strong>
                <small>Choose your preferred interface.</small>
              </div>

              <div className="settings-choice">
                <button
                  type="button"
                  className={!set.dark ? "selected" : ""}
                  onClick={() => selectAppearance("dark", false)}
                >
                  Light
                </button>

                <button
                  type="button"
                  className={set.dark ? "selected" : ""}
                  onClick={() => selectAppearance("dark", true)}
                >
                  Dim
                </button>
              </div>
            </div>

            <div className="settings-option-row">
              <div>
                <strong>Dashboard density</strong>
                <small>Control the amount of space between elements.</small>
              </div>

              <div className="settings-choice">
                <button
                  type="button"
                  className={!set.compact ? "selected" : ""}
                  onClick={() => selectAppearance("compact", false)}
                >
                  Comfortable
                </button>

                <button
                  type="button"
                  className={set.compact ? "selected" : ""}
                  onClick={() => selectAppearance("compact", true)}
                >
                  Compact
                </button>
              </div>
            </div>
          </section>

          {/* NOTIFICATIONS */}

          <section id="notifications" className="settings-card">
            <div className="settings-card-heading">
              <div>
                <h2>Notifications</h2>
                <p>Choose which reminders LifeOS can send you.</p>
              </div>
            </div>

            {[
              ["task", "Task reminders", "Stay on top of your daily tasks."],
              ["study", "Study reminders", "Keep your study sessions consistent."],
              ["health", "Health check-ins", "Get reminders for your health routine."],
              ["habits", "Habit nudges", "Small reminders to maintain your habits."],
              ["insights", "AI insights", "Receive personalized LifeOS insights."],
              ["email", "Email updates", "Receive your weekly progress summary."],
            ].map(([key, title, description]) => (
              <div className="settings-toggle-row" key={key}>
                <div>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>

                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`settings-switch ${set[key] ? "on" : ""}`}
                  aria-label={`Toggle ${title}`}
                >
                  <i />
                </button>
              </div>
            ))}
          </section>

          {/* AI */}

          <section id="ai" className="settings-card">
            <div className="settings-card-heading">
              <div>
                <h2>AI personalization</h2>
                <p>
                  Let LifeOS understand the areas you want help with.
                </p>
              </div>

              <Brain size={21} />
            </div>

            <div className="settings-focus-tags">
              {["Study", "Health", "Habits", "Goals", "Productivity"].map(
                (item) => (
                  <button type="button" key={item}>
                    {item}
                  </button>
                ),
              )}
            </div>
          </section>

          {/* PRIVACY */}

          <section id="privacy" className="settings-card">
            <div className="settings-card-heading">
              <div>
                <h2>Privacy & data</h2>
                <p>
                  Your LifeOS frontend data is stored locally in this browser.
                </p>
              </div>

              <ShieldCheck size={21} />
            </div>

            <div className="privacy-box">
              <div>
                <strong>Reset onboarding focus</strong>
                <small>
                  Remove your saved focus preferences from this browser.
                </small>
              </div>

              <button
                type="button"
                className="danger"
                onClick={() => {
                  localStorage.removeItem("lifeos-focus");
                  setNotice("Focus preferences reset.");
                }}
              >
                Reset
              </button>
            </div>
          </section>

          {/* SAVE */}

          <div className="settings-bottom">
            <button type="submit" className="settings-save">
              Save changes
            </button>

            {notice && (
              <p className="settings-notice">
                {notice}
              </p>
            )}
          </div>
        </main>
      </form>
    </motion.div>
  );
}