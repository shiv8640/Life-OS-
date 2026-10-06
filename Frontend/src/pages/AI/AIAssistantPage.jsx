import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Brain,
  Coffee,
  Send,
  Sparkles,
  Heart,
  Target,
  BookOpen,
  Trash2,
} from "lucide-react";
import { lifeService } from "../../services/lifeService";

const quick = [
  "Plan my day",
  "Explain my progress",
  "Create a study plan",
  "Suggest habits",
  "Give me motivation",
];

const CHAT_KEY = "lifeos-ai-chat";

const initialMessage = {
  bot: true,
  text: "Hi! I’m your LifeOS companion. 👋 Ask me about study, health, habits, goals, productivity or your day.",
};

function getData() {
  return {
    tasks: lifeService.tasks(),
    habits: lifeService.habits(),
    health: lifeService.health(),
    study: lifeService.study(),
    goals: lifeService.read("lifeos-goals", []),
  };
}

function reply(q) {
  const l = q.toLowerCase();
  const data = getData();

  const pendingTasks = data.tasks.filter((x) => !x.done);
  const completedTasks = data.tasks.filter((x) => x.done);

  const completedHabits = data.habits.filter((x) => x.done);

  const averageGoal = data.goals.length
    ? Math.round(
        data.goals.reduce(
          (sum, goal) => sum + (goal.value || 0),
          0,
        ) / data.goals.length,
      )
    : 0;

  /* HELLO */

  if (
    l.trim() === "hello" ||
    l.trim() === "hi" ||
    l.trim() === "hey" ||
    l.includes("hello lifeos")
  ) {
    return "Hello! 👋 How can I help you today?";
  }

  /* STUDY */

  if (
    l.includes("study") ||
    l.includes("dsa") ||
    l.includes("dbms") ||
    l.includes("exam") ||
    l.includes("revision") ||
    l.includes("subject")
  ) {
    const studyHours = data.study?.hours || 0;
    const focus = data.study?.focus || 0;

    return `📚 Study Mentor:

You currently have about ${studyHours} study hours recorded with ${focus}% focus.

For your next session:
• Pick ONE topic.
• Study for 25–45 minutes.
• Keep your phone away.
• Spend the last 5 minutes recalling what you learned.
• Then take a short break.

If you're preparing for an exam, tell me the subject and exam date and I can help you break it into smaller study sessions.`;
  }

  /* STUDY PLAN */

  if (
    l.includes("study plan") ||
    l.includes("how should i study") ||
    l.includes("study schedule")
  ) {
    return `📖 Here's a simple study structure:

1. 25 min — Learn one concept
2. 5 min — Break
3. 25 min — Practice questions
4. 5 min — Break
5. 20 min — Revise without looking at notes

Start with the subject that needs the most attention. Don't try to finish everything in one session.`;
  }

  /* HEALTH */

  if (
    l.includes("health") ||
    l.includes("sleep") ||
    l.includes("water") ||
    l.includes("workout") ||
    l.includes("exercise") ||
    l.includes("food") ||
    l.includes("diet") ||
    l.includes("medicine") ||
    l.includes("mood") ||
    l.includes("energy")
  ) {
    const sleep = data.health?.sleep ?? "not recorded";
    const water = data.health?.water ?? "not recorded";
    const energy = data.health?.energy ?? "not recorded";
    const mood = data.health?.mood ?? "not recorded";

    return `💚 Wellness Assistant:

Your current LifeOS health data:
• Sleep: ${sleep} hours
• Water: ${water}
• Energy: ${energy}%
• Mood: ${mood}

A good basic routine is:
• Keep a consistent sleep schedule.
• Stay hydrated through the day.
• Include some daily movement.
• Eat regular balanced meals.
• Take short breaks if you've been sitting or studying for long periods.

I can help you build healthy routines, but I can't diagnose medical conditions. If you have severe, persistent, or concerning symptoms, contact a qualified healthcare professional.`;
  }

  /* HABITS */

  if (
    l.includes("habit") ||
    l.includes("routine") ||
    l.includes("discipline") ||
    l.includes("consistency")
  ) {
    const habitCount = data.habits.length;
    const doneCount = completedHabits.length;

    return `🔄 Habit Coach:

You currently have ${habitCount} tracked habit${
      habitCount === 1 ? "" : "s"
    }, with ${doneCount} marked complete.

Don't try to change everything at once.

Use this formula:
Cue → Small action → Repeat → Track

For example:
"After breakfast → drink one glass of water."

Make the first version so easy that you can complete it even on a bad day. Consistency matters more than perfection.`;
  }

  /* GOALS */

  if (
    l.includes("goal") ||
    l.includes("goals") ||
    l.includes("target") ||
    l.includes("milestone") ||
    l.includes("career")
  ) {
    return `🎯 Goal Coach:

Your average goal progress is ${averageGoal}%.

A professional way to move a goal forward is:

1. Define the exact outcome.
2. Break it into milestones.
3. Convert the next milestone into a weekly target.
4. Convert that into today's smallest useful action.
5. Review progress regularly.

Don't measure only how much is left. Measure what you completed and what the next action should be.`;
  }

  /* PROGRESS */

  if (
    l.includes("progress") ||
    l.includes("performance") ||
    l.includes("how am i doing") ||
    l.includes("doing well")
  ) {
    return `📊 Your LifeOS snapshot:

• Pending tasks: ${pendingTasks.length}
• Completed tasks: ${completedTasks.length}
• Habits completed: ${completedHabits.length}/${data.habits.length || 0}
• Average goal progress: ${averageGoal}%
• Study focus: ${data.study?.focus || 0}%

Your biggest advantage is consistency. Don't try to fix everything today. Pick the area that needs the most attention and improve that one first.`;
  }

  /* DAILY PLAN */

  if (
    l.includes("plan my day") ||
    l.includes("plan my day") ||
    l.includes("organize my day") ||
    l.includes("schedule my day") ||
    l.includes("what should i do")
  ) {
    const taskNames = pendingTasks
      .slice(0, 5)
      .map((x) => x.title)
      .filter(Boolean);

    if (!taskNames.length) {
      return `🗓️ Your day looks clear in LifeOS.

Use this opportunity for:
• One important study/work session
• One health activity
• One personal activity
• Some proper rest

Avoid filling every free minute. A realistic plan should have buffer time.`;
    }

    return `🗓️ Let's structure your day around your pending tasks:

${taskNames.map((x, i) => `${i + 1}. ${x}`).join("\n")}

Start with the most important task, then move to shorter/easier tasks. Keep breaks between focused sessions and don't schedule every minute of the day.`;
  }

  /* MOTIVATION */

  if (
    l.includes("motivate") ||
    l.includes("motivation") ||
    l.includes("lazy") ||
    l.includes("can't focus") ||
    l.includes("cant focus")
  ) {
    return `You don't need to feel motivated before starting.

Make the task smaller:
"Study DSA" → "Solve one DSA question."

"Work on project" → "Open the project and fix one thing."

Start for just 5 minutes. Action often creates motivation, not the other way around. 🌱`;
  }

  /* PRODUCTIVITY */

  if (
    l.includes("productive") ||
    l.includes("productivity") ||
    l.includes("focus") ||
    l.includes("procrastination") ||
    l.includes("procrastinate")
  ) {
    return `⚡ Productivity Coach:

Try this right now:

1. Choose one important task.
2. Remove one distraction.
3. Set a 25-minute focus block.
4. Work only on that task.
5. Take a short break.
6. Decide the next block after the break.

Don't optimize your entire day before completing your first important task.`;
  }

  /* TASKS */

  if (
    l.includes("task") ||
    l.includes("todo") ||
    l.includes("to-do")
  ) {
    return `✅ You currently have ${pendingTasks.length} pending task${
      pendingTasks.length === 1 ? "" : "s"
    } and ${completedTasks.length} completed.

Your first priority should usually be the task that is both important and time-sensitive.

If you want, tell me your available time and I'll help you arrange the tasks into a realistic sequence.`;
  }

  /* GENERAL */

  return `I'm your LifeOS AI companion. 🤖

I can help you with:

📚 Study & exam planning
💚 Health & wellness routines
🔄 Habits & consistency
🎯 Goals & milestones
🗓️ Daily planning
⚡ Productivity & focus
📊 Understanding your LifeOS progress

Tell me what you're working on, and we'll take it one step at a time.`;
}

