import { Button } from "@/components/ui/button";
import { Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const PricingTable = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    // Update current date every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Function to check if a challenge is enrollable
  const getChallengeStatus = (type: string) => {
    const estOffset = -4; // EST timezone offset
    const estDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() + estOffset * 60) * 60000);
    
    const currentDay = estDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const currentHour = estDate.getHours();
    const currentDateNum = estDate.getDate();
    const currentMonth = estDate.getMonth();
    
    if (type === "daily") {
      // Daily challenges start at midnight EST
      // Allow enrollment for next day's challenge
      return {
        enrollable: true,
        message: "Enroll for tomorrow's challenge",
        nextStart: new Date(estDate.setHours(24, 0, 0, 0))
      };
    } else if (type === "weekly") {
      // Weekly challenges start on Monday at midnight EST
      const daysUntilMonday = (currentDay === 0) ? 1 : ((7 - currentDay) + 1);
      const nextMonday = new Date(estDate);
      nextMonday.setDate(estDate.getDate() + daysUntilMonday);
      nextMonday.setHours(0, 0, 0, 0);
      
      return {
        enrollable: true,
        message: "Enroll for next week's challenge",
        nextStart: nextMonday
      };
    } else if (type === "monthly") {
      // Monthly challenges start on the 1st of each month
      const nextMonth = new Date(estDate);
      nextMonth.setMonth(estDate.getMonth() + 1);
      nextMonth.setDate(1);
      nextMonth.setHours(0, 0, 0, 0);
      
      return {
        enrollable: true,
        message: "Enroll for next month's challenge",
        nextStart: nextMonth
      };
    }
    
    return {
      enrollable: false,
      message: "Enrollment closed",
      nextStart: null
    };
  };
  
  const formatNextDate = (date: Date | null) => {
    if (!date) return "";
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const plans = [
    {
      name: "Daily Challenge",
      price: "$20",
      initialBalance: "$10,000",
      duration: "24 hours",
      type: "daily",
      features: [
        "Initial balance: $10,000",
        "Max 4% drawdown rule",
        "Max 1% risk per trade",
        "Min 1% profit to qualify",
        "24-hour trading cycle",
        "Next-day payouts",
        "Top 30% get rewarded"
      ],
      popular: false,
      ctaText: "Join Daily Challenge",
      ctaLink: "/dashboard?type=daily",
      color: "forex-primary"
    },
    {
      name: "Weekly Challenge",
      price: "$50",
      initialBalance: "$50,000",
      duration: "7 days",
      type: "weekly",
      features: [
        "Initial balance: $50,000",
        "Max 6% drawdown rule",
        "Max 1.5% risk per trade",
        "Min 3 trades required",
        "7-day trading cycle",
        "Weekly performance reports",
        "Top 30% get rewarded"
      ],
      popular: true,
      ctaText: "Join Weekly Challenge",
      ctaLink: "/dashboard?type=weekly",
      color: "forex-accent"
    },
    {
      name: "Monthly Championship",
      price: "$99",
      initialBalance: "$100,000",
      duration: "30 days",
      type: "monthly",
      features: [
        "Initial balance: $100,000",
        "Max 10% drawdown rule",
        "Max 2% risk per trade",
        "Min 6 trading days",
        "30-day trading cycle",
        "Weekly performance reports",
        "Top 30% get rewarded"
      ],
      popular: false,
      ctaText: "Join Monthly Challenge",
      ctaLink: "/dashboard?type=monthly",
      color: "forex-secondary"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-forex-light" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-white text-forex-primary font-medium rounded-full mb-4 shadow-sm">
            Choose Your Challenge
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-forex-dark mb-4 bg-gradient-to-r from-forex-dark to-forex-primary bg-clip-text text-transparent">
            Select Your Trading Challenge
          </h2>
          <p className="text-lg text-forex-neutral">
            Pick the challenge that matches your trading style, timeframe, and risk preference
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const status = getChallengeStatus(plan.type);
            return (
              <div 
                key={plan.name}
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay={index * 100}
                className={cn(
                  "glass-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2",
                  plan.popular ? `border-t-4 border-${plan.color}` : ""
                )}
              >
                {plan.popular && (
                  <div className={`bg-${plan.color} text-white text-center py-2 font-medium relative`}>
                    Most Popular
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent" style={{borderTopColor: plan.color === 'forex-primary' ? '#0284c7' : plan.color === 'forex-accent' ? '#0ea5e9' : '#10b981'}}></div>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-forex-dark mb-2 relative">
                    {plan.name}
                    {!plan.popular && <div className="h-1 w-12 bg-forex-primary/50 rounded-full mt-1"></div>}
                  </h3>
                  
                  <div className="flex items-end mb-2">
                    <span className={`text-4xl font-bold text-${plan.color}`}>
                      {plan.price}
                    </span>
                    <span className="text-forex-neutral ml-2 pb-1">
                      / {plan.duration}
                    </span>
                  </div>
                  
                  <div className={`bg-gradient-to-r from-${plan.color}/10 to-${plan.color}/5 rounded-md p-3 mb-6`}>
                    <div className="text-forex-dark text-sm">Initial Balance</div>
                    <div className="text-forex-dark font-bold text-xl">{plan.initialBalance}</div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start group">
                        <Check className={`w-5 h-5 text-${plan.color} mr-2 shrink-0 mt-0.5 group-hover:scale-110 transition-transform`} />
                        <span className="text-forex-neutral">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="space-y-4">
                    {status.enrollable && (
                      <div className="flex items-center text-sm text-forex-dark/80 mb-2">
                        <Calendar className="w-4 h-4 mr-2 text-forex-primary" />
                        <span>Next starts: {formatNextDate(status.nextStart)}</span>
                      </div>
                    )}
                    
                    <Link to={plan.ctaLink}>
                      <Button 
                        className={cn(
                          "w-full py-4 text-base font-semibold shadow-lg transition-all hover:shadow-xl",
                          `bg-gradient-to-r from-${plan.color} to-${plan.color === 'forex-primary' ? 'forex-accent' : plan.color === 'forex-accent' ? 'forex-primary' : 'forex-accent'} hover:opacity-90`
                        )}
                      >
                        {status.message || plan.ctaText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div 
          className="mt-12 max-w-3xl mx-auto text-center"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="400"
        >
          <p className="text-forex-neutral">
            <span className="font-semibold">Dynamic Prize Pool:</span> 70% of all entry fees are distributed to top performers.
            The more participants join, the bigger the rewards! Learn more about our <Link to="#prize-pool" className="text-forex-primary underline hover:text-forex-hover transition-colors">prize distribution</Link>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
