# Editor de artigos com formatação e upload de fotos

## Objetivo

Substituir o editor atual (uma caixa de texto com HTML cru) por um editor visual real, e trocar todos os campos de "URL da imagem" por upload de arquivo em todo o painel admin.

## 1. Editor rico (WYSIWYG)

Novo componente `RichTextEditor` baseado em TipTap, usado no editor de artigos (conteúdo e resumo):

- Negrito, itálico, sublinhado, tachado
- Títulos (H2/H3), citação, listas com marcador e numeradas
- Links (inserir/remover), linha divisória, desfazer/refazer
- **Inserir foto no meio do texto**: botão que abre o seletor de arquivos, faz upload e insere a imagem na posição do cursor; a imagem pode ser alinhada e redimensionada (pequena/média/largura total)
- Saída em HTML, compatível com o que já é gravado hoje em `content`/`excerpt`; a exibição pública continua passando pelo saneamento anti-XSS já existente
- Botão "código" para quem quiser editar o HTML manualmente

## 2. Upload de imagens em vez de URL

Um único fluxo de upload reaproveitado em todo o admin:

| Tela | Campo hoje | Depois |
|---|---|---|
| Artigos | Imagem em destaque (URL) | Upload com pré-visualização |
| Artigos | — | Fotos dentro do texto (upload) |
| Livros | Capa (URL) | Upload com pré-visualização |
| Fotografias | URL da imagem | Upload (com múltiplos arquivos de uma vez) |
| Fiabe sonore | MP3 URL | Upload de áudio |

Regras: máx. 10 MB por arquivo, apenas imagens (e áudio nas fiabe), nome de arquivo higienizado, barra de progresso e mensagem de erro clara. Continua sendo possível colar uma URL externa como alternativa.

## 3. Detalhes técnicos

- Os arquivos vão para o bucket privado `media` que já existe no backend Lovable Cloud deste projeto, servidos por URL assinada de longa duração (padrão já implementado em `src/lib/upload.functions.ts`). O backend de conteúdo (`pierina-archive-transfer`) não tem bucket de storage e não será alterado — nenhuma mudança de banco.
- `uploadMedia` precisa de um ajuste: hoje valida o token do projeto Cloud, mas o admin autentica no backend de conteúdo. Passa a validar o token do admin do mesmo modo já usado em `src/lib/newsletter.server.ts` (verifica o usuário e `has_role(admin)` antes de aceitar o arquivo).
- `ImageUpload` / `MultiImageUpload` (já existentes, ainda não usados) passam a ser os componentes padrão dos formulários.
- Dependências novas: `@tiptap/react`, `@tiptap/starter-kit` e extensões de link/imagem/underline.
- Arquivos tocados: `src/components/RichTextEditor.tsx` (novo), `src/components/ImageUpload.tsx`, `src/components/MultiImageUpload.tsx`, `src/lib/upload.functions.ts`, `src/routes/admin.posts.$id.tsx`, `admin.libri.tsx`, `admin.fotografie.tsx`, `admin.fiabe.tsx`, `admin.poesie.tsx`, e o CSS de tipografia do conteúdo publicado.

## 4. Verificação

Login no admin, criar um artigo de teste com negrito, título, lista, link e uma foto no meio do texto; salvar, abrir a página pública e conferir que tudo aparece igual e a imagem carrega.
