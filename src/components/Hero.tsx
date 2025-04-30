
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, Shield, BadgeCheck } from "lucide-react";
import Logo from "./Logo";

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-forex-dark pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-forex-dark via-forex-card to-forex-primary/20 pointer-events-none"></div>
      
      {/* Animated trading pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMSIgZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-forex-primary/30"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Trading chart line animation */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path
            d="M0,100 C150,20 350,150 500,80 C650,10 800,120 1000,60 C1100,20 1200,80 1200,80 L1200,200 L0,200 Z"
            fill="url(#gradientChart)"
          >
            <animate
              attributeName="d"
              dur="20s"
              repeatCount="indefinite"
              values="
                M0,100 C150,20 350,150 500,80 C650,10 800,120 1000,60 C1100,20 1200,80 1200,80 L1200,200 L0,200 Z;
                M0,80 C150,120 350,60 500,100 C650,140 800,60 1000,100 C1100,130 1200,100 1200,100 L1200,200 L0,200 Z;
                M0,100 C150,20 350,150 500,80 C650,10 800,120 1000,60 C1100,20 1200,80 1200,80 L1200,200 L0,200 Z"
            />
          </path>
          <defs>
            <linearGradient id="gradientChart" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div 
            className="bg-forex-primary/10 backdrop-blur-sm inline-block py-2 px-4 rounded-full mb-6 animate-fade-in border border-forex-primary/20"
            data-aos="fade-down"
            data-aos-duration="800"
          >
            <span className="text-forex-primary font-medium">Compete • Win • Level Up</span>
          </div>

          <div className="mb-8" data-aos="zoom-in" data-aos-duration="1000">
            <Logo variant="white" size="large" showText={false} />
          </div>

          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in leading-tight"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            Compete. Win.{" "}
            <span className="bg-gradient-to-r from-forex-primary to-forex-accent bg-clip-text text-transparent">Level Up.</span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-forex-light/80 mb-10"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            The ultimate trading challenge platform — built for real traders.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-forex-primary to-forex-accent hover:opacity-90 text-white font-semibold text-base px-6 py-4 w-full sm:w-auto shadow-lg transform transition-transform hover:-translate-y-1"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})}
            >
              Join the Challenge Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-forex-light/20 font-semibold text-base px-6 py-4 w-full sm:w-auto bg-forex-dark/80 hover:bg-forex-card text-zinc-200 backdrop-blur-sm shadow-lg transform transition-transform hover:-translate-y-1"
              onClick={() => document.getElementById('rules')?.scrollIntoView({behavior: 'smooth'})}
            >
              View Rules
            </Button>
          </div>
          
          <div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            <div className="bg-gradient-to-br from-forex-card/60 to-forex-card/30 backdrop-blur-sm rounded-lg p-5 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-lg border border-forex-light/10 group">
              <Shield className="w-8 h-8 text-forex-primary mb-3 group-hover:animate-bounce-soft" />
              <div className="text-white font-bold text-lg">Fair Rules</div>
              <div className="text-forex-light/70 text-sm">No hidden clauses</div>
            </div>
            
            <div className="bg-gradient-to-br from-forex-card/60 to-forex-card/30 backdrop-blur-sm rounded-lg p-5 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-lg border border-forex-light/10 group">
              <BadgeCheck className="w-8 h-8 text-forex-primary mb-3 group-hover:animate-bounce-soft" />
              <div className="text-white font-bold text-lg">70% to Winners</div>
              <div className="text-forex-light/70 text-sm">Transparent payouts</div>
            </div>
            
            <div className="bg-gradient-to-br from-forex-card/60 to-forex-card/30 backdrop-blur-sm rounded-lg p-5 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-lg border border-forex-light/10 group">
              <TrendingUp className="w-8 h-8 text-forex-primary mb-3 group-hover:animate-bounce-soft" />
              <div className="text-white font-bold text-lg">Next-Day Payouts</div>
              <div className="text-forex-light/70 text-sm">No withdrawal games</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
