import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Lenis from 'lenis';
import CoffeeCycleSection from '../components/CoffeeCycleSection';
import FrameStory from '../components/FrameStory';
import { PublicFooter, PublicHeader, SensoryBar } from '../components/PublicChrome';
import { JOURNAL_ARTICLES, QUIZ_STEPS, resolveQuizProfile } from '../data/editorial';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { formatPrice, useLang } from '../i18n';
import '../styles/homepage.css';
import '../styles/editorial.css';

const MENU_IMGS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC117OxdRy2nel927BqAp30l75gOBC-YE17MqQYUgdaZa9lf6ToZvvXMpBY5h7ZB82Z7XXYNx3LZs1ufRC5KnqV8aWg6hM4f0zdjMy4OmtvhMZOAd8fB4H9YwoLVZH8HcGJJpzK9hW8L1d4iNRDzKe5FqwwxvKOchxlNvGjxKR2-xR2QNdjQ250ifqN47goKwYOhlbwrBaTvnPxDlmpNanXrcJQy_g8iTkwPUX8julgRcA9bvMOChJaFQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB-S8GufDfjMVNHJZU6eEYPKpWeY4hG8FlE6dJgfZ_En81MYwDBRP2C_ipMlLS2qFq-GHUqhLNN3e3pFMrCxeaYGa_B_KQRk1M43ZFDFmu5imzNKZiis_WIVTzrTXsPhcwB0h5JQf45IQxfTFDmtqkuC1-TNe-QE37eLGltHQULkfBi7DTrAwfXGG7SCzjjZxbaEpDJb3OXQPKkHCwtO9xLwiMvH-DvZcHO66sxhG3ASKCdnvh1V3EpjQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC3XmI8F4VFwDAPGLE4p5T1wVUse3TM6HBapgmR5G0LHgyqEQM8K1GOq_EWuIjmzckB4iOq_eoGJIhX_NTuG63cORveVtmWrCfMAX_Ie9e6Hb40V-13jwHVetI9UzuPvGGObJR4SkpEquSUcieehcTrz5Ta6mCjZTlEWBWJQX8U3u-G4xwGlZ13zq53BIFpt5t5iS7pOo1YXPyfclLHWAkW4ojy2-WTNY6aJKFkn6Ixoy_do2WBLxg-og',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAXM9OH7D2rKMTXz6Lo8PlKwn4wHGQkDE58G7cBHqa5yU4xUPIzIWttFnGq3-kmispic2gdKl4d7PNNT4K2Ubyet6jcTuWx8QdkOCmEoa6d3MPLPoskItQi6kRZtbEP2s1QpeK4dfnw6MZrW8NuVTurdrVi6MkpjmKcvRAPF56o0t7K7JRdopB1QYrTLnhVnuaUl6qb4rKrdrkgmfeUjtnHiul-axPjtGg1vbib_MmvOl7aYvAbP7vwyw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAKOvn7OWVJ5avDEcc7_MXkkxBUqP89EDGxkJYf3-VC1UikBLlzjgdLhL4xGB9GknBKFiliZCXPLyJI4qP6sVgZadpCC2zKuni5f7Q6Z2fCDLWysHNnUeBxZgDBrfIQfdHyE_Oa4i_exB5mQy4lFCr5njWQ9wLgMx4yg8878BIpER2AXtz6IDUF-knDGr2PNS_u-dPvIxcditoK9c4U9ayRZPLQFf7u3lQInERB5Q7KtkHXj_B6DHKRUw',
];

