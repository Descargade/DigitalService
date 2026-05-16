import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ServiceCards } from "@/components/ServiceCards";
import { BudgetCalculator, type BudgetInfo } from "@/components/BudgetCalculator";
import { ContactForm } from "@/components/ContactForm";
import { LoginSection } from "@/components/LoginSection";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [budgetInfo, setBudgetInfo] = useState<BudgetInfo | undefined>(undefined);

  const handleBudgetChange = useCallback((info: BudgetInfo) => {
    setBudgetInfo(info);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative selection:bg-primary selection:text-white">
      {/* Global Background effects */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />
      </div>

      <Navbar />

      <main id="main-content" className="flex-1">
        <Hero />
        <ServiceCards />
        <BudgetCalculator onBudgetChange={handleBudgetChange} />
        <ContactForm budgetInfo={budgetInfo} />
        <Testimonials />
        <FAQ />
        <LoginSection />
      </main>

      <Footer />
    </div>
  );
}