export default function AIAssistantPage() {
  const [m, setM] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      }
    } catch {
      // Ignore invalid saved chat.
    }

    return [initialMessage];
  });

  const [v, setV] = useState("");
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(m));
  }, [m]);

  const send = (text) => {
    const q = (text || v).trim();

    if (!q || thinking) return;

    setM((x) => [...x, { bot: false, text: q }]);
    setV("");
    setThinking(true);

    setTimeout(() => {
      const a = reply(q);

      setM((x) => [
        ...x,
        {
          bot: true,
          text: a,
        },
      ]);

      lifeService.addActivity({
        type: "ai",
        text: "LifeOS AI helped with: " + q,
      });

      setThinking(false);
    }, 550);
  };

  const clearChat = () => {
    const fresh = [initialMessage];

    setM(fresh);
    localStorage.setItem(CHAT_KEY, JSON.stringify(fresh));

    lifeService.addActivity({
      type: "ai",
      text: "AI chat history cleared",
    });
  };

  return (
    <motion.div
      className="assistant-v2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* INTRO */}

      <section className="assistant-intro">
        <p className="mode-chip">
          <Sparkles size={12} /> AI ASSISTANT
        </p>

        <h1>
          Your Personal
          <br />
          <em>AI Life Companion.</em>
        </h1>

        <p>
          Ask about study, health, habits, goals or your day. Get
          simple, useful next steps based on your LifeOS data.
        </p>

        <div className="ai-robot">
          <div className="ai-antenna" />

          <div className="ai-face">
            <i />
            <i />
            <b>⌣</b>
          </div>

          <div className="ai-body">✦</div>
        </div>

        <div className="robot-note">
          <b>Hi there! 👋</b>

          <span>
            I’m here to help you plan, reflect and grow.
          </span>
        </div>
      </section>

      {/* CHAT */}

      <section className="assistant-chat-v2">
        <div className="tool-row">
          {quick.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => send(x)}
              disabled={thinking}
            >
              {x}
            </button>
          ))}
        </div>

        <div className="conversation">
          {m.map((x, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                x.bot ? "bot-message" : "user-message"
              }
            >
              {x.bot && (
                <span className="mini-bot">⌣</span>
              )}

              <p style={{ whiteSpace: "pre-line" }}>
                {x.text}
              </p>
            </motion.div>
          ))}

          <AnimatePresence>
            {thinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bot-message typing"
              >
                <span className="mini-bot">⌣</span>

                <p>
                  LifeOS is thinking
                  <span className="dots">...</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="Ask me anything about your day…"
            disabled={thinking}
          />

          <button
            type="submit"
            aria-label="Send"
            disabled={thinking || !v.trim()}
          >
            <Send size={19} />
          </button>
        </form>

        <button
          type="button"
          onClick={clearChat}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "8px",
          }}
        >
          <Trash2 size={14} />
          Clear chat
        </button>
      </section>

      {/* CHAT TOOLS */}

      <aside className="assistant-tools">
        <h2>✦ Chat tools</h2>

        {quick.map((x, i) => (
          <button
            key={x}
            type="button"
            onClick={() => send(x)}
            disabled={thinking}
          >
            <span>
              {[
                <Coffee key="coffee" />,
                <Brain key="brain" />,
                <BookOpen key="book" />,
                <Sparkles key="sparkles" />,
                <Heart key="heart" />,
              ][i]}
            </span>

            <div>
              <b>{x}</b>

              <small>
                {i === 0
                  ? "Build a realistic plan"
                  : i === 1
                    ? "Understand your LifeOS data"
                    : i === 2
                      ? "Learn with a focused strategy"
                      : i === 3
                        ? "Build sustainable habits"
                        : "Get a thoughtful answer"}
              </small>
            </div>

            ›
          </button>
        ))}
      </aside>

      {/* EXTRA CONTEXT CARDS */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        <button
          type="button"
          onClick={() =>
            send("Explain my progress")
          }
        >
          <Target size={17} />
          <span>My Progress</span>
        </button>

        <button
          type="button"
          onClick={() =>
            send("Create a study plan")
          }
        >
          <BookOpen size={17} />
          <span>Study Mentor</span>
        </button>

        <button
          type="button"
          onClick={() =>
            send("Suggest habits")
          }
        >
          <Sparkles size={17} />
          <span>Habit Coach</span>
        </button>

        <button
          type="button"
          onClick={() =>
            send("Tell me about my health")
          }
        >
          <Heart size={17} />
          <span>Wellness</span>
        </button>
      </section>
    </motion.div>
  );
}