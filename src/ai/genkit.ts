
import {genkit, type Plugin, type GenkitOptions} from 'genkit'; // Import Plugin and GenkitOptions from 'genkit'
import {googleAI} from '@genkit-ai/googleai';

// No longer need: import type {Plugin as CorePlugin} from '@genkit-ai/core';
// No longer need custom GenkitConfigOptions interface

const activePlugins: Plugin[] = []; // Use Plugin from 'genkit'
// Initialize with an empty plugins array, model can be added conditionally
const genkitInitConfig: GenkitOptions = { plugins: activePlugins };

// Check for GOOGLE_API_KEY or GEMINI_API_KEY.
// Next.js automatically loads .env files, so process.env should have it if defined.
if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
  activePlugins.push(googleAI());
  // Set the default model only if the Google AI plugin is being initialized.
  // This assumes GenkitOptions supports a 'model' property.
  genkitInitConfig.model = 'googleai/gemini-2.0-flash';
} else {
  // Log a warning if the API key is not set.
  // Flows using Gemini models will fail at runtime if called without a configured Google AI plugin.
  console.warn(
    'WARNING: GOOGLE_API_KEY or GEMINI_API_KEY is not set in the environment. ' +
    'The Google AI plugin will not be initialized. ' +
    'Genkit flows that rely on Google AI models (e.g., Gemini) will fail if executed.'
  );
  // Genkit can initialize with an empty plugins array.
  // No default model is set if the Google AI plugin isn't available.
}

export const ai = genkit(genkitInitConfig);
