"use client";

import { useState, useEffect } from "react";
import { Calculator, CreditCard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

// Mock data for settlement plan - replace with actual data
const mockSettlements = [
  { from: 'Alice', to: 'Bob', amount: 25.50 },
  { from: 'Charlie', to: 'David', amount: 10.00 },
  { from: 'Eve', to: 'Frank', amount: 5.75 },
];

interface SettleUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettleUpModal({ open, onClose }: SettleUpModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSendPlan = () => {
    toast.success("Success",{
      description: "Settlement plan saved! Members will be notified.",
    });
    onClose();
  };

  const ModalContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg border">
        <Calculator className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
        <h3 className="font-semibold mb-2">Optimal Settlement Plan</h3>
        <p className="text-sm text-muted-foreground">Minimum transactions to settle all balances</p>
      </div>
      
      <div className="space-y-3">
        {mockSettlements.map((settlement, index) => (
          <div key={index} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {settlement.from[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="font-medium text-sm sm:text-base truncate">{settlement.from}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">pays</span>
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-success/20 flex-shrink-0">
                  <AvatarFallback className="bg-success/10 text-success font-semibold text-sm">
                    {settlement.to[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm sm:text-base truncate">{settlement.to}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <span className="font-bold text-sm sm:text-lg">${settlement.amount.toFixed(2)}</span>
              <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground h-8 w-8 p-0">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total amount:</span>
          <span className="font-semibold">${mockSettlements.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Number of payments:</span>
          <span className="font-semibold">{mockSettlements.length}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose} className="order-2 sm:order-1">
          Close
        </Button>
        <Button onClick={handleSendPlan} className="order-1 sm:order-2">
          Send Settlement Plan
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-left px-0">
            <DrawerTitle>Settle Up</DrawerTitle>
          </DrawerHeader>
          <ModalContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Settle Up</DialogTitle>
        </DialogHeader>
        <ModalContent />
      </DialogContent>
    </Dialog>
  );
}
