
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface ChallengeCardProps {
  id: string;
  name: string;
  type: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  participants: number;
  initialBalance: string;
  rules: string[];
  isActive: boolean;
  fee: string;
}

const ChallengeCard = ({
  id,
  name,
  type,
  startDate,
  endDate,
  participants,
  initialBalance,
  rules,
  isActive,
  fee,
}: ChallengeCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);
  
  const isDaily = type === "daily";
  const isWeekly = type === "weekly";
  const isMonthly = type === "monthly";
  
  const getBgGradient = () => {
    if (isDaily) return "from-forex-primary to-forex-primary/80";
    if (isWeekly) return "from-forex-accent to-forex-accent/80";
    return "from-forex-secondary to-forex-secondary/80";
  };
  
  const getBorderColor = () => {
    if (isDaily) return "border-forex-primary";
    if (isWeekly) return "border-forex-accent";
    return "border-forex-secondary";
  };
  
  const getButtonGradient = () => {
    if (isDaily) return "from-forex-primary to-forex-accent";
    if (isWeekly) return "from-forex-accent to-forex-primary";
    return "from-forex-secondary to-forex-accent";
  };
  
  const getDuration = () => {
    if (isDaily) return "24 Hours Duration";
    if (isWeekly) return "7 Days Duration";
    return "30 Days Duration";
  };
  
  return (
    <div 
      className={cn(
        "glass-card overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2",
        isActive 
          ? `border-l-4 ${getBorderColor()}`
          : "opacity-85"
      )}
    >
      <div className={cn(
        "px-6 py-3 text-white bg-gradient-to-r",
        getBgGradient()
      )}>
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {isDaily ? "Daily Challenge" : isWeekly ? "Weekly Challenge" : "Monthly Championship"}
          </span>
          {isActive ? (
            <span className="bg-white text-xs font-semibold px-2 py-1 rounded text-forex-dark shadow-sm">
              Active
            </span>
          ) : (
            <span className="bg-forex-dark/30 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded text-white shadow-sm">
              Upcoming
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-forex-dark">
          {name}
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-forex-neutral group hover:text-forex-dark transition-colors">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0 group-hover:text-forex-primary transition-colors" />
            <span>
              {startFormatted} - {endFormatted}
            </span>
          </div>
          
          <div className="flex items-center text-forex-neutral group hover:text-forex-dark transition-colors">
            <Users className="w-4 h-4 mr-2 flex-shrink-0 group-hover:text-forex-primary transition-colors" />
            <span>{participants} Participants</span>
          </div>
          
          <div className="flex items-center text-forex-neutral group hover:text-forex-dark transition-colors">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0 group-hover:text-forex-primary transition-colors" />
            <span>{getDuration()}</span>
          </div>
        </div>
        
        <div className={`mb-4 bg-gradient-to-r from-forex-light/80 to-forex-light p-3 rounded-md border border-${isDaily ? 'forex-primary' : isWeekly ? 'forex-accent' : 'forex-secondary'}/10`}>
          <div className={`text-${isDaily ? 'forex-primary' : isWeekly ? 'forex-accent' : 'forex-secondary'} font-semibold mb-1`}>Initial Balance</div>
          <div className="text-forex-dark font-bold text-lg">{initialBalance}</div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-forex-dark mb-2">Key Rules:</h4>
          <ul className="space-y-2">
            {rules.map((rule, index) => (
              <li key={index} className="flex items-start text-sm text-forex-neutral group hover:text-forex-dark transition-colors">
                <CheckCircle className={`w-4 h-4 text-${isDaily ? 'forex-primary' : isWeekly ? 'forex-accent' : 'forex-secondary'} mr-2 shrink-0 mt-0.5 group-hover:scale-110 transition-transform`} />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className={`bg-gradient-to-r from-forex-light/80 to-forex-light rounded-md p-3 text-center border border-${isDaily ? 'forex-primary' : isWeekly ? 'forex-accent' : 'forex-secondary'}/10`}>
            <div className="text-forex-dark text-sm">Entry Fee</div>
            <div className={`text-${isDaily ? 'forex-primary' : isWeekly ? 'forex-accent' : 'forex-secondary'} font-bold text-xl`}>{fee}</div>
          </div>
          
          <Link to={`/challenges/${id}`}>
            <Button 
              className={cn(
                "w-full shadow-lg transition-all hover:shadow-xl",
                `bg-gradient-to-r ${getButtonGradient()} hover:opacity-90`
              )}
              disabled={!isActive}
            >
              {isActive ? "Join Challenge" : "Coming Soon"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
