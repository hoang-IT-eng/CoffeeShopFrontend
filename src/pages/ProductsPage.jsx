import { useMemo, useState } from 'react';
import { PublicFooter, PublicHeader, SensoryBar } from '../components/PublicChrome';
import { CATEGORIES, PRODUCTS, SUBFILTERS } from '../data/products';
import { formatPrice, useLang } from '../i18n';
import '../styles/homepage.css';
import '../styles/editorial.css';

export default function ProductsPage() {
  const { lang, t } = useLang();
  const [catFilter, setCatFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [bag, setBag] = useState({});

  const catCounts = useMemo(() => {
    const map = { all: PRODUCTS.length };
    CATEGORIES.forEach((c) => {
      map[c] = PRODUCTS.filter((p) => p.cat === c).length;
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchCat = catFilter === 'all' || product.cat === catFilter;
      const matchOrigin =
        originFilter === 'all' ||
        catFilter === 'gear' ||
        product.originKey === originFilter;
      return matchCat && matchOrigin;
    });
  }, [catFilter, originFilter]);

  const groups = useMemo(() => {
    if (catFilter !== 'all') {
      return [{ cat: catFilter, items: filtered }];
    }
    return CATEGORIES.map((cat) => ({
      cat,
      items: filtered.filter((p) => p.cat === cat)
    })).filter((g) => g.items.length > 0);
  }, [catFilter, filtered]);

  const bagStats = useMemo(() => {
    let count = 0;
    let total = 0;
    Object.entries(bag).forEach(([id, qty]) => {
      if (!qty) return;
      const found = PRODUCTS.find((p) => p.id === id);
      if (found) {
        count += qty;
        total += found.price * qty;
      }
    });
    return { count, total };
  }, [bag]);

  function onAdd(id) {
    setBag((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  return (
    <div className="hp ed-page">
      <PublicHeader />
      <main>
        <section className="hp-shell ed-masthead">
          <p className="ed-meta-line">{t('products.meta')}</p>
          <h1 className="ed-display-title">{t('products.title')}</h1>
          <p className="ed-lede">{t('products.lede')}</p>

          <div className="ed-tabs" role="tablist" aria-label={t('products.title')}>
            <button
              type="button"
              role="tab"
              aria-selected={catFilter === 'all'}
              className={`ed-tab${catFilter === 'all' ? ' is-active' : ''}`}
              onClick={() => setCatFilter('all')}
            >
              <span className="ed-tab__label">{t('products.all')}</span>
              <span className="ed-tab__count">{catCounts.all}</span>
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={catFilter === cat}
                className={`ed-tab${catFilter === cat ? ' is-active' : ''}`}
                onClick={() => {
                  setCatFilter(cat);
                  if (cat === 'gear') setOriginFilter('all');
                }}
              >
                <span className="ed-tab__label">{t(`products.categories.${cat}.label`)}</span>
                <span className="ed-tab__count">{catCounts[cat]}</span>
              </button>
            ))}
          </div>

          {catFilter !== 'gear' && (
            <div className="ed-subfilters" role="group" aria-label={t('products.subfilterLabel')}>
              <span className="ed-subfilters__label">{t('products.subfilterLabel')}</span>
              {SUBFILTERS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`ed-subfilter${originFilter === key ? ' is-active' : ''}`}
                  onClick={() => setOriginFilter(key)}
                >
                  {t(`products.subfilters.${key}`)}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="hp-shell ed-catalog-wrap">
          {groups.map((group, groupIdx) => (
            <div className="ed-cat-block" key={group.cat}>
              <header className="ed-cat-header">
                <div className="ed-cat-header__title">
                  <span className="ed-cat-header__num">
                    {String(groupIdx + 1).padStart(2, '0')}
                  </span>
                  <h2>{t(`products.categories.${group.cat}.label`)}</h2>
                </div>
                <p>{t(`products.categories.${group.cat}.blurb`)}</p>
              </header>

              <div className="ed-catalog">
                {group.items.map((product) => {
                  const qty = bag[product.id] || 0;
                  const isOpen = expandedId === product.id;
                  return (
                    <article className="ed-item" key={product.id}>
                      <div className="ed-item__media">
                        <img
                          src={product.img}
                          alt={product.name[lang]}
                          width={600}
                          height={450}
                          loading="lazy"
                        />
                        {product.tag && (
                          <span className="ed-item__tag">{product.tag[lang]}</span>
                        )}
                      </div>

                      <div className="ed-item__body">
                        <div className="ed-item__meta">
                          <span>{product.origin[lang]}</span>
                          <span>{product.unit[lang]}</span>
                        </div>

                        <h3 className="ed-item__name">{product.name[lang]}</h3>
                        <p className="ed-item__notes">{product.notes[lang]}</p>
                        <p className="ed-item__desc">{product.desc[lang]}</p>

                        {product.roast != null && (
                          <div className="ed-item__meters">
                            <SensoryBar label={t('products.roast')} value={product.roast} />
                            <SensoryBar label={t('products.intensity')} value={product.intensity} />
                            <SensoryBar label={t('products.acidity')} value={product.acidity} />
                          </div>
                        )}

                        {isOpen && (
                          <p className="ed-item__recipe">{product.brew[lang]}</p>
                        )}

                        <div className="ed-item__foot">
                          <div>
                            <span className="ed-item__price">
                              {formatPrice(product.price, lang)}
                            </span>
                            <button
                              type="button"
                              className="ed-item__spec-toggle"
                              aria-expanded={isOpen}
                              onClick={() =>
                                setExpandedId(isOpen ? null : product.id)
                              }
                            >
                              {isOpen ? t('products.hideInspect') : t('products.inspect')}
                            </button>
                          </div>

                          <button
                            type="button"
                            className={`ed-buy-btn${qty > 0 ? ' is-added' : ''}`}
                            aria-label={t('products.addAria').replace('{name}', product.name[lang])}
                            onClick={() => onAdd(product.id)}
                          >
                            <span>{qty > 0 ? `${t('products.added')} (${qty})` : t('products.add')}</span>
                            <span aria-hidden="true">+</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="ed-dispatch-strip">
            <p>{t('products.note')}</p>
            <div className="ed-dispatch-strip__cta">
              <span>{t('products.quizPromptTitle')}</span>
              <a className="ed-inline-link" href="/#gu-ca-phe">
                <span>{t('products.quizPromptCta')}</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {bagStats.count > 0 && (
          <aside className="ed-bag-tray" aria-live="polite">
            <div className="hp-shell ed-bag-tray__inner">
              <div>
                <strong>
                  {t('products.bagSummary')
                    .replace('{count}', String(bagStats.count))
                    .replace('{total}', formatPrice(bagStats.total, lang))}
                </strong>
                <span>{t('products.bagCheckoutNote')}</span>
              </div>
              <div className="ed-bag-tray__actions">
                <button
                  type="button"
                  className="ed-bag-tray__clear"
                  onClick={() => setBag({})}
                >
                  {t('products.bagClear')}
                </button>
                <a className="hp-btn hp-btn--brass" href="tel:19006886">
                  1900 6886
                </a>
              </div>
            </div>
          </aside>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
