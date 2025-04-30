import { CheckCircle, Coins, LineChart, Trophy, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Join a Challenge",
    description: "Choose from daily, weekly or monthly challenges that match your trading style.",
    icon: CheckCircle,
    iconBg: "bg-forex-accent",
  },
  {
    id: 2,
    title: "Pay with Crypto",
    description: "Quick and secure payment with your favorite cryptocurrency via NOWPayments.",
    icon: Coins,
    iconBg: "bg-forex-secondary",
  },
  {
    id: 3,
    title: "Connect cTrader",
    description: "Link your cTrader demo account with our simple OAuth connection.",
    icon: BarChart,
    iconBg: "bg-forex-primary",
  },
  {
    id: 4,
    title: "Trade & Compete",
    description: "Follow our fair rules and climb the leaderboard with your trading skills.",
    icon: LineChart,
    iconBg: "bg-forex-primary/80",
  },
  {
    id: 5,
    title: "Win Rewards",
    description: "Top performers receive prizes instantly with next-day payouts.",
    icon: Trophy,
    iconBg: "bg-amber-500",
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 pb-4 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-forex-light text-forex-primary font-medium rounded-full mb-4 shadow-sm">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-forex-dark mb-4">
            How It Works
          </h2>
          <p className="text-lg text-forex-neutral">
            Start your trading challenge journey in just a few simple steps
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline connector for desktop */}
          <div className="hidden md:block absolute left-1/2 top-12 bottom-12 w-1 bg-forex-light transform -translate-x-1/2 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10">
              <div className={`mb-12 md:mb-24 flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <span className="text-forex-primary font-semibold text-sm mb-1 block">
                    Step {step.id}
                  </span>
                  <h3 className="text-xl font-semibold mb-2 text-forex-dark">
                    {step.title}
                  </h3>
                  <p className="text-forex-neutral">
                    {step.description}
                  </p>
                </div>
                
                <div className="hidden md:flex items-center justify-center w-0 md:w-14">
                  <div className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full",
                    step.iconBg
                  )}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                  {/* Mobile icon positioning */}
                  <div className="flex md:hidden items-center mb-4">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full mr-3",
                      step.iconBg
                    )}>
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div>
                      <span className="text-forex-primary font-semibold text-sm">
                        Step {step.id}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`bg-forex-light rounded-lg p-5 transform transition-all hover:shadow-md ${index % 2 === 0 ? 'md:rounded-tr-3xl' : 'md:rounded-tl-3xl'}`}>
                    <div className={`h-32 rounded-lg ${step.iconBg}/10 flex items-center justify-center`}>
                      <step.icon className={`w-16 h-16 ${step.iconBg === 'bg-amber-500' ? 'text-amber-500' : 'text-forex-primary'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
