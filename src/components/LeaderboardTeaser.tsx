
import React from 'react';
import { Trophy, TrendingUp, BadgeCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

// Sample leaderboard data - in a real app this would come from an API
const topTraders = [
  { rank: 1, name: "TradeSlayer92", profit: 14.23, isUp: true, change: "+2.1%" },
  { rank: 2, name: "ForexQueen", profit: 11.86, isUp: true, change: "+0.8%" },
  { rank: 3, name: "MomentumHunter", profit: 9.72, isUp: false, change: "-0.5%" },
  { rank: 4, name: "WaveSurfer", profit: 8.45, isUp: true, change: "+1.3%" },
  { rank: 5, name: "ChartWizard", profit: 7.89, isUp: false, change: "-0.2%" }
];

const LeaderboardTeaser = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-forex-dark to-forex-card/90 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[url('/public/placeholder.svg')] opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-forex-dark via-transparent to-transparent"></div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-forex-primary/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-forex-accent/20 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-forex-primary/10 text-forex-primary font-medium rounded-full mb-4">
            Live Performance
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See Who's Ruling Today!
          </h2>
          <p className="text-lg text-forex-light/70">
            Real-time rankings show the best traders in our current challenges
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-forex-dark/60 backdrop-blur-sm rounded-xl border border-forex-light/10 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between bg-gradient-to-r from-forex-primary/20 to-forex-accent/20 px-4 py-3">
              <div className="flex items-center">
                <Trophy className="w-5 h-5 text-amber-400 mr-2" />
                <h3 className="font-bold text-white">Daily Challenge Leaders</h3>
              </div>
              <div className="text-sm text-forex-light/70">
                Updated 5m ago
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-forex-card/30 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-forex-light/70">RANK</th>
                    <th className="px-4 py-3 text-xs font-semibold text-forex-light/70">TRADER</th>
                    <th className="px-4 py-3 text-xs font-semibold text-forex-light/70 text-right">PROFIT (%)</th>
                    <th className="px-4 py-3 text-xs font-semibold text-forex-light/70 text-right">24H CHANGE</th>
                  </tr>
                </thead>
                <tbody>
                  {topTraders.map((trader, index) => (
                    <tr 
                      key={index} 
                      className={`border-t border-forex-light/5 ${
                        index === 0 
                          ? "bg-gradient-to-r from-amber-500/10 to-transparent" 
                          : index === 1 
                            ? "bg-gradient-to-r from-slate-400/10 to-transparent" 
                            : index === 2 
                              ? "bg-gradient-to-r from-amber-700/10 to-transparent" 
                              : ""
                      } hover:bg-forex-light/5`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                            index === 0 
                              ? "bg-amber-500/20 text-amber-400" 
                              : index === 1 
                                ? "bg-slate-400/20 text-slate-300" 
                                : index === 2 
                                  ? "bg-amber-700/20 text-amber-600" 
                                  : "bg-forex-light/10 text-forex-light/70"
                          }`}>
                            {trader.rank}
                          </span>
                          {index < 3 && (
                            <Trophy className={`w-3 h-3 ${
                              index === 0 
                                ? "text-amber-400" 
                                : index === 1 
                                  ? "text-slate-300" 
                                  : "text-amber-600"
                            }`} />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="font-medium text-white">{trader.name}</span>
                          {index === 0 && (
                            <BadgeCheck className="w-4 h-4 text-forex-primary ml-1" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-forex-profit">
                        +{trader.profit}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className={`flex items-center justify-end ${
                          trader.isUp ? "text-forex-profit" : "text-forex-loss"
                        }`}>
                          {trader.isUp ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                          )}
                          <span className="text-sm">{trader.change}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-forex-dark/40 px-4 py-3 flex justify-between items-center">
              <span className="text-xs text-forex-light/50">
                Showing top 5 of 237 traders
              </span>
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm" className="text-forex-primary hover:text-white hover:bg-forex-primary/20">
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-forex-light/70 text-sm mb-6">
              Join a challenge now and see your name on the leaderboard!
            </p>
            <Button 
              className="bg-forex-primary hover:bg-forex-primary/90 text-white shadow-lg px-6"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})}
            >
              Start Competing Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardTeaser;
