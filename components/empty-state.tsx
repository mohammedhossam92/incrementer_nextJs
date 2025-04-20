"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CircleDot, Plus } from "lucide-react";

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <CircleDot className="h-10 w-10 text-primary" />
          </div>
        </motion.div>
        
        <h3 className="text-xl font-semibold mb-2">No Categories Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create your first category to start tracking counters. Use the form above to add a new category.
        </p>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-sm text-muted-foreground"
        >
          <Plus className="h-4 w-4 mr-1" />
          Start by adding a category above
        </motion.div>
      </CardContent>
    </Card>
  );
}