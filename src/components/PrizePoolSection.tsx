
import { Trophy, Star, Users, Clock } from 'lucide-react';
import { Button } from './ui/button';

const PrizePoolSection = () => {
  return (
    <section className="py-20 bg-gradient 
to-r from-forex-dark via-forex-card to-forex-primary/20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1a1f2c,transparent_70%)]"></div>
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,45 50,50 T100,50" stroke="currentColor" strokeWidth="0.5" fill="none">
            <animate attributeName="d" dur="5s" repeatCount="indefinite"
              values="M0,50 Q25,45 50,50 T100,50;
                      M0,50 Q25,55 50,50 T100,50;
                      M0,50 Q25,45 50,50 T100,50"/>
          </path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-forex-primary/10 text-forex-primary font-medium rounded-full mb-4">
            Dynamic Rewards
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Community-Driven Prize Pool
          </h2>
          <p className="text-lg text-forex-light/80">
            Every entry grows the pool. Top traders win big. Top 30% always get rewarded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Trophy,
              title: "Win Daily",
              description: "Top performers get major rewards every 24 hours",
              highlight: true
            },
            {
              icon: Star,
              title: "Top 30% Win",
              description: "Not just the top 1% - we reward more traders",
              highlight: false
            },
            {
              icon: Users,
              title: "Community Pool",
              description: "Every entry increases prizes for everyone",
              highlight: false
            },
            {
              icon: Clock,
              title: "24h Payouts",
              description: "No waiting - get your rewards next day",
              highlight: false
            }
          ].map((item, index) => (
            <div
              key={index}
              className={`${
                item.highlight 
                  ? 'bg-gradient-to-br from-forex-primary/20 to-forex-accent/20' 
                  : 'bg-forex-card/40'
              } backdrop-blur-sm rounded-xl p-6 transform transition-all hover:scale-105 hover:shadow-xl border border-forex-light/10`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`${
                item.highlight ? 'text-forex-primary' : 'text-forex-accent'
              } mb-4`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-forex-light/70">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button 
            className="bg-forex-primary text-white hover:bg-forex-primary/90 text-lg px-8 py-6 rounded-xl transform transition-all hover:-translate-y-1"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})}
          >
            Join Next Challenge
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PrizePoolSection;
