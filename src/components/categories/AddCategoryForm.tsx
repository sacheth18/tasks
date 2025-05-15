"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AddCategoryFormProps {
  onAddCategory: (name: string) => void;
}

const AddCategoryForm: FC<AddCategoryFormProps> = ({ onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim());
      setCategoryName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        placeholder="New category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" variant="outline">
        <PlusCircle className="mr-2 h-4 w-4" /> Add
      </Button>
    </form>
  );
};

export default AddCategoryForm;
