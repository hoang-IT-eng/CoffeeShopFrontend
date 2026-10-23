import { useEffect, useState } from 'react';
import { api, vnd, when } from '../api';

const invPhotos = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWeD83QAbexoHlpOA-posI1AAbQK8XWBXAr-mFr-I5rUQ7MpFDw8MO6DhEi0ZbntBFoLcb3L3704rayvSYZCZwMaUnbLMd0jh94wXkct73HEF93OgpY4ngknJfLm-OovxnOiucJVFf2M5aLIPjsSxKZxqqLz01P5X5hhC0UhN3P0XjHU96wyoAUxJc27Z-_G5dKN8nlg20mPIBZIbSlXSumtozPuenPZlBJz0IyDZXa0lU-J86r_rSuw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBqBpdwquRE1_WS5nncvgiIDHgWRxwyowmhlk0XsvwNumPYU8oNaSEvLuq__Kss-vg5klMims0mAb6Fi2CtDFk6Rhz1TDj0QH6pAF8lojpx4xjcUKjK_loPsW7bHCTt4qu-n_CClK2ruSNdshOsN0wFSjEzeJsxX9lmb7ncIbsaItwlccPWq2QEIYRFsOK0Pace4gxZ8VsfBC6i8UHGcPzdSGdXmnZDhcu--1N7c8piqt1gBgxSrU1DZA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD31pvLYZC6xAxc5TuwtBZEp5xYRw9tTkG-XV6pQrIetnOcPscc5EFCBN9A1X7QnbtcsVHRuko7SOHgaqyDxsydcVvLueszE_0vW-fKJON2b6x0N0n0Ng085-fN4-HisqYWSQSLqfOYX2hrlxyQZPxX2FqfCCzMshA5o1gBRBTmXSafSBrTcLnFMKmjdHGKYolzwHr4YLBjHGDXR2U4S4eccKn3JXrZWV4XGr-3iS26ck3IujyeZIZ1Og',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBFkFypJZLNoiJNp1yAeGfo1NnwZODbWa7em31b1otfubYO9QZtf8hxVnEyQbnTSsC4QDCKlhk0YpvLXxy25ut0M-HvmeN1ku_wXXFkPvyWtdliPKJUHVKqhk_-yLbEDIkjgZ3Ra85zTD0exEU5-9R0PtEM8JVDAfOKAxYaOpvw9faDbadDI2tBAPTkb-3Qcl6c318eT3KBasOYfjjoy-QA-BWgisXDvjs0NCq1RWR7uVlLu2LGllmZ0w',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB5KHoL8aNduJd6xClrYIWUqxQ5Zr7AlcIsLImsmCsYHyBtT2L4vkMyxV22-nTRLuAryYQDHhZgLzIQ5bJyAbQWvcXhsK-mo4TGXdN77XLjaUu5L7duQjhPcSg7ILhPKVxMZlkfoHHVC2NFF6ciMXe8Fqj2evBWlpgmKCwCo5dSViJpJJDHAdRT3Q_biW415OMysOIMoKhMe5octE8nRjGWkQ1gBHOIQp8wj2xMq33cpBKupzn3ACClxA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBc2vFlwofxMFjMXpJ-fzj18gEYaz4LU3J4__lXDwIGY3hOm_Tjdgv8trxLNgx-avpl3koOGDrM1-GYLJrGLtThPF2FZ2LFAU-q1j0vb_BOr72_APx3M7BbC41Mg1LxIjWlEu1acdRQWf_4fkmiLlQnh2_3Xh_hlAMk85lQaxGqGVQqlz5epSV_5c14C-gwDPx3Avx0B0eNcYNQym9tlMBIFz3zdRdabGGnSwAUnPLZ6zrV2REq9MAXsQ'
];

