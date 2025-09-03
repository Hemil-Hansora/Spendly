"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  DollarSign,
  Settings,
  Crown,
  UserPlus,
  UserMinus,
  Receipt,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { GroupCard } from "./_components/GroupCard";
import { GroupDetail } from "./_components/GroupDetailView";
import { CreateGroupModal } from "./_components/modals/CreateGroupModal";
import { JoinGroupModal } from "./_components/modals/JoinGroupModal";
import { SettleUpModal } from "./_components/modals/SettleUpModal";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar: string;
  balance: number;
};

type Split = { userId: string; amount: number; paid: boolean };

type Expense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  settled: boolean;
  category: string;
  splits: Split[];
};

type Group = {
  id: number;
  name: string;
  emoji: string;
  memberCount: number;
  balance: number;
  code: string;
  members: Member[];
  expenses: Expense[];
};

const mockGroups: Group[] = [
  {
    id: 1,
    name: "Roommates",
    emoji: "🏠",
    memberCount: 4,
    balance: -45.5,
    code: "ABC123",
    members: [
      { id: "1", name: "You", email: "you@example.com", role: "admin", avatar: "", balance: -45.5 },
      { id: "2", name: "Alex", email: "alex@example.com", role: "member", avatar: "", balance: 15.25 },
      { id: "3", name: "Sam", email: "sam@example.com", role: "member", avatar: "", balance: 20 },
      { id: "4", name: "Jordan", email: "jordan@example.com", role: "member", avatar: "", balance: 10.25 },
    ],
    expenses: [
      {
        id: "1",
        description: "Groceries",
        amount: 120,
        paidBy: "Alex",
        date: "2024-01-15",
        settled: false,
        category: "Food",
        splits: [
          { userId: "1", amount: 30, paid: false },
          { userId: "2", amount: 30, paid: true },
          { userId: "3", amount: 30, paid: false },
          { userId: "4", amount: 30, paid: false },
        ],
      },
      {
        id: "2",
        description: "Utilities",
        amount: 200,
        paidBy: "You",
        date: "2024-01-10",
        settled: true,
        category: "Bills",
        splits: [
          { userId: "1", amount: 50, paid: true },
          { userId: "2", amount: 50, paid: true },
          { userId: "3", amount: 50, paid: true },
          { userId: "4", amount: 50, paid: true },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Trip to NYC",
    emoji: "🗽",
    memberCount: 3,
    balance: 123.75,
    code: "NYC456",
    members: [
      { id: "1", name: "You", email: "you@example.com", role: "admin", avatar: "", balance: 123.75 },
      { id: "5", name: "Chris", email: "chris@example.com", role: "member", avatar: "", balance: -30.5 },
      { id: "6", name: "Taylor", email: "taylor@example.com", role: "member", avatar: "", balance: -93.25 },
    ],
    expenses: [
      {
        id: "3",
        description: "Hotel",
        amount: 480,
        paidBy: "You",
        date: "2024-01-20",
        settled: false,
        category: "Lodging",
        splits: [
          { userId: "1", amount: 160, paid: true },
          { userId: "5", amount: 160, paid: false },
          { userId: "6", amount: 160, paid: false },
        ],
      },
      {
        id: "4",
        description: "Dinner",
        amount: 156,
        paidBy: "Chris",
        date: "2024-01-21",
        settled: false,
        category: "Food",
        splits: [
          { userId: "1", amount: 52, paid: false },
          { userId: "5", amount: 52, paid: true },
          { userId: "6", amount: 52, paid: false },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Office Lunch Club",
    emoji: "🍽️",
    memberCount: 1,
    balance: 0,
    code: "LUNCH7",
    members: [{ id: "1", name: "You", email: "you@example.com", role: "member", avatar: "", balance: 0 }],
    expenses: [],
  },
];

const formatBalance = (balance: number) => {
  if (balance === 0) return "Settled";
  const prefix = balance > 0 ? "+" : "";
  return `${prefix}$${balance.toFixed(2)}`;
};

const getBalanceColor = (balance: number) => {
  if (balance > 0) return "text-success";
  if (balance < 0) return "text-destructive";
  return "text-muted-foreground";
};

export default function Groups() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState("all");
  const [filterBalance, setFilterBalance] = useState("all");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const filteredGroups = useMemo(() => {
    return mockGroups.filter((group) => {
      const matchesSearch = group.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole =
        filterRole === "all" ||
        (filterRole === "admin" &&
          group.members.find((m) => m.name === "You")?.role === "admin");
      const matchesBalance =
        filterBalance === "all" ||
        (filterBalance === "owed" && group.balance > 0) ||
        (filterBalance === "owing" && group.balance < 0) ||
        (filterBalance === "settled" && group.balance === 0);

      return matchesSearch && matchesRole && matchesBalance;
    });
  }, [searchQuery, filterRole, filterBalance]);

  const selectedGroupData = selectedGroup
    ? mockGroups.find((g) => g.id === selectedGroup) || null
    : null;

  const copyGroupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast("Group code copied to clipboard");
    setTimeout(() => setCopiedCode(false), 1500);
  };

  // Detail view
  if (selectedGroupData) {
    return <GroupDetail group={selectedGroupData} onBack={() => setSelectedGroup(null)} />;
  }

  // Groups list
  return (
    <div className="min-h-screen bg-background">
      {/* <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold">Groups</h1>
          </div>
          <div className="flex items-center gap-2" />
        </div>
      </header> */}

      <main className="container px-4 py-4 sm:py-6 ">
        <div className="mb-6 space-y-4 ">
          <div className="flex flex-col lg:flex-row gap-4 justify-between ">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 focus:ring-2 focus:ring-primary border-border/50 bg-background/50"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowCreateGroup(true)} className="flex-1 sm:flex-none h-10 px-4">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Group</span>
                <span className="sm:hidden">Create</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowJoinGroup(true)}
                className="flex-1 sm:flex-none h-10 px-4"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Join Group</span>
                <span className="sm:hidden">Join</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-28 sm:w-32 h-9 text-sm">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBalance} onValueChange={setFilterBalance}>
              <SelectTrigger className="w-32 sm:w-36 h-9 text-sm">
                <SelectValue placeholder="Balance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Balances</SelectItem>
                <SelectItem value="owed">You're Owed</SelectItem>
                <SelectItem value="owing">You Owe</SelectItem>
                <SelectItem value="settled">Settled</SelectItem>
              </SelectContent>
            </Select>

            {(searchQuery || filterRole !== "all" || filterBalance !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterRole("all");
                  setFilterBalance("all");
                }}
                className="h-9 px-3 text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            {searchQuery || filterRole !== "all" || filterBalance !== "all" ? (
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <Search className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3">No groups found</h3>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your search terms or filters to find the groups you're looking for
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterRole("all");
                    setFilterBalance("all");
                  }}
                  className="w-full sm:w-auto"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">Welcome to Groups</h3>
                <p className="text-muted-foreground mb-8 text-sm sm:text-base">
                  Create your first group to start splitting expenses with friends, family, or roommates
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={() => setShowCreateGroup(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Group
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowJoinGroup(true)}
                    className="w-full sm:w-auto"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Existing Group
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                emoji={group.emoji}
                code={group.code}
                balance={group.balance}
                memberCount={group.memberCount}
                members={group.members.map((m) => ({ name: m.name, role: m.role }))}
                onClick={(id) => setSelectedGroup(id)}
                onSettleUp={() => setShowSettleUp(true)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreateGroup={(data) => {
          toast.success(`Group "${data.name}" created`);
          setShowCreateGroup(false);
        }}
      />
      <JoinGroupModal
        open={showJoinGroup}
        onClose={() => setShowJoinGroup(false)}
        onJoinGroup={(data) => {
          toast.success("Successfully joined the group!");
          setShowJoinGroup(false);
        }}
      />
      <SettleUpModal open={showSettleUp} onClose={() => setShowSettleUp(false)} />
    </div>
  );
}
