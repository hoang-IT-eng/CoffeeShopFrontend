import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

function healthOf(item) {
  const days = (new Date(item.expirationDate).getTime() - Date.now()) / 86_400_000;
  if (days <= 0) return 'expired';
  if (Number(item.quantity) <= Number(item.minimumThreshold)) return 'low';
  if (days <= 7) return 'near';
  return 'safe';
}

export default function InventoryPage() {
  const { t, tf, trData, when } = useLang();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('add');

  const [targetId, setTargetId] = useState('');
  const [qty, setQty] = useState('2');
  const [expiry, setExpiry] = useState('');

  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('5');
  const [newUnit, setNewUnit] = useState('kg');
  const [newPar, setNewPar] = useState('2');
  const [newExpiry, setNewExpiry] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const list = await api('/api/inventory');
      setItems(list || []);
      setTargetId((prev) => prev || String(list?.[0]?.id || ''));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { low: 0, exp: 0, safe: 0 };
    items.forEach((i) => {
      const h = healthOf(i);
      if (h === 'low') c.low += 1;
      else if (h === 'near' || h === 'expired') c.exp += 1;
      else c.safe += 1;
    });
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const h = healthOf(item);
      if (filter === 'LOW' && h !== 'low') return false;
      if (filter === 'EXP' && h !== 'near' && h !== 'expired') return false;
      if (filter === 'SAFE' && h !== 'safe') return false;
      if (!q) return true;
      return trData(item.name).toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    });
  }, [items, filter, search, trData]);

  async function handleStockAdjust(e) {
    e.preventDefault();
    if (!targetId || busy) return;
    setError('');
    setBusy(true);
    try {
      await api(`/api/inventory/${targetId}/stock`, {
        method: 'POST',
        body: {
          action: tab === 'deduct' ? 'deduct' : 'add',
          quantity: Number(qty || 0),
          expirationDate: expiry || undefined
        }
      });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateSku(e) {
    e.preventDefault();
    if (!newName.trim() || busy) return;
    setError('');
    setBusy(true);
    try {
      await api('/api/inventory', {
        method: 'POST',
        body: {
          name: newName.trim(),
          quantity: Number(newQty || 0),
          unit: newUnit.trim() || 'kg',
          minimumThreshold: Number(newPar || 1),
          expirationDate: newExpiry || undefined
        }
      });
      setNewName('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(tf('ops.common.deleteConfirm', { name: trData(item.name) }))) return;
    setError('');
    try {
      await api(`/api/inventory/${item.id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.inventory.title')}</h1>
          <p>{t('ops.inventory.subtitle')}</p>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      <section className="ops-pulse-strip" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.inventory.totalSkus')}</span>
            <OpsIcon name="inventory" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{items.length}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.inventory.lowParCount')}</span>
            <OpsIcon name="alert" size={15} />
          </div>
          <div className="ops-pulse-metric__val" style={{ color: 'var(--an-danger)' }}>
            {counts.low}
          </div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.inventory.expiringCount')}</span>
            <OpsIcon name="clock" size={15} />
          </div>
          <div className="ops-pulse-metric__val" style={{ color: 'var(--an-warn)' }}>
            {counts.exp}
          </div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.inventory.safeCount')}</span>
            <OpsIcon name="check" size={15} />
          </div>
          <div className="ops-pulse-metric__val" style={{ color: 'var(--an-ok)' }}>
            {counts.safe}
          </div>
        </article>
      </section>

      <div className="ops-floor-layout">
        <div className="ops-panel">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 14
            }}
          >
            <div className="ops-cat-tabs" style={{ paddingBottom: 0 }}>
              {[
                { key: 'ALL', label: t('ops.inventory.filterAll') },
                { key: 'LOW', label: t('ops.inventory.filterLow') },
                { key: 'EXP', label: t('ops.inventory.filterExp') },
                { key: 'SAFE', label: t('ops.inventory.filterSafe') }
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`ops-cat-tab ${filter === f.key ? 'is-on' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <input
              className="ops-input"
              style={{ width: 220 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('ops.inventory.searchPlaceholder')}
            />
          </div>

          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>{t('ops.inventory.colItem')}</th>
                  <th style={{ textAlign: 'right' }}>{t('ops.inventory.colStock')}</th>
                  <th style={{ textAlign: 'right' }}>{t('ops.inventory.colPar')}</th>
                  <th>{t('ops.inventory.colExpiry')}</th>
                  <th>{t('ops.inventory.colState')}</th>
                  <th style={{ textAlign: 'right' }}>{t('ops.inventory.colAction')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const h = healthOf(item);
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>{trData(item.name)}</strong>
                      </td>
                      <td className="ops-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                        {item.quantity} {trData(item.unit)}
                      </td>
                      <td className="ops-mono" style={{ textAlign: 'right', color: 'var(--an-muted)' }}>
                        {item.minimumThreshold} {trData(item.unit)}
                      </td>
                      <td className="ops-mono">{when(item.expirationDate).split(',')[0]}</td>
                      <td>
                        <span
                          className={`ops-badge ${
                            h === 'safe'
                              ? 'ops-badge--ok'
                              : h === 'near'
                                ? 'ops-badge--warn'
                                : 'ops-badge--danger'
                          }`}
                        >
                          {h === 'safe'
                            ? t('ops.inventory.filterSafe')
                            : h === 'near'
                              ? t('ops.dashboard.parNear')
                              : h === 'expired'
                                ? t('ops.dashboard.parExpired')
                                : t('ops.dashboard.parLow')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            className="ops-btn ops-btn--sm"
                            onClick={() => {
                              setTargetId(String(item.id));
                              setTab('add');
                            }}
                          >
                            <OpsIcon name="plus" size={13} />
                          </button>
                          <button
                            type="button"
                            className="ops-btn ops-btn--danger ops-btn--sm"
                            onClick={() => handleDelete(item)}
                          >
                            <OpsIcon name="trash" size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Operations Drawer */}
        <aside className="ops-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="ops-seg">
            <button
              type="button"
              className={tab === 'add' ? 'is-on' : ''}
              onClick={() => setTab('add')}
            >
              {t('ops.inventory.tabReceive')}
            </button>
            <button
              type="button"
              className={tab === 'deduct' ? 'is-on' : ''}
              onClick={() => setTab('deduct')}
            >
              {t('ops.inventory.tabDeduct')}
            </button>
            <button
              type="button"
              className={tab === 'create' ? 'is-on' : ''}
              onClick={() => setTab('create')}
            >
              {t('ops.inventory.tabCreate')}
            </button>
          </div>

          {tab !== 'create' ? (
            <form onSubmit={handleStockAdjust} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="ops-field">
                <label>{t('ops.inventory.itemSelect')}</label>
                <select
                  className="ops-select"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {trData(i.name)} ({i.quantity} {trData(i.unit)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="ops-field">
                <label>{t('ops.inventory.qtyLabel')}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="ops-input ops-mono"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                />
              </div>

              {tab === 'add' && (
                <div className="ops-field">
                  <label>{t('ops.inventory.expiryLabel')}</label>
                  <input
                    type="date"
                    className="ops-input"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className={`ops-btn ${tab === 'deduct' ? 'ops-btn--danger' : 'ops-btn--espresso'}`}
              >
                <OpsIcon name={tab === 'deduct' ? 'minus' : 'plus'} size={15} />
                <span>
                  {tab === 'deduct'
                    ? t('ops.inventory.submitDeduct')
                    : t('ops.inventory.submitReceive')}
                </span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateSku} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="ops-field">
                <label>{t('ops.inventory.colItem')}</label>
                <input
                  className="ops-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="ops-field">
                  <label>{t('ops.inventory.colStock')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="ops-input ops-mono"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    required
                  />
                </div>
                <div className="ops-field">
                  <label>{t('ops.inventory.unitLabel')}</label>
                  <input
                    className="ops-input"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="ops-field">
                <label>{t('ops.inventory.parLabel')}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="ops-input ops-mono"
                  value={newPar}
                  onChange={(e) => setNewPar(e.target.value)}
                  required
                />
              </div>
              <div className="ops-field">
                <label>{t('ops.inventory.expiryLabel')}</label>
                <input
                  type="date"
                  className="ops-input"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                />
              </div>
              <button type="submit" disabled={busy} className="ops-btn ops-btn--primary">
                <OpsIcon name="plus" size={15} />
                <span>{t('ops.inventory.submitCreate')}</span>
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
