"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <RefreshCw className={cn("h-6 w-6 animate-spin text-muted-foreground", className)} />
  );
}