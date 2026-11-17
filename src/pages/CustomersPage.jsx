import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

export default function CustomersPage() {
  const { t, tf, trData, money } = useLang();

  const [customers, setCustomers] = useState([]);
  const [tier, setTier] = useState('ALL');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const list = await api('/api/customers');
      setCustomers(list || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      if (tier !== 'ALL' && c.membershipLevel !== tier) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.phoneNumber || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    });
  }, [customers, tier, search]);

  async function removeCustomer(c) {
    if (!window.confirm(tf('ops.common.deleteConfirm', { name: c.name }))) return;
    setError('');
    try {
      await api(`/api/customers/${c.id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const totalSpent = customers.reduce((s, c) => s + Number(c.totalSpent || 0), 0);
  const totalPts = customers.reduce((s, c) => s + Number(c.loyaltyPoints || 0), 0);
  const goldPlus = customers.filter(
    (c) => c.membershipLevel === 'Gold' || c.membershipLevel === 'Diamond'
  ).length;

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.customers.title')}</h1>
          <p>{t('ops.customers.subtitle')}</p>
        </div>

        <div className="ops-actions">
          <Link to="/customers/new" className="ops-btn ops-btn--primary">
            <OpsIcon name="plus" size={16} />
            <span>{t('ops.customers.addMember')}</span>
          </Link>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      <section className="ops-pulse-strip" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.customers.totalMembers')}</span>
            <OpsIcon name="customers" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{customers.length}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.customers.totalSpent')}</span>
            <OpsIcon name="payments" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{money(totalSpent)}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.customers.totalPoints')}</span>
            <OpsIcon name="bean" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{totalPts}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.customers.goldPlus')}</span>
            <OpsIcon name="shield" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{goldPlus}</div>
        </article>
      </section>

      <section className="ops-panel">
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
            {['ALL', 'Diamond', 'Gold', 'Silver', 'Bronze'].map((lv) => (
              <button
                key={lv}
                type="button"
                className={`ops-cat-tab ${tier === lv ? 'is-on' : ''}`}
                onClick={() => setTier(lv)}
              >
                {lv === 'ALL' ? t('ops.customers.allTiers') : lv}
              </button>
            ))}
          </div>

          <input
            className="ops-input"
            style={{ width: 250 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ops.customers.searchPlaceholder')}
          />
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>{t('ops.customers.colMember')}</th>
                <th>{t('ops.customers.colPhone')}</th>
                <th>{t('ops.customers.colTier')}</th>
                <th style={{ textAlign: 'right' }}>{t('ops.customers.colPoints')}</th>
                <th style={{ textAlign: 'right' }}>{t('ops.customers.colSpent')}</th>
                <th style={{ textAlign: 'right' }}>{t('ops.customers.colAction')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.name}</strong>
                    {c.address && (
                      <div style={{ fontSize: 11.5, color: 'var(--an-muted)' }}>
                        {trData(c.address)}
                      </div>
                    )}
                  </td>
                  <td className="ops-mono">{c.phoneNumber}</td>
                  <td>
                    <span
                      className={`ops-badge ${
                        c.membershipLevel === 'Diamond' || c.membershipLevel === 'Gold'
                          ? 'ops-badge--caramel'
                          : ''
                      }`}
                    >
                      {c.membershipLevel}
                    </span>
                  </td>
                  <td className="ops-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                    {c.loyaltyPoints}
                  </td>
                  <td className="ops-mono" style={{ textAlign: 'right' }}>
                    {money(c.totalSpent)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <Link to={`/customers/${c.id}`} className="ops-btn ops-btn--sm">
                        <OpsIcon name="edit" size={13} />
                      </Link>
                      <button
                        type="button"
                        className="ops-btn ops-btn--danger ops-btn--sm"
                        onClick={() => removeCustomer(c)}
                      >
                        <OpsIcon name="trash" size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
