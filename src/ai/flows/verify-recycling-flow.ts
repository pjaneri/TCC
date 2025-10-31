
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
      'A brief, friendly, one-sentence comment in Portuguese explaining the decision, especially if the submission is invalid.'
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
  prompt: `Você é um assistente de IA para o aplicativo Recycle+. Sua tarefa é verificar uma submissão de reciclagem de um usuário com base em uma foto e uma descrição.

Você receberá uma foto e a descrição do usuário sobre o que ele está reciclando.

Sua tarefa é:
1.  **Analisar a imagem e a descrição.** A descrição do usuário é: {{{description}}}. A imagem é a principal fonte de verdade.
2.  **Determinar se a submissão é válida.** Uma submissão é válida se a imagem contiver pelo menos um item físico e reciclável claro. A submissão deve focar em um único tipo de material (ex: só plásticos, só papéis).
3.  **Identificar o material principal.** Com base nos itens na foto, identifique o principal tipo de material. As opções são: 'Plástico', 'Papel', 'Vidro', 'Metal'. Se você não puder determinar o tipo ou for uma mistura, classifique como 'Outros'.
4.  **Tentar detectar duplicatas.** Analise o contexto da foto (fundo, iluminação, ângulo do item). Se a imagem parecer ser uma foto de tela, uma imagem de banco de imagens, ou idêntica a uma submissão que seria feita em série (ex: mesma garrafa em fundos diferentes), considere-a inválida.
5.  **Atribuir pontos com base no material identificado.**
    *   Plástico: 20 pontos
    *   Papel: 15 pontos
    *   Vidro: 10 pontos
    *   Metal: 75 pontos
    *   Outros: 5 pontos
    *   **Se a submissão for inválida (item não reciclável, duplicata suspeita, etc.), atribua 0 pontos.**
6.  **Fornecer um comentário conciso, amigável e em UMA frase EM PORTUGUÊS explicando sua decisão.**
    *   Exemplo Válido (garrafas de plástico): "Ótima reciclagem! Itens de plástico verificados com sucesso."
    *   Exemplo Inválido (foto de um gato): "Hmm, isso não parece ser um item reciclável. Por favor, envie uma foto dos seus recicláveis."
    *   Exemplo Inválido (suspeita de duplicata): "Esta imagem parece ser muito semelhante a uma submissão anterior. Por favor, envie uma nova foto com itens diferentes."
    *   Exemplo Inválido (múltiplos materiais): "Detectei múltiplos tipos de materiais. Por favor, envie apenas um tipo de material por vez."

Analise a foto anexada e cumpra a solicitação com estas regras.

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

    