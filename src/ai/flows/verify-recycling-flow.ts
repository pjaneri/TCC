
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyRecyclingInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the recycling items, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .describe('A user-provided description of the items being recycled.'),
});
export type VerifyRecyclingInput = z.infer<typeof VerifyRecyclingInputSchema>;

const VerifyRecyclingOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'Whether the recycling submission is considered valid based on the image and description.'
    ),
  material: z
    .enum(['Plástico', 'Papel', 'Vidro', 'Metal', 'Outros'])
    .describe(
      'The primary material type identified in the recycling submission.'
    ),
  points: z
    .number()
    .describe('The number of points awarded for this submission.'),
  comment: z
    .string()
    .describe(
      'A brief comment explaining the decision, especially if the submission is invalid.'
    ),
});
export type VerifyRecyclingOutput = z.infer<typeof VerifyRecyclingOutputSchema>;

export async function verifyRecycling(
  input: VerifyRecyclingInput
): Promise<VerifyRecyclingOutput> {
  return verifyRecyclingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyRecyclingPrompt',
  input: { schema: VerifyRecyclingInputSchema },
  output: { schema: VerifyRecyclingOutputSchema },
  prompt: `You are an AI assistant for the Recycle+ app. Your task is to verify a user's recycling submission based on a photo and a description.

You will be given a photo and a user's description of what they are recycling.

Your task is to:
1.  **Analyze the image and description.** The user's description is: {{{description}}}. The image is the primary source of truth.
2.  **Determine if the submission is valid.** A submission is valid if the image contains at least one clear, physical recyclable item. Submissions with non-recyclable items (like animals, people, screenshots) are invalid.
3.  **Identify the primary material.** Based on the items in the photo, identify the main material type. The options are: 'Plástico', 'Papel', 'Vidro', 'Metal'. If you cannot determine the type or it's a mix without a clear primary one, classify it as 'Outros'.
4.  **Assign points based on the identified material.**
    *   Plástico: 20 points
    *   Papel: 15 points
    *   Vidro: 10 points
    *   Metal: 75 points
    *   Outros: 5 points
    *   **If the submission is invalid, award 0 points.**
5.  **Provide a concise, friendly, one-sentence comment in Portuguese explaining your decision.**
    *   For a valid submission (e.g., plastic bottle and paper): "Ótima reciclagem! Itens de plástico e papel verificados."
    *   For an invalid submission (e.g., a photo of a cat): "Hmm, isso não parece ser um item reciclável. Por favor, envie uma foto dos seus recicláveis."
    *   If you identify paper: "Reciclagem de papel verificada. Bom trabalho!"

Analyze the attached photo and fulfill the request with these rules.

User's description: {{{description}}}
Photo: {{media url=photoDataUri}}
`,
});

const verifyRecyclingFlow = ai.defineFlow(
  {
    name: 'verifyRecyclingFlow',
    inputSchema: VerifyRecyclingInputSchema,
    outputSchema: VerifyRecyclingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    // Assign points based on the AI-identified material
    const materialPoints: Record<string, number> = {
      'Plástico': 20,
      'Papel': 15,
      'Vidro': 10,
      'Metal': 75,
      'Outros': 5,
    };

    if (output) {
      if (output.isValid) {
        output.points = materialPoints[output.material] || 5;
      } else {
        output.points = 0;
      }
    }

    return output!;
  }
);
