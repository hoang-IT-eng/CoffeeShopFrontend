import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { CIRCULAR_FLOWS, MICRO_LOTS } from '../data/editorial';
import { useLang } from '../i18n';
import '../styles/homepage.css';
import '../styles/editorial.css';

export default function SustainabilityPage() {
  const { lang, t } = useLang();
  const [lotId, setLotId] = useState(MICRO_LOTS[0].id);

  const pillars = t('home.sustain.chapters');
  const stats = t('home.sustain.stats');
  const roadmap = t('sustainabilityPage.roadmap');
  const activeLot = MICRO_LOTS.find((l) => l.id === lotId) || MICRO_LOTS[0];

  return (
    <div className="hp ed-page">
      <PublicHeader />
      <main>
        <section className="hp-shell ed-masthead">
          <p className="ed-meta-line">{t('sustainabilityPage.meta')}</p>
          <h1 className="ed-display-title">{t('sustainabilityPage.title')}</h1>
          <p className="ed-lede">{t('sustainabilityPage.lede')}</p>

          <figure className="ed-lead-figure">
            <img
              src="/img/harvest-hands.jpg"
              alt={t('sustainabilityPage.title')}
              width={1280}
              height={896}
            />
          </figure>

          <div className="hp-stats ed-sustain-stats" role="list">
            {stats.map((stat) => (
              <div className="hp-stat" role="listitem" key={stat.label}>
                <p className="hp-stat__value">
                  <span>{stat.value.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')}</span>
                  <span className="hp-stat__suffix">{stat.suffix}</span>
                </p>
                <p className="hp-stat__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="hp-section hp-section--foam">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('sustainabilityPage.pillarsHead')}</h2>
            </div>

            <div className="hp-chapters">
              {pillars.map((chapter) => (
                <article className="hp-chapter" key={chapter.index}>
                  <p className="hp-chapter__index">{chapter.index}</p>
                  <div>
                    <p className="hp-chapter__title">{chapter.title}</p>
                    <h3>{chapter.heading}</h3>
                    <p className="hp-chapter__body">{chapter.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hp-section" id="micro-lots">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('sustainabilityPage.microHead')}</h2>
              <p>{t('sustainabilityPage.microSub')}</p>
            </div>

            <div className="ed-tabs" role="tablist" aria-label={t('sustainabilityPage.microHead')}>
              {MICRO_LOTS.map((lot) => (
                <button
                  key={lot.id}
                  type="button"
                  role="tab"
                  aria-selected={lot.id === activeLot.id}
                  className={`ed-tab${lot.id === activeLot.id ? ' is-active' : ''}`}
                  onClick={() => setLotId(lot.id)}
                >
                  <span className="ed-tab__num">{lot.code}</span>
                  <span className="ed-tab__label">{lot.name[lang]}</span>
                </button>
              ))}
            </div>

            <div className="ed-microlot" role="tabpanel">
              <figure className="ed-microlot__media">
                <img src={activeLot.img} alt={activeLot.name[lang]} loading="lazy" />
                <figcaption>
                  <strong>{activeLot.code}</strong>
                  <span>{activeLot.region[lang]}</span>
                </figcaption>
              </figure>

              <div className="ed-microlot__copy">
                <h3>{activeLot.name[lang]}</h3>
                <p className="ed-microlot__story">{activeLot.story[lang]}</p>

                <p className="ed-microlot__notes-head">
                  {t('sustainabilityPage.tastingLabel')}
                </p>
                <ol className="ed-numbered-notes">
                  {activeLot.notes.map((note, idx) => (
                    <li key={note.en}>
                      <span>(0{idx + 1})</span>
                      <p>{note[lang]}</p>
                    </li>
                  ))}
                </ol>

                <div className="ed-microlot__foot">
                  <Link className="ed-inline-link" to="/products">
                    <span>{t('nav.products')}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ed-dark-band">
          <div className="hp-shell">
            <div className="ed-dark-band__head">
              <h2>{t('sustainabilityPage.circularHead')}</h2>
              <p>{t('sustainabilityPage.circularSub')}</p>
            </div>

            <figure className="ed-dark-band__media">
              <img
                src="/img/circular-compost.jpg"
                alt={t('sustainabilityPage.circularHead')}
                loading="lazy"
              />
            </figure>

            <div className="ed-circular-grid">
              {CIRCULAR_FLOWS.map((flow) => (
                <article className="ed-circular-cell" key={flow.code}>
                  <div className="ed-circular-cell__top">
                    <span>{flow.code}</span>
                    <strong>{flow.metric[lang]}</strong>
                  </div>
                  <h3>{flow.title[lang]}</h3>
                  <p>{flow.body[lang]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hp-section">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('sustainabilityPage.roadmapHead')}</h2>
            </div>

            <ol className="ed-roadmap">
              {roadmap.map((step) => (
                <li key={step.period}>
                  <p className="ed-roadmap__period">{step.period}</p>
                  <p className="ed-roadmap__phase">{step.phase}</p>
                  <h3>{step.title}</h3>
                  <p className="ed-roadmap__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
