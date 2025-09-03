"use client";

import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Crown } from "lucide-react";

interface Member {
  name: string;
  role?: string;
}

interface GroupCardProps {
  id: number;
  name: string;
  emoji: string;
  code: string;
  balance: number;
  memberCount: number;
  members: Member[];
  onClick: (id: number) => void;
  onSettleUp?: () => void;
}

const formatBalance = (balance: number) => {
  const absBalance = Math.abs(balance);
  const prefix = balance > 0 ? "+" : balance < 0 ? "-" : "";
  return `${prefix}$${absBalance.toFixed(2)}`;
};

export function GroupCard({ 
  id, 
  name, 
  emoji, 
  code, 
  balance, 
  memberCount, 
  members, 
  onClick, 
  onSettleUp 
}: GroupCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group"
      onClick={() => onClick(id)}
    >
      <CardHeader>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="text-3xl sm:text-4xl flex-shrink-0 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors duration-200">
              {name}
            </CardTitle>
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center text-muted-foreground text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
              </div>
              {/* {members.find(m => m.name === 'You')?.role === 'admin' && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )} */}
            </div>
          </div>
        </div>
        
        <CardAction>
          <Badge 
            variant={balance > 0 ? "default" : balance < 0 ? "destructive" : "secondary"} 
            className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 whitespace-nowrap"
          >
            {formatBalance(balance)}
          </Badge>
        </CardAction>
      </CardHeader>
      
      <CardContent>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 sm:h-9 text-xs sm:text-sm hover:bg-accent/50" 
            onClick={(e) => { e.stopPropagation(); onClick(id); }}
          >
            View Details
          </Button>
          <Button 
            variant={balance === 0 ? "secondary" : "default"}
            size="sm" 
            className="flex-1 h-8 sm:h-9 text-xs sm:text-sm" 
            onClick={(e) => { 
              e.stopPropagation(); 
              onSettleUp?.(); 
            }}
            disabled={balance === 0}
          >
            {balance === 0 ? 'Settled' : 'Settle Up'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
