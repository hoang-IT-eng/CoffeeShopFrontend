import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, vnd, when } from '../api';

function tierStyle(level = 'Bronze') {
  const l = level.toLowerCase();
  if (l.includes('diamond') || l.includes('kim')) {
    return {
      label: 'Kim Cương',
      icon: 'diamond',
      badge: 'bg-purple-100 text-[#6B21A8]'
    };
  }
  if (l.includes('gold') || l.includes('vàng')) {
    return {
      label: 'Hạng Vàng',
      icon: 'workspace_premium',
      badge: 'bg-amber-100 text-[#92400E]'
    };
  }
  if (l.includes('silver') || l.includes('bạc')) {
    return {
      label: 'Hạng Bạc',
      icon: 'military_tech',
      badge: 'bg-slate-200 text-slate-700'
    };
  }
  return {
    label: 'Đồng / Member',
    icon: 'shield',
    badge: 'bg-orange-100 text-[#9A3412]'
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  function load(term = '') {
    const query = term ? `?search=${encodeURIComponent(term)}` : '';
    api(`/api/customers${query}`)
      .then(setCustomers)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    load('');
  }, []);

  function triggerToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function remove(customer) {
    if (!window.confirm(`Xóa hội viên "${customer.name}"?`)) return;
    await api(`/api/customers/${customer.id}`, { method: 'DELETE' });
    load();
  }

  const visible = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchText =
      (c.name || '').toLowerCase().includes(q) ||
      (c.phoneNumber || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q);
    if (!matchText) return false;
    if (tierFilter === 'all') return true;
    return (c.membershipLevel || 'Bronze').toLowerCase() === tierFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col w-full">
      {toast && (
        <div className="fixed bottom-12 right-8 z-50 flex items-center gap-space-sm px-space-md py-space-sm rounded-xl bg-primary text-on-primary shadow-xl">
          <span className="material-symbols-outlined text-secondary-container text-[20px]">
            check_circle
          </span>
          <span className="font-label-md text-label-md">{toast}</span>
        </div>
      )}

      <div className="px-margin-desktop py-space-xl flex flex-col gap-space-xl max-w-[1720px] mx-auto w-full">
        {/* 1. BREADCRUMB & PAGE HEADER */}
        <div className="flex flex-col gap-space-sm">
          <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>Quản Trị Cơ Sở</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Khách Hàng &amp; Marketing</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Khách Hàng &amp; Khuyến Mãi</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg pt-1">
            <div className="flex flex-col gap-1 max-w-3xl">
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded-full bg-secondary-container/20 text-on-secondary-container font-label-sm text-label-sm inline-flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                  CRM &amp; Promotion Engine v2.4
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-primary font-bold">
                Quản Lý Hội Viên &amp; Chương Trình Khuyến Mãi
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Quản lý hồ sơ khách hàng thân thiết, hệ thống tích lũy điểm thưởng và cấu hình voucher ưu đãi áp dụng tự động tại quầy POS &amp; Waiter app.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm flex-shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-all flex items-center gap-space-xs shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>Xuất Danh Sách Excel</span>
              </button>
              <Link
                to="/customers/new"
                className="px-space-lg py-space-sm rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md transition-all shadow-md flex items-center gap-space-xs font-bold no-underline"
              >
                <span className="material-symbols-outlined text-secondary-container text-[20px]">
                  person_add
                </span>
                <span>+ Thêm Hội Viên Mới</span>
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-space-md rounded-xl bg-error-container text-on-error-container">
            {error}
          </div>
        )}

        {/* 2. KPI OVERVIEW CARDS (4 CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter-desktop">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[148px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Tổng Hội Viên Hoạt Động
                </span>
                <span className="font-price-display-lg text-price-display-lg text-primary tracking-tight mt-1 font-extrabold">
                  {customers.length}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary-container/15 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">groups</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs pt-space-xs text-on-surface font-label-sm text-label-sm">
              <span className="inline-flex items-center text-on-secondary-container bg-secondary-fixed px-1.5 py-0.5 rounded font-bold text-[11px]">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>+12.5%
              </span>
              <span className="text-on-surface-variant">đồng bộ trực tiếp từ POS</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-container" />
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[148px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Tỷ Lệ Giữ Chân (Retention)
                </span>
                <span className="font-price-display-lg text-price-display-lg text-primary tracking-tight mt-1 font-extrabold">
                  68.4%
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-container text-[24px]">
                  repeat
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs pt-space-xs text-on-surface font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              <span className="text-on-surface-variant font-medium">
                Tần suất ghé: <strong className="text-on-surface font-bold">3.2 lần / tuần</strong>
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-container" />
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[148px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Tổng Chi Tiêu Hội Viên
                </span>
                <span className="font-price-display-lg text-price-display-lg text-primary tracking-tight mt-1 font-extrabold">
                  {vnd(customers.reduce((s, c) => s + Number(c.totalSpent || 0), 0))}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">local_offer</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-space-xs font-label-sm text-label-sm">
              <span className="text-on-surface-variant">
                Tổng điểm tích lũy:{' '}
                <strong className="text-on-surface">
                  {customers.reduce((s, c) => s + Number(c.loyaltyPoints || 0), 0)} điểm
                </strong>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-mono font-bold text-[11px]">
                ROI: 4.2x
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[148px]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Chiến Dịch Đang Chạy
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-price-display-lg text-price-display-lg text-primary tracking-tight font-extrabold">
                    03
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    chương trình
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">
                  notifications_active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs pt-space-xs font-label-sm text-label-sm">
              <span className="px-1.5 py-0.5 rounded-full bg-error-container text-error font-bold text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                Voucher GIAM20K &amp; HAPPYHOUR
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-error" />
          </div>
        </div>

        {/* 4. FLEXIBLE TWO-COLUMN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          {/* LEFT COLUMN: Customer Table & Filters */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row items-center gap-space-sm">
                <div className="relative flex-grow w-full">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    search
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-space-md py-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
                    placeholder="Tìm SĐT (090...), tên khách, email..."
                    type="text"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-space-xs pt-space-xs">
                <div className="flex items-center gap-space-xs flex-wrap">
                  {[
                    { id: 'all', label: `Tất cả (${customers.length})`, dot: '' },
                    { id: 'Diamond', label: 'Kim Cương', dot: 'bg-[#7C3AED]' },
                    { id: 'Gold', label: 'Vàng', dot: 'bg-secondary-container' },
                    { id: 'Silver', label: 'Bạc', dot: 'bg-outline' },
                    { id: 'Bronze', label: 'Đồng / Member', dot: 'bg-on-tertiary-fixed-variant' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTierFilter(t.id)}
                      className={`px-space-md py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                        tierFilter === t.id
                          ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {t.dot && <span className={`w-2 h-2 rounded-full ${t.dot}`} />}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
                <span className="text-on-surface-variant font-label-sm text-label-sm">
                  Đang lọc: <strong>{visible.length}</strong> hồ sơ
                </span>
              </div>
            </div>

            {/* Customer Data Table Container */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
                      <th className="py-space-md px-space-md">Khách Hàng</th>
                      <th className="py-space-md px-space-md">Hạng Thẻ</th>
                      <th className="py-space-md px-space-md">Điểm &amp; Tiền Tích</th>
                      <th className="py-space-md px-space-md">Tổng Chi Tiêu (LTV)</th>
                      <th className="py-space-md px-space-md">Tham Gia</th>
                      <th className="py-space-md px-space-md text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((customer) => {
                      const tier = tierStyle(customer.membershipLevel);
                      const initials = (customer.name || 'KH')
                        .split(' ')
                        .slice(-2)
                        .map((w) => w[0]?.toUpperCase() || '')
                        .join('');
                      return (
                        <tr
                          key={customer.id}
                          className="hover:bg-surface-container-low/60 transition-colors group"
                        >
                          <td className="py-space-md px-space-md">
                            <div className="flex items-center gap-space-sm">
                              <div className="w-10 h-10 rounded-full bg-primary-container text-secondary-container font-headline-sm text-[14px] flex items-center justify-center font-bold shadow-sm">
                                {initials}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-label-md text-label-md text-primary font-bold group-hover:text-secondary transition-colors truncate">
                                  {customer.name}
                                </span>
                                <span className="font-body-sm text-[12px] text-on-surface-variant font-mono">
                                  {customer.phoneNumber}
                                </span>
                                <span className="text-[11px] text-outline">
                                  {customer.email || 'Chưa cập nhật email'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold shadow-xs ${tier.badge}`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {tier.icon}
                              </span>
                              {tier.label}
                            </span>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-primary font-bold">
                                {customer.loyaltyPoints || 0} điểm
                              </span>
                              <span className="font-body-sm text-[12px] text-secondary font-medium">
                                ~ {vnd((customer.loyaltyPoints || 0) * 100)} đổi món
                              </span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-primary font-bold">
                                {vnd(customer.totalSpent)}
                              </span>
                              <span className="font-label-sm text-[11px] text-on-surface-variant">
                                {customer.totalOrders || 1} hóa đơn
                              </span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md font-label-sm text-on-surface-variant">
                            {when(customer.joinDate).slice(0, 10)}
                          </td>
                          <td className="py-space-md px-space-md text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                to={`/customers/${customer.id}`}
                                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors no-underline"
                                title="Chỉnh sửa hồ sơ"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  triggerToast(
                                    `Đã gửi Voucher ưu đãi tới Zalo ${customer.phoneNumber}`
                                  )
                                }
                                className="w-8 h-8 rounded-lg bg-secondary-container/20 hover:bg-secondary-container/40 text-on-secondary-container flex items-center justify-center transition-colors"
                                title="Gửi mã ưu đãi qua Zalo ZNS"
                              >
                                <span className="material-symbols-outlined text-[18px]">send</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(customer)}
                                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-error-container text-error flex items-center justify-center transition-colors"
                                title="Xóa hội viên"
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

            {/* Inline Visual: Membership Growth Sparkline Card */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-secondary-container/15 text-secondary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[28px]">query_stats</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-primary font-bold">
                    Xu Hướng Tích Điểm Tuần Này
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Tích lũy điểm tự động từ mọi giao dịch thanh toán tại quầy POS
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-md w-full sm:w-auto justify-end">
                <svg className="w-36 h-10 text-secondary" fill="none" viewBox="0 0 140 40">
                  <path
                    d="M0 32 L20 28 L40 35 L60 20 L80 24 L100 12 L120 16 L140 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0 32 L20 28 L40 35 L60 20 L80 24 L100 12 L120 16 L140 4 L140 40 L0 40 Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                </svg>
                <div className="flex flex-col text-right">
                  <span className="font-label-md text-label-md text-primary font-bold">+18.4%</span>
                  <span className="text-[11px] text-secondary">Tốc độ quy đổi</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Active Promos & Fast Point Settings */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse" />
                  <h2 className="font-headline-sm text-[18px] text-primary font-bold">
                    Khuyến Mãi Đang Hiệu Lực
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-[11px] font-bold">
                  3/6 Đang Chạy
                </span>
              </div>

              <div className="flex flex-col gap-space-sm">
                <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-mono text-[12px] font-bold tracking-wider">
                      GIAM20K
                    </span>
                    <span className="text-error font-label-sm text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span> Còn 2
                      ngày
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      Giảm 20.000đ cho đơn từ 99.000đ
                    </span>
                    <span className="font-body-sm text-[13px] text-on-surface-variant">
                      Áp dụng toàn thực đơn cà phê hạt &amp; Cold Brew
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        Tiến độ sử dụng
                      </span>
                      <span className="font-bold text-primary">142 / 300 lượt</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-variant overflow-hidden">
                      <div
                        className="h-full bg-secondary-container rounded-full"
                        style={{ width: '47.3%' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono text-[12px] font-bold tracking-wider">
                      HAPPYHOUR
                    </span>
                    <span className="text-on-secondary-container font-label-sm text-[11px] font-bold flex items-center gap-1 bg-secondary-fixed px-1.5 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[14px]">bolt</span> 14:00 -
                      17:00
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      Giảm 15% đồ uống chiều (T2 - T6)
                    </span>
                    <span className="font-body-sm text-[13px] text-on-surface-variant">
                      Tự động kích hoạt trên POS &amp; KDS máy thu ngân
                    </span>
                  </div>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-mono text-[12px] font-bold tracking-wider">
                      TANG-CROISSANT
                    </span>
                    <span className="text-on-surface font-label-sm text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        bakery_dining
                      </span>{' '}
                      Quà tặng
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      Tặng 01 Croissant Bơ Pháp
                    </span>
                    <span className="font-body-sm text-[13px] text-on-surface-variant">
                      Khi mua combo 2 ly Cà phê muối bất kỳ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCK 2: Fast Loyalty & Points Rules Config */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  settings_suggest
                </span>
                <h2 className="font-headline-sm text-[18px] text-primary font-bold">
                  Cấu Hình Nhanh Tích Điểm
                </h2>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Quy tắc tích lũy hiện hành:
                </span>
                <div className="flex items-center justify-between p-space-xs rounded-lg bg-surface-container-lowest font-mono text-[13px]">
                  <span className="font-bold text-primary">10.000đ chi tiêu</span>
                  <span className="material-symbols-outlined text-outline text-[16px]">
                    trending_flat
                  </span>
                  <span className="font-bold text-secondary">1 Điểm (100đ)</span>
                </div>
              </div>

              <div className="flex flex-col gap-space-sm">
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  Đặc quyền nâng hạng:
                </span>
                <div className="p-space-sm rounded-lg bg-amber-50/70 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-amber-900 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-amber-600">
                        stars
                      </span>
                      Hạng Vàng (&gt; 2.000.000đ)
                    </span>
                    <span className="text-[11px] text-amber-800 font-bold">-5% All Orders</span>
                  </div>
                </div>
                <div className="p-space-sm rounded-lg bg-purple-50/70 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-purple-900 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-purple-600">
                        diamond
                      </span>
                      Hạng Kim Cương (&gt; 4.000.000đ)
                    </span>
                    <span className="text-[11px] text-purple-800 font-bold">
                      -10% + Free Upsize
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
