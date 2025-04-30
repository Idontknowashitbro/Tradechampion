import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const rules = [{
  title: "Daily Challenge Rules",
  description: "Initial balance: $10,000. Max drawdown: 4%. Max risk per trade: 1%. Minimum profit: 1% to qualify. No martingale or hedging. 24-hour cycle with next-day payouts.",
  important: true,
  color: "bg-forex-primary/10 border-forex-primary/20",
  textColor: "text-forex-primary"
}, {
  title: "Weekly Challenge Rules",
  description: "Initial balance: $50,000. Max drawdown: 6%. Max risk per trade: 1.5%. Minimum trades: 3 trades over the week. No martingale or hedging. 7-day cycle with weekly payouts.",
  important: false,
  color: "bg-forex-accent/10 border-forex-accent/20",
  textColor: "text-forex-accent"
}, {
  title: "Monthly Championship Rules",
  description: "Initial balance: $100,000. Max drawdown: 10%. Max risk per trade: 2%. Minimum trading days: 6 days. No martingale or hedging. 30-day cycle with end of month payout.",
  important: false,
  color: "bg-forex-secondary/10 border-forex-secondary/20",
  textColor: "text-forex-secondary"
}];

const RulesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-forex-light" id="rules">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-forex-light text-forex-primary font-medium rounded-full mb-4 shadow-sm">
            Clear & Transparent
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-forex-dark mb-4 bg-gradient-to-r from-forex-dark to-forex-primary bg-clip-text text-transparent">
            Challenge Rules
          </h2>
          <p className="text-lg text-forex-neutral">
            Unlike prop firms with hidden clauses, our rules are simple, clear, and designed for trader success
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {rules.map((rule, index) => (
            <div 
              key={index} 
              className={cn("rounded-lg p-5 border transform transition-all hover:shadow-lg hover:-translate-y-1", rule.color)}
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={100 * index}
            >
              <div className="flex items-start">
                <AlertCircle className={`h-5 w-5 mt-1 mr-3 ${rule.textColor}`} />
                <div>
                  <h3 className={`font-semibold text-lg ${rule.textColor} mb-1`}>{rule.title}</h3>
                  <p className="text-forex-neutral">{rule.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div 
            className="bg-gradient-to-r from-forex-primary/20 to-forex-accent/20 rounded-lg p-6 mt-8 border border-forex-primary/20 transform transition-all hover:shadow-lg"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={rules.length * 100}
          >
            <h3 className="font-semibold text-lg text-forex-primary mb-3">No Hidden Rules</h3>
            <p className="text-forex-neutral">
              What you see is what you get. We believe in complete transparency and fairness.
              Unlike traditional prop firms, we don't create rules designed to make you fail.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
