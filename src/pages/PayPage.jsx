import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

export default function PayPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t, tf, trData, money } = useLang();

  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState('Cash');
  const [tendered, setTendered] = useState('');
  const [customerInfo, setCustomerInfo] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/api/orders/${orderId}`)
      .then((res) => {
        setOrder(res);
        setTendered(String(res.total || 0));
      })
      .catch((err) => setError(err.message));
  }, [orderId]);

  const changeDue = useMemo(() => {
    if (!order || method !== 'Cash') return 0;
    return Math.max(0, Number(tendered || 0) - Number(order.total || 0));
  }, [order, method, tendered]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!order || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await api('/api/payments', {
        method: 'POST',
        body: {
          orderId: order.id,
          paymentMethod: method,
          customerInfo,
          note
        }
      });
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      navigate(`/receipts/${res.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const methods = [
    { key: 'Cash', label: t('ops.payments.methodCash'), icon: 'cash' },
    { key: 'Card', label: t('ops.payments.methodCard'), icon: 'card' },
    { key: 'MobileSim', label: t('ops.payments.methodQr'), icon: 'qr' }
  ];

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{tf('ops.payments.payOrderTitle', { id: orderId })}</h1>
          {order && (
            <p>
              {trData(order.tableName)} · {trData(order.customerName)}
            </p>
          )}
        </div>

        <div className="ops-actions">
          <Link to="/payments" className="ops-btn">
            <OpsIcon name="arrowLeft" size={15} />
            <span>{t('ops.shell.navPayments')}</span>
          </Link>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      {order && (
        <div className="ops-shift-grid">
          <form onSubmit={handleSubmit} className="ops-panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ops-field">
              <label>{t('ops.payments.selectMethod')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                {methods.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMethod(m.key)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: 9,
                      border:
                        method === m.key
                          ? '2px solid var(--an-caramel)'
                          : '1px solid var(--an-line)',
                      background:
                        method === m.key
                          ? 'color-mix(in srgb, var(--an-caramel) 14%, var(--an-panel))'
                          : 'var(--an-panel)',
                      color: 'var(--an-ink)',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      fontSize: 12.5,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}
                  >
                    <OpsIcon name={m.icon} size={20} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {method === 'Cash' && (
              <div className="ops-field">
                <label htmlFor="cash-tendered">{t('ops.payments.cashTendered')}</label>
                <input
                  id="cash-tendered"
                  type="number"
                  min={order.total}
                  step="1000"
                  className="ops-input ops-mono"
                  style={{ fontSize: 17, fontWeight: 700 }}
                  value={tendered}
                  onChange={(e) => setTendered(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {[order.total, 200000, 500000].map((val, idx) => (
                    <button
                      key={`${val}-${idx}`}
                      type="button"
                      className="ops-btn ops-btn--sm ops-mono"
                      onClick={() => setTendered(String(val))}
                    >
                      {money(val)}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--an-soft)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{t('ops.payments.changeDue')}</span>
                  <strong className="ops-mono" style={{ fontSize: 18, color: 'var(--an-ok)' }}>
                    {money(changeDue)}
                  </strong>
                </div>
              </div>
            )}

            <div className="ops-field">
              <label htmlFor="crm-phone">{t('ops.payments.crmPhone')}</label>
              <input
                id="crm-phone"
                className="ops-input"
                value={customerInfo}
                onChange={(e) => setCustomerInfo(e.target.value)}
                placeholder="0903 100 001"
              />
            </div>

            <div className="ops-field">
              <label htmlFor="pay-note">{t('ops.payments.cashierNote')}</label>
              <input
                id="pay-note"
                className="ops-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="ops-btn ops-btn--espresso"
              style={{ height: 44, fontSize: 14 }}
            >
              <OpsIcon name="print" size={17} />
              <span>{t('ops.payments.confirmPay')}</span>
            </button>
          </form>

          <aside className="ops-panel">
            <div className="ops-panel-head">
              <h2>{t('ops.payments.orderSummary')}</h2>
              <strong className="ops-mono" style={{ fontSize: 18 }}>
                {money(order.total)}
              </strong>
            </div>

            <ul className="ops-kds-items" style={{ borderBottom: 0 }}>
              {(order.details || []).map((line, i) => (
                <li key={line.id || i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span>
                      <strong className="ops-mono">{line.quantity}×</strong> {trData(line.name)}
                    </span>
                    <span className="ops-mono">{money(line.price * line.quantity)}</span>
                  </div>
                  {line.modifiers && <small>{trData(line.modifiers)}</small>}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
