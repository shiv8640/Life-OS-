import { useEffect, useState } from "react";
import { Bell, CheckCheck, CalendarDays, Brain, CheckSquare } from "lucide-react";
import { lifeService } from "../../services/lifeService";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(
    lifeService.notifications()
  );

  useEffect(() => {
    const update = () => {
      setNotifications(lifeService.notifications());
    };

    window.addEventListener("lifeos-data-change", update);

    return () => {
      window.removeEventListener("lifeos-data-change", update);
    };
  }, []);

  const markRead = (id) => {
    lifeService.markNotificationRead(id);
    setNotifications(lifeService.notifications());
  };

  const markAllRead = () => {
    lifeService.markAllNotificationsRead();
    setNotifications(lifeService.notifications());
  };

  const getIcon = (type) => {
    if (type === "task") return <CheckSquare size={20} />;
    if (type === "event") return <CalendarDays size={20} />;
    if (type === "ai") return <Brain size={20} />;
    return <Bell size={20} />;
  };

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <p className="eyebrow">LIFEOS</p>
          <h1>Notifications</h1>
          <p>Stay updated with your tasks, events and AI suggestions.</p>
        </div>

        {notifications.some((x) => !x.read) && (
          <button
            className="button"
            onClick={markAllRead}
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      <section
        className="card"
        style={{
          padding: "20px",
        }}
      >
        {notifications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <Bell size={35} />
            <h2>No notifications</h2>
            <p>You're all caught up. LifeOS will notify you when something needs your attention.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markRead(notification.id)}
              style={{
                display: "flex",
                gap: "16px",
                padding: "18px 10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                opacity: notification.read ? 0.55 : 1,
              }}
            >
              <div>{getIcon(notification.type)}</div>

              <div style={{ flex: 1 }}>
                <strong>{notification.title}</strong>

                <p style={{ margin: "5px 0" }}>
                  {notification.message}
                </p>

                <small>
                  {notification.read ? "Read" : "New"}
                </small>
              </div>

              {!notification.read && (
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#e76f51",
                    marginTop: "7px",
                  }}
                />
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}