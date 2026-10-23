import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, vnd, when } from '../api';

const topMovers = [
  {
    rank: 'Top 1 Best-seller',
    rankClass: 'text-secondary',
    name: 'Cà phê Muối',
    price: '45.000đ',
    sold: '84 ly',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrD1lhCDcLnEgHMOLCpYpkr2w4DON5LvnKSOmn3gfT2q7kk6BNZ-A9-NWtsFbsPzNo_IQDVNB7YzMOUiuLZgpHgUubkJ7AdgpG5Y_NsnigfYxGquPy0J-qi664RLkZBFaC5Upppwd4wZerMvIbMjIVOL0YqI-Pfe5H6CDq82GrPBIYZ_ehna8p8Cwfq5rePmPq6QnTpfVBuHh7c_JR-kXoNQDlh-5fwxMcguz5Bii_1-SFjB_2IeHX3Q'
  },
  {
    rank: 'Top 2',
    rankClass: 'text-secondary-container',
    name: 'Bạc Xỉu 3 Tầng',
    price: '42.000đ',
    sold: '62 ly',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4LrVpOFg-7e5TS3j971TrQIxrlFlRwzlUywl3nZJxMjkO0bgZJGpmBHp6SemXStKgaQsutssdwYSd3xmxunrUoRmrNPDQTzfVgnDYPNngBkGycqDoyfUw1uLj-a6irBuTB4H1nGseJ6QrD7Y6THAKb17AFpynFjATg4lpG5F9jEJaMYQuUF9jB81c5y45Y7JOjmVmA5TLjSOo8AUdhCHwA7O_dz-HXg4tSyG_WGD48JpDFfB1JaqqYQ'
  },
  {
    rank: 'Top 3',
    rankClass: 'text-on-surface-variant',
    name: 'Trà Đào Cam Sả',
    price: '52.000đ',
    sold: '55 ly',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC7xShpfmmpKUIGxZN-4f9-gz_3Refh17QJKjeOrsE4ZsaenOd7jIBiywZ9Npba31ybYJZ6rHqD49Hyvk9T5JMohD8HHWB658xk9ebMLybrnyCT1GOn3dlSsU6iTS4H4HD8tJ5Oe3Udpnr57wIjsXPV0HznvZVSGC4j26sYU24D6Sk7ZQ1NaPOE1gdIDysOssxITuvu5lqzsVENUje8Hoduz4leDX13i44n9SacUlgGkFcVNrNpwST-w'
  },
  {
    rank: 'Top Pastry',
    rankClass: 'text-on-surface-variant',
    name: 'Croissant Bơ Pháp',
    price: '38.000đ',
    sold: '38 cái',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArABPUBbpo9coNAwOrGoChmwmy0e5RDGI-fwGA4CxnB_zmIwolA4Ont5SuFYy_hfOFBmrRqmWK12_TRSXhYDx2bR0KLk5-v997CTULaKNuUVqwn49VU9PVBFDuLv8I5E_9stuRPImUFnLpmZ4M7FZmqWqWjNLwF9kaUoiag1N3wgGGGPvXYvZzpSVoUhsYqmNO9BAGDPc6vRuLy7WMO6MX5nXy-FNkR7HygX44DXfpxo3LPqQoYUAwhw'
  }
];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState('');

  function load() {
    setSpinning(true);
    Promise.all([
      api('/api/dashboard').then(setData),
      api('/api/home').then((home) => setOrders(home.orders || [])).catch(() => {}),
      api('/api/tables').then(setTables).catch(() => {})
    ])
      .catch((err) => setError(err.message))
      .finally(() => setTimeout(() => setSpinning(false), 600));
  }

  useEffect(load, []);

  if (error) {
    return (
      <div className="p-space-xl max-w-4xl mx-auto mt-space-xl rounded-xl bg-error-container text-on-error-container">
        {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="p-space-2xl text-center font-label-md text-on-surface-variant">
        Đang mở trung tâm điều hành...
      </div>
    );
  }

  const warnings = [...(data.lowStock || []), ...(data.nearExpiry || []), ...(data.expired || [])];
  const totalTables = tables.length || 24;
  const occupiedCount = data.tablesInUse || tables.filter((t) => t.status === 'Occupied').length || 0;
  const occupancyPct = Math.round((occupiedCount / Math.max(totalTables, 1)) * 100);
  const revenueNumber = Number(data.dailyRevenue || 0).toLocaleString('vi-VN');

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Navigation & Action Hub Bar */}
      <section className="w-full px-margin-desktop py-space-xl bg-surface-container-low shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span>Quản Trị Cơ Sở</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>Dashboard Tổng Quan</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-secondary font-bold">Trung Tâm Điều Hành</span>
            </div>
            <div className="flex flex-wrap items-center gap-space-md">
              <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                Trung Tâm Điều Hành &amp; Tổng Quan Quán Cà Phê
              </h1>
              <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping" />
                <span className="font-bold">Live Sync: Realtime SignalR</span>
              </div>
              <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
                Chi nhánh Trung Tâm (HCM-01)
              </span>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-space-sm">
            <button
              type="button"
              onClick={load}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm active:scale-95"
            >
              <span className={`material-symbols-outlined text-[18px] text-secondary ${spinning ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>Tải Lại Dữ Liệu</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">download</span>
              <span>Xuất Báo Cáo</span>
            </button>
            <Link
              to="/orders/new"
              className="flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-md active:scale-95 font-bold no-underline"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary-container">point_of_sale</span>
              <span>+ Mở Ca / Vào POS</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto w-full px-margin-desktop mt-space-xl flex flex-col gap-space-2xl">
        {/* Pulse Metrics Strip (KPI Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* KPI Card 1: Revenue */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">Doanh Thu Hôm Nay</span>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-price-display-lg text-price-display-lg text-primary tracking-tight font-extrabold">
                  {revenueNumber}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant font-bold">đ</span>
              </div>
              <div className="flex items-center gap-space-xs mt-space-xs text-on-secondary-container">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span className="font-label-sm text-label-sm font-bold">+16.2% so với hôm qua</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-sm bg-surface-container-low rounded-lg px-space-sm py-1 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>{orders.length} đơn đang mở</span>
              <span className="text-secondary font-bold">Đạt 115% kế hoạch</span>
            </div>
          </div>

          {/* KPI Card 2: Table Capacity */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                Công Suất Bàn &amp; Ghế
              </span>
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">table_bar</span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-price-display-lg text-price-display-lg text-secondary font-extrabold">
                  {occupiedCount}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">
                  / {totalTables} Bàn
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-space-sm">
                <div
                  className="bg-secondary-container h-full rounded-full"
                  style={{ width: `${Math.min(100, occupancyPct)}%` }}
                />
              </div>
            </div>
            <div className="mt-space-md pt-space-sm bg-surface-container-low rounded-lg px-space-sm py-1 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span className="font-bold text-on-surface">Tỉ lệ lấp đầy: {occupancyPct}%</span>
              <span className="text-secondary font-semibold">
                {Math.max(0, totalTables - occupiedCount)} bàn sẵn sàng
              </span>
            </div>
          </div>

          {/* KPI Card 3: KDS Speed */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                Tốc Độ Pha Chế (KDS)
              </span>
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-price-display-lg text-price-display-lg text-primary font-extrabold">4.2</span>
                <span className="font-headline-sm text-headline-sm text-on-surface-variant font-semibold">
                  phút/đơn
                </span>
              </div>
              <div className="flex items-center gap-space-xs mt-space-xs text-on-secondary-fixed-variant">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="font-label-sm text-label-sm font-bold">Mục tiêu trần: &lt; 6.0 phút</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-sm bg-surface-container-low rounded-lg px-space-sm py-1 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>{data.newOrders + data.processingOrders} đơn tại quầy Bar</span>
              <span className="text-secondary-container font-bold">Hiệu suất 98.4%</span>
            </div>
          </div>

          {/* KPI Card 4: Operating Alerts */}
          <div className="p-space-lg rounded-xl bg-error-container text-on-error-container shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md font-semibold text-error">Cảnh Báo Vận Hành</span>
              <div className="w-10 h-10 rounded-lg bg-error text-on-error flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[22px]">notification_important</span>
              </div>
            </div>
            <div className="mt-space-md">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-price-display-lg text-price-display-lg text-on-error-container font-extrabold">
                  {String(data.totalWarnings || warnings.length).padStart(2, '0')}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-error-container font-medium">
                  vấn đề cần xử lý
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-error-container opacity-90 mt-1 line-clamp-1">
                {warnings[0]?.name ? `Kho: ${warnings[0].name}` : 'Kho nguyên liệu & hạn dùng'}
              </p>
            </div>
            <div className="mt-space-md pt-space-sm bg-surface-container-lowest/80 rounded-lg px-space-sm py-1 flex items-center justify-between text-error font-label-sm text-label-sm">
              <span className="font-bold">Độ ưu tiên: Cao</span>
              <Link to="/inventory" className="underline cursor-pointer font-bold text-error">
                Xử lý ngay →
              </Link>
            </div>
          </div>
        </section>

        {/* Two-Column Primary Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* LEFT SECTION: 65% width (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-space-xl">
            {/* Hourly Revenue & Flow Chart Card */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Nhịp Độ Doanh Thu &amp; Khách Theo Giờ
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Dữ liệu hóa đơn từ 06:30 đến 22:00. Nổi bật hai đợt cao điểm ngày làm việc.
                  </p>
                </div>
                <div className="flex items-center gap-space-md font-label-sm text-label-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-secondary-container" />
                    <span className="text-on-surface-variant font-medium">Doanh thu (triệu đ)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-primary-container" />
                    <span className="text-on-surface-variant font-medium">Số lượng ly (cốc)</span>
                  </div>
                </div>
              </div>

              {/* Inline Rich SVG Visualization for Hourly Rhythm */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[620px] h-64 flex flex-col justify-end relative pt-6 pb-2">
                  <div className="absolute top-2 left-[21%] -translate-x-1/2 px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold shadow-sm">
                    Đỉnh Ca Sáng (8h-9h30)
                  </div>
                  <div className="absolute top-4 left-[64%] -translate-x-1/2 px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold shadow-sm">
                    Đỉnh Ca Chiều (14h-16h)
                  </div>
                  <svg className="w-full h-44 overflow-visible" preserveAspectRatio="none" viewBox="0 0 620 160">
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3,3" x1="0" x2="620" y1="10" y2="10" />
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3,3" x1="0" x2="620" y1="60" y2="60" />
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3,3" x1="0" x2="620" y1="110" y2="110" />
                    <line className="text-surface-container-highest" stroke="currentColor" strokeWidth="2" x1="0" x2="620" y1="150" y2="150" />
                    <path
                      d="M 10 145 C 40 140, 60 120, 90 70 C 120 20, 150 15, 180 55 C 210 95, 250 125, 290 120 C 330 115, 360 65, 390 35 C 420 15, 450 60, 480 85 C 510 110, 560 125, 610 135 L 610 150 L 10 150 Z"
                      fill="url(#revenueGradient)"
                      opacity="0.45"
                    />
                    <path
                      d="M 10 145 C 40 140, 60 120, 90 70 C 120 20, 150 15, 180 55 C 210 95, 250 125, 290 120 C 330 115, 360 65, 390 35 C 420 15, 450 60, 480 85 C 510 110, 560 125, 610 135"
                      fill="none"
                      stroke="#FE932C"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                    <circle className="fill-secondary-container stroke-surface stroke-[3]" cx="140" cy="22" r="5" />
                    <circle className="fill-secondary-container stroke-surface stroke-[3]" cx="395" cy="32" r="5" />
                    <rect className="fill-primary-container opacity-40" height="20" rx="3" width="8" x="25" y="130" />
                    <rect className="fill-primary-container opacity-50" height="60" rx="3" width="8" x="75" y="90" />
                    <rect className="fill-primary-container opacity-70" height="115" rx="3" width="8" x="135" y="35" />
                    <rect className="fill-primary-container opacity-40" height="70" rx="3" width="8" x="195" y="80" />
                    <rect className="fill-primary-container opacity-30" height="35" rx="3" width="8" x="255" y="115" />
                    <rect className="fill-primary-container opacity-40" height="45" rx="3" width="8" x="315" y="105" />
                    <rect className="fill-primary-container opacity-70" height="100" rx="3" width="8" x="375" y="50" />
                    <rect className="fill-primary-container opacity-50" height="80" rx="3" width="8" x="435" y="70" />
                    <rect className="fill-primary-container opacity-40" height="55" rx="3" width="8" x="495" y="95" />
                    <rect className="fill-primary-container opacity-30" height="25" rx="3" width="8" x="555" y="125" />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#FE932C" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#FE932C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="w-full flex justify-between text-on-surface-variant font-label-sm text-label-sm pt-2">
                    <span>06:30</span>
                    <span>08:00</span>
                    <span className="font-bold text-secondary">09:30</span>
                    <span>11:30</span>
                    <span>13:30</span>
                    <span className="font-bold text-secondary">15:00</span>
                    <span>17:00</span>
                    <span>19:00</span>
                    <span>21:00</span>
                    <span>22:00</span>
                  </div>
                </div>
              </div>

              {/* Bottom Metric Highlights Inside Chart */}
              <div className="grid grid-cols-3 gap-space-sm pt-space-sm bg-surface-container-low rounded-lg p-space-sm text-center">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Cao Điểm Doanh Thu</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">4.280.000đ</span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium block">Khung 08:30 - 09:30</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Tổng Cốc Pha Chế</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">438 ly</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Bình quân 32 ly/giờ</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Giá Trị / Hóa Đơn</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">86.200đ</span>
                  <span className="font-label-sm text-label-sm text-on-secondary-container font-medium block">
                    +8% so với tuần trước
                  </span>
                </div>
              </div>
            </div>

            {/* Live Orders Feed (Đơn Hàng Thời Gian Thực) */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Đơn Hàng Gần Nhất</h2>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                    Cập nhật tức thời
                  </span>
                </div>
                <Link
                  to="/orders"
                  className="text-secondary font-label-md text-label-md hover:underline font-bold flex items-center gap-1 no-underline"
                >
                  <span>Xem toàn bộ đơn bếp</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              <div className="flex flex-col gap-space-sm">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm no-underline"
                  >
                    <div className="flex items-center gap-space-md">
                      <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex flex-col items-center justify-center font-bold">
                        <span className="text-[10px] opacity-75">BÀN</span>
                        <span className="text-[14px] leading-none">{order.tableName || 'MANG'}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-lg text-label-lg font-bold text-primary">#HD-{order.id}</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[12px] font-mono">
                            {when(order.createdAt).slice(11, 16) || when(order.createdAt)}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {order.details?.length
                            ? order.details.map((d) => `${d.quantity}x ${d.name}`).join(', ')
                            : `Khách: ${order.customerName}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-space-lg">
                      <div className="text-right">
                        <span className="font-label-lg text-label-lg text-primary font-bold block">
                          {vnd(order.total)}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-end gap-1">
                          <span className="material-symbols-outlined text-[14px] text-secondary">qr_code_2</span>
                          {order.customerName}
                        </span>
                      </div>
                      <span className="px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                        {order.status === 'New'
                          ? 'Mới nhận'
                          : order.status === 'Processing'
                          ? 'Đang pha chế'
                          : order.status === 'Ready'
                          ? 'Sẵn sàng'
                          : order.status}
                      </span>
                    </div>
                  </Link>
                ))}

                {!orders.length && (
                  <p className="font-body-sm text-on-surface-variant py-space-md text-center">
                    Chưa có đơn hàng đang mở. Nhấn &ldquo;+ Mở Ca / Vào POS&rdquo; để tạo đơn mới.
                  </p>
                )}
              </div>
            </div>

            {/* Top Selling Items (Top Movers Today) */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Món Bán Chạy Hôm Nay (Top Movers)
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Đóng góp 58% vào tổng số lượng ly bán ra trong ngày
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary text-[28px]">local_fire_department</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {topMovers.map((item) => (
                  <div
                    key={item.name}
                    className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between hover:bg-surface-container transition-all"
                  >
                    <div className="flex gap-space-sm items-center">
                      <img
                        className="w-14 h-14 rounded-lg object-cover shadow-sm flex-shrink-0"
                        src={item.img}
                        alt={item.name}
                      />
                      <div className="min-w-0">
                        <span className={`font-label-sm text-label-sm ${item.rankClass} font-bold block`}>
                          {item.rank}
                        </span>
                        <h3 className="font-label-lg text-label-lg font-bold text-primary truncate">{item.name}</h3>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{item.price}</span>
                      </div>
                    </div>
                    <div className="mt-space-md pt-space-xs bg-surface-container rounded px-2 py-1 flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Đã bán:</span>
                      <span className="font-label-md text-label-md text-primary font-extrabold">{item.sold}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: 35% width (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-space-xl">
            {/* Quick Floor Snapshot (Sơ đồ bàn thu nhỏ) */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Sơ Đồ Bàn Rút Gọn</h2>
                <span className="material-symbols-outlined text-secondary text-[22px]">meeting_room</span>
              </div>

              <div className="flex flex-col gap-space-sm">
                <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg font-bold text-primary">
                      Tầng 1 (Sảnh Bar &amp; Máy pha)
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">
                      {tables.filter((t) => t.name.startsWith('T1') && t.status !== 'Empty').length} /{' '}
                      {tables.filter((t) => t.name.startsWith('T1')).length || 4} bàn
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    {(tables.filter((t) => t.name.startsWith('T1')).length
                      ? tables.filter((t) => t.name.startsWith('T1'))
                      : [
                          { id: 1, name: 'T1-01', status: 'Empty' },
                          { id: 2, name: 'T1-02', status: 'Occupied' },
                          { id: 3, name: 'T1-03', status: 'Occupied' },
                          { id: 4, name: 'T1-04', status: 'Occupied' }
                        ]
                    ).map((t) => (
                      <Link
                        key={t.id}
                        to="/tables"
                        className={`h-7 rounded text-[11px] font-bold flex items-center justify-center no-underline ${
                          t.status === 'Occupied'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : t.status === 'Reserved'
                            ? 'bg-error text-on-error'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg font-bold text-primary">
                      Tầng 2 &amp; Sân Vườn
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-bold">
                      {tables.filter((t) => !t.name.startsWith('T1') && t.status !== 'Empty').length} /{' '}
                      {tables.filter((t) => !t.name.startsWith('T1')).length || 4} bàn
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    {(tables.filter((t) => !t.name.startsWith('T1')).length
                      ? tables.filter((t) => !t.name.startsWith('T1'))
                      : [
                          { id: 5, name: 'T2-01', status: 'Empty' },
                          { id: 6, name: 'T2-02', status: 'Occupied' },
                          { id: 7, name: 'T2-03', status: 'Reserved' },
                          { id: 8, name: 'OT-01', status: 'Empty' }
                        ]
                    ).map((t) => (
                      <Link
                        key={t.id}
                        to="/tables"
                        className={`h-7 rounded text-[11px] font-bold flex items-center justify-center no-underline ${
                          t.status === 'Occupied'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : t.status === 'Reserved'
                            ? 'bg-error text-on-error'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/tables"
                className="w-full py-space-sm rounded-lg bg-surface-container text-primary font-label-md text-label-md font-bold text-center hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 no-underline"
              >
                <span>Mở Sơ Đồ Bàn Toàn Diện</span>
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>
            </div>

            {/* Inventory Urgent Alerts (Nguyên Liệu Cảnh Báo) */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Cảnh Báo Tồn Kho</h2>
                <span className="px-2 py-0.5 rounded bg-error-container text-error font-label-sm text-label-sm font-bold">
                  {warnings.length} mặt hàng
                </span>
              </div>
              <div className="flex flex-col gap-space-sm">
                {warnings.slice(0, 4).map((item) => (
                  <div
                    key={`${item.id}-${item.name}`}
                    className="p-space-md rounded-lg bg-surface-container-low flex items-center justify-between"
                  >
                    <div className="flex items-center gap-space-sm">
                      <div className="w-9 h-9 rounded bg-error-container text-error flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                      </div>
                      <div>
                        <span className="font-label-md text-label-md font-bold text-primary block">{item.name}</span>
                        <span className="font-body-sm text-body-sm text-error font-medium">
                          Còn {item.quantity} {item.unit} (Min: {item.minimumThreshold} {item.unit})
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/inventory"
                      className="px-space-sm py-1 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-bold hover:bg-primary transition-colors no-underline"
                    >
                      Nhập kho
                    </Link>
                  </div>
                ))}
                {!warnings.length && (
                  <p className="font-body-sm text-on-surface-variant">Tất cả nguyên liệu đang ở ngưỡng an toàn.</p>
                )}
              </div>
            </div>

            {/* Active Staff on Shift (Nhân sự đang trực) */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Nhân Sự Ca Hiện Tại</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Ca Sáng (06:30 - 14:30)</span>
              </div>
              <div className="flex flex-col gap-space-sm">
                {[
                  { initials: 'TM', name: 'Trần Minh Tuấn', role: 'Quản lý ca trực', highlight: true },
                  { initials: 'TH', name: 'Nguyễn Thu Hà', role: 'Thu ngân POS 01' },
                  { initials: 'QB', name: 'Lê Quốc Bảo', role: 'Barista trưởng' },
                  { initials: 'VA', name: 'Vũ Hoàng Anh', role: 'Phục vụ sàn & Bàn' }
                ].map((staff) => (
                  <div key={staff.name} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-space-sm">
                      <div
                        className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-[13px] ${
                          staff.highlight
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container-highest text-on-surface'
                        }`}
                      >
                        {staff.initials}
                      </div>
                      <div>
                        <span className="font-label-md text-label-md font-bold text-primary block">{staff.name}</span>
                        <span
                          className={`font-label-sm text-label-sm ${
                            staff.highlight ? 'text-secondary font-semibold' : 'text-on-surface-variant'
                          }`}
                        >
                          {staff.role}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                      Đang trực
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Hub Shortcuts */}
            <div className="p-space-xl rounded-xl bg-primary-container text-on-primary shadow-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm font-bold text-on-primary">Lối Tắt Phân Hệ</span>
                <span className="material-symbols-outlined text-secondary-container">hub</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-primary-container">
                Truy cập nhanh chức năng cốt lõi chỉ với một lần chạm
              </p>
              <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                <Link
                  to="/orders/new"
                  className="p-space-md rounded-lg bg-surface-container-lowest text-primary hover:bg-surface transition-all flex flex-col items-center justify-center text-center gap-1 shadow-sm group no-underline"
                >
                  <span className="material-symbols-outlined text-[24px] text-secondary group-hover:scale-110 transition-transform">
                    point_of_sale
                  </span>
                  <span className="font-label-md text-label-md font-bold">Màn Hình POS</span>
                </Link>
                <Link
                  to="/orders"
                  className="p-space-md rounded-lg bg-surface-container-lowest text-primary hover:bg-surface transition-all flex flex-col items-center justify-center text-center gap-1 shadow-sm group no-underline"
                >
                  <span className="material-symbols-outlined text-[24px] text-secondary group-hover:scale-110 transition-transform">
                    restaurant
                  </span>
                  <span className="font-label-md text-label-md font-bold">KDS Bếp &amp; Bar</span>
                </Link>
                <Link
                  to="/inventory"
                  className="p-space-md rounded-lg bg-surface-container-lowest text-primary hover:bg-surface transition-all flex flex-col items-center justify-center text-center gap-1 shadow-sm group no-underline"
                >
                  <span className="material-symbols-outlined text-[24px] text-secondary group-hover:scale-110 transition-transform">
                    inventory
                  </span>
                  <span className="font-label-md text-label-md font-bold">Quản Lý Kho</span>
                </Link>
                <Link
                  to="/reports"
                  className="p-space-md rounded-lg bg-surface-container-lowest text-primary hover:bg-surface transition-all flex flex-col items-center justify-center text-center gap-1 shadow-sm group no-underline"
                >
                  <span className="material-symbols-outlined text-[24px] text-secondary group-hover:scale-110 transition-transform">
                    insights
                  </span>
                  <span className="font-label-md text-label-md font-bold">Báo Cáo Thu</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
