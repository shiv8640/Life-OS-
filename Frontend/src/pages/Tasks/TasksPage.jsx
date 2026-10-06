import { useEffect, useState } from 'react';

import {
  Check,
  Clock3,
  Plus,
  Trash2,
  Star,
  Bot,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

import { lifeService } from '../../services/lifeService';

const getToday = () => {
  const d = new Date();

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatTime = (time) => {
  if (!time) return '';

  const [hour, minute] = time.split(':').map(Number);

  const d = new Date();
  d.setHours(hour, minute, 0, 0);

  return d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (date) => {
  if (!date) return '';

  return new Date(date + 'T00:00:00').toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  );
};

const normalizeTasks = (tasks) => {
  return tasks.map((task) => ({
    ...task,
    date: task.date || getToday(),
    time:
      task.time && task.time !== 'Anytime'
        ? task.time
        : '09:00',
    important: task.important || false,
  }));
};

const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;

  return `${String(h).padStart(2, '0')}:${String(m).padStart(
    2,
    '0'
  )}`;
};

const parseTime = (value) => {
  const match = value
    .toLowerCase()
    .match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const period = match[3];

  if (period === 'pm' && hour < 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;

  if (hour > 23 || minute > 59) return null;

  return hour * 60 + minute;
};

const parseDuration = (text) => {
  const hourMatch = text.match(
    /(\d+(?:\.\d+)?)\s*(hour|hours|hr|hrs|h)/i
  );

  const minuteMatch = text.match(
    /(\d+)\s*(minute|minutes|min|mins|m)/i
  );

  if (hourMatch) {
    return Math.round(Number(hourMatch[1]) * 60);
  }

  if (minuteMatch) {
    return Number(minuteMatch[1]);
  }

  return null;
};

const cleanTaskTitle = (text) => {
  return text
    .replace(
      /(?:for|around|about)?\s*\d+(?:\.\d+)?\s*(?:hours?|hrs?|h|minutes?|mins?|m)\b/gi,
      ''
    )
    .replace(
      /\s+(?:from|at)\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*(?:to|-)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi,
      ''
    )
    .replace(/^[-•*]\s*/, '')
    .replace(/[.!]+$/, '')
    .trim();
};

export default function TasksPage() {
  const [t, setT] = useState(() =>
    normalizeTasks(lifeService.tasks())
  );

const [draft, setDraft] = useState('');
const [draftDate, setDraftDate] = useState(getToday());

const [draftHour, setDraftHour] = useState('09');
const [draftMinute, setDraftMinute] = useState('00');
const [draftPeriod, setDraftPeriod] = useState('AM');

  const [tab, setTab] = useState('All Tasks');
  const [message, setMessage] = useState('');

  const [dayPlanInput, setDayPlanInput] = useState('');
  const [plan, setPlan] = useState([]);
  const [planCreated, setPlanCreated] = useState(false);

  const persist = (value) => {
    setT(value);
    lifeService.setTasks(value);
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  // -----------------------------
  // MANUAL TASK
  // -----------------------------

const add = () => {
  const title = draft.trim() || 'New priority task';

  let hour = Number(draftHour);

  if (draftPeriod === 'AM' && hour === 12) hour = 0;
  if (draftPeriod === 'PM' && hour !== 12) hour += 12;

  const taskTime = `${String(hour).padStart(2, '0')}:${draftMinute}`;

  const next = [
    ...t,
    {
      id: Date.now(),
      title,
      date: draftDate || getToday(),
      time: taskTime,
      done: false,
      important: false,
    },
  ];

  persist(next);

  lifeService.addActivity({
    type: 'task',
    text: 'Created ' + title,
  });

  setDraft('');
  setDraftDate(getToday());
  setDraftHour('09');
  setDraftMinute('00');
  setDraftPeriod('AM');

  showMessage('Task added successfully.');
};


   
  // -----------------------------
  // COMPLETE
  // -----------------------------

  const toggleComplete = (task) => {
    const next = t.map((item) =>
      item.id === task.id
        ? {
            ...item,
            done: !item.done,
          }
        : item
    );

    persist(next);

    lifeService.addActivity({
      type: 'task',
      text:
        (task.done ? 'Reopened ' : 'Completed ') + task.title,
    });
  };

  // -----------------------------
  // IMPORTANT
  // -----------------------------

  const toggleImportant = (task) => {
    const next = t.map((item) =>
      item.id === task.id
        ? {
            ...item,
            important: !item.important,
          }
        : item
    );

    persist(next);

    lifeService.addActivity({
      type: 'task',
      text:
        (task.important
          ? 'Removed important from '
          : 'Marked important: ') + task.title,
    });
  };

  // -----------------------------
  // DELETE
  // -----------------------------

  const remove = (task) => {
    const next = t.filter(
      (item) => item.id !== task.id
    );

    persist(next);

    lifeService.addActivity({
      type: 'task',
      text: 'Removed ' + task.title,
    });
  };

  // =====================================================
  // SMART AI DAY PLANNER
  // =====================================================

  const createDayPlan = () => {
    const input = dayPlanInput.trim();

    if (!input) {
      showMessage(
        'Pehle apni needs, college timing aur important kaam batao.'
      );
      return;
    }

    /*
      User can write naturally:

      "Kal college 9 AM se 3 PM hai.
       Mujhe DSA 2 hours karna hai.
       DBMS assignment 1.5 hours.
       Project 2 hours.
       Workout 1 hour.
       Lunch 1 PM se 2 PM.
       Mujhe raat 10:30 tak free hona hai."

      User DOES NOT need to provide task timings.
      LifeOS decides the timings.
    */

    // ---------------------------------------------
    // AVAILABLE WINDOW
    // ---------------------------------------------

    let startTime = 7 * 60;
    let endTime = 22 * 60;

    const availableMatch = input.match(
      /(?:free|available|awake|start(?:ing)?\s*(?:my\s*)?day).*?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:to|-)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i
    );

    if (availableMatch) {
      const parsedStart = parseTime(availableMatch[1]);
      const parsedEnd = parseTime(availableMatch[2]);

      if (parsedStart !== null) startTime = parsedStart;
      if (parsedEnd !== null) endTime = parsedEnd;

      if (endTime <= startTime) {
        endTime += 12 * 60;
      }
    }

    // ---------------------------------------------
    // FIND ALL FIXED TIME BLOCKS
    // ---------------------------------------------

    const fixedBlocks = [];

    const fixedRegex =
      /([a-zA-Z][a-zA-Z0-9 &-]{1,50}?)\s+(?:from|at)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:to|-)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/gi;

    let fixedMatch;

    while ((fixedMatch = fixedRegex.exec(input)) !== null) {
      const title = cleanTaskTitle(fixedMatch[1]);

      const blockStart = parseTime(fixedMatch[2]);
      let blockEnd = parseTime(fixedMatch[3]);

      if (
        blockStart !== null &&
        blockEnd !== null &&
        blockEnd <= blockStart
      ) {
        blockEnd += 12 * 60;
      }

      if (
        title &&
        blockStart !== null &&
        blockEnd !== null &&
        blockEnd > blockStart
      ) {
        fixedBlocks.push({
          title:
            title.charAt(0).toUpperCase() +
            title.slice(1),
          start: blockStart,
          end: blockEnd,
        });
      }
    }

    // ---------------------------------------------
    // REMOVE DUPLICATE FIXED BLOCKS
    // ---------------------------------------------

    const uniqueFixedBlocks = fixedBlocks.filter(
      (block, index, arr) =>
        index ===
        arr.findIndex(
          (x) =>
            x.title.toLowerCase() ===
              block.title.toLowerCase() &&
            x.start === block.start &&
            x.end === block.end
        )
    );

    // ---------------------------------------------
    // EXTRACT TASKS + DURATIONS
    // ---------------------------------------------

    const sentences = input
      .split(/[\n.!?]+/)
      .map((x) => x.trim())
      .filter(Boolean);

    const taskData = [];

    sentences.forEach((sentence) => {
      const lower = sentence.toLowerCase();

      // Ignore availability sentence
      if (
        lower.includes('free from') ||
        lower.includes('available from') ||
        lower.includes('awake from')
      ) {
        return;
      }

      // Ignore fixed-time sentences
      if (
        /\bfrom\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*(?:to|-)\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i.test(
          sentence
        )
      ) {
        return;
      }

      const duration = parseDuration(sentence);

      if (!duration) return;

      const title = cleanTaskTitle(sentence);

      if (!title) return;

      taskData.push({
        title,
        duration,
      });
    });

    // ---------------------------------------------
    // ALSO HANDLE COMMA / SEMICOLON INPUT
    // ---------------------------------------------

    if (!taskData.length) {
      const chunks = input
        .split(/[,;]+/)
        .map((x) => x.trim())
        .filter(Boolean);

      chunks.forEach((chunk) => {
        const lower = chunk.toLowerCase();

        if (
          lower.includes('free from') ||
          lower.includes('available from')
        ) {
          return;
        }

        const duration = parseDuration(chunk);

        if (!duration) return;

        const title = cleanTaskTitle(chunk);

        if (!title) return;

        taskData.push({
          title,
          duration,
        });
      });
    }

    // ---------------------------------------------
    // REMOVE DUPLICATE TASKS
    // ---------------------------------------------

    const uniqueTasks = taskData.filter(
      (task, index, arr) =>
        index ===
        arr.findIndex(
          (x) =>
            x.title.toLowerCase() ===
            task.title.toLowerCase()
        )
    );

    if (!uniqueTasks.length) {
      showMessage(
        'Tasks aur unka approximate duration batao. Example: DSA 2 hours, Project 1 hour.'
      );
      return;
    }

    // ---------------------------------------------
    // SMART PRIORITY
    // ---------------------------------------------

    const priorityScore = (title) => {
      const text = title.toLowerCase();

      if (
        text.includes('exam') ||
        text.includes('assignment') ||
        text.includes('deadline')
      ) {
        return 1;
      }

      if (
        text.includes('study') ||
        text.includes('dsa') ||
        text.includes('dbms') ||
        text.includes('coding')
      ) {
        return 2;
      }

      if (
        text.includes('project') ||
        text.includes('work')
      ) {
        return 3;
      }

      if (
        text.includes('workout') ||
        text.includes('gym') ||
        text.includes('exercise')
      ) {
        return 4;
      }

      return 5;
    };

    const sortedTasks = [...uniqueTasks].sort(
      (a, b) =>
        priorityScore(a.title) -
        priorityScore(b.title)
    );

    // ---------------------------------------------
    // SORT FIXED COMMITMENTS
    // ---------------------------------------------

    const fixed = [...uniqueFixedBlocks].sort(
      (a, b) => a.start - b.start
    );

    // ---------------------------------------------
    // BUILD SMART SCHEDULE
    // ---------------------------------------------

    let current = startTime;

    const generated = [];

    const addBuffer = () => {
      current += 10;
    };

    const findNextFixedBlock = () => {
      return fixed.find(
        (block) =>
          block.start >= current &&
          block.start < endTime
      );
    };

    const addFixedBlocksPassed = () => {
      const passed = fixed.find(
        (block) =>
          current >= block.start &&
          current < block.end
      );

      if (!passed) return false;

      generated.push({
        id: Date.now() + generated.length,
        title: passed.title,
        date: getToday(),
        time: minutesToTime(passed.start),
        done: false,
        important: false,
        fixed: true,
      });

      current = passed.end;

      addBuffer();

      return true;
    };

    for (const task of sortedTasks) {
      let placed = false;

      while (!placed && current < endTime) {
        if (addFixedBlocksPassed()) {
          continue;
        }

        const nextFixed = findNextFixedBlock();

        if (nextFixed) {
          const availableBeforeFixed =
            nextFixed.start - current;

          if (
            task.duration <=
            availableBeforeFixed
          ) {
            generated.push({
              id: Date.now() + generated.length,
              title: task.title,
              date: getToday(),
              time: minutesToTime(current),
              done: false,
              important:
                priorityScore(task.title) <= 2,
            });

            current += task.duration;

            addBuffer();

            placed = true;
          } else {
            current = nextFixed.start;
          }
        } else {
          if (
            current + task.duration <=
            endTime
          ) {
            generated.push({
              id: Date.now() + generated.length,
              title: task.title,
              date: getToday(),
              time: minutesToTime(current),
              done: false,
              important:
                priorityScore(task.title) <= 2,
            });

            current += task.duration;

            addBuffer();

            placed = true;
          } else {
            break;
          }
        }
      }
    }

    // ---------------------------------------------
    // ADD REMAINING FIXED BLOCKS
    // ---------------------------------------------

    fixed.forEach((block) => {
      const alreadyAdded = generated.some(
        (item) =>
          item.fixed &&
          item.time ===
            minutesToTime(block.start) &&
          item.title.toLowerCase() ===
            block.title.toLowerCase()
      );

      if (!alreadyAdded) {
        generated.push({
          id: Date.now() + generated.length,
          title: block.title,
          date: getToday(),
          time: minutesToTime(block.start),
          done: false,
          important: false,
          fixed: true,
        });
      }
    });

    // ---------------------------------------------
    // SORT FINAL PLAN BY TIME
    // ---------------------------------------------

    generated.sort(
      (a, b) =>
        timeToMinutes(a.time) -
        timeToMinutes(b.time)
    );

    // ---------------------------------------------
    // CHECK MISSED TASKS
    // ---------------------------------------------

    const scheduledTitles = generated
      .filter((x) => !x.fixed)
      .map((x) => x.title.toLowerCase());

    const missedTasks = sortedTasks.filter(
      (task) =>
        !scheduledTitles.includes(
          task.title.toLowerCase()
        )
    );

    if (!generated.length) {
      showMessage(
        'Tumhare available time me plan fit nahi ho raha. Thoda aur free time batao.'
      );
      return;
    }

    setPlan(generated);
    setPlanCreated(false);

    if (missedTasks.length) {
      showMessage(
        `${missedTasks.length} task fit nahi hua. LifeOS ne priority ke according pehle important tasks schedule kiye.`
      );
    } else {
      showMessage(
        '✨ LifeOS ne tumhari needs ke according smart plan bana diya.'
      );
    }
  };

  // =====================================================
  // APPROVE AI PLAN
  // =====================================================

  const approvePlan = () => {
    if (!plan.length) return;

    const next = [
      ...t,
      ...plan.map((task) => ({
        ...task,
        aiGenerated: true,
      })),
    ];

    persist(next);

    plan.forEach((task) => {
      lifeService.addActivity({
        type: 'task',
        text: 'AI planned: ' + task.title,
      });
    });

    setPlanCreated(true);

    showMessage(
      '✓ Smart plan approved. Tasks timings ke saath save ho gaye.'
    );
  };

  // =====================================================
  // REGENERATE
  // =====================================================

  const regeneratePlan = () => {
    setPlan([]);
    setPlanCreated(false);

    setTimeout(() => {
      createDayPlan();
    }, 50);
  };

  const today = getToday();
  const [calendarEvents, setCalendarEvents] = useState(() =>
  lifeService.read("lifeos-events", [])
);
useEffect(() => {
  const refreshCalendarEvents = () => {
    setCalendarEvents(
      lifeService.read("lifeos-events", [])
    );
  };

  window.addEventListener(
    "lifeos-data-change",
    refreshCalendarEvents
  );

  return () => {
    window.removeEventListener(
      "lifeos-data-change",
      refreshCalendarEvents
    );
  };
}, []);

  // =====================================================
  // FILTERS
  // =====================================================

const items =
  tab === 'Completed'
    ? t.filter((x) => x.done)

    : tab === 'Today'
      ? t.filter(
          (x) =>
            !x.done &&
            x.date === today
        )

      : tab === 'Upcoming'
        ? [
            ...t.filter(
              (x) =>
                !x.done &&
                x.date > today
            ),

            ...calendarEvents
              .filter((event) => {
                return event.date >= today;
              })
              .map((event) => ({
                id: `calendar-${event.id}`,
                title: event.title,
                date: event.date,
                time: event.time || '09:00',
                done: false,
                important: false,
                isCalendarEvent: true,
              })),
          ].sort(
            (a, b) =>
              new Date(
                `${a.date}T${a.time || '00:00'}`
              ) -
              new Date(
                `${b.date}T${b.time || '00:00'}`
              )
          )

        : tab === 'Important'
          ? t.filter(
              (x) =>
                x.important &&
                !x.done
            )

          : t;
  return (
    <div className="tasks-workspace">
      <header>
        <div>
          <p className="mode-chip">
            ✓ TASKS
          </p>

          <h1>Tasks</h1>

          <p>
            Plan better. Do more. Build the life you want.
          </p>
        </div>

        <button
          className="add-task"
          onClick={add}
        >
          <Plus />
          Add Task
        </button>
      </header>

      {message && (
        <p className="task-feedback">
          {message}
        </p>
      )}

      {/* KPI CARDS */}

      <section className="task-kpis">
        {[
          [
            '☷',
            t.length,
            'Total Tasks',
          ],
          [
            '✓',
            t.filter((x) => x.done).length,
            'Completed',
          ],
          [
            '◷',
            t.filter((x) => !x.done).length,
            'Pending',
          ],
          [
            '▥',
            Math.round(
              (t.filter((x) => x.done).length /
                Math.max(1, t.length)) *
                100
            ) + '%',
            'Productivity',
          ],
        ].map((x) => (
          <div key={x[2]}>
            <span>{x[0]}</span>
            <b>{x[1]}</b>
            <small>{x[2]}</small>
          </div>
        ))}
      </section>

      {/* TABS */}

      <nav>
        {[
          'All Tasks',
          'Today',
          'Upcoming',
          'Important',
          'Completed',
        ].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={
              tab === x ? 'active' : ''
            }
          >
            {x}
          </button>
        ))}
      </nav>

      <div className="tasks-grid">
        {/* TASK BOARD */}

        <section className="tasks-board">
          <h2>{tab}</h2>

          {items.map((x) => (
            <article
              key={x.id}
              className={
                x.done ? 'done' : ''
              }
            >
              <button
                onClick={() =>
                  toggleComplete(x)
                }
              >
                {x.done && (
                  <Check size={16} />
                )}
              </button>

              <b>{x.title}</b>

              <button
                type="button"
                onClick={() =>
                  toggleImportant(x)
                }
                title={
                  x.important
                    ? 'Remove important'
                    : 'Mark important'
                }
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <Star
                  size={16}
                  fill={
                    x.important
                      ? 'currentColor'
                      : 'none'
                  }
                />
              </button>

              <span>
                {formatDate(x.date)}
              </span>

              <small>
                <Clock3 size={13} />
                {formatTime(x.time)}
              </small>

              <button
                className="delete"
                onClick={() =>
                  remove(x)
                }
              >
                <Trash2 size={15} />
              </button>
            </article>
          ))}

          {!items.length && (
            <p className="empty-state">
              {tab === 'Today'
                ? 'No tasks scheduled for today.'
                : tab === 'Upcoming'
                  ? 'No upcoming tasks scheduled.'
                  : tab === 'Important'
                    ? 'No important tasks yet.'
                    : tab === 'Completed'
                      ? 'No completed tasks yet.'
                      : 'Nothing here yet — add a clear next step.'}
            </p>
          )}

          {/* MANUAL ADD */}

          {(tab === 'All Tasks' ||
            tab === 'Today') && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                add();
              }}
            >
              <input
                value={draft}
                onChange={(e) =>
                  setDraft(e.target.value)
                }
                placeholder="Add a task for today"
              />

              <input
                type="date"
                value={draftDate}
                onChange={(e) =>
                  setDraftDate(
                    e.target.value
                  )
                }
              />

              <select
  value={draftHour}
  onChange={(e) => setDraftHour(e.target.value)}
