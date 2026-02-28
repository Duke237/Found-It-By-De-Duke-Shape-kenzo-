import React from "react";
import Badge from "@/components/ui/Badge";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Graduate Student",
    location: "New York, NY",
    avatar: "SM",
    avatarVariant: "accent",
    rating: 5,
    text: "I lost my laptop bag with all my thesis research on the subway. Within 24 hours of posting on FindIt, someone had found it and reached out. I was in tears when I got it back. This platform is a lifesaver!",
    item: "Laptop Bag",
    recovered: true,
    timeToRecover: "24 hours",
  },
  {
    name: "Marcus Johnson",
    role: "Business Analyst",
    location: "Brooklyn, NY",
    avatar: "MJ",
    avatarVariant: "accent2",
    rating: 5,
    text: "Found a wallet near my office and used FindIt to return it. The owner was so grateful — it had irreplaceable family photos inside. The secure messaging made the whole process safe and easy.",
    item: "Leather Wallet",
    recovered: true,
    timeToRecover: "6 hours",
  },
  {
    name: "Elena Rodriguez",
    role: "Nurse Practitioner",
    location: "Queens, NY",
    avatar: "ER",
    avatarVariant: "accent",
    rating: 5,
    text: "My engagement ring slipped off at the park. I was devastated. FindIt's location-based search helped me connect with someone who found it nearby. The AI matching is incredibly accurate!",
    item: "Engagement Ring",
    recovered: true,
    timeToRecover: "48 hours",
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    location: "Manhattan, NY",
    avatar: "DC",
    avatarVariant: "accent2",
    rating: 5,
    text: "Lost my AirPods case at a coffee shop. The photo matching feature on FindIt helped identify my exact case from dozens of similar ones. Got them back in less than a day. Incredible service!",
    item: "AirPods Pro",
    recovered: true,
    timeToRecover: "18 hours",
  },
  {
    name: "Priya Sharma",
    role: "Teacher",
    location: "Bronx, NY",
    avatar: "PS",
    avatarVariant: "accent",
    rating: 5,
    text: "I've used FindIt twice now — once to report a lost item and once to return something I found. Both experiences were seamless. The community here is genuinely honest and helpful.",
    item: "School Bag",
    recovered: true,
    timeToRecover: "36 hours",
  },
  {
    name: "James O'Brien",
    role: "Photographer",
    location: "Staten Island, NY",
    avatar: "JO",
    avatarVariant: "accent2",
    rating: 5,
    text: "My camera equipment worth thousands was left on a bus. FindIt's instant notification system alerted me when someone reported finding it. The platform's verification process gave me confidence it was legitimate.",
    item: "Camera Equipment",
    recovered: true,
    timeToRecover: "12 hours",
  },
];

const avatarVariants: Record<string, string> = {
  accent: "bg-[rgb(var(--accent))]",
  accent2: "bg-[rgb(var(--accent-2))]",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-accent" : "text-muted2"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-20 lg:py-28 bg-subtle relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[rgb(var(--accent)/0.06)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[rgb(var(--accent-2)/0.06)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="accent" className="mb-4">
            💬 &nbsp; Success Stories
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-app mb-6 leading-tight">
            Real People,{" "}
            <span className="gradient-text">
              Real Recoveries
            </span>
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Thousands of people have successfully recovered their lost
            belongings through our platform. Here are some of their stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group bg-card rounded-2xl p-6 border border-app hover:border-accent transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-4 text-6xl text-[rgb(var(--text)/0.08)] font-serif leading-none select-none">
                &ldquo;
              </div>

              {/* Rating */}
              <StarRating rating={t.rating} />

              {/* Text */}
              <p className="text-muted text-sm leading-relaxed mt-4 mb-5 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Recovery badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs bg-[rgb(var(--accent)/0.12)] text-accent border border-[rgb(var(--accent)/0.25)] px-2.5 py-1 rounded-full font-semibold">
                  ✓ Recovered: {t.item}
                </span>
                <span className="text-xs text-muted2">in {t.timeToRecover}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-app">
                <div
                  className={`w-10 h-10 ${avatarVariants[t.avatarVariant] ?? avatarVariants.accent} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-app font-semibold text-sm">{t.name}</p>
                  <p className="text-muted2 text-xs">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-[rgb(var(--accent)/0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "⭐", value: "4.9/5", label: "Average Rating" },
            { icon: "👥", value: "25,000+", label: "Active Users" },
            { icon: "🔒", value: "100%", label: "Secure Platform" },
            { icon: "🏆", value: "#1", label: "Lost & Found App" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-4 border border-app text-center"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-app font-bold text-xl">{item.value}</div>
              <div className="text-muted2 text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
