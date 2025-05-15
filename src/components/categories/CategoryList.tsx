"use client";

import type { FC } from 'react';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryListProps {
  categories: Category[];
  onDeleteCategory: (id: string) => void;
}

const CategoryList: FC<CategoryListProps> = ({ categories, onDeleteCategory }) => {
  if (categories.length === 0) {
    return <p className="text-muted-foreground text-sm">No categories yet. Add some to get started!</p>;
  }

  return (
    <ScrollArea className="h-[150px] pr-3">
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between p-2 bg-secondary rounded-md shadow-sm"
          >
            <span className="text-secondary-foreground">{category.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteCategory(category.id)}
              aria-label={`Delete category ${category.name}`}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

export default CategoryList;
