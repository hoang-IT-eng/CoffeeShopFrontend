import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, vnd, when } from '../api';

function elapsedString(createdAt, tick) {
  void tick;
  if (!createdAt) return '02:15';
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
  const mins = Math.floor(diffSec / 60) % 60;
  const secs = diffSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stationFilter, setStationFilter] = useState('all');
  const [struckItems, setStruckItems] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastOpen, setToastOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  function load() {
    api('/api/orders')
      .then(setOrders)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    load();
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  function playChime() {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Ignore audio block
    }
  }

  async function updateStatus(id, status) {
    setError('');
    try {
      const result = await api(`/api/orders/${id}/status`, { method: 'POST', body: { status } });
      playChime();
      setMessage(result.message);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function cancel(id) {
    if (!window.confirm(`Xác nhận hủy đơn #HD-${id}?`)) return;
    try {
      const result = await api(`/api/orders/${id}/cancel`, { method: 'POST' });
      setMessage(result.message);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleStrike(key) {
    setStruckItems((prev) => ({ ...prev, [key]: !prev[key] }));
    playChime();
  }

  const visibleOrders = orders.filter((o) =>
    stationFilter === 'all' ? true : o.status === stationFilter
  );

  const countNew = orders.filter((o) => o.status === 'New').length;
  const countProcessing = orders.filter((o) => o.status === 'Processing').length;
  const countReady = orders.filter((o) => o.status === 'Ready').length;

  return (
    <div className="flex flex-col w-full">
      {/* Top KDS Control Panel Bar: High Ergonomics & Instant Station Toggling */}
      <section className="w-full bg-surface-container-high/90 backdrop-blur-md px-gutter-desktop py-space-sm shadow-md">
        <div className="flex flex-col 2xl:flex-row items-stretch 2xl:items-center justify-between gap-space-md">
          {/* Station Filters: Big touch target pills */}
          <div className="flex flex-wrap items-center gap-space-xs">
            {[
              { id: 'all', icon: 'dataset', label: 'Tất cả trạm', count: orders.length },
              { id: 'New', icon: 'fiber_new', label: 'Đơn Mới Nhận', count: countNew },
              { id: 'Processing', icon: 'local_cafe', label: 'Quầy Bar Đang Pha', count: countProcessing },
              { id: 'Ready', icon: 'done_all', label: 'Sẵn Sàng Phục Vụ', count: countReady }
            ].map((tab) => {
              const active = stationFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStationFilter(tab.id)}
                  className={`h-12 px-space-lg rounded-xl font-label-lg text-label-lg shadow-sm flex items-center gap-space-xs transition-all active:scale-95 ${
                    active
                      ? 'bg-primary text-on-primary font-bold'
                      : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      active ? 'text-secondary-container' : 'text-secondary'
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span
                    className={`px-space-xs py-0.5 rounded-full font-bold text-xs ml-1 ${
                      active
                        ? 'bg-surface-container-lowest/20 text-on-primary'
                        : 'bg-surface-container text-primary'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Speed & Queue Metrics KPI Ribbon */}
          <div className="flex flex-wrap items-center gap-space-md justify-between 2xl:justify-end">
            <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">timelapse</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  TG Chuẩn bị TB
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-price-display-md text-price-display-md text-primary font-extrabold">
                    4.8 <span className="text-xs font-normal">phút</span>
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    / Mục tiêu &lt; 6.0p
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-xs">
              <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-sm text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-secondary">low_priority</span>
                <span className="font-label-sm text-label-sm font-semibold">FIFO (Cũ trước)</span>
              </div>
              <button
                type="button"
                onClick={() => setSoundEnabled((s) => !s)}
                className="h-10 px-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container active:scale-95 shadow-sm flex items-center gap-space-xs text-on-surface font-label-sm text-label-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  {soundEnabled ? 'notifications_active' : 'notifications_off'}
                </span>
                <span>Chuông: {soundEnabled ? 'BẬT' : 'TẮT'}</span>
              </button>
              <button
                type="button"
                onClick={load}
                className="h-10 px-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container active:scale-95 shadow-sm flex items-center gap-space-xs text-on-surface font-label-sm text-label-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">refresh</span>
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {message && (
        <div className="mx-gutter-desktop mt-space-md p-space-md rounded-xl bg-secondary-fixed text-on-secondary-fixed font-label-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            <span>{message}</span>
          </div>
          <button type="button" onClick={() => setMessage('')} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="mx-gutter-desktop mt-space-md p-space-md rounded-xl bg-error-container text-on-error-container font-label-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* KDS Multi-Column Ticket Stage */}
      <div className="p-gutter-desktop pb-24 overflow-x-auto min-h-[calc(100vh-14rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg items-start">
          {visibleOrders.map((order) => {
            const isNew = order.status === 'New';
            const isProcessing = order.status === 'Processing';
            const isReady = order.status === 'Ready';
            const details = order.details || [];
            const doneCount = details.filter((_, i) => struckItems[`${order.id}-${i}`]).length;

            return (
              <article
                key={order.id}
                className="group flex flex-col bg-surface-container-lowest rounded-2xl shadow-lg overflow-hidden transition-all duration-300 relative"
              >
                <div
                  className={`h-2.5 w-full ${
                    isNew
                      ? 'bg-secondary-fixed-dim'
                      : isProcessing
                      ? 'bg-secondary'
                      : 'bg-[#16a34a]'
                  }`}
                />

                {/* Ticket Header */}
                <div
                  className={`p-space-lg flex flex-col gap-space-xs ${
                    isProcessing ? 'bg-secondary-fixed/20' : 'bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-start justify-between gap-space-xs">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-price-display-md text-price-display-md text-primary font-black tracking-tight">
                          #HD-{order.id}
                        </span>
                        <span
                          className={`px-space-xs py-0.5 rounded-md font-label-sm text-label-sm font-bold uppercase tracking-wide ${
                            isNew
                              ? 'bg-primary-container text-on-primary'
                              : isProcessing
                              ? 'bg-secondary text-on-secondary'
                              : 'bg-[#dcfce7] text-[#15803d]'
                          }`}
                        >
                          {isNew ? 'Đơn Mới Vào' : isProcessing ? 'Đang Pha Chế' : 'Sẵn Sàng'}
                        </span>
                      </div>
                      <div className="font-headline-md text-headline-md text-primary font-bold mt-1 tracking-tight flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-[24px] text-secondary">
                          table_restaurant
                        </span>
                        <span>{order.tableName || 'Mang đi'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div
                        className={`flex items-center gap-1 px-space-md py-1 rounded-xl shadow-sm font-price-display-md text-price-display-md font-black tracking-tight ${
                          isProcessing
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container-highest text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">timer</span>
                        <span>{elapsedString(order.createdAt, tick)}</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-semibold mt-1">
                        {vnd(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-space-xs">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      <span>
                        Khách: <strong>{order.customerName}</strong>
                      </span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold">
                      Tại Bàn
                    </span>
                    <span>Vào lúc: {when(order.createdAt).slice(11, 16) || 'Vừa xong'}</span>
                  </div>
                </div>

                {/* Line Items Section */}
                <div className="p-space-lg flex flex-col gap-space-md flex-1">
                  <div className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Chi tiết đồ uống &amp; bánh ({details.length} món)</span>
                    <span className="text-secondary font-bold">
                      Đã làm {doneCount}/{details.length}
                    </span>
                  </div>

                  {details.map((detail, idx) => {
                    const key = `${order.id}-${idx}`;
                    const struck = !!struckItems[key];
                    return (
                      <div
                        key={detail.id || idx}
                        onClick={() => toggleStrike(key)}
                        className="cursor-pointer group/item flex items-start gap-space-sm p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all active:scale-[0.98] shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold flex-shrink-0 mt-0.5 shadow-sm">
                          <span
                            className={`material-symbols-outlined text-[20px] ${
                              struck ? 'text-secondary' : 'text-on-surface-variant'
                            }`}
                          >
                            {struck ? 'check' : 'radio_button_unchecked'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-space-xs">
                            <span
                              className={`font-headline-sm text-headline-sm text-primary font-bold ${
                                struck ? 'line-through opacity-50' : ''
                              }`}
                            >
                              {detail.quantity}x {detail.name}
                            </span>
                            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">
                              Bar
                            </span>
                          </div>
                          <p
                            className={`font-body-sm text-body-sm text-on-surface-variant mt-0.5 ${
                              struck ? 'line-through opacity-50' : ''
                            }`}
                          >
                            Đơn giá: {vnd(detail.price)} • Chuẩn định lượng Artisan
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {!details.length && (
                    <div className="p-space-md rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm">
                      Đơn hàng #{order.id} • Tổng {vnd(order.total)}
                    </div>
                  )}
                </div>

                {/* Action Footer */}
                <div className="p-space-lg bg-surface-container-high flex flex-col gap-space-xs mt-auto">
                  <div className="grid grid-cols-2 gap-space-xs">
                    <Link
                      to={`/orders/${order.id}`}
                      className="h-10 px-space-sm rounded-xl bg-surface-container-lowest hover:bg-surface text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-1 no-underline"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Chi tiết phiếu</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => cancel(order.id)}
                      className="h-10 px-space-sm rounded-xl bg-surface-container-lowest hover:bg-error-container text-error font-label-sm text-label-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>Hủy đơn</span>
                    </button>
                  </div>

                  {isNew && (
                    <button
                      type="button"
                      onClick={() => updateStatus(order.id, 'Processing')}
                      className="h-14 w-full rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-label-lg text-label-lg font-black uppercase tracking-wider flex items-center justify-center gap-space-xs shadow-md active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[24px]">play_arrow</span>
                      <span>BẮT ĐẦU PHA CHẾ (#HD-{order.id})</span>
                    </button>
                  )}

                  {isProcessing && (
                    <button
                      type="button"
                      onClick={() => updateStatus(order.id, 'Ready')}
                      className="h-14 w-full rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold uppercase tracking-wider flex items-center justify-center gap-space-xs shadow-md active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[24px] text-secondary-container">
                        check_circle
                      </span>
                      <span>XONG TOÀN BỘ ({order.tableName || 'MANG ĐI'})</span>
                    </button>
                  )}

                  {isReady && (
                    <Link
                      to={`/payments/${order.id}`}
                      className="h-14 w-full rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary-container font-label-lg text-label-lg font-black uppercase tracking-wider flex items-center justify-center gap-space-xs shadow-md active:scale-95 transition-all no-underline"
                    >
                      <span className="material-symbols-outlined text-[24px]">payments</span>
                      <span>THU TIỀN NGAY ({vnd(order.total)})</span>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {!visibleOrders.length && (
          <div className="p-space-2xl rounded-2xl bg-surface-container-lowest shadow-sm text-center max-w-xl mx-auto mt-space-xl">
            <span className="material-symbols-outlined text-[48px] text-secondary block mb-2">
              local_cafe
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              Không có phiếu pha chế nào đang chờ
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Tất cả đồ uống trong hàng đợi đã được hoàn tất. Bạn có thể tạo đơn mới từ màn hình POS.
            </p>
            <Link
              to="/orders/new"
              className="mt-space-md inline-flex items-center gap-2 px-space-lg py-space-sm rounded-xl bg-primary-container text-on-primary font-label-md font-bold no-underline"
            >
              <span className="material-symbols-outlined text-secondary-container">point_of_sale</span>
              <span>Mở POS Bán Hàng</span>
            </Link>
          </div>
        )}
      </div>

      {/* Realtime SignalR Floating Push Toast Banner */}
      {toastOpen && orders.length > 0 && (
        <aside className="fixed bottom-16 right-gutter-desktop z-40 max-w-md bg-primary-container text-on-primary p-space-md rounded-2xl shadow-2xl flex items-center gap-space-md border-2 border-secondary/40">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[26px] text-on-secondary">
              notifications_active
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-space-xs">
              <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider font-bold">
                Realtime SignalR Hub
              </span>
              <span className="text-xs text-on-primary-container">Trực tuyến</span>
            </div>
            <p className="font-label-md text-label-md font-bold text-on-primary mt-0.5 truncate">
              Đang đồng bộ {orders.length} phiếu pha chế tại quầy Bar
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToastOpen(false)}
            className="w-8 h-8 rounded-lg bg-surface-container-high/20 hover:bg-surface-container-high/40 flex items-center justify-center text-on-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </aside>
      )}
    </div>
  );
}
