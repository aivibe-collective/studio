// src/ai/flows/generate-learning-activity.ts
'use server';

/**
 * @fileOverview AI-powered interactive learning activity generator.
 *
 * - generateLearningActivity - A function that generates interactive learning activities.
 * - GenerateLearningActivityInput - The input type for the generateLearningActivity function.
 * - GenerateLearningActivityOutput - The return type for the generateLearningActivity function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateLearningActivityInputSchema = z.object({
  topic: z.string().describe('The topic of the learning activity.'),
  learningObjectives: z.string().describe('The learning objectives of the activity.'),
  targetAudience: z.string().describe('The target audience for the activity (e.g., grade level).'),
  previousActivities: z.string().optional().describe('A list of the learning activities already undertaken by the learner.'),
});
export type GenerateLearningActivityInput = z.infer<typeof GenerateLearningActivityInputSchema>;

const GenerateLearningActivityOutputSchema = z.object({
  activityTitle: z.string().describe('The title of the generated learning activity.'),
  activityDescription: z.string().describe('A detailed description of the generated learning activity, including instructions.'),
  activityType: z.string().describe('The type of learning activity (e.g., quiz, simulation, game).'),
  estimatedDuration: z.string().describe('The estimated duration of the activity (e.g., 30 minutes).'),
  resourcesNeeded: z.string().describe('A list of resources needed for the activity (e.g., internet access, specific software).'),
});
export type GenerateLearningActivityOutput = z.infer<typeof GenerateLearningActivityOutputSchema>;

export async function generateLearningActivity(input: GenerateLearningActivityInput): Promise<GenerateLearningActivityOutput> {
  return generateLearningActivityFlow(input);
}

const generateLearningActivityPrompt = ai.definePrompt({
  name: 'generateLearningActivityPrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic of the learning activity.'),
      learningObjectives: z.string().describe('The learning objectives of the activity.'),
      targetAudience: z.string().describe('The target audience for the activity (e.g., grade level).'),
      previousActivities: z.string().optional().describe('A list of the learning activities already undertaken by the learner.'),
    }),
  },
  output: {
    schema: z.object({
      activityTitle: z.string().describe('The title of the generated learning activity.'),
      activityDescription: z.string().describe('A detailed description of the generated learning activity, including instructions.'),
      activityType: z.string().describe('The type of learning activity (e.g., quiz, simulation, game).'),
      estimatedDuration: z.string().describe('The estimated duration of the activity (e.g., 30 minutes).'),
      resourcesNeeded: z.string().describe('A list of resources needed for the activity (e.g., internet access, specific software).'),
    }),
  },
  prompt: `You are an experienced instructional designer. Your goal is to generate an engaging and effective interactive learning activity based on the provided information.

  Topic: {{{topic}}}
  Learning Objectives: {{{learningObjectives}}}
  Target Audience: {{{targetAudience}}}
  Previous Activities: {{{previousActivities}}}

  Consider the topic, learning objectives, and target audience to design an activity that is both educational and enjoyable. Provide a title, detailed description, the type, estimated duration, and resources needed for the activity.
  `,
});

const generateLearningActivityFlow = ai.defineFlow<
  typeof GenerateLearningActivityInputSchema,
  typeof GenerateLearningActivityOutputSchema
>({
  name: 'generateLearningActivityFlow',
  inputSchema: GenerateLearningActivityInputSchema,
  outputSchema: GenerateLearningActivityOutputSchema,
}, async input => {
  const {output} = await generateLearningActivityPrompt(input);
  return output!;
});
