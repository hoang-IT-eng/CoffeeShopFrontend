import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

function monogram(name) {
  const parts = (name || 'AN').trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || 'A';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (a + b).toUpperCase();
}

export default function UsersPage() {
  const { t, trData } = useLang();

  const [data, setData] = useState({ users: [], roles: ['Admin', 'Cashier', 'Waiter'] });
  const [showCreate, setShowCreate] = useState(false);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Waiter'
  });
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await api('/api/users');
      setData({
        users: res?.users || [],
        roles: res?.roles?.length ? res.roles : ['Admin', 'Cashier', 'Waiter']
      });
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const roleName = (r) =>
    r === 'Admin'
      ? t('ops.shell.roleAdmin')
      : r === 'Cashier'
        ? t('ops.shell.roleCashier')
        : t('ops.shell.roleWaiter');

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.users.filter((u) => {
      const r = u.roles?.[0] || 'Waiter';
      if (roleFilter !== 'ALL' && r !== roleFilter) return false;
      if (!q) return true;
      return `${u.fullName || ''} ${u.email || ''}`.toLowerCase().includes(q);
    });
  }, [data.users, roleFilter, search]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api('/api/users', { method: 'POST', body: form });
      setForm({ fullName: '', email: '', password: '', role: 'Waiter' });
      setShowCreate(false);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRoleChange(userId, nextRole) {
    setError('');
    try {
      await api(`/api/users/${userId}/role`, {
        method: 'POST',
        body: { status: nextRole }
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const adminCnt = data.users.filter((u) => u.roles?.includes('Admin')).length;
  const cashierCnt = data.users.filter((u) => u.roles?.includes('Cashier')).length;
  const waiterCnt = data.users.filter((u) => u.roles?.includes('Waiter')).length;

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.users.title')}</h1>
          <p>{t('ops.users.subtitle')}</p>
        </div>

        <div className="ops-actions">
          <button
            type="button"
            className="ops-btn ops-btn--primary"
            onClick={() => setShowCreate((v) => !v)}
          >
            <OpsIcon name="plus" size={16} />
            <span>{t('ops.users.addStaff')}</span>
          </button>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      {showCreate && (
        <form onSubmit={handleCreate} className="ops-panel">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: 10,
              alignItems: 'end'
            }}
          >
            <input
              className="ops-input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder={t('ops.users.fullNamePlaceholder')}
              required
            />
            <input
              type="email"
              className="ops-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t('ops.users.emailPlaceholder')}
              required
            />
            <input
              type="password"
              className="ops-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t('ops.users.passwordPlaceholder')}
              required
            />
            <select
              className="ops-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {data.roles.map((r) => (
                <option key={r} value={r}>
                  {roleName(r)}
                </option>
              ))}
            </select>
            <button type="submit" className="ops-btn ops-btn--espresso">
              <OpsIcon name="check" size={15} />
              <span>{t('ops.users.saveStaff')}</span>
            </button>
          </div>
        </form>
      )}

      <section className="ops-pulse-strip" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.users.totalStaff')}</span>
            <OpsIcon name="users" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{data.users.length}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.users.admins')}</span>
            <OpsIcon name="shield" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{adminCnt}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.users.cashiers')}</span>
            <OpsIcon name="shift" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{cashierCnt}</div>
        </article>
        <article className="ops-pulse-metric">
          <div className="ops-pulse-metric__top">
            <span>{t('ops.users.waiters')}</span>
            <OpsIcon name="pourover" size={15} />
          </div>
          <div className="ops-pulse-metric__val">{waiterCnt}</div>
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
            {['ALL', 'Admin', 'Cashier', 'Waiter'].map((r) => (
              <button
                key={r}
                type="button"
                className={`ops-cat-tab ${roleFilter === r ? 'is-on' : ''}`}
                onClick={() => setRoleFilter(r)}
              >
                {r === 'ALL' ? t('ops.orders.filterAll') : roleName(r)}
              </button>
            ))}
          </div>

          <input
            className="ops-input"
            style={{ width: 240 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ops.users.searchPlaceholder')}
          />
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>{t('ops.users.colStaff')}</th>
                <th>{t('ops.users.colEmail')}</th>
                <th>{t('ops.users.colRole')}</th>
                <th style={{ textAlign: 'right' }}>{t('ops.users.colSwitchRole')}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => {
                const role = u.roles?.[0] || 'Waiter';
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="ops-avatar">{monogram(u.fullName || u.email)}</span>
                        <strong>{trData(u.fullName || u.email)}</strong>
                      </div>
                    </td>
                    <td className="ops-mono">{u.email}</td>
                    <td>
                      <span
                        className={`ops-badge ${
                          role === 'Admin'
                            ? 'ops-badge--caramel'
                            : role === 'Cashier'
                              ? 'ops-badge--ok'
                              : ''
                        }`}
                      >
                        {roleName(role)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <select
                        className="ops-select"
                        style={{ width: 185, display: 'inline-block' }}
                        value={role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        {data.roles.map((r) => (
                          <option key={r} value={r}>
                            {roleName(r)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
