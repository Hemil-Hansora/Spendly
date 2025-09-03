"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { joinGroupSchema } from "@/lib/schemas";

type JoinGroupForm = z.infer<typeof joinGroupSchema>;

interface JoinGroupModalProps {
  open: boolean;
  onClose: () => void;
  onJoinGroup?: (data: JoinGroupForm) => void;
}

export function JoinGroupModal({ open, onClose, onJoinGroup }: JoinGroupModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  const form = useForm<JoinGroupForm>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: { code: "" },
  });

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleJoinGroup = (data: JoinGroupForm) => {
    console.log("Joining group:", data);
    onJoinGroup?.(data);
    onClose();
    form.reset();
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const groupCode = form.watch('code') || '';

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-left px-0">
            <DrawerTitle>Join Group</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={form.handleSubmit(handleJoinGroup)} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group-code-mobile" className="text-sm font-medium">Group Code *</Label>
              <Input
                id="group-code-mobile"
                placeholder="Enter 6-character code"
                {...form.register('code', {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                    form.setValue('code', e.target.value);
                  }
                })}
                maxLength={6}
                className="text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-primary"
                autoComplete="off"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Ask a group member for the 6-character code</p>
                {form.formState.errors.code && (
                  <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Joining a group</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• You'll see all group expenses and balances</li>
                <li>• You can add expenses and split bills</li>
                <li>• Only admins can remove members</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose} 
                className="order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={groupCode.length !== 6 || form.formState.isSubmitting} 
                className="order-1 sm:order-2"
              >
                {form.formState.isSubmitting ? 'Joining...' : 'Join Group'}
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleJoinGroup)} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="group-code-desktop" className="text-sm font-medium">Group Code *</Label>
            <Input
              id="group-code-desktop"
              placeholder="Enter 6-character code"
              {...form.register('code', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                  form.setValue('code', e.target.value);
                }
              })}
              maxLength={6}
              className="text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-primary"
              autoComplete="off"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Ask a group member for the 6-character code</p>
              {form.formState.errors.code && (
                <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Joining a group</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• You'll see all group expenses and balances</li>
              <li>• You can add expenses and split bills</li>
              <li>• Only admins can remove members</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={groupCode.length !== 6 || form.formState.isSubmitting} 
              className="order-1 sm:order-2"
            >
              {form.formState.isSubmitting ? 'Joining...' : 'Join Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
