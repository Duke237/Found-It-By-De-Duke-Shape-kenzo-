import React from "react";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  sideTitle: string;
  sideSubtitle: string;
  children: React.ReactNode;
};

export default function AuthCard({
  eyebrow,
  title,
  subtitle,
  sideTitle,
  sideSubtitle,
  children,
}: Props) {
  return (
    <main className="min-h-screen bg-app flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-app bg-[rgb(var(--bg))] shadow-[0_30px_80px_rgb(var(--shadow)/0.18)] animate-fade-in">
          <div className="grid md:grid-cols-2">
            {/* Left visual panel */}
            <section className="relative bg-[rgb(var(--accent))] text-white p-8 sm:p-10 md:p-12">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-white/10" />
                <div className="absolute bottom-10 -right-10 w-36 h-36 rounded-full bg-white/10" />
                <div className="absolute top-1/2 left-10 w-20 h-20 rounded-full bg-white/10" />
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  {sideTitle}
                </div>
                <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight">
                  {sideSubtitle}
                </h2>
                <p className="mt-4 text-white/85 leading-relaxed max-w-md">
                  Keep your experience protected. You’ll be redirected here whenever you try to access a protected action.
                </p>
              </div>
            </section>

            {/* Right form panel */}
            <section className="p-8 sm:p-10 md:p-12">
              <p className="text-sm font-semibold text-accent">{eyebrow}</p>
              <h1 className="mt-2 text-3xl font-bold text-app tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-muted leading-relaxed">{subtitle}</p>
              {children}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

