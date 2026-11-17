import { Link } from 'react-router-dom';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { useLang } from '../i18n';
import '../styles/homepage.css';
import '../styles/editorial.css';

export default function CoffeeCulturePage() {
  const { t } = useLang();
  const timeline = t('culture.timeline');
  const guides = t('culture.guides.items');

  return (
    <div className="hp">
      <PublicHeader />
      <main>
        <section className="hp-shell ed-hero">
          <p className="ed-kicker">{t('culture.kicker')}</p>
          <h1 className="ed-title">{t('culture.title')}</h1>
          <p className="ed-lede">{t('culture.lede')}</p>
          <figure className="ed-hero-media">
            <img src="/img/culture-hero.jpg" alt={t('culture.title')} />
          </figure>
        </section>

        <section className="hp-shell ed-chapter">
          <p className="ed-chapter__index">{t('culture.origins.index')}</p>
          <h2>{t('culture.origins.title')}</h2>
          <div className="ed-split">
            <div className="ed-chapter__body">
              {t('culture.origins.body').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <figure className="ed-figure">
              <img src="/scroll/1-suong-cau-dat.jpg" alt={t('home.story.imgFarmAlt')} loading="lazy" />
              <figcaption>
                <strong>1.650 m</strong>
                {t('home.story.noteAlt')}
              </figcaption>
            </figure>
          </div>

          <h2 style={{ marginTop: '3rem' }}>{t('culture.timelineTitle')}</h2>
          <ol className="ed-timeline">
            {timeline.map((item) => (
              <li key={item.year + item.title}>
                <p className="ed-timeline__year">{item.year}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="hp-shell ed-chapter">
          <p className="ed-chapter__index">{t('culture.phin.index')}</p>
          <h2>{t('culture.phin.title')}</h2>
          <div className="ed-split">
            <figure className="ed-figure">
              <img src="/img/phin.jpg" alt={t('culture.phin.imgAlt')} loading="lazy" />
              <figcaption>{t('culture.phin.imgCaption')}</figcaption>
            </figure>
            <div className="ed-chapter__body">
              {t('culture.phin.body').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="hp-shell ed-chapter">
          <p className="ed-chapter__index">{t('culture.heritage.index')}</p>
          <h2>{t('culture.heritage.title')}</h2>
          <div className="ed-split">
            <div>
              <div className="ed-duo" style={{ gridTemplateColumns: '1fr' }}>
                <div>
                  <h3>{t('culture.heritage.subA')}</h3>
                  <p>{t('culture.heritage.bodyA')}</p>
                </div>
                <div>
                  <h3>{t('culture.heritage.subB')}</h3>
                  <p>{t('culture.heritage.bodyB')}</p>
                </div>
              </div>
            </div>
            <figure className="ed-figure">
              <img src="/img/culture-egg.jpg" alt={t('culture.heritage.imgAlt')} loading="lazy" />
              <figcaption>{t('culture.heritage.imgCaption')}</figcaption>
            </figure>
          </div>
        </section>

        <section className="hp-shell ed-chapter">
          <p className="ed-chapter__index">{t('culture.guides.index')}</p>
          <h2>{t('culture.guides.title')}</h2>
          <p className="ed-lede">{t('culture.guides.sub')}</p>
          <div className="ed-guides">
            {guides.map((guide) => (
              <article className="ed-guide" key={guide.name}>
                <h3>{guide.name}</h3>
                <dl>
                  <div>
                    <dt>{t('culture.guides.ratioLabel')}</dt>
                    <dd>{guide.ratio}</dd>
                  </div>
                  <div>
                    <dt>{t('culture.guides.tempLabel')}</dt>
                    <dd>{guide.temp}</dd>
                  </div>
                  <div>
                    <dt>{t('culture.guides.timeLabel')}</dt>
                    <dd>{guide.time}</dd>
                  </div>
                </dl>
                <p>{guide.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hp-shell ed-chapter">
          <p className="ed-chapter__index">{t('culture.sustain.index')}</p>
          <h2>{t('culture.sustain.title')}</h2>
          <div className="ed-chapter__body">
            <p>{t('culture.sustain.body')}</p>
          </div>
          <a className="hp-btn hp-btn--primary" href="/#ben-vung">
            {t('culture.sustain.cta')}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
              arrow_forward
            </span>
          </a>
        </section>

        <section className="hp-shell ed-closing">
          <blockquote>{t('culture.closing.quote')}</blockquote>
          <p>{t('culture.closing.by')}</p>
          <p style={{ marginTop: '1.6rem' }}>
            <Link className="hp-btn hp-btn--ghost" to="/products">
              {t('nav.products')}
            </Link>
          </p>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
