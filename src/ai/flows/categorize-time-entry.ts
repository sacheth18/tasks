'use server';

/**
 * @fileOverview This flow automatically categorizes a time entry based on the recorded time.
 *
 * - categorizeTimeEntry - A function that categorizes a time entry.
 * - CategorizeTimeEntryInput - The input type for the categorizeTimeEntry function.
 * - CategorizeTimeEntryOutput - The return type for the categorizeTimeEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTimeEntryInputSchema = z.object({
  durationSeconds: z
    .number()
    .describe('The duration of the time entry in seconds.'),
  description: z.string().optional().describe('Optional description of the time entry.'),
});
export type CategorizeTimeEntryInput = z.infer<typeof CategorizeTimeEntryInputSchema>;

const CategorizeTimeEntryOutputSchema = z.object({
  category: z
    .string()
    .describe('The predicted category for the time entry (e.g., Python, Crypto Trading, Bing Watching).'),
  confidence: z
    .number()
    .describe('The confidence level of the category prediction (0 to 1).'),
});
export type CategorizeTimeEntryOutput = z.infer<typeof CategorizeTimeEntryOutputSchema>;

export async function categorizeTimeEntry(
  input: CategorizeTimeEntryInput
): Promise<CategorizeTimeEntryOutput> {
  return categorizeTimeEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTimeEntryPrompt',
  input: {schema: CategorizeTimeEntryInputSchema},
  output: {schema: CategorizeTimeEntryOutputSchema},
  prompt: `You are an AI assistant specializing in categorizing time entries based on their duration and description.

  Analyze the following time entry information and predict the most appropriate category.
  Categories can include: Python, Crypto Trading, Codeforces Problem Solving, Bing Watching, etc. Be creative and accurate.

  Consider both the duration and any provided description to make your determination.

  Duration: {{{durationSeconds}}} seconds
  Description: {{{description}}}

  Return the category and a confidence level (0 to 1) for your prediction.
  `,
});

const categorizeTimeEntryFlow = ai.defineFlow(
  {
    name: 'categorizeTimeEntryFlow',
    inputSchema: CategorizeTimeEntryInputSchema,
    outputSchema: CategorizeTimeEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
