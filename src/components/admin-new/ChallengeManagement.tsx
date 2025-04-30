import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  BarChart, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash,
  Copy,
  Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Sample data for demonstration
const challenges = [
  { 
    id: 1, 
    name: "Daily Forex Sprint", 
    type: "daily", 
    startDate: "2025-04-26", 
    endDate: "2025-04-27", 
    participants: 245, 
    status: "active",
    description: "A fast-paced 24-hour trading competition with a $10,000 starting balance.",
    initialBalance: 10000,
    maxDrawdown: 5,
    maxRiskPerTrade: 2,
    entryFee: 20,
    prizePool: 1200,
    rules: [
      "No hedging allowed",
      "No martingale strategies",
      "Minimum 3 trades to qualify",
      "Trades must remain open for at least 2 minutes"
    ]
  },
  { 
    id: 2, 
    name: "April Forex Marathon", 
    type: "monthly", 
    startDate: "2025-04-01", 
    endDate: "2025-04-30", 
    participants: 682, 
    status: "active",
    description: "Our premier 30-day trading challenge with a $100,000 starting balance and our biggest prize pool of $12,000 USDT!",
    initialBalance: 100000,
    maxDrawdown: 15,
    maxRiskPerTrade: 7,
    entryFee: 99,
    prizePool: 12000,
    rules: [
      "Minimum 15 trading days required",
      "No hedging allowed",
      "No martingale or high-risk averaging",
      "Minimum 20 trades to qualify",
      "Trades must remain open for at least 5 minutes",
      "Maximum of 5 simultaneous open positions"
    ]
  },
  { 
    id: 3, 
    name: "Weekend Forex Sprint", 
    type: "daily", 
    startDate: "2025-04-27", 
    endDate: "2025-04-28", 
    participants: 124, 
    status: "upcoming",
    description: "A weekend trading competition with a $25,000 starting balance.",
    initialBalance: 25000,
    maxDrawdown: 8,
    maxRiskPerTrade: 3,
    entryFee: 35,
    prizePool: 2500,
    rules: [
      "No hedging allowed",
      "No martingale strategies",
      "Minimum 5 trades to qualify",
      "Trades must remain open for at least 3 minutes"
    ]
  },
];

const ChallengeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [isChallengeDetailsOpen, setIsChallengeDetailsOpen] = useState(false);
  const [isAddChallengeOpen, setIsAddChallengeOpen] = useState(false);
  const [isEditChallengeOpen, setIsEditChallengeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Filter challenges based on search term and filters
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = 
      challenge.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || challenge.status === statusFilter;
    const matchesType = typeFilter === "all" || challenge.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewChallengeDetails = (challenge: any) => {
    setSelectedChallenge(challenge);
    setIsChallengeDetailsOpen(true);
  };

  const handleAddChallenge = () => {
    setIsAddChallengeOpen(true);
  };

  const handleEditChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setIsEditChallengeOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "daily":
        return <Badge className="bg-purple-100 text-purple-800">Daily</Badge>;
      case "weekly":
        return <Badge className="bg-indigo-100 text-indigo-800">Weekly</Badge>;
      case "monthly":
        return <Badge className="bg-blue-100 text-blue-800">Monthly</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Challenge Management</CardTitle>
            <CardDescription>Create, edit, and manage forex challenges</CardDescription>
          </div>
          <Button className="bg-forex-primary hover:bg-forex-primary/90" onClick={handleAddChallenge}>
            <Plus className="mr-2 h-4 w-4" />
            Create Challenge
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forex-neutral" />
              <Input
                type="search"
                placeholder="Search challenges..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChallenges.map((challenge) => (
                <TableRow key={challenge.id}>
                  <TableCell>{challenge.id}</TableCell>
                  <TableCell className="font-medium">{challenge.name}</TableCell>
                  <TableCell>{getTypeBadge(challenge.type)}</TableCell>
                  <TableCell>{challenge.startDate} - {challenge.endDate}</TableCell>
                  <TableCell>{challenge.participants}</TableCell>
                  <TableCell>{getStatusBadge(challenge.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewChallengeDetails(challenge)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditChallenge(challenge)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Challenge
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate Challenge
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {challenge.status === 'active' && (
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Challenge
                          </DropdownMenuItem>
                        )}
                        {challenge.status === 'upcoming' && (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate Challenge
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Challenge
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Challenge Details Dialog */}
      <Dialog open={isChallengeDetailsOpen} onOpenChange={setIsChallengeDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Challenge Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedChallenge?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedChallenge && (
            <div className="space-y-4 py-4">
              <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-forex-neutral">Challenge Name</h4>
                      <p className="text-lg">{selectedChallenge.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-forex-neutral">Type</h4>
                      <div className="mt-1">{getTypeBadge(selectedChallenge.type)}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-forex-neutral">Status</h4>
                      <div className="mt-1">{getStatusBadge(selectedChallenge.status)}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-forex-neutral">Period</h4>
                      <p className="text-lg">{selectedChallenge.startDate} - {selectedChallenge.endDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-forex-neutral">Initial Balance</h4>
                      <p className="text-lg">${selectedChallenge.initialBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-forex-neutral">Entry Fee</h4>
                      <p className="text-lg">${selectedChallenge.entryFee} USDT</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-forex-neutral">Prize Pool</h4>
                      <p className="text-lg">${selectedChallenge.prizePool.toLocaleString()} USDT</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-forex-neutral">Participants</h4>
                      <p className="text-lg">{selectedChallenge.participants}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-forex-neutral mb-2">Description</h4>
                    <p className="text-forex-dark">{selectedChallenge.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-forex-neutral mb-2">Rules</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedChallenge.rules.map((rule: string, index: number) => (
                        <li key={index} className="text-forex-dark">{rule}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="participants">
                  <div className="border rounded-md p-4 bg-forex-light/50">
                    <p className="text-center text-forex-neutral">Participants list will be displayed here</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="leaderboard">
                  <div className="border rounded-md p-4 bg-forex-light/50">
                    <p className="text-center text-forex-neutral">Leaderboard will be displayed here</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-disqualify">Auto-disqualify on rule violation</Label>
                        <p className="text-sm text-forex-neutral">Automatically disqualify users who violate challenge rules</p>
                      </div>
                      <Switch id="auto-disqualify" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Enable notifications</Label>
                        <p className="text-sm text-forex-neutral">Send notifications to participants about challenge updates</p>
                      </div>
                      <Switch id="notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="leaderboard">Show on public leaderboard</Label>
                        <p className="text-sm text-forex-neutral">Display this challenge on the public leaderboard</p>
                      </div>
                      <Switch id="leaderboard" defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChallengeDetailsOpen(false)}>Close</Button>
            <Button 
              className="bg-forex-primary hover:bg-forex-primary/90"
              onClick={() => {
                setIsChallengeDetailsOpen(false);
                setIsEditChallengeOpen(true);
              }}
            >
              Edit Challenge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Challenge Dialog */}
      <Dialog open={isAddChallengeOpen} onOpenChange={setIsAddChallengeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Challenge</DialogTitle>
            <DialogDescription>
              Set up a new trading challenge
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Challenge Name</label>
                <Input id="name" placeholder="Enter challenge name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Challenge Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
                <Input id="endDate" type="date" />
              </div>
              <div className="space-y-2">
                <label htmlFor="initialBalance" className="text-sm font-medium">Initial Balance ($)</label>
                <Input id="initialBalance" type="number" placeholder="10000" />
              </div>
              <div className="space-y-2">
                <label htmlFor="entryFee" className="text-sm font-medium">Entry Fee (USDT)</label>
                <Input id="entryFee" type="number" placeholder="20" />
              </div>
              <div className="space-y-2">
                <label htmlFor="maxDrawdown" className="text-sm font-medium">Max Drawdown (%)</label>
                <Input id="maxDrawdown" type="number" placeholder="5" />
              </div>
              <div className="space-y-2">
                <label htmlFor="maxRiskPerTrade" className="text-sm font-medium">Max Risk Per Trade (%)</label>
                <Input id="maxRiskPerTrade" type="number" placeholder="2" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" placeholder="Enter challenge description" rows={3} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rules</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Add a rule" />
                  <Button variant="outline" size="sm">Add</Button>
                </div>
                <div className="border rounded-md p-3 bg-forex-light/30">
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="text-forex-dark">No hedging allowed</li>
                    <li className="text-forex-dark">No martingale strategies</li>
                    <li className="text-forex-dark">Minimum 3 trades to qualify</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddChallengeOpen(false)}>Cancel</Button>
            <Button className="bg-forex-primary hover:bg-forex-primary/90">Create Challenge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Challenge Dialog */}
      <Dialog open={isEditChallengeOpen} onOpenChange={setIsEditChallengeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Challenge</DialogTitle>
            <DialogDescription>
              Modify challenge settings
            </DialogDescription>
          </DialogHeader>
          {selectedChallenge && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Challenge Name</label>
                  <Input id="edit-name" defaultValue={selectedChallenge.name} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-type" className="text-sm font-medium">Challenge Type</label>
                  <Select defaultValue={selectedChallenge.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-startDate" className="text-sm font-medium">Start Date</label>
                  <Input id="edit-startDate" type="date" defaultValue={selectedChallenge.startDate} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-endDate" className="text-sm font-medium">End Date</label>
                  <Input id="edit-endDate" type="date" defaultValue={selectedChallenge.endDate} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-initialBalance" className="text-sm font-medium">Initial Balance ($)</label>
                  <Input id="edit-initialBalance" type="number" defaultValue={selectedChallenge.initialBalance} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-entryFee" className="text-sm font-medium">Entry Fee (USDT)</label>
                  <Input id="edit-entryFee" type="number" defaultValue={selectedChallenge.entryFee} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-maxDrawdown" className="text-sm font-medium">Max Drawdown (%)</label>
                  <Input id="edit-maxDrawdown" type="number" defaultValue={selectedChallenge.maxDrawdown} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-maxRiskPerTrade" className="text-sm font-medium">Max Risk Per Trade (%)</label>
                  <Input id="edit-maxRiskPerTrade" type="number" defaultValue={selectedChallenge.maxRiskPerTrade} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                <Textarea id="edit-description" defaultValue={selectedChallenge.description} rows={3} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rules</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Add a rule" />
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                  <div className="border rounded-md p-3 bg-forex-light/30">
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedChallenge.rules.map((rule: string, index: number) => (
                        <li key={index} className="text-forex-dark">{rule}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditChallengeOpen(false)}>Cancel</Button>
            <Button className="bg-forex-primary hover:bg-forex-primary/90">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChallengeManagement; 