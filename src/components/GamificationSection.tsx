
import React from 'react';
import { Badge, Award, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const badges = [
  {
    name: "Top Trader",
    description: "Reach #1 on any leaderboard",
    icon: Trophy,
    color: "bg-amber-500/20 border-amber-500/30",
    textColor: "text-amber-400",
    shine: true
  },
  {
    name: "Consistency King",
    description: "Trade profitably 7 days in a row",
    icon: Award,
    color: "bg-blue-500/20 border-blue-500/30",
    textColor: "text-blue-400",
    shine: false
  },
  {
    name: "Comeback Kid",
    description: "Recover from 3% drawdown to profit",
    icon: Star,
    color: "bg-purple-500/20 border-purple-500/30", 
    textColor: "text-purple-400",
    shine: false
  },
  {
    name: "Volume Monster",
    description: "Complete 50+ trades in one challenge",
    icon: Badge,
    color: "bg-green-500/20 border-green-500/30",
    textColor: "text-green-400",
    shine: false
  }
];

const GamificationSection = () => {
  return (
    <section className="py-20 px-4 bg-forex-card relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-forex-dark to-forex-card pointer-events-none"></div>
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <polygon points="25,0 50,14.4 50,29 25,43.4 0,29 0,14.4" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1 bg-forex-primary/10 text-forex-primary font-medium rounded-full mb-4">
            Earn. Collect. Show Off.
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Unlock Achievement Badges
          </h2>
          <p className="text-lg text-forex-light/70">
            Stand out from the crowd with exclusive trader badges that showcase your skills and achievements
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className={cn(
                "relative border rounded-xl p-6 transform transition-all hover:-translate-y-1 hover:shadow-lg group",
                badge.color,
                badge.shine ? "animate-pulse" : ""
              )}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
              
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                badge.color
              )}>
                <badge.icon className={cn("w-8 h-8", badge.textColor)} />
              </div>
              
              <h3 className={cn("text-xl font-bold mb-2", badge.textColor)}>
                {badge.name}
              </h3>
              
              <p className="text-forex-light/70 mb-4">
                {badge.description}
              </p>
              
              <div className="flex items-center text-xs text-forex-light/50">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 rounded-full bg-forex-light/20"></span>
                  <span className="w-2 h-2 rounded-full bg-forex-light/20"></span>
                  <span className="w-2 h-2 rounded-full bg-forex-light/20"></span>
                </div>
                <span className="ml-2">Unlockable</span>
              </div>
              
              {badge.shine && (
                <div className="absolute -top-1 -right-1 w-6 h-6">
                  <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75"></div>
                  <div className="relative rounded-full bg-amber-500 w-3 h-3 mx-auto mt-1.5"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-forex-light/70 inline-block px-4 py-2 bg-forex-dark/50 rounded-lg border border-forex-light/10">
            <span className="text-forex-primary font-semibold">New badges</span> released monthly — show off your trader status!
          </p>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
