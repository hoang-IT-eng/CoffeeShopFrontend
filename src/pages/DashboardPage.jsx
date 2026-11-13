import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, vnd } from '../api';

const ranges = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: '7 ngày' },
  { id: 'month', label: '30 ngày' },
  { id: 'year', label: 'Năm' }
];

function money(value) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function statusLabel(status) {
  return { New: 'Mới', Processing: 'Đang pha', Ready: 'Xong món', Completed: 'Đã thu', Cancelled: 'Huỷ' }[status] || status;
}

function clock(value) {
  if (!value) return '';
  return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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
    return <div className="board"><p className="board-loading">Đang tải số liệu.</p></div>;
  }
  if (!data) {
    return <div className="board"><p className="board-banner">{error}</p></div>;
  }

  const points = data.points || [];
  const barPoints = points.slice(-16);
  const maxPoint = Math.max(1, ...barPoints.map((point) => Number(point.revenue) || 0));
  const showHeroBars = barPoints.some((point) => Number(point.revenue) > 0);
  const week = data.week || [];
  const weekMax = Math.max(1, ...week.map((day) => Number(day.revenue) || 0));
  const showWeek = week.some((day) => Number(day.revenue) > 0);
  const openCount = (Number(data.openNew) || 0) + (Number(data.openMaking) || 0) + (Number(data.openReady) || 0);
  const tableCount = Number(data.tableCount) || (data.tables || []).length;
  const inUse = Number(data.tablesInUse) || 0;
  const occupancy = tableCount ? Math.round((inUse / tableCount) * 100) : 0;
  const previous = Number(data.previousRevenue) || 0;
  const revenue = Number(data.revenue) || 0;
  const delta = previous === 0
    ? (revenue === 0 ? 'Bằng kỳ trước' : 'Kỳ trước chưa có doanh thu')
    : `${revenue >= previous ? '+' : ''}${Math.round(((revenue - previous) / previous) * 100)}% so với kỳ trước`;
  const rows = orders.length ? orders : (data.recentOrders || []);
  const warnings = [
    ...(data.expired || []).map((item) => ({ ...item, tone: 'Hết hạn' })),
    ...(data.lowStock || []).map((item) => ({ ...item, tone: 'Dưới ngưỡng' })),
    ...(data.nearExpiry || []).map((item) => ({ ...item, tone: 'Sắp hết hạn' }))
  ].filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index).slice(0, 5);

  return (
    <div className="board">
      <header className="board-head">
        <div>
          <h1>Tổng quan</h1>
          <p>{openCount} đơn đang mở · {inUse}/{tableCount || 0} bàn có khách</p>
        </div>
        <div className="board-tools">
          <div className="board-range" role="group" aria-label="Khoảng thời gian">
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
          <Link className="board-sell" to="/orders/new">Bán hàng</Link>
        </div>
      </header>
      {error && <p className="board-banner">{error}</p>}

      <section className="board-strip" aria-label="Số liệu chính">
        <article className="board-revenue">
          <h2>Doanh thu</h2>
          <strong>{money(revenue)}<span>đ</span></strong>
          <em>{delta}</em>
          {showHeroBars && (
            <div className="board-sparkline" aria-hidden="true">
              {barPoints.map((point) => (
                <i key={point.label} style={{ height: `${Math.round(((Number(point.revenue) || 0) / maxPoint) * 100)}%` }} />
              ))}
            </div>
          )}
        </article>
        <article className="board-metric">
          <p>Đơn đang mở</p>
          <strong>{openCount}</strong>
          <p className="board-note">{data.openNew || 0} mới · {data.openMaking || 0} pha · {data.openReady || 0} chờ</p>
        </article>
        <article className="board-metric">
          <p>Bàn có khách</p>
          <strong>{inUse}<span>/{tableCount || 0}</span></strong>
          <p className="board-note">{occupancy}% sàn đang dùng</p>
        </article>
        <article className="board-metric">
          <p>Cảnh báo kho</p>
          <strong>{data.totalWarnings || 0}</strong>
          <p className="board-note">{warnings[0]?.name || 'Kho ổn'}</p>
        </article>
      </section>

      <section className="board-mid">
        <article className="board-card">
          <div className="board-card-head">
            <div>
              <h2>Đơn gần đây</h2>
              <p>{rows.length} đơn</p>
            </div>
            <Link to="/orders">Mở danh sách</Link>
          </div>
          <div className="board-table-wrap">
            <table className="board-table">
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
                    <td><Link to={`/orders/${order.id}`}>#{order.id}</Link></td>
                    <td>{order.customerName || 'Khách'}</td>
                    <td>{vnd(order.total)}</td>
                    <td>{clock(order.createdAt)}</td>
                    <td><span className={`board-status is-${(order.status || '').toLowerCase()}`}>{statusLabel(order.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && <p className="board-note">Chưa có đơn trong kỳ này.</p>}
          </div>
        </article>

        <article className="board-card">
          <div className="board-card-head">
            <div>
              <h2>Kho cần chú ý</h2>
              <p>{data.totalWarnings || 0} mục</p>
            </div>
            <Link to="/inventory">Nhập kho</Link>
          </div>
          <div className="board-mix">
            {warnings.map((item) => {
              const qty = Number(item.quantity) || 0;
              const min = Number(item.minimumThreshold) || 0;
              const width = item.tone === 'Hết hạn' || min <= 0 ? 100 : Math.min(100, Math.round((qty / min) * 100));
              return (
                <div key={`${item.tone}-${item.id}`}>
                  <span>{item.name}</span>
                  <div className="board-line"><i style={{ width: `${width}%` }} /></div>
                  <b>{item.tone}</b>
                </div>
              );
            })}
            {!warnings.length && <p className="board-note">Kho đang trên ngưỡng.</p>}
          </div>
        </article>
      </section>

      <section className="board-bot">
        <article className="board-card">
          <div className="board-card-head">
            <div>
              <h2>Doanh thu theo ngày</h2>
              <p>Bảy ngày gần nhất</p>
            </div>
            <strong>{vnd(week.reduce((sum, day) => sum + Number(day.revenue || 0), 0))}</strong>
          </div>
          {showWeek ? (
            <div className="board-bars" aria-hidden="true">
              {week.map((day) => (
                <span key={day.label} className={day.isToday ? 'is-today' : ''} style={{ height: `${Math.round((Number(day.revenue || 0) / weekMax) * 100)}%` }} />
              ))}
            </div>
          ) : (
            <p className="board-note">Chưa có doanh thu trong 7 ngày.</p>
          )}
        </article>

        <article className="board-card">
          <div className="board-card-head">
            <div>
              <h2>Sàn quán</h2>
              <p>{inUse} bàn đang có khách</p>
            </div>
            <Link to="/tables">Sơ đồ</Link>
          </div>
          <div className="board-floor-list">
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
            {!(data.tables || []).length && <p className="board-note">Chưa có bàn.</p>}
          </div>
        </article>

        <article className="board-card">
          <div className="board-card-head">
            <div>
              <h2>Trong ca</h2>
              <p>Nhịp bếp hiện tại</p>
            </div>
          </div>
          <ul className="board-shift-list">
            <li><span>Đơn mới</span><b>{data.openNew || 0}</b></li>
            <li><span>Đang pha</span><b>{data.openMaking || 0}</b></li>
            <li><span>Chờ trả</span><b>{data.openReady || 0}</b></li>
            <li><span>Đơn / giờ</span><b>{Number(data.ordersPerHour || 0).toLocaleString('vi-VN')}</b></li>
          </ul>
        </article>
      </section>
    </div>
  );
}
