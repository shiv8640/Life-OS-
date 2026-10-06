const read = (key, fallback) =>
  JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("lifeos-data-change"));
};

const defaultTasks = [
  { id: 1, title: "Morning workout", time: "08:00", done: false },
  { id: 2, title: "DSA practice", time: "10:00", done: false },
  { id: 3, title: "Read a book", time: "17:00", done: false },
];

const defaultHabits = [
  { name: "Drink water", done: true, streak: 8 },
  { name: "Exercise", done: true, streak: 12 },
  { name: "Read a book", done: false, streak: 0 },
];

const defaultActivity = [
  {
    id: 1,
    type: "study",
    text: "Study plan is ready for today.",
    time: "Just now",
  },
  {
    id: 2,
    type: "habit",
    text: "You completed Drink water.",
    time: "Earlier today",
  },
];

const defaultNotifications = [];

const notifications = () =>
  read("lifeos-notifications", defaultNotifications);

const addNotification = (notification) => {
  const current = notifications();

  const exists = current.some(
    (x) => x.key && x.key === notification.key,
  );

  if (exists) return;

  save(
    "lifeos-notifications",
    [
      {
        id: Date.now(),
        read: false,
        createdAt: Date.now(),
        ...notification,
      },
      ...current,
    ].slice(0, 50),
  );
};

const markNotificationRead = (id) => {
  save(
    "lifeos-notifications",
    notifications().map((x) =>
      x.id === id ? { ...x, read: true } : x,
    ),
  );
};

const markAllNotificationsRead = () => {
  save(
    "lifeos-notifications",
    notifications().map((x) => ({
      ...x,
      read: true,
    })),
  );
};

const unreadNotifications = () =>
  notifications().filter((x) => !x.read);

const getCurrentTime = () => {
  const now = new Date();

  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${hour}:${minute}`;
};

const getTodayKey = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

const checkTaskReminders = () => {
  const tasks = read("lifeos-tasks", defaultTasks);
  const currentTime = getCurrentTime();

  tasks.forEach((task) => {
    if (!task.done && task.time === currentTime) {
      addNotification({
        key: `task-${task.id}-${currentTime}`,
        type: "task",
        title: "Task Reminder",
        message: `${task.title} is scheduled for now.`,
        action: task.title,
      });
    }
  });
};

const checkCalendarReminders = () => {
  const events = read("lifeos-events", []);
  const today = getTodayKey();
  const currentTime = getCurrentTime();

  events.forEach((event) => {
    if (
      event.date === today &&
      event.time === currentTime
    ) {
      addNotification({
        key: `event-${event.id}-${today}-${currentTime}`,
        type: "event",
        title: "Calendar Reminder",
        message: `${event.title} is scheduled for now.`,
        action: event.title,
      });
    }
  });
};

const checkReminders = () => {
  checkTaskReminders();
  checkCalendarReminders();
};

export const lifeService = {
  read,
  save,

  notifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  unreadNotifications,

  checkTaskReminders,
  checkCalendarReminders,
  checkReminders,

  focusAreas: () => read("lifeos-focus", []),

  setFocus: (areas) =>
    save("lifeos-focus", areas),

  tasks: () =>
    read("lifeos-tasks", defaultTasks),

  setTasks: (tasks) =>
    save("lifeos-tasks", tasks),

  habits: () =>
    read("habits", defaultHabits),

  setHabits: (habits) =>
    save("habits", habits),

  health: () =>
    read("lifeos-health", {
      water: 5,
      mood: "Good",
      sleep: 7.5,
      energy: 76,
    }),

  setHealth: (health) =>
    save("lifeos-health", health),

  study: () =>
    read("lifeos-study", {
      hours: 4.5,
      focus: 82,
      streak: 12,
      subjects: [
        ["DSA", 70],
        ["DBMS", 50],
        ["Operating Systems", 40],
        ["Web development", 80],
      ],
    }),

  setStudy: (study) =>
    save("lifeos-study", study),

  activity: () =>
    read("lifeos-activity", defaultActivity),

  addActivity: (activity) =>
    save(
      "lifeos-activity",
      [
        {
          id: Date.now(),
          time: "Just now",
          ...activity,
        },
        ...read("lifeos-activity", defaultActivity),
      ].slice(0, 8),
    ),
};