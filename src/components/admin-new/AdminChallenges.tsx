import { useState, useEffect } from "react";
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
import { CheckCircle, Edit, Eye, MessageSquare, Trash2, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api";

// Define Challenge type
interface Challenge {
  id: number;
  name: string;
  type: string;
  description: string;
  entryFee: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  status: string;
  participants?: number;
  initialBalance: number;
  maxDrawdown: number;
  createdAt?: string;
  updatedAt?: string;
}

const AdminChallenges = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for creating a new challenge
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    type: "daily",
    description: "",
    entryFee: 20,
    prizePool: 1200,
    startDate: "",
    endDate: "",
    initialBalance: 10000,
    maxDrawdown: 4,
    maxRiskPerTrade: 1,
    minTradeDuration: 2,
    allowHedging: false,
    allowMartingale: false,
    allowScalping: false,
    // Don't set status here, let the server determine it based on dates
  });

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/admin/challenges');
        const fetchedChallenges = response.data;

        // Add participant count if not present
        const challengesWithParticipants = fetchedChallenges.map((challenge: Challenge) => ({
          ...challenge,
          participants: challenge.participants || 0
        }));

        setChallenges(challengesWithParticipants);
        setFilteredChallenges(challengesWithParticipants);
      } catch (err: any) {
        console.error('Error fetching challenges:', err);
        setError(err.message || 'Failed to fetch challenges');
        // Use mock data if API fails
        const mockChallenges = [
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
          }
        ];
        setChallenges(mockChallenges);
        setFilteredChallenges(mockChallenges);
        toast({
          title: "Using Demo Data",
          description: "Could not connect to the server. Using demo data instead.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

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
  const handleViewChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsViewDialogOpen(true);
  };

  // Bulk operations
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);

  const handleSelectChallenge = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedChallenges([...selectedChallenges, id]);
    } else {
      setSelectedChallenges(selectedChallenges.filter(challengeId => challengeId !== id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedChallenges.length === 0) {
      toast({
        title: "No Challenges Selected",
        description: "Please select at least one challenge to perform this action.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Make API call to update challenges
      await Promise.all(
        selectedChallenges.map(id =>
          api.put(`/admin/challenges/${id}`, {
            status: action === "archive" ? "archived" : "cancelled"
          })
        )
      );

      // Update local state
      const updatedChallenges = challenges.map(challenge => {
        if (selectedChallenges.includes(challenge.id)) {
          return {
            ...challenge,
            status: action === "archive" ? "archived" : "cancelled"
          };
        }
        return challenge;
      });

      setChallenges(updatedChallenges);
      setFilteredChallenges(
        filter === "all"
          ? updatedChallenges
          : updatedChallenges.filter(c => c.status === filter)
      );

      toast({
        title: action === "archive" ? "Challenges Archived" : "Challenges Cancelled",
        description: `${selectedChallenges.length} challenges have been updated.`
      });
    } catch (err) {
      console.error(`Error performing bulk action (${action}):`, err);
      toast({
        title: "Action Failed",
        description: "There was an error updating the challenges. Please try again.",
        variant: "destructive"
      });
    }

    setSelectedChallenges([]);
  };

  // Handle input change for new challenge form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewChallenge({
      ...newChallenge,
      [id]: value
    });
  };

  // Handle select change for new challenge form
  const handleSelectChange = (id: string, value: string) => {
    setNewChallenge({
      ...newChallenge,
      [id]: value
    });
  };

  // Create new challenge
  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create a copy of the challenge data for submission
      const startDate = new Date(newChallenge.startDate);
      const endDate = new Date(newChallenge.endDate);
      const currentDate = new Date();

      // Determine status based on dates
      const status = currentDate >= startDate ? 'active' : 'upcoming';

      const challengeData = {
        ...newChallenge,
        // Ensure dates are in the correct format
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        // Explicitly set the status based on dates
        status: status
      };

      console.log('Submitting challenge data:', challengeData);

      const response = await api.post('/admin/challenges', challengeData);
      const createdChallenge = response.data;

      // Add to local state
      const updatedChallenges = [...challenges, createdChallenge];
      setChallenges(updatedChallenges);

      // Update filtered challenges if needed
      if (filter === "all" || filter === createdChallenge.status) {
        setFilteredChallenges([...filteredChallenges, createdChallenge]);
      }

      toast({
        title: "Challenge Created",
        description: "New challenge has been created successfully."
      });

      // Reset form
      setNewChallenge({
        name: "",
        type: "daily",
        description: "",
        entryFee: 20,
        prizePool: 1200,
        startDate: "",
        endDate: "",
        initialBalance: 10000,
        maxDrawdown: 4,
        maxRiskPerTrade: 1,
        minTradeDuration: 2,
        allowHedging: false,
        allowMartingale: false,
        allowScalping: false
      });

      setIsCreateDialogOpen(false);
    } catch (err: any) {
      console.error('Error creating challenge:', err);

      // Extract more detailed error message if available
      const errorMessage = err.response?.data?.message ||
                          "There was an error creating the challenge. Please try again.";

      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Delete challenge
  const handleDeleteChallenge = async (id: number) => {
    try {
      await api.delete(`/admin/challenges/${id}`);

      // Update local state
      const updatedChallenges = challenges.filter(challenge => challenge.id !== id);
      setChallenges(updatedChallenges);
      setFilteredChallenges(filteredChallenges.filter(challenge => challenge.id !== id));

      toast({
        title: "Challenge Deleted",
        description: "The challenge has been deleted successfully."
      });
    } catch (err) {
      console.error('Error deleting challenge:', err);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting the challenge. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Verification feature
  const [verificationSettings, setVerificationSettings] = useState({
    manualApproval: false,
    autoDisqualification: true,
    tradingRuleEnforcement: "strict" // "strict", "moderate", or "lenient"
  });

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

          {selectedChallenges.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-forex-border/20 text-white hover:bg-forex-card"
                onClick={() => handleBulkAction("archive")}
              >
                Archive Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-forex-border/20 text-white hover:bg-forex-card"
                onClick={() => handleBulkAction("cancel")}
              >
                Cancel Selected
              </Button>
            </div>
          )}

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
                    <Input
                      id="name"
                      placeholder="Daily Sprint Challenge"
                      className="bg-forex-dark/60 border-forex-border/20 text-white"
                      value={newChallenge.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-white">Challenge Type</Label>
                    <Select
                      value={newChallenge.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
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
                  <Textarea
                    id="description"
                    placeholder="A fast-paced 24-hour challenge..."
                    className="min-h-[100px] bg-forex-dark/60 border-forex-border/20 text-white"
                    value={newChallenge.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-white">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      className="bg-forex-dark/60 border-forex-border/20 text-white"
                      value={newChallenge.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-white">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      className="bg-forex-dark/60 border-forex-border/20 text-white"
                      value={newChallenge.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialBalance" className="text-white">Initial Balance ($)</Label>
                    <Input
                      id="initialBalance"
                      type="number"
                      className="bg-forex-dark/60 border-forex-border/20 text-white"
                      value={newChallenge.initialBalance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxDrawdown" className="text-white">Max Drawdown (%)</Label>
                    <Input
                      id="maxDrawdown"
                      type="number"
                      className="bg-forex-dark/60 border-forex-border/20 text-white"
                      value={newChallenge.maxDrawdown}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entryFee" className="text-white">Entry Fee (USDT)</Label>
                    <Input
                      id="entryFee"
                      type="number"
                      className="bg-forex-dark/60 border-forex-border/20 text-white"
                      value={newChallenge.entryFee}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prizePool" className="text-white">Prize Pool (USDT)</Label>
                    <Input
                      id="prizePool"
                      type="number"
                      className="bg-forex-dark/60 border-forex-border/20 text-white"
                      value={newChallenge.prizePool}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="pt-4 border-t border-forex-border/20">
                  <h4 className="text-white font-medium mb-3">Verification & Rules</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="manual_approval" className="text-white">
                        Require Manual Approval
                        <span className="block text-xs text-white/60">
                          Manually review and approve winning trades
                        </span>
                      </Label>
                      <Switch
                        id="manual_approval"
                        checked={verificationSettings.manualApproval}
                        onCheckedChange={(checked) =>
                          setVerificationSettings({...verificationSettings, manualApproval: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto_disqualification" className="text-white">
                        Auto-Disqualification
                        <span className="block text-xs text-white/60">
                          Automatically disqualify on rule violations
                        </span>
                      </Label>
                      <Switch
                        id="auto_disqualification"
                        checked={verificationSettings.autoDisqualification}
                        onCheckedChange={(checked) =>
                          setVerificationSettings({...verificationSettings, autoDisqualification: checked})
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trading_rule_enforcement" className="text-white">
                        Trading Rule Enforcement
                      </Label>
                      <Select
                        value={verificationSettings.tradingRuleEnforcement}
                        onValueChange={(value) =>
                          setVerificationSettings({...verificationSettings, tradingRuleEnforcement: value})
                        }
                      >
                        <SelectTrigger
                          id="trading_rule_enforcement"
                          className="bg-forex-dark/60 border-forex-border/20 text-white"
                        >
                          <SelectValue placeholder="Select enforcement level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strict">Strict (Zero tolerance)</SelectItem>
                          <SelectItem value="moderate">Moderate (Some flexibility)</SelectItem>
                          <SelectItem value="lenient">Lenient (Only major violations)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-forex-primary animate-spin" />
          <span className="ml-2 text-white">Loading challenges...</span>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 text-center">
          <p className="text-red-400">{error}</p>
          <Button
            variant="outline"
            className="mt-2 border-forex-border/20 text-white hover:bg-forex-card"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader className="bg-forex-card/50">
            <TableRow>
              <TableHead className="w-12 text-white">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded bg-forex-dark/60 border-forex-border/20"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChallenges(filteredChallenges.map(c => c.id));
                      } else {
                        setSelectedChallenges([]);
                      }
                    }}
                    checked={selectedChallenges.length === filteredChallenges.length && filteredChallenges.length > 0}
                  />
                </div>
              </TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Entry Fee</TableHead>
              <TableHead className="text-white">Prize Pool</TableHead>
              <TableHead className="text-white">Period</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Participants</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChallenges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-white/60">
                  No challenges found. Create your first challenge to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredChallenges.map((challenge) => (
                <TableRow key={challenge.id} className="border-forex-border/10 bg-forex-dark/30">
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded bg-forex-dark/60 border-forex-border/20"
                      checked={selectedChallenges.includes(challenge.id)}
                      onChange={(e) => handleSelectChallenge(challenge.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white">{challenge.name}</TableCell>
                  <TableCell className="text-white/70 capitalize">{challenge.type}</TableCell>
                  <TableCell className="text-white/70">${challenge.entryFee}</TableCell>
                  <TableCell className="text-white/70">${challenge.prizePool}</TableCell>
                  <TableCell className="text-white/70">
                    {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`
                        ${challenge.status === "active" ? "bg-green-400/20 text-green-400" : ""}
                        ${challenge.status === "upcoming" ? "bg-blue-400/20 text-blue-400" : ""}
                        ${challenge.status === "completed" ? "bg-gray-400/20 text-gray-400" : ""}
                        ${challenge.status === "archived" ? "bg-yellow-400/20 text-yellow-400" : ""}
                        ${challenge.status === "cancelled" ? "bg-red-400/20 text-red-400" : ""}
                      `}
                    >
                      {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/70">{challenge.participants}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleViewChallenge(challenge)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => {
                          // Edit functionality would go here
                          toast({
                            title: "Edit Feature",
                            description: "Challenge editing will be implemented in the next update."
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => handleDeleteChallenge(challenge.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-forex-dark/50"
                        onClick={() => {
                          // Messaging functionality would go here
                          toast({
                            title: "Message Feature",
                            description: "Messaging participants will be implemented in the next update."
                          });
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* View Challenge Dialog */}
      {selectedChallenge && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[550px] bg-forex-card text-white border-forex-border/20">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedChallenge.name}</DialogTitle>
              <DialogDescription className="text-white/60">
                {selectedChallenge.description}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-white/70">Challenge Type</h4>
                  <p className="text-white capitalize">{selectedChallenge.type}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70">Status</h4>
                  <Badge
                    className={`
                      ${selectedChallenge.status === "active" ? "bg-green-400/20 text-green-400" : ""}
                      ${selectedChallenge.status === "upcoming" ? "bg-blue-400/20 text-blue-400" : ""}
                      ${selectedChallenge.status === "completed" ? "bg-gray-400/20 text-gray-400" : ""}
                    `}
                  >
                    {selectedChallenge.status.charAt(0).toUpperCase() + selectedChallenge.status.slice(1)}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70">Period</h4>
                  <p className="text-white">
                    {new Date(selectedChallenge.startDate).toLocaleDateString()} - {new Date(selectedChallenge.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70">Participants</h4>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-forex-primary" />
                    <p className="text-white">{selectedChallenge.participants}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-white/70">Entry Fee</h4>
                  <p className="text-white">${selectedChallenge.entryFee}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70">Prize Pool</h4>
                  <p className="text-white">${selectedChallenge.prizePool}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70">Initial Balance</h4>
                  <p className="text-white">${selectedChallenge.initialBalance}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70">Max Drawdown</h4>
                  <p className="text-white">{selectedChallenge.maxDrawdown}%</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-forex-border/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Verification Status</h4>
                <Badge className="bg-green-400/20 text-green-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-forex-primary hover:bg-forex-primary/90 text-white">
                  View Leaderboard
                </Button>

                <Button variant="outline" className="border-forex-border/20 text-white hover:bg-forex-card">
                  Manage Participants
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminChallenges;