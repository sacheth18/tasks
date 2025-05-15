export interface Category {
  id: string;
  name: string;
}

export interface TimeEntry {
  id: string;
  categoryId: string;
  categoryName: string;
  durationSeconds: number;
  description?: string;
  loggedAt: string; // Store as ISO string for easier handling
}
