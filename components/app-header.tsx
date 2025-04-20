"use client";

import { ModeToggle } from "./mode-toggle";
import { CircleDot } from "lucide-react";

export function AppHeader() {
  return (
    <header className="py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CircleDot className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Counter App</h1>
      </div>
      <ModeToggle />
    </header>
  );
}