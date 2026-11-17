import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { JOURNAL_ARTICLES } from '../data/editorial';
import { useLang } from '../i18n';
import '../styles/homepage.css';
import '../styles/editorial.css';

const CAT_KEYS = ['all', 'harvest', 'craft', 'community', 'press'];

export default function JournalPage() {
  const { lang, t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cat, setCat] = useState('all');
  const readerRef = useRef(null);

  const activeSlug = searchParams.get('article');
  const activeArticle = useMemo(
    () => JOURNAL_ARTICLES.find((a) => a.slug === activeSlug) || null,
    [activeSlug]
  );

  useEffect(() => {
    if (activeArticle && readerRef.current) {
      readerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeArticle]);

  const counts = useMemo(() => {
    const out = { all: JOURNAL_ARTICLES.length };
    CAT_KEYS.slice(1).forEach((key) => {
      out[key] = JOURNAL_ARTICLES.filter((a) => a.cat === key).length;
    });
    return out;
  }, []);

  const visible = useMemo(
    () =>
      cat === 'all'
        ? JOURNAL_ARTICLES
        : JOURNAL_ARTICLES.filter((a) => a.cat === cat),
    [cat]
  );

  const lead = visible[0] || JOURNAL_ARTICLES[0];
  const rest = visible.slice(1);
  const pressRows = useMemo(
    () => JOURNAL_ARTICLES.filter((a) => a.cat === 'press' || a.cat === 'community'),
    []
  );

  function openArticle(slug) {
    setSearchParams({ article: slug });
  }

  function closeArticle() {
    setSearchParams({});
  }

  return (
    <div className="hp ed-page">
      <PublicHeader />
      <main>
        <section className="hp-shell ed-masthead">
          <p className="ed-meta-line">{t('journal.meta')}</p>
          <h1 className="ed-display-title">{t('journal.title')}</h1>
          <p className="ed-lede">{t('journal.lede')}</p>

          <div className="ed-tabs" role="tablist" aria-label={t('journal.title')}>
            {CAT_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={cat === key}
                className={`ed-tab${cat === key ? ' is-active' : ''}`}
                onClick={() => setCat(key)}
              >
                <span className="ed-tab__label">{t(`journal.categories.${key}`)}</span>
                <span className="ed-tab__count">{counts[key]}</span>
              </button>
            ))}
          </div>
        </section>

        {activeArticle && (
          <section className="hp-shell ed-reader-wrap" ref={readerRef}>
            <article className="ed-reader">
              <div className="ed-reader__bar">
                <div className="ed-reader__meta">
                  <span>{t(`journal.categories.${activeArticle.cat}`)}</span>
                  <span>—</span>
                  <time dateTime={activeArticle.date}>{activeArticle.date}</time>
                  <span>·</span>
                  <span>{activeArticle.location[lang]}</span>
                  <span>·</span>
                  <span>{activeArticle.readTime[lang]}</span>
                </div>
                <button
                  type="button"
                  className="ed-reader__close"
                  onClick={closeArticle}
                >
                  {t('journal.closeArticle')} ×
                </button>
              </div>

              <h2 className="ed-reader__title">{activeArticle.title[lang]}</h2>
              <p className="ed-reader__standfirst">{activeArticle.excerpt[lang]}</p>

              <figure className="ed-reader__figure">
                <img src={activeArticle.img} alt={activeArticle.title[lang]} />
              </figure>

              <div className="ed-reader__prose">
                {activeArticle.paragraphs[lang].map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>
          </section>
        )}

        {lead && (
          <section className="hp-shell ed-journal-lead">
            <article className="ed-lead-story">
              <figure className="ed-lead-story__media">
                <img src={lead.img} alt={lead.title[lang]} />
              </figure>
              <div className="ed-lead-story__copy">
                <p className="ed-story-meta">
                  <span>{t(`journal.categories.${lead.cat}`)}</span>
                  <span>—</span>
                  <time dateTime={lead.date}>{lead.date}</time>
                  <span>·</span>
                  <span>{lead.readTime[lang]}</span>
                </p>
                <h2>{lead.title[lang]}</h2>
                <p className="ed-lead-story__excerpt">{lead.excerpt[lang]}</p>
                <button
                  type="button"
                  className="ed-inline-link ed-inline-link--btn"
                  onClick={() => openArticle(lead.slug)}
                >
                  <span>{t('journal.readArticle')}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </article>
          </section>
        )}

        {rest.length > 0 && (
          <section className="hp-shell ed-journal-stories">
            <h2 className="ed-subhead">{t('journal.storiesHead')}</h2>
            <div className="ed-story-pairs">
              {rest.map((story) => (
                <article className="ed-story-card" key={story.slug}>
                  <figure
                    className="ed-story-card__media"
                    onClick={() => openArticle(story.slug)}
                  >
                    <img src={story.img} alt={story.title[lang]} loading="lazy" />
                  </figure>
                  <div className="ed-story-card__body">
                    <p className="ed-story-meta">
                      <span>{t(`journal.categories.${story.cat}`)}</span>
                      <span>—</span>
                      <time dateTime={story.date}>{story.date}</time>
                    </p>
                    <h3>
                      <button
                        type="button"
                        className="ed-story-card__title-btn"
                        onClick={() => openArticle(story.slug)}
                      >
                        {story.title[lang]}
                      </button>
                    </h3>
                    <p className="ed-story-card__excerpt">{story.excerpt[lang]}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="hp-shell ed-journal-ledger">
          <h2 className="ed-subhead">{t('journal.ledgerHead')}</h2>
          <ul className="ed-press-rows">
            {pressRows.map((item) => (
              <li key={item.slug}>
                <time dateTime={item.date}>{item.date}</time>
                <button
                  type="button"
                  onClick={() => openArticle(item.slug)}
                >
                  {item.title[lang]}
                </button>
                <span>{item.location[lang]}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
