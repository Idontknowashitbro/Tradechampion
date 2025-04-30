import { BadgeCheck, AlertCircle, Award, HeartHandshake } from "lucide-react";

const features = [
  {
    title: "Transparent Rules",
    description: "Unlike prop firms with hidden clauses designed to disqualify traders, our rules are simple, clear, and fair. We want you to succeed.",
    icon: BadgeCheck,
    color: "text-forex-primary",
    bgColor: "bg-forex-primary/10"
  },
  {
    title: "Real Withdrawals",
    description: "No withdrawal delays or impossible hurdles. When you win, you get paid. Period. Your success is our priority.",
    icon: HeartHandshake,
    color: "text-forex-secondary",
    bgColor: "bg-forex-secondary/10"
  },
  {
    title: "No Shady Tactics",
    description: "Tired of price manipulation, slippage, and widened spreads? Our platform uses direct cTrader API connections for fairness.",
    icon: AlertCircle,
    color: "text-forex-accent",
    bgColor: "bg-forex-accent/10" 
  },
  {
    title: "Community Rewards",
    description: "70% of entry fees go directly to top performers. The bigger our community grows, the bigger your potential rewards.",
    icon: Award,
    color: "text-forex-profit",
    bgColor: "bg-forex-profit/10"
  }
];

const comparisonPoints = [
  {
    propFirm: "Long Evaluations",
    tradechampionx: "Instant Daily/Weekly Challenges",
    highlight: true
  },
  {
    propFirm: "Delayed Payouts",
    tradechampionx: "Next-Day Payouts",
    highlight: false
  },
  {
    propFirm: "Focus on Capital",
    tradechampionx: "Focus on Skill",
    highlight: true
  },
  {
    propFirm: "Hidden Fees",
    tradechampionx: "Transparent Crypto Payments",
    highlight: false
  },
  {
    propFirm: "Corporate Feel",
    tradechampionx: "Real Community Vibes",
    highlight: true
  }
];

const WhyChooseUs = () => {
  return (
    <section className="pt-2 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-forex-light text-forex-primary font-medium rounded-full mb-4">
            Why Choose TradeChampionX
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-forex-dark mb-4">
            Built By Traders, For Traders
          </h2>
          <p className="text-lg text-forex-neutral">
            We've experienced the frustrations of typical prop firms and created something better
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 hover:shadow-lg transition-shadow group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-forex-dark">
                {feature.title}
              </h3>
              
              <p className="text-forex-neutral">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-forex-primary/10 text-forex-primary font-medium rounded-full mb-4">
              The TradeChampionX Difference
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-forex-dark">
              How We Compare to Traditional Prop Firms
            </h3>
          </div>
          
          <div className="bg-forex-light rounded-xl overflow-hidden shadow-md">
            <div className="grid grid-cols-2">
              <div className="bg-forex-dark text-center p-4">
                <h4 className="font-bold text-white text-xl">Traditional Prop Firms</h4>
              </div>
              <div className="bg-forex-primary text-center p-4">
                <h4 className="font-bold text-white text-xl">TradeChampionX</h4>
              </div>
            </div>
            
            {comparisonPoints.map((point, index) => (
              <div key={index} className={`grid grid-cols-2 border-t border-forex-border/30 ${point.highlight ? 'bg-forex-light/70' : ''}`}>
                <div className="p-4 text-center border-r border-forex-border/30">
                  <span className="text-forex-dark">{point.propFirm}</span>
                </div>
                <div className="p-4 text-center">
                  <span className="text-forex-primary font-medium">{point.tradechampionx}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 border border-forex-accent/30 rounded-xl bg-forex-accent/5 text-center">
            <p className="text-forex-dark font-bold text-xl mb-2">#NoMoreShadyPropFirms</p>
            <p className="text-forex-neutral">
              Join thousands of traders who are tired of prop firms designed to make you fail
              and are switching to our fair, community-driven challenges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
