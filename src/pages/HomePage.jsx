import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Lenis from 'lenis';
import FrameStory from '../components/FrameStory';
import { useLang } from '../i18n';
import '../styles/homepage.css';

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
  const { lang, t } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  const MENU = t('home.menu.items').map((item, i) => ({ ...item, img: MENU_IMGS[i] }));
  const SUSTAIN_STATS = t('home.sustain.stats');
  const SUSTAIN_CHAPTERS = t('home.sustain.chapters');
  const JOURNEY = t('home.sustain.journey');
  const COMMITMENTS = t('home.story.items');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const drifts = root.querySelectorAll('[data-drift]');
    let lenis;

    const paint = (scrollY, velocity = 0) => {
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
      { threshold: 0.25 }
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
            const t = Math.min(1, (now - started) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            node.textContent = wholeFmt.format(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(stepCount);
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
      if (lenis) lenis.scrollTo(target, { offset: -76, duration: 1.15 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    root.addEventListener('click', onAnchor);

    if (reduce) {
      const onScroll = () => {
        paint(window.scrollY);
      };
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
    const onLenisScroll = (event) => {
      paint(event.scroll);
    };
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

  function onAdd(name) {
    setAdded((prev) => ({ ...prev, [name]: true }));
    window.setTimeout(() => {
      setAdded((prev) => ({ ...prev, [name]: false }));
    }, 1200);
  }

  function onBook(event) {
    event.preventDefault();
    setBooked(true);
  }

  return (
    <div className="hp" ref={rootRef}>
      <div className="hp-rail" aria-hidden="true">
        <span className="hp-rail__fill" />
      </div>
      <header className="hp-header">
        <div className="hp-shell hp-header__inner">
          <a className="hp-brand" href="#top">
            <span className="hp-brand__name">An Roastery</span>
            <span className="hp-brand__tag">{t('brand.tag')}</span>
          </a>

          <nav className="hp-nav" aria-label={t('nav.label')}>
            <a href="#thuc-don">{t('nav.menu')}</a>
            <Link to="/products">{t('nav.products')}</Link>
            <Link to="/coffee-culture">{t('nav.culture')}</Link>
            <a href="#dat-ban">{t('nav.booking')}</a>
            <a href="#cau-chuyen">{t('nav.story')}</a>
            <a href="#ben-vung">{t('nav.sustain')}</a>
            <a href="#khong-gian">{t('nav.space')}</a>
            <Link to="/login">{t('nav.admin')}</Link>
          </nav>

          <div className="hp-header__actions">
            <div className="hp-hotline">
              <span>{t('nav.hotline')}</span>
              <a href="tel:19006886">1900 6886</a>
            </div>
            <a className="hp-btn hp-btn--primary" href="#thuc-don">
              {t('nav.orderNow')}
            </a>
          </div>
        </div>
      </header>

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

        <section className="hp-section" id="thuc-don">
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
                  <input id="hp-name" name="name" type="text" placeholder={t('home.book.namePlaceholder')} required />
                </div>
                <div className="hp-field">
                  <label htmlFor="hp-phone">{t('home.book.phone')}</label>
                  <input id="hp-phone" name="phone" type="tel" placeholder={t('home.book.phonePlaceholder')} required />
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

      <footer className="hp-footer">
        <div className="hp-shell">
          <div className="hp-footer__grid">
            <div>
              <p className="hp-brand__name">An Roastery</p>
              <p>{t('footer.tagline')}</p>
            </div>
            <div>
              <h3>{t('footer.hoursTitle')}</h3>
              <ul className="hp-footer__hours">
                {t('footer.hours').map((row) => (
                  <li key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{t('footer.branchesTitle')}</h3>
              <ul>
                <li>12 Hoàng Hoa Thám, Tân Bình, TP.HCM</li>
                <li>06 Trần Cao Vân, Quận 3, TP.HCM</li>
                <li>48 Trần Thái Tông, Cầu Giấy, Hà Nội</li>
              </ul>
            </div>
            <div>
              <h3>{t('footer.contactTitle')}</h3>
              <ul>
                <li>{t('footer.bookingLine')}</li>
                <li>{t('footer.emailLine')}</li>
              </ul>
            </div>
          </div>
          <div className="hp-footer__bottom">
            <p>© {new Date().getFullYear()} An Roastery</p>
            <div className="hp-footer__legal">
              <a href="#top">{t('footer.privacy')}</a>
              <a href="#top">{t('footer.terms')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
