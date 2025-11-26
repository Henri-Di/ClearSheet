# ClearSheet

ClearSheet é uma plataforma moderna de gestão financeira desenvolvida para proporcionar **clareza**, **organização** e **experiência intuitiva** no controle de entradas, saídas e saldos.  
A solução combina um backend robusto em **Laravel 12** com um frontend dinâmico em **React + TypeScript + Vite**, estilizado em **TailwindCSS** e integrado a um banco **PostgreSQL** otimizado para performance.

O sistema adota uma arquitetura modular e totalmente desacoplada, possibilitando evolução contínua, reuso de componentes e manutenção simplificada.

---

## 🧱 Arquitetura Geral

O ClearSheet é estruturado em dois módulos independentes, comunicando-se exclusivamente via API REST:

- **Backend (Laravel 12)** — responsável pela lógica de negócio, validações, regras financeiras, persistência de dados e endpoints REST.
- **Frontend (React + TS + Vite)** — responsável pela experiência do usuário, renderização dos dados, interação, feedback visual e componentes dinâmicos.

Essa separação garante:
- Deploy independente entre front e back  
- Maior escalabilidade  
- Melhor legibilidade e organização do projeto  
- Facilidade para adicionar novos módulos no futuro  

---

## 🔌 Comunicação Backend ↔ Frontend

- O frontend consome apenas rotas REST.  
- Nenhum acoplamento Blade ou PHP.  
- Estrutura completamente headless, baseada em JSON.  
- Estados e cache organizados via hooks dedicados (ex: `useSheetView`).  

Esse padrão permite integração com aplicações futuras — mobile, dashboards externos, automações, etc.

---

## ⚙️ Tecnologias Utilizadas

### **Backend — Laravel 12**
- PHP 8.2+  
- API REST estruturada em Resources e Controllers  
- Form Requests para validações robustas  
- Policies e Rules (se aplicável)  
- Migrations, Seeds e Eloquent ORM  
- Middleware moderno e autenticação por Sanctum/JWT  
- PostgreSQL com índices otimizados  

### **Frontend — React + TypeScript**
- Vite como bundler ultra-rápido  
- TailwindCSS com design pastel 2026  
- Componentização forte  
- Lucide Icons  
- Framer Motion para micro-animações  
- Axios para consumo de API  
- Hooks customizados para lógica desacoplada  
- Gestão de estado via Context API ou Zustand  

---

## 🖥️ Estrutura de Tela e Experiência

O ClearSheet foi projetado com foco em ergonomia e fluidez:

### **Listagem de Planilhas (Sheets.tsx)**
- Busca inteligente  
- Ordenação dinâmica  
- Skeleton pastel (shimmer)  
- Cards com Sparkline duplo (Entradas x Saídas)  
- Badges e micro-interações  

### **Resumo Financeiro (SummaryCards)**
- Três cards principais: Entradas, Saídas e Saldo  
- Cálculo automático  
- Visualização leve e imediata  
- Design pastel arredondado  

### **Transações (ItemCard)**
- Edição inline otimizada  
- Tooltips informativos  
- Botões contextuais  
- Popover para marcação de pagamento  
- Destaque automático de atrasados  

### **Modais (Pastel 2026)**
- `CreateSheetModal`  
- `EditSheetModal`  
- `ItemModal`  
- Layout com bordas arredondadas, sombra suave e animação sutil  
- Formulários padronizados e acessíveis  

---

## 🧩 Estrutura Modular (Frontend)

