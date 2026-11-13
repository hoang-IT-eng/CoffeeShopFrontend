import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, vnd } from '../api';

const ranges = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: '7 ngày' },
  { id: 'month', label: '30 ngày' },
  { id: 'year', label: 'Năm' }
];

const filters = [
  { id: 'all', label: 'Tất cả' },
  { id: 'New', label: 'Mới' },
  { id: 'Processing', label: 'Đang pha' },
  { id: 'Ready', label: 'Xong món' },
  { id: 'Completed', label: 'Đã thu' }
];

const steps = ['Nhận', 'Pha', 'Xong', 'Thu'];

function statusLabel(status) {
  return {
    New: 'Mới',
    Processing: 'Đang pha',
    Ready: 'Xong món',
    Completed: 'Đã thu',
    PendingMobilePayment: 'Chờ trả',
    Cancelled: 'Huỷ'
  }[status] || status;
}

function money(value) {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function clock(value) {
  if (!value) return '';
  return new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function stepCount(status) {
  if (status === 'Completed') return 4;
  if (status === 'Ready' || status === 'PendingMobilePayment') return 3;
  if (status === 'Processing') return 2;
  if (status === 'New') return 1;
  return 0;
}

function initials(name) {
  const parts = (name || 'K').trim().split(/\s+/);
  return ((parts[0]?.[0] || 'K') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [dash, setDash] = useState(null);
  const [range, setRange] = useState('today');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    return api('/api/orders').then((rows) => {
      setOrders(rows || []);
      setSelectedId((current) => current || rows?.[0]?.id || null);
    });
  }

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      loadOrders(),
      api(`/api/dashboard?range=${range}`).then((payload) => {
        if (alive) setDash(payload);
      })
    ])
      .catch((err) => {
        if (alive) setError(err.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [range]);

  async function updateStatus(id, status) {
    setError('');
    try {
      const result = await api(`/api/orders/${id}/status`, { method: 'POST', body: { status } });
      setMessage(result.message || 'Đã cập nhật đơn.');
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  const visible = useMemo(
    () => orders.filter((order) => filter === 'all' || order.status === filter),
    [orders, filter]
  );
  const selected = visible.find((order) => order.id === selectedId) || visible[0] || null;
  const openCount = orders.filter((order) => order.status !== 'Completed' && order.status !== 'Cancelled').length;
  const doneCount = orders.filter((order) => order.status === 'Completed').length;
  const doneRatio = orders.length ? Math.round((doneCount / orders.length) * 100) : 0;
  const average = orders.length
    ? orders.reduce((sum, order) => sum + Number(order.total || 0), 0) / orders.length
    : 0;
  const week = dash?.week || [];
  const weekMax = Math.max(1, ...week.map((day) => Number(day.revenue) || 0));
  const showWeek = week.some((day) => Number(day.revenue) > 0);

  const itemTotals = new Map();
  orders.forEach((order) => {
    (order.details || []).forEach((detail) => {
      const name = detail.name || 'Món';
      const current = itemTotals.get(name) || 0;
      itemTotals.set(name, current + Number(detail.quantity || 0));
    });
  });
  const topItems = [...itemTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const itemMax = Math.max(1, ...topItems.map((item) => item[1]));
  const itemSum = Math.max(1, [...itemTotals.values()].reduce((a, b) => a + b, 0));

  const tableTotals = new Map();
  orders.forEach((order) => {
    const name = order.tableName || 'Mang đi';
    tableTotals.set(name, (tableTotals.get(name) || 0) + Number(order.total || 0));
  });
  const topTables = [...tableTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const tableMax = Math.max(1, ...topTables.map((item) => item[1]));

  const revenue = Number(dash?.revenue || 0);
  const previous = Number(dash?.previousRevenue || 0);
  const delta = previous === 0
    ? (revenue === 0 ? 'Bằng kỳ trước' : 'Kỳ trước chưa có doanh thu')
    : `${revenue >= previous ? '+' : ''}${Math.round(((revenue - previous) / previous) * 100)}% so với kỳ trước`;

  const shots = (selected?.details || []).slice(0, 2);
  const sparkPoints = (dash?.points || week).slice(-12);
  const sparkMax = Math.max(1, ...sparkPoints.map((point) => Number(point.revenue) || 0));
  const showSpark = sparkPoints.some((point) => Number(point.revenue) > 0);

  return (
    <div className="board">
      <header className="board-head">
        <div>
          <h1>Bếp và đơn</h1>
          <p>{openCount} đơn đang mở · {doneRatio}% đã thu</p>
        </div>
        <div className="board-tools">
          <div className="board-range" role="group" aria-label="Khoảng doanh thu">
            {ranges.map((item) => (
              <button key={item.id} type="button" className={range === item.id ? 'is-on' : ''} onClick={() => setRange(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <Link className="board-sell" to="/orders/new">Bán hàng</Link>
        </div>
      </header>

      {error && <p className="board-banner">{error}</p>}
      {message && <p className="board-banner" style={{ color: 'var(--an-ok)' }}>{message}</p>}
      {loading && !dash && <p className="board-loading">Đang tải đơn.</p>}

      <section className="board-strip" aria-label="Số liệu đơn">
        <article className="board-revenue">
          <h2>Doanh thu kỳ</h2>
          <strong>{money(revenue)}<span>đ</span></strong>
          <em>{delta}</em>
          {showSpark && (
            <div className="board-sparkline" aria-hidden="true">
              {sparkPoints.map((point) => (
                <i key={point.label} style={{ height: `${Math.round(((Number(point.revenue) || 0) / sparkMax) * 100)}%` }} />
              ))}
            </div>
          )}
        </article>
        <article className="board-metric">
          <p>Đơn đang mở</p>
          <strong>{openCount}</strong>
          <p className="board-note">{orders.length} đơn trong danh sách</p>
        </article>
        <article className="board-metric">
          <p>Trong kỳ</p>
          <strong>{dash?.orderCount ?? orders.length}</strong>
          <p className="board-note">{doneCount} đã thu</p>
        </article>
        <article className="board-metric">
          <p>Trung bình đơn</p>
          <strong>{money(average)}<span>đ</span></strong>
          <p className="board-note">{doneRatio}% hoàn tất</p>
        </article>
      </section>

      <section className="board-mid">
        <article className="board-card">
          <div className="board-card-head">
            <div>
              <h2>Các đơn</h2>
              <p>{visible.length} dòng đang hiện</p>
            </div>
            <div className="board-filters" role="group" aria-label="Lọc trạng thái">
              {filters.map((item) => (
                <button key={item.id} type="button" className={filter === item.id ? 'is-on' : ''} onClick={() => setFilter(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="board-table-wrap">
            <table className="board-table">
              <thead>
                <tr>
                  <th>Bàn</th>
                  <th>Đơn</th>
                  <th>Món</th>
                  <th>Số lượng</th>
                  <th>Tiền</th>
                  <th>Giờ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => {
                  const qty = (order.details || []).reduce((sum, detail) => sum + Number(detail.quantity || 0), 0);
                  const first = order.details?.[0]?.name || order.customerName || 'Khách';
                  return (
                    <tr
                      key={order.id}
                      className={selected?.id === order.id ? 'is-on' : ''}
                      onClick={() => setSelectedId(order.id)}
                    >
                      <td>{order.tableName || 'Mang đi'}</td>
                      <td>#{order.id}</td>
                      <td>{first}</td>
                      <td>{qty || '—'}</td>
                      <td>{vnd(order.total)}</td>
                      <td>{clock(order.createdAt)}</td>
                      <td><span className={`board-status is-${(order.status || '').toLowerCase()}`}>{statusLabel(order.status)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!visible.length && <p className="board-note">Chưa có đơn trong bộ lọc này.</p>}
          </div>
        </article>

        <article className="board-card board-detail">
          {selected ? (
            <>
              <div className="board-detail-top">
                <div>
                  <h2>{selected.tableName || 'Mang đi'}</h2>
                  <small>Đơn #{selected.id} · {vnd(selected.total)}</small>
                </div>
                <span className="board-out">{statusLabel(selected.status)}</span>
              </div>
              <div className="board-shots">
                {(shots.length ? shots : [{ name: 'Chưa có món', quantity: 0 }]).map((detail, index) => (
                  <div className="board-shot" key={detail.id || index}>
                    {detail.imageUrl && <img src={detail.imageUrl} alt="" />}
                    <strong>{detail.name || 'Món'}</strong>
                    <span>{detail.quantity ? `${detail.quantity} phần` : 'Chưa ghi món'}{detail.price ? ` · ${vnd(detail.price)}` : ''}</span>
                  </div>
                ))}
              </div>
              <div className="board-track" aria-label="Tiến độ đơn">
                {steps.map((label, index) => (
                  <span key={label} className={index < stepCount(selected.status) ? 'is-on' : ''}>
                    <i />
                    <small>{label}</small>
                  </span>
                ))}
              </div>
              <div className="board-person">
                <b>{initials(selected.customerName)}</b>
                <div>
                  <strong>{selected.customerName || 'Khách'}</strong>
                  <small style={{ display: 'block' }}>
                    {(selected.details || []).reduce((sum, detail) => sum + Number(detail.quantity || 0), 0) || (selected.details || []).length} phần trong đơn
                  </small>
                </div>
              </div>
              <div className="board-actions">
                {selected.status === 'New' && (
                  <button type="button" onClick={() => updateStatus(selected.id, 'Processing')}>Bắt đầu pha</button>
                )}
                {selected.status === 'Processing' && (
                  <button type="button" onClick={() => updateStatus(selected.id, 'Ready')}>Xong món</button>
                )}
                {selected.status === 'Ready' && <Link to={`/payments/${selected.id}`}>Thu tiền</Link>}
                <Link className="is-quiet" to={`/orders/${selected.id}`}>Mở đơn</Link>
              </div>
            </>
          ) : (
            <p className="board-note">Chọn một đơn trong danh sách để xem chi tiết và cập nhật trạng thái.</p>
          )}
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
            <h2>Món được gọi</h2>
          </div>
          <div className="board-mix">
            {topItems.map(([name, qty]) => (
              <div key={name}>
                <span>{name}</span>
                <div className="board-line"><i style={{ width: `${Math.round((qty / itemMax) * 100)}%` }} /></div>
                <b>{Math.round((qty / itemSum) * 100)}%</b>
              </div>
            ))}
            {!topItems.length && <p className="board-note">Chưa có món trong các đơn này.</p>}
          </div>
        </article>

        <article className="board-card">
          <div className="board-card-head">
            <h2>Bàn gọi nhiều</h2>
          </div>
          <div className="board-mix">
            {topTables.map(([name, total]) => (
              <div key={name}>
                <span>{name}</span>
                <div className="board-line"><i style={{ width: `${Math.round((total / tableMax) * 100)}%` }} /></div>
                <b>{money(total)}</b>
              </div>
            ))}
            {!topTables.length && <p className="board-note">Chưa có dữ liệu bàn.</p>}
          </div>
        </article>
      </section>
    </div>
  );
}
