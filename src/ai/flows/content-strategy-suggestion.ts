'use server';

/**
 * @fileOverview A content strategy suggestion AI agent.
 *
 * - suggestContentStrategy - A function that suggests content strategy based on current trends.
 * - ContentStrategySuggestionInput - The input type for the suggestContentStrategy function.
 * - ContentStrategySuggestionOutput - The return type for the suggestContentStrategy function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getContentStrategy} from '@/services/content-strategy';

const ContentStrategySuggestionInputSchema = z.object({
  prompt: z.string().describe('The prompt for content strategy suggestion.'),
});
export type ContentStrategySuggestionInput = z.infer<
  typeof ContentStrategySuggestionInputSchema
>;

const ContentStrategySuggestionOutputSchema = z.object({
  trendingTopics: z.array(z.string()).describe('A list of trending topics.'),
  optimalFormats: z.array(z.string()).describe('A list of optimal content formats.'),
  suggestions: z
    .array(z.string())
    .describe('A list of content suggestions based on the prompt and trends.'),
});
export type ContentStrategySuggestionOutput = z.infer<
  typeof ContentStrategySuggestionOutputSchema
>;

/**
 * Suggests content strategy based on the provided input.
 *
 * @param {ContentStrategySuggestionInput} input - The input for content strategy suggestion.
 * @returns {Promise<ContentStrategySuggestionOutput>} - A promise that resolves to the content strategy suggestion output.
 */
export async function suggestContentStrategy(
  input: ContentStrategySuggestionInput
): Promise<ContentStrategySuggestionOutput> {
  return suggestContentStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentStrategySuggestionPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt for content strategy suggestion.'),
      trendingTopics: z.array(z.string()).describe('A list of trending topics.'),
      optimalFormats: z.array(z.string()).describe('A list of optimal content formats.'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z
        .array(z.string())
        .describe('A list of content suggestions based on the prompt and trends.'),
    }),
  },
  prompt: `You are an AI content strategist. Based on the following prompt, current trending topics, and optimal content formats, suggest content ideas.

Prompt: {{{prompt}}}
Trending Topics: {{#each trendingTopics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Optimal Formats: {{#each optimalFormats}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggestions:
`,
});

const suggestContentStrategyFlow = ai.defineFlow<
  typeof ContentStrategySuggestionInputSchema,
  typeof ContentStrategySuggestionOutputSchema
>(
  {
    name: 'suggestContentStrategyFlow',
    inputSchema: ContentStrategySuggestionInputSchema,
    outputSchema: ContentStrategySuggestionOutputSchema,
  },
  async input => {
    const contentStrategy = await getContentStrategy();
    const {output} = await prompt({
      ...input,
      trendingTopics: contentStrategy.trendingTopics,
      optimalFormats: contentStrategy.optimalFormats,
    });
    return {
      ...contentStrategy,
      suggestions: output!.suggestions,
    };
  }
);
