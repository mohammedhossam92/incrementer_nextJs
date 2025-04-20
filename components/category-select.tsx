"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategorySelectProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelect: (category: Category) => void;
  onDelete: () => void;
}

export function CategorySelect({
  categories,
  selectedCategory,
  onSelect,
  onDelete,
}: CategorySelectProps) {
  const handleSelect = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      onSelect(category);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Category</CardTitle>
        <CardDescription>
          Choose a category to view and manage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex-1">
            <Select
              value={selectedCategory?.id || ""}
              onValueChange={handleSelect}
              disabled={categories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                disabled={!selectedCategory}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {selectedCategory?.name} and all of its data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {selectedCategory && (
          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-1">Current Value</div>
            <div className="text-3xl font-bold tracking-tight">
              {selectedCategory.value}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}