frontend/
│
└─ src/
    │
    ├─ components/                 # Componentes globais e reutilizáveis
    │   ├─ navigation/             # Navegação principal (sidebar, header, menus)
    │   └─ ui/                     # Componentes UI atômicos (toggles, inputs, etc.)
    │       └─ ThemeToggle.tsx
    │
    ├─ features/                   # Features específicas isoladas por contexto
    │
    ├─ layouts/                    # Layouts principais da aplicação
    │   ├─ ClearSheetLogo.tsx
    │   └─ MainLayout.tsx
    │
    ├─ modules/                    # Módulos do domínio (cada um 100% desacoplado)
    │   ├─ categories/             # Gestão de categorias financeiras
    │   ├─ dashboard/              # Indicadores, gráficos e KPIs
    │   ├─ sheets/                 # Lista, criação e edição de planilhas
    │   ├─ sheetView/              # Tela detalhada da planilha (transações)
    │   └─ transactions/           # CRUD de transações
    │
    ├─ pages/                      # Páginas completas (ex: Login)
    │   └─ Login.tsx
    │
    ├─ routes/                     # Sistema de rotas modularizado
    │   ├─ index.ts
    │   ├─ privateRoutes.tsx       # Rotas protegidas (auth middleware)
    │   ├─ ProtectedRoute.tsx
    │   ├─ publicRoutes.tsx
    │   └─ router.tsx
    │
    ├─ services/                   # Serviços de API centralizados
    │   ├─ api.ts                  # Configuração base (axios)
    │   ├─ auth.ts                 # Auth Service
    │   └─ dashboard.ts            # Dashboard Service
    │
    ├─ utils/                      # Funções auxiliares
    │   └─ theme.ts                # Gerenciamento de tema (light/dark)
    │
    ├─ App.css
    ├─ App.tsx
    ├─ index.css
    └─ main.tsx


Cada módulo contém:
- Tela principal  
- Componentes dedicados  
- Modal próprio  
- Hook de gerenciamento  
- Tipagem específica  

---

## 🧩 Arquitetura Modular (Backend)

backend/
│
└─ app/
    │
    ├─ Http/
    ├─ Models/
    │
    └─ Modules/
        │
        ├─ Auth/              # Módulo de autenticação
        ├─ Core/              # Núcleo do sistema (helpers, traits, etc.)
        │
        └─ Financial/         # Módulo financeiro (totalmente desacoplado)
            │
            ├─ Banks/         # Gestão de bancos
            ├─ Categories/    # Categorias de transações
            ├─ Dashboard/     # Indicadores financeiros e resumos
            ├─ Sheets/        # Planilhas (spreadsheets)
            └─ Transactions/  # Transações financeiras


O backend segue padrões:
- Controllers enxutos  
- Regras isoladas em Form Requests  
- Retornos unificados em API Resources  
- Banco PostgreSQL otimizado com índices nas colunas de filtragem  

---

## 🌈 Design Pastel 2026

Pontos do sistema visual:
- Paleta soft em tons lilás, azul claro, creme e cinza  
- Cantos arredondados (`rounded-3xl`)  
- Bordas (`#E6E1F7`) e sombras suaves  
- Ícones minimalistas do Lucide  
- Cuidado com legibilidade e contraste  
- Consistência entre cards, botões e modais  

---

# 🔥 Destaques Técnicos

- Arquitetura totalmente headless  
- Separação total: UI ↔ Lógica ↔ API  
- React modular com componentes reutilizáveis  
- Sparkline duplo customizado  
- Animações naturais  
- Tipagem robusta  
- Backend seguro e escalável em Laravel 12  
- PostgreSQL otimizado  
- Pronto para multiclientes  
- Expansível para dashboards completos e mobile  

---

## 📐 Filosofia de Desenvolvimento

O ClearSheet foi projetado baseado em:

- **Modularidade:** tudo é isolado  
- **Escalabilidade:** fácil de crescer  
- **Reutilização:** componentes atômicos  
- **Separação de responsabilidades:** UI ↔ Lógica ↔ API  
- **Performance:** carregamento rápido e renderização suave  
- **Coesão visual:** experiência consistente em todas as telas  
- **Código limpo:** padronização e clareza  

---

# 🚀 Instalação e Setup

## Backend (Laravel 12)

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve

## 🖥️ Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev


 ┌────────────┐      JSON REST       ┌──────────────┐
 │  Frontend  │  <---------------->  │   Backend     │
 │ React + TS │                      │  Laravel 12   │
 └────────────┘                      └──────┬───────┘
                                            │
                                      PostgreSQL


## 📦 Roadmap

- [ ] Dashboard completo com gráficos  
- [ ] Notificações inteligentes  
- [ ] Integração OpenFinance  
- [ ] Multiusuário + permissões  
- [ ] Exportação e importação avançada  
- [ ] Modo escuro nativo  
- [ ] Aplicativo mobile  


## 📦 Visão de Futuro

- Dashboard com gráficos completos  
- Notificações financeiras inteligentes  
- Integração com OpenFinance  
- Multiusuário e permissões avançadas  
- Exportação e importação de planilhas  
- Modo escuro nativo  
- App mobile com a mesma API  



