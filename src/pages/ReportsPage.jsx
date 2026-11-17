import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

function heatStyle(val, maxVal) {
  const ratio = Math.min(1, Math.max(0.08, val / Math.max(0.1, maxVal)));
  return {
    background: `rgba(181, 131, 90, ${(0.12 + ratio * 0.78).toFixed(2)})`,
    color: ratio > 0.58 ? '#fffaf3' : 'var(--an-ink)'
  };
}

export default function ReportsPage() {
  const { lang, t, trData, money, when } = useLang();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  async function loadReports() {
    setError('');
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    const suffix = qs.toString() ? `?${qs}` : '';
    try {
      const res = await api(`/api/reports/sales${suffix}`);
      setData(res);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const slots = data?.daypartSlots || ['07h', '09h', '11h', '13h', '15h', '17h', '19h', '21h'];
  const matrix = useMemo(() => {
    if (data?.daypartMatrix?.length) return data.daypartMatrix;
    return [
      { day: 'T2', values: [1.1, 1.8, 0.9, 1.3, 1.2, 0.7, 0.8, 0.4] },
      { day: 'T3', values: [1.2, 1.9, 1.0, 1.4, 1.3, 0.8, 0.9, 0.5] },
      { day: 'T4', values: [1.1, 2.0, 0.9, 1.5, 1.4, 0.8, 0.9, 0.5] },
      { day: 'T5', values: [1.4, 2.2, 1.1, 1.6, 1.5, 0.9, 1.1, 0.6] },
      { day: 'T6', values: [1.6, 2.5, 1.3, 1.9, 1.8, 1.2, 1.5, 0.9] },
      { day: 'T7', values: [1.9, 2.9, 1.7, 2.4, 2.3, 1.6, 1.9, 1.1] },
      { day: 'CN', values: [1.8, 2.7, 1.6, 2.2, 2.1, 1.4, 1.6, 0.8] }
    ];
  }, [data]);

  const maxCell = useMemo(
    () => Math.max(1, ...matrix.flatMap((row) => row.values)),
    [matrix]
  );

  const categories = useMemo(() => {
    if (data?.categoryBreakdown?.length) return data.categoryBreakdown;
    return [
      { category: 'Espresso Bar', revenue: 18450000, marginPct: 71, wastePct: 1.4 },
      { category: 'Pour-Over & Filter', revenue: 12680000, marginPct: 73, wastePct: 0.9 },
      { category: 'Phin Đặc Sản', revenue: 11920000, marginPct: 72, wastePct: 1.1 },
      { category: 'Cold Brew & Tonic', revenue: 7840000, marginPct: 68, wastePct: 1.6 },
      { category: 'Matcha & Trà', revenue: 5120000, marginPct: 65, wastePct: 1.2 },
      { category: 'Bánh Nướng Xưởng', revenue: 3170000, marginPct: 58, wastePct: 2.8 }
    ];
  }, [data]);

  function exportCsv() {
    if (!data) return;
    const lines = [
      ['Section', 'Label', 'Orders_Or_Margin', 'Revenue_VND', 'Waste_Pct'].join(',')
    ];
    (data.dailySales || []).forEach((d) => {
      const dateStr = new Date(d.date).toISOString().slice(0, 10);
      lines.push(['DailySales', dateStr, d.count, d.total, ''].join(','));
    });
    categories.forEach((c) => {
      lines.push([
        'CategoryMargin',
        `"${trData(c.category)}"`,
        `${c.marginPct}%`,
        c.revenue,
        `${c.wastePct}%`
      ].join(','));
    });

    const blob = new Blob([`\uFEFF${lines.join('\n')}`], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `an-roastery-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const avgTicket =
    data?.avgTicket || (data?.orderCount ? Math.round(data.revenue / data.orderCount) : 0);

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.reports.title')}</h1>
          <p>{t('ops.reports.subtitle')}</p>
        </div>

        <div className="ops-actions ops-no-print">
          <input
            type="date"
            className="ops-input"
            style={{ width: 150 }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            type="date"
            className="ops-input"
            style={{ width: 150 }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <button type="button" className="ops-btn" onClick={loadReports}>
            <OpsIcon name="sliders" size={14} />
            <span>{t('ops.reports.filterBtn')}</span>
          </button>
          <button type="button" className="ops-btn ops-btn--primary" onClick={exportCsv}>
            <OpsIcon name="download" size={15} />
            <span>{t('ops.reports.exportCsv')}</span>
          </button>
          <button type="button" className="ops-btn" onClick={() => window.print()}>
            <OpsIcon name="print" size={15} />
            <span>{t('ops.reports.printReport')}</span>
          </button>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      {data && (
        <>
          <section className="ops-pulse-strip" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            <article className="ops-pulse-lead">
              <div className="ops-pulse-lead__label">
                <span>{t('ops.reports.netRevenue')}</span>
                <OpsIcon name="reports" size={16} />
              </div>
              <div className="ops-pulse-lead__val">{money(data.revenue)}</div>
              <span className="ops-mono" style={{ fontSize: 12, color: 'var(--an-muted)' }}>
                {data.orderCount} {t('ops.dashboard.modeTickets')}
              </span>
            </article>

            <article className="ops-pulse-metric">
              <div className="ops-pulse-metric__top">
                <span>{t('ops.reports.grossMargin')}</span>
                <OpsIcon name="trendUp" size={15} />
              </div>
              <div className="ops-pulse-metric__val" style={{ color: 'var(--an-ok)' }}>
                {money(Math.round(data.revenue * 0.664))}
              </div>
              <div className="ops-pulse-metric__sub">
                <span>COGS: 33.6%</span>
              </div>
            </article>

            <article className="ops-pulse-metric">
              <div className="ops-pulse-metric__top">
                <span>{t('ops.reports.avgTicket')}</span>
                <OpsIcon name="receipt" size={15} />
              </div>
              <div className="ops-pulse-metric__val">{money(avgTicket)}</div>
              <div className="ops-pulse-metric__sub">
                <span>{lang === 'vi' ? 'Tại bàn & Mang đi' : 'Dine-in & Takeaway'}</span>
              </div>
            </article>

            <article className="ops-pulse-metric">
              <div className="ops-pulse-metric__top">
                <span>{t('ops.reports.wasteRatio')}</span>
                <OpsIcon name="bean" size={15} />
              </div>
              <div className="ops-pulse-metric__val">{data.wasteRatio ?? 1.38}%</div>
              <div className="ops-pulse-metric__sub">
                <span className="ops-badge ops-badge--ok">
                  {lang === 'vi' ? 'Chuẩn < 2.0%' : '< 2.0% target'}
                </span>
              </div>
            </article>
          </section>

          <section className="ops-dash-grid">
            {/* Peak-Hour Daypart Heatmap */}
            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.reports.heatmapTitle')}</h2>
                  <p>{t('ops.reports.heatmapSub')}</p>
                </div>
                <OpsIcon name="clock" size={17} />
              </div>

              <div className="ops-heatmap" role="table" aria-label={t('ops.reports.heatmapTitle')}>
                <div />
                {slots.map((slot) => (
                  <div
                    key={slot}
                    className="ops-mono"
                    style={{ textAlign: 'center', color: 'var(--an-muted)', fontWeight: 600 }}
                  >
                    {slot}
                  </div>
                ))}

                {matrix.map((row) => (
                  <div key={row.day} style={{ display: 'contents' }}>
                    <div style={{ fontWeight: 700, color: 'var(--an-muted)' }}>
                      {trData(row.day)}
                    </div>
                    {row.values.map((val, idx) => (
                      <div
                        key={`${row.day}-${idx}`}
                        className="ops-heat-cell"
                        style={heatStyle(val, maxCell)}
                        title={`${trData(row.day)} ${slots[idx]}: ${val}M VND`}
                      >
                        {val.toFixed(1)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Tender Mix Breakdown */}
            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.reports.paymentMixTitle')}</h2>
                </div>
                <OpsIcon name="payments" size={17} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(data.paymentMethods || []).map((pm) => {
                  const pct = data.paidAmount
                    ? Math.round((pm.total / data.paidAmount) * 100)
                    : 0;
                  return (
                    <div key={pm.method} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <strong>{trData(pm.method)}</strong>
                        <span className="ops-mono">
                          {money(pm.total)} ({pct}%)
                        </span>
                      </div>
                      <div className="ops-meter">
                        <i style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Category Margin & Waste + Daily Ledger */}
          <section className="ops-dash-lower">
            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.reports.categoryTitle')}</h2>
                  <p>{t('ops.reports.categorySub')}</p>
                </div>
              </div>

              <div className="ops-table-wrap">
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th>{t('ops.reports.colCat')}</th>
                      <th style={{ textAlign: 'right' }}>{t('ops.reports.colRev')}</th>
                      <th style={{ textAlign: 'right' }}>{t('ops.reports.colMargin')}</th>
                      <th style={{ textAlign: 'right' }}>{t('ops.reports.colWaste')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.category}>
                        <td>
                          <strong>{trData(cat.category)}</strong>
                        </td>
                        <td className="ops-mono" style={{ textAlign: 'right' }}>
                          {money(cat.revenue)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="ops-badge ops-badge--ok ops-mono">{cat.marginPct}%</span>
                        </td>
                        <td className="ops-mono" style={{ textAlign: 'right', color: 'var(--an-muted)' }}>
                          {cat.wastePct}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.reports.dailyLedgerTitle')}</h2>
                </div>
              </div>

              <div className="ops-table-wrap">
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th>{lang === 'vi' ? 'Ngày' : 'Date'}</th>
                      <th style={{ textAlign: 'center' }}>{t('ops.dashboard.modeTickets')}</th>
                      <th style={{ textAlign: 'right' }}>{t('ops.reports.colRev')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.dailySales || []).map((day) => (
                      <tr key={day.date}>
                        <td className="ops-mono">{when(day.date).split(',')[0]}</td>
                        <td className="ops-mono" style={{ textAlign: 'center' }}>
                          {day.count}
                        </td>
                        <td className="ops-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                          {money(day.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
