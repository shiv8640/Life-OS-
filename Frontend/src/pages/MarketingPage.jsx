import { Link, useLocation } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import { Footer } from "../components/common/Footer";
const content = {
  product: {
    eyebrow: "ONE THOUGHTFUL SPACE",
    title: "Your life, working together.",
    copy: "LifeOS connects planning, health, study, habits, and goals into one calm daily system.",
    items: [
      "A single daily overview",
      "Personal progress tracking",
      "Intelligent next-step suggestions",
    ],
  },
  features: {
    eyebrow: "MADE FOR REAL LIFE",
    title: "Tools that make progress feel lighter.",
    copy: "Everything you need to notice your patterns and make the next day a little better.",
    items: [
      "Smart daily planning",
      "Habit and goal momentum",
      "Clear personal analytics",
    ],
  },
  about: {
    eyebrow: "WHY LIFEOS",
    title: "A more intentional way to move through life.",
    copy: "We believe growth is not about doing more. It is about seeing what matters, then making space for it.",
    items: ["Calm by design", "Private by default", "Built around you"],
  },
  pricing: {
    eyebrow: "SIMPLE PRICING",
    title: "Start building your rhythm today.",
    copy: "LifeOS is free to begin. Upgrade when deeper insights and planning tools become useful.",
    items: [
      "Daily planning and habits",
      "Health and study tracking",
      "Personal AI reflections",
    ],
  },
};
const icons = [Sparkles, HeartPulse, ShieldCheck];
export default function MarketingPage() {
  const key = useLocation().pathname.slice(1),
    page = content[key] || content.product;
  return (
    <div className="marketing-page">
      <nav className="marketing-nav">
        <Link className="brand" to="/">
          LifeOS <i>AI</i>
        </Link>
        <Link className="button" to="/signup">
          Get Started
        </Link>
      </nav>
      <main>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p className="lead">{page.copy}</p>
        <div className="marketing-cards">
          {page.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <article key={item}>
                <span>
                  <Icon size={19} />
                </span>
                <h2>{item}</h2>
                <p>A thoughtful, practical part of your LifeOS experience.</p>
                <Check size={16} />
              </article>
            );
          })}
        </div>
        <Link className="button" to="/signup">
          Start your journey <ArrowRight size={16} />
        </Link>
      </main>
      <Footer />
    </div>
  );
}
