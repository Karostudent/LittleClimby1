import { useState } from 'react';
import { BackLink, usePageTitle } from '../ui';

export function PartnerPortal() {
  usePageTitle('Partnerportal');
  const [sent, setSent] = useState(false);

  return (
    <div className="page page-narrow">
      <BackLink to="/partnere">Til partnertilbudene</BackLink>
      <div className="stack" style={{ gap: 8 }}>
        <p className="eyebrow">Partnerportal · for kafeer, kurs og arrangører</p>
        <h1 tabIndex={-1}>Legg inn et tilbud</h1>
        <p>Vi går gjennom alle tilbud før de blir synlige. Felt merket * må fylles ut.</p>
      </div>

      <form className="stack" style={{ gap: 16 }} onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
        <label className="field">Navn på virksomhet *
          <input className="input" type="text" placeholder="For eksempel Lille Kafé" required autoComplete="organization" />
        </label>
        <label className="field">Type tilbud *
          <select className="input" required defaultValue="">
            <option value="" disabled>Velg type</option>
            <option>Kurs</option>
            <option>Aktivitet</option>
            <option>Arrangement</option>
          </select>
        </label>
        <label className="field">Beskriv tilbudet *
          <span className="hint">Kort og konkret. Ikke helseråd.</span>
          <textarea className="input" rows={4} placeholder="Hva skjer, for hvem og hvor lenge" required />
        </label>
        <div className="grid-2">
          <label className="field">Pris *
            <input className="input" type="text" inputMode="numeric" placeholder="250 kr" required />
          </label>
          <label className="field">Plasser
            <input className="input" type="number" min={1} placeholder="12" />
          </label>
        </div>
        <fieldset className="fieldset-box">
          <legend>Fasiliteter dere har</legend>
          <p className="hint">Vi kontrollerer opplysningene før de vises som «Ja» i appen.</p>
          <label className="check"><input type="checkbox" />Stellerom</label>
          <label className="check"><input type="checkbox" />Stellerom for alle omsorgspersoner</label>
          <label className="check"><input type="checkbox" />Plass til barnevogn</label>
          <label className="check"><input type="checkbox" />Trappefri adkomst</label>
        </fieldset>
        <label className="check"><input type="checkbox" required />Jeg godtar at tilbudet merkes «Annonse», og at Enklere babyliv får provisjon ved booking. *</label>
        <button className="btn btn-primary" type="submit">Send til vurdering</button>
        <div role="status">{sent && <p className="status-msg">Dette er en demo. Ingenting er sendt, men slik får partneren beskjed om at tilbudet er mottatt.</p>}</div>
      </form>
    </div>
  );
}
