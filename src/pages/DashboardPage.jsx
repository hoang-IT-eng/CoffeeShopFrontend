import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, vnd } from '../api';
import '../styles/dashboard.css';

const ranges = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: '7 ngày' },
  { id: 'month', label: '30 ngày' },
  { id: 'year', label: 'Năm' }
];

const STATUS_META = [
  { id: 'New', label: 'Mới', color: 'var(--an-caramel)' },
  { id: 'Processing', label: 'Đang pha', color: '#9a6b3a' },
  { id: 'Ready', label: 'Xong món', color: 'var(--an-ok)' },
  { id: 'Completed', label: 'Đã thu', color: 'var(--an-brown)' },
  { id: 'Cancelled', label: 'Huỷ', color: 'var(--an-danger)' }
];

function money(value) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function statusLabel(status) {
  return STATUS_META.find((item) => item.id === status)?.label || status;
}

function clock(value) {
  if (!value) return '';
  return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

/** Đường cong mượt (Catmull-Rom → Bézier) cho biểu đồ SVG. */
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}

function SparkArea({ values, width = 96, height = 34 }) {
  const max = Math.max(1, ...values);
  const pts = values.map((value, i) => ({
    x: values.length > 1 ? (i / (values.length - 1)) * width : width / 2,
    y: height - 3 - (value / max) * (height - 8)
  }));
  const line = smoothPath(pts);
  return (
    <svg className="dash-spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={`${line} L ${width},${height} L 0,${height} Z`} fill="var(--an-caramel)" opacity="0.18" />
      <path d={line} fill="none" stroke="var(--an-caramel)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SparkBars({ values, width = 96, height = 34 }) {
  const max = Math.max(1, ...values);
  const slot = width / Math.max(1, values.length);
  return (
    <svg className="dash-spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {values.map((value, i) => {
        const h = Math.max(2, (value / max) * (height - 4));
        return (
          <rect
            key={i}
            x={i * slot + slot * 0.22}
            y={height - h}
            width={slot * 0.56}
            height={h}
            rx="1.5"
            fill="var(--an-caramel)"
            opacity={i === values.length - 1 ? 1 : 0.45}
          />
        );
      })}
    </svg>
  );
}

