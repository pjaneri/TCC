
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
  prompt: `You are a strict AI assistant for the Recycle+ app. Your task is to verify a user's recycling submission to prevent fraud.

You will be given a photo and a user's description of what they are recycling.

Your task is to:
1.  **Analyze the image and description with high scrutiny.** The user's description is: {{{description}}}.
2.  **Determine if the submission is valid.** A submission is valid ONLY if the image CLEARLY shows multiple recyclable items or a clear context of recycling (e.g., a bag full of recyclables).
    *   **INVALIDATE submissions that look like fraud.** A single item photographed perfectly might be a stock photo or a repeated submission. Be suspicious. If it's just one bottle, it is likely invalid.
    *   **INVALIDATE non-recyclable items.** The image must contain actual recyclable materials. Photos of people, animals, landscapes, computer screens, or anything that is not a physical item for recycling are invalid.
3.  **Identify the primary material.** The main material types are: Plástico, Papel, Vidro, Metal. If you cannot determine the type or it's something else, classify it as 'Outros'.
4.  **Assign points based on the identified material.**
    *   Plástico: 20 points
    *   Papel: 15 points
    *   Vidro: 10 points
    *   Metal: 75 points
    *   Outros: 5 points
    *   **If the submission is invalid, award 0 points.**
5.  **Provide a concise, friendly, one-sentence comment in Portuguese explaining your decision.**
    *   For a valid submission (e.g., several plastic bottles): "Ótima reciclagem! Vários itens de plástico verificados."
    *   For an invalid submission (e.g., a photo of a cat): "Hmm, isso não parece ser um item reciclável. Por favor, tire uma foto dos seus recicláveis."
    *   For a suspicious submission (e.g., one single bottle): "Para evitar fraudes, por favor, mostre vários itens juntos na foto."
    *   If paper is claimed but not clearly visible: "Não consegui identificar o papel na foto. Tente tirar uma foto mais clara dos itens."

Analyze the attached photo and fulfill the request with these strict rules.

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
