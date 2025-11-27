# TCC - Projeto Recycle+

Este é um projeto Next.js para o aplicativo Recycle+, uma plataforma gamificada para incentivar a reciclagem. Os usuários podem registrar materiais recicláveis, ganhar pontos e trocá-los por prêmios.

---

## Tecnologias Utilizadas

Este projeto foi construído com um conjunto de tecnologias modernas para garantir uma aplicação rápida, segura e escalável.

### **1. Firebase**

O Firebase atua como o **Backend-como-um-Serviço (BaaS)**, fornecendo toda a infraestrutura de servidor de que precisamos.

-   **Firebase Authentication:** Gerencia todo o ciclo de vida do usuário, incluindo:
    -   Cadastro com e-mail e senha.
    -   Login seguro (e-mail/senha e Google).
    -   Gerenciamento de sessão e logout.

-   **Cloud Firestore:** Nosso banco de dados NoSQL em tempo real. Ele armazena todas as informações da aplicação, como:
    -   Perfis de usuários (`/users/{userId}`).
    -   Registros de reciclagem (`/users/{userId}/recycling_records`).
    -   Histórico de resgates (`/users/{userId}/redemptions`).

-   **Regras de Segurança (Security Rules):** Protegem nosso banco de dados, garantindo que um usuário só possa ler e escrever seus próprios dados, prevenindo acessos indevidos.

### **2. Next.js**

É o **framework React** que estrutura toda a nossa aplicação. Ele nos permite criar uma aplicação web moderna e de alta performance.

-   **App Router:** Usamos o sistema de roteamento baseado em arquivos do Next.js, onde cada pasta dentro de `src/app/` se torna uma rota na aplicação (ex: `src/app/dashboard/profile` vira a página `/dashboard/profile`).
-   **Server Components:** Muitos dos nossos componentes são renderizados no servidor, o que melhora o tempo de carregamento inicial e a performance geral.

### **3. React**

É a **biblioteca de interface de usuário (UI)** que forma o coração da nossa aplicação.

-   **Componentização:** Tudo é dividido em componentes reutilizáveis (botões, cards, etc.), o que torna o código mais limpo e fácil de manter.
-   **Hooks:** Usamos hooks como `useState` e `useEffect` para gerenciar o estado da interface e lidar com efeitos colaterais, como buscar dados do Firebase.

### **4. TypeScript**

É um **superset do JavaScript** que adiciona tipagem estática ao código.

-   **Prevenção de Bugs:** Ao definir os "tipos" de dados que nossas funções e componentes esperam (ex: `string`, `number`), o TypeScript nos ajuda a capturar erros durante o desenvolvimento, antes mesmo de o código ser executado.
-   **Clareza e Manutenibilidade:** O código se torna mais legível e fácil de entender, pois as estruturas de dados (como o formato de um `UserProfile`) são explicitamente definidas.

### **5. Tailwind CSS & ShadCN/UI**

São as ferramentas que usamos para **estilizar** a aplicação.

-   **Tailwind CSS:** Um framework CSS "utility-first" que nos permite aplicar estilos diretamente no JSX/HTML com classes como `p-4`, `rounded-lg`, `bg-primary`. Isso acelera o desenvolvimento e garante consistência visual.
-   **ShadCN/UI:** Uma coleção de componentes de interface pré-construídos (como `Card`, `Button`, `Dialog`) que usam Tailwind CSS por baixo dos panos. Eles são acessíveis, customizáveis e nos pouparam muito tempo.

---

## Como Executar os Testes

Este projeto está configurado com **Jest** e **React Testing Library** para testes unitários.

Para executar os testes, rode o seguinte comando no terminal:

```bash
npm test
```

Isso iniciará o Jest em modo "watch", que re-executará os testes automaticamente sempre que um arquivo for alterado. Você pode encontrar um exemplo de teste em `src/components/ui/__tests__/Button.test.tsx`.
