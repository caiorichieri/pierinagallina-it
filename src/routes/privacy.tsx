import { createFileRoute } from "@tanstack/react-router";
import { useT } from "../i18n";
import { PageHero } from "../components/PageHero";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Informativa Privacy — FriuliOn di Silvestre Richieri Caio" },
      {
        name: "description",
        content:
          "Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).",
      },
      { property: "og:title", content: "Informativa Privacy — FriuliOn di Silvestre Richieri Caio" },
      {
        property: "og:description",
        content:
          "Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).",
      },
      { property: "og:url", content: "https://piergiorgioiacuzzo.it/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://piergiorgioiacuzzo.it/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { lang } = useT();
  const it = lang === "it";
  return (
    <>
      <PageHero
        eyebrow={it ? "Note legali" : "Legal"}
        title={it ? "Informativa Privacy" : "Privacy Policy"}
        intro={
          it
            ? "Informazioni sul trattamento dei dati personali ai sensi degli artt. 13-14 del Regolamento UE 2016/679 (GDPR)."
            : "Information on the processing of personal data pursuant to articles 13-14 of EU Regulation 2016/679 (GDPR)."
        }
      />
      <article className="prose-legal mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
          {it ? "Ultimo aggiornamento: 11 giugno 2026" : "Last update: 11 June 2026"}
        </p>

        {it ? <ContentIT /> : <ContentEN />}
      </article>
    </>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 font-serif text-2xl text-foreground">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-foreground/85">{children}</p>;
}
function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/85">{children}</ul>;
}

function ContentIT() {
  return (
    <>
      <H>1. Titolare del trattamento</H>
      <P>
        Titolare del trattamento dei dati è <strong>Piergiorgio Iacuzzo</strong>, Via Piave 91, 33033
        Codroipo (UD), Italia — C.F. CZZPGR66A24C817Q.
      </P>
      <P>
        Per esercitare i propri diritti o per qualsiasi richiesta in materia di protezione dei dati è
        possibile scrivere all'indirizzo di contatto presente nella sezione{" "}
        <a href="/contatti" className="underline hover:text-accent">Contatti</a> del sito.
      </P>

      <H>2. Tipologie di dati raccolti</H>
      <P>
        Il sito raccoglie i dati personali forniti volontariamente dall'utente tramite il modulo di
        contatto (nome, cognome, indirizzo email, oggetto, contenuto del messaggio) e,
        previo consenso, dati di navigazione tramite cookie di terze parti (vedi Cookie Policy).
      </P>
      <P>
        I dati di navigazione (indirizzo IP, log tecnici) sono raccolti automaticamente dai sistemi
        informatici per il solo tempo necessario alla diagnostica e alla sicurezza del sito.
      </P>

      <H>3. Finalità e base giuridica</H>
      <UL>
        <li>
          <strong>Riscontro a richieste tramite form di contatto</strong> — base giuridica:
          esecuzione di misure precontrattuali e legittimo interesse del Titolare a rispondere
          (art. 6, par. 1, lett. b e f GDPR).
        </li>
        <li>
          <strong>Cookie tecnici e statistici anonimizzati</strong> — base giuridica: legittimo
          interesse (art. 6, par. 1, lett. f GDPR).
        </li>
        <li>
          <strong>Cookie analitici di terze parti e profilazione</strong> — base giuridica:
          consenso dell'interessato (art. 6, par. 1, lett. a GDPR).
        </li>
      </UL>

      <H>4. Periodo di conservazione</H>
      <P>
        I messaggi inviati tramite il form sono conservati per il tempo strettamente necessario a
        dare riscontro e, comunque, non oltre 24 mesi, salvo obblighi di legge. I log tecnici sono
        conservati per un massimo di 12 mesi. I dati raccolti tramite cookie sono conservati per la
        durata indicata nella Cookie Policy.
      </P>

      <H>5. Destinatari dei dati</H>
      <P>
        I dati possono essere trattati da soggetti debitamente nominati Responsabili del trattamento
        (es. fornitore di hosting cloud, servizio di posta elettronica) e non sono diffusi né
        comunicati a terzi salvo obblighi di legge.
      </P>

      <H>6. Trasferimento extra UE</H>
      <P>
        Alcuni fornitori di servizi (es. provider di hosting o di analytics) possono trasferire dati
        verso Paesi extra UE. In tal caso il trasferimento avviene sulla base di garanzie adeguate
        previste dagli artt. 44 ss. GDPR (decisioni di adeguatezza o clausole contrattuali
        standard).
      </P>

      <H>7. Diritti dell'interessato</H>
      <P>
        In qualsiasi momento l'utente ha diritto di:
      </P>
      <UL>
        <li>accedere ai propri dati personali e ottenerne copia (art. 15);</li>
        <li>chiederne la rettifica (art. 16) o la cancellazione (art. 17);</li>
        <li>chiedere la limitazione del trattamento (art. 18);</li>
        <li>ricevere i dati in formato strutturato e portabile (art. 20);</li>
        <li>opporsi al trattamento basato sul legittimo interesse (art. 21);</li>
        <li>revocare in qualsiasi momento il consenso prestato, senza pregiudicare la liceità del trattamento basata sul consenso prima della revoca;</li>
        <li>proporre reclamo all'Autorità Garante per la protezione dei dati personali (www.garanteprivacy.it).</li>
      </UL>

      <H>8. Natura del conferimento</H>
      <P>
        Il conferimento dei dati richiesti dal modulo di contatto è facoltativo; il mancato
        conferimento dei dati contrassegnati come obbligatori (nome, email, messaggio) rende
        impossibile dare riscontro alla richiesta.
      </P>

      <H>9. Modifiche</H>
      <P>
        La presente informativa può essere aggiornata in qualsiasi momento. La versione vigente è
        quella pubblicata in questa pagina.
      </P>
    </>
  );
}

