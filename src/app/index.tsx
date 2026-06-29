import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Text } from '@/components/ui/text';
import { View } from "react-native";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function Index() {
  return (
    <View className="flex-1 bg-slate-700 rounded-xl items-center justify-center">
      <Text className="text-2xl font-medium">
        Welcome to Tailwind
      </Text>

      <Badge>
        <Text>Badge</Text>
      </Badge>


      <Separator />
      <Button>
        <Text>Button</Text>
      </Button>
      <Separator />

      <Checkbox checked={false} onCheckedChange={function (checked: boolean): void {
        throw new Error("Function not implemented.");
      }} />

      <Separator />
      <ContextMenu>
        <ContextMenuTrigger>
          <Text>Right click</Text>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Text>Profile</Text>
          </ContextMenuItem>
          <ContextMenuItem>
            <Text>Billing</Text>
          </ContextMenuItem>
          <ContextMenuItem>
            <Text>Team</Text>
          </ContextMenuItem>
          <ContextMenuItem>
            <Text>Subscription</Text>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Separator />

      <Dialog>
        <DialogTrigger>
          <Text>Open</Text>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data
              from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </View>
  );
}