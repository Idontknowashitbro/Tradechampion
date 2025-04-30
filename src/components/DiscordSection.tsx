
import React from 'react';
import { Button } from './ui/button';

const DiscordSection = () => {
  return (
    <section className="py-20 bg-[#5865F2]/10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/5 to-forex-dark/80"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#5865F2]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#5865F2]/10 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Discord message bubbles animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-8 h-8 md:w-12 md:h-12 bg-[#5865F2]/20 rounded-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.4,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto rounded-2xl bg-forex-dark/90 backdrop-blur-md border border-[#5865F2]/20 overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-[#5865F2] mr-3" viewBox="0 0 127.14 96.36" fill="currentColor">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Join our Trading Army</h2>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-[#5865F2]/20 flex items-center justify-center mt-1 mr-3">
                    <span className="text-xs font-bold text-[#5865F2]">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Real-time Updates</h3>
                    <p className="text-forex-light/70">Get instant notifications about challenge status and leaderboard changes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-[#5865F2]/20 flex items-center justify-center mt-1 mr-3">
                    <span className="text-xs font-bold text-[#5865F2]">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Private Trading Channels</h3>
                    <p className="text-forex-light/70">Access exclusive strategy discussions and market analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-[#5865F2]/20 flex items-center justify-center mt-1 mr-3">
                    <span className="text-xs font-bold text-[#5865F2]">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Early Access</h3>
                    <p className="text-forex-light/70">Be the first to join new challenges with special community bonuses</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-[#5865F2]/20 flex items-center justify-center mt-1 mr-3">
                    <span className="text-xs font-bold text-[#5865F2]">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Community Support</h3>
                    <p className="text-forex-light/70">Connect with other traders and get help from our support team</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a href="https://discord.gg/tradechampionx" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white px-8 py-6 text-lg font-semibold">
                    Join Discord Community
                  </Button>
                </a>
                <p className="mt-3 text-xs text-forex-light/50">Already 2,500+ traders in our community</p>
              </div>
            </div>
            
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#5865F2]/10 to-[#5865F2]/5 p-8 relative">
              {/* Discord message mockup */}
              <div className="absolute top-8 left-8 right-8 bottom-8 bg-forex-dark/70 backdrop-blur-md rounded-xl border border-[#5865F2]/20 overflow-hidden shadow-lg">
                <div className="h-10 bg-forex-dark flex items-center px-4 border-b border-[#5865F2]/10">
                  <span className="text-white font-medium"># trading-challenges</span>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100%-40px)]">
                  <div className="flex mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex-shrink-0"></div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-semibold text-[#5865F2]">TradeNinja</span>
                        <span className="ml-2 text-xs text-forex-light/50">Today at 3:24 PM</span>
                      </div>
                      <p className="text-forex-light/90">Just hit 12% profit on the daily challenge! 🚀</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex-shrink-0"></div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-semibold text-amber-400">Moderator</span>
                        <span className="ml-2 text-xs text-forex-light/50">Today at 3:25 PM</span>
                      </div>
                      <p className="text-forex-light/90">Congrats! You're currently in 2nd place on the leaderboard!</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex-shrink-0"></div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-semibold text-green-400">ForexQueen</span>
                        <span className="ml-2 text-xs text-forex-light/50">Today at 3:26 PM</span>
                      </div>
                      <p className="text-forex-light/90">Nice! What strategy are you using? I'm trying to break the 10% mark</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex-shrink-0"></div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-semibold text-[#5865F2]">TradeNinja</span>
                        <span className="ml-2 text-xs text-forex-light/50">Today at 3:28 PM</span>
                      </div>
                      <p className="text-forex-light/90">Mostly scalping the 5min chart with divergence setups</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscordSection;
