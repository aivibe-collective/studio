/**
 * @fileOverview This file initializes the Genkit AI instance with the Google AI plugin.
 * It sets up the connection to the Google Generative AI services and exports the configured AI instance.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

/**
 * The Genkit AI instance configured with the Google AI plugin.
 */
export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    (() => {
      try {
        return googleAI({
          apiKey: process.env.GOOGLE_GENAI_API_KEY,
        });
      } catch (e) {
        console.error('Error initializing Google AI plugin:', e);
        throw e;
      }
    })(),
  ],
  model: 'googleai/gemini-2.0-flash',
});

