"use client";

import { useState, useEffect } from 'react';
import type { Category, TimeEntry } from '@/lib/types';
import Header from '@/components/layout/Header';
import AddCategoryForm from '@/components/categories/AddCategoryForm';
import CategoryList from '@/components/categories/CategoryList';
import Stopwatch from '@/components/timer/Stopwatch';
import TimeLogTable from '@/components/log/TimeLogTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from "@/components/ui/toaster";
import { ListChecks, History } from 'lucide-react';

const INITIAL_CATEGORIES_NAMES = ['Python Development', 'Crypto Trading', 'Codeforces Problems', 'Binge Watching', 'Client Meeting'];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load categories from localStorage or set initial ones
    const storedCategories = localStorage.getItem('trackstar-categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(INITIAL_CATEGORIES_NAMES.map(name => ({ id: crypto.randomUUID(), name })));
    }

    // Load time entries from localStorage
    const storedTimeEntries = localStorage.getItem('trackstar-timeEntries');
    if (storedTimeEntries) {
      setTimeEntries(JSON.parse(storedTimeEntries));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('trackstar-categories', JSON.stringify(categories));
    }
  }, [categories, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('trackstar-timeEntries', JSON.stringify(timeEntries));
    }
  }, [timeEntries, isClient]);


  const handleAddCategory = (name: string) => {
    const newCategory: Category = { id: crypto.randomUUID(), name };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    // Optional: Also handle time entries associated with this category (e.g., re-categorize or delete)
    // For simplicity, we'll leave them as is, but they might show "Unknown Category" if not handled.
  };

  const handleLogTime = (newEntryData: Omit<TimeEntry, 'id' | 'loggedAt'>) => {
    const newEntry: TimeEntry = {
      ...newEntryData,
      id: crypto.randomUUID(),
      loggedAt: new Date().toISOString(),
    };
    setTimeEntries((prev) => [newEntry, ...prev]); // Add new entries to the top
  };
  
  if (!isClient) {
    // Render a placeholder or null during server-side rendering/initial client render to avoid hydration mismatches
    // This is important because we use localStorage and crypto.randomUUID() in useEffect
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 text-center">
          <p className="text-lg text-muted-foreground">Loading TrackStar...</p>
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Section - takes up 2/3 on lg screens */}
          <div className="lg:col-span-2">
            <Stopwatch categories={categories} onLogTime={handleLogTime} />
          </div>

          {/* Categories and Log Section - takes up 1/3 on lg screens */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Manage Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <AddCategoryForm onAddCategory={handleAddCategory} />
                <CategoryList categories={categories} onDeleteCategory={handleDeleteCategory} />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><History className="mr-2 h-5 w-5 text-primary"/>Time Log</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeLogTable entries={timeEntries} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
