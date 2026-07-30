## Objetivo
Deixar claro e acessível como ajustar manualmente a foto da Pierina no hero da home, sem precisar mexer em CSS.

## Estado atual
Já existe um bloco de configuração no topo de `src/routes/index.tsx` chamado `HERO_PHOTO`, com valores separados para mobile e desktop. Ele controla:
- `offsetY` — sobe ou desce a foto (valor negativo sobe, positivo desce)
- `scale` — aumenta ou diminui a foto (`1` = tamanho real, `1.5` = 50% maior)
- `height` — altura do container da foto no mobile
- `translateX` — empurra a foto para a direita no desktop
- `objectPosition` — define qual parte da imagem fica visível (útil porque a foto original é paisagem e a Pierina está à direita)

## Plano
1. **Melhorar os comentários** no bloco `HERO_PHOTO` para explicar, linha a linha, o efeito de cada valor.
2. **Adicionar exemplos práticos** nos comentários, como:
   - "Para subir a foto no celular, diminua o `offsetY` (ex: `-4rem` em vez de `-2rem`)"
   - "Para mostrar mais o rosto, ajuste `objectPosition` para `85% 30%`"
3. **(Opcional)** Criar um arquivo separado `src/config/hero-photo.ts` com o mesmo objeto, importado no `index.tsx`, para facilitar a localização.
4. **Validar** com screenshots mobile e desktop após a documentação, garantindo que os valores atuais continuam funcionando.

## Resultado esperado
A dona do site consegue abrir um único arquivo, entender cada número e ajustar a foto sozinha com segurança.

## Pergunta
Prefere que eu mantenha a configuração dentro de `src/routes/index.tsx` (mais simples) ou crie um arquivo separado `src/config/hero-photo.ts` (mais organizado para ajustes futuros)?