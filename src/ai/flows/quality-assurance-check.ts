// Use server directive is required to run Genkit flows in Next.js
'use server';

/**
 * @fileOverview Implements a Genkit flow for automated content quality assurance.
 *
 * - qualityAssuranceCheck - A function that initiates the quality assurance check.
 * - QualityAssuranceCheckInput - The input type for the qualityAssuranceCheck function.
 * - QualityAssuranceCheckOutput - The return type for the qualityAssuranceCheck function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const QualityAssuranceCheckInputSchema = z.object({
  content: z.string().describe('The content to be checked for quality and mission alignment.'),
  missionStatement: z.string().describe('The overarching mission statement that the content should align with.'),
  qualityMetrics: z.string().describe('The metrics used to measure the content quality.'),
});
export type QualityAssuranceCheckInput = z.infer<typeof QualityAssuranceCheckInputSchema>;

const QualityAssuranceCheckOutputSchema = z.object({
  missionAlignmentScore: z.number().describe('A score indicating the degree of alignment with the mission statement (0-1).'),
  qualityScore: z.number().describe('An overall quality score based on the defined metrics (0-1).'),
  validationFeedback: z.string().describe('Detailed feedback on the content, including areas for improvement and validation results.'),
});
export type QualityAssuranceCheckOutput = z.infer<typeof QualityAssuranceCheckOutputSchema>;

export async function qualityAssuranceCheck(input: QualityAssuranceCheckInput): Promise<QualityAssuranceCheckOutput> {
  return qualityAssuranceCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'qualityAssuranceCheckPrompt',
  input: {
    schema: z.object({
      content: z.string().describe('The content to be checked for quality and mission alignment.'),
      missionStatement: z.string().describe('The overarching mission statement that the content should align with.'),
      qualityMetrics: z.string().describe('The metrics used to measure the content quality.'),
    }),
  },
  output: {
    schema: z.object({
      missionAlignmentScore: z.number().describe('A score indicating the degree of alignment with the mission statement (0-1).'),
      qualityScore: z.number().describe('An overall quality score based on the defined metrics (0-1).'),
      validationFeedback: z.string().describe('Detailed feedback on the content, including areas for improvement and validation results.'),
    }),
  },
  prompt: `You are an AI content quality assurance expert.

You will check the provided content for alignment with the given mission statement and measure its quality based on the defined metrics.

Content: {{{content}}}

Mission Statement: {{{missionStatement}}}

Quality Metrics: {{{qualityMetrics}}}

Provide a missionAlignmentScore (0-1), a qualityScore (0-1), and detailed validationFeedback.
`,
});

const qualityAssuranceCheckFlow = ai.defineFlow<
  typeof QualityAssuranceCheckInputSchema,
  typeof QualityAssuranceCheckOutputSchema
>({
  name: 'qualityAssuranceCheckFlow',
  inputSchema: QualityAssuranceCheckInputSchema,
  outputSchema: QualityAssuranceCheckOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
