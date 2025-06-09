
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// The activePlugins array will hold plugin instances.
// Its type can be inferred by TypeScript based on what's pushed into it.
const activePluginInstances: ReturnType<typeof googleAI>[] = [];

// This will be the configuration object passed to genkit()
// We define its expected structure here for clarity and type safety within this file.
interface GenkitInitializationConfig {
  plugins: ReturnType<typeof googleAI>[];
  model?: string;
}

const genkitConfig: GenkitInitializationConfig = { plugins: activePluginInstances };

// Check for GOOGLE_API_KEY or GEMINI_API_KEY.
// Next.js automatically loads .env files, so process.env should have it if defined.
if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
  activePluginInstances.push(googleAI());
  // Set the default model only if the Google AI plugin is being initialized.
  genkitConfig.model = 'googleai/gemini-2.0-flash';
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

export const ai = genkit(genkitConfig);