function ContentEN() {
  return (
    <>
      <H>1. Data controller</H>
      <P>
        The data controller is <strong>Piergiorgio Iacuzzo</strong>, Via Piave 91, 33033 Codroipo
        (UD), Italy — Tax code CZZPGR66A24C817Q.
      </P>
      <P>
        To exercise your rights or for any data-protection request, please use the contact address
        in the <a href="/contatti" className="underline hover:text-accent">Contact</a> section.
      </P>

      <H>2. Categories of data collected</H>
      <P>
        The website collects personal data voluntarily provided through the contact form (name,
        email, subject, message) and, with your consent, browsing data via third-party cookies (see
        Cookie Policy). Navigation data (IP address, technical logs) is collected automatically and
        kept only for the time necessary for diagnostics and security.
      </P>

      <H>3. Purposes and legal basis</H>
      <UL>
        <li><strong>Replying to enquiries via the contact form</strong> — pre-contractual measures and legitimate interest (Art. 6(1)(b) and (f) GDPR).</li>
        <li><strong>Technical and anonymised statistical cookies</strong> — legitimate interest (Art. 6(1)(f) GDPR).</li>
        <li><strong>Third-party analytics and profiling cookies</strong> — user consent (Art. 6(1)(a) GDPR).</li>
      </UL>

      <H>4. Retention period</H>
      <P>
        Messages sent via the form are kept for the time strictly needed to reply and in any case
        no longer than 24 months, save for legal obligations. Technical logs are kept up to 12
        months. Cookie data is retained for the duration indicated in the Cookie Policy.
      </P>

      <H>5. Recipients</H>
      <P>
        Data may be processed by parties duly appointed as Data Processors (e.g. cloud hosting
        provider, email service) and is not disclosed to third parties except where required by law.
      </P>

      <H>6. Non-EU transfers</H>
      <P>
        Some service providers may transfer data outside the EU. Such transfers take place under
        adequate safeguards (adequacy decisions or Standard Contractual Clauses) as required by
        Arts. 44 ff. GDPR.
      </P>

      <H>7. Your rights</H>
      <UL>
        <li>access to your data and to obtain a copy (Art. 15);</li>
        <li>rectification (Art. 16) or erasure (Art. 17);</li>
        <li>restriction of processing (Art. 18);</li>
        <li>data portability (Art. 20);</li>
        <li>object to processing based on legitimate interest (Art. 21);</li>
        <li>withdraw your consent at any time;</li>
        <li>lodge a complaint with the Italian Data Protection Authority (www.garanteprivacy.it).</li>
      </UL>

      <H>8. Mandatory data</H>
      <P>
        Providing the requested data is optional; failure to provide the data marked as required
        (name, email, message) makes it impossible to reply.
      </P>

      <H>9. Changes</H>
      <P>
        This policy may be updated at any time. The version in force is the one published on this
        page.
      </P>
    </>
  );
}
