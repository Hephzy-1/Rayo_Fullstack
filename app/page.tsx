// app/page.tsx
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import BanksSection from "@/components/landing/BanksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SmartStashSection from "@/components/landing/SmartStashSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <BanksSection />
      <FeaturesSection />
      <SmartStashSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
