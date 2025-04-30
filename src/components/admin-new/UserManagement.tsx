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
  UserPlus, 
  Mail, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

// Sample data for demonstration
const users = [
  { 
    id: 1, 
    username: "TradeMaster92", 
    email: "trader1@example.com", 
    challenge: "Daily Forex Sprint", 
    profit: 8.42, 
    drawdown: 1.2, 
    status: "active",
    joinDate: "2025-04-15",
    lastLogin: "2025-04-28 14:32",
    accountType: "premium"
  },
  { 
    id: 2, 
    username: "ForexKing", 
    email: "trader2@example.com", 
    challenge: "April Forex Marathon", 
    profit: 6.75, 
    drawdown: 2.1, 
    status: "active",
    joinDate: "2025-04-10",
    lastLogin: "2025-04-28 12:15",
    accountType: "standard"
  },
  { 
    id: 3, 
    username: "PipHunter", 
    email: "trader3@example.com", 
    challenge: "Daily Forex Sprint", 
    profit: 5.28, 
    drawdown: 3.4, 
    status: "active",
    joinDate: "2025-04-18",
    lastLogin: "2025-04-28 09:47",
    accountType: "premium"
  },
  { 
    id: 4, 
    username: "TrendFollower", 
    email: "trader4@example.com", 
    challenge: "April Forex Marathon", 
    profit: 4.12, 
    drawdown: 2.7, 
    status: "active",
    joinDate: "2025-04-12",
    lastLogin: "2025-04-28 08:32",
    accountType: "standard"
  },
  { 
    id: 5, 
    username: "PatternTrader", 
    email: "trader5@example.com", 
    challenge: "Daily Forex Sprint", 
    profit: -1.28, 
    drawdown: 5.6, 
    status: "disqualified",
    joinDate: "2025-04-20",
    lastLogin: "2025-04-27 16:45",
    accountType: "standard"
  },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [challengeFilter, setChallengeFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesChallenge = challengeFilter === "all" || user.challenge === challengeFilter;
    
    return matchesSearch && matchesStatus && matchesChallenge;
  });

  const handleViewUserDetails = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "disqualified":
        return <Badge className="bg-red-100 text-red-800">Disqualified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case "premium":
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      case "standard":
        return <Badge className="bg-blue-100 text-blue-800">Standard</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage users participating in challenges</CardDescription>
          </div>
          <Button className="bg-forex-primary hover:bg-forex-primary/90" onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-forex-neutral" />
              <Input
                type="search"
                placeholder="Search users..."
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
                  <SelectItem value="disqualified">Disqualified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={challengeFilter} onValueChange={setChallengeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Challenge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Challenges</SelectItem>
                  <SelectItem value="Daily Forex Sprint">Daily Forex Sprint</SelectItem>
                  <SelectItem value="April Forex Marathon">April Forex Marathon</SelectItem>
                  <SelectItem value="Weekend Forex Sprint">Weekend Forex Sprint</SelectItem>
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
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Challenge</TableHead>
                <TableHead>P/L (%)</TableHead>
                <TableHead>Drawdown (%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.challenge}</TableCell>
                  <TableCell className={user.profit >= 0 ? "text-forex-profit" : "text-forex-loss"}>
                    {user.profit.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-forex-loss">{user.drawdown.toFixed(1)}%</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getAccountTypeBadge(user.accountType)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Lock className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === 'active' && (
                          <DropdownMenuItem className="text-red-600">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Disqualify User
                          </DropdownMenuItem>
                        )}
                        {user.status === 'disqualified' && (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Reactivate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Username</h4>
                  <p className="text-lg">{selectedUser.username}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Email</h4>
                  <p className="text-lg">{selectedUser.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Account Type</h4>
                  <div className="mt-1">{getAccountTypeBadge(selectedUser.accountType)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Join Date</h4>
                  <p className="text-lg">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Last Login</h4>
                  <p className="text-lg">{selectedUser.lastLogin}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Current Challenge</h4>
                  <p className="text-lg">{selectedUser.challenge}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-forex-neutral">Performance</h4>
                  <p className="text-lg">
                    <span className={selectedUser.profit >= 0 ? "text-forex-profit" : "text-forex-loss"}>
                      {selectedUser.profit.toFixed(2)}%
                    </span> P/L, 
                    <span className="text-forex-loss"> {selectedUser.drawdown.toFixed(1)}%</span> Drawdown
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium text-forex-neutral mb-2">Trading History</h4>
                <div className="border rounded-md p-4 bg-forex-light/50">
                  <p className="text-center text-forex-neutral">Trading history will be displayed here</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDetailsOpen(false)}>Close</Button>
            <Button className="bg-forex-primary hover:bg-forex-primary/90">Edit User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input id="username" placeholder="Enter username" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input id="password" type="password" placeholder="Enter password" />
            </div>
            <div className="space-y-2">
              <label htmlFor="accountType" className="text-sm font-medium">Account Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="challenge" className="text-sm font-medium">Assign to Challenge</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select challenge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Forex Sprint</SelectItem>
                  <SelectItem value="monthly">April Forex Marathon</SelectItem>
                  <SelectItem value="weekend">Weekend Forex Sprint</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
            <Button className="bg-forex-primary hover:bg-forex-primary/90">Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 