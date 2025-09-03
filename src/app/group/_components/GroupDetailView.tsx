"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, DollarSign, Receipt, ArrowLeft, Copy, Check, Settings, UserPlus, UserMinus, Crown } from "lucide-react";
import { toast } from "sonner";

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

export type Group = {
  id: number;
  name: string;
  emoji: string;
  memberCount: number;
  balance: number;
  code: string;
  members: Member[];
  expenses: Expense[];
};

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

interface GroupDetailProps {
  group: Group;
  onBack: () => void;
}

export function GroupDetail({ group, onBack }: GroupDetailProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const copyGroupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast("Group code copied to clipboard");
    setTimeout(() => setCopiedCode(false), 1500);
  };

  return (
    <div className="min-h-screen  bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container  flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-accent flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="text-2xl sm:text-3xl flex-shrink-0 p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                {group.emoji}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold truncate">{group.name}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyGroupCode(group.code)}
              className="hidden sm:flex h-8"
            >
              {copiedCode ? (
                <Check className="h-3 w-3 mr-1.5" />
              ) : (
                <Copy className="h-3 w-3 mr-1.5" />
              )}
              <span className="text-xs font-mono">{group.code}</span>
            </Button>
          </div>
        </div>
      </header>

  <main className="container mx-auto px-4 py-4 sm:py-6 max-w-6xl">
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-10 sm:h-11">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs sm:text-sm">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="members" className="text-xs sm:text-sm">
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-xl bg-card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Your Balance</h3>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className={`text-2xl sm:text-3xl font-bold ${getBalanceColor(group.balance)}`}>
                  {formatBalance(group.balance)}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {group.balance > 0 ? "You are owed" : group.balance < 0 ? "You owe" : "All settled"}
                </p>
              </div>

              <div className="border rounded-xl bg-card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold">
                  ${group.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {group.expenses.length} transaction{group.expenses.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="border rounded-xl bg-card p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Group Code</h3>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <code className="text-lg sm:text-xl font-mono font-bold bg-muted px-3 py-2 rounded-lg flex-1 text-center">
                    {group.code}
                  </code>
                  <Button variant="outline" size="sm" onClick={() => copyGroupCode(group.code)} className="flex-shrink-0">
                    {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">Share to invite members</p>
              </div>
            </div>

            <div className="border rounded-xl bg-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold">Recent Activity</h2>
                <Button variant="outline" size="sm">
                  Add Expense
                </Button>
              </div>

              {group.expenses.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <Receipt className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">No expenses yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start by adding your first group expense to track shared costs
                  </p>
                  <Button size="lg" className="w-full sm:w-auto">Add First Expense</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {group.expenses.slice(0, 3).map((expense) => (
                    <div key={expense.id} className="flex items-start sm:items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors duration-200 gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{expense.description}</h4>
                          <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Paid by {expense.paidBy} • {expense.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-lg">${expense.amount.toFixed(2)}</div>
                        <Badge variant={expense.settled ? "secondary" : "outline"} className="text-xs">
                          {expense.settled ? "Settled" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {group.expenses.length > 3 && (
                    <Button variant="ghost" className="w-full mt-4">View all {group.expenses.length} expenses</Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-xl sm:text-2xl font-bold">Group Expenses</h2>
              <Button className="w-full sm:w-auto">Add Expense</Button>
            </div>

            {group.expenses.length === 0 ? (
              <div className="border rounded-xl bg-card p-8 sm:p-12 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <Receipt className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3">No expenses recorded</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Start tracking your group expenses to split costs fairly among all members
                </p>
                <Button size="lg" className="w-full sm:w-auto">Add First Expense</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {group.expenses.map((expense) => (
                  <div key={expense.id} className="border rounded-xl bg-card p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-lg sm:text-xl font-semibold">{expense.description}</h3>
                          <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                          <Badge variant={expense.settled ? "secondary" : "outline"} className="text-xs">
                            {expense.settled ? "Settled" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 text-sm">Paid by {expense.paidBy} on {expense.date}</p>

                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Split breakdown:</h4>
                          <div className="grid gap-2">
                            {expense.splits.map((split, index) => {
                              const member = group.members.find((m) => m.id === split.userId);
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs">{member?.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">{member?.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">${split.amount.toFixed(2)}</span>
                                    <Badge variant={split.paid ? "secondary" : "outline"} className="text-xs">
                                      {split.paid ? "Paid" : "Pending"}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 justify-between sm:justify-start">
                        <div className="text-2xl sm:text-3xl font-bold">${expense.amount.toFixed(2)}</div>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-xl sm:text-2xl font-bold">Group Members</h2>
              <Button variant="outline" className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>

            <div className="grid gap-3 sm:gap-4">
              {group.members.map((member) => (
                <div key={member.id} className="border rounded-xl bg-card p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-primary/20 flex-shrink-0">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg sm:text-xl">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg sm:text-xl truncate">{member.name}</h3>
                        <p className="text-muted-foreground text-sm truncate">{member.email}</p>
                        <Badge variant={member.role === "admin" ? "default" : "secondary"} className="text-xs mt-1">
                          {member.role === "admin" ? (
                            <>
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            "Member"
                          )}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className={`font-bold text-lg ${getBalanceColor(member.balance)}`}>
                          {formatBalance(member.balance)}
                        </div>
                      </div>

                      {member.name !== "You" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive">
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remove from group
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
