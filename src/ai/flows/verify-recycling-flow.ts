
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const materialPoints: Record<string, number> = {
  Plástico: 20,
  Papel: 15,
  Vidro: 10,
  Metal: 75,
  Outros: 5,
};

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
  prompt: `You are an AI assistant for the Recycle+ app. Your task is to verify a user's recycling submission.

You will be given a photo and a user's description of what they are recycling.

Your task is to:
1. Analyze the image to identify the primary material being recycled.
2. Compare your finding with the user's description: {{{description}}}.
3. Determine if the submission is valid. It's valid if the image clearly shows recyclable materials.
4. The main material types are: Plástico, Papel, Vidro, Metal. If you cannot determine the type or it's something else, classify it as 'Outros'.
5. Based on the identified material, assign points. Here is the point system:
   - Plástico: 20 points
   - Papel: 15 points
   - Vidro: 10 points
   - Metal: 75 points
   - Outros: 5 points
   If the submission is invalid, award 0 points.
6. Provide a concise, friendly, one-sentence comment in Portuguese explaining your decision. For example, if it's valid, say "Ótima reciclagem! Itens de plástico verificados.". If it's invalid (e.g., a photo of a cat), say "Hmm, isso não parece ser um item reciclável.".

Analyze the attached photo and fulfill the request.

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
    return output!;
  }
);

    