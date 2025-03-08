import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=child1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=child2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=child3",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=child4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=child5",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=child6",
];

interface AvatarSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

export function AvatarSelector({ open, onOpenChange, onSelect, currentAvatar }: AvatarSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose an Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 p-4">
          {AVATAR_OPTIONS.map((avatar, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-lg p-2 hover:bg-gray-100 ${
                currentAvatar === avatar ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                onSelect(avatar);
                onOpenChange(false);
              }}
            >
              <img
                src={avatar}
                alt={`Avatar option ${index + 1}`}
                className="w-20 h-20 rounded-full"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}