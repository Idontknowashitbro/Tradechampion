import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Edit, Eye, MessageSquare, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Mock data for challenges
const challenges = [
  {
    id: 1,
    name: "Daily Forex Sprint",
    type: "daily",
    description: "A fast-paced 24-hour challenge with a $10,000 starting balance.",
    entryFee: 20,
    prizePool: 1200,
    startDate: "2025-05-01",
    endDate: "2025-05-02",
    status: "active",
    participants: 32,
    initialBalance: 10000,
    maxDrawdown: 4
  },
  {
    id: 2,
    name: "Weekly Forex Master",
    type: "weekly",
    description: "A 7-day trading competition with a $50,000 starting balance.",
    entryFee: 50,
    prizePool: 4500,
    startDate: "2025-05-03",
    endDate: "2025-05-10",
    status: "upcoming",
    participants: 0,
    initialBalance: 50000,
    maxDrawdown: 8
  },
  {
    id: 3,
    name: "May Monthly Championship",
    type: "monthly",
    description: "Our premier 30-day trading challenge with a $100,000 starting balance.",
    entryFee: 99,
    prizePool: 12000,
    startDate: "2025-05-01",
    endDate: "2025-05-31",
    status: "active",
    participants: 47,
    initialBalance: 100000,
    maxDrawdown: 10
  },
  {
    id: 4,
    name: "April Monthly Championship",
    type: "monthly",
    description: "Our premier 30-day trading challenge with a $100,000 starting balance.",
    entryFee: 99,
    prizePool: 12000,
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    status: "completed",
    participants: 78,
    initialBalance: 100000,
    maxDrawdown: 10
  }
];

const AdminChallenges = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [filteredChallenges, setFilteredChallenges] = useState(challenges);
  const [filter, setFilter] = useState("all");
  
  // Filter challenges by status
  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (value === "all") {
      setFilteredChallenges(challenges);
    } else {
      setFilteredChallenges(challenges.filter(challenge => challenge.status === value));
    }
  };
  
  // View challenge details
  const handleViewChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setIsViewDialogOpen(true);
  };
  
  // Create new challenge
  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would submit the form data to your API
    toast({
      title: "Challenge Created",
      description: "New challenge has been created successfully."
    });
    
    setIsCreateDialogOpen(false);
  };
  
  // Delete challenge
  const handleDeleteChallenge = (id: number) => {
    // In a real application, you would make an API call to delete the challenge
    setFilteredChallenges(filteredChallenges.filter(challenge => challenge.id !== id));
    
    toast({
      title: "Challenge Deleted",
      description: "The challenge has been deleted successfully."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Challenges</h2>
        
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px] bg-forex-card/50 text-white border-forex-border/20">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Challenges</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-forex-primary hover:bg-forex-primary/90 text-white">
                Create Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-forex-card text-white border-forex-border/20">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Challenge</DialogTitle>
                <DialogDescription className="text-white/60">
                  Set up a new trading challenge with custom parameters.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateChallenge} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Challenge Name</Label>
                    <Input id="name" placeholder="Daily Sprint Challenge" className="bg-forex-dark/60 border-forex-border/20 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-white">Challenge Type</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="bg-forex-dark/60 border-forex-border/20 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea id="description" placeholder="A fast-paced 24-hour challenge..." className="min-h-[100px] bg-forex-dark/60 border-forex-border/20 text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-white">Start Date</Label>
                    <Input id="start_date" type="date" className="bg-forex-dark/60 border-forex-border/20 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-white">End Date</Label>
                    <Input id="end_date" type="date" className="bg-forex-dark/60 border-forex-border/20 text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initial_balance" className="text-white">Initial Balance ($)</Label>
                    <Input id="initial_balance" type="number" defaultValue="10000" className="bg-forex-dark/60 border-forex-border/20 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_drawdown" className="text-white">Max Drawdown (%)</Label>
                    <Input id="max_drawdown" type="number" defaultValue="4" className="bg-forex-dark/60 border-forex-border/20 text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entry_fee" className="text-white">Entry Fee (USDT)</Label>
                    <Input id="entry_fee" type="number" defaultValue="20" className="bg-forex-dark/60 border-forex-border/20 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prize_pool" className="text-white">Prize Pool (USDT)</Label>
                    <Input id="prize_pool" type="number" defaultValue="1200" className="bg-forex-dark/60 border-forex-border/20 text-white" />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-forex-primary hover:bg-forex-primary/90 text-white">
                    Create Challenge
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Table>
        <TableHeader className="bg-forex-card/50">
          <TableRow>
            <TableHead className="text-white">ID</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white text-right">Entry Fee</TableHead>
            <TableHead className="text-white text-right">Prize Pool</TableHead>
            <TableHead className="text-white text-center">Period</TableHead>
            <TableHead className="text-white text-center">Status</TableHead>
            <TableHead className="text-white text-center">Participants</TableHead>
            <TableHead className="text-white text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredChallenges.map((challenge) => (
            <TableRow key={challenge.id} className="hover:bg-forex-card/30 border-forex-border/10">
              <TableCell className="text-white">{challenge.id}</TableCell>
              <TableCell className="text-white font-medium">{challenge.name}</TableCell>
              <TableCell className="text-white capitalize">{challenge.type}</TableCell>
              <TableCell className="text-white text-right">${challenge.entryFee}</TableCell>
              <TableCell className="text-white text-right">${challenge.prizePool}</TableCell>
              <TableCell className="text-white text-center">
                {challenge.startDate} to {challenge.endDate}
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                  variant={
                    challenge.status === "active" ? "default" : 
                    challenge.status === "upcoming" ? "secondary" :
                    "outline"
                  }
                  className="capitalize"
                >
                  {challenge.status}
                </Badge>
              </TableCell>
              <TableCell className="text-white text-center">{challenge.participants}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-forex-primary/20"
                    onClick={() => handleViewChallenge(challenge)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-forex-primary/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-red-500/20"
                    onClick={() => handleDeleteChallenge(challenge.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* View Challenge Dialog */}
      {selectedChallenge && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedChallenge.name}</DialogTitle>
              <DialogDescription className="text-white/60">
                {selectedChallenge.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h4 className="text-sm text-white/60 mb-1">Challenge Type</h4>
                <p className="text-white capitalize">{selectedChallenge.type}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Status</h4>
                <Badge 
                  variant={
                    selectedChallenge.status === "active" ? "default" : 
                    selectedChallenge.status === "upcoming" ? "secondary" :
                    "outline"
                  }
                  className="capitalize"
                >
                  {selectedChallenge.status}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Start Date</h4>
                <p className="text-white">{selectedChallenge.startDate}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">End Date</h4>
                <p className="text-white">{selectedChallenge.endDate}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Entry Fee</h4>
                <p className="text-white">${selectedChallenge.entryFee}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Prize Pool</h4>
                <p className="text-white">${selectedChallenge.prizePool}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Initial Balance</h4>
                <p className="text-white">${selectedChallenge.initialBalance}</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Max Drawdown</h4>
                <p className="text-white">{selectedChallenge.maxDrawdown}%</p>
              </div>
              <div>
                <h4 className="text-sm text-white/60 mb-1">Participants</h4>
                <p className="text-white">{selectedChallenge.participants}</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="border-forex-border/20 text-white"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              
              {selectedChallenge.status === "active" && (
                <div className="space-x-2">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                  <Button className="bg-forex-primary hover:bg-forex-primary/90 text-white">
                    <Users className="h-4 w-4 mr-2" />
                    View Participants
                  </Button>
                </div>
              )}
              
              {selectedChallenge.status === "upcoming" && (
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate Challenge
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminChallenges; 