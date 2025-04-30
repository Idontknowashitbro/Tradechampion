
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PricingTable from "@/components/PricingTable";
import RulesSection from "@/components/RulesSection";
import FAQSection from "@/components/FAQSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import LeaderboardTeaser from "@/components/LeaderboardTeaser";
import GamificationSection from "@/components/GamificationSection";
import DiscordSection from "@/components/DiscordSection";
import TrustSignals from "@/components/TrustSignals";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  useEffect(() => {
    // Initialize AOS library for scroll animations
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 800,
        once: false,
        mirror: true
      });
    }

    // Scroll to section if hash is present in URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-forex-dark">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <WhyChooseUs />
        <LeaderboardTeaser />
        <GamificationSection />
        <DiscordSection />
        <div id="pricing">
          <PricingTable />
        </div>
        <div id="rules">
          <RulesSection />
        </div>
        <TestimonialsSection />
        <TrustSignals />
        <div id="faq">
          <FAQSection />
        </div>
        
        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-r from-forex-primary to-forex-accent relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-forex-dark/20 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#ffffff10,transparent_70%)]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Join the Champions?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Start trading today and prove your skills in our next challenge
              </p>
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/90 text-forex-primary font-semibold text-lg px-8 py-6 shadow-xl transform transition-transform hover:-translate-y-1"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})}
              >
                Start Your Challenge
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
