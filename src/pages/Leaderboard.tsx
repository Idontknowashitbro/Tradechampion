
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeaderboardTable from "@/components/LeaderboardTable";

const Leaderboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-forex-light py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-forex-dark mb-4">
              Forex Challenge Leaderboard
            </h1>
            <p className="text-lg text-forex-neutral">
              Track real-time performance of traders in our daily and monthly challenges
            </p>
          </div>
          
          <LeaderboardTable />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
