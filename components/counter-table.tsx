"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";

type SortField = "name" | "value" | "last_updated" | "clicks_today";
type SortDirection = "asc" | "desc";

interface CounterTableProps {
  categories: Category[];
  selectedCategoryId: string | undefined;
  onSelect: (category: Category) => void;
}

export function CounterTable({ 
  categories, 
  selectedCategoryId,
  onSelect 
}: CounterTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "value":
        comparison = a.value - b.value;
        break;
      case "last_updated":
        comparison = new Date(a.last_updated).getTime() - new Date(b.last_updated).getTime();
        break;
      case "clicks_today":
        comparison = a.clicks_today - b.clicks_today;
        break;
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPp");
    } catch (error) {
      return "Invalid date";
    }
  };

  const selectCategory = (category: Category) => {
    onSelect(category);
  };

  if (categories.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counter Statistics</CardTitle>
        <CardDescription>
          View and manage all your counter categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 h-7 font-medium"
                  onClick={() => toggleSort("name")}
                >
                  Category
                  {sortField === "name" && (
                    sortDirection === "asc" ? 
                      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
                      <ChevronDown className="ml-1 h-4 w-4 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 h-7 font-medium"
                  onClick={() => toggleSort("value")}
                >
                  Value
                  {sortField === "value" && (
                    sortDirection === "asc" ? 
                      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
                      <ChevronDown className="ml-1 h-4 w-4 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="p-0 h-7 font-medium"
                  onClick={() => toggleSort("last_updated")}
                >
                  Last Updated
                  {sortField === "last_updated" && (
                    sortDirection === "asc" ? 
                      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
                      <ChevronDown className="ml-1 h-4 w-4 inline" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 h-7 font-medium"
                  onClick={() => toggleSort("clicks_today")}
                >
                  Today
                  {sortField === "clicks_today" && (
                    sortDirection === "asc" ? 
                      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
                      <ChevronDown className="ml-1 h-4 w-4 inline" />
                  )}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.map((category) => (
              <TableRow 
                key={category.id} 
                className={
                  category.id === selectedCategoryId 
                    ? "bg-muted/70 cursor-pointer" 
                    : "cursor-pointer hover:bg-muted/40"
                }
                onClick={() => selectCategory(category)}
              >
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge variant={category.value > 0 ? "default" : "outline"}>
                    {category.value}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {formatDate(category.last_updated)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {category.clicks_today > 0 ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                    )}
                    {category.clicks_today}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}