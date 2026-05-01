'use server';
/**
 * @fileOverview An AI agent that turns boring task names into epic game-style quest titles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiEpicNamingInputSchema = z.object({
  taskTitle: z.string().describe('The original, simple name of the task.'),
});
export type AiEpicNamingInput = z.infer<typeof AiEpicNamingInputSchema>;

const AiEpicNamingOutputSchema = z.object({
  epicTitle: z.string().describe('The new, epic game-style quest title.'),
});
export type AiEpicNamingOutput = z.infer<typeof AiEpicNamingOutputSchema>;

export async function aiEpicNaming(input: AiEpicNamingInput): Promise<AiEpicNamingOutput> {
  return aiEpicNamingFlow(input);
}

const aiEpicNamingPrompt = ai.definePrompt({
  name: 'aiEpicNamingPrompt',
  input: {schema: AiEpicNamingInputSchema},
  output: {schema: AiEpicNamingOutputSchema},
  prompt: `You are a creative Game Master. Your job is to take a simple, mundane task and rename it to sound like an epic quest from an RPG game. 
Keep it concise (no more than 5-7 words) and in Thai language.

Original Task: {{{taskTitle}}}`,
});

const aiEpicNamingFlow = ai.defineFlow(
  {
    name: 'aiEpicNamingFlow',
    inputSchema: AiEpicNamingInputSchema,
    outputSchema: AiEpicNamingOutputSchema,
  },
  async input => {
    const {output} = await aiEpicNamingPrompt(input);
    return output!;
  }
);
