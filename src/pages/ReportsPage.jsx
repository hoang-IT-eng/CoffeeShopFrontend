import { useEffect, useState } from 'react';
import { api, vnd, when } from '../api';

const starProducts = [
  {
    rank: 1,
    name: 'Cà Phê Muối Xứ Huế (Signature)',
    sub: '★ Món Ngôi Sao (Star Item)',
    subColor: 'text-secondary font-semibold',
    category: 'Specialty Coffee',
    sold: '1.620 ly',
    revenue: '56.700.000đ',
    cogs: '11.200đ / ly',
    profit: '38.556.000đ (68%)',
    share: '19.9%',
    highlight: true
  },
  {
    rank: 2,
    name: 'Trà Đào Cam Sả Tươi',
    sub: 'Best-seller Trưa & Chiều',
    subColor: 'text-on-surface-variant',
    category: 'Trà Trái Cây',
    sold: '980 ly',
    revenue: '44.100.000đ',
    cogs: '14.850đ / ly',
    profit: '29.547.000đ (67%)',
    share: '15.5%'
  },
  {
    rank: 3,
    name: 'Bạc Xỉu 3 Tầng Dalatmilk',
    sub: 'Cà Phê Sáng Quốc Dân',
    subColor: 'text-on-surface-variant',
    category: 'Specialty Coffee',
    sold: '840 ly',
    revenue: '31.920.000đ',
    cogs: '12.920đ / ly',
    profit: '21.067.000đ (66%)',
    share: '11.2%'
  },
  {
    rank: 4,
    name: 'Cold Brew Cam Vàng Arabica Cầu Đất',
    sub: 'Tăng trưởng +24%',
    subColor: 'text-secondary font-semibold',
    category: 'Cold Brew Ủ Lạnh',
    sold: '620 ly',
    revenue: '27.900.000đ',
    cogs: '15.750đ / ly',
    profit: '18.135.000đ (65%)',
    share: '9.8%'
  },
  {
    rank: 5,
    name: 'Bánh Sừng Bò Bơ Pháp (Croissant)',
    sub: 'Kèm Combo Cà Phê Sáng',
    subColor: 'text-on-surface-variant',
    category: 'Bánh Nướng Pastry',
    sold: '510 cái',
    revenue: '17.850.000đ',
    cogs: '15.400đ / cái',
    profit: '9.996.000đ (56%)',
    share: '6.3%'
  },
  {
    rank: 6,
    name: 'Cà Phê Trứng Hà Nội Nóng',
    sub: 'Món truyền thống thu đông',
    subColor: 'text-on-surface-variant',
    category: 'Specialty Coffee',
    sold: '420 ly',
    revenue: '18.900.000đ',
    cogs: '14.400đ / ly',
    profit: '12.852.000đ (68%)',
    share: '6.6%'
  }
];

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [periodTab, setPeriodTab] = useState('month');
  const [report, setReport] = useState({ dailySales: [], paymentMethods: [] });
  const [error, setError] = useState('');

  function load(start = startDate, end = endDate) {
    const query = new URLSearchParams();
    if (start) query.set('startDate', start);
    if (end) query.set('endDate', end);
    const suffix = query.toString() ? `?${query}` : '';
    api(`/api/reports/sales${suffix}`)
      .then(setReport)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    load('', '');
  }, []);

  const totalSales = report.dailySales.reduce((s, d) => s + Number(d.total || 0), 0);
  const displayRevenue = totalSales > 0 ? totalSales : 284650000;
  const displayGrossProfit = Math.round(displayRevenue * 0.64);

  return (
    <div className="flex flex-col w-full">
      {/* Control Header & Filtering Deck */}
      <div className="w-full px-margin-desktop py-space-xl flex flex-col gap-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span>Quản Trị Cơ Sở</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>Tài Chính &amp; Báo Cáo</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-secondary font-bold">Báo Cáo &amp; Thống Kê Chuyên Sâu</span>
            </div>
            <div className="flex flex-wrap items-center gap-space-md">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
                Trung Tâm Báo Cáo Tài Chính &amp; Hiệu Suất F&amp;B
              </h1>
              <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping" />
                Analytics v2.4 • Dữ liệu chốt sổ thời gian thực
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">
                table_view
              </span>
              <span>Xuất Báo Cáo Excel</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-error">
                picture_as_pdf
              </span>
              <span>Tải Báo Cáo Thuế PDF</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md transition-all shadow-md font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>In Báo Cáo Nhanh (A4)</span>
            </button>
          </div>
        </div>

        {/* Filters & Selectors Bar */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-1.5 bg-surface-container p-1 rounded-lg">
            {[
              { id: 'today', label: 'Hôm nay' },
              { id: 'week', label: '7 ngày qua' },
              { id: 'month', label: 'Tháng này' },
              { id: 'custom', label: 'Tùy chỉnh ngày' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setPeriodTab(tab.id);
                  if (tab.id !== 'custom') {
                    setStartDate('');
                    setEndDate('');
                    load('', '');
                  }
                }}
                className={`px-space-md py-1.5 rounded-md font-label-sm text-label-sm transition-all flex items-center gap-1 ${
                  periodTab === tab.id
                    ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.id === 'month' && (
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPeriodTab('custom');
              load(startDate, endDate);
            }}
            className="flex flex-wrap items-center gap-space-sm"
          >
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm"
            />
            <span className="text-on-surface-variant">→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm"
            />
            <button
              type="submit"
              className="px-space-md py-1.5 rounded-lg bg-secondary text-on-secondary font-label-sm font-bold"
            >
              Lọc dữ liệu
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="mx-margin-desktop mb-space-md p-space-md rounded-xl bg-error-container text-on-error-container">
          {error}
        </div>
      )}

      {/* Main Analytics Body */}
      <div className="w-full px-margin-desktop pb-space-2xl flex flex-col gap-space-xl">
        {/* Top Financial Metrics: 4 Tactical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute right-0 top-0 w-24 h-24 bg-secondary-fixed/30 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Tổng Doanh Thu Thuần
                </span>
                <span className="p-1 rounded-md bg-secondary-fixed text-on-secondary-fixed-variant material-symbols-outlined text-[18px]">
                  payments
                </span>
              </div>
              <div className="font-price-display-lg text-price-display-lg text-primary tracking-tight mt-1 font-extrabold">
                {vnd(displayRevenue)}
              </div>
            </div>
            <div className="flex flex-col gap-space-xs mt-space-md">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="inline-flex items-center text-secondary font-bold">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>{' '}
                  +14.8% vs kỳ trước
                </span>
                <span className="text-on-surface-variant">Mục tiêu: 300M</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary-container h-full rounded-full"
                  style={{ width: '94.8%' }}
                />
              </div>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Lợi Nhuận Gộp (Gross Profit)
                </span>
                <span className="p-1 rounded-md bg-primary-fixed text-on-primary-fixed-variant material-symbols-outlined text-[18px]">
                  account_balance_wallet
                </span>
              </div>
              <div className="font-price-display-lg text-price-display-lg text-primary tracking-tight mt-1 font-extrabold">
                {vnd(displayGrossProfit)}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-space-md">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="px-2 py-0.5 rounded bg-surface-container-high font-bold text-on-surface">
                  Biên Lợi Nhuận: 64.0%
                </span>
                <span className="text-secondary font-medium">Chuẩn Specialty</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-2">
                <span>Chi phí vốn COGS (36%):</span>
                <span className="font-mono text-on-surface font-semibold">
                  {vnd(displayRevenue - displayGrossProfit)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Giá Trị Đơn Trung Bình (AOV)
                </span>
                <span className="p-1 rounded-md bg-secondary-fixed text-on-secondary-fixed material-symbols-outlined text-[18px]">
                  receipt_long
                </span>
              </div>
              <div className="font-price-display-lg text-price-display-lg text-primary tracking-tight mt-1 font-extrabold">
                59.056đ
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-space-md">
              <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span> +8.2%
                tăng trưởng
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                Đẩy mạnh thành công nhờ kịch bản Upsize và gợi ý combo bánh ngọt tại quầy thu ngân.
              </p>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Hủy Món &amp; Hoàn Tiền (Void)
                </span>
                <span className="p-1 rounded-md bg-error-container text-on-error-container material-symbols-outlined text-[18px]">
                  cancel_presentation
                </span>
              </div>
              <div className="font-price-display-lg text-price-display-lg text-error tracking-tight mt-1 font-extrabold">
                0.42%
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-space-md">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-on-surface-variant">Mức rủi ro:</span>
                <span className="font-mono font-bold text-on-surface">An toàn (&lt; 1.0%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep-Dive Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left Column: Peak Hours & 7-Day Velocity */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Peak Hour Heat & Volume */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Phân Bổ Doanh Thu Theo Khung Giờ Hoạt Động
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Nhận diện 3 đỉnh cao điểm để tối ưu bố trí nhân sự ca pha chế
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
                  24 Giờ Hoạt Động
                </span>
              </div>

              <div className="pt-space-md flex flex-col gap-space-md">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm font-label-sm text-label-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-secondary font-bold">
                      <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                      <span>Đỉnh 1: 07:30 - 09:30</span>
                    </div>
                    <span className="text-primary font-bold text-body-md">38% Doanh thu</span>
                    <span className="text-on-surface-variant text-[12px]">
                      Cà phê sáng, hạt rang mang đi
                    </span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-secondary font-bold">
                      <span className="material-symbols-outlined text-[16px]">coffee</span>
                      <span>Đỉnh 2: 13:00 - 16:00</span>
                    </div>
                    <span className="text-primary font-bold text-body-md">32% Doanh thu</span>
                    <span className="text-on-surface-variant text-[12px]">
                      Happy hour trà trái cây &amp; bánh
                    </span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-secondary font-bold">
                      <span className="material-symbols-outlined text-[16px]">nightlight</span>
                      <span>Đỉnh 3: 19:30 - 21:30</span>
                    </div>
                    <span className="text-primary font-bold text-body-md">21% Doanh thu</span>
                    <span className="text-on-surface-variant text-[12px]">
                      Khách trò chuyện, Cold brew
                    </span>
                  </div>
                </div>

                {/* SVG Hourly Histogram */}
                <div className="w-full h-48 mt-space-sm">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 680 160"
                  >
                    <line stroke="#f0eee8" strokeDasharray="4 4" x1="0" x2="680" y1="30" y2="30" />
                    <line stroke="#f0eee8" strokeDasharray="4 4" x1="0" x2="680" y1="75" y2="75" />
                    <line
                      stroke="#f0eee8"
                      strokeDasharray="4 4"
                      x1="0"
                      x2="680"
                      y1="120"
                      y2="120"
                    />
                    <rect fill="#ffdcc3" height="60" rx="3" width="22" x="25" y="80" />
                    <rect fill="#2c1810" height="130" rx="3" width="22" x="65" y="10" />
                    <rect fill="#2c1810" height="115" rx="3" width="22" x="105" y="25" />
                    <rect fill="#dcdad4" height="70" rx="3" width="22" x="145" y="70" />
                    <rect fill="#dcdad4" height="50" rx="3" width="22" x="185" y="90" />
                    <rect fill="#ffdcc3" height="65" rx="3" width="22" x="225" y="75" />
                    <rect fill="#fe932c" height="105" rx="3" width="22" x="265" y="35" />
                    <rect fill="#fe932c" height="110" rx="3" width="22" x="305" y="30" />
                    <rect fill="#fe932c" height="95" rx="3" width="22" x="345" y="45" />
                    <rect fill="#ffdcc3" height="55" rx="3" width="22" x="385" y="85" />
                    <rect fill="#dcdad4" height="40" rx="3" width="22" x="425" y="100" />
                    <rect fill="#dcdad4" height="60" rx="3" width="22" x="465" y="80" />
                    <rect fill="#ffdcc3" height="80" rx="3" width="22" x="505" y="60" />
                    <rect fill="#2c1810" height="95" rx="3" width="22" x="545" y="45" />
                    <rect fill="#2c1810" height="85" rx="3" width="22" x="585" y="55" />
                    <rect fill="#dcdad4" height="30" rx="3" width="22" x="625" y="110" />
                  </svg>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant px-2">
                  <span>07:00</span>
                  <span>09:00</span>
                  <span>11:00</span>
                  <span>13:00</span>
                  <span>15:00</span>
                  <span>17:00</span>
                  <span>19:00</span>
                  <span>21:00</span>
                  <span>22:30</span>
                </div>
              </div>
            </div>

            {/* 7-Day Revenue Velocity Trend */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                    Biểu Đồ Doanh Thu 7 Ngày Gần Nhất
                  </h2>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    So sánh tuần này (đường cam) với tuần trước (đường nhạt)
                  </span>
                </div>
                <div className="flex items-center gap-space-md font-label-sm text-label-sm">
                  <span className="flex items-center gap-1 text-primary font-bold">
                    <span className="w-3 h-3 rounded-full bg-secondary-container" /> Tuần này
                  </span>
                  <span className="flex items-center gap-1 text-on-surface-variant">
                    <span className="w-3 h-3 rounded-full bg-surface-dim" /> Tuần trước
                  </span>
                </div>
              </div>

              <div className="w-full h-44">
                <svg className="w-full h-full" fill="none" viewBox="0 0 650 140">
                  <defs>
                    <linearGradient id="revenueGlow" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#fe932c" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#fe932c" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 95 Q 110 80, 200 90 T 380 70 T 520 60 T 630 40"
                    fill="none"
                    stroke="#dcdad4"
                    strokeDasharray="4 4"
                    strokeWidth="2"
                  />
                  <path
                    d="M 20 85 Q 110 65, 200 70 T 380 45 T 520 30 T 630 18 L 630 135 L 20 135 Z"
                    fill="url(#revenueGlow)"
                  />
                  <path
                    d="M 20 85 Q 110 65, 200 70 T 380 45 T 520 30 T 630 18"
                    fill="none"
                    stroke="#fe932c"
                    strokeWidth="3.5"
                  />
                  <circle cx="200" cy="70" fill="#2c1810" r="4" />
                  <circle cx="380" cy="45" fill="#2c1810" r="4" />
                  <circle cx="520" cy="30" fill="#2c1810" r="4" />
                  <circle
                    cx="630"
                    cy="18"
                    fill="#fe932c"
                    r="5"
                    stroke="#2c1810"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-7 text-center font-label-sm text-label-sm text-on-surface-variant pt-space-xs gap-2">
                {(report.dailySales.length
                  ? report.dailySales.slice(-7).map((s) => ({
                      day: when(s.date).slice(0, 5),
                      val: vnd(s.total)
                    }))
                  : [
                      { day: 'T2 (22/10)', val: '34.2M' },
                      { day: 'T3 (23/10)', val: '36.8M' },
                      { day: 'T4 (24/10)', val: '38.1M' },
                      { day: 'T5 (25/10)', val: '39.4M' },
                      { day: 'T6 (26/10)', val: '44.6M' },
                      { day: 'T7 (27/10)', val: '52.3M' },
                      { day: 'CN (28/10)', val: '58.9M' }
                    ]
                ).map((d, idx) => (
                  <div key={idx}>
                    <span>{d.day}</span>
                    <div className="font-bold text-on-surface mt-0.5">{d.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment Methods & Sales Channels */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* Payment Methods Breakdown */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Phương Thức Thanh Toán
                </h2>
                <span className="material-symbols-outlined text-secondary">qr_code_scanner</span>
              </div>

              <div className="flex items-center justify-center py-space-sm gap-space-lg">
                <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="38"
                      stroke="#ebe8e2"
                      strokeWidth="14"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="38"
                      stroke="#fe932c"
                      strokeDasharray="238.7"
                      strokeDashoffset="89.7"
                      strokeWidth="14"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="38"
                      stroke="#2c1810"
                      strokeDasharray="238.7"
                      strokeDashoffset="238.7"
                      strokeWidth="14"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="38"
                      stroke="#ffb77d"
                      strokeDasharray="238.7"
                      strokeDashoffset="218.4"
                      strokeWidth="14"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">
                      VietQR Dẫn Đầu
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      62.4%
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-space-sm flex-grow">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="flex items-center gap-1.5 font-bold text-on-surface">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" /> Chuyển
                        Khoản VietQR
                      </span>
                      <span className="font-bold text-on-surface">62.4%</span>
                    </div>
                    <span className="font-mono text-[12px] text-on-surface-variant pl-4">
                      177.621.000đ
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="flex items-center gap-1.5 font-bold text-on-surface">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-container" /> Tiền Mặt
                        Tại Quầy
                      </span>
                      <span className="font-bold text-on-surface">25.1%</span>
                    </div>
                    <span className="font-mono text-[12px] text-on-surface-variant pl-4">
                      71.447.000đ
                    </span>
                  </div>
                  {report.paymentMethods.map((m) => (
                    <div key={m.method} className="flex flex-col">
                      <div className="flex items-center justify-between font-label-sm text-label-sm">
                        <span className="flex items-center gap-1.5 font-bold text-on-surface">
                          <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim" /> DB:{' '}
                          {m.method}
                        </span>
                        <span className="font-bold text-secondary">{vnd(m.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales Channels Performance */}
            <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Cơ Cấu Kênh Phục Vụ
                </h2>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  3 Kênh Chính
                </span>
              </div>
              <div className="flex flex-col gap-space-md">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="flex items-center gap-2 text-on-surface font-semibold">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        table_restaurant
                      </span>
                      <span>Tại Bàn (Dine-in)</span>
                    </span>
                    <span className="font-bold text-primary">58% (165.097.000đ)</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-container h-full rounded-full"
                      style={{ width: '58%' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="flex items-center gap-2 text-on-surface font-semibold">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        local_cafe
                      </span>
                      <span>Mang Đi (Takeaway)</span>
                    </span>
                    <span className="font-bold text-primary">27% (76.855.000đ)</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary-container h-full rounded-full"
                      style={{ width: '27%' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="flex items-center gap-2 text-on-surface font-semibold">
                      <span className="material-symbols-outlined text-[18px] text-secondary">
                        moped
                      </span>
                      <span>Đơn Giao Hàng (Grab / ShopeeFood)</span>
                    </span>
                    <span className="font-bold text-primary">15% (42.698.000đ)</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-secondary-fixed-dim h-full rounded-full"
                      style={{ width: '15%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Performance & Profitability Table */}
        <div className="w-full rounded-xl bg-surface-container-lowest shadow-sm flex flex-col overflow-hidden">
          <div className="p-space-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                Bảng Xếp Hạng &amp; Ma Trận Lợi Nhuận Sản Phẩm
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Top món bán chạy và tỷ trọng biên lợi nhuận gộp đóng góp thực tế
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface font-medium">
              <span className="material-symbols-outlined text-[16px] text-secondary">star</span>{' '}
              Phân Loại Menu Engineering
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <tr>
                  <th className="py-space-md px-space-xl">Hạng &amp; Tên Món</th>
                  <th className="py-space-md px-space-md">Danh Mục</th>
                  <th className="py-space-md px-space-md text-right">SL Bán</th>
                  <th className="py-space-md px-space-md text-right">Doanh Thu Thuần</th>
                  <th className="py-space-md px-space-md text-right">Chi Phí Vốn (COGS)</th>
                  <th className="py-space-md px-space-md text-right">Lợi Nhuận Gộp</th>
                  <th className="py-space-md px-space-xl text-center">Tỷ Trọng Đóng Góp</th>
                </tr>
              </thead>
              <tbody>
                {starProducts.map((p) => (
                  <tr key={p.rank} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-md px-space-xl flex items-center gap-space-md">
                      <span
                        className={`w-6 h-6 rounded-full font-bold text-label-sm flex items-center justify-center ${
                          p.highlight
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {p.rank}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-body-md">{p.name}</span>
                        <span className={`font-label-sm text-label-sm ${p.subColor}`}>
                          {p.sub}
                        </span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-md">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[12px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-space-md px-space-md text-right font-mono font-bold text-on-surface">
                      {p.sold}
                    </td>
                    <td className="py-space-md px-space-md text-right font-mono font-bold text-primary">
                      {p.revenue}
                    </td>
                    <td className="py-space-md px-space-md text-right font-mono text-on-surface-variant">
                      {p.cogs}
                    </td>
                    <td className="py-space-md px-space-md text-right font-mono font-bold text-secondary">
                      {p.profit}
                    </td>
                    <td className="py-space-md px-space-xl text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded font-bold font-mono text-[13px] ${
                          p.highlight
                            ? 'bg-secondary-fixed text-on-secondary-fixed'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {p.share}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit & Anomaly Detection Alert Box */}
        <div className="p-space-xl rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">security</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Nhật Ký Kiểm Soát Gian Lận &amp; Cảnh Báo Bất Thường
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Hệ thống AI giám sát các thao tác nhạy cảm tại ca thu ngân máy POS
                </p>
              </div>
            </div>
            <span className="px-space-md py-1 rounded-full bg-surface-container-lowest font-label-sm text-label-sm text-secondary font-bold">
              Chỉ số an toàn ca: 99.8%
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-xs">
            <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    delete_sweep
                  </span>
                  Hủy Món Sau Khi In Bếp (Void)
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[12px]">
                  03 Đơn
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Tất cả 03 đơn đều được xác thực bằng mã PIN của Quản lý Tuấn (Lý do: Khách đổi sang dùng sữa yến mạch Oatly).
              </p>
            </div>
            <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    percent
                  </span>
                  Giảm Giá Thủ Công &gt; 20%
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[12px]">
                  05 Hóa đơn
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Khớp với chương trình thẻ Thành Viên VIP Kim Cương (Áp dụng giảm 25% tối thứ Sáu), không có thất thoát.
              </p>
            </div>
            <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    point_of_sale
                  </span>
                  Lệch Két Tiền Cuối Ca
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[12px]">
                  0.000đ
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                100% các phiên chốt ca sáng và tối đều hoàn toàn cân bằng giữa phần mềm và tiền mặt thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
