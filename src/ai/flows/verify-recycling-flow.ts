
'use server';
/**
 * @fileOverview Um fluxo Genkit para verificar envios de reciclagem usando IA.
 *
 * - verifyRecycling - Uma função que lida com a verificação da foto e da descrição de um envio de reciclagem.
 * - VerifyRecyclingInput - O tipo de entrada para a função verifyRecycling.
 * - VerifyRecyclingOutput - O tipo de retorno para a função verifyRecycling.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const materialPoints: Record<string, number> = {
  Plástico: 20,
  Papel: 15,
  Vidro: 10,
  Metal: 75,
  Outros: 5,
  'Não é lixo reciclável': 0,
};

const VerifyRecyclingInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Uma foto dos itens recicláveis, como um data URI que deve incluir um tipo MIME e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<dados_codificados>'."
    ),
  description: z.string().describe('Uma descrição fornecida pelo usuário dos itens e sua quantidade.'),
});
export type VerifyRecyclingInput = z.infer<typeof VerifyRecyclingInputSchema>;

const VerifyRecyclingOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe('Se o envio da reciclagem é válido com base na imagem e na descrição.'),
  materialType: z
    .enum(['Plástico', 'Papel', 'Vidro', 'Metal', 'Outros', 'Não é lixo reciclável'])
    .describe('O tipo de material primário identificado na imagem.'),
  reason: z
    .string()
    .describe('Uma explicação para a decisão de validação, especialmente se for inválida.'),
  pointsAwarded: z
    .number()
    .describe('O número de pontos concedidos para o envio.'),
});
export type VerifyRecyclingOutput = z.infer<typeof VerifyRecyclingOutputSchema>;

export async function verifyRecycling(
  input: VerifyRecyclingInput
): Promise<VerifyRecyclingOutput> {
  return verifyRecyclingFlow(input);
}

const verifyRecyclingPrompt = ai.definePrompt({
  name: 'verifyRecyclingPrompt',
  input: { schema: VerifyRecyclingInputSchema },
  output: { schema: VerifyRecyclingOutputSchema },
  prompt: `Você é um especialista em verificação para um aplicativo de reciclagem chamado Recycle+. Sua tarefa é analisar uma imagem e uma descrição fornecida por um usuário para determinar se o registro de reciclagem é válido.

REGRAS:
1.  **Analise a imagem:** Verifique se os itens na imagem correspondem ao que se espera de lixo reciclável.
2.  **Identifique o Material Principal:** Determine o tipo de material predominante na imagem. As opções são: Plástico, Papel, Vidro, Metal, Outros. Se a imagem não contiver material reciclável, use 'Não é lixo reciclável'.
3.  **Valide o Registro:**
    *   Se a imagem contiver claramente itens recicláveis que correspondam a um dos tipos de material, defina 'isValid' como 'true'.
    *   Se a imagem estiver em branco, escura, desfocada ou não mostrar itens recicláveis, defina 'isValid' como 'false'.
    *   Se o material for 'Não é lixo reciclável', defina 'isValid' como 'false'.
4.  **Forneça uma Razão:**
    *   Se for válido, a razão deve ser uma confirmação positiva. Ex: "Registro válido. Itens de {materialType} identificados."
    *   Se for inválido, explique claramente o porquê. Ex: "A imagem está muito escura para ser analisada." ou "Nenhum item reciclável foi encontrado na imagem."
5.  **Calcule os Pontos:** Use a tabela de pontos abaixo para definir 'pointsAwarded'. Se o registro for inválido, os pontos devem ser 0.

Tabela de Pontos:
- Plástico: 20 pontos
- Papel: 15 pontos
- Vidro: 10 pontos
- Metal: 75 pontos
- Outros: 5 pontos
- Não é lixo reciclável: 0 pontos

Análise do Usuário:
- Descrição: {{{description}}}
- Foto: {{media url=photoDataUri}}`,
});

const verifyRecyclingFlow = ai.defineFlow(
  {
    name: 'verifyRecyclingFlow',
    inputSchema: VerifyRecyclingInputSchema,
    outputSchema: VerifyRecyclingOutputSchema,
  },
  async (input) => {
    const llmResponse = await verifyRecyclingPrompt(input);
    const result = llmResponse.output!;

    // Reforçar a lógica de pontos
    if (!result.isValid) {
      result.pointsAwarded = 0;
    } else {
      result.pointsAwarded = materialPoints[result.materialType] || 0;
    }

    return result;
  }
);
