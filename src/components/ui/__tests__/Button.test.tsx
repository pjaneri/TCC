import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  test('CT01: [Sucesso] Deve renderizar o botão com o texto correto', () => {
    // Cenário
    const buttonText = 'Clique Aqui';
    
    // Ação
    render(<Button>{buttonText}</Button>);

    // Verificação
    const buttonElement = screen.getByRole('button', { name: /Clique Aqui/i });
    
    // Critério de Aceite
    expect(buttonElement).toBeInTheDocument();
  });

  test('CT02: [Sucesso] Deve aplicar a classe de desabilitado quando a propriedade `disabled` for passada', () => {
    // Cenário
    const buttonText = 'Botão Desabilitado';

    // Ação
    render(<Button disabled>{buttonText}</Button>);

    // Verificação
    const buttonElement = screen.getByRole('button', { name: buttonText });

    // Critério de Aceite
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('disabled:opacity-50');
  });
});
