import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServiceCards } from "@/components/ServiceCards";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { LoginSection } from "@/components/LoginSection";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative selection:bg-primary selection:text-white">
      {/* Global Background effects */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}></div>
      </div>

      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <ServiceCards />
        <BudgetCalculator />
        <LoginSection />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
