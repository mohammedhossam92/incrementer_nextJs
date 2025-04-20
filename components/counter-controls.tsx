"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  RefreshCw, 
  PlusIcon, 
  MinusIcon, 
  RotateCcw 
} from "lucide-react";

interface CounterControlsProps {
  category: Category;
  onUpdate: () => void;
}

export function CounterControls({ category, onUpdate }: CounterControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateCounter = async (valueChange: number) => {
    if (!category) return;
    
    setIsUpdating(true);
    const now = new Date().toISOString();
    const today = now.split("T")[0];
    
    try {
      // First, get the latest value to ensure we're working with the most up-to-date data
      const { data: currentData, error: fetchError } = await supabase
        .from("categories")
        .select("value, clicks_today, last_click_date")
        .eq("id", category.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Calculate new values
      const newValue = currentData.value + valueChange;
      let newClicksToday = currentData.clicks_today;
      
      // Only increment clicks_today if this is an increment operation
      if (valueChange > 0) {
        newClicksToday = currentData.last_click_date === today 
          ? currentData.clicks_today + 1 
          : 1;
      }
      
      // Update the database
      const { error: updateError } = await supabase
        .from("categories")
        .update({
          value: newValue,
          last_updated: now,
          clicks_today: newClicksToday,
          last_click_date: today,
        })
        .eq("id", category.id);
      
      if (updateError) throw updateError;
      
      // Update the UI
      onUpdate();
      
      // Show a subtle toast for feedback
      toast({
        title: valueChange > 0 ? "Incremented" : "Decremented",
        description: `${category.name} is now ${newValue}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating counter",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const resetCounter = async () => {
    if (!category) return;
    
    setIsUpdating(true);
    const now = new Date().toISOString();
    const today = now.split("T")[0];
    
    try {
      const { error } = await supabase
        .from("categories")
        .update({
          value: 0,
          last_updated: now,
          clicks_today: 0,
          last_click_date: today,
        })
        .eq("id", category.id);
      
      if (error) throw error;
      
      onUpdate();
      toast({
        title: "Counter reset",
        description: `${category.name} has been reset to 0`,
      });
    } catch (error: any) {
      toast({
        title: "Error resetting counter",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counter Controls</CardTitle>
        <CardDescription>
          Adjust the value for {category.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button 
          className="h-16" 
          onClick={() => updateCounter(1)}
          disabled={isUpdating}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Increment +1
        </Button>
        <Button 
          className="h-16" 
          onClick={() => updateCounter(0.5)}
          disabled={isUpdating}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add +0.5
        </Button>
        <Button 
          className="h-16" 
          variant="outline" 
          onClick={() => updateCounter(-1)}
          disabled={isUpdating || category.value <= 0}
        >
          <MinusIcon className="mr-2 h-4 w-4" />
          Decrement -1
        </Button>
        <Button 
          className="h-16" 
          variant="outline" 
          onClick={() => updateCounter(-0.5)}
          disabled={isUpdating || category.value <= 0}
        >
          <MinusIcon className="mr-2 h-4 w-4" />
          Subtract -0.5
        </Button>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={resetCounter}
          disabled={isUpdating}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Counter
        </Button>
      </CardFooter>
    </Card>
  );
}