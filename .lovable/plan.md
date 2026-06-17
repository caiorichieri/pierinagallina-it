
# Sito Piergiorgio Iacuzzo — Plano

Site institucional bilíngue (IT padrão / EN) fiel à identidade visual do arquivo enviado (Playfair Display + DM Sans + DM Mono, paleta blu #0D2B5E / rosso #C0392B / oro #C9A84C / bianco #F9F7F2), em TanStack Start.

## Estrutura de rotas

```
src/routes/
  __root.tsx              → header + footer + language switcher
  index.tsx               → Home (hero, KPIs, destaques, quote, CTA)
  biografia.tsx           → Bio completa + timeline 2000→2026
  atletica-2000.tsx       → ASD Atletica 2000 (stats, paralimpico, pista)
  meeting.tsx             → Atletica 2000 Meeting (EAP, Continental Tour)
  codroipo-ce.tsx         → Codroipo C'è (associação atividades produtivas)
  valori.tsx              → Os 4 valori
  galleria.tsx            → Galeria de fotos (grid + lightbox)
  agenda.tsx              → Próximos eventos (lista cronológica + filtros)
  news.index.tsx          → Lista de notícias
  news.$slug.tsx          → Detalhe de notícia
  contatti.tsx            → Formulário de contato + dados
  api/contact.ts          → Server route POST (envio de email)
  api/public/...          → endpoints públicos se necessário
```

Cada rota tem `head()` próprio com title/description/og bilíngues.

## Design system

`src/styles.css` recebe tokens semânticos em oklch espelhando a paleta original:
- `--primary` = blu, `--accent` = oro, `--destructive`/`--brand-red` = rosso, `--background` = bianco, `--card` = #FFF, `--border` = bordo
- Fontes via Google Fonts no `__root.tsx` head (Playfair Display, DM Sans, DM Mono)
- Componentes shadcn customizados (Button, Card, Input, Textarea, Dialog para lightbox, Sheet para menu mobile)
- Animação `reveal` on-scroll via IntersectionObserver hook reutilizável
- Hero com gradientes radiais + linhas animadas (igual ao HTML original)

## Bilíngue (IT / EN)

- `src/i18n/` com dicionários `it.ts` e `en.ts` (objeto plano por chave)
- Contexto `LanguageProvider` + hook `useT()`; idioma persistido em `localStorage`, default IT
- Switcher IT/EN no header
- `head()` por rota lê do dicionário ativo
- Sem mudar URLs (single-tree, conteúdo trocado client-side) — mantém simples e SEO da versão IT como principal

## Backend (Lovable Cloud)

Habilitar Lovable Cloud para suportar:

1. **Notícias** — tabela `news` (id, slug, title_it, title_en, excerpt_it/en, body_it/en, cover_url, published_at, status). RLS: leitura pública; escrita só `admin` via `user_roles` + `has_role`.
2. **Agenda** — tabela `events` (id, title_it/en, description_it/en, location, starts_at, ends_at, url, cover_url). RLS leitura pública.
3. **Galeria** — bucket de storage `gallery` + tabela `gallery_photos` (id, url, caption_it/en, taken_at, order). Leitura pública.
4. **Contato** — server function `submitContact` que valida com Zod (name, email, message, max lengths) e grava em tabela `contact_messages` + envia email via Resend (secret `RESEND_API_KEY`).

Admin simples (futuro): rotas `/_authenticated/admin/...` para CRUD de news/events/gallery. **Não no escopo desta primeira entrega** — popular via seed inicial; mencionar como próximo passo.

## Conteúdo inicial (seed)

Todo o conteúdo do `iacuzzo_profile.html` portado integralmente para os componentes, traduzido para EN. KPIs, timeline, achievements e quote preservados literalmente.

## Detalhes técnicos

- TanStack Query já no router context; `useSuspenseQuery` nos loaders de news/events/gallery
- `notFoundComponent` + `errorComponent` em todas as rotas com loader
- Galeria: grid masonry CSS + Dialog do shadcn como lightbox
- Form de contato: react-hook-form + zodResolver; toast de sucesso/erro (sonner)
- Server function para contato em `src/lib/contact.functions.ts`
- Imagens: placeholders gerados via `generate_image` para hero e galeria seed (estilo editorial, paleta da marca)

## Entregáveis desta iteração

1. Habilitar Lovable Cloud + tabelas/RLS/grants
2. Tokens de design + fontes + `__root` com header/footer/lang switcher
3. As 10 rotas listadas com conteúdo IT/EN portado do HTML
4. Form de contato funcional (gravação + email Resend) — pedirá `RESEND_API_KEY` ao usuário
5. Galeria e Agenda com 4–6 itens seed cada
6. 2 posts de news seed

Próximos passos (fora desta iteração): painel admin autenticado para editar news/agenda/galeria, sitemap.xml, integração com Google Calendar para sincronização da agenda.
