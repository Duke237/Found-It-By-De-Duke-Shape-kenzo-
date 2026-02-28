import React from "react";
import Badge from "@/components/ui/Badge";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Graduate Student",
    location: "New York, NY",
    avatar: "SM",
    avatarColor: "from-pink-500 to-rose-600",
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
    avatarColor: "from-blue-500 to-indigo-600",
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
    avatarColor: "from-green-500 to-emerald-600",
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
    avatarColor: "from-purple-500 to-violet-600",
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
    avatarColor: "from-orange-500 to-amber-600",
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
    avatarColor: "from-teal-500 to-cyan-600",
    rating: 5,
    text: "My camera equipment worth thousands was left on a bus. FindIt's instant notification system alerted me when someone reported finding it. The platform's verification process gave me confidence it was legitimate.",
    item: "Camera Equipment",
    recovered: true,
    timeToRecover: "12 hours",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-orange-400" : "text-gray-600"}`}
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
      className="py-20 lg:py-28 bg-gray-900/30 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="orange" className="mb-4">
            💬 &nbsp; Success Stories
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Real People,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Real Recoveries
            </span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Thousands of people have successfully recovered their lost
            belongings through our platform. Here are some of their stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group bg-gray-900/60 rounded-2xl p-6 border border-white/5 hover:border-orange-500/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-4 text-6xl text-white/3 font-serif leading-none select-none">
                &ldquo;
              </div>

              {/* Rating */}
              <StarRating rating={t.rating} />

              {/* Text */}
              <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-5 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Recovery badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-semibold">
                  ✓ Recovered: {t.item}
                </span>
                <span className="text-xs text-gray-600">in {t.timeToRecover}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${t.avatarColor} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">
                    {t.role} · {t.location}
                  </p>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
              className="bg-gray-900/40 rounded-xl p-4 border border-white/5 text-center"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-white font-bold text-xl">{item.value}</div>
              <div className="text-gray-500 text-xs">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
