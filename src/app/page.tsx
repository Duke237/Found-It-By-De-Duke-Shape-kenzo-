import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import RecentItems from "@/components/sections/RecentItems";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-app">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <RecentItems />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
