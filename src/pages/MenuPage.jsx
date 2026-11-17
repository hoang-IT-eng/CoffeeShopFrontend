import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

export default function MenuPage() {
  const { t, tf, trData, money } = useLang();

  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [bomDetail, setBomDetail] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadMenu = useCallback(async () => {
    try {
      const list = await api('/api/menu');
      setItems(list || []);
      setSelectedId((prev) => prev ?? list?.[0]?.id ?? null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    if (!selectedId) {
      setBomDetail(null);
      return;
    }
    api(`/api/menu/${selectedId}`)
      .then(setBomDetail)
      .catch(() => setBomDetail(null));
  }, [selectedId]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category || 'Espresso Bar'))),
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (statusFilter === 'ACTIVE' && !item.isAvailable) return false;
      if (statusFilter === 'PAUSED' && item.isAvailable) return false;
      if (!q) return true;
      return (
        trData(item.name).toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        trData(item.category).toLowerCase().includes(q)
      );
    });
  }, [items, categoryFilter, statusFilter, search, trData]);

  async function toggleAvailable(item) {
    setError('');
    try {
      const detail = await api(`/api/menu/${item.id}`);
      await api(`/api/menu/${item.id}`, {
        method: 'PUT',
        body: {
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
          isAvailable: !item.isAvailable,
          recipes: detail?.recipes || item.recipes || []
        }
      });
      await loadMenu();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(item) {
    if (!window.confirm(tf('ops.common.deleteConfirm', { name: trData(item.name) }))) return;
    setError('');
    try {
      await api(`/api/menu/${item.id}`, { method: 'DELETE' });
      if (selectedId === item.id) setSelectedId(null);
      await loadMenu();
    } catch (err) {
      setError(err.message);
    }
  }

  const activeCount = items.filter((i) => i.isAvailable).length;
  const pausedCount = items.length - activeCount;

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.menu.title')}</h1>
          <p>{t('ops.menu.subtitle')}</p>
        </div>

        <div className="ops-actions">
          <Link to="/inventory" className="ops-btn">
            <OpsIcon name="inventory" size={15} />
            <span>{t('ops.menu.goInventory')}</span>
          </Link>
          <Link to="/menu/new" className="ops-btn ops-btn--primary">
            <OpsIcon name="plus" size={16} />
            <span>{t('ops.menu.addItem')}</span>
          </Link>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      <section className="ops-pulse-strip" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.menu.activeItems')}</span>
            <OpsIcon name="menu" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{activeCount}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.menu.pausedItems')}</span>
            <OpsIcon name="alert" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{pausedCount}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.menu.avgCogs')}</span>
            <OpsIcon name="bean" size={15} />
          </div>
          <div className="ops-pulse-metric__val">28.4%</div>
        </article>
      </section>

      <div className="ops-floor-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            className="ops-panel"
            style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', padding: '12px 14px' }}
          >
            <div className="ops-cat-tabs" style={{ paddingBottom: 0 }}>
              <button
                type="button"
                className={`ops-cat-tab ${categoryFilter === 'ALL' ? 'is-on' : ''}`}
                onClick={() => setCategoryFilter('ALL')}
              >
                {t('ops.pos.allCategories')}
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`ops-cat-tab ${categoryFilter === c ? 'is-on' : ''}`}
                  onClick={() => setCategoryFilter(c)}
                >
                  {trData(c)}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <select
                className="ops-select"
                style={{ width: 155 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">{t('ops.menu.statusAll')}</option>
                <option value="ACTIVE">{t('ops.menu.statusAvailable')}</option>
                <option value="PAUSED">{t('ops.menu.statusPaused')}</option>
              </select>
              <input
                className="ops-input"
                style={{ width: 210 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('ops.menu.searchPlaceholder')}
              />
            </div>
          </div>

          <div className="ops-menu-cards">
            {filtered.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="ops-menu-card"
                style={{
                  cursor: 'pointer',
                  borderColor: selectedId === item.id ? 'var(--an-caramel)' : undefined
                }}
              >
                <img
                  src={item.imageUrl || '/img/pos/salted-coffee.jpg'}
                  alt={trData(item.name)}
                  className="ops-menu-card__img"
                  loading="lazy"
                />
                <div className="ops-menu-card__body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                    <strong style={{ fontSize: 13.5 }}>{trData(item.name)}</strong>
                    <span className={`ops-badge ${item.isAvailable ? 'ops-badge--ok' : 'ops-badge--danger'}`}>
                      {item.isAvailable ? t('ops.menu.availableBadge') : t('ops.menu.pausedBadge')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--an-muted)' }}>
                    <span>{trData(item.category)}</span>
                    <strong className="ops-mono" style={{ color: 'var(--an-ink)' }}>
                      {money(item.price)}
                    </strong>
                  </div>
                  <div
                    style={{ display: 'flex', gap: 6, marginTop: 6 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="ops-btn ops-btn--sm"
                      onClick={() => toggleAvailable(item)}
                    >
                      {item.isAvailable ? t('ops.menu.pauseBtn') : t('ops.menu.enableBtn')}
                    </button>
                    <Link to={`/menu/${item.id}`} className="ops-btn ops-btn--sm">
                      <OpsIcon name="edit" size={13} />
                      <span>{t('ops.menu.editBtn')}</span>
                    </Link>
                    <button
                      type="button"
                      className="ops-btn ops-btn--danger ops-btn--sm"
                      onClick={() => removeItem(item)}
                      aria-label={t('ops.menu.deleteBtn')}
                    >
                      <OpsIcon name="trash" size={13} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* BOM Recipe Inspector */}
        {bomDetail?.item && (
          <aside className="ops-drawer-card">
            <div className="ops-drawer-banner">
              <span style={{ fontSize: 11.5, color: '#ccbba8' }}>{trData(bomDetail.item.category)}</span>
              <h2
                style={{
                  margin: '3px 0 0',
                  fontFamily: 'var(--an-font-display)',
                  fontSize: 26,
                  fontWeight: 600
                }}
              >
                {trData(bomDetail.item.name)}
              </h2>
              <div className="ops-mono" style={{ marginTop: 6, fontSize: 15, color: '#e6d3bd' }}>
                {money(bomDetail.item.price)}
              </div>
            </div>

            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--an-muted)', lineHeight: 1.5 }}>
                {trData(bomDetail.item.description)}
              </p>

              <div style={{ borderTop: '1px solid var(--an-line)', paddingTop: 12 }}>
                <strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                  {t('ops.menu.bomPanelTitle')}
                </strong>
                {!bomDetail.recipes?.length ? (
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--an-muted)' }}>
                    {t('ops.menu.bomEmpty')}
                  </p>
                ) : (
                  <ul className="ops-kds-items" style={{ borderBottom: 0 }}>
                    {bomDetail.recipes.map((r, idx) => {
                      const inv = (bomDetail.inventory || []).find((i) => i.id === r.inventoryItemId);
                      return (
                        <li key={`${r.inventoryItemId}-${idx}`}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{trData(r.inventoryItemName || inv?.name || `#${r.inventoryItemId}`)}</span>
                            <strong className="ops-mono">
                              {r.quantityRequired} {trData(inv?.unit || 'kg')}
                            </strong>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <Link to={`/menu/${bomDetail.item.id}`} className="ops-btn ops-btn--primary">
                <OpsIcon name="edit" size={15} />
                <span>{t('ops.menu.editBtn')}</span>
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
