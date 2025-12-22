"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

type StyleVariant = "default" | "style_2" | "style_3" | undefined;

const tabsListVariants = cva(
  "inline-flex h-9 items-center justify-center rounded-lg ",
  {
    variants: {
      style: {
        default: "w-full my-3",
        style_2: "w-full",
        style_3: "w-full",
      },
    },
    defaultVariants: {
      style: "default",
    },
  }
);

const tabsTriggerVariants = cva("", {
  variants: {
    style: {
      default: "w-full",
      style_2: "w-full",
      style_3: "w-full",
    },
  },
  defaultVariants: {
    style: "default",
  },
});

const tabsContentVariants = cva("", {
  variants: {
    style: {
      default: "w-full ",
      style_2: "w-full",
      style_3: "w-full",
    },
  },
  defaultVariants: {
    style: "default",
  },
});

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    style?: StyleVariant;
  }
>(({ className, style, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg p-1 text-white dark:text-black",
      tabsListVariants({ style, className })
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    style?: StyleVariant;
  }
>(({ className, style, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center z-0 justify-center mx-[.9px] whitespace-nowrap rounded-md bg-zinc-800 dark:bg-zinc-200 px-3 py-1 text-sm font-medium transition-all disabled:pointer-events-none data-[state=active]:bg-[#7ecdcd] dark:data-[state=active]:bg-[#2e8a94] data-[state=active]:text-black dark:text-black text-white dark:data-[state=active]:text-white",
      tabsTriggerVariants({ style, className })
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
    style?: StyleVariant;
  }
>(({ style, className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      tabsContentVariants({ style, className })
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

// "use client";

// import * as React from "react";
// import * as TabsPrimitive from "@radix-ui/react-tabs";

// import { cn } from "@/lib/utils";
// import { cva, VariantProps } from "class-variance-authority";

// const Tabs = TabsPrimitive.Root;

// const tabsTriggerVariants = cva(
//   "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
//   {
//     variants: {
//       style: {
//         default: "",
//         style_2: "",
//         style_3: "",
//       },
//     },
//     defaultVariants: {
//       style: "default",
//     },
//   }
// );

// const TabsList = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.List>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.List
//     ref={ref}
//     className={cn(
//       "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
//       className
//     )}
//     {...props}
//   />
// ));
// TabsList.displayName = TabsPrimitive.List.displayName;

// const TabsTrigger = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Trigger>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
//     VariantProps<typeof tabsTriggerVariants> // Add VariantProps here
// >(({ className, style, ...props }, ref) => (
//   <TabsPrimitive.Trigger
//     ref={ref}
//     className={cn(
//       "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
//       // Apply the variant styles
//       tabsTriggerVariants({ style, className })
//     )}
//     {...props}
//   />
// ));
// TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// const TabsContent = React.forwardRef<
//   React.ElementRef<typeof TabsPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
// >(({ className, ...props }, ref) => (
//   <TabsPrimitive.Content
//     ref={ref}
//     className={cn(
//       "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
//       className
//     )}
//     {...props}
//   />
// ));
// TabsContent.displayName = TabsPrimitive.Content.displayName;

// export { Tabs, TabsList, TabsTrigger, TabsContent };