function RevenueChart({ series }) {
  const W = 720;
  const H = 240;
  const PAD = { top: 14, right: 10, bottom: 8, left: 10 };
  const values = series.map((point) => Number(point.revenue) || 0);
  const max = Math.max(1, ...values);
  const pts = series.map((point, i) => ({
    x: PAD.left + (series.length > 1 ? (i / (series.length - 1)) * (W - PAD.left - PAD.right) : (W - PAD.left - PAD.right) / 2),
    y: PAD.top + (1 - (Number(point.revenue) || 0) / max) * (H - PAD.top - PAD.bottom)
  }));
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1]?.x || 0},${H - 2} L ${pts[0]?.x || 0},${H - 2} Z`;
  const gridYs = [0.25, 0.5, 0.75, 1].map((f) => PAD.top + (1 - f) * (H - PAD.top - PAD.bottom));
  return (
    <div>
      <svg className="dash-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Biểu đồ doanh thu">
        <defs>
          <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b5835a" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#b5835a" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {gridYs.map((y) => (
          <line key={y} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="var(--an-line)" strokeWidth="1" strokeDasharray="3 5" />
        ))}
        <path d={area} fill="url(#dashFill)" />
        <path d={line} fill="none" stroke="#9a6b3a" strokeWidth="2.6" strokeLinecap="round" />
        {pts.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="3.4" fill="var(--ember-card)" stroke="#9a6b3a" strokeWidth="2" />
        ))}
      </svg>
      <div className="dash-chart__axis" aria-hidden="true">
        <span>{series[0]?.label || ''}</span>
        <span>{series[Math.floor(series.length / 2)]?.label || ''}</span>
        <span>{series[series.length - 1]?.label || ''}</span>
      </div>
    </div>
  );
}

function StatusDonut({ rows }) {
  const counts = useMemo(() => {
    const map = new Map(STATUS_META.map((item) => [item.id, 0]));
    rows.forEach((order) => {
      if (map.has(order.status)) map.set(order.status, map.get(order.status) + 1);
    });
    return STATUS_META.map((item) => ({ ...item, count: map.get(item.id) || 0 })).filter((item) => item.count > 0);
  }, [rows]);
  const total = counts.reduce((sum, item) => sum + item.count, 0);
  const R = 62;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="dash-donut-wrap">
      <div className="dash-donut">
        <svg width="168" height="168" viewBox="0 0 168 168" role="img" aria-label="Cơ cấu trạng thái đơn hàng">
          <circle cx="84" cy="84" r={R} fill="none" stroke="var(--ember-track)" strokeWidth="17" />
          {total > 0 &&
            counts.map((item) => {
              const frac = item.count / total;
              const dash = frac * C;
              const el = (
                <circle
                  key={item.id}
                  cx="84"
                  cy="84"
                  r={R}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="17"
                  strokeDasharray={`${Math.max(0, dash - 2.5)} ${C - dash + 2.5}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 84 84)"
                  strokeLinecap="butt"
                />
              );
              offset += dash;
              return el;
            })}
        </svg>
        <div className="dash-donut__center">
          <strong>{total}</strong>
          <span>đơn gần đây</span>
        </div>
      </div>
      <ul className="dash-legend">
        {counts.map((item) => (
          <li key={item.id}>
            <i style={{ background: item.color }} aria-hidden="true" />
            {item.label}
            <span>{total ? Math.round((item.count / total) * 100) : 0}%</span>
            <b>{item.count}</b>
          </li>
        ))}
        {!counts.length && <li><span>Chưa có đơn để thống kê.</span></li>}
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('range');
  const range = ranges.some((item) => item.id === requested) ? requested : 'today';
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setError('');
    Promise.all([
      api(`/api/dashboard?range=${range}`),
      api('/api/orders').catch(() => [])
    ])
      .then(([payload, rows]) => {
        if (!alive) return;
        setData(payload);
        setOrders(rows || []);
      })
      .catch((err) => {
        if (alive) setError(err.message);
      });
    return () => {
      alive = false;
    };
  }, [range]);

  if (!data && !error) {
    return (
      <div className="dash">
        <p className="dash-loading">Đang tải số liệu…</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="dash">
        <p className="dash-banner">{error}</p>
      </div>
    );
  }

  const revenue = Number(data.revenue) || 0;
  const previous = Number(data.previousRevenue) || 0;
  const deltaPct = previous > 0 ? Math.round(((revenue - previous) / previous) * 100) : null;
  const openCount = (Number(data.openNew) || 0) + (Number(data.openMaking) || 0) + (Number(data.openReady) || 0);
  const tableCount = Number(data.tableCount) || (data.tables || []).length;
  const inUse = Number(data.tablesInUse) || 0;
  const occupancy = tableCount ? Math.round((inUse / tableCount) * 100) : 0;
  const orderTotal = Number(data.orderCount) || orders.length;
  const rows = orders.length ? orders : data.recentOrders || [];
  const points = data.points || [];
  const week = data.week || [];
  const chartSeries = points.length >= 2 ? points : week;
  const chartTotal = chartSeries.reduce((sum, point) => sum + (Number(point.revenue) || 0), 0);
  const sparkValues = (points.length ? points : week).map((point) => Number(point.revenue) || 0);
  const warnings = [
    ...(data.expired || []).map((item) => ({ ...item, tone: 'Hết hạn' })),
    ...(data.lowStock || []).map((item) => ({ ...item, tone: 'Dưới ngưỡng' })),
    ...(data.nearExpiry || []).map((item) => ({ ...item, tone: 'Sắp hết hạn' }))
  ]
    .filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index)
    .slice(0, 5);
  const rangeLabel = ranges.find((item) => item.id === range)?.label || '';

  return (
    <div className="dash">
      <header className="dash-top">
        <div>
          <h1>Tổng quan</h1>
          <p>
            {rangeLabel} · {openCount} đơn đang mở · {inUse}/{tableCount || 0} bàn có khách
          </p>
        </div>
        <div className="dash-tools">
          <div className="dash-range" role="group" aria-label="Khoảng thời gian">
            {ranges.map((item) => (
              <button
                key={item.id}
                type="button"
                className={range === item.id ? 'is-on' : ''}
                onClick={() => setParams(item.id === 'today' ? {} : { range: item.id }, { replace: true })}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Link className="dash-sell" to="/orders/new">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
              point_of_sale
            </span>
            Bán hàng
          </Link>
        </div>
      </header>

      {error && <p className="dash-banner">{error}</p>}

      <section className="dash-kpis" aria-label="Số liệu chính">
        <article className="dash-kpi">
          <div className="dash-kpi__head">
            <p className="dash-kpi__label">Doanh thu</p>
            <span className="dash-kpi__icon" aria-hidden="true">
              <span className="material-symbols-outlined">payments</span>
            </span>
          </div>
          <p className="dash-kpi__value">
            {money(revenue)}
            <small>đ</small>
          </p>
          <div className="dash-kpi__foot">
            {deltaPct !== null ? (
              <span className={`dash-chip${deltaPct < 0 ? ' is-down' : ''}`}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {deltaPct < 0 ? 'trending_down' : 'trending_up'}
                </span>
                {deltaPct > 0 ? '+' : ''}
                {deltaPct}%
              </span>
            ) : (
              <span className="dash-chip">{revenue > 0 ? 'Kỳ đầu' : '—'}</span>
            )}
            <p className="dash-kpi__note">so với kỳ trước</p>
            {sparkValues.length > 1 && <SparkArea values={sparkValues} />}
          </div>
        </article>

        <article className="dash-kpi">
          <div className="dash-kpi__head">
            <p className="dash-kpi__label">Tổng đơn</p>
            <span className="dash-kpi__icon" aria-hidden="true">
              <span className="material-symbols-outlined">receipt_long</span>
            </span>
          </div>
          <p className="dash-kpi__value">{orderTotal}</p>
          <div className="dash-kpi__foot">
            <p className="dash-kpi__note">
              {openCount} đang mở · {Number(data.ordersPerHour || 0).toLocaleString('vi-VN')} đơn/giờ
            </p>
            {week.length > 1 && <SparkBars values={week.map((day) => Number(day.revenue) || 0)} />}
          </div>
        </article>

        <article className="dash-kpi">
          <div className="dash-kpi__head">
            <p className="dash-kpi__label">Bàn có khách</p>
            <span className="dash-kpi__icon" aria-hidden="true">
              <span className="material-symbols-outlined">table_restaurant</span>
            </span>
          </div>
          <p className="dash-kpi__value">
            {inUse}
            <small>/ {tableCount || 0}</small>
          </p>
          <div className="dash-progress" aria-hidden="true">
            <i style={{ width: `${occupancy}%` }} />
          </div>
          <div className="dash-kpi__foot">
            <p className="dash-kpi__note">{occupancy}% sàn đang dùng</p>
          </div>
        </article>

        <article className="dash-kpi">
          <div className="dash-kpi__head">
            <p className="dash-kpi__label">Cảnh báo kho</p>
            <span className="dash-kpi__icon" aria-hidden="true">
              <span className="material-symbols-outlined">inventory_2</span>
            </span>
          </div>
          <p className="dash-kpi__value">{data.totalWarnings || 0}</p>
          <div className="dash-kpi__foot">
            <p className="dash-kpi__note">{warnings[0]?.name || 'Kho đang ổn định'}</p>
          </div>
        </article>
      </section>

      <section className="dash-main">
        <article className="dash-card">
          <div className="dash-card__head">
            <div>
              <h2>Doanh thu</h2>
              <p>{range === 'today' ? 'Theo giờ trong ngày' : `Biểu đồ kỳ ${rangeLabel.toLowerCase()}`}</p>
            </div>
            <span className="dash-card__total">{vnd(chartTotal)}</span>
          </div>
          {chartSeries.length >= 2 ? (
            <RevenueChart series={chartSeries} />
          ) : (
            <p className="dash-empty">Chưa có dữ liệu doanh thu trong kỳ này.</p>
          )}
        </article>

        <article className="dash-card">
          <div className="dash-card__head">
            <div>
              <h2>Cơ cấu đơn hàng</h2>
              <p>Phân bổ theo trạng thái</p>
            </div>
            <Link to="/orders">Chi tiết</Link>
          </div>
          <StatusDonut rows={rows} />
        </article>
      </section>

      <section className="dash-bottom">
        <article className="dash-card">
          <div className="dash-card__head">
            <div>
              <h2>Đơn gần đây</h2>
              <p>{rows.length} đơn mới nhất</p>
            </div>
            <Link to="/orders">Mở danh sách</Link>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Bàn</th>
                  <th>Đơn</th>
                  <th>Khách</th>
                  <th>Tiền</th>
                  <th>Giờ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 8).map((order) => (
                  <tr key={order.id}>
                    <td>{order.tableName || 'Mang đi'}</td>
                    <td>
                      <Link to={`/orders/${order.id}`}>#{order.id}</Link>
                    </td>
                    <td>{order.customerName || 'Khách'}</td>
                    <td>{vnd(order.total)}</td>
                    <td>{clock(order.createdAt)}</td>
                    <td>
                      <span className={`dash-status is-${(order.status || '').toLowerCase()}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && <p className="dash-empty">Chưa có đơn trong kỳ này.</p>}
          </div>
        </article>

        <div className="dash-side">
          <article className="dash-card">
            <div className="dash-card__head">
              <div>
                <h2>Kho cần chú ý</h2>
                <p>{data.totalWarnings || 0} mục dưới ngưỡng</p>
              </div>
              <Link to="/inventory">Nhập kho</Link>
            </div>
            <div className="dash-stock">
              {warnings.map((item) => {
                const qty = Number(item.quantity) || 0;
                const min = Number(item.minimumThreshold) || 0;
                const width = item.tone === 'Hết hạn' || min <= 0 ? 100 : Math.min(100, Math.round((qty / min) * 100));
                return (
                  <div className="dash-stock__row" key={`${item.tone}-${item.id}`}>
                    <span>{item.name}</span>
                    <b>{item.tone}</b>
                    <div className="dash-stock__bar" aria-hidden="true">
                      <i style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
              {!warnings.length && <p className="dash-empty">Kho đang trên ngưỡng an toàn.</p>}
            </div>
          </article>

          <article className="dash-card">
            <div className="dash-card__head">
              <div>
                <h2>Trong ca</h2>
                <p>Nhịp bếp hiện tại</p>
              </div>
              <Link to="/tables">Sơ đồ</Link>
            </div>
            <ul className="dash-shift">
              <li>
                <span>Đơn mới</span>
                <b>{data.openNew || 0}</b>
              </li>
              <li>
                <span>Đang pha</span>
                <b>{data.openMaking || 0}</b>
              </li>
              <li>
                <span>Chờ trả món</span>
                <b>{data.openReady || 0}</b>
              </li>
              <li>
                <span>Đơn / giờ</span>
                <b>{Number(data.ordersPerHour || 0).toLocaleString('vi-VN')}</b>
              </li>
            </ul>
            <div className="dash-tables">
              {(data.tables || []).map((table) => (
                <Link
                  key={table.id}
                  to="/tables"
                  className={table.status === 'Occupied' || table.status === 'Reserved' ? 'is-on' : ''}
                  title={table.name}
                >
                  <i aria-hidden="true" />
                  {table.name}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
