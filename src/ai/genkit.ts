import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import config from '../../config.json';

export const ai = genkit({
  plugins: [googleAI({apiKey: config.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
});
