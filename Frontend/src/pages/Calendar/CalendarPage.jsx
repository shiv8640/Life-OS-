import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card } from "../../components/common/UI";
import { lifeService } from "../../services/lifeService";

const toKey = (d) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

const to12Hour = (time) => {
  const [h, m] = (time || "09:00").split(":").map(Number);

  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;

  return {
    hour: String(hour).padStart(2, "0"),
    minute: String(m).padStart(2, "0"),
    period,
  };
};

const to24Hour = (hour, minute, period) => {
  let h = Number(hour);

  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;

  return `${String(h).padStart(2, "0")}:${String(
    minute,
  ).padStart(2, "0")}`;
};

export default function CalendarPage() {
  const [now, setNow] = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  const [events, setEvents] = useState(
    lifeService.read("lifeos-events", [
      {
        id: 1,
        date: toKey(new Date()),
        title: "Focus block",
        time: "09:00",
      },
    ]),
  );

  const [draft, setDraft] = useState("");

  const initialTime = to12Hour("09:00");

  const [draftHour, setDraftHour] = useState(initialTime.hour);
  const [draftMinute, setDraftMinute] = useState(initialTime.minute);
  const [draftPeriod, setDraftPeriod] = useState(initialTime.period);

  const [editingId, setEditingId] = useState(null);

  const year = now.getFullYear();
  const month = now.getMonth();

  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  const title = now.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const resetForm = () => {
    setDraft("");
    setDraftHour("09");
    setDraftMinute("00");
    setDraftPeriod("AM");
    setEditingId(null);
  };

  const add = (e) => {
    e.preventDefault();

    if (!draft.trim()) return;

    const time = to24Hour(
      draftHour,
      draftMinute,
      draftPeriod,
    );

    const next = [
      ...events,
      {
        id: Date.now(),
        date: toKey(selected),
        title: draft.trim(),
        time,
      },
    ];

    setEvents(next);

    lifeService.save("lifeos-events", next);
    window.dispatchEvent(new Event("lifeos-data-change"));

    lifeService.addActivity({
      type: "task",
      text: "Added calendar event: " + draft,
    });

    resetForm();
  };

  const editEvent = (event) => {
    const t = to12Hour(event.time || "09:00");

    setDraft(event.title);
    setDraftHour(t.hour);
    setDraftMinute(t.minute);
    setDraftPeriod(t.period);
    setSelected(
      new Date(
        `${event.date}T00:00:00`,
      ),
    );
    setEditingId(event.id);
  };

  const saveEdit = (e) => {
    e.preventDefault();

    if (!draft.trim() || editingId === null) return;

    const time = to24Hour(
      draftHour,
      draftMinute,
      draftPeriod,
    );

    const next = events.map((event) =>
      event.id === editingId
        ? {
            ...event,
            title: draft.trim(),
            date: toKey(selected),
            time,
          }
        : event,
    );

    setEvents(next);

    lifeService.save("lifeos-events", next);
    window.dispatchEvent(new Event("lifeos-data-change"));

    lifeService.addActivity({
      type: "task",
      text: "Edited calendar event: " + draft,
    });

    resetForm();
  };

  const deleteEvent = (event) => {
    const ok = window.confirm(
      `Delete "${event.title}"?`,
    );

    if (!ok) return;

    const next = events.filter(
      (item) => item.id !== event.id,
    );

    setEvents(next);

    lifeService.save("lifeos-events", next);
    window.dispatchEvent(new Event("lifeos-data-change"));

    lifeService.addActivity({
      type: "task",
      text: "Deleted calendar event: " + event.title,
    });

    if (editingId === event.id) {
      resetForm();
    }
  };

  return (
    <div className="page calendar-v2">
      <header>
        <div>
          <p className="eyebrow">PLAN WITH INTENTION</p>

          <h1>Your calendar</h1>

          <p>
            Selected:{" "}
            {selected.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <form
          onSubmit={
            editingId !== null ? saveEdit : add
          }
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add an event"
          />

          <select
            value={draftHour}
            onChange={(e) =>
              setDraftHour(e.target.value)
            }
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
            value={draftMinute}
            onChange={(e) =>
              setDraftMinute(e.target.value)
            }
          >
            {["00", "15", "30", "45"].map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>

          <select
            value={draftPeriod}
            onChange={(e) =>
              setDraftPeriod(e.target.value)
            }
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>

          <button type="submit">
            <Plus size={15} />
            {editingId !== null ? "Save" : "Add"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </header>

      <Card>
        <div className="calendar-head">
          <button
            onClick={() =>
              setNow(new Date(year, month - 1, 1))
            }
          >
            <ChevronLeft />
          </button>

          <h2>{title}</h2>

          <button
            onClick={() =>
              setNow(new Date(year, month + 1, 1))
            }
          >
            <ChevronRight />
          </button>

          <button
            className="today-button"
            onClick={() => {
              const d = new Date();

              setNow(d);
              setSelected(d);
            }}
          >
            Today
          </button>
        </div>

        <div className="calendar-grid">
          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((x) => (
            <b key={x}>{x}</b>
          ))}

          {Array.from({ length: first }, (_, i) => (
            <span className="empty" key={"x" + i} />
          ))}

          {Array.from({ length: days }, (_, i) => {
            const d = new Date(year, month, i + 1);

            const dateKey = toKey(d);

            const items = events.filter(
              (x) => x.date === dateKey,
            );

            return (
              <button
                type="button"
                key={dateKey}
                className={
                  toKey(selected) === dateKey
                    ? "today"
                    : ""
                }
                onClick={() => setSelected(d)}
              >
                <b>{i + 1}</b>

                {items.map((x) => (
                  <small
                    key={x.id}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <span>{x.title}</span>

                    <span
                      role="button"
                      tabIndex={0}
                      title="Edit event"
                      onClick={(e) => {
                        e.stopPropagation();
                        editEvent(x);
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();
                          e.stopPropagation();
                          editEvent(x);
                        }
                      }}
                    >
                      <Pencil size={12} />
                    </span>

                    <span
                      role="button"
                      tabIndex={0}
                      title="Delete event"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(x);
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteEvent(x);
                        }
                      }}
                    >
                      <Trash2 size={12} />
                    </span>
                  </small>
                ))}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}