const blank = {
  name: '',
  quantity: 10,
  unit: 'kg',
  minimumThreshold: 5,
  expirationDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
};

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [widgetTab, setWidgetTab] = useState('stock'); // 'stock' | 'deduct' | 'create'
  const [selectedItemId, setSelectedItemId] = useState('');
  const [stockQty, setStockQty] = useState(10);
  const [stockExp, setStockExp] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [draft, setDraft] = useState(blank);
  const [syncSpin, setSyncSpin] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function load() {
    api('/api/inventory')
      .then((rows) => {
        setItems(rows);
        setSelectedItemId((curr) => curr || String(rows[0]?.id || ''));
      })
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function createItem(event) {
    event.preventDefault();
    setError('');
    try {
      await api('/api/inventory', {
        method: 'POST',
        body: {
          ...draft,
          quantity: Number(draft.quantity),
          minimumThreshold: Number(draft.minimumThreshold)
        }
      });
      setDraft(blank);
      setMessage('Đã thêm nguyên liệu mới vào kho.');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitStockAction(event) {
    event.preventDefault();
    if (!selectedItemId) return;
    setError('');
    try {
      const action = widgetTab === 'deduct' ? 'deduct' : 'add';
      await api(`/api/inventory/${selectedItemId}/stock`, {
        method: 'POST',
        body: {
          quantity: Number(stockQty),
          action,
          expirationDate: stockExp
        }
      });
      setMessage(
        action === 'add'
          ? 'Đã lập phiếu nhập và cộng tồn kho thành công.'
          : 'Đã lập phiếu xuất / hủy nguyên liệu.'
      );
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Xóa nguyên liệu "${item.name}"?`)) return;
    await api(`/api/inventory/${item.id}`, { method: 'DELETE' });
    load();
  }

  const now = Date.now();
  const isLow = (item) => Number(item.quantity) <= Number(item.minimumThreshold);
  const isNearExp = (item) => {
    if (!item.expirationDate) return false;
    const days = (new Date(item.expirationDate).getTime() - now) / 86400000;
    return days <= 7;
  };

  const lowCount = items.filter(isLow).length;
  const nearExpCount = items.filter(isNearExp).length;
  const safeCount = items.filter((i) => !isLow(i) && !isNearExp(i)).length;

  const visible = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter === 'low') return isLow(item);
    if (statusFilter === 'exp') return isNearExp(item);
    if (statusFilter === 'safe') return !isLow(item) && !isNearExp(item);
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-16">
      {/* BREADCRUMB & HEADER SECTION */}
      <div className="w-full px-margin-desktop py-space-xl bg-surface-container-low/70">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-space-lg">
          <nav className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <span>Quản Trị Cơ Sở</span>
            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            <span>Quản Lý Kho &amp; Nguyên Vật Liệu</span>
            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            <span className="text-on-surface font-bold">Tồn Kho &amp; Cảnh Báo</span>
          </nav>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
            <div className="flex flex-col gap-space-xs max-w-3xl">
              <div className="flex items-center gap-space-sm">
                <span className="w-3 h-3 rounded-full bg-secondary-container animate-pulse" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Thời Gian Thực • Chi Nhánh Trung Tâm
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                Quản Lý Kho Nguyên Vật Liệu &amp; Cảnh Báo Hết Hàng
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Kiểm soát tồn kho định lượng thời gian thực, tự động trừ kho theo đơn bán POS/KDS, theo dõi hạn sử dụng và lập phiếu nhập/xuất hao hụt.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm flex-shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-all shadow-sm font-label-md text-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">table_view</span>
                <span>Xuất Báo Cáo Excel</span>
              </button>
              <button
                type="button"
                onClick={() => setWidgetTab('create')}
                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-all shadow-sm font-label-md text-label-md font-bold"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  add_circle
                </span>
                <span>+ Thêm Mặt Hàng Mới</span>
              </button>
              <button
                type="button"
                onClick={() => setWidgetTab('deduct')}
                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-all shadow-sm font-label-md text-label-md font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                <span>+ Xuất Hủy / Hao Hụt</span>
              </button>
              <button
                type="button"
                onClick={() => setWidgetTab('stock')}
                className="flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-all shadow-[0_4px_14px_rgba(254,147,44,0.35)] font-label-md text-label-md font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                <span>+ Lập Phiếu Nhập Kho</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BODY CONTAINER */}
      <div className="max-w-[1600px] w-full mx-auto px-margin-desktop mt-space-xl flex flex-col gap-space-xl">
        {message && (
          <div className="p-space-md rounded-xl bg-secondary-fixed text-on-secondary-fixed font-label-md flex items-center justify-between">
            <span>{message}</span>
            <button type="button" onClick={() => setMessage('')} className="font-bold">
              ✕
            </button>
          </div>
        )}
        {error && (
          <div className="p-space-md rounded-xl bg-error-container text-on-error-container font-label-md flex items-center justify-between">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} className="font-bold">
              ✕
            </button>
          </div>
        )}

        {/* 4 KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
                  Tổng Giá Trị Tồn Kho
                </span>
                <span className="font-price-display-lg text-price-display-lg text-primary font-extrabold">
                  84.650.000
                  <span className="font-label-md text-label-md font-normal ml-0.5">đ</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span>{items.length} mặt hàng nguyên liệu</span>
              </div>
              <span className="text-secondary font-bold">100% định mức</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-label-sm text-label-sm text-error font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  Sắp Hết (Dưới Ngưỡng)
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-price-display-lg text-price-display-lg text-error font-extrabold">
                    {String(lowCount).padStart(2, '0')}
                  </span>
                  <span className="font-body-md text-body-md text-error">nguyên liệu</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">
                  notification_important
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm pt-space-xs text-error font-bold">
              <span>Yêu cầu nhập trước 16:00</span>
              <span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-mono text-[11px]">
                KHẨN CẤP
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-error" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Cận Hạn Sử Dụng (&lt; 7 ngày)
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-price-display-lg text-price-display-lg text-secondary font-extrabold">
                    {String(nearExpCount).padStart(2, '0')}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    mặt hàng
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">hourglass_top</span>
              </div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm pt-space-xs text-on-surface-variant">
              <span className="truncate">Kiểm tra hạn dùng định kỳ</span>
              <span className="text-secondary font-bold flex-shrink-0">Ưu tiên Bar</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-container" />
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
                  Hao Hụt &amp; Tiêu Hao Tháng
                </span>
                <span className="font-price-display-lg text-price-display-lg text-primary font-extrabold">
                  1.420.000
                  <span className="font-label-md text-label-md font-normal ml-0.5">đ</span>
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">trending_down</span>
              </div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm pt-space-xs">
              <div className="flex items-center gap-1 text-on-surface">
                <span>Tỷ lệ:</span>
                <span className="font-bold text-secondary">1.68%</span>
                <span className="text-on-surface-variant text-[11px]">(chuẩn &lt; 2.0%)</span>
              </div>
              <span className="text-on-surface font-mono font-medium">Bình thường</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-highest" />
          </div>
        </div>

        {/* FILTER & SEARCH TOOLBAR */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
            <div className="relative flex-1 max-w-xl">
              <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface placeholder:text-outline text-body-sm font-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-inner"
                placeholder="Tìm kiếm theo tên nguyên liệu, mã SKU (vd: NL-CF01, Rich's, Sữa đặc...)"
                type="text"
              />
            </div>

            <div className="flex items-center gap-space-sm flex-wrap">
              <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                {[
                  { id: 'all', label: `Tất cả (${items.length})`, dot: '' },
                  { id: 'low', label: `Cảnh báo hết (${lowCount})`, dot: 'bg-error' },
                  { id: 'exp', label: `Cận date (${nearExpCount})`, dot: 'bg-secondary-container' },
                  { id: 'safe', label: `Đủ an toàn (${safeCount})`, dot: '' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStatusFilter(f.id)}
                    className={`px-space-md py-space-xs rounded-md font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                      statusFilter === f.id
                        ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {f.dot && <span className={`w-2 h-2 rounded-full ${f.dot}`} />}
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSyncSpin(true);
                  load();
                  setTimeout(() => setSyncSpin(false), 700);
                }}
                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-secondary-fixed hover:text-on-secondary-fixed font-label-sm text-label-sm transition-all"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    syncSpin ? 'animate-spin' : ''
                  }`}
                >
                  sync
                </span>
                <span>Đồng bộ POS</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* LEFT COLUMN: INVENTORY DATA TABLE */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-space-lg py-space-md bg-surface-container-low/60 flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[20px] text-primary">shelves</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    Danh Sách Tồn Kho Chi Tiết
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-mono text-[11px] font-bold">
                    {visible.length} mặt hàng hiển thị
                  </span>
                </div>
                <div className="flex items-center gap-space-sm text-label-sm font-label-sm text-on-surface-variant">
                  <span>
                    Sắp xếp: <strong className="text-on-surface">Nguy cấp trước</strong>
                  </span>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container-high/60 text-on-surface-variant font-label-sm text-label-sm">
                    <tr>
                      <th className="py-space-md px-space-md font-bold">MÃ &amp; NGUYÊN LIỆU</th>
                      <th className="py-space-md px-space-md font-bold">
                        TỒN THỰC TẾ / TỐI THIỂU
                      </th>
                      <th className="py-space-md px-space-md font-bold">HSD / LÔ</th>
                      <th className="py-space-md px-space-md font-bold text-center">TRẠNG THÁI</th>
                      <th className="py-space-md px-space-md font-bold text-center">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((item, idx) => {
                      const low = isLow(item);
                      const near = isNearExp(item);
                      const pct = Math.min(
                        100,
                        Math.round(
                          (Number(item.quantity) / Math.max(Number(item.minimumThreshold) * 2, 1)) *
                            100
                        )
                      );
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-surface-container-low/50 transition-colors ${
                            low
                              ? 'bg-error-container/10'
                              : near
                              ? 'bg-secondary-fixed/20'
                              : ''
                          }`}
                        >
                          <td className="py-space-md px-space-md">
                            <div className="flex items-center gap-space-sm">
                              <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0">
                                <img
                                  className="w-full h-full object-cover"
                                  src={invPhotos[idx % invPhotos.length]}
                                  alt={item.name}
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-label-md text-label-md text-primary font-bold truncate">
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
                                  <span className="font-mono text-secondary font-bold">
                                    NL-{String(item.id).padStart(2, '0')}
                                  </span>
                                  <span>• Đơn vị: {item.unit}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex flex-col gap-1 w-44">
                              <div className="flex justify-between font-label-sm text-label-sm">
                                <span
                                  className={`font-bold ${
                                    low ? 'text-error' : 'text-on-surface'
                                  }`}
                                >
                                  {item.quantity} {item.unit}
                                </span>
                                <span className="text-on-surface-variant">
                                  Min: {item.minimumThreshold} {item.unit}
                                </span>
                              </div>
                              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    low
                                      ? 'bg-error'
                                      : near
                                      ? 'bg-secondary-container'
                                      : 'bg-primary-container'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md font-label-sm text-label-sm">
                            <span
                              className={`font-medium block ${
                                near ? 'text-error font-bold' : 'text-on-surface'
                              }`}
                            >
                              {when(item.expirationDate).slice(0, 10)}
                            </span>
                            <span className="font-mono text-outline text-[11px]">
                              Lô: LOT-{item.id}24
                            </span>
                          </td>
                          <td className="py-space-md px-space-md text-center">
                            {low ? (
                              <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                                <span>Sắp hết ({item.quantity} {item.unit})</span>
                              </span>
                            ) : near ? (
                              <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                <span>Cận Date</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-on-surface" />
                                <span>Tồn an toàn</span>
                              </span>
                            )}
                          </td>
                          <td className="py-space-md px-space-md text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedItemId(String(item.id));
                                  setWidgetTab('stock');
                                }}
                                className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-container hover:text-on-secondary-container flex items-center justify-center transition-all"
                                title="Lập phiếu nhập"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  add_box
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedItemId(String(item.id));
                                  setWidgetTab('deduct');
                                }}
                                className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest flex items-center justify-center transition-all"
                                title="Xuất kho / Hao hụt"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  indeterminate_check_box
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(item)}
                                className="w-8 h-8 rounded-lg bg-surface-container text-error hover:bg-error-container flex items-center justify-center transition-all"
                                title="Xóa nguyên liệu"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 2 PRACTICAL REAL-TIME WIDGETS */}
          <div className="lg:col-span-4 flex flex-col gap-space-lg">
            {/* WIDGET 1: Lập Phiếu Nhập / Xuất Kho Nhanh */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    post_add
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Tác Vụ Kho Nhanh
                  </h2>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-mono">
                  Quản lý
                </span>
              </div>

              <div className="grid grid-cols-3 bg-surface-container-low p-1 rounded-lg gap-1">
                <button
                  type="button"
                  onClick={() => setWidgetTab('stock')}
                  className={`py-space-xs text-center rounded-md font-label-sm text-label-sm transition-all ${
                    widgetTab === 'stock'
                      ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  + Nhập Kho
                </button>
                <button
                  type="button"
                  onClick={() => setWidgetTab('deduct')}
                  className={`py-space-xs text-center rounded-md font-label-sm text-label-sm transition-all ${
                    widgetTab === 'deduct'
                      ? 'bg-error text-on-error shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  - Xuất Hủy
                </button>
                <button
                  type="button"
                  onClick={() => setWidgetTab('create')}
                  className={`py-space-xs text-center rounded-md font-label-sm text-label-sm transition-all ${
                    widgetTab === 'create'
                      ? 'bg-secondary text-on-secondary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  + Mặt Hàng
                </button>
              </div>

              {widgetTab === 'create' ? (
                <form onSubmit={createItem} className="flex flex-col gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-on-surface-variant font-bold">
                      Tên nguyên liệu mới
                    </label>
                    <input
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="Vd: Cà phê Robusta Buôn Ma Thuột"
                      className="w-full px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-space-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-on-surface-variant font-bold">
                        SL đầu
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={draft.quantity}
                        onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
                        className="w-full px-2.5 py-2 bg-surface-container-low rounded-lg font-mono font-bold"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-on-surface-variant font-bold">
                        Đơn vị
                      </label>
                      <input
                        value={draft.unit}
                        onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
                        placeholder="kg, lon, hộp"
                        className="w-full px-2.5 py-2 bg-surface-container-low rounded-lg"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-on-surface-variant font-bold">
                        Ngưỡng Min
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={draft.minimumThreshold}
                        onChange={(e) => setDraft({ ...draft, minimumThreshold: e.target.value })}
                        className="w-full px-2.5 py-2 bg-surface-container-low rounded-lg font-mono"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-on-surface-variant font-bold">
                      Hạn sử dụng lô đầu
                    </label>
                    <input
                      type="date"
                      value={draft.expirationDate}
                      onChange={(e) => setDraft({ ...draft, expirationDate: e.target.value })}
                      className="w-full px-space-md py-space-sm bg-surface-container-low rounded-lg"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full py-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all shadow-md font-label-md font-bold flex items-center justify-center gap-space-xs"
                  >
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    <span>Lưu Mặt Hàng Nguyên Liệu Mới</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={submitStockAction} className="flex flex-col gap-space-sm">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                      Chọn Nguyên Liệu Cần {widgetTab === 'stock' ? 'Nhập' : 'Xuất Hủy'}
                    </label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-sm font-bold focus:outline-none"
                    >
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Hiện có: {item.quantity} {item.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-space-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-on-surface-variant font-bold">
                        Số lượng {widgetTab === 'stock' ? 'nhập thêm' : 'xuất hủy'}
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={stockQty}
                        onChange={(e) => setStockQty(e.target.value)}
                        className="w-full px-space-md py-space-sm bg-surface-container-low rounded-lg font-mono font-bold text-primary"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-on-surface-variant font-bold">
                        Hạn sử dụng lô
                      </label>
                      <input
                        type="date"
                        value={stockExp}
                        onChange={(e) => setStockExp(e.target.value)}
                        className="w-full px-space-sm py-space-sm bg-surface-container-low rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-space-sm flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between p-space-sm rounded-lg bg-secondary-fixed/30 font-label-md text-label-md">
                      <span className="text-on-surface font-bold">Ước tính giá trị phiếu:</span>
                      <span className="font-price-display-md text-price-display-md text-secondary">
                        {vnd(Number(stockQty || 0) * 45000)}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className={`w-full py-space-md rounded-lg text-on-primary transition-all shadow-md font-label-md font-bold flex items-center justify-center gap-space-xs ${
                        widgetTab === 'deduct'
                          ? 'bg-error hover:opacity-90'
                          : 'bg-primary-container hover:bg-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">save</span>
                      <span>
                        {widgetTab === 'deduct'
                          ? 'Xác Nhận Xuất Hủy & Trừ Kho'
                          : 'Lưu & Tự Động Cộng Tồn Kho Ngay'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* WIDGET 2: SIGNALR REALTIME LOG */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping" />
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Nhật Ký Trừ Kho Tự Động
                  </h2>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-mono">
                  SignalR Active
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Đồng bộ công thức định lượng (Recipe Auto-Deduction) theo thời gian thực từ quầy POS bán hàng:
              </p>

              <div className="flex flex-col gap-space-md relative pl-4">
                <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-surface-container-high" />
                {[
                  {
                    time: '10:22',
                    delta: '-0.05 kg',
                    deltaClass: 'bg-error-container text-on-error-container',
                    dot: 'bg-secondary-container',
                    title: 'Cà phê Robusta Buôn Ma Thuột',
                    desc: 'Tự động trừ bởi đơn #HD-1024 (Bàn T1-04)'
                  },
                  {
                    time: '10:15',
                    delta: '-0.06 L',
                    deltaClass: 'bg-error-container text-on-error-container',
                    dot: 'bg-secondary-container',
                    title: 'Sữa Tươi Thanh Trùng Dalatmilk',
                    desc: 'Tự động trừ bởi đơn #TK-802 (Mang đi)'
                  },
                  {
                    time: '09:40',
                    delta: '+50.0 kg',
                    deltaClass: 'bg-surface-container-high text-on-surface',
                    dot: 'bg-primary',
                    title: 'Hạt Arabica Cầu Đất (Phiếu #PN-241001)',
                    desc: 'Lập phiếu & duyệt bởi: Quản lý Tuấn'
                  }
                ].map((log, i) => (
                  <div key={i} className="relative flex items-start gap-space-sm">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${log.dot} mt-1 flex-shrink-0 z-10 shadow-sm`}
                    />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-mono text-label-sm font-bold text-on-surface">
                          {log.time}
                        </span>
                        <span
                          className={`px-space-xs py-0.5 rounded ${log.deltaClass} text-[11px] font-bold font-mono`}
                        >
                          {log.delta}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-bold truncate">
                        {log.title}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                        {log.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SYSTEM STATUS STRIP */}
        <div className="w-full p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-sm text-label-sm">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-space-xs text-primary font-bold">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                warehouse
              </span>
              <span>
                Kho chính: Chi nhánh Trung Tâm (Quầy Bar tầng 1 &amp; Kho đệm lầu 2)
              </span>
            </div>
            <span className="text-outline hidden md:inline">•</span>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px]">event_repeat</span>
              <span>
                Chu kỳ kiểm kê định kỳ tiếp theo: <strong className="text-on-surface">28/10</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm flex-shrink-0">
            <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Đồng bộ tồn kho tức thời (POS/KDS kết nối)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
