"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import type { Category, TimeEntry } from '@/lib/types';
import { useStopwatch, type UseStopwatchReturn } from '@/hooks/useStopwatch';
import { categorizeTimeEntry, type CategorizeTimeEntryOutput } from '@/ai/flows/categorize-time-entry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, Save, RotateCcw, Brain, Sparkles, AlertCircle } from 'lucide-react';
import TimeDisplay from './TimeDisplay';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface StopwatchProps {
  categories: Category[];
  onLogTime: (entry: Omit<TimeEntry, 'id' | 'loggedAt'>) => void;
}

const Stopwatch: FC<StopwatchProps> = ({ categories, onLogTime }) => {
  const { time, formattedTime, isRunning, startTimer, pauseTimer, resetTimer, setTime } = useStopwatch();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(categories[0]?.id);
  const [description, setDescription] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<CategorizeTimeEntryOutput | null>(null);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const handleSuggestCategory = async () => {
    if (time === 0) {
      toast({ title: "Timer not started", description: "Start the timer to get a suggestion.", variant: "destructive" });
      return;
    }
    setIsSuggesting(true);
    setAiError(null);
    setAiSuggestion(null);
    try {
      const suggestion = await categorizeTimeEntry({ durationSeconds: time, description });
      setAiSuggestion(suggestion);
      // Optionally auto-select suggested category if confidence is high
      // For now, just display it
      toast({ title: "Suggestion Ready!", description: `AI suggested: ${suggestion.category}`, variant: "default"});
    } catch (error) {
      console.error("AI suggestion error:", error);
      setAiError("Failed to get AI suggestion. Please try again.");
      toast({ title: "AI Suggestion Error", description: "Could not fetch category suggestion.", variant: "destructive" });
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const handleUseSuggestion = () => {
    if (aiSuggestion) {
      const suggestedCategory = categories.find(cat => cat.name.toLowerCase() === aiSuggestion.category.toLowerCase());
      if (suggestedCategory) {
        setSelectedCategoryId(suggestedCategory.id);
      } else {
        // If category doesn't exist, we could offer to create it or just inform the user
        toast({ title: "Category Not Found", description: `The suggested category "${aiSuggestion.category}" doesn't exist. Please create it or choose another.`, variant: "destructive" });
      }
      // Optionally populate description if AI provides one or modifies it
    }
  };

  const handleLogTime = () => {
    if (!selectedCategoryId) {
      toast({ title: "No Category Selected", description: "Please select a category to log time.", variant: "destructive" });
      return;
    }
    if (time === 0) {
       toast({ title: "Timer is empty", description: "Cannot log zero time.", variant: "destructive" });
      return;
    }
    const categoryName = categories.find(cat => cat.id === selectedCategoryId)?.name || 'Unknown Category';
    onLogTime({ categoryId: selectedCategoryId, categoryName, durationSeconds: time, description });
    resetTimer();
    setDescription('');
    setAiSuggestion(null);
    setAiError(null);
    toast({ title: "Time Logged!", description: `${formattedTime} for ${categoryName} saved.`, variant: "default", className: "bg-accent text-accent-foreground" });
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center"><Sparkles className="mr-2 h-6 w-6 text-primary" /> Task Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TimeDisplay formattedTime={formattedTime} className="text-primary" />

        <div className="space-y-2">
          <Label htmlFor="category-select">Category</Label>
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger id="category-select" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              )) : <SelectItem value="placeholder" disabled>No categories available</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description-input">Description (Optional)</Label>
          <Textarea
            id="description-input"
            placeholder="What are you working on specifically?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {!isRunning ? (
            <Button onClick={startTimer} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Play className="mr-2" /> Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} className="flex-1" variant="outline">
              <Pause className="mr-2" /> Pause
            </Button>
          )}
          <Button onClick={handleSuggestCategory} disabled={isSuggesting || isRunning} className="flex-1" variant="outline">
            <Brain className="mr-2" /> {isSuggesting ? 'Thinking...' : 'Suggest Category'}
          </Button>
        </div>

        {aiSuggestion && (
          <div className="p-3 bg-secondary rounded-md mt-2 text-sm shadow">
            <p><strong>AI Suggestion:</strong> {aiSuggestion.category} (Confidence: {(aiSuggestion.confidence * 100).toFixed(0)}%)</p>
            <Button onClick={handleUseSuggestion} size="sm" variant="link" className="p-0 h-auto text-primary">Use this suggestion</Button>
          </div>
        )}
        {aiError && (
          <p className="text-destructive text-sm mt-2 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {aiError}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
         <Button onClick={handleLogTime} disabled={isRunning || time === 0} className="flex-1">
            <Save className="mr-2" /> Log Time
          </Button>
        <Button onClick={() => { resetTimer(); setDescription(''); setAiSuggestion(null); setAiError(null); }} variant="destructive" className="flex-1">
          <RotateCcw className="mr-2" /> Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Stopwatch;
