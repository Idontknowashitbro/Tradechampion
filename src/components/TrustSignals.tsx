
import React from 'react';
import { Shield, Clock, Badge, CheckCircle } from 'lucide-react';

const TrustSignals = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-forex-dark mb-2">
              Trusted by Serious Traders
            </h2>
            <p className="text-forex-neutral">
              We're committed to fair competition and transparent operations
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-forex-light">
              <Shield className="w-10 h-10 text-forex-primary mb-3" />
              <h3 className="font-bold text-forex-dark mb-1">cTrader Verified</h3>
              <p className="text-sm text-forex-neutral">Official API integration with real-time data sync</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-forex-light">
              <Clock className="w-10 h-10 text-forex-primary mb-3" />
              <h3 className="font-bold text-forex-dark mb-1">24h Payout System</h3>
              <p className="text-sm text-forex-neutral">Winners receive rewards next day without delays</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-forex-light">
              <CheckCircle className="w-10 h-10 text-forex-primary mb-3" />
              <h3 className="font-bold text-forex-dark mb-1">Transparent Rules</h3>
              <p className="text-sm text-forex-neutral">Clear guidelines with no hidden clauses or loopholes</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-forex-light">
              <Badge className="w-10 h-10 text-forex-primary mb-3" />
              <h3 className="font-bold text-forex-dark mb-1">Built By Traders</h3>
              <p className="text-sm text-forex-neutral">Created by experienced traders who understand your needs</p>
            </div>
          </div>
          
          <div className="mt-12 p-4 border border-forex-border/30 rounded-lg bg-forex-light/50 text-center">
            <p className="text-forex-neutral">
              <span className="font-medium text-forex-primary">TradeChampionX</span> is committed to creating a fair trading environment where skill is rewarded, not punished.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
