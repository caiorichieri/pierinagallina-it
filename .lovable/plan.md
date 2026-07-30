## Problema
- **Mobile**: a foto da Pierina ainda fica longe dos botões no hero.
- **Desktop**: a foto está cortando levemente a cabeça dela.
- **Pergunta**: o usuário quer saber se consegue ajustar a posição da foto sozinho.

## Plano

1. **Criar configuração ajustável no topo da página**
   - Em `src/routes/index.tsx`, adicionar um objeto `HERO_PHOTO` com valores editáveis:
     - `mobile.offsetY` (ex: `'-4rem'`)
     - `mobile.scale` (ex: `2.3`)
     - `desktop.offsetY` (ex: `'-2rem'`)
     - `desktop.scale` (ex: `1.9`)
     - `desktop.translateX` (ex: `'5cm'`)
   - Assim o usuário pode mexer apenas nesses números sem precisar entender o resto do código.

2. **Corrigir a posição no mobile**
   - Aumentar o `scale` e subir a foto com `translate-y` negativo ou `margin-top` negativo.
   - Garantir que a foto não sobreponha o texto dos botões, mas fique bem próxima.

3. **Corrigir o corte da cabeça no desktop**
   - Reduzir o `scale` da foto para que ela caiba melhor no container.
   - Ajustar `object-position` para `top center` ou mover a origem da transformação.
   - Revisar o tamanho/overflow do container para evitar cortes verticais.

4. **Verificação visual**
   - Tirar screenshots no preview em viewport mobile (375×812) e desktop (1280×892).
   - Validar que a cabeça está visível no desktop e que a foto fica logo abaixo dos botões no mobile.

## Arquivos envolvidos
- `src/routes/index.tsx`
- `src/styles.css` (se for necessário ajustar a máscara `.fade-bottom`)

## Resultado esperado
Hero ajustado nos dois viewports e com parâmetros de posicionamento centralizados e fáceis de editar no topo do arquivo.