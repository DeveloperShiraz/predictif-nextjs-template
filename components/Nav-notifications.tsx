"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcons } from "@/components/Icons";
import { Badge } from "@/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/DropdownMenu";
import { Button } from "@/ui/Button";
import { cn } from "@/lib/utils";

interface NavNotificationsProps {
  className?: string;
}

interface ItemWithIconProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  timestamp?: string;
}

const ItemWithIcon = ({ icon, children, timestamp }: ItemWithIconProps) => (
  <div className="flex flex-col w-full">
    <div className="flex items-center gap-2">
      {icon}
      <span>{children}</span>
    </div>
    {timestamp && (
      <span className="text-xs text-muted-foreground ml-6">{timestamp}</span>
    )}
  </div>
);

export default function NavNotifications({ className }: NavNotificationsProps) {
  return (
    <div className={cn("relative", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MaterialIcons.NotificationsOutlined className="h-5 w-5" />
            <Badge
              variant="transparent"
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center mr-10"
            >
              5
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-96 max-h-[400px] overflow-y-auto bg-background border z-[9000]"
          align="end"
        >
          <DropdownMenuLabel className="bg-background">
            Notifications (5)
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="bg-background space-y-2 p-2">
            {" "}
            {/* Added space-y-2 and p-2 */}
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full text-left hover:bg-accent bg-background"
              >
                <ItemWithIcon
                  icon={
                    <MaterialIcons.Description className="h-4 w-4 text-green-500" />
                  }
                  timestamp="Just now"
                >
                  New quote #QT-2024-001 created for Acme Corp
                </ItemWithIcon>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full text-left hover:bg-accent bg-background"
              >
                <ItemWithIcon
                  icon={
                    <MaterialIcons.Pending className="h-4 w-4 text-yellow-500" />
                  }
                  timestamp="2 hours ago"
                >
                  Quote #QT-2024-015 pending customer review
                </ItemWithIcon>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full text-left hover:bg-accent bg-background"
              >
                <ItemWithIcon
                  icon={
                    <MaterialIcons.CheckCircle className="h-4 w-4 text-green-500" />
                  }
                  timestamp="5 hours ago"
                >
                  Quote #QT-2024-012 completed and approved
                </ItemWithIcon>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full text-left hover:bg-accent bg-background"
              >
                <ItemWithIcon
                  icon={
                    <MaterialIcons.Description className="h-4 w-4 text-blue-500" />
                  }
                  timestamp="Yesterday"
                >
                  New quote #QT-2024-008 created for TechCorp
                </ItemWithIcon>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                className="w-full text-left hover:bg-accent bg-background"
              >
                <ItemWithIcon
                  icon={
                    <MaterialIcons.CheckCircle className="h-4 w-4 text-green-500" />
                  }
                  timestamp="Yesterday"
                >
                  Quote #QT-2024-007 completed and delivered
                </ItemWithIcon>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="w-full text-center justify-center hover:bg-accent bg-background"
            >
              View all notifications
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
