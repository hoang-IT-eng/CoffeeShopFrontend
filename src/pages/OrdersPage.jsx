import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

function formatElapsed(createdAt, nowMs) {
  const diffSec = Math.max(0, Math.floor((nowMs - new Date(createdAt).getTime()) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  return {
    mins,
    display: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  };
}

export default function OrdersPage() {
  const { t, tf, trData, money, clock } = useLang();

  const [viewMode, setViewMode] = useState('kds');
  const [orders, setOrders] = useState([]);
  const [ledgerFilter, setLedgerFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [nowMs, setNowMs] = useState(() => Date.now());

  const loadOrders = useCallback(async () => {
    try {
      const list = await api('/api/orders');
      setOrders(list || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    const poll = window.setInterval(loadOrders, 12_000);
    const tick = window.setInterval(() => setNowMs(Date.now()), 1_000);
    return () => {
      window.clearInterval(poll);
      window.clearInterval(tick);
    };
  }, [loadOrders]);

  async function bumpStatus(orderId, nextStatus) {
    setError('');
    setBusyId(orderId);
    try {
      await api(`/api/orders/${orderId}/status`, {
        method: 'POST',
        body: { status: nextStatus }
      });
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function cancelOrder(orderId) {
    setError('');
    setBusyId(orderId);
    try {
      await api(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const openCount = useMemo(
    () => orders.filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled').length,
    [orders]
  );

  const kdsColumns = useMemo(
    () => [
      {
        key: 'New',
        title: t('ops.orders.colQueued'),
        icon: 'clock',
        items: orders.filter((o) => o.status === 'New')
      },
      {
        key: 'Processing',
        title: t('ops.orders.colPulling'),
        icon: 'pourover',
        items: orders.filter((o) => o.status === 'Processing')
      },
      {
        key: 'Ready',
        title: t('ops.orders.colReady'),
        icon: 'roastery',
        items: orders.filter((o) => o.status === 'Ready' || o.status === 'PendingMobilePayment')
      },
      {
        key: 'Completed',
        title: t('ops.orders.colServed'),
        icon: 'check',
        items: orders.filter((o) => o.status === 'Completed').slice(0, 6)
      }
    ],
    [orders, t]
  );

  const filteredLedger = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((ord) => {
      if (ledgerFilter !== 'ALL' && ord.status !== ledgerFilter) return false;
      if (!q) return true;
      return (
        String(ord.id).includes(q) ||
        trData(ord.tableName).toLowerCase().includes(q) ||
        trData(ord.customerName).toLowerCase().includes(q)
      );
    });
  }, [orders, ledgerFilter, search, trData]);

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.orders.title')}</h1>
          <p>{tf('ops.orders.subtitle', { open: openCount })}</p>
        </div>

        <div className="ops-actions">
          <div className="ops-seg" role="group" aria-label="View mode">
            <button
              type="button"
              className={viewMode === 'kds' ? 'is-on' : ''}
              onClick={() => setViewMode('kds')}
            >
              <OpsIcon name="kds" size={15} />
              <span>{t('ops.orders.viewKds')}</span>
            </button>
            <button
              type="button"
              className={viewMode === 'ledger' ? 'is-on' : ''}
              onClick={() => setViewMode('ledger')}
            >
              <OpsIcon name="receipt" size={15} />
              <span>{t('ops.orders.viewLedger')}</span>
            </button>
          </div>

          <Link to="/orders/new" className="ops-btn ops-btn--primary">
            <OpsIcon name="plus" size={16} />
            <span>{t('ops.orders.newPosBtn')}</span>
          </Link>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      {viewMode === 'kds' ? (
        <section className="ops-kds-board" aria-label={t('ops.orders.viewKds')}>
          {kdsColumns.map((col) => (
            <div key={col.key} className="ops-kds-col" data-testid={`kds-col-${col.key}`}>
              <div className="ops-kds-col-head">
                <h2>
                  <OpsIcon name={col.icon} size={15} />
                  <span>{col.title}</span>
                </h2>
                <span className="ops-badge ops-mono">{col.items.length}</span>
              </div>

              {col.items.length === 0 ? (
                <div
                  style={{
                    padding: '28px 10px',
                    textAlign: 'center',
                    fontSize: 12.5,
                    color: 'var(--an-muted)'
                  }}
                >
                  {t('ops.orders.emptyCol')}
                </div>
              ) : (
                col.items.map((ord) => {
                  const timer = formatElapsed(ord.createdAt, nowMs);
                  const isDone = ord.status === 'Completed';
                  const tier = isDone
                    ? 'calm'
                    : timer.mins >= 10
                      ? 'red'
                      : timer.mins >= 5
                        ? 'amber'
                        : 'calm';

                  return (
                    <article
                      key={ord.id}
                      data-testid={`kds-ticket-${ord.id}`}
                      className={`ops-kds-ticket ${
                        tier === 'red' ? 'timer-red' : tier === 'amber' ? 'timer-amber' : ''
                      }`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <strong className="ops-mono" style={{ fontSize: 15 }}>
                            #{ord.id}
                          </strong>
                          <span className="ops-badge ops-badge--caramel">
                            {trData(ord.tableName || t('ops.orders.takeaway'))}
                          </span>
                        </div>

                        {!isDone ? (
                          <span
                            className={`ops-timer-chip ${
                              tier === 'red' ? 'is-red' : tier === 'amber' ? 'is-amber' : ''
                            }`}
                          >
                            {timer.display}
                          </span>
                        ) : (
                          <span className="ops-mono" style={{ fontSize: 11.5, color: 'var(--an-muted)' }}>
                            {clock(ord.createdAt)}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 12, color: 'var(--an-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{trData(ord.customerName || t('ops.orders.guestFallback'))}</span>
                        {!isDone && (
                          <span style={{ fontWeight: 600 }}>
                            {tier === 'red'
                              ? t('ops.orders.slaOverdue')
                              : tier === 'amber'
                                ? t('ops.orders.slaWarn')
                                : t('ops.orders.slaCalm')}
                          </span>
                        )}
                      </div>

                      <ul className="ops-kds-items">
                        {(ord.details || []).map((line, i) => (
                          <li key={line.id || `${ord.id}-${i}`}>
                            <div>
                              <strong className="ops-mono">{line.quantity}×</strong>{' '}
                              <span style={{ fontWeight: 600 }}>{trData(line.name)}</span>
                            </div>
                            {line.modifiers && <small>{trData(line.modifiers)}</small>}
                          </li>
                        ))}
                      </ul>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <strong className="ops-mono" style={{ fontSize: 13 }}>
                          {money(ord.total)}
                        </strong>

                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {ord.status === 'New' && (
                            <button
                              type="button"
                              disabled={busyId === ord.id}
                              className="ops-btn ops-btn--primary ops-btn--sm"
                              onClick={() => bumpStatus(ord.id, 'Processing')}
                            >
                              <OpsIcon name="bolt" size={14} />
                              <span>{t('ops.orders.bumpStart')}</span>
                            </button>
                          )}

                          {ord.status === 'Processing' && (
                            <button
                              type="button"
                              disabled={busyId === ord.id}
                              className="ops-btn ops-btn--espresso ops-btn--sm"
                              onClick={() => bumpStatus(ord.id, 'Ready')}
                            >
                              <OpsIcon name="check" size={14} />
                              <span>{t('ops.orders.bumpReady')}</span>
                            </button>
                          )}

                          {(ord.status === 'Ready' || ord.status === 'PendingMobilePayment') && (
                            <>
                              <button
                                type="button"
                                disabled={busyId === ord.id}
                                className="ops-btn ops-btn--ok ops-btn--sm"
                                onClick={() => bumpStatus(ord.id, 'Completed')}
                              >
                                <OpsIcon name="check" size={14} />
                                <span>{t('ops.orders.bumpServe')}</span>
                              </button>
                              <Link
                                to={`/payments/${ord.id}`}
                                className="ops-btn ops-btn--sm"
                              >
                                {t('ops.orders.collectPay')}
                              </Link>
                            </>
                          )}

                          <Link to={`/orders/${ord.id}`} className="ops-btn ops-btn--sm">
                            {t('ops.orders.openDetail')}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          ))}
        </section>
      ) : (
        <section className="ops-panel">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 14
            }}
          >
            <div className="ops-cat-tabs" style={{ paddingBottom: 0 }}>
              {['ALL', 'New', 'Processing', 'Ready', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`ops-cat-tab ${ledgerFilter === st ? 'is-on' : ''}`}
                  onClick={() => setLedgerFilter(st)}
                >
                  {st === 'ALL' ? t('ops.orders.filterAll') : t(`ops.statuses.${st}`)}
                </button>
              ))}
            </div>

            <div style={{ width: 240 }}>
              <input
                className="ops-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('ops.shell.quickSearchPlaceholder')}
              />
            </div>
          </div>

          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>{t('ops.dashboard.colTicket')}</th>
                  <th>{t('ops.dashboard.colTable')}</th>
                  <th>{t('ops.dashboard.colGuest')}</th>
                  <th>{t('ops.dashboard.colTime')}</th>
                  <th>{t('ops.dashboard.colStatus')}</th>
                  <th style={{ textAlign: 'right' }}>{t('ops.dashboard.colTotal')}</th>
                  <th style={{ textAlign: 'right' }} />
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map((ord) => (
                  <tr key={ord.id}>
                    <td className="ops-mono">
                      <Link to={`/orders/${ord.id}`} style={{ fontWeight: 700, color: 'inherit' }}>
                        #{ord.id}
                      </Link>
                    </td>
                    <td>{trData(ord.tableName)}</td>
                    <td>{trData(ord.customerName)}</td>
                    <td className="ops-mono">{clock(ord.createdAt)}</td>
                    <td>
                      <span
                        className={`ops-badge ${
                          ord.status === 'Completed' || ord.status === 'Ready'
                            ? 'ops-badge--ok'
                            : ord.status === 'Cancelled'
                              ? 'ops-badge--danger'
                              : 'ops-badge--warn'
                        }`}
                      >
                        {t(`ops.statuses.${ord.status}`)}
                      </span>
                    </td>
                    <td className="ops-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                      {money(ord.total)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        {ord.status === 'New' && (
                          <button
                            type="button"
                            className="ops-btn ops-btn--primary ops-btn--sm"
                            onClick={() => bumpStatus(ord.id, 'Processing')}
                          >
                            {t('ops.orders.bumpStart')}
                          </button>
                        )}
                        {ord.status === 'Processing' && (
                          <button
                            type="button"
                            className="ops-btn ops-btn--espresso ops-btn--sm"
                            onClick={() => bumpStatus(ord.id, 'Ready')}
                          >
                            {t('ops.orders.bumpReady')}
                          </button>
                        )}
                        {ord.status === 'Ready' && (
                          <Link to={`/payments/${ord.id}`} className="ops-btn ops-btn--ok ops-btn--sm">
                            {t('ops.orders.collectPay')}
                          </Link>
                        )}
                        {(ord.status === 'New' || ord.status === 'Processing') && (
                          <button
                            type="button"
                            className="ops-btn ops-btn--danger ops-btn--sm"
                            onClick={() => cancelOrder(ord.id)}
                          >
                            {t('ops.orders.cancelOrder')}
                          </button>
                        )}
                        <Link to={`/orders/${ord.id}`} className="ops-btn ops-btn--sm">
                          {t('ops.orders.openDetail')}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
