Obiettivo: eliminare gli URL "fantasma" `/blog` e `/poesie` che oggi sono solo redirect a `/scritti`, evitando che Google indicizzi pagine che non esistono come contenuto proprio.

Cosa faremo:

1. **Eliminare i file redirect**
   - `src/routes/blog.tsx`
   - `src/routes/poesie.tsx`
   Questi file non contengono contenuto, solo `redirect({ to: "/scritti" })`.

2. **Aggiornare i link "Torna al blog" dentro l'articolo singolo**
   - In `src/routes/blog.$slug.tsx` cambiare i 3 `to="/blog"` in `to="/scritti"`.
   - I singoli articoli restano accessibili al loro URL `/blog/$slug` (non li tocchiamo).

3. **Aggiornare la sitemap**
   - In `src/routes/sitemap[.]xml.ts` rimuovere le voci statiche `/blog` e `/poesie`.
   - Mantenere le voci dinamiche `/blog/${slug}` per i singoli articoli.

4. **Verificare build e rotte**
   - Eseguire il build per confermare che `routeTree.gen.ts` si rigeneri correttamente.
   - Verificare che `/blog` e `/poesie` restituiscano 404 (così Google le deindicizza).
   - Verificare che `/scritti`, `/blog/$slug` e la sitemap continuino a funzionare.

Nota: non eliminiamo `src/routes/blog.$slug.tsx`, perché i singoli post devono restare raggiungibili ai loro URL originali.