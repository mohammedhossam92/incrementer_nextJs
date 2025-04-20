"use client";

import { useState, useEffect } from "react";
import { CategoryForm } from "./category-form";
import { CounterControls } from "./counter-controls";
import { CounterTable } from "./counter-table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AppHeader } from "./app-header";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CategorySelect } from "./category-select";
import { LoadingSpinner } from "./loading-spinner";
import { AnimatePresence, motion } from "framer-motion";

export function CounterDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    checkForNewDay();
    // Set up real-time subscription to categories
    const channel = supabase
      .channel('categories-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'categories'
      }, handleCategoryChange)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCategoryChange = async (payload: any) => {
    // Refresh the data when a change is detected
    await fetchCategories();
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      setCategories(data || []);

      // Set first category as selected if we have categories and none is selected
      if (data && data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0]);
      } else if (selectedCategory) {
        // Keep the same category selected but with updated data
        const updatedSelectedCategory = data?.find(cat => cat.id === selectedCategory.id);
        if (updatedSelectedCategory) {
          setSelectedCategory(updatedSelectedCategory);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNewDay = async () => {
    const today = new Date().toISOString().split('T')[0];

    try {
      const { data } = await supabase
        .from('categories')
        .select('id, last_click_date');

      if (data) {
        for (const category of data) {
          if (category.last_click_date !== today) {
            await supabase
              .from('categories')
              .update({
                clicks_today: 0,
                last_click_date: today
              })
              .eq('id', category.id);
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new day:', error);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleCategoryAdded = () => {
    fetchCategories();
    toast({
      title: "Category added",
      description: "The new category has been created successfully."
    });
  };

  const handleCategoryDeleted = async () => {
    if (!selectedCategory) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', selectedCategory.id);

      if (error) throw error;

      toast({
        title: "Category deleted",
        description: `${selectedCategory.name} has been deleted.`
      });

      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Calculate statistics
  const totalClicks = categories.reduce((sum, cat) => sum + cat.clicks_today, 0);
  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0);
  const avgValue = categories.length > 0 ? totalValue / categories.length : 0;
  const mostActiveCategory = categories.reduce((prev, current) =>
    (current.clicks_today > (prev?.clicks_today || 0)) ? current : prev,
    categories[0]
  );

  return (
    <div className="container max-w-6xl mx-auto space-y-6">
      <AppHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardContent className="p-6">
              <CategoryForm onCategoryAdded={handleCategoryAdded} />
            </CardContent>
          </Card>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center my-12"
              >
                <LoadingSpinner />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CounterTable
                  categories={categories}
                  selectedCategoryId={selectedCategory?.id}
                  onSelect={handleCategorySelect}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <CategorySelect
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
            onDelete={handleCategoryDeleted}
          />

          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CounterControls
                category={selectedCategory}
                onUpdate={fetchCategories}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      {/* <Card className="mt-8">
        <CardHeader>
          <CardTitle>Counter Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="text-sm text-muted-foreground">Total Categories</div>
              <div className="text-2xl font-bold mt-1">{categories.length}</div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="text-sm text-muted-foreground">Total Clicks Today</div>
              <div className="text-2xl font-bold mt-1">{totalClicks}</div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="text-sm text-muted-foreground">Average Value</div>
              <div className="text-2xl font-bold mt-1">{avgValue.toFixed(1)}</div>
            </div>
            <div className="p-4 rounded-lg bg-primary/5">
              <div className="text-sm text-muted-foreground">Most Active Category</div>
              <div className="text-2xl font-bold mt-1">{mostActiveCategory?.name || "N/A"}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {mostActiveCategory ? `${mostActiveCategory.clicks_today} clicks` : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
