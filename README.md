# INDAIA Portal — V9 (Next.js 14)

Portal institucional para despacho aduaneiro e COMEX, migrado do HTML único para Next.js 14 com App Router.

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+ instalado ([download](https://nodejs.org))
- Terminal (PowerShell, CMD, iTerm2, etc.)

### Passos

```bash
# 1. Entre na pasta do projeto
cd indaia-portal

# 2. Instale as dependências (só na primeira vez)
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. ✅

---

## 📦 Como fazer o build para produção

```bash
npm run build
npm run start
```

---

## ☁️ Deploy na Vercel (recomendado — gratuito)

1. Crie conta em [vercel.com](https://vercel.com)
2. Instale a CLI: `npm i -g vercel`
3. Na pasta do projeto: `vercel`
4. Siga as instruções. Deploy pronto em ~2 minutos!

Ou conecte seu repositório GitHub diretamente na dashboard da Vercel para deploy automático a cada push.

---

## 🗂️ Estrutura do projeto

```
src/
├── app/                    # Páginas (rotas automáticas)
│   ├── layout.tsx          # Layout global (Navbar + Footer)
│   ├── page.tsx            # Home
│   ├── ferramentas/        # Simulador DI, Incoterms, Checklist
│   ├── cotacoes/           # PTAX live + Tabela mensal
│   ├── noticias/           # Blog/news
│   ├── contato/            # Formulário de cotação
│   └── sobre/              # Quem somos + timeline
│
├── components/
│   ├── layout/             # Topbar, Navbar, Footer, ThemeProvider
│   ├── home/               # Hero, StatsBand, Services, QuoteForm...
│   ├── cotacao/            # LiveRates, PtaxTable
│   ├── ferramentas/        # FerramentasClient (4 ferramentas)
│   └── ui/                 # ThemeToggle e componentes reutilizáveis
│
├── hooks/
│   └── usePtax.ts          # Hook para API BCB PTAX
│
└── lib/
    └── constants.ts        # Todos os dados estáticos (incoterms, ports, news...)
```

---

## 🔌 APIs externas utilizadas

| API | Endpoint | Uso |
|-----|----------|-----|
| BCB PTAX | `olinda.bcb.gov.br/olinda/...` | Cotações USD, EUR, CNY ao vivo |
| Open-Meteo | `api.open-meteo.com/v1/forecast` | Status meteorológico portos/aeroportos |

Ambas são gratuitas e não requerem chave de API.

---

## 📄 Páginas disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Home — Hero, Stats, Serviços, Notícias, Câmbio, Clientes, Cotação |
| `/ferramentas` | Simulador DI, Incoterms, Checklist, NCM |
| `/cotacoes` | Câmbio ao vivo + Tabela PTAX mensal |
| `/noticias` | Notícias e alertas regulatórios |
| `/sobre` | Quem somos, missão, timeline histórico |
| `/contato` | Formulário de cotação |

---

## ➕ Como adicionar uma nova página

1. Crie uma pasta em `src/app/nome-da-pagina/`
2. Adicione um arquivo `page.tsx` dentro dela
3. Exporte um componente React como `default`
4. A rota `/nome-da-pagina` já funciona automaticamente!

---

*INDAIA Assessoria em Comércio Exterior Ltda. — Santos, SP desde 1966*
