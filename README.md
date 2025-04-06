# Documentação - Teste SuthHub

## Visão Geral

Este repositório contém o projeto de teste técnico desenvolvido para a vaga na SuthHub, utilizando tecnologias modernas como Vue 3, Nuxt 3, Headless UI e TailwindCSS. O projeto implementa uma aplicação web que consome dados da API pública [DummyJSON](https://dummyjson.com/) e apresenta três páginas principais: cadastro de usuário, galeria de receitas e lista de usuários.

## 🎯 Objetivos do Teste

Conforme o briefing original, o teste consistiu em desenvolver:

1. Uma aplicação web capaz de consumir dados da API DummyJSON 
2. Um cadastro com validações complexas
3. Interface com usabilidade e apresentação cuidadosa
4. Implementação adequada das estruturas do Headless UI

## 🚀 Tecnologias Utilizadas

- **[Nuxt 3](https://nuxt.com/)** - Framework Vue para desenvolvimento web full-stack
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript progressivo para construção de interfaces
- **[Headless UI](https://headlessui.dev/)** - Componentes UI acessíveis e sem estilo
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Vuelidate](https://vuelidate.js.org/)** - Para validação de formulários
- **[Lucide Vue Next](https://lucide.dev/)** - Ícones SVG para Vue 3
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript

## 📱 Páginas do Projeto

### Página 1: Cadastro de Usuário
![Captura de tela de 2025-04-05 23-55-03](https://github.com/user-attachments/assets/4431d452-c8dc-47ca-940f-9d3030e4b249)

Uma página com formulário de cadastro completo, implementando:

- Validação de campos obrigatórios com feedback visual
- Validações específicas (CPF válido, idade entre 18-65 anos)
- Máscaras automáticas (CPF, telefone, CEP)
- Busca automática de endereço por CEP
- Campos condicionais baseados nas seleções do usuário
- Modal informativa acionada por link
- Exibição das informações após submissão bem-sucedida

Campos implementados:
- Nome completo (mínimo 2 palavras)
- CPF (validação e máscara)
- Data de nascimento (formato brasileiro, restrição de idade)
- Telefone celular (com DDD e máscara)
- CEP com buscador automático de endereço
- Campos de endereço (Rua, Bairro, Cidade, Estado)
- Renda mensal (valor mínimo R$ 1000,00)
- Toggle para "Possui carro" com modal informativa
- Seleção de espécie do pet (cão/gato)
- Campo dinâmico de raça do pet com opção personalizada

### Página 2: Galeria de Receitas e Busca por Tags
![Captura de tela de 2025-04-05 23-55-11](https://github.com/user-attachments/assets/02670306-238e-4a50-a697-7ab8eaff9663)

Uma página que consome a API de Recipes da DummyJSON, apresentando:

- Galeria de cards com as receitas disponíveis
- Exibição de imagem, nome e tags de cada receita
- Sistema de filtragem por tags múltiplas
- Lista completa de tags em ordem alfabética com busca
- Modal ou página detalhada ao clicar em uma receita

Na visualização detalhada da receita:
- Nome da receita e imagem do prato
- Tags associadas à receita
- Tempo total de preparação (prep time + cook time)
- Avaliação visual com ícones/emojis
- Número de porções com representação visual
- Lista numerada de ingredientes
- Lista numerada de instruções

Implementação especial:
- Busca por múltiplas tags simultaneamente (funcionalidade não disponível diretamente na API, implementada na aplicação)
- Mensagem amigável quando nenhuma receita corresponde às tags selecionadas

### Página 3: Lista e Busca de Usuários
![Captura de tela de 2025-04-05 23-55-53](https://github.com/user-attachments/assets/a8a4b6a2-03fe-4263-968a-a3372e6dbeff)


Uma página que consome a API de Users da DummyJSON, apresentando:

- Tabela com todos os usuários em ordem alfabética
- Paginação eficiente (20 itens por página)
- Campo de busca por nome de usuário
- Exibição de foto, nome completo, data de nascimento e gênero
- Endereço completo do usuário
- Botão para abrir localização no Google Maps

## 🔧 Estrutura do Projeto

```
teste_suthub/
├── .nuxt/                 # Arquivos gerados pelo Nuxt
├── .output/               # Arquivos de saída da build
├── assets/                # Arquivos estáticos
│   └── css/               # Arquivos CSS
│       └── main.css       # Arquivo CSS principal
├── components/            # Componentes Vue reutilizáveis
│   ├── FormField.vue      # Componente de campo de formulário
│   └── Modal.vue          # Componente de modal
├── layouts/               # Layouts da aplicação
│   └── default.vue        # Layout padrão utilizado nas páginas
├── node_modules/          # Dependências do projeto
├── pages/                 # Páginas da aplicação
│   ├── index.vue          # Página inicial
│   ├── recipes.vue        # Página de receitas
│   └── users.vue          # Página de usuários
├── public/                # Arquivos publicamente acessíveis
│   ├── favicon.ico        # Favicon do site
│   └── robots.txt         # Arquivo de configuração para crawlers
├── utils/                 # Funções utilitárias
│   └── formHelpers.ts     # Helpers para formulários
├── .gitignore             # Arquivo de configuração do Git
├── app.vue                # Componente raiz da aplicação
├── nuxt.config.ts         # Configuração do Nuxt
├── package-lock.json      # Lock file de dependências
├── package.json           # Manifesto do projeto e dependências
├── README.md              # Documentação do projeto
├── tailwind.config.js     # Configuração do TailwindCSS
└── tsconfig.json          # Configuração do TypeScript
```

## 📦 Componentes Principais

### FormField.vue
Componente reutilizável para campos de formulário, implementado para:
- Padronização visual de campos de entrada
- Exibição consistente de mensagens de erro
- Suporte a diferentes tipos de entrada (texto, número, data, etc.)
- Aplicação automática de máscaras quando necessário

### Modal.vue
Componente baseado no Headless UI para exibição de modais, implementado com:
- Acessibilidade total (conforme padrões ARIA)
- Transições suaves
- Suporte a diferentes tamanhos e conteúdos
- Fechamento via ESC, clique fora ou botão explícito

## 🛠️ Utilitários

### formHelpers.ts
Funções auxiliares em TypeScript para manipulação de formulários:
- Validação de CPF
- Formatação de máscaras (CPF, telefone, CEP)
- Consulta de CEP para preenchimento automático de endereço
- Validações específicas para os campos do formulário

## ⚙️ Instalação e Execução

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/teste_suthub.git

# Navegar até o diretório do projeto
cd teste_suthub

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000` por padrão.

## 📝 Comandos Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Gerar arquivos estáticos para deploy
npm run generate

# Visualizar a build de produção localmente
npm run preview

# Preparar o Nuxt (executado após npm install)
npm run postinstall
```

## 🧪 Aspectos Técnicos Destacados

### Consumo de API
Implementação eficiente de chamadas à API DummyJSON para Recipes e Users, com:
- Gerenciamento de estados de carregamento
- Tratamento de erros
- Otimização de requisições

### Validação de Formulários Complexos
Sistema completo de validação de formulários com Vuelidate, incluindo:
- Validações personalizadas para CPF
- Verificações em tempo real
- Feedback visual imediato
- Campos condicionais e dependentes

### Implementação de Busca Avançada
Solução para limitações da API, implementando busca por múltiplas tags em receitas:
- Lógica frontend para filtrar resultados
- Interface de usuário intuitiva para seleção de tags
- Feedback claro quando não há resultados correspondentes

### Componentes Reutilizáveis
Arquitetura baseada em componentes para maximizar reuso e consistência:
- Componentes modulares e configuráveis
- Props tipadas com TypeScript
- Emissão de eventos padronizada

### Design Responsivo
Interface adaptável para diferentes tamanhos de tela:
- Layout flexível com TailwindCSS
- Adaptações específicas para mobile
- Experiência de usuário otimizada em todos os dispositivos

Desenvolvido como teste técnico para SuthHub utilizando Vue 3, Nuxt 3, Headless UI e TailwindCSS.
