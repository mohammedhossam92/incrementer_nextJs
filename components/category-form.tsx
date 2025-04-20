"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required").max(50),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  onCategoryAdded: () => void;
}

export function CategoryForm({ onCategoryAdded }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const today = new Date().toISOString();
    const todayDate = today.split("T")[0];
    
    try {
      // Check if category with this name already exists
      const { data: existingCategories } = await supabase
        .from("categories")
        .select("name")
        .eq("name", values.name);
      
      if (existingCategories && existingCategories.length > 0) {
        form.setError("name", { 
          type: "manual", 
          message: "A category with this name already exists" 
        });
        return;
      }
      
      const { error } = await supabase.from("categories").insert({
        name: values.name,
        value: 0,
        last_updated: today,
        clicks_today: 0,
        last_click_date: todayDate,
      });
      
      if (error) throw error;
      
      form.reset();
      onCategoryAdded();
    } catch (error: any) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input 
                  placeholder="New category name" 
                  {...field} 
                  className="h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </form>
    </Form>
  );
}