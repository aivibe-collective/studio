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
  content: z.string().min(10, { message: "Content must be at least 10 characters" }).describe('The content to be checked for quality and mission alignment.'),
  missionStatement: z.string().min(10, { message: "Mission statement must be at least 10 characters" }).describe('The overarching mission statement that the content should align with.'),
  qualityMetrics: z.string().min(10, { message: "Quality metrics must be at least 10 characters" }).describe('The metrics used to measure the content quality.'),
});
export type QualityAssuranceCheckInput = z.infer<typeof QualityAssuranceCheckInputSchema>;

const QualityAssuranceCheckOutputSchema = z.object({
  missionAlignmentScore: z.number().min(0).max(1).describe('A score indicating the degree of alignment with the mission statement (0-1).'),
  qualityScore: z.number().min(0).max(1).describe('An overall quality score based on the defined metrics (0-1).'),
  validationFeedback: z.string().describe('Detailed feedback on the content, including areas for improvement and validation results.'),
  detailedMetrics: z.record(z.string(), z.number()).describe('Breakdown of scores for individual quality metrics'),
});
export type QualityAssuranceCheckOutput = z.infer<typeof QualityAssuranceCheckOutputSchema>;

/**
 * Checks the quality and mission alignment of the provided content.
 *
 * @param {QualityAssuranceCheckInput} input - The input for the quality assurance check.
 * @returns {Promise<QualityAssuranceCheckOutput>} - A promise that resolves to the quality assurance check output.
  * @throws {Error} - Throws an error if the quality assurance check fails.
 */
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
      detailedMetrics: z.record(z.string(), z.number()).describe('Breakdown of scores for individual quality metrics'),
    }),
  },
  prompt: `You are an AI content quality assurance expert.
You will check the provided content for alignment with the given mission statement and measure its quality based on the defined metrics.

Consider the following detailed metrics when assessing the quality:
- Grammar: Assessed on clarity, correctness and writing style.
- Relevance: Assessed on how accurately the content matches the topic.
- Clarity: Assessed on understandability by the intended audience.
- Engagement: Assessed on the features to capture and hold the audience attention.
- Usefulness: Assessed on the quality of being useful.
Content: {{{content}}}
Mission Statement: {{{missionStatement}}}
Quality Metrics: {{{qualityMetrics}}}
Provide a missionAlignmentScore (0-1), a qualityScore (0-1), detailed validationFeedback, and a detailedMetrics object that includes the scores of Grammar, Relevance, Clarity, Engagement, and Usefulness (0-1).
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
  try {
    const {output} = await prompt(input);

     if (!output) {
        throw new Error('Quality assurance check failed: No output received from the AI model.');
      }

    // Basic validation to ensure scores are within acceptable range
    if (output.missionAlignmentScore < 0 || output.missionAlignmentScore > 1 ||
        output.qualityScore < 0 || output.qualityScore > 1) {
      throw new Error('Quality assurance check failed: Scores are out of range.');
    }
    return output;
  } catch (error) {
    console.error('Error in qualityAssuranceCheckFlow:', error);
    if (error instanceof z.ZodError) {
      throw new Error(`Validation Error: ${error.message}`);
    }
    throw new Error('Failed to perform quality assurance check. Please try again.');
  }
});
