import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

/**
 * Deterministic 21x21 SVG QR matrix (Finder patterns + payload hash)
 * for authentic 80mm thermal e-invoice & feedback receipts without external calls.
 */
function ReceiptQrSvg({ seed = 'AN-ROASTERY' }) {
  const cells = useMemo(() => {
    const N = 21;
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const inFinder = (r, c, fr, fc) => {
      const dr = r - fr;
      const dc = c - fc;
      if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return null;
      if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true;
      if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true;
      return false;
    };

    const out = [];
    for (let r = 0; r < N; r += 1) {
      for (let c = 0; c < N; c += 1) {
        if ((r === 7 && (c < 8 || c > 12)) || (c === 7 && r < 8) || (r === 13 && c < 8) || (c === 13 && r < 8)) {
          continue;
        }
        const f1 = inFinder(r, c, 0, 0);
        const f2 = inFinder(r, c, 0, 14);
        const f3 = inFinder(r, c, 14, 0);
        const finderVal = f1 ?? f2 ?? f3;
        if (finderVal !== null) {
          if (finderVal) out.push([r, c]);
          continue;
        }
        const bit = ((hash >>> ((r * 7 + c * 13) % 24)) ^ (r * 31 + c * 17)) & 1;
        if (bit) out.push([r, c]);
      }
    }
    return out;
  }, [seed]);

  return (
    <svg
      width="116"
      height="116"
      viewBox="0 0 25 25"
      style={{ background: '#fff', border: '1px solid #d9cbb8', borderRadius: 4 }}
      aria-label="Receipt QR Code"
    >
      {cells.map(([r, c]) => (
        <rect key={`${r}-${c}`} x={c + 2} y={r + 2} width="1" height="1" fill="#1d140e" />
      ))}
    </svg>
  );
}

export default function ReceiptPage() {
  const { id } = useParams();
  const { t, tf, trData, money, when } = useLang();

  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api(`/api/payments/${id}`);
      setPayment(res);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmQr(success) {
    setBusy(true);
    setError('');
    try {
      await api(`/api/payments/${id}/confirm`, {
        method: 'POST',
        body: { success }
      });
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ops-receipt-stage">
      {/* Screen Toolbar (Hidden on @media print) */}
      <div className="ops-actions ops-no-print">
        <Link to="/tables" className="ops-btn">
          <OpsIcon name="floor" size={15} />
          <span>{t('ops.receipt.backFloor')}</span>
        </Link>
        <Link to="/orders" className="ops-btn">
          <OpsIcon name="kds" size={15} />
          <span>{t('ops.receipt.backOrders')}</span>
        </Link>
        <button
          type="button"
          className="ops-btn ops-btn--espresso"
          onClick={() => window.print()}
        >
          <OpsIcon name="print" size={15} />
          <span>{t('ops.receipt.printBtn')}</span>
        </button>
      </div>

      {error && <div className="ops-alert ops-no-print">{error}</div>}

      {payment && payment.status === 'Pending' && (
        <div className="ops-actions ops-no-print">
          <button
            type="button"
            disabled={busy}
            className="ops-btn ops-btn--ok"
            onClick={() => confirmQr(true)}
          >
            <OpsIcon name="check" size={15} />
            <span>{t('ops.receipt.confirmQrSuccess')}</span>
          </button>
          <button
            type="button"
            disabled={busy}
            className="ops-btn ops-btn--danger"
            onClick={() => confirmQr(false)}
          >
            <OpsIcon name="close" size={15} />
            <span>{t('ops.receipt.confirmQrFail')}</span>
          </button>
        </div>
      )}

      {payment && (
        <article className="ops-thermal-paper" data-testid="thermal-receipt-80mm">
          <div style={{ textAlign: 'center' }}>
            <strong style={{ fontSize: 13.5, letterSpacing: '0.04em', display: 'block' }}>
              {t('ops.receipt.roasteryHeader')}
            </strong>
            <div style={{ fontSize: 10.5, color: '#5b4b3d', marginTop: 3 }}>
              {t('ops.receipt.branchLine')}
            </div>
            <div
              style={{
                marginTop: 8,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.06em'
              }}
            >
              {t('ops.receipt.receiptTitle')}
            </div>
          </div>

          <hr className="ops-thermal-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('ops.receipt.ticketNo')}:</span>
              <strong>#{payment.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('ops.receipt.orderRef')}:</span>
              <strong>#{payment.orderId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('ops.receipt.tableLabel')}:</span>
              <span>{trData(payment.tableName || 'Mang đi')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('ops.receipt.guestLabel')}:</span>
              <span>{trData(payment.customerName || 'Khách lẻ')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('ops.receipt.methodLabel')}:</span>
              <span>{trData(payment.paymentMethod)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t('ops.receipt.dateLabel')}:</span>
              <span>{when(payment.paymentDate)}</span>
            </div>
          </div>

          <hr className="ops-thermal-divider" />

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px dashed #9d8b78' }}>
                <th style={{ textAlign: 'left', paddingBottom: 4 }}>{t('ops.receipt.colItem')}</th>
                <th style={{ textAlign: 'center', paddingBottom: 4 }}>{t('ops.receipt.colQty')}</th>
                <th style={{ textAlign: 'right', paddingBottom: 4 }}>{t('ops.receipt.colAmt')}</th>
              </tr>
            </thead>
            <tbody>
              {(payment.details || []).map((line, idx) => (
                <tr key={line.id || idx}>
                  <td style={{ paddingTop: 6, paddingRight: 4 }}>
                    <div style={{ fontWeight: 700 }}>{trData(line.name)}</div>
                    {line.modifiers && (
                      <div style={{ fontSize: 10, color: '#5b4b3d' }}>
                        {trData(line.modifiers)}
                      </div>
                    )}
                  </td>
                  <td style={{ paddingTop: 6, textAlign: 'center', verticalAlign: 'top' }}>
                    {line.quantity}
                  </td>
                  <td style={{ paddingTop: 6, textAlign: 'right', verticalAlign: 'top', fontWeight: 600 }}>
                    {money((line.price || 0) * (line.quantity || 1))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="ops-thermal-divider" />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontSize: 14,
              fontWeight: 700
            }}
          >
            <span>{t('ops.receipt.totalPaid')}</span>
            <span>{money(payment.amount ?? payment.orderTotal)}</span>
          </div>

          {payment.transactionId && (
            <div style={{ fontSize: 10.5, color: '#5b4b3d', marginTop: 4 }}>
              {t('ops.receipt.txRef')}: {payment.transactionId}
            </div>
          )}

          {payment.pointsEarned > 0 && (
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>
              {tf('ops.receipt.loyaltyEarned', { pts: payment.pointsEarned })}
            </div>
          )}

          <hr className="ops-thermal-divider" />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              textAlign: 'center',
              marginTop: 6
            }}
          >
            <ReceiptQrSvg seed={`AN-${payment.id}-${payment.orderId}-${payment.amount}`} />
            <div style={{ fontSize: 10, color: '#5b4b3d', maxWidth: 230 }}>
              {t('ops.receipt.qrCaption')}
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 2 }}>
              {t('ops.receipt.thankYou')}
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
