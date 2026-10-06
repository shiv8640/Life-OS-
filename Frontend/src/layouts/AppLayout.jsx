import { useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { lifeService } from "../services/lifeService";

export function AppLayout({ children }) {
  useEffect(() => {
    const checkReminders = () => {
  lifeService.checkReminders();
    };

    // App open hote hi check
    checkReminders();

    // Har 30 seconds check
    const timer = setInterval(checkReminders, 30000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="shell">
      <Sidebar />
      <main>
        <Topbar />
        {children}
      </main>
    </div>
  );
}