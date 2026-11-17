import { Link } from 'react-router-dom';
import CoffeeCycleSection from '../components/CoffeeCycleSection';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { useLang } from '../i18n';
import '../styles/homepage.css';
import '../styles/editorial.css';

export default function CoffeeCulturePage() {
  const { t } = useLang();
  const timeline = t('culture.timeline');
  const guides = t('culture.guides.items');

  return (
    <div className="hp ed-page">
      <PublicHeader />
      <main>
        <section className="hp-shell ed-masthead">
          <p className="ed-meta-line">{t('culture.meta')}</p>
          <h1 className="ed-display-title">{t('culture.title')}</h1>
          <p className="ed-lede">{t('culture.lede')}</p>

          <nav className="ed-anchor-bar" aria-label={t('culture.title')}>
            <a href="#chu-trinh">{t('culture.nav.cycle')}</a>
            <a href="#lich-su">{t('culture.nav.origins')}</a>
            <a href="#nghi-thuc-phin">{t('culture.nav.phin')}</a>
            <a href="#phong-lab">{t('culture.nav.lab')}</a>
            <a href="#cam-nang">{t('culture.nav.guides')}</a>
          </nav>

          <figure className="ed-lead-figure">
            <img
              src="/img/culture-hero.jpg"
              alt={t('culture.title')}
              width={1400}
              height={840}
            />
          </figure>
        </section>

        <CoffeeCycleSection id="chu-trinh" showCultureLink={false} />

        <section className="hp-shell ed-monograph" id="lich-su">
          <div className="ed-asymmetric">
            <div className="ed-prose">
              <h2>{t('culture.origins.title')}</h2>
              {t('culture.origins.body').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <figure className="ed-captioned-photo">
              <img
                src="/scroll/1-suong-cau-dat.jpg"
                alt={t('home.story.imgFarmAlt')}
                loading="lazy"
              />
              <figcaption>
                <strong>1.650 m</strong>
                <span>{t('home.story.noteAlt')}</span>
              </figcaption>
            </figure>
          </div>

          <div className="ed-chronology-wrap">
            <h3 className="ed-subhead">{t('culture.timelineTitle')}</h3>
            <ol className="ed-chronology">
              {timeline.map((item) => (
                <li key={item.year + item.title}>
                  <span className="ed-chronology__year">{item.year}</span>
                  <strong className="ed-chronology__title">{item.title}</strong>
                  <p className="ed-chronology__body">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="hp-shell ed-monograph" id="nghi-thuc-phin">
          <div className="ed-asymmetric ed-asymmetric--reverse">
            <div className="ed-photo-pair">
              <figure className="ed-captioned-photo">
                <img src="/img/phin.jpg" alt={t('culture.phin.imgAlt')} loading="lazy" />
                <figcaption>
                  <span>{t('culture.phin.imgCaption')}</span>
                </figcaption>
              </figure>
              <figure className="ed-captioned-photo">
                <img src="/img/culture-egg.jpg" alt="Egg coffee" loading="lazy" />
                <figcaption>
                  <span>{t('culture.phin.eggCaption')}</span>
                </figcaption>
              </figure>
            </div>

            <div className="ed-prose">
              <h2>{t('culture.phin.title')}</h2>
              {t('culture.phin.body').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="ed-dark-band" id="phong-lab">
          <div className="hp-shell">
            <div className="ed-dark-band__head">
              <h2>{t('culture.lab.title')}</h2>
              <p>{t('culture.lab.lede')}</p>
            </div>

            <figure className="ed-dark-band__media">
              <img src="/img/cupping-lab.jpg" alt={t('culture.lab.title')} loading="lazy" />
            </figure>

            <div className="ed-lab-split">
              <article className="ed-lab-col">
                <h3>{t('culture.lab.leftTitle')}</h3>
                <p>{t('culture.lab.leftBody')}</p>
                <span className="ed-lab-col__meta">{t('culture.lab.leftMeta')}</span>
              </article>

              <article className="ed-lab-col">
                <h3>{t('culture.lab.rightTitle')}</h3>
                <p>{t('culture.lab.rightBody')}</p>
                <div className="ed-lab-col__actions">
                  <span className="ed-lab-col__meta">{t('culture.lab.rightMeta')}</span>
                  <a className="ed-inline-link ed-inline-link--light" href="/#dat-ban">
                    <span>{t('culture.lab.bookCta')}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="hp-shell ed-monograph" id="cam-nang">
          <div className="hp-section__head">
            <h2>{t('culture.guides.title')}</h2>
            <p>{t('culture.guides.sub')}</p>
          </div>

          <div className="ed-recipe-ledger">
            {guides.map((guide, index) => (
              <article className="ed-recipe-row" key={guide.name}>
                <div className="ed-recipe-row__head">
                  <span className="ed-recipe-row__num">0{index + 1}</span>
                  <h3>{guide.name}</h3>
                </div>

                <dl className="ed-recipe-row__specs">
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

                <p className="ed-recipe-row__body">{guide.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="hp-shell ed-closing-block">
          <blockquote>{t('culture.closing.quote')}</blockquote>
          <p>{t('culture.closing.by')}</p>
          <div className="ed-closing-block__cta">
            <Link className="hp-btn hp-btn--primary" to="/products">
              {t('culture.closing.shopCta')}
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