export default function HomePage() {
  const rootRef = useRef(null);
  const [added, setAdded] = useState({});
  const [booked, setBooked] = useState(false);

  /* Landing product showcase tabs (Delta Cafés inspired) */
  const [activeCat, setActiveCat] = useState('bean');
  const [activeProdId, setActiveProdId] = useState('cau-dat-honey');

  /* Coffee Profile Quiz state */
  const [quizAnswers, setQuizAnswers] = useState({
    ritual: 'phin',
    palate: 'nutty',
    style: 'milk'
  });

  const { lang, t } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;

  const MENU = t('home.menu.items').map((item, i) => ({ ...item, img: MENU_IMGS[i] }));
  const SUSTAIN_STATS = t('home.sustain.stats');
  const SUSTAIN_CHAPTERS = t('home.sustain.chapters');
  const JOURNEY = t('home.sustain.journey');
  const COMMITMENTS = t('home.story.items');

  const catProducts = useMemo(
    () => PRODUCTS.filter((p) => p.cat === activeCat),
    [activeCat]
  );

  const featuredProduct = useMemo(
    () => catProducts.find((p) => p.id === activeProdId) || catProducts[0],
    [catProducts, activeProdId]
  );

  const matchedProfile = useMemo(
    () => resolveQuizProfile(quizAnswers),
    [quizAnswers]
  );

  const matchedProduct = useMemo(
    () =>
      PRODUCTS.find((p) => p.id === matchedProfile.productId) || PRODUCTS[0],
    [matchedProfile]
  );

  const leadJournal = JOURNAL_ARTICLES[0];
  const sideJournals = JOURNAL_ARTICLES.slice(1, 4);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const drifts = root.querySelectorAll('[data-drift]');
    let lenis;

    const paint = (scrollY) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      root.style.setProperty('--hp-progress', progress.toFixed(4));

      drifts.forEach((node) => {
        const speed = Number(node.dataset.drift) || 0.08;
        const rect = node.getBoundingClientRect();
        const shift = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        node.style.setProperty('--drift', `${(-shift).toFixed(1)}px`);
      });
    };

    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-seen');
          seen.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );
    root.querySelectorAll('.hp-menu-item').forEach((item, index) => {
      item.style.setProperty('--hp-i', String(index));
      seen.observe(item);
    });
    root.querySelectorAll('.hp-reveal').forEach((item, index) => {
      item.style.setProperty('--hp-i', String(index % 6));
      seen.observe(item);
    });

    const wholeFmt = {
      format: (n) =>
        new Intl.NumberFormat(langRef.current === 'vi' ? 'vi-VN' : 'en-US', {
          maximumFractionDigits: 0
        }).format(n)
    };
    const counted = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          counted.unobserve(entry.target);
          const node = entry.target;
          const target = Number(node.dataset.count) || 0;
          if (reduce) {
            node.textContent = wholeFmt.format(target);
            return;
          }
          const started = performance.now();
          const duration = 1500;
          const stepCount = (now) => {
            const p = Math.min(1, (now - started) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            node.textContent = wholeFmt.format(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(stepCount);
          };
          requestAnimationFrame(stepCount);
        });
      },
      { threshold: 0.4 }
    );
    root.querySelectorAll('.hp-stat__num[data-count]').forEach((node) => counted.observe(node));

    const onAnchor = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || !root.contains(link)) return;
      const hash = link.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -76, duration: 1.1 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    root.addEventListener('click', onAnchor);

    if (reduce) {
      const onScroll = () => paint(window.scrollY);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        root.removeEventListener('click', onAnchor);
        seen.disconnect();
        counted.disconnect();
      };
    }

    document.documentElement.classList.add('lenis');
    lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.05
    });
    const onLenisScroll = (event) => paint(event.scroll);
    lenis.on('scroll', onLenisScroll);
    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    paint(window.scrollY);

    return () => {
      gsap.ticker.remove(tick);
      root.removeEventListener('click', onAnchor);
      seen.disconnect();
      counted.disconnect();
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  function onAdd(key) {
    setAdded((prev) => ({ ...prev, [key]: true }));
    window.setTimeout(() => {
      setAdded((prev) => ({ ...prev, [key]: false }));
    }, 1300);
  }

  function onBook(event) {
    event.preventDefault();
    setBooked(true);
  }

  function handleSelectCategory(cat) {
    setActiveCat(cat);
    const first = PRODUCTS.find((p) => p.cat === cat);
    if (first) setActiveProdId(first.id);
  }

  return (
    <div className="hp ed-page" ref={rootRef}>
      <div className="hp-rail" aria-hidden="true">
        <span className="hp-rail__fill" />
      </div>

      <PublicHeader />

      <main id="top">
        <FrameStory />

        <section className="hp-section hp-section--foam">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('home.pillars.head')}</h2>
              <p>{t('home.pillars.sub')}</p>
            </div>
            <div className="hp-pillars">
              {t('home.pillars.items').map((pillar) => (
                <article className="hp-pillar" key={pillar.title}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                  <span className="hp-pillar__meta">{pillar.meta}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --- Delta-inspired Tabbed Product & Origin Showcase on Landing --- */}
        <section className="hp-section" id="san-pham">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('home.catalog.head')}</h2>
              <p>{t('home.catalog.sub')}</p>
            </div>

            <div className="ed-tabs" role="tablist" aria-label={t('home.catalog.head')}>
              {CATEGORIES.map((cat) => {
                const count = PRODUCTS.filter((p) => p.cat === cat).length;
                const isSelected = activeCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`ed-tab${isSelected ? ' is-active' : ''}`}
                    onClick={() => handleSelectCategory(cat)}
                  >
                    <span className="ed-tab__label">{t(`products.categories.${cat}.label`)}</span>
                    <span className="ed-tab__count">{count}</span>
                  </button>
                );
              })}
            </div>

            {featuredProduct && (
              <div className="ed-home-showcase" role="tabpanel">
                <article className="ed-specimen">
                  <div className="ed-specimen__media">
                    <img
                      src={featuredProduct.img}
                      alt={featuredProduct.name[lang]}
                      width={720}
                      height={540}
                      loading="lazy"
                    />
                    {featuredProduct.tag && (
                      <span className="ed-item__tag">{featuredProduct.tag[lang]}</span>
                    )}
                  </div>

                  <div className="ed-specimen__body">
                    <div className="ed-item__meta">
                      <span>{featuredProduct.origin[lang]}</span>
                      <span>{featuredProduct.unit[lang]}</span>
                    </div>

                    <h3>{featuredProduct.name[lang]}</h3>
                    <p className="ed-item__notes">{featuredProduct.notes[lang]}</p>
                    <p className="ed-specimen__desc">{featuredProduct.desc[lang]}</p>

                    {featuredProduct.roast != null && (
                      <div className="ed-item__meters">
                        <SensoryBar
                          label={t('home.catalog.roastLabel')}
                          value={featuredProduct.roast}
                        />
                        <SensoryBar
                          label={t('home.catalog.intensityLabel')}
                          value={featuredProduct.intensity}
                        />
                        <SensoryBar
                          label={t('home.catalog.acidityLabel')}
                          value={featuredProduct.acidity}
                        />
                      </div>
                    )}

                    <p className="ed-specimen__brew">
                      <strong>{t('home.catalog.brewLabel')}:</strong> {featuredProduct.brew[lang]}
                    </p>

                    <div className="ed-specimen__foot">
                      <span className="ed-item__price">
                        {formatPrice(featuredProduct.price, lang)}
                      </span>
                      <button
                        type="button"
                        className={`ed-buy-btn${added[featuredProduct.id] ? ' is-added' : ''}`}
                        onClick={() => onAdd(featuredProduct.id)}
                      >
                        <span>
                          {added[featuredProduct.id] ? t('products.added') : t('products.add')}
                        </span>
                        <span aria-hidden="true">{added[featuredProduct.id] ? '✓' : '+'}</span>
                      </button>
                    </div>
                  </div>
                </article>

                <div className="ed-specimen-index">
                  <p className="ed-specimen-index__blurb">
                    {t(`products.categories.${activeCat}.blurb`)}
                  </p>

                  <ul className="ed-specimen-list">
                    {catProducts.map((item, idx) => {
                      const current = item.id === featuredProduct.id;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            className={`ed-specimen-row${current ? ' is-active' : ''}`}
                            aria-label={t('home.catalog.selectAria').replace('{name}', item.name[lang])}
                            onClick={() => setActiveProdId(item.id)}
                          >
                            <span className="ed-specimen-row__num">0{idx + 1}</span>
                            <span className="ed-specimen-row__main">
                              <strong>{item.name[lang]}</strong>
                              <small>{item.notes[lang]}</small>
                            </span>
                            <span className="ed-specimen-row__price">
                              {formatPrice(item.price, lang)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="ed-specimen-index__more">
                    <Link className="ed-inline-link" to="/products">
                      <span>{t('home.catalog.viewAll')}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="hp-section hp-section--foam" id="thuc-don">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('home.menu.head')}</h2>
              <a className="hp-link" href="#dat-ban">
                {t('home.menu.link')}
              </a>
            </div>
            <div className="hp-menu">
              {MENU.map((item) => (
                <article className="hp-menu-item" key={item.name}>
                  <div className="hp-menu-item__img">
                    <img
                      className="hp-drift"
                      data-drift="0.04"
                      src={item.img}
                      alt={item.name}
                      width={176}
                      height={176}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <div className="hp-menu-item__buy">
                    <span className="hp-price">{item.price}</span>
                    <button
                      type="button"
                      className={`hp-add${added[item.name] ? ' is-added' : ''}`}
                      aria-label={t('home.menu.addAria').replace('{name}', item.name)}
                      onClick={() => onAdd(item.name)}
                    >
                      {added[item.name] ? '✓' : '+'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --- Delta-inspired 4-Step Coffee Cycle (Origins · Roast · Blend · Tasting) --- */}
        <CoffeeCycleSection showCultureLink />

        {/* --- Delta-inspired Interactive Coffee Profile Quiz --- */}
        <section className="hp-section hp-section--ink" id="gu-ca-phe">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('home.quiz.head')}</h2>
              <p>{t('home.quiz.sub')}</p>
            </div>

            <div className="ed-quiz">
              <div className="ed-quiz__prompts">
                {QUIZ_STEPS.map((step) => (
                  <fieldset className="ed-quiz__step" key={step.id}>
                    <legend>{step.question[lang]}</legend>
                    <div className="ed-quiz__options">
                      {step.options.map((opt) => {
                        const active = quizAnswers[step.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            aria-pressed={active}
                            className={`ed-quiz__opt${active ? ' is-selected' : ''}`}
                            onClick={() =>
                              setQuizAnswers((prev) => ({ ...prev, [step.id]: opt.value }))
                            }
                          >
                            {opt.label[lang]}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>

              <aside className="ed-quiz__result" aria-live="polite">
                <p className="ed-quiz__result-label">{t('home.quiz.resultHeading')}</p>
                <h3>{matchedProfile.title[lang]}</h3>
                <p className="ed-quiz__summary">{matchedProfile.summary[lang]}</p>

                <div className="ed-quiz__match">
                  <img
                    src={matchedProduct.img}
                    alt={matchedProduct.name[lang]}
                    width={160}
                    height={120}
                    loading="lazy"
                  />
                  <div>
                    <span>{t('home.quiz.homeBagLabel')}</span>
                    <strong>{matchedProduct.name[lang]}</strong>
                    <small>
                      {matchedProduct.notes[lang]} · {formatPrice(matchedProduct.price, lang)}
                    </small>
                  </div>
                </div>

                <dl className="ed-quiz__pair">
                  <div>
                    <dt>{t('home.quiz.barDrinkLabel')}</dt>
                    <dd>{matchedProfile.barDrink[lang]}</dd>
                  </div>
                  <div>
                    <dt>{t('home.quiz.brewGuideLabel')}</dt>
                    <dd>{matchedProfile.ratio[lang]}</dd>
                  </div>
                </dl>

                <div className="ed-quiz__actions">
                  <Link className="hp-btn hp-btn--brass" to="/products">
                    {t('home.quiz.shopCta')}
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="hp-section hp-section--foam" id="cau-chuyen">
          <div className="hp-shell hp-story">
            <div className="hp-story__visual">
              <div className="hp-frame">
                <img
                  className="hp-drift"
                  data-drift="0.08"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqDL4pxQXm-QEu5d9xNQIWgie0vwKBfpwBwGaJ3EspbfEKN4BJabbaY9bviyN7PdoAE8ifCSXLwnYiSp8Yx9KIK0rP9-NzzuYe4SSZSgK1MUarnBp6B7SUQpv-HXIz8VpE0MuaBE5Y8cj6aPlz6cAPLG9mhk5ryS46D1cyAiIZ6iVkUzdQBg7Mf_3x0pqq_PJoaWBJCcSi4nb9La3U-0Yo1XNEyXfDzg59_EjisCOD_F_UWZFqD74U1w"
                  alt={t('home.story.imgFarmAlt')}
                  width={640}
                  height={800}
                  loading="lazy"
                />
              </div>
              <div className="hp-story__note">
                <strong>1.650m</strong>
                <span>{t('home.story.noteAlt')}</span>
              </div>
              <div className="hp-story__note hp-story__note--dark">
                <strong>Giesen W6A</strong>
                <span>{t('home.story.noteRoast')}</span>
              </div>
              <div className="hp-frame">
                <img
                  className="hp-drift"
                  data-drift="0.12"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqHKTNaqWBmkTZingmeTQfG_APVvRk0ey9eNI6u725znsnG7Yp7BMVJgqWRsubge5phrxlKou7BpoeHp-BzCklXzyyTX0ug2CKTDmaIiRuWIEJ-6KIj26PPm1bBj0ObU1MtJ2t_fOIgY9w-76wIGpTsJJJNdMITSXo1GGhV9cTH9j0p1DL2MznkNpDwJHhpeLrw_njpojUvY_9h-ur6XVThFhK3SJJlLp6an2GS_Vlfcz47eQxShsjzw"
                  alt={t('home.story.imgRoastAlt')}
                  width={640}
                  height={800}
                  loading="lazy"
                />
              </div>
            </div>

            <div>
              <div className="hp-section__head hp-section__head--tight">
                <h2>{t('home.story.head')}</h2>
              </div>
              <p className="hp-lede">{t('home.story.lede')}</p>
              <ol className="hp-commitments">
                {COMMITMENTS.map((item, index) => (
                  <li key={item.title}>
                    <b aria-hidden="true">{index + 1}</b>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="hp-section hp-sustain" id="ben-vung">
          <div className="hp-shell">
            <div className="hp-section__head hp-reveal">
              <h2>
                {t('home.sustain.titleA')} <em>{t('home.sustain.titleEm')}</em> {t('home.sustain.titleB')}
              </h2>
              <p>{t('home.sustain.sub')}</p>
            </div>

            <div className="hp-stats hp-reveal" role="list" aria-label={t('home.sustain.statsAria')}>
              {SUSTAIN_STATS.map((stat) => (
                <div className="hp-stat" role="listitem" key={stat.label}>
                  <p className="hp-stat__value">
                    <span className="hp-stat__num" data-count={stat.value}>0</span>
                    <span className="hp-stat__suffix">{stat.suffix}</span>
                  </p>
                  <p className="hp-stat__label">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="hp-chapters">
              {SUSTAIN_CHAPTERS.map((chapter) => (
                <article className="hp-chapter hp-reveal" key={chapter.index}>
                  <p className="hp-chapter__index">{chapter.index}</p>
                  <div>
                    <p className="hp-chapter__title">{chapter.title}</p>
                    <h3>{chapter.heading}</h3>
                    <p className="hp-chapter__body">{chapter.body}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="ed-section-bridge hp-reveal">
              <Link className="ed-inline-link" to="/sustainability">
                <span>{t('home.sustain.fullReportLink')}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <figure className="hp-band hp-reveal">
            <picture>
              <source srcSet="/scroll/2-san-phoi.avif" type="image/avif" />
              <source srcSet="/scroll/2-san-phoi.webp" type="image/webp" />
              <img
                className="hp-drift"
                data-drift="0.05"
                src="/scroll/2-san-phoi.jpg"
                alt={t('home.sustain.band.alt')}
                width={1600}
                height={900}
                loading="lazy"
              />
            </picture>
            <figcaption className="hp-shell">
              <strong>{t('home.sustain.band.title')}</strong>
              <span>{t('home.sustain.band.caption')}</span>
            </figcaption>
          </figure>

          <div className="hp-shell">
            <div className="hp-section__head hp-section__head--tight hp-reveal">
              <h2>{t('home.sustain.journeyHead')}</h2>
              <p>{t('home.sustain.journeySub')}</p>
            </div>
            <ol className="hp-journey hp-reveal">
              {JOURNEY.map((step) => (
                <li key={step.phase}>
                  <p className="hp-journey__phase">{step.phase}</p>
                  <p className="hp-journey__when">{step.when}</p>
                  <h3>{step.title}</h3>
                  <p className="hp-journey__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --- Delta-inspired Coffee Journal Dispatches & Business Solutions Strip --- */}
        <section className="hp-section hp-section--foam" id="nhat-ky">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('home.journalPreview.head')}</h2>
              <Link className="ed-inline-link" to="/journal">
                <span>{t('home.journalPreview.allLink')}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="ed-home-journal">
              <article className="ed-home-journal__lead">
                <Link to={`/journal?article=${leadJournal.slug}`} className="ed-home-journal__img">
                  <img src={leadJournal.img} alt={leadJournal.title[lang]} loading="lazy" />
                </Link>
                <p className="ed-story-meta">
                  <span>{t(`journal.categories.${leadJournal.cat}`)}</span>
                  <span>—</span>
                  <time dateTime={leadJournal.date}>{leadJournal.date}</time>
                </p>
                <h3>
                  <Link to={`/journal?article=${leadJournal.slug}`}>
                    {leadJournal.title[lang]}
                  </Link>
                </h3>
                <p>{leadJournal.excerpt[lang]}</p>
              </article>

              <ul className="ed-home-journal__list">
                {sideJournals.map((item) => (
                  <li key={item.slug}>
                    <p className="ed-story-meta">
                      <span>{t(`journal.categories.${item.cat}`)}</span>
                      <span>—</span>
                      <time dateTime={item.date}>{item.date}</time>
                    </p>
                    <h3>
                      <Link to={`/journal?article=${item.slug}`}>{item.title[lang]}</Link>
                    </h3>
                    <p>{item.excerpt[lang]}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ed-b2b-strip">
              <div className="ed-b2b-strip__copy">
                <h3>{t('home.b2bBanner.head')}</h3>
                <p>{t('home.b2bBanner.body')}</p>
              </div>
              <div className="ed-b2b-strip__meta">
                <span>{t('home.b2bBanner.statA')}</span>
                <span>{t('home.b2bBanner.statB')}</span>
                <Link className="hp-btn hp-btn--primary" to="/business-solutions">
                  {t('home.b2bBanner.cta')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="hp-section hp-section--ink" id="dat-ban">
          <div className="hp-shell hp-book">
            <div className="hp-book__copy">
              <h2>{t('home.book.head')}</h2>
              <p>{t('home.book.sub')}</p>
              <ul className="hp-book__list">
                {t('home.book.perks').map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>

            <form className="hp-form" onSubmit={onBook}>
              <div className="hp-field">
                <label htmlFor="hp-branch">{t('home.book.branch')}</label>
                <select id="hp-branch" name="branch" defaultValue="tan-binh" required>
                  <option value="tan-binh">12 Hoàng Hoa Thám, Tân Bình, TP.HCM</option>
                  <option value="quan-3">06 Trần Cao Vân, Quận 3, TP.HCM</option>
                  <option value="cau-giay">48 Trần Thái Tông, Cầu Giấy, Hà Nội</option>
                </select>
              </div>
              <div className="hp-form__row">
                <div className="hp-field">
                  <label htmlFor="hp-date">{t('home.book.date')}</label>
                  <input id="hp-date" name="date" type="date" required />
                </div>
                <div className="hp-field">
                  <label htmlFor="hp-time">{t('home.book.time')}</label>
                  <select id="hp-time" name="time" defaultValue="10:00" required>
                    <option value="08:00">08:00 – 10:00</option>
                    <option value="10:00">10:00 – 12:00</option>
                    <option value="14:00">14:00 – 17:00</option>
                    <option value="18:30">18:30 – 21:30</option>
                  </select>
                </div>
              </div>
              <div className="hp-form__row">
                <div className="hp-field">
                  <label htmlFor="hp-guests">{t('home.book.guests')}</label>
                  <select id="hp-guests" name="guests" defaultValue="2" required>
                    {['1', '2', '3-5', '6-12'].map((value, i) => (
                      <option key={value} value={value}>
                        {t('home.book.guestsOptions')[i]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hp-field">
                  <label htmlFor="hp-area">{t('home.book.area')}</label>
                  <select id="hp-area" name="area" defaultValue="quiet" required>
                    {['quiet', 'garden', 'bar', 'work'].map((value, i) => (
                      <option key={value} value={value}>
                        {t('home.book.areaOptions')[i]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="hp-form__row">
                <div className="hp-field">
                  <label htmlFor="hp-name">{t('home.book.name')}</label>
                  <input
                    id="hp-name"
                    name="name"
                    type="text"
                    placeholder={t('home.book.namePlaceholder')}
                    required
                  />
                </div>
                <div className="hp-field">
                  <label htmlFor="hp-phone">{t('home.book.phone')}</label>
                  <input
                    id="hp-phone"
                    name="phone"
                    type="tel"
                    placeholder={t('home.book.phonePlaceholder')}
                    required
                  />
                </div>
              </div>
              <button className="hp-btn hp-btn--brass hp-btn--block" type="submit">
                {t('home.book.submit')}
              </button>
              {booked && (
                <p className="hp-form__msg" role="status">
                  {t('home.book.success')}
                </p>
              )}
            </form>
          </div>
        </section>

        <section className="hp-section" id="khong-gian">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>{t('home.space.head')}</h2>
              <p>{t('home.space.sub')}</p>
            </div>
            <div className="hp-gallery">
              <figure>
                <img
                  className="hp-drift"
                  data-drift="0.06"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxY7SnJeyv3sKueKwezTVUjXEPnTMpEgmVoawFkH_Hw8uTr0wWbNIM4GSdPKwSulYnj8kokWnvFcd7VEDmFjA1bw7u4tW6ksAvEhywyySYewNDO95Yky8Xk7JXK7as7hczCk4YxEHLwq9BPxof8ZRJLjKJY3XP4nLVNcZsXeKsPrXqLvPYKf2N0D4G6psuTs5HzE067QYyX-VjcTzeHQEn5fnKjL__fAlpXzStDIixYaqdykSbrh6OVg"
                  alt={t('home.space.gallery')[0].alt}
                  width={1200}
                  height={800}
                  loading="lazy"
                />
                <figcaption>{t('home.space.gallery')[0].caption}</figcaption>
              </figure>
              <figure>
                <img
                  className="hp-drift"
                  data-drift="0.1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOerLfMoGxddEuaHcl9Hlzkt26CBr5k7VA_bhoh7k1oj4Cp5dradxhl-uYvAPglCNIRFRUvdECspbYIeiifIBq2xwy5KK4sXRFvnsQR5mC0udWvSyX1lWj3O_td5zsWrZdi7MoJJ0evIcaHY939W6xLeHWROnycy_vachLzCggjwLcjyY_1qbBX_3lYdYTrKrvBRF-wDt_9YfgZXKmRfNU01Uv3YGC4hEK_gD8zvn4phlpE6t8jGphzw"
                  alt={t('home.space.gallery')[1].alt}
                  width={800}
                  height={800}
                  loading="lazy"
                />
                <figcaption>{t('home.space.gallery')[1].caption}</figcaption>
              </figure>
              <figure>
                <img
                  className="hp-drift"
                  data-drift="0.07"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQDnutRmyYrbM4EJyPbf-E19RkmoqWW3XUkz5_YIk2XQtNaycZad4XZ5T6E93NILM83vDFS9HVoamUVH6O6ZHSOeCrSspCih3TD2GGowpTuamLjmOqam7NU2qPpn-hEaFBvgdrQOD8wwNPYqKMy2DbErJAdJZPkxmZ7YzTKZiHF7vWzdTGeK5TRCOy82mQbt15qeCRa0DfboamoGMC6v20g90eoaRVDSV2rWFJLtAIbHML7IJ01827qQ"
                  alt={t('home.space.gallery')[2].alt}
                  width={1000}
                  height={700}
                  loading="lazy"
                />
                <figcaption>{t('home.space.gallery')[2].caption}</figcaption>
              </figure>
            </div>
            <blockquote className="hp-quote">
              <p>{t('home.space.quote')}</p>
              <footer>{t('home.space.quoteBy')}</footer>
            </blockquote>
          </div>
        </section>

        <section className="hp-section hp-section--foam hp-section--flush-top">
          <div className="hp-shell">
            <div className="hp-staff">
              <p className="hp-staff__label">{t('home.staff.label')}</p>
              <div className="hp-staff__links">
                {t('home.staff.links').map((label) => (
                  <Link key={label} to="/login">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
