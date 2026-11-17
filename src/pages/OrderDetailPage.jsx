import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

const STAGES = ['New', 'Processing', 'Ready', 'Completed'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { t, tf, trData, money, when } = useLang();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api(`/api/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(nextStatus) {
    setBusy(true);
    setError('');
    try {
      await api(`/api/orders/${id}/status`, {
        method: 'POST',
        body: { status: nextStatus }
      });
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    setBusy(true);
    setError('');
    try {
      await api(`/api/orders/${id}/cancel`, { method: 'POST' });
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const stageIdx = order ? STAGES.indexOf(order.status) : -1;

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{tf('ops.orders.detailTitle', { id })}</h1>
          {order && (
            <p>
              {trData(order.tableName)} · {trData(order.customerName)} · {t('ops.orders.createdAt')}:{' '}
              <span className="ops-mono">{when(order.createdAt)}</span>
            </p>
          )}
        </div>

        <div className="ops-actions">
          <Link to="/orders" className="ops-btn">
            <OpsIcon name="arrowLeft" size={15} />
            <span>{t('ops.orders.backToKds')}</span>
          </Link>
          {order && order.status === 'New' && (
            <button
              type="button"
              disabled={busy}
              className="ops-btn ops-btn--primary"
              onClick={() => updateStatus('Processing')}
            >
              <OpsIcon name="bolt" size={15} />
              <span>{t('ops.orders.bumpStart')}</span>
            </button>
          )}
          {order && order.status === 'Processing' && (
            <button
              type="button"
              disabled={busy}
              className="ops-btn ops-btn--espresso"
              onClick={() => updateStatus('Ready')}
            >
              <OpsIcon name="check" size={15} />
              <span>{t('ops.orders.bumpReady')}</span>
            </button>
          )}
          {order && (order.status === 'Ready' || order.status === 'PendingMobilePayment') && (
            <>
              <button
                type="button"
                disabled={busy}
                className="ops-btn ops-btn--ok"
                onClick={() => updateStatus('Completed')}
              >
                <OpsIcon name="check" size={15} />
                <span>{t('ops.orders.bumpServe')}</span>
              </button>
              <Link to={`/payments/${order.id}`} className="ops-btn ops-btn--primary">
                <OpsIcon name="payments" size={15} />
                <span>{t('ops.orders.collectPay')}</span>
              </Link>
            </>
          )}
          {order && (order.status === 'New' || order.status === 'Processing') && (
            <button
              type="button"
              disabled={busy}
              className="ops-btn ops-btn--danger"
              onClick={handleCancel}
            >
              <OpsIcon name="close" size={15} />
              <span>{t('ops.orders.cancelOrder')}</span>
            </button>
          )}
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      {order && (
        <>
          {/* Stage Stepper */}
          <section className="ops-panel">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 10
              }}
            >
              {STAGES.map((st, idx) => {
                const active = stageIdx >= idx;
                return (
                  <div
                    key={st}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: active
                        ? '1px solid var(--an-caramel)'
                        : '1px solid var(--an-line)',
                      background: active
                        ? 'color-mix(in srgb, var(--an-caramel) 14%, var(--an-panel))'
                        : 'var(--an-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <span className="ops-performer-rank">{idx + 1}</span>
                    <strong style={{ fontSize: 13 }}>{t(`ops.statuses.${st}`)}</strong>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ticket Line Items */}
          <section className="ops-panel">
            <div className="ops-table-wrap">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>{t('ops.orders.lineItem')}</th>
                    <th style={{ textAlign: 'center' }}>{t('ops.orders.qty')}</th>
                    <th style={{ textAlign: 'right' }}>{t('ops.orders.unitPrice')}</th>
                    <th style={{ textAlign: 'right' }}>{t('ops.orders.lineTotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.details || []).map((line, i) => (
                    <tr key={line.id || i}>
                      <td>
                        <strong style={{ fontSize: 13.5 }}>{trData(line.name)}</strong>
                        {line.modifiers && (
                          <div style={{ fontSize: 12, color: 'var(--an-muted)', marginTop: 2 }}>
                            {trData(line.modifiers)}
                          </div>
                        )}
                      </td>
                      <td className="ops-mono" style={{ textAlign: 'center', fontWeight: 700 }}>
                        {line.quantity}
                      </td>
                      <td className="ops-mono" style={{ textAlign: 'right' }}>
                        {money(line.price)}
                      </td>
                      <td className="ops-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                        {money(line.price * line.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ paddingTop: 14, fontWeight: 700 }}>
                      {t('ops.orders.grandTotal')}
                    </td>
                    <td
                      className="ops-mono"
                      style={{ paddingTop: 14, textAlign: 'right', fontSize: 18, fontWeight: 700 }}
                    >
                      {money(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
