import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/authService";
import { AppLayout } from "./layouts/AppLayout";
import LandingPage from "./pages/Landing/LandingPage";
import AuthPage from "./pages/Auth/AuthPage";
import OnboardingPage from "./pages/Onboarding/OnboardingPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import TasksPage from "./pages/Tasks/TasksPage";
import CalendarPage from "./pages/Calendar/CalendarPage";
import HealthPage from "./pages/Health/HealthPage";
import StudyPage from "./pages/Study/StudyPage";
import HabitsPage from "./pages/Habits/HabitsPage";
import GoalsPage from "./pages/Goals/GoalsPage";
import AIInsightsPage from "./pages/Insights/AIInsightsPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import AIAssistantPage from "./pages/AI/AIAssistantPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import MarketingPage from "./pages/MarketingPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
function Protected({ children }) {
  return authService.current() ? (
    <AppLayout>{children}</AppLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}
const secure = (Page) => (
  <Protected>
    <Page />
  </Protected>
);
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<MarketingPage />} />
        <Route path="/features" element={<MarketingPage />} />
        <Route path="/about" element={<MarketingPage />} />
        <Route path="/pricing" element={<MarketingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage signup />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={secure(DashboardPage)} />
        <Route path="/tasks" element={secure(TasksPage)} />
        <Route path="/calendar" element={secure(CalendarPage)} />
        <Route path="/health" element={secure(HealthPage)} />
        <Route path="/study" element={secure(StudyPage)} />
        <Route path="/habits" element={secure(HabitsPage)} />
        <Route path="/goals" element={secure(GoalsPage)} />
        <Route path="/ai-insights" element={secure(AIInsightsPage)} />
        <Route path="/reports" element={secure(ReportsPage)} />
        <Route path="/ai-assistant" element={secure(AIAssistantPage)} />
        <Route path="/settings" element={secure(SettingsPage)} />
        <Route path="/profile" element={secure(ProfilePage)} />
        <Route path="/notifications" element={secure(NotificationsPage)} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
