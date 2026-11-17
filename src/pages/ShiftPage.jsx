import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

export default function ShiftPage() {
  const { t, tf, trData, money, when } = useLang();

  const [shiftState, setShiftState] = useState({ open: false, shift: null, history: [] });
  const [openingFloat, setOpeningFloat] = useState('2000000');
  const [openNotes, setOpenNotes] = useState('');

  const [pettyType, setPettyType] = useState('out');
  const [pettyAmount, setPettyAmount] = useState('');
  const [pettyReason, setPettyReason] = useState('');

  const [actualCash, setActualCash] = useState('');
  const [closeNotes, setCloseNotes] = useState('');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadShift = useCallback(async () => {
    try {
      const [res, histFallback] = await Promise.all([
        api('/api/shift'),
        api('/api/shift/history').catch(() => [])
      ]);
      const shift = res?.shift || null;
      const history = res?.history || histFallback || [];
      setShiftState({
        open: Boolean(res?.open && shift),
        shift,
        history
      });
      if (shift) {
        const expected =
          shift.expectedCash ??
          Number(shift.openingFloat || 0) +
            Number(shift.cashTotal || 0) +
            Number(shift.paidIn || 0) -
            Number(shift.paidOut || 0);
        setActualCash((prev) => (prev === '' ? String(expected) : prev));
      } else {
        setActualCash('');
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadShift();
  }, [loadShift]);

  const shift = shiftState.shift;

  const expectedCash = useMemo(() => {
    if (!shift) return 0;
    if (shift.expectedCash !== undefined) return Number(shift.expectedCash);
    return (
      Number(shift.openingFloat || 0) +
      Number(shift.cashTotal || 0) +
      Number(shift.paidIn || 0) -
      Number(shift.paidOut || 0)
    );
  }, [shift]);

  const variance = useMemo(() => {
    if (!shift || actualCash === '') return 0;
    return Number(actualCash || 0) - expectedCash;
  }, [shift, actualCash, expectedCash]);

  async function handleOpenShift(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/api/shift/open', {
        method: 'POST',
        body: {
          openingFloat: Number(openingFloat || 0),
          notes: openNotes
        }
      });
      setOpenNotes('');
      setActualCash('');
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      await loadShift();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePettyEvent(e) {
    e.preventDefault();
    if (!pettyAmount || Number(pettyAmount) <= 0) return;
    setError('');
    setBusy(true);
    try {
      const updated = await api('/api/shift/cash-event', {
        method: 'POST',
        body: {
          type: pettyType,
          amount: Number(pettyAmount),
          reason: pettyReason
        }
      });
      setPettyAmount('');
      setPettyReason('');
      if (updated?.expectedCash !== undefined) {
        setActualCash(String(updated.expectedCash));
      }
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      await loadShift();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCloseShift(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/api/shift/close', {
        method: 'POST',
        body: {
          actualCash: actualCash === '' ? expectedCash : Number(actualCash),
          notes: closeNotes
        }
      });
      setCloseNotes('');
      setActualCash('');
      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      await loadShift();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.shift.title')}</h1>
          <p>{t('ops.shift.subtitle')}</p>
        </div>

        <div className="ops-actions">
          {shiftState.open && shift ? (
            <span className="ops-badge ops-badge--ok" style={{ padding: '6px 12px', fontSize: 12.5 }}>
              <OpsIcon name="shift" size={15} />
              <span>{tf('ops.shift.statusOpenBadge', { id: shift.id })}</span>
            </span>
          ) : (
            <span className="ops-badge ops-badge--danger" style={{ padding: '6px 12px', fontSize: 12.5 }}>
              <OpsIcon name="lock" size={15} />
              <span>{t('ops.shift.statusClosedBadge')}</span>
            </span>
          )}
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      {!shiftState.open ? (
        <section className="ops-panel" style={{ maxWidth: 680 }}>
          <div className="ops-panel-head">
            <div>
              <h2>{t('ops.shift.openCardTitle')}</h2>
              <p>{t('ops.shift.openCardSub')}</p>
            </div>
            <OpsIcon name="cash" size={20} />
          </div>

          <form onSubmit={handleOpenShift} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="ops-field">
              <label htmlFor="opening-float-input">{t('ops.shift.openingFloatLabel')}</label>
              <input
                id="opening-float-input"
                type="number"
                min="0"
                step="10000"
                className="ops-input ops-mono"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(e.target.value)}
                required
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                {[1000000, 2000000, 3000000, 5000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="ops-btn ops-btn--sm ops-mono"
                    onClick={() => setOpeningFloat(String(preset))}
                  >
                    {money(preset)}
                  </button>
                ))}
              </div>
            </div>

            <div className="ops-field">
              <label htmlFor="open-shift-notes">{t('ops.shift.notesLabel')}</label>
              <input
                id="open-shift-notes"
                className="ops-input"
                value={openNotes}
                onChange={(e) => setOpenNotes(e.target.value)}
                placeholder={t('ops.shift.notesPlaceholder')}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={busy}
                className="ops-btn ops-btn--espresso"
                style={{ height: 42 }}
              >
                <OpsIcon name="shift" size={16} />
                <span>{t('ops.shift.openShiftBtn')}</span>
              </button>
            </div>
          </form>
        </section>
      ) : (
        <>
          {/* Live Drawer & Tender Breakdown Strip */}
          <section className="ops-pulse-strip">
            <article className="ops-pulse-lead">
              <div className="ops-pulse-lead__label">
                <span>{t('ops.shift.expectedDrawerCash')}</span>
                <OpsIcon name="cash" size={17} />
              </div>
              <div className="ops-pulse-lead__val" data-testid="expected-drawer-cash">
                {money(expectedCash)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--an-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  {t('ops.shift.openedBy')}: <strong>{shift.openedBy}</strong>
                </span>
                <span className="ops-mono">{when(shift.openedAt)}</span>
              </div>
            </article>

            <article className="ops-pulse-metric">
              <div className="ops-pulse-metric__top">
                <span>{t('ops.shift.cashSales')}</span>
                <OpsIcon name="cash" size={15} />
              </div>
              <div className="ops-pulse-metric__val">{money(shift.cashTotal)}</div>
              <div className="ops-pulse-metric__sub">
                <span>Float: {money(shift.openingFloat)}</span>
              </div>
            </article>

            <article className="ops-pulse-metric">
              <div className="ops-pulse-metric__top">
                <span>{t('ops.shift.cardSales')}</span>
                <OpsIcon name="card" size={15} />
              </div>
              <div className="ops-pulse-metric__val">{money(shift.cardTotal)}</div>
              <div className="ops-pulse-metric__sub">
                <span>POS Napas / Visa</span>
              </div>
            </article>

            <article className="ops-pulse-metric">
              <div className="ops-pulse-metric__top">
                <span>{t('ops.shift.qrSales')}</span>
                <OpsIcon name="qr" size={15} />
              </div>
              <div className="ops-pulse-metric__val">{money(shift.mobileSimTotal)}</div>
              <div className="ops-pulse-metric__sub">
                <span>VietQR</span>
              </div>
            </article>

            <article className="ops-pulse-metric">
              <div className="ops-pulse-metric__top">
                <span>{t('ops.shift.paidOrders')}</span>
                <OpsIcon name="receipt" size={15} />
              </div>
              <div className="ops-pulse-metric__val">{shift.paidOrderCount}</div>
              <div className="ops-pulse-metric__sub">
                <span className="ops-mono">{money(shift.grandTotal)}</span>
              </div>
            </article>
          </section>

          {/* Petty Cash Events + Blind Count Reconciliation */}
          <section className="ops-shift-grid">
            {/* Paid-In / Paid-Out Petty Cash */}
            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.shift.pettyTitle')}</h2>
                  <p>{t('ops.shift.pettySub')}</p>
                </div>
              </div>

              <form onSubmit={handlePettyEvent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="ops-seg" role="group" aria-label="Petty cash direction">
                  <button
                    type="button"
                    className={pettyType === 'out' ? 'is-on' : ''}
                    onClick={() => setPettyType('out')}
                  >
                    <OpsIcon name="minus" size={14} />
                    <span>{t('ops.shift.pettyOut')}</span>
                  </button>
                  <button
                    type="button"
                    className={pettyType === 'in' ? 'is-on' : ''}
                    onClick={() => setPettyType('in')}
                  >
                    <OpsIcon name="plus" size={14} />
                    <span>{t('ops.shift.pettyIn')}</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10 }}>
                  <div className="ops-field">
                    <label htmlFor="petty-amount">{t('ops.shift.pettyAmount')}</label>
                    <input
                      id="petty-amount"
                      type="number"
                      min="1000"
                      step="1000"
                      className="ops-input ops-mono"
                      value={pettyAmount}
                      onChange={(e) => setPettyAmount(e.target.value)}
                      placeholder="85000"
                      required
                    />
                  </div>
                  <div className="ops-field">
                    <label htmlFor="petty-reason">{t('ops.shift.pettyReason')}</label>
                    <input
                      id="petty-reason"
                      className="ops-input"
                      value={pettyReason}
                      onChange={(e) => setPettyReason(e.target.value)}
                      placeholder={t('ops.shift.pettyReasonPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <button type="submit" disabled={busy} className="ops-btn ops-btn--primary">
                    <OpsIcon name="plus" size={15} />
                    <span>{t('ops.shift.pettySubmit')}</span>
                  </button>
                </div>
              </form>

              <div style={{ marginTop: 16, borderTop: '1px solid var(--an-line)', paddingTop: 12 }}>
                {!shift.cashEvents?.length ? (
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--an-muted)' }}>
                    {t('ops.shift.pettyEmpty')}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {shift.cashEvents.map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 10px',
                          borderRadius: 8,
                          background: 'var(--an-soft)',
                          fontSize: 12.5
                        }}
                      >
                        <div>
                          <span
                            className={`ops-badge ${
                              ev.type === 'in' ? 'ops-badge--ok' : 'ops-badge--danger'
                            }`}
                            style={{ marginRight: 8 }}
                          >
                            {ev.type === 'in' ? t('ops.shift.pettyIn') : t('ops.shift.pettyOut')}
                          </span>
                          <strong>{trData(ev.reason)}</strong>
                        </div>
                        <strong
                          className="ops-mono"
                          style={{ color: ev.type === 'in' ? 'var(--an-ok)' : 'var(--an-danger)' }}
                        >
                          {ev.type === 'in' ? '+' : '-'}
                          {money(ev.amount)}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Blind Count Variance Calculator */}
            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.shift.blindTitle')}</h2>
                  <p>{t('ops.shift.blindSub')}</p>
                </div>
                <OpsIcon name="shield" size={18} />
              </div>

              <form onSubmit={handleCloseShift} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="ops-field">
                  <label htmlFor="blind-count-input">{t('ops.shift.actualCashLabel')}</label>
                  <input
                    id="blind-count-input"
                    type="number"
                    min="0"
                    step="1000"
                    className="ops-input ops-mono"
                    style={{ fontSize: 18, fontWeight: 700 }}
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                    required
                  />
                </div>

                {/* Live Variance Readout */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 9,
                    border: '1px solid var(--an-line)',
                    background: 'var(--an-soft)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--an-muted)', fontWeight: 600 }}>
                      {t('ops.shift.varianceLabel')}
                    </div>
                    <strong
                      className="ops-mono"
                      data-testid="drawer-variance"
                      style={{
                        fontSize: 20,
                        color:
                          variance === 0
                            ? 'var(--an-ok)'
                            : variance > 0
                              ? 'var(--an-caramel)'
                              : 'var(--an-danger)'
                      }}
                    >
                      {variance > 0 ? `+${money(variance)}` : money(variance)}
                    </strong>
                  </div>

                  <span
                    className={`ops-badge ${
                      variance === 0
                        ? 'ops-badge--ok'
                        : variance > 0
                          ? 'ops-badge--caramel'
                          : 'ops-badge--danger'
                    }`}
                  >
                    {variance === 0
                      ? t('ops.shift.varianceBalanced')
                      : variance > 0
                        ? t('ops.shift.varianceOver')
                        : t('ops.shift.varianceShort')}
                  </span>
                </div>

                <div className="ops-field">
                  <label htmlFor="close-shift-notes">{t('ops.shift.notesLabel')}</label>
                  <input
                    id="close-shift-notes"
                    className="ops-input"
                    value={closeNotes}
                    onChange={(e) => setCloseNotes(e.target.value)}
                    placeholder={t('ops.shift.closeNotesPlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="ops-btn ops-btn--espresso"
                  style={{ height: 42 }}
                >
                  <OpsIcon name="lock" size={16} />
                  <span>{t('ops.shift.closeShiftBtn')}</span>
                </button>
              </form>
            </div>
          </section>
        </>
      )}

      {/* Shift Audit History Log */}
      <section className="ops-panel">
        <div className="ops-panel-head">
          <div>
            <h2>{t('ops.shift.historyTitle')}</h2>
            <p>{t('ops.shift.historySub')}</p>
          </div>
        </div>

        {!shiftState.history?.length ? (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--an-muted)' }}>
            {t('ops.shift.historyEmpty')}
          </p>
        ) : (
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('ops.shift.openedBy')}</th>
                  <th>{t('ops.shift.openedAt')}</th>
                  <th style={{ textAlign: 'right' }}>{t('ops.shift.expectedDrawerCash')}</th>
                  <th style={{ textAlign: 'right' }}>{t('ops.shift.actualCashLabel')}</th>
                  <th style={{ textAlign: 'right' }}>{t('ops.shift.varianceLabel')}</th>
                  <th>{t('ops.shift.notesLabel')}</th>
                </tr>
              </thead>
              <tbody>
                {shiftState.history.map((h) => {
                  const exp =
                    h.expectedCash ?? Number(h.openingFloat || 0) + Number(h.cashTotal || 0);
                  const act = h.actualCash ?? exp;
                  const diff = h.variance ?? act - exp;
                  return (
                    <tr key={h.id}>
                      <td className="ops-mono">#{h.id}</td>
                      <td>{h.closedBy || h.openedBy}</td>
                      <td className="ops-mono">{when(h.closedAt || h.openedAt)}</td>
                      <td className="ops-mono" style={{ textAlign: 'right' }}>
                        {money(exp)}
                      </td>
                      <td className="ops-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                        {money(act)}
                      </td>
                      <td
                        className="ops-mono"
                        style={{
                          textAlign: 'right',
                          fontWeight: 700,
                          color:
                            diff === 0
                              ? 'var(--an-ok)'
                              : diff > 0
                                ? 'var(--an-caramel)'
                                : 'var(--an-danger)'
                        }}
                      >
                        {diff > 0 ? `+${money(diff)}` : money(diff)}
                      </td>
                      <td style={{ color: 'var(--an-muted)', fontSize: 12.5 }}>{trData(h.notes)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
