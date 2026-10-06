import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>This space doesn’t exist.</p>
      <Link className="button" to="/dashboard">
        Return to LifeOS
      </Link>
    </div>
  );
}