>
  {Array.from({ length: 12 }, (_, i) => {
    const hour = String(i + 1).padStart(2, '0');

    return (
      <option key={hour} value={hour}>
        {hour}
      </option>
    );
  })}
</select>

<select
  value={draftMinute}
  onChange={(e) => setDraftMinute(e.target.value)}
>
  {['00', '15', '30', '45'].map((minute) => (
    <option key={minute} value={minute}>
      {minute}
    </option>
  ))}
</select>

<select
  value={draftPeriod}
  onChange={(e) => setDraftPeriod(e.target.value)}
>
  <option value="AM">AM</option>
  <option value="PM">PM</option>
</select>

              <button type="submit">
                Add
              </button>
            </form>
          )}
        </section>

        {/* AI ASSISTANT */}

        <aside className="task-ai">
          <h2>
            <Bot />
            AI Task Assistant
            <em>Beta</em>
          </h2>

          <p>
            Apni poori day situation batao. LifeOS
            khud tasks, priorities, fixed commitments,
            breaks aur available time ko manage karke
            realistic schedule banayega.
          </p>

          <textarea
            value={dayPlanInput}
            onChange={(e) =>
              setDayPlanInput(
                e.target.value
              )
            }
            placeholder={`Example:

Kal mera college 9 AM se 3 PM hai.

Mujhe DSA 2 hours padhna hai.
DBMS assignment 1.5 hours karna hai.
LifeOS project 2 hours karna hai.
Workout 1 hour karna hai.

Lunch 1 PM se 2 PM.
Shaam ko thoda rest bhi chahiye.
Raat 10:30 PM tak mera day finish karna hai.`}
            rows={8}
          />

          <button
            type="button"
            onClick={createDayPlan}
          >
            <Sparkles size={15} />
            Create My Smart Plan
          </button>

          {plan.length > 0 && (
            <div className="ai-plan">
              <b>
                ✨ Your Smart Plan
              </b>

              {plan.map((item) => (
                <small key={item.id}>
                  • {formatTime(item.time)} —{' '}
                  {item.title}
                  {item.fixed
                    ? ' (fixed)'
                    : ''}
                </small>
              ))}

              {!planCreated ? (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '10px',
                  }}
                >
                  <button
                    type="button"
                    onClick={approvePlan}
                  >
                    ✓ Approve Plan
                  </button>

                  <button
                    type="button"
                    onClick={regeneratePlan}
                  >
                    <RotateCcw size={14} />
                    Regenerate
                  </button>
                </div>
              ) : (
                <small>
                  ✓ Plan approved and added
                  to your tasks.
                </small>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
