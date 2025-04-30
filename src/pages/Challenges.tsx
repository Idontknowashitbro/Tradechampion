import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChallengeCard from "@/components/ChallengeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const activeChallenges = [
  {
    id: "daily-1",
    name: "Daily Forex Sprint",
    type: "daily" as const,
    startDate: "2025-04-26",
    endDate: "2025-04-27",
    participants: 245,
    initialBalance: "$10,000",
    rules: [
      "Max 4% drawdown",
      "Max 1% risk per trade",
      "Min 1% profit to qualify",
      "24-hour cycle",
      "Next-day payout"
    ],
    isActive: true,
    fee: "$20"
  },
  {
    id: "weekly-1",
    name: "Weekly Forex Challenge",
    type: "weekly" as const,
    startDate: "2025-04-26",
    endDate: "2025-05-02",
    participants: 423,
    initialBalance: "$50,000",
    rules: [
      "Max 6% drawdown",
      "Max 1.5% risk per trade",
      "Min 3 trades required",
      "7-day cycle",
      "Weekly payout"
    ],
    isActive: true,
    fee: "$50"
  },
  {
    id: "monthly-1",
    name: "April Forex Championship",
    type: "monthly" as const,
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    participants: 682,
    initialBalance: "$100,000",
    rules: [
      "Max 10% drawdown",
      "Max 2% risk per trade",
      "Min 6 trading days",
      "30-day cycle",
      "Monthly payout"
    ],
    isActive: true,
    fee: "$99"
  }
];

const upcomingChallenges = [
  {
    id: "daily-2",
    name: "Weekend Forex Sprint",
    type: "daily" as const,
    startDate: "2025-04-27",
    endDate: "2025-04-28",
    participants: 124,
    initialBalance: "$10,000",
    rules: [
      "Max 4% drawdown",
      "Max 1% risk per trade",
      "Min 2 min trade duration",
      "No martingale or hedging",
      "Min 1% profit for ranking"
    ],
    isActive: false,
    fee: "$20"
  },
  {
    id: "weekly-2",
    name: "Next Week's Challenge",
    type: "weekly" as const,
    startDate: "2025-05-03",
    endDate: "2025-05-09",
    participants: 189,
    initialBalance: "$50,000",
    rules: [
      "Max 6% drawdown",
      "Max 1.5% risk per trade",
      "Min 3 trades required",
      "No martingale or hedging",
    ],
    isActive: false,
    fee: "$50"
  },
  {
    id: "monthly-2",
    name: "May Forex Championship",
    type: "monthly" as const,
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    participants: 312,
    initialBalance: "$100,000",
    rules: [
      "Max 10% drawdown",
      "Min 6 trading days",
      "Max 2% risk per trade",
      "No martingale or hedging",
    ],
    isActive: false,
    fee: "$99"
  }
];

const Challenges = () => {
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 800,
        once: false,
        mirror: true
      });
    }

    const cards = document.querySelectorAll('.challenge-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('active');
      }, 100 * index);
    });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-b from-forex-dark via-forex-card to-forex-light pt-24 pb-12">
        <div className="relative bg-gradient-to-r from-forex-dark to-forex-card py-12 mb-12 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-forex-primary/30 rounded-full"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                  filter: 'blur(40px)',
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div 
              className="text-center max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-forex-light/80 bg-clip-text text-transparent">
                Trading Challenges
              </h1>
              <p className="text-lg text-forex-light/80">
                Choose from our daily, weekly, and monthly trading challenges to showcase your skills and compete for prizes
              </p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="active" 
            className="max-w-5xl mx-auto"
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="bg-forex-card/30 backdrop-blur-sm border border-white/10">
                <TabsTrigger 
                  value="active" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-forex-primary data-[state=active]:to-forex-accent data-[state=active]:text-white"
                >
                  Active Challenges
                </TabsTrigger>
                <TabsTrigger 
                  value="upcoming"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-forex-primary data-[state=active]:to-forex-accent data-[state=active]:text-white"
                >
                  Upcoming Challenges
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeChallenges.map((challenge, index) => (
                  <div 
                    key={challenge.id} 
                    className="challenge-card opacity-0 translate-y-4 transition-all duration-500" 
                    style={{ transitionDelay: `${index * 100}ms` }}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <ChallengeCard {...challenge} />
                  </div>
                ))}
              </div>
              
              {activeChallenges.length === 0 && (
                <div 
                  className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white"
                  data-aos="fade-up"
                >
                  <p className="text-forex-light/80">No active challenges at the moment.</p>
                  <p className="mt-2 text-forex-light/80">Check back soon or view upcoming challenges.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingChallenges.map((challenge, index) => (
                  <div 
                    key={challenge.id} 
                    className="challenge-card opacity-0 translate-y-4 transition-all duration-500" 
                    style={{ transitionDelay: `${index * 100}ms` }}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <ChallengeCard {...challenge} />
                  </div>
                ))}
              </div>
              
              {upcomingChallenges.length === 0 && (
                <div 
                  className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white"
                  data-aos="fade-up"
                >
                  <p className="text-forex-light/80">No upcoming challenges scheduled.</p>
                  <p className="mt-2 text-forex-light/80">Check back soon for new challenges.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Challenges;
