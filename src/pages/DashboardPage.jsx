import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { hasRole, useAuth } from '../auth';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

const RANGES = ['today', 'week', 'month', 'year'];

function RushSvgChart({ points, mode, money, t }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  if (!points?.length) return null;

  const values = points.map((p) => Number(mode === 'tickets' ? p.count : p.revenue) || 0);
  const maxVal = Math.max(...values, 1);
  const W = 720;
  const H = 220;
  const padL = 16;
  const padR = 16;
  const padT = 22;
  const padB = 34;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const coords = points.map((pt, i) => {
    const x =
      points.length === 1
        ? padL + innerW / 2
        : padL + (i / (points.length - 1)) * innerW;
    const val = values[i];
    const y = padT + innerH - (val / maxVal) * innerH;
    return { x, y, pt, val };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${padT + innerH} L${coords[0].x.toFixed(1)},${padT + innerH} Z`;

  const activeIdx =
    hoverIdx !== null && coords[hoverIdx]
      ? hoverIdx
      : values.reduce((best, v, idx) => (v > values[best] ? idx : best), 0);
  const active = coords[activeIdx];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '8px 12px',
          borderRadius: 8,
          background: 'var(--an-soft)',
          marginBottom: 10,
          fontSize: 12.5
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 600 }}>
          <OpsIcon name="clock" size={14} />
          <span className="ops-mono">{active.pt.label}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span>
            {t('ops.dashboard.modeRevenue')}:{' '}
            <strong className="ops-mono">{money(active.pt.revenue)}</strong>
          </span>
          <span>
            {t('ops.dashboard.modeTickets')}:{' '}
            <strong className="ops-mono">{active.pt.count}</strong>
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 220, display: 'block', overflow: 'visible' }}
        role="img"
        aria-label={t('ops.dashboard.rushChartTitle')}
      >
        <defs>
          <linearGradient id="anRushFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b5835a" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#b5835a" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((step) => {
          const gy = padT + innerH * step;
          return (
            <line
              key={step}
              x1={padL}
              x2={W - padR}
              y1={gy}
              y2={gy}
              stroke="var(--an-line)"
              strokeDasharray="3 4"
            />
          );
        })}

        <path d={areaPath} fill="url(#anRushFill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#b5835a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {active && (
          <line
            x1={active.x}
            x2={active.x}
            y1={padT}
            y2={padT + innerH}
            stroke="#b5835a"
            strokeDasharray="2 3"
            opacity="0.65"
          />
        )}

        {coords.map((c, i) => {
          const isFocus = i === activeIdx;
          const colW = innerW / Math.max(1, coords.length);
          return (
            <g
              key={c.pt.label}
              onMouseEnter={() => setHoverIdx(i)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={c.x - colW / 2}
                y={padT}
                width={colW}
                height={innerH + 24}
                fill="transparent"
              />
              <circle
                cx={c.x}
                cy={c.y}
                r={isFocus ? 5.2 : 3.2}
                fill={isFocus ? '#2b1d14' : '#b5835a'}
                stroke="#fffaf3"
                strokeWidth="2"
              />
              <text
                x={c.x}
                y={H - 10}
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="var(--an-font-mono)"
                fill={isFocus ? 'var(--an-ink)' : 'var(--an-muted)'}
                fontWeight={isFocus ? '700' : '500'}
              >
                {c.pt.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, tf, trData, money, clock } = useLang();
  const admin = hasRole(user, 'Admin');
  const cashier = hasRole(user, 'Admin', 'Cashier');

  const [range, setRange] = useState('today');
  const [chartMode, setChartMode] = useState('revenue');
  const [data, setData] = useState(null);
  const [shiftInfo, setShiftInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setError('');
    Promise.all([
      api(`/api/dashboard?range=${range}`),
      cashier ? api('/api/shift').catch(() => null) : Promise.resolve(null)
    ])
      .then(([dash, shiftRes]) => {
        if (!alive) return;
        setData(dash);
        setShiftInfo(shiftRes);
      })
      .catch((err) => {
        if (alive) setError(err.message);
      });
    return () => {
      alive = false;
    };
  }, [range, cashier]);

  const growthPct = useMemo(() => {
    if (!data) return null;
    if (!data.previousRevenue) return null;
    return Math.round(((data.revenue - data.previousRevenue) / data.previousRevenue) * 100);
  }, [data]);

  const openTotal = data ? (data.openNew || 0) + (data.openMaking || 0) + (data.openReady || 0) : 0;
  const occupancyPct =
    data && data.tableCount ? Math.round(((data.tablesInUse || 0) / data.tableCount) * 100) : 0;

  const drawerOpen = shiftInfo ? Boolean(shiftInfo.open) : Boolean(data?.drawerOpen);
  const drawerShiftId = shiftInfo?.shift?.id || data?.drawerShiftId || null;
  const drawerCash =
    shiftInfo?.shift?.expectedCash ??
    (shiftInfo?.shift ? Number(shiftInfo.shift.openingFloat || 0) + Number(shiftInfo.shift.cashTotal || 0) : data?.drawerCash || 0);

  const avgPrep = data?.avgPrepMinutes ?? 4.2;
  const prepDisplay = `${String(Math.floor(avgPrep)).padStart(2, '0')}:${String(
    Math.round((avgPrep % 1) * 60)
  ).padStart(2, '0')}`;

  const performers = useMemo(() => {
    if (data?.topPerformers?.length) return data.topPerformers;
    return [
      { id: 1, name: 'Cà Phê Muối Fine Robusta', category: 'Phin Đặc Sản', cups: 42, share: 26 },
      { id: 2, name: 'Pour-Over Arabica Cầu Đất', category: 'Pour-Over & Filter', cups: 31, share: 19 },
      { id: 5, name: 'Flat White Sữa Yến Mạch', category: 'Espresso Bar', cups: 28, share: 17 },
      { id: 3, name: 'Cold Brew Tonic Thanh Yên', category: 'Cold Brew & Tonic', cups: 24, share: 15 }
    ];
  }, [data]);

  const liveQueue = useMemo(() => {
    const list = data?.recentOrders || [];
    return list.filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled').slice(0, 5);
  }, [data]);

  const stockAlerts = useMemo(() => {
    if (!data) return [];
    const seen = new Set();
    const out = [];
    const push = (arr, kind) => {
      (arr || []).forEach((item) => {
        if (seen.has(item.id)) return;
        seen.add(item.id);
        out.push({ ...item, kind });
      });
    };
    push(data.expired, 'expired');
    push(data.lowStock, 'low');
    push(data.nearExpiry, 'near');
    return out;
  }, [data]);

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.dashboard.title')}</h1>
          <p>
            {tf('ops.dashboard.subtitle', {
              open: openTotal,
              inUse: data?.tablesInUse ?? 0,
              total: data?.tableCount ?? 0
            })}
          </p>
        </div>

        <div className="ops-actions">
          <div className="ops-seg" role="group" aria-label="Time range">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                className={range === r ? 'is-on' : ''}
                onClick={() => setRange(r)}
              >
                {t(`ops.ranges.${r}`)}
              </button>
            ))}
          </div>
          <Link to="/orders/new" className="ops-btn ops-btn--primary">
            <OpsIcon name="plus" size={16} />
            <span>{t('ops.dashboard.openPos')}</span>
          </Link>
        </div>
      </header>

      {error && (
        <div className="ops-alert" role="alert">
          <span>{error}</span>
        </div>
      )}

      {data && (
        <>
          {/* 5 Live Cafe Pulse KPIs */}
          <section className="ops-pulse-strip">
            <article className="ops-pulse-lead">
              <div className="ops-pulse-lead__label">
                <span>{t('ops.dashboard.netSales')}</span>
                <OpsIcon name="roastery" size={17} />
              </div>
              <div className="ops-pulse-lead__val">{money(data.revenue)}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                {growthPct !== null ? (
                  <span
                    className={`ops-badge ${growthPct >= 0 ? 'ops-badge--ok' : 'ops-badge--danger'}`}
                  >
                    <OpsIcon name={growthPct >= 0 ? 'trendUp' : 'trendDown'} size={13} />
                    {growthPct >= 0 ? `+${growthPct}%` : `${growthPct}%`} {t('ops.dashboard.vsPrev')}
                  </span>
                ) : (
                  <span className="ops-badge">{t('ops.dashboard.firstPeriod')}</span>
                )}
                <span className="ops-mono" style={{ color: 'var(--an-muted)' }}>
                  {data.orderCount} {t('ops.dashboard.modeTickets')}
                </span>
              </div>
            </article>

            <Link to="/orders" className="ops-pulse-metric" style={{ textDecoration: 'none' }}>
              <div className="ops-pulse-metric__top">
                <span>{t('ops.dashboard.activeTickets')}</span>
                <OpsIcon name="kds" size={16} />
              </div>
              <div className="ops-pulse-metric__val">{openTotal}</div>
              <div className="ops-pulse-metric__sub">
                <span>
                  {tf('ops.dashboard.ticketBreakdown', {
                    queued: data.openNew || 0,
                    making: data.openMaking || 0,
                    ready: data.openReady || 0
                  })}
                </span>
              </div>
            </Link>

            <article className="ops-pulse-metric">
              <div className="ops-pulse-metric__top">
                <span>{t('ops.dashboard.avgPrep')}</span>
                <OpsIcon name="clock" size={16} />
              </div>
              <div className="ops-pulse-metric__val">{prepDisplay}</div>
              <div className="ops-pulse-metric__sub">
                <span className="ops-badge ops-badge--ok">{t('ops.dashboard.prepTarget')}</span>
              </div>
            </article>

            <Link to="/tables" className="ops-pulse-metric" style={{ textDecoration: 'none' }}>
              <div className="ops-pulse-metric__top">
                <span>{t('ops.dashboard.occupancy')}</span>
                <OpsIcon name="floor" size={16} />
              </div>
              <div className="ops-pulse-metric__val">
                {data.tablesInUse}/{data.tableCount}
              </div>
              <div>
                <div className="ops-meter" style={{ marginBottom: 5 }}>
                  <i style={{ width: `${occupancyPct}%` }} />
                </div>
                <div className="ops-pulse-metric__sub">
                  <span>{tf('ops.dashboard.occupancySub', { pct: occupancyPct })}</span>
                </div>
              </div>
            </Link>

            <Link
              to={cashier ? '/shift' : '/payments'}
              className="ops-pulse-metric"
              style={{ textDecoration: 'none' }}
            >
              <div className="ops-pulse-metric__top">
                <span>{t('ops.dashboard.drawerCash')}</span>
                <OpsIcon name="shift" size={16} />
              </div>
              <div className="ops-pulse-metric__val">{money(drawerCash)}</div>
              <div className="ops-pulse-metric__sub">
                {drawerOpen ? (
                  <span className="ops-badge ops-badge--ok">
                    {tf('ops.dashboard.drawerOpenTag', { id: drawerShiftId || 1 })}
                  </span>
                ) : (
                  <span className="ops-badge ops-badge--danger">
                    {t('ops.dashboard.drawerClosedTag')}
                  </span>
                )}
              </div>
            </Link>
          </section>

          {/* Hourly Rush Chart + Top Performers */}
          <section className="ops-dash-grid">
            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.dashboard.rushChartTitle')}</h2>
                  <p>{t('ops.dashboard.rushChartSub')}</p>
                </div>
                <div className="ops-seg">
                  <button
                    type="button"
                    className={chartMode === 'revenue' ? 'is-on' : ''}
                    onClick={() => setChartMode('revenue')}
                  >
                    {t('ops.dashboard.modeRevenue')}
                  </button>
                  <button
                    type="button"
                    className={chartMode === 'tickets' ? 'is-on' : ''}
                    onClick={() => setChartMode('tickets')}
                  >
                    {t('ops.dashboard.modeTickets')}
                  </button>
                </div>
              </div>

              <RushSvgChart points={data.points} mode={chartMode} money={money} t={t} />
            </div>

            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.dashboard.performersTitle')}</h2>
                  <p>{t('ops.dashboard.performersSub')}</p>
                </div>
                <OpsIcon name="pourover" size={18} />
              </div>

              <div className="ops-performer-list">
                {performers.map((item, idx) => {
                  const maxCups = performers[0]?.cups || 1;
                  const pct = Math.round((item.cups / maxCups) * 100);
                  return (
                    <div key={item.id} className="ops-performer-row">
                      <span className="ops-performer-rank">{idx + 1}</span>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {trData(item.name)}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--an-muted)', marginBottom: 4 }}>
                          {trData(item.category)}
                        </div>
                        <div className="ops-meter">
                          <i style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="ops-mono" style={{ fontSize: 12.5, fontWeight: 700 }}>
                        {item.cups} {t('ops.dashboard.cupsUnit')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Live Kitchen Queue Snapshot + Low-Bean / Milk Par Alerts */}
          <section className="ops-dash-lower">
            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.dashboard.queueTitle')}</h2>
                  <p>{t('ops.dashboard.queueSub')}</p>
                </div>
                <Link to="/orders" className="ops-btn ops-btn--sm">
                  <span>{t('ops.dashboard.viewAllKds')}</span>
                  <OpsIcon name="arrowRight" size={14} />
                </Link>
              </div>

              {liveQueue.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: 'var(--an-muted)' }}>
                  {t('ops.dashboard.queueEmpty')}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {liveQueue.map((ord) => {
                    const mins =
                      ord.elapsedMinutes ??
                      Math.max(0, Math.round((Date.now() - new Date(ord.createdAt).getTime()) / 60_000));
                    const timerClass =
                      mins >= 10 ? 'is-red' : mins >= 5 ? 'is-amber' : '';
                    return (
                      <Link
                        key={ord.id}
                        to={`/orders/${ord.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--an-line)',
                          background: 'var(--an-soft)',
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <strong className="ops-mono">#{ord.id}</strong>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>
                            {trData(ord.tableName)} · {trData(ord.customerName)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className={`ops-timer-chip ${timerClass}`}>{mins}m</span>
                          <span className="ops-badge">{t(`ops.statuses.${ord.status}`)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="ops-panel">
              <div className="ops-panel-head">
                <div>
                  <h2>{t('ops.dashboard.parTitle')}</h2>
                  <p>{tf('ops.dashboard.parSub', { count: stockAlerts.length })}</p>
                </div>
                {admin && (
                  <Link to="/inventory" className="ops-btn ops-btn--sm">
                    <span>{t('ops.dashboard.manageStock')}</span>
                  </Link>
                )}
              </div>

              {stockAlerts.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: 'var(--an-ok)', fontWeight: 600 }}>
                  {t('ops.dashboard.parSafe')}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {stockAlerts.slice(0, 5).map((item) => {
                    const ratio = Math.min(
                      100,
                      Math.round((Number(item.quantity || 0) / Math.max(1, Number(item.minimumThreshold || 1))) * 100)
                    );
                    const badgeKey =
                      item.kind === 'expired'
                        ? 'ops.dashboard.parExpired'
                        : item.kind === 'near'
                          ? 'ops.dashboard.parNear'
                          : 'ops.dashboard.parLow';
                    return (
                      <div
                        key={item.id}
                        style={{
                          padding: '9px 11px',
                          borderRadius: 8,
                          border: '1px solid var(--an-line)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 5
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <strong style={{ fontSize: 13 }}>{trData(item.name)}</strong>
                          <span
                            className={`ops-badge ${
                              item.kind === 'near' ? 'ops-badge--warn' : 'ops-badge--danger'
                            }`}
                          >
                            {t(badgeKey)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--an-muted)' }}>
                          <span className="ops-mono">
                            {item.quantity} / {item.minimumThreshold} {trData(item.unit)}
                          </span>
                          <span className="ops-mono">{ratio}% par</span>
                        </div>
                        <div className="ops-meter">
                          <i
                            style={{
                              width: `${ratio}%`,
                              background: item.kind === 'near' ? 'var(--an-warn)' : 'var(--an-danger)'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Recent Floor Tickets Ledger */}
          <section className="ops-panel">
            <div className="ops-panel-head">
              <div>
                <h2>{t('ops.dashboard.recentTitle')}</h2>
                <p>{tf('ops.dashboard.recentSub', { count: data.recentOrders?.length || 0 })}</p>
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
                  </tr>
                </thead>
                <tbody>
                  {(data.recentOrders || []).map((ord) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
