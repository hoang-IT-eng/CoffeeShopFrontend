import { useState } from 'react';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { B2B_LINES, B2B_MACHINES } from '../data/editorial';
import { useLang } from '../i18n';
import '../styles/homepage.css';
import '../styles/editorial.css';

export default function BusinessSolutionsPage() {
  const { lang, t } = useLang();
  const [lineId, setLineId] = useState(B2B_LINES[0].id);
  const [machineGroup, setMachineGroup] = useState('all');
  const [submitted, setSubmitted] = useState(false);

  const activeLine = B2B_LINES.find((l) => l.id === lineId) || B2B_LINES[0];
  const visibleMachines =
    machineGroup === 'all'
      ? B2B_MACHINES
      : B2B_MACHINES.filter((m) => m.group === machineGroup);

  const services = t('business.services');

  function onSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="hp ed-page">
      <PublicHeader />
      <main>
        <section className="hp-shell ed-masthead">
          <div className="ed-b2b-hero">
            <div>
              <p className="ed-meta-line">{t('business.meta')}</p>
              <h1 className="ed-display-title">{t('business.title')}</h1>
              <p className="ed-lede">{t('business.lede')}</p>
              <div className="ed-b2b-hero__actions">
                <a className="hp-btn hp-btn--primary" href="#b2b-inquiry">
                  {t('business.ctaPrimary')}
                </a>
                <a className="hp-btn hp-btn--ghost" href="tel:19006886">
                  {t('business.ctaSecondary')}
                </a>
              </div>
            </div>

            <figure className="ed-b2b-hero__figure">
              <img
                src="/img/b2b-espresso.jpg"
                alt={t('business.title')}
                width={1200}
                height={680}
              />
            </figure>
          </div>
        </section>

        <section className="hp-section hp-section--foam">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('business.linesHead')}</h2>
              <p>{t('business.linesSub')}</p>
            </div>

            <div className="ed-tabs" role="tablist" aria-label={t('business.linesHead')}>
              {B2B_LINES.map((line, idx) => (
                <button
                  key={line.id}
                  type="button"
                  role="tab"
                  aria-selected={line.id === activeLine.id}
                  className={`ed-tab${line.id === activeLine.id ? ' is-active' : ''}`}
                  onClick={() => setLineId(line.id)}
                >
                  <span className="ed-tab__num">0{idx + 1}</span>
                  <span className="ed-tab__label">{line.tab[lang]}</span>
                </button>
              ))}
            </div>

            <div className="ed-b2b-stage" role="tabpanel">
              <div className="ed-b2b-stage__main">
                <h3>{activeLine.title[lang]}</h3>
                <p>{activeLine.desc[lang]}</p>
              </div>
              <dl className="ed-spec-list">
                {activeLine.specs.map((row) => (
                  <div key={row.k.en}>
                    <dt>{row.k[lang]}</dt>
                    <dd>{row.v[lang]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="hp-section">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('business.machinesHead')}</h2>
              <p>{t('business.machinesSub')}</p>
            </div>

            <div className="ed-subfilters" role="group" aria-label={t('business.machinesHead')}>
              <button
                type="button"
                className={`ed-subfilter${machineGroup === 'all' ? ' is-active' : ''}`}
                onClick={() => setMachineGroup('all')}
              >
                {t('business.machineFilterAll')}
              </button>
              {B2B_MACHINES.map((m) => (
                <button
                  key={m.group}
                  type="button"
                  className={`ed-subfilter${machineGroup === m.group ? ' is-active' : ''}`}
                  onClick={() => setMachineGroup(m.group)}
                >
                  {m.groupLabel[lang]}
                </button>
              ))}
            </div>

            <div className="ed-machine-list">
              {visibleMachines.map((machine) => (
                <article className="ed-machine-row" key={machine.num}>
                  <span className="ed-machine-row__num">{machine.num}</span>
                  <div className="ed-machine-row__info">
                    <p className="ed-machine-row__venue">{machine.venue[lang]}</p>
                    <h3>{machine.model}</h3>
                    <p>{machine.summary[lang]}</p>
                  </div>
                  <ul className="ed-machine-row__specs">
                    {machine.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hp-section hp-section--foam">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('business.servicesHead')}</h2>
            </div>

            <div className="ed-service-ledger">
              {services.map((svc) => (
                <article className="ed-service-cell" key={svc.num}>
                  <span className="ed-service-cell__num">{svc.num}</span>
                  <h3>{svc.title}</h3>
                  <p>{svc.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hp-section hp-section--ink" id="b2b-inquiry">
          <div className="hp-shell hp-book">
            <div className="hp-book__copy">
              <h2>{t('business.formHead')}</h2>
              <p>{t('business.formSub')}</p>
              <ul className="hp-book__list">
                <li>4 × 100 g {lang === 'vi' ? 'mẫu hạt rang trong tuần' : 'freshly roasted sample lots'}</li>
                <li>{lang === 'vi' ? 'Bảng giá sỉ theo bậc sản lượng 10 – 100 kg' : 'Tiered wholesale sheet from 10 to 100 kg'}</li>
                <li>{lang === 'vi' ? 'Buổi thử máy & căn chỉnh cối xay tại xưởng Tân Bình' : 'Hands-on machine & grinder session at Tan Binh roastery'}</li>
              </ul>
            </div>

            <form className="hp-form" onSubmit={onSubmit}>
              <div className="hp-field">
                <label htmlFor="b2b-company">{t('business.fields.company')}</label>
                <input
                  id="b2b-company"
                  name="company"
                  type="text"
                  placeholder={t('business.fields.companyPh')}
                  required
                />
              </div>

              <div className="hp-form__row">
                <div className="hp-field">
                  <label htmlFor="b2b-contact">{t('business.fields.contact')}</label>
                  <input
                    id="b2b-contact"
                    name="contact"
                    type="text"
                    placeholder={t('business.fields.contactPh')}
                    required
                  />
                </div>
                <div className="hp-field">
                  <label htmlFor="b2b-phone">{t('business.fields.phone')}</label>
                  <input
                    id="b2b-phone"
                    name="phone"
                    type="tel"
                    placeholder={t('business.fields.phonePh')}
                    required
                  />
                </div>
              </div>

              <div className="hp-form__row">
                <div className="hp-field">
                  <label htmlFor="b2b-segment">{t('business.fields.segment')}</label>
                  <select id="b2b-segment" name="segment" defaultValue="0">
                    {t('business.fields.segments').map((seg, i) => (
                      <option key={seg} value={String(i)}>
                        {seg}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hp-field">
                  <label htmlFor="b2b-volume">{t('business.fields.volume')}</label>
                  <select id="b2b-volume" name="volume" defaultValue="0">
                    {t('business.fields.volumes').map((vol, i) => (
                      <option key={vol} value={String(i)}>
                        {vol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="hp-field">
                <label htmlFor="b2b-notes">{t('business.fields.notes')}</label>
                <textarea
                  id="b2b-notes"
                  name="notes"
                  rows={3}
                  placeholder={t('business.fields.notesPh')}
                />
              </div>

              <button className="hp-btn hp-btn--brass hp-btn--block" type="submit">
                {t('business.fields.submit')}
              </button>

              {submitted && (
                <p className="hp-form__msg" role="status">
                  {t('business.fields.success')}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
