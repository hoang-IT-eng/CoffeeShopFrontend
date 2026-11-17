import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

export default function PaymentsPage() {
  const { t, trData, money, clock } = useLang();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const list = await api('/api/payments/ready');
      setOrders(list || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.payments.title')}</h1>
          <p>{t('ops.payments.subtitle')}</p>
        </div>

        <div className="ops-actions">
          <button type="button" className="ops-btn" onClick={load}>
            <OpsIcon name="refresh" size={15} />
            <span>{t('ops.floor.refresh')}</span>
          </button>
          <Link to="/tables" className="ops-btn ops-btn--primary">
            <OpsIcon name="floor" size={15} />
            <span>{t('ops.payments.backToFloor')}</span>
          </Link>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      {orders.length === 0 ? (
        <section
          className="ops-panel"
          style={{ padding: '42px 24px', textAlign: 'center' }}
        >
          <OpsIcon name="payments" size={28} />
          <h2 style={{ margin: '10px 0 4px', fontSize: 18 }}>{t('ops.payments.emptyTitle')}</h2>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--an-muted)' }}>
            {t('ops.payments.emptySub')}
          </p>
        </section>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 14
          }}
        >
          {orders.map((ord) => (
            <article key={ord.id} className="ops-panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong className="ops-mono" style={{ fontSize: 16 }}>
                    #{ord.id}
                  </strong>
                  <span className="ops-badge ops-badge--caramel">{trData(ord.tableName)}</span>
                </div>
                <span className="ops-badge ops-badge--ok">{t(`ops.statuses.${ord.status}`)}</span>
              </div>

              <div style={{ fontSize: 12.5, color: 'var(--an-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{trData(ord.customerName)}</span>
                <span className="ops-mono">{clock(ord.createdAt)}</span>
              </div>

              <ul className="ops-kds-items" style={{ flex: 1 }}>
                {(ord.details || []).slice(0, 4).map((line, i) => (
                  <li key={line.id || i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>
                        <strong className="ops-mono">{line.quantity}×</strong> {trData(line.name)}
                      </span>
                      <span className="ops-mono">{money(line.price * line.quantity)}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--an-muted)' }}>{t('ops.payments.amountDue')}</div>
                  <strong className="ops-mono" style={{ fontSize: 20 }}>
                    {money(ord.total)}
                  </strong>
                </div>

                <Link to={`/payments/${ord.id}`} className="ops-btn ops-btn--espresso">
                  <OpsIcon name="payments" size={15} />
                  <span>{t('ops.payments.settleBtn')}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
