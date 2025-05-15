"use client";

import type { FC } from 'react';
import type { TimeEntry } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface TimeLogTableProps {
  entries: TimeEntry[];
}

const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(' ');
};

const TimeLogTable: FC<TimeLogTableProps> = ({ entries }) => {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border shadow-sm">
      <Table>
        <TableCaption>{entries.length === 0 ? "No time logged yet." : "A list of your tracked time."}</TableCaption>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Logged At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length > 0 ? entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.categoryName}</TableCell>
              <TableCell>{formatDuration(entry.durationSeconds)}</TableCell>
              <TableCell className="max-w-[150px] truncate" title={entry.description}>{entry.description || '-'}</TableCell>
              <TableCell className="text-right">{format(new Date(entry.loggedAt), 'PPpp')}</TableCell>
            </TableRow>
          )) : (
             <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No entries to display. Start tracking your tasks!
                </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default TimeLogTable;
