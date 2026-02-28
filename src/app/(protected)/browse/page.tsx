import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BrowseFoundItemsPage() {
  return (
    <main className="min-h-screen bg-app">
      <Navbar />
      <div className="pt-24 lg:pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card-strong border border-app rounded-3xl shadow-xl shadow-black/5 p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-app">Browse Found Items</h1>
            <p className="mt-2 text-muted">
              This is a protected page. You’re signed in.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

