import { NavLink, Outlet } from 'react-router-dom';
import { hasRole, useAuth } from '../auth';

const roleTitle = {
  Admin: 'Quản lý trưởng',
  Cashier: 'Thu ngân POS 01',
  Waiter: 'Phục vụ sàn & bàn'
};

export default function Layout() {
  const { user, logout } = useAuth();
  const admin = hasRole(user, 'Admin');
  const cashier = hasRole(user, 'Admin', 'Cashier');
  const waiter = hasRole(user, 'Admin', 'Waiter', 'Cashier');

  const navClass = ({ isActive }) =>
    isActive
      ? 'px-space-md py-space-sm rounded-lg font-label-md text-label-md bg-primary-container text-on-primary font-bold shadow-sm transition-all whitespace-nowrap inline-flex items-center gap-1.5'
      : 'px-space-md py-space-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all whitespace-nowrap inline-flex items-center gap-1.5';

  const primaryRole = user?.roles?.[0] || 'Admin';

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,24,16,0.06)]">
        <div className="h-20 w-full px-margin-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg flex-shrink-0 min-w-0 flex-1">
            <NavLink to="/dashboard" className="flex items-center gap-space-sm flex-shrink-0 no-underline">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-surface flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-secondary-container text-[24px]">coffee</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-primary leading-none font-bold">
                  Artisan Coffee
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-normal mt-0.5">
                  Hệ Thống POS &amp; Quản Trị
                </span>
              </div>
            </NavLink>

            <div className="h-7 w-[1px] bg-outline-variant/50 hidden xl:block flex-shrink-0" />

            <nav className="flex items-center gap-space-xs overflow-x-auto scrollbar-none py-1">
              <NavLink className={navClass} end to="/dashboard">
                <span>Tổng Quan</span>
              </NavLink>
              <NavLink className={navClass} to="/tables">
                <span>Sơ Đồ Bàn &amp; Thu Ngân</span>
              </NavLink>
              {waiter && (
                <NavLink className={navClass} end to="/orders">
                  <span>KDS Pha Chế</span>
                </NavLink>
              )}
              {admin && (
                <NavLink className={navClass} end to="/menu">
                  <span>Thực Đơn &amp; Định Lượng</span>
                </NavLink>
              )}
              {admin && (
                <NavLink className={navClass} to="/inventory">
                  <span>Kho Nguyên Liệu</span>
                </NavLink>
              )}
              {(admin || cashier) && (
                <NavLink className={navClass} end to="/customers">
                  <span>Khách Hàng &amp; Khuyến Mãi</span>
                </NavLink>
              )}
              {admin && (
                <NavLink className={navClass} to="/users">
                  <span>Nhân Viên &amp; Ca</span>
                </NavLink>
              )}
              {admin && (
                <NavLink className={navClass} to="/reports">
                  <span>Báo Cáo &amp; Thống Kê</span>
                </NavLink>
              )}
              <NavLink className={navClass} to="/shift">
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
                <span>Waiter App</span>
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-space-md flex-shrink-0">
            {waiter && (
              <NavLink
                to="/orders/new"
                className="hidden sm:flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary font-label-md text-label-md transition-all shadow-[0_2px_8px_rgba(254,147,44,0.25)] font-bold no-underline"
              >
                <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                <span>Màn Hình POS Bán Hàng</span>
              </NavLink>
            )}

            <div className="h-8 w-[1px] bg-outline-variant/40 hidden sm:block" />

            <div className="flex items-center gap-space-sm pl-space-xs">
              <div className="flex flex-col text-right hidden md:block">
                <span className="font-label-md text-label-md text-on-surface leading-tight font-bold">
                  {user?.name || roleTitle[primaryRole]}
                </span>
                <span className="font-label-sm text-label-sm text-secondary leading-tight font-medium">
                  {roleTitle[primaryRole] || 'Chi nhánh Trung Tâm (HCM-01)'}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Chốt ca & Đăng xuất"
                className="flex items-center justify-center p-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-surface flex-grow">
        <Outlet />
      </main>

      <footer className="w-full bg-surface-container-low shadow-[0_-1px_6px_rgba(44,24,16,0.03)] py-space-sm mt-auto">
        <div className="w-full px-margin-desktop flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container inline-block animate-pulse" />
              <span className="text-on-surface font-medium">Hệ Thống Trực Tuyến</span>
            </div>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <div className="flex items-center gap-space-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">cloud_done</span>
              <span>Đồng bộ máy POS: Vừa xong (0s trước)</span>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="text-on-surface-variant">Chi nhánh: HCM-01 (Trung Tâm)</span>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface font-mono text-[11px]">
              v3.4.2-artisan
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
