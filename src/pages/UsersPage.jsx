import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

const staffAvatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAbibmWYGEeuLScBHPn8vqNGCWn-R6ggfyXaRouAvRTZSvr5jsSynd8cRhJErxRDyTMoMcP6m9SKUwKEcgR_brpp354IDoi_UwAmkV2sinUW3SwD8l2pam2g11lYlr_ayfyeRHb8ulujIpH-P5p3TbEbBvq7x-pV5ZgAHuDQwo0wov77sT5oNmqdp5jbPYk7AR9n6PkdtkiEnlzbX2uavKkEPOttpM5FTyAf89xm5PJYRrHTePtHW1P9A',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCciQ3w-kn-7tUjH2ANUEI9s7Oq8zPWr-ZdEm186EhCqmltRgbTm-QDHpvSrhSHEmYI23eczy9qEW6T6CMIQBcdJGk0aR6ItzoIRvOzDWrqp75nLjyiITqnjhYc1scQWGh7Ma8Xq_dwnbGDaE7psdF_2D0XloTHk0C-xRayCEki2WlnNU5ns8S9_gCkCbBWacE-o5eeQ6mS8DAAlgrl9VCsgf6mZl_AOfhYWZqS2qWqU3xx85b5wgFEeA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCNjihMa_JzBwkffJMvJRVLjs6F4vp0wVfb1iry3gYRhx_pzFYCYahaX_wgc2VplZ3sA3J0a21EpS6Iy6Y6JOhQcVUrOyI9VznTHyw095U4mHOipu1lA5h9mGhuEG-8ZPYKfraepmbxGpe-soHTxs7Um8GL3L5sYNFJMdnZdjy_pSbF7vWLbxrx4om85hvblK_Ch1g4a7ityYTXLMO-QoAFc5vHiK25xRAzkY1IGOIUuKJ9JRM86Zo3bg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgO68gCWcl04Imw0ZZ0ssCLHfru62PhQfjisWBkVqq3ytx1-t0nz_N_dpFaBkSZP0pZFKS0LKXPaLfxkQcUz5CFkMJWTByUhYDMh4RLtIwNVckqDrsFB0H_bGw8l9OdfrbWv38XBoKdPH07BLn_bQlGnk1-C4FvhVva0V3y_i35OZIkkNTvyGYsUZc2qSHmhecX8qIOfxEhXNvo4e4o4T89Qw5Ert3_j0tFjIXroDyRxGjbWpsGoiGfA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDMT-_K1Ti9BeKVWkzyu37twFrDQ7m5rk644mAs6TKW4u5CVrGhKODyxH1i4X_FzxkNEJqLdMle3tSzln9GERHSvLoa9nyAbngvvfA287Uh_CGRdeLU1FgQmpmtWDvgWlNPTX-qNW3EDHvT9zb_e4lSJv5XlZHm6IJha7-nmaIk40q0TNV_-ouPwkI1kGvoiAWsOYonLieBc0m9o2d3FsXJKxL2YyPsQ_Sf6OEW5Wa2xBPYZrzEZZJ4gQ'
];

const roleMeta = {
  Admin: {
    label: 'Quản lý trưởng',
    icon: 'military_tech',
    badgeClass: 'bg-primary text-on-primary',
    desc: 'Toàn quyền hệ thống & két',
    shift: 'Ca Sáng (06:30 - 14:30)',
    shiftSub: 'Đang trực • Vào lúc 06:25',
    attendance: '24.5 / 26 công',
    kpi: 'Phụ trách: 100% KPI'
  },
  Cashier: {
    label: 'Thu Ngân (Cashier)',
    icon: 'point_of_sale',
    badgeClass: 'bg-secondary-fixed text-on-secondary-fixed',
    desc: 'POS, Mở/Đóng Két, Giảm giá <10%',
    shift: 'Ca Sáng (06:30 - 14:30)',
    shiftSub: 'Đang trực • Quầy thanh toán 01',
    attendance: '23.0 / 26 công',
    kpi: 'Doanh số két: 142.5M'
  },
  Waiter: {
    label: 'Waiter / Phục Vụ',
    icon: 'room_service',
    badgeClass: 'bg-surface-container-highest text-primary',
    desc: 'Order bàn, KDS & Sơ đồ phòng',
    shift: 'Ca Chiều (14:00 - 22:30)',
    shiftSub: 'Đang trực • Sảnh tầng 1 & 2',
    attendance: '21.5 / 26 công',
    kpi: 'Đánh giá sao: 4.9/5'
  }
};

