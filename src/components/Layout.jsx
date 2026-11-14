import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { hasRole, useAuth } from '../auth';

const roleTitle = {
  Admin: 'Quản trị',
  Cashier: 'Thu ngân',
  Waiter: 'Phục vụ'
};

function initials(name) {
  const parts = (name || '?').trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || '?';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function titleFor(pathname) {
  if (pathname.startsWith('/orders/new')) return 'Bán hàng';
  if (pathname.startsWith('/orders/')) return 'Đơn hàng';
  if (pathname.startsWith('/menu')) return 'Thực đơn';
  if (pathname.startsWith('/customers')) return 'Khách hàng';
  if (pathname.startsWith('/payments')) return 'Thanh toán';
  if (pathname.startsWith('/receipts')) return 'Hoá đơn';
  const map = {
    '/dashboard': 'Tổng quan',
    '/tables': 'Sơ đồ bàn',
    '/orders': 'Bếp và đơn',
    '/inventory': 'Kho',
    '/users': 'Nhân viên',
    '/reports': 'Báo cáo',
    '/shift': 'Ca phục vụ'
  };
  return map[pathname] || 'An Roastery';
}

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  );

  const admin = hasRole(user, 'Admin');
  const cashier = hasRole(user, 'Admin', 'Cashier');
  const floor = hasRole(user, 'Admin', 'Waiter', 'Cashier');
  const primaryRole = user?.roles?.[0] || 'Admin';
  const pageTitle = titleFor(location.pathname);

  useEffect(() => {
    document.title = `${pageTitle} — An Roastery`;
  }, [pageTitle]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  function applyTheme(next) {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('an-theme', next);
  }

  const linkClass = ({ isActive }) => (isActive ? 'ember-link is-active' : 'ember-link');

  return (
    <div className="ember-app">
      <button
        type="button"
        className="ember-menu"
        aria-label="Mở menu"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      <button
        type="button"
        className={open ? 'ember-scrim is-on' : 'ember-scrim'}
        aria-label="Đóng menu"
        onClick={() => setOpen(false)}
      />
      <aside className={open ? 'ember-side is-open' : 'ember-side'}>
        <div className="ember-side-top">
          <NavLink to="/dashboard" className="ember-brand" aria-label="An Roastery — Tổng quan">
            <span className="ember-mark" aria-hidden="true">
              <span className="material-symbols-outlined">local_cafe</span>
            </span>
            <strong>An Roastery</strong>
          </NavLink>
          <button type="button" className="ember-close" aria-label="Đóng menu" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="ember-nav" onClick={() => setOpen(false)}>
          <NavLink className={linkClass} end to="/dashboard">
            <span className="material-symbols-outlined">grid_view</span>
            <span>Tổng quan</span>
          </NavLink>
          <NavLink className={linkClass} to="/tables">
            <span className="material-symbols-outlined">table_restaurant</span>
            <span>Sơ đồ bàn</span>
          </NavLink>
          {floor && (
            <NavLink className={linkClass} end to="/orders">
              <span className="material-symbols-outlined">skillet</span>
              <span>Bếp và đơn</span>
            </NavLink>
          )}
          {floor && (
            <NavLink className={linkClass} to="/orders/new">
              <span className="material-symbols-outlined">point_of_sale</span>
              <span>Bán hàng</span>
            </NavLink>
          )}
          <NavLink className={linkClass} to="/shift">
            <span className="material-symbols-outlined">smartphone</span>
            <span>Ca phục vụ</span>
          </NavLink>

          {(admin || cashier) && <div className="ember-rule" />}

          {admin && (
            <NavLink className={linkClass} end to="/menu">
              <span className="material-symbols-outlined">menu_book</span>
              <span>Thực đơn</span>
            </NavLink>
          )}
          {admin && (
            <NavLink className={linkClass} to="/inventory">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>Kho</span>
            </NavLink>
          )}
          {(admin || cashier) && (
            <NavLink className={linkClass} end to="/customers">
              <span className="material-symbols-outlined">group</span>
              <span>Khách hàng</span>
            </NavLink>
          )}
          {admin && (
            <NavLink className={linkClass} to="/users">
              <span className="material-symbols-outlined">badge</span>
              <span>Nhân viên</span>
            </NavLink>
          )}
          {admin && (
            <NavLink className={linkClass} to="/reports">
              <span className="material-symbols-outlined">monitoring</span>
              <span>Báo cáo</span>
            </NavLink>
          )}
        </nav>

        <div className="ember-side-foot">
          <div className="ember-user">
            <span className="ember-avatar" aria-hidden="true">{initials(user?.name)}</span>
            <span className="ember-user-copy">
              <strong>{user?.name || 'Nhân viên'}</strong>
              <small>{roleTitle[primaryRole] || primaryRole}</small>
            </span>
          </div>
          <button type="button" className="ember-logout" onClick={logout}>
            Đăng xuất
          </button>
          <div className="ember-theme" role="group" aria-label="Giao diện">
            <button
              type="button"
              className={theme === 'light' ? 'is-on' : ''}
              onClick={() => applyTheme('light')}
            >
              Sáng
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'is-on' : ''}
              onClick={() => applyTheme('dark')}
            >
              Tối
            </button>
          </div>
        </div>
      </aside>
      <div className="ember-main">
        <Outlet />
      </div>
    </div>
  );
}
