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

// Enhanced schema for group creation with emoji
const createGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(50, "Group name must be 50 characters or less"),
  emoji: z.string().min(1, "Please select a group icon"),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreateGroup?: (data: CreateGroupForm) => void;
}

export function CreateGroupModal({ open, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("💰");

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { 
      name: "", 
      emoji: "💰" 
    },
  });

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update form emoji value when selectedEmoji changes
  useEffect(() => {
    form.setValue('emoji', selectedEmoji);
  }, [selectedEmoji, form]);

  const handleCreateGroup = (data: CreateGroupForm) => {
    console.log("Creating group:", data);
    onCreateGroup?.(data);
    onClose();
    form.reset();
    setSelectedEmoji("💰");
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setSelectedEmoji("💰");
  };

  const emojiOptions = ['💰', '🏠', '🍽️', '✈️', '🎉', '🏖️', '🚗', '🎬', '🎯', '🎸', '📚', '🏃'];

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-left px-0">
            <DrawerTitle>Create New Group</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={form.handleSubmit(handleCreateGroup)} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group-name-mobile" className="text-sm font-medium">Group Name *</Label>
              <Input
                id="group-name-mobile"
                placeholder="e.g., Trip to Paris, Roommates"
                {...form.register('name')}
                className="focus:ring-2 focus:ring-primary"
                maxLength={50}
                autoComplete="off"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">{form.watch('name')?.length || 0}/50 characters</p>
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Choose Group Icon</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {emojiOptions.map(emoji => (
                  <Button
                    key={emoji}
                    type="button"
                    variant={selectedEmoji === emoji ? "default" : "outline"}
                    size="sm"
                    className="text-xl sm:text-2xl h-10 sm:h-12 w-10 sm:w-12 p-0"
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
              {form.formState.errors.emoji && (
                <p className="text-xs text-destructive">{form.formState.errors.emoji.message}</p>
              )}
            </div>

            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">What happens next?</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• You'll be the group admin</li>
                <li>• Invite members using the group code</li>
                <li>• Start adding and splitting expenses</li>
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
                disabled={!form.watch('name')?.trim() || form.formState.isSubmitting} 
                className="order-1 sm:order-2"
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Create Group'}
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
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleCreateGroup)} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="group-name-desktop" className="text-sm font-medium">Group Name *</Label>
            <Input
              id="group-name-desktop"
              placeholder="e.g., Trip to Paris, Roommates"
              {...form.register('name')}
              className="focus:ring-2 focus:ring-primary"
              maxLength={50}
              autoComplete="off"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">{form.watch('name')?.length || 0}/50 characters</p>
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Group Icon</Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {emojiOptions.map(emoji => (
                <Button
                  key={emoji}
                  type="button"
                  variant={selectedEmoji === emoji ? "default" : "outline"}
                  size="sm"
                  className="text-xl sm:text-2xl h-10 sm:h-12 w-10 sm:w-12 p-0"
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            {form.formState.errors.emoji && (
              <p className="text-xs text-destructive">{form.formState.errors.emoji.message}</p>
            )}
          </div>

          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">What happens next?</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• You'll be the group admin</li>
              <li>• Invite members using the group code</li>
              <li>• Start adding and splitting expenses</li>
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
              disabled={!form.watch('name')?.trim() || form.formState.isSubmitting} 
              className="order-1 sm:order-2"
            >
              {form.formState.isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