export default function UsersPage() {
  const [data, setData] = useState({ users: [], roles: [] });
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Waiter'
  });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function load() {
    api('/api/users')
      .then(setData)
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  const visible = useMemo(
    () =>
      data.users.filter((user) => {
        const role = user.roles?.[0] || 'Waiter';
        const matchesRole = filter === 'all' || role === filter;
        const text = `${user.fullName || ''} ${user.email || ''}`.toLowerCase();
        return matchesRole && text.includes(query.toLowerCase());
      }),
    [data.users, filter, query]
  );

  async function create(event) {
    event.preventDefault();
    setError('');
    try {
      await api('/api/users', { method: 'POST', body: form });
      setForm({ fullName: '', email: '', password: '', role: 'Waiter' });
      setMessage('Đã thêm nhân viên mới vào hệ thống.');
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function assign(id, status) {
    await api(`/api/users/${id}/role`, { method: 'POST', body: { status } });
    load();
  }

  return (
    <div className="flex flex-col w-full">
      {/* Notification Banner / Micro Status */}
      <div className="w-full bg-surface-container-high px-margin-desktop py-space-xs flex flex-wrap items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
        <div className="flex items-center gap-space-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
          </span>
          <span className="font-medium text-on-surface">Chi nhánh Trung Tâm (HCM-01)</span>
          <span className="text-outline-variant">•</span>
          <span>
            Đồng bộ máy chấm công vân tay &amp; FaceID: <strong>3 phút trước</strong>
          </span>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            Máy POS Quầy chính: Online
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px]">shield_person</span>
            Cấp độ phân quyền: Admin Branch Manager
          </span>
        </div>
      </div>

      <div className="w-full px-margin-desktop py-space-xl flex flex-col gap-space-xl max-w-[1680px] mx-auto">
        {/* Breadcrumb & Top Action Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span>Quản Trị Cơ Sở</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>Nhân Sự &amp; Vận Hành</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-bold">Quản Lý Nhân Viên &amp; Ca</span>
            </nav>
            <div className="flex items-center gap-space-sm mt-space-xs">
              <span className="px-space-sm py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm tracking-wide">
                HR &amp; Shift Attendance v2.4
              </span>
              <span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                Chi nhánh hoạt động bình thường
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-space-xs font-bold">
              Quản Lý Nhân Viên &amp; Ca Trực
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Theo dõi danh sách nhân sự, phân quyền vai trò (Admin, Thu ngân, Pha chế, Phục vụ), quản lý lịch ca trực và đối soát chốt tiền két bàn giao ca tại chỗ.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-space-sm">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-label-md text-label-md flex items-center gap-space-xs shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">
                file_download
              </span>
              <span>Xuất Bảng Chấm Công</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md flex items-center gap-space-xs shadow-md transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary-container">
                person_add
              </span>
              <span className="font-bold">+ Thêm Nhân Viên Mới</span>
            </button>
          </div>
        </div>

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

        {open && (
          <form
            onSubmit={create}
            className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-lg border border-secondary/30 flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-primary font-bold">
                Tạo Tài Khoản Nhân Sự Mới
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-on-surface-variant hover:text-error"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Họ và tên nhân viên"
                className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none"
                required
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email đăng nhập POS"
                className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none"
                required
              />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mật khẩu (tối thiểu 6 ký tự, có số)"
                className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none"
                required
              />
              <div className="flex gap-space-xs">
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="flex-1 px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-label-md font-bold"
                >
                  {(data.roles.length ? data.roles : ['Admin', 'Cashier', 'Waiter']).map((r) => (
                    <option key={r} value={r}>
                      {roleMeta[r]?.label || r}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-space-lg py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md font-bold shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 4 High-Contrast KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[26px]">group</span>
              </div>
              <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                Hoạt động tốt
              </span>
            </div>
            <div className="mt-space-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                Tổng nhân sự đang làm
              </span>
              <div className="flex items-baseline gap-space-xs mt-0.5">
                <span className="font-price-display-lg text-price-display-lg text-primary font-extrabold">
                  {data.users.length}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant font-normal">
                  nhân sự
                </span>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                <span>
                  Admin:{' '}
                  <strong className="text-primary">
                    {data.users.filter((u) => u.roles?.includes('Admin')).length}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Vận hành:{' '}
                  <strong className="text-secondary">
                    {data.users.filter((u) => !u.roles?.includes('Admin')).length}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[26px]">badge</span>
              </div>
              <span className="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold">
                Ca Sáng
              </span>
            </div>
            <div className="mt-space-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                Đang Trong Ca Trực (Hôm nay)
              </span>
              <div className="flex items-baseline gap-space-xs mt-0.5">
                <span className="font-price-display-lg text-price-display-lg text-secondary font-extrabold">
                  {String(data.users.length).padStart(2, '0')}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant font-normal">
                  nhân sự check-in
                </span>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                <span>
                  Khung giờ: <strong>07:00 - 15:30</strong>
                </span>
                <span className="text-secondary font-semibold">Đủ quân số</span>
              </div>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[26px]">payments</span>
              </div>
              <span className="px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                18.2% Doanh Thu
              </span>
            </div>
            <div className="mt-space-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                Quỹ Lương Dự Kiến Tháng
              </span>
              <div className="flex items-baseline gap-space-xs mt-0.5">
                <span className="font-price-display-md text-price-display-md text-primary font-extrabold">
                  68.400.000
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">VND</span>
              </div>
              <div className="mt-space-xs pt-space-xs text-on-surface-variant font-body-sm text-body-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  check_circle
                </span>
                <span>Tối ưu tiêu chuẩn F&amp;B (&lt; 20%)</span>
              </div>
            </div>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[26px]">point_of_sale</span>
              </div>
              <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed-dim text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                100% Khớp
              </span>
            </div>
            <div className="mt-space-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider">
                Chênh Lệch Két Ca Gần Nhất
              </span>
              <div className="flex items-baseline gap-space-xs mt-0.5">
                <span className="font-price-display-lg text-price-display-lg text-primary font-extrabold">
                  0
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">VND</span>
              </div>
              <div className="mt-space-xs pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <span>Ca Chiều qua: Khớp VietQR &amp; Tiền mặt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content 2-Column Split Master-Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column: Master Staff List & Permissions Table */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center p-1 rounded-lg bg-surface-container-high w-full sm:w-auto">
                <button
                  type="button"
                  className="flex-1 sm:flex-initial px-space-md py-space-xs rounded-md bg-surface-container-lowest text-primary shadow-sm font-label-md text-label-md font-bold flex items-center justify-center gap-space-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  <span>Danh Sách Nhân Viên &amp; Phân Quyền</span>
                </button>
              </div>
              <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end text-on-surface-variant font-label-sm text-label-sm">
                <span>
                  Hiển thị: <strong>{visible.length} / {data.users.length}</strong> nhân viên
                </span>
                <button
                  type="button"
                  onClick={load}
                  className="p-space-xs rounded hover:bg-surface-container-high transition-colors text-primary"
                  title="Làm mới danh sách"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-space-md">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    search
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-11 pr-space-md py-space-sm rounded-lg bg-surface-container text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                    placeholder="Tìm theo tên, email hoặc mã nhân viên..."
                    type="text"
                  />
                </div>
              </div>

              <div className="flex items-center gap-space-xs overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: `Tất cả (${data.users.length})` },
                  { id: 'Admin', label: 'Quản lý / Giám sát' },
                  { id: 'Cashier', label: 'Thu ngân / Cashier' },
                  { id: 'Waiter', label: 'Waiter / Pha chế & Phục vụ' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`px-space-md py-1.5 rounded-full font-label-sm text-label-sm flex-shrink-0 transition-all ${
                      filter === f.id
                        ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Data Table */}
            <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                      <th className="py-space-md px-space-lg font-semibold">Nhân viên</th>
                      <th className="py-space-md px-space-md font-semibold">
                        Vai trò &amp; Phân quyền
                      </th>
                      <th className="py-space-md px-space-md font-semibold">Ca trực hôm nay</th>
                      <th className="py-space-md px-space-md font-semibold">Công tháng</th>
                      <th className="py-space-md px-space-md font-semibold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container text-on-surface font-body-sm text-body-sm">
                    {visible.map((user, idx) => {
                      const role = user.roles?.[0] || 'Waiter';
                      const meta = roleMeta[role] || roleMeta.Waiter;
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-surface-container-low transition-colors"
                        >
                          <td className="py-space-md px-space-lg">
                            <div className="flex items-center gap-space-md">
                              <div className="relative w-11 h-11 flex-shrink-0">
                                <img
                                  className="w-full h-full rounded-full object-cover shadow-sm"
                                  src={staffAvatars[idx % staffAvatars.length]}
                                  alt={user.fullName || user.email}
                                />
                                <span
                                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-secondary ring-2 ring-surface-container-lowest"
                                  title="Đang check-in tại quán"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-label-md text-label-md font-bold text-primary truncate">
                                  {user.fullName || 'Nhân sự Artisan'}
                                </span>
                                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                                  <span className="font-mono text-secondary">
                                    #NV-0{idx + 1}
                                  </span>
                                  <span>•</span>
                                  <span className="truncate">{user.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex flex-col items-start gap-1">
                              <span
                                className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm font-bold flex items-center gap-1 ${meta.badgeClass}`}
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  {meta.icon}
                                </span>
                                {meta.label}
                              </span>
                              <select
                                value={role}
                                onChange={(e) => assign(user.id, e.target.value)}
                                className="mt-1 px-2 py-1 rounded bg-surface-container text-[12px] text-on-surface font-semibold outline-none cursor-pointer"
                              >
                                {(data.roles.length
                                  ? data.roles
                                  : ['Admin', 'Cashier', 'Waiter']
                                ).map((r) => (
                                  <option key={r} value={r}>
                                    Đổi quyền: {roleMeta[r]?.label || r}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1 text-primary font-medium">
                                <span className="w-2 h-2 rounded-full bg-secondary" />
                                {meta.shift}
                              </div>
                              <span className="text-[12px] text-secondary font-semibold">
                                {meta.shiftSub}
                              </span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <div className="flex flex-col">
                              <span className="font-bold text-primary">{meta.attendance}</span>
                              <span className="text-[12px] text-on-surface-variant">
                                {meta.kpi}
                              </span>
                            </div>
                          </td>
                          <td className="py-space-md px-space-md">
                            <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                              Hoạt động
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Role Quick Reference Strip */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-wrap items-center justify-between gap-space-md text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  security
                </span>
                <span className="font-bold text-on-surface">Quy tắc bảo mật ca:</span>
                <span>
                  Mỗi nhân viên chỉ được đăng nhập đúng thiết bị POS theo vai trò được gán.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Shift Tracker & Cash Reconciliation */}
          <div className="lg:col-span-4 flex flex-col gap-space-xl">
            {/* Block 1: Live Shift Tracker */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-ping" />
                    Trực Tiếp Ca Hiện Tại
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight mt-0.5 font-bold">
                    Ca Sáng • Hôm nay
                  </h2>
                </div>
                <span className="px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  06:30 - 14:30
                </span>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-[14px]">
                    TM
                  </div>
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      Trưởng ca trực
                    </span>
                    <span className="font-label-md text-label-md font-bold text-primary">
                      {data.users[0]?.fullName || 'Trần Minh Tuấn'}
                    </span>
                  </div>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface font-mono text-[11px]">
                  Vào lúc 06:25
                </span>
              </div>

              <div className="flex flex-col gap-space-sm">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Nhân viên đang có mặt (FaceID Verified):
                </span>
                <div className="space-y-2">
                  {visible.slice(0, 4).map((u, i) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center text-xs font-bold">
                          {(u.fullName || u.email || 'NV').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-primary font-bold">
                            {u.fullName || u.email}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            {roleMeta[u.roles?.[0]]?.label || 'Phục vụ sảnh'}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[12px] text-secondary font-medium">
                        06:2{i + 5}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    savings
                  </span>
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      Tiền mặt đầu ca (Két thối)
                    </span>
                    <span className="font-price-display-md text-price-display-md text-primary font-bold">
                      2.000.000 đ
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  lock
                </span>
              </div>
            </div>

            {/* Block 2: Cash Reconciliation & Shift Close */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Biên bản chốt ca gần nhất
                    </span>
                    <span className="font-mono text-primary font-bold text-[14px]">
                      #CA-20261017-C2
                    </span>
                  </div>
                </div>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                  Ca Chiều qua
                </span>
              </div>

              <div className="space-y-space-sm py-space-xs divide-y divide-surface-container text-body-sm">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-on-surface-variant">Thu ngân bàn giao:</span>
                  <span className="font-bold text-primary">Nguyễn Thu Hà</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-on-surface-variant">Tổng doanh thu hệ thống:</span>
                  <span className="font-bold text-primary">18.450.000 đ</span>
                </div>
                <div className="pl-space-sm flex flex-col gap-1 text-[13px] text-on-surface-variant pt-1">
                  <div className="flex justify-between">
                    <span>• Tiền mặt ghi nhận POS:</span>
                    <span className="font-mono font-medium text-on-surface">6.250.000 đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• VietQR &amp; Thẻ ngân hàng:</span>
                    <span className="font-mono font-medium text-on-surface">12.200.000 đ</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 pb-1">
                  <span className="font-bold text-primary">Chênh lệch két:</span>
                  <div className="flex items-center gap-1 text-secondary font-bold font-price-display-md text-price-display-md">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>0 đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help Card / SOP Guide */}
            <div className="p-space-md rounded-xl bg-primary-container text-on-primary flex items-center gap-space-md shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">menu_book</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-on-primary">
                  Sổ Tay Quy Trình Chốt Ca F&amp;B
                </span>
                <span className="text-on-primary-container text-[12px]">
                  Hướng dẫn xử lý chênh lệch két và quy trình bàn giao ca
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
