import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, vnd } from '../api';

const statusLabels = {
  Empty: 'Trống',
  Occupied: 'Đang dùng',
  Reserved: 'Chờ thanh toán / Đã đặt'
};

export default function TablesPage() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [areaFilter, setAreaFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [payMethod, setPayMethod] = useState('qr');
  const [tenderAmount, setTenderAmount] = useState(200000);
  const [error, setError] = useState('');

  function load() {
    Promise.all([
      api('/api/tables').then((rows) => {
        setTables(rows);
        setSelectedId((curr) => curr || rows[0]?.id);
      }),
      api('/api/home')
        .then((home) => setOrders(home.orders || []))
        .catch(() => {})
    ]).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function changeStatus(id, status) {
    try {
      await api(`/api/tables/${id}/status`, { method: 'POST', body: { status } });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const areas = ['all', ...new Set(tables.map((t) => t.area).filter(Boolean))];
  const visibleTables = tables.filter((t) => {
    const matchArea = areaFilter === 'all' || t.area === areaFilter;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.area || '').toLowerCase().includes(search.toLowerCase());
    return matchArea && matchSearch;
  });

  const selected = tables.find((t) => t.id === selectedId) || tables[0];
  const selectedOrder = orders.find((o) => o.tableId === selected?.id || o.tableName === selected?.name);
  const billTotal = selectedOrder ? selectedOrder.total : 156000;
  const changeReturn = Math.max(0, tenderAmount - billTotal);

  const emptyCount = tables.filter((t) => t.status === 'Empty').length;
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'Reserved').length;

  return (
    <div className="flex flex-col w-full">
      {/* Sub-header & Filter / Shortcut Strip */}
      <div className="w-full bg-surface-container-low px-gutter-desktop py-space-sm shadow-sm flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-xs overflow-x-auto py-1 scrollbar-none">
          {areas.map((area) => {
            const active = areaFilter === area;
            const count =
              area === 'all' ? tables.length : tables.filter((t) => t.area === area).length;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setAreaFilter(area)}
                className={`px-space-md py-space-sm rounded-lg font-label-md text-label-md flex items-center gap-space-xs transition-all shrink-0 ${
                  active
                    ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {area === 'all' && (
                  <span className="material-symbols-outlined text-[18px]">table_bar</span>
                )}
                <span>{area === 'all' ? 'Tất cả bàn' : area}</span>
                <span
                  className={`px-space-xs py-0.5 rounded-full font-label-sm text-label-sm ml-1 ${
                    active
                      ? 'bg-surface-container-lowest/20 text-on-primary'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Status Legend & Hotkeys */}
        <div className="flex items-center gap-space-lg flex-wrap">
          <div className="flex items-center gap-space-md text-label-sm font-label-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#16a34a]" />
              <span className="text-on-surface font-semibold">{emptyCount} Trống</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-secondary-container" />
              <span className="text-on-surface font-semibold">{occupiedCount} Phục vụ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-error animate-pulse" />
              <span className="text-error font-bold">{reservedCount} Cần thanh toán / Đặt trước</span>
            </div>
          </div>
          <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="px-space-sm py-1 rounded bg-surface-container font-mono shadow-sm">
              F3: Chuyển bàn
            </span>
            <span className="px-space-sm py-1 rounded bg-surface-container font-mono shadow-sm">
              F5: Gộp bàn
            </span>
            <span className="px-space-sm py-1 rounded bg-surface-container font-mono shadow-sm">
              F6: Tách bàn
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-gutter-desktop mt-space-md p-space-md rounded-xl bg-error-container text-on-error-container">
          {error}
        </div>
      )}

      {/* Main POS Workspace (65% Table Map Grid / 35% Active Checkout Order) */}
      <div className="w-full px-gutter-desktop py-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT SECTION: Table Map Grid */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-lg">
          <div className="flex items-center justify-between flex-wrap gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-[24px]">coffee</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                Sơ đồ mặt bằng phục vụ
              </span>
              <span className="font-label-sm text-label-sm px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                Khu vực: {areaFilter === 'all' ? 'Tất cả' : areaFilter}
              </span>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-2.5 text-outline text-[18px]">
                  search
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 pl-8 pr-3 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm w-56"
                  placeholder="Tìm bàn / khu vực..."
                  type="text"
                />
              </div>
              <button
                type="button"
                onClick={load}
                className="h-10 px-space-md rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md flex items-center gap-1 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                <span className="hidden sm:inline">Làm mới</span>
              </button>
            </div>
          </div>

          {/* Dynamic Interactive Floor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-space-md">
            {visibleTables.map((table) => {
              const isSelected = selected?.id === table.id;
              const isEmpty = table.status === 'Empty';
              const isOccupied = table.status === 'Occupied';
              const isReserved = table.status === 'Reserved';
              const tableOrder = orders.find(
                (o) => o.tableId === table.id || o.tableName === table.name
              );

              if (isEmpty) {
                return (
                  <div
                    key={table.id}
                    onClick={() => setSelectedId(table.id)}
                    style={
                      isSelected
                        ? { boxShadow: '0 0 0 2.5px #2c1810, 0 4px 16px rgba(44,24,16,0.12)' }
                        : undefined
                    }
                    className="bg-surface-container-low hover:bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between h-[190px] transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                          {table.name}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {table.area} • 4 ghế
                        </span>
                      </div>
                      <span className="px-space-sm py-1 rounded-md bg-[#dcfce7] text-[#15803d] font-label-sm text-label-sm font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                        Trống
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-2 text-outline group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[32px]">add_circle</span>
                      <span className="font-label-md text-label-md mt-1">Chạm mở bàn mới</span>
                    </div>
                    <div className="w-full text-center py-1 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
                      Sạch sẽ • Sẵn sàng đón khách
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedId(table.id)}
                  style={
                    isSelected
                      ? { boxShadow: '0 0 0 2.5px #ba1a1a, 0 4px 16px rgba(186, 26, 26, 0.15)' }
                      : isReserved
                      ? { boxShadow: '0 0 0 1.5px #fe932c' }
                      : undefined
                  }
                  className="relative bg-surface-container-lowest rounded-xl p-space-md shadow-md cursor-pointer flex flex-col justify-between h-[190px] transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline-md text-headline-md text-primary font-bold">
                          {table.name}
                        </span>
                        {isReserved && (
                          <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                        )}
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {table.area} • 4 ghế
                      </span>
                    </div>
                    {isOccupied ? (
                      <span className="px-space-sm py-1 rounded-md bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-secondary-container" />
                        Đang dùng
                      </span>
                    ) : (
                      <span className="px-space-sm py-1 rounded-md bg-error-container text-on-error-container font-label-sm text-label-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                        Đã đặt / Chờ thu
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low px-space-sm py-1.5 rounded-lg">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        group
                      </span>
                      {tableOrder?.customerName || 'Khách tại bàn'}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        schedule
                      </span>
                      Đang mở
                    </span>
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Tạm tính:
                      </span>
                      <span className="font-price-display-md text-price-display-md text-primary font-bold">
                        {tableOrder ? vnd(tableOrder.total) : '98.000đ'}
                      </span>
                    </div>
                    <span className="px-space-xs py-1 rounded bg-[#dcfce7] text-[#15803d] font-label-sm text-label-sm font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">done_all</span>
                      {tableOrder?.details?.length || 3} món
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Specialized Section: Takeaway & Online Delivery Queue Cards */}
          <div className="mt-space-md">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  local_shipping
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Đơn mang đi &amp; Ứng dụng giao hàng
                </span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                  Đang hoạt động
                </span>
              </div>
              <Link
                to="/payments"
                className="font-label-sm text-label-sm text-secondary hover:underline flex items-center gap-1 font-semibold no-underline"
              >
                <span>Danh sách chờ thu ngân</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between h-[155px] hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-secondary-fixed font-mono font-bold text-label-sm text-on-secondary-fixed">
                      #TK-802
                    </span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      Khách Anh Tuấn
                    </span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] font-label-sm text-label-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    Đã sẵn sàng
                  </span>
                </div>
                <div className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2">
                  2 Cold Brew Cam Vàng, 1 Croissant Hạnh Nhân
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-price-display-md text-price-display-md text-primary font-bold">
                    145.000đ
                  </span>
                  <Link
                    to="/orders/new"
                    className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm no-underline"
                  >
                    Tạo đơn mới
                  </Link>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between h-[155px] hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-[#00b14f]/15 text-[#00873c] font-mono font-bold text-label-sm">
                      GrabFood #GF-19
                    </span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      Tài xế Hoàng
                    </span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded-full bg-[#ffedd5] text-[#c2410c] font-label-sm text-label-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                    Đang pha chế
                  </span>
                </div>
                <div className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2">
                  3 Cà Phê Trứng Hà Nội (ít đá, 50% ngọt)
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-price-display-md text-price-display-md text-primary font-bold">
                    177.000đ
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                    Dự kiến: 3 phút
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between h-[155px] hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-[#ee4d2d]/15 text-[#ee4d2d] font-mono font-bold text-label-sm">
                      ShopeeFood #SF-44
                    </span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      Tài xế Nam
                    </span>
                  </div>
                  <span className="px-space-sm py-0.5 rounded-full bg-[#dbeafe] text-[#1e40af] font-label-sm text-label-sm font-bold">
                    Tài xế đã đến
                  </span>
                </div>
                <div className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2">
                  1 Latte Yến Mạch Nóng, 1 Tiramisu Cacao
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-price-display-md text-price-display-md text-primary font-bold">
                    130.000đ
                  </span>
                  <Link
                    to="/orders"
                    className="px-space-md py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm no-underline"
                  >
                    Mở KDS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Active Table Detail & Multi-method Checkout Panel */}
        {selected && (
          <div className="lg:col-span-5 xl:col-span-4 bg-surface-container-lowest rounded-2xl shadow-xl flex flex-col overflow-hidden sticky top-24">
            <div className="p-space-lg bg-primary-container text-on-primary flex flex-col gap-space-xs relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="px-space-sm py-1 rounded bg-secondary-container text-on-secondary-container font-headline-md text-headline-md font-bold">
                    {selected.name}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-primary leading-tight">
                      Chi tiết bàn &amp; thu ngân
                    </span>
                    <span className="font-label-sm text-label-sm text-on-primary-container">
                      Khu {selected.area} •{' '}
                      {selectedOrder ? `Hóa đơn #HD-${selectedOrder.id}` : statusLabels[selected.status]}
                    </span>
                  </div>
                </div>
                <select
                  value={selected.status}
                  onChange={(e) => changeStatus(selected.id, e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold focus:outline-none cursor-pointer"
                >
                  <option value="Empty">Trống</option>
                  <option value="Occupied">Đang phục vụ</option>
                  <option value="Reserved">Đã đặt</option>
                </select>
              </div>
              <div className="flex items-center justify-between pt-space-xs text-on-primary-container font-label-sm text-label-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  {selectedOrder?.customerName || 'Khách tại bàn'}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> Trực tiếp
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">badge</span> POS 01
                </span>
              </div>
            </div>

            {/* Ordered Drink Items List */}
            <div className="p-space-md flex flex-col divide-y divide-surface-container-highest max-h-[220px] overflow-y-auto scrollbar-none">
              {(selectedOrder?.details?.length
                ? selectedOrder.details
                : [
                    { id: 1, name: 'Cà Phê Muối Đặc Biệt', quantity: 2, price: 39000 },
                    { id: 2, name: 'Trà Đào Cam Sả Tươi', quantity: 1, price: 45000 },
                    { id: 3, name: 'Bánh Sừng Bò Nướng (Croissant)', quantity: 1, price: 33000 }
                  ]
              ).map((item, i) => (
                <div key={item.id || i} className="py-2.5 flex items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <span className="w-7 h-7 rounded-md bg-surface-container font-mono font-bold text-on-surface flex items-center justify-center shrink-0">
                      {item.quantity}x
                    </span>
                    <div className="flex flex-col truncate">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        {item.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                        Chuẩn vị Artisan • Phục vụ tại bàn
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label-lg text-label-lg text-primary font-bold">
                      {vnd(item.price * item.quantity)}
                    </span>
                    <span className="block font-label-sm text-label-sm text-outline">
                      {vnd(item.price)}/phần
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Bill Summary Rows */}
            <div className="px-space-lg py-space-sm bg-surface-container-low flex flex-col gap-1 text-label-md font-label-md">
              <div className="flex justify-between text-on-surface-variant">
                <span>Tạm tính:</span>
                <span className="font-mono text-on-surface font-semibold">{vnd(billTotal)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Ưu đãi thành viên:</span>
                <span className="font-mono text-on-surface font-semibold">0đ</span>
              </div>
              <div className="flex justify-between items-center pt-2 mt-1 bg-surface-container p-space-sm rounded-lg">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  Tổng thanh toán:
                </span>
                <span className="font-price-display-lg text-price-display-lg text-primary font-black">
                  {vnd(billTotal)}
                </span>
              </div>
            </div>

            {/* Payment Method Selection Tabs */}
            <div className="p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Phương thức thu tiền
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">
                  VietQR / Tiền mặt
                </span>
              </div>

              <div className="grid grid-cols-3 gap-space-xs p-1 bg-surface-container rounded-xl">
                {[
                  { id: 'qr', icon: 'qr_code_scanner', label: 'Mã QR Động' },
                  { id: 'cash', icon: 'payments', label: 'Tiền mặt' },
                  { id: 'pos', icon: 'credit_card', label: 'Cà thẻ POS' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={`py-2.5 rounded-lg font-label-md text-label-md flex flex-col items-center justify-center gap-1 transition-all ${
                      payMethod === m.id
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface font-semibold'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] text-secondary">
                      {m.icon}
                    </span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {payMethod === 'qr' && (
                <div className="flex flex-col items-center bg-surface-container-low p-space-md rounded-xl">
                  <div className="flex items-center justify-between w-full mb-space-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse" />
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                        Cổng VietQR Pro kết nối tức thì
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                      MBBank • 0987.888.888
                    </span>
                  </div>
                  <div className="relative bg-surface-container-lowest p-3 rounded-xl shadow-md flex flex-col items-center">
                    <svg className="w-36 h-36 text-primary" fill="currentColor" viewBox="0 0 120 120">
                      <rect fill="currentColor" height="30" rx="4" width="30" x="10" y="10" />
                      <rect fill="#fff" height="20" rx="2" width="20" x="15" y="15" />
                      <rect fill="currentColor" height="10" rx="1" width="10" x="20" y="20" />
                      <rect fill="currentColor" height="30" rx="4" width="30" x="80" y="10" />
                      <rect fill="#fff" height="20" rx="2" width="20" x="85" y="15" />
                      <rect fill="currentColor" height="10" rx="1" width="10" x="90" y="20" />
                      <rect fill="currentColor" height="30" rx="4" width="30" x="10" y="80" />
                      <rect fill="#fff" height="20" rx="2" width="20" x="15" y="85" />
                      <rect fill="currentColor" height="10" rx="1" width="10" x="20" y="90" />
                      <rect fill="currentColor" height="8" width="8" x="45" y="15" />
                      <rect fill="currentColor" height="6" width="10" x="52" y="28" />
                      <rect fill="currentColor" height="8" width="18" x="35" y="45" />
                      <rect fill="currentColor" height="12" width="12" x="60" y="42" />
                      <rect fill="currentColor" height="15" width="8" x="90" y="70" />
                      <rect fill="currentColor" height="15" width="15" x="85" y="95" />
                      <rect fill="#fe932c" height="24" rx="6" width="24" x="48" y="48" />
                      <circle cx="60" cy="60" fill="#fff" r="5" />
                    </svg>
                    <div className="mt-2 text-center">
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        {vnd(billTotal)} • {selected.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {payMethod === 'cash' && (
                <div className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-xl">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Gợi ý tiền mặt khách đưa:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                    {[billTotal, 160000, 200000, 500000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTenderAmount(amt)}
                        className="h-11 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-mono font-bold text-label-sm flex items-center justify-center transition-all"
                      >
                        {vnd(amt)}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1 p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Khách đưa:
                      </span>
                      <span className="font-price-display-md text-price-display-md text-on-surface font-bold">
                        {vnd(tenderAmount)}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-label-sm text-label-sm text-[#15803d] font-semibold">
                        Tiền thừa thối khách:
                      </span>
                      <span className="font-price-display-md text-price-display-md text-[#15803d] font-black">
                        {vnd(changeReturn)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {payMethod === 'pos' && (
                <div className="flex flex-col items-center justify-center gap-space-sm bg-surface-container-low p-space-lg rounded-xl text-center">
                  <span className="material-symbols-outlined text-[44px] text-secondary">
                    contactless
                  </span>
                  <span className="font-label-lg text-label-lg font-bold text-primary">
                    Chạm thẻ Chip hoặc Quẹt thẻ
                  </span>
                  <span className="px-space-md py-1 rounded bg-[#dbeafe] text-[#1e40af] font-label-sm text-label-sm font-semibold">
                    Thiết bị kết nối: POS-TERMINAL-01 (Bluetooth OK)
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-space-xs pt-space-xs">
                {selectedOrder ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/payments/${selectedOrder.id}`)}
                    className="w-full h-14 rounded-xl bg-primary-container hover:opacity-95 text-on-primary font-headline-sm text-headline-sm flex items-center justify-between px-space-lg shadow-lg transition-transform active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[24px]">task_alt</span>
                      <span>XÁC NHẬN THU TIỀN (F9)</span>
                    </div>
                    <span className="px-space-md py-1 rounded-lg bg-secondary-container text-on-secondary-container font-price-display-md text-price-display-md font-black">
                      {vnd(billTotal)}
                    </span>
                  </button>
                ) : (
                  <Link
                    to={`/orders/new?tableId=${selected.id}`}
                    className="w-full h-14 rounded-xl bg-primary-container hover:opacity-95 text-on-primary font-headline-sm text-headline-sm flex items-center justify-between px-space-lg shadow-lg transition-transform active:scale-[0.99] no-underline"
                  >
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[24px] text-secondary-container">
                        add_shopping_cart
                      </span>
                      <span>GỌI MÓN TẠI BÀN ({selected.name})</span>
                    </div>
                    <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                  </Link>
                )}

                <div className="grid grid-cols-2 gap-space-xs">
                  <Link
                    to={`/orders/new?tableId=${selected.id}`}
                    className="h-11 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm transition-colors no-underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                    <span>Mở POS Bàn này</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="h-11 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>In tạm tính</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
