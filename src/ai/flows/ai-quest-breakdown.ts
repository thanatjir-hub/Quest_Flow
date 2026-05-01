'use server';
/**
 * @fileOverview An AI Quest Planner agent that breaks down large tasks into smaller, manageable 'quests'.
 *
 * - aiQuestBreakdown - A function that handles the task breakdown process.
 * - AiQuestBreakdownInput - The input type for the aiQuestBreakdown function.
 * - AiQuestBreakdownOutput - The return type for the aiQuestBreakdown function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiQuestBreakdownInputSchema = z.object({
  largeTask: z.string().describe('A large, complex task that needs to be broken down into smaller quests.'),
});
export type AiQuestBreakdownInput = z.infer<typeof AiQuestBreakdownInputSchema>;

const AiQuestBreakdownOutputSchema = z.object({
  quests: z.array(z.string()).describe('An array of smaller, manageable quests derived from the large task.'),
});
export type AiQuestBreakdownOutput = z.infer<typeof AiQuestBreakdownOutputSchema>;

export async function aiQuestBreakdown(input: AiQuestBreakdownInput): Promise<AiQuestBreakdownOutput> {
  return aiQuestBreakdownFlow(input);
}

const aiQuestBreakdownPrompt = ai.definePrompt({
  name: 'aiQuestBreakdownPrompt',
  input: {schema: AiQuestBreakdownInputSchema},
  output: {schema: AiQuestBreakdownOutputSchema},
  prompt: `You are an AI Quest Planner. Your goal is to help users break down large, overwhelming tasks into smaller, manageable 'quests' that are easy to get started with and clearly define the next steps.

Break down the following large task into a list of concise, actionable quests. Each quest should be a distinct, achievable step towards completing the overall large task.

Large Task: {{{largeTask}}}`,
});

const aiQuestBreakdownFlow = ai.defineFlow(
  {
    name: 'aiQuestBreakdownFlow',
    inputSchema: AiQuestBreakdownInputSchema,
    outputSchema: AiQuestBreakdownOutputSchema,
  },
  async input => {
    const {output} = await aiQuestBreakdownPrompt(input);
    return output!;
  }
);
