
import { Shield, Award, BadgeCheck, TrendingUp } from "lucide-react";

const advantages = [
  {
    title: "Beat Traditional Props",
    description: "No more 2-3 month waits for payouts. Win daily, weekly, or monthly challenges.",
    icon: TrendingUp,
    highlight: "Immediate Rewards"
  },
  {
    title: "30% Get Rewarded",
    description: "Not just the top 1%. More traders win with our inclusive reward system.",
    icon: Award,
    highlight: "Greater Winning Chance"
  },
  {
    title: "No Pressure Disqualification",
    description: "Trade confidently. One mistake doesn't end your journey.",
    icon: Shield,
    highlight: "Trade with Confidence"
  },
  {
    title: "Community Recognition",
    description: "Earn badges, loyalty points, and real bragging rights.",
    icon: BadgeCheck,
    highlight: "Build Your Reputation"
  }
];

const EmotionalTrust = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-forex-dark to-forex-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-forex-primary/10 text-forex-primary font-medium rounded-full mb-4">
            Why Traders Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Beyond Traditional Prop Firms
          </h2>
          <p className="text-lg text-forex-light/80">
            Experience a trading challenge platform that puts your success first
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <div 
              key={index}
              className="bg-forex-card/50 backdrop-blur-sm border border-forex-light/10 rounded-xl p-6 transform hover:scale-105 transition-all"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="bg-forex-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <advantage.icon className="w-6 h-6 text-forex-primary" />
              </div>
              
              <h3 className="text-white font-bold text-xl mb-2">
                {advantage.title}
              </h3>
              
              <p className="text-forex-light/70 mb-4">
                {advantage.description}
              </p>
              
              <span className="inline-block bg-forex-primary/20 text-forex-primary px-3 py-1 rounded-full text-sm font-medium">
                {advantage.highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmotionalTrust;
