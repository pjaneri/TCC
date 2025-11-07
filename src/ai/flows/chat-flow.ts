'use server';
/**
 * @fileOverview Um fluxo de IA para um chatbot de reciclagem.
 *
 * - chat - A função principal que lida com a lógica do chat.
 * - ChatInput - O tipo de entrada para a função de chat.
 * - ChatOutput - O tipo de retorno para a função de chat.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Esquema para cada mensagem individual na conversa
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

export const ChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('O histórico da conversa até agora.'),
  message: z.string().describe('A última mensagem do usuário.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string().describe('A resposta gerada pela IA.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `Você é Recy, um assistente amigável e prestativo no aplicativo Recycle+. Sua função é responder a perguntas sobre reciclagem, o aplicativo e incentivar os usuários a reciclar mais.

Responda de forma concisa, útil e em português brasileiro.

Aqui está o histórico da conversa:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

Nova mensagem do usuário:
- user: {{{message}}}

Sua resposta:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return { response: output!.response };
  }
);
