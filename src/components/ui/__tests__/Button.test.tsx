import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

// Descreve o conjunto de testes para o componente Button
describe('Button Component', () => {

  // Cenário de Teste 01 (CT01)
  test('CT01: [Sucesso] Deve renderizar o botão com o texto correto', () => {
    // Cenário: Define o texto esperado para o botão.
    const buttonText = 'Clique Aqui';
    
    // Ação: Renderiza o componente Button com o texto definido.
    render(<Button>{buttonText}</Button>);

    // Verificação: Procura por um elemento na tela com a role "button" e o nome acessível "Clique Aqui".
    const buttonElement = screen.getByRole('button', { name: /Clique Aqui/i });
    
    // Critério de Aceite: A asserção verifica se o elemento do botão foi encontrado no documento.
    expect(buttonElement).toBeInTheDocument();
  });

  // Cenário de Teste 02 (CT02)
  test('CT02: [Sucesso] Deve aplicar o estado de desabilitado quando a propriedade `disabled` for passada', () => {
    // Cenário: Define o texto para o botão que será renderizado como desabilitado.
    const buttonText = 'Botão Desabilitado';

    // Ação: Renderiza o componente Button com a propriedade `disabled`.
    render(<Button disabled>{buttonText}</Button>);

    // Verificação: Encontra o botão pelo seu texto.
    const buttonElement = screen.getByRole('button', { name: buttonText });

    // Critério de Aceite: A asserção verifica se o botão está, de fato, desabilitado.
    expect(buttonElement).toBeDisabled();
  });
});
