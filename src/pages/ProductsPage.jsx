import { useMemo, useState } from 'react';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { formatPrice, useLang } from '../i18n';
import { CATEGORIES, PRODUCTS } from '../data/products';
import '../styles/homepage.css';
import '../styles/editorial.css';

export default function ProductsPage() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState('all');
  const [added, setAdded] = useState({});

  const visible = useMemo(
    () => (filter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter)),
    [filter]
  );

  const groups = useMemo(() => {
    if (filter !== 'all') return [{ cat: filter, items: visible }];
    return CATEGORIES.map((cat) => ({
      cat,
      items: PRODUCTS.filter((p) => p.cat === cat)
    })).filter((group) => group.items.length > 0);
  }, [filter, visible]);

  function onAdd(id) {
    setAdded((prev) => ({ ...prev, [id]: true }));
    window.setTimeout(() => {
      setAdded((prev) => ({ ...prev, [id]: false }));
    }, 1400);
  }

  return (
    <div className="hp">
      <PublicHeader />
      <main>
        <section className="hp-shell ed-hero">
          <p className="ed-kicker">{t('products.kicker')}</p>
          <h1 className="ed-title">{t('products.title')}</h1>
          <p className="ed-lede">{t('products.lede')}</p>

          <div className="ed-filters" role="tablist" aria-label={t('products.kicker')}>
            <button
              type="button"
              className={`ed-chip${filter === 'all' ? ' is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {t('products.all')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`ed-chip${filter === cat ? ' is-active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {t(`products.categories.${cat}.label`)}
              </button>
            ))}
          </div>
        </section>

        <section className="hp-shell">
          {groups.map((group) => (
            <div key={group.cat}>
              <div className="ed-cat-head">
                <h2>{t(`products.categories.${group.cat}.label`)}</h2>
                <p>{t(`products.categories.${group.cat}.blurb`)}</p>
              </div>
              <div className="ed-grid">
                {group.items.map((product) => (
                  <article className="ed-card" key={product.id}>
                    <div className="ed-card__media">
                      <img src={product.img} alt={product.name[lang]} loading="lazy" />
                      {product.badge && (
                        <span className="ed-card__badge">{product.badge[lang]}</span>
                      )}
                    </div>
                    <div className="ed-card__body">
                      <p className="ed-card__unit">{product.unit[lang]}</p>
                      <h3 className="ed-card__name">{product.name[lang]}</h3>
                      <p className="ed-card__desc">{product.desc[lang]}</p>
                      <p className="ed-card__notes">{product.notes[lang]}</p>
                      <div className="ed-card__foot">
                        <span className="ed-card__price">{formatPrice(product.price, lang)}</span>
                        <button
                          type="button"
                          className={`ed-add${added[product.id] ? ' is-added' : ''}`}
                          aria-label={t('products.addAria').replace('{name}', product.name[lang])}
                          onClick={() => onAdd(product.id)}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 17 }} aria-hidden="true">
                            {added[product.id] ? 'check' : 'shopping_bag'}
                          </span>
                          {added[product.id] ? t('products.added') : t('products.add')}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

          <p className="ed-note">
            <span className="material-symbols-outlined" aria-hidden="true">
              local_shipping
            </span>
            <span>{t('products.note')}</span>
          </p>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
