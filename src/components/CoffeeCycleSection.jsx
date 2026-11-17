import { useState } from 'react';
import { Link } from 'react-router-dom';
import { COFFEE_CYCLE } from '../data/editorial';
import { useLang } from '../i18n';

/**
 * Chu trình 4 bước của hạt cà phê (Vùng trồng · Lồng rang · Phối trộn · Thử nếm) —
 * lấy cảm hứng từ mục "The journey of coffee" trên deltacafes.com/en.
 */
export default function CoffeeCycleSection({ showCultureLink = false, id }) {
  const { lang, t } = useLang();
  const [activeId, setActiveId] = useState(COFFEE_CYCLE[0].id);

  const activeIndex = Math.max(
    0,
    COFFEE_CYCLE.findIndex((stage) => stage.id === activeId)
  );
  const stage = COFFEE_CYCLE[activeIndex];

  function onTabKeyDown(event, index) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const dir = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + COFFEE_CYCLE.length) % COFFEE_CYCLE.length;
    setActiveId(COFFEE_CYCLE[next].id);
  }

  return (
    <section className="hp-section ed-cycle-section" id={id}>
      <div className="hp-shell">
        <div className="hp-section__head">
          <h2>{t('home.cycle.head')}</h2>
          <p>{t('home.cycle.sub')}</p>
        </div>

        <div
          className="ed-tabs ed-tabs--spread"
          role="tablist"
          aria-label={t('home.cycle.head')}
        >
          {COFFEE_CYCLE.map((item, idx) => {
            const selected = item.id === stage.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`cycle-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`cycle-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                className={`ed-tab${selected ? ' is-active' : ''}`}
                onClick={() => setActiveId(item.id)}
                onKeyDown={(e) => onTabKeyDown(e, idx)}
              >
                <span className="ed-tab__num">{item.num}</span>
                <span className="ed-tab__label">{item.tab[lang]}</span>
              </button>
            );
          })}
        </div>

        <div
          className="ed-cycle"
          role="tabpanel"
          id={`cycle-panel-${stage.id}`}
          aria-labelledby={`cycle-tab-${stage.id}`}
        >
          <figure className="ed-cycle__media">
            <img src={stage.img} alt={stage.title[lang]} loading="lazy" />
            <figcaption className="ed-cycle__readout">
              <strong>{stage.metric}</strong>
              <span>{stage.metricSub[lang]}</span>
            </figcaption>
          </figure>

          <div className="ed-cycle__copy">
            <p className="ed-cycle__step">
              {stage.num} / 0{COFFEE_CYCLE.length} — {stage.tab[lang]}
            </p>
            <h3>{stage.title[lang]}</h3>
            <p className="ed-cycle__body">{stage.body[lang]}</p>

            <dl className="ed-spec-list">
              {stage.specs.map((row) => (
                <div key={row.label.en}>
                  <dt>{row.label[lang]}</dt>
                  <dd>{row.value[lang]}</dd>
                </div>
              ))}
            </dl>

            {showCultureLink && (
              <div className="ed-cycle__foot">
                <Link className="ed-inline-link" to="/coffee-culture">
                  <span>{t('home.cycle.cta')}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
