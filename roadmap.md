# Roadmap — Recupero backend Pierina Gallina

## Obiettivo
Ripristinare i contenuti del sito dopo la cancellazione del backend `pierina-archive-transfer` (ref `foubruudcsrbfucuavob`).

## Azioni in corso
1. [ ] Aprire chamado no suporte Lovable para tentar restaurar o projeto antigo.
2. [ ] Criar no backend novo (ref `muhsqviepidroymvsevd`) as tabelas de conteúdo que existiam no antigo:
   - posts, categories, books, poems
   - fiabe_collections, fiabe_tracks
   - content_gallery_photos (evita conflito com gallery_photos existente)
   - newsletter_subscribers
3. [ ] Atualizar `src/integrations/pierina/client.ts` para apontar para o backend novo.
4. [ ] Atualizar `src/lib/newsletter.server.ts` para usar o backend novo.
5. [ ] Atualizar rotas de fotos para usar `content_gallery_photos`.
6. [ ] Tentar recuperar conteúdo público do WordPress antigo / Wayback Machine.
7. [ ] Criar script de importação dos dados recuperados.
8. [ ] Regenerar `src/integrations/supabase/types.ts`.
9. [ ] Testar todas as rotas.
