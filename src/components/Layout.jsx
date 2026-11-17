import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { hasRole, useAuth } from '../auth';
import { useLang } from '../i18n';
import OpsIcon from './OpsIcons';

function initials(name) {
  const parts = (name || 'AN').trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || 'A';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { lang, setLang, t, trData, money, clock } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  );
  const [shiftSummary, setShiftSummary] = useState({ open: false, shift: null });
  const [openTicketCount, setOpenTicketCount] = useState(0);
  const [nowTick, setNowTick] = useState(() => new Date().toISOString());

  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [cmdData, setCmdData] = useState({ orders: [], tables: [], menu: [] });
  const cmdInputRef = useRef(null);

  const admin = hasRole(user, 'Admin');
  const cashier = hasRole(user, 'Admin', 'Cashier');
  const floor = hasRole(user, 'Admin', 'Waiter', 'Cashier');
  const primaryRole = user?.roles?.[0] || 'Admin';

  const roleLabel =
    primaryRole === 'Admin'
      ? t('ops.shell.roleAdmin')
      : primaryRole === 'Cashier'
        ? t('ops.shell.roleCashier')
        : t('ops.shell.roleWaiter');

  const pageTitle = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/orders/new')) return t('ops.shell.navPos');
    if (p.startsWith('/orders')) return t('ops.shell.navKds');
    if (p.startsWith('/tables')) return t('ops.shell.navFloor');
    if (p.startsWith('/menu')) return t('ops.shell.navMenu');
    if (p.startsWith('/inventory')) return t('ops.shell.navInventory');
    if (p.startsWith('/shift')) return t('ops.shell.navShift');
    if (p.startsWith('/payments') || p.startsWith('/receipts')) return t('ops.shell.navPayments');
    if (p.startsWith('/reports')) return t('ops.shell.navReports');
    if (p.startsWith('/customers')) return t('ops.shell.navCustomers');
    if (p.startsWith('/users')) return t('ops.shell.navUsers');
    return t('ops.shell.navDashboard');
  }, [location.pathname, t]);

  useEffect(() => {
    document.title = `${pageTitle} — An Roastery`;
  }, [pageTitle]);

  useEffect(() => {
    setMobileOpen(false);
    setCmdOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(new Date().toISOString()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const refreshPulse = useCallback(() => {
    if (cashier) {
      api('/api/shift')
        .then((res) => setShiftSummary({ open: Boolean(res?.open), shift: res?.shift || null }))
        .catch(() => {});
    }
    if (floor) {
      api('/api/orders')
        .then((list) => {
          const active = (list || []).filter(
            (o) => o.status !== 'Completed' && o.status !== 'Cancelled'
          ).length;
          setOpenTicketCount(active);
        })
        .catch(() => {});
    }
  }, [cashier, floor]);

  useEffect(() => {
    refreshPulse();
  }, [refreshPulse, location.pathname]);

  useEffect(() => {
    const handler = () => refreshPulse();
    window.addEventListener('an:shift-updated', handler);
    return () => window.removeEventListener('an:shift-updated', handler);
  }, [refreshPulse]);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
        return;
      }
      const tag = document.activeElement?.tagName?.toLowerCase();
      const editable =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        document.activeElement?.isContentEditable;
      if (!editable && e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setCmdOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!cmdOpen) return;
    setCmdQuery('');
    window.setTimeout(() => cmdInputRef.current?.focus(), 20);
    Promise.all([
      floor ? api('/api/orders').catch(() => []) : Promise.resolve([]),
      api('/api/tables').catch(() => []),
      admin ? api('/api/menu').catch(() => []) : Promise.resolve([])
    ]).then(([orders, tables, menu]) => {
      setCmdData({
        orders: (orders || []).slice(0, 12),
        tables: tables || [],
        menu: menu || []
      });
    });
  }, [cmdOpen, floor, admin]);

  function applyTheme(next) {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('an-theme', next);
    } catch {
      /* ignore */
    }
  }

  const navItems = useMemo(() => {
    const list = [
      { to: '/dashboard', label: t('ops.shell.navDashboard'), icon: 'dashboard', show: true },
      { to: '/orders/new', label: t('ops.shell.navPos'), icon: 'pos', show: floor },
      { to: '/orders', label: t('ops.shell.navKds'), icon: 'kds', show: floor },
      { to: '/tables', label: t('ops.shell.navFloor'), icon: 'floor', show: true },
      { to: '/menu', label: t('ops.shell.navMenu'), icon: 'menu', show: admin },
      { to: '/inventory', label: t('ops.shell.navInventory'), icon: 'inventory', show: admin },
      { to: '/shift', label: t('ops.shell.navShift'), icon: 'shift', show: cashier },
      { to: '/payments', label: t('ops.shell.navPayments'), icon: 'payments', show: floor },
      { to: '/reports', label: t('ops.shell.navReports'), icon: 'reports', show: admin },
      { to: '/customers', label: t('ops.shell.navCustomers'), icon: 'customers', show: cashier },
      { to: '/users', label: t('ops.shell.navUsers'), icon: 'users', show: admin },
      { to: '/', label: t('ops.shell.navStorefront'), icon: 'storefront', show: true }
    ];
    return list.filter((x) => x.show);
  }, [t, floor, admin, cashier]);

  const cmdResults = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    const entries = [];
    navItems.forEach((item) => {
      entries.push({
        key: `nav-${item.to}`,
        icon: item.icon,
        label: item.label,
        meta: item.to,
        to: item.to
      });
    });
    cmdData.tables.forEach((tbl) => {
      entries.push({
        key: `tbl-${tbl.id}`,
        icon: 'floor',
        label: `${trData(tbl.name)} · ${trData(tbl.area)}`,
        meta: tbl.openOrderId ? `#${tbl.openOrderId}` : t('ops.floor.stateAvailable'),
        to: '/tables'
      });
    });
    cmdData.orders.forEach((ord) => {
      entries.push({
        key: `ord-${ord.id}`,
        icon: 'receipt',
        label: `#${ord.id} · ${trData(ord.tableName)} · ${trData(ord.customerName)}`,
        meta: money(ord.total),
        to: `/orders/${ord.id}`
      });
    });
    cmdData.menu.slice(0, 8).forEach((m) => {
      entries.push({
        key: `menu-${m.id}`,
        icon: 'bean',
        label: trData(m.name),
        meta: money(m.price),
        to: `/menu/${m.id}`
      });
    });
    if (!q) return entries.slice(0, 10);
    return entries
      .filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          String(e.meta).toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [cmdQuery, navItems, cmdData, trData, money, t]);

  const linkClass = ({ isActive }) => (isActive ? 'ops-nav-link is-active' : 'ops-nav-link');

  return (
    <div className="ops-shell">
      {mobileOpen && (
        <div
          className="ops-modal-backdrop ops-no-print"
          style={{ zIndex: 30, padding: 0 }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={mobileOpen ? 'ops-sidebar is-open' : 'ops-sidebar'}>
        <div className="ops-brand-row">
          <NavLink to="/dashboard" className="ops-brand">
            <span className="ops-brand-mark">
              <OpsIcon name="roastery" size={19} />
            </span>
            <span className="ops-brand-copy">
              <strong>An Roastery</strong>
              <span>{t('ops.shell.brandSub')}</span>
            </span>
          </NavLink>
          {mobileOpen && (
            <button
              type="button"
              className="ops-icon-btn-dark"
              aria-label={t('ops.shell.closeMenu')}
              onClick={() => setMobileOpen(false)}
            >
              <OpsIcon name="close" size={16} />
            </button>
          )}
        </div>

        <nav className="ops-nav" aria-label="Operations navigation">
          <div className="ops-nav-zone">{t('ops.shell.zoneFloor')}</div>
          <NavLink end to="/dashboard" className={linkClass}>
            <OpsIcon name="dashboard" size={17} />
            <span>{t('ops.shell.navDashboard')}</span>
          </NavLink>
          {floor && (
            <NavLink to="/orders/new" className={linkClass}>
              <OpsIcon name="pos" size={17} />
              <span>{t('ops.shell.navPos')}</span>
            </NavLink>
          )}
          {floor && (
            <NavLink end to="/orders" className={linkClass}>
              <OpsIcon name="kds" size={17} />
              <span>{t('ops.shell.navKds')}</span>
              {openTicketCount > 0 && <span className="ops-nav-badge">{openTicketCount}</span>}
            </NavLink>
          )}
          <NavLink to="/tables" className={linkClass}>
            <OpsIcon name="floor" size={17} />
            <span>{t('ops.shell.navFloor')}</span>
          </NavLink>

          {admin && (
            <>
              <div className="ops-nav-zone">{t('ops.shell.zoneCatalog')}</div>
              <NavLink to="/menu" className={linkClass}>
                <OpsIcon name="menu" size={17} />
                <span>{t('ops.shell.navMenu')}</span>
              </NavLink>
              <NavLink to="/inventory" className={linkClass}>
                <OpsIcon name="inventory" size={17} />
                <span>{t('ops.shell.navInventory')}</span>
              </NavLink>
            </>
          )}

          <div className="ops-nav-zone">{t('ops.shell.zoneBackOffice')}</div>
          {cashier && (
            <NavLink to="/shift" className={linkClass}>
              <OpsIcon name="shift" size={17} />
              <span>{t('ops.shell.navShift')}</span>
            </NavLink>
          )}
          {floor && (
            <NavLink to="/payments" className={linkClass}>
              <OpsIcon name="payments" size={17} />
              <span>{t('ops.shell.navPayments')}</span>
            </NavLink>
          )}
          {admin && (
            <NavLink to="/reports" className={linkClass}>
              <OpsIcon name="reports" size={17} />
              <span>{t('ops.shell.navReports')}</span>
            </NavLink>
          )}
          {cashier && (
            <NavLink to="/customers" className={linkClass}>
              <OpsIcon name="customers" size={17} />
              <span>{t('ops.shell.navCustomers')}</span>
            </NavLink>
          )}
          {admin && (
            <NavLink to="/users" className={linkClass}>
              <OpsIcon name="users" size={17} />
              <span>{t('ops.shell.navUsers')}</span>
            </NavLink>
          )}
          <NavLink to="/" className={linkClass}>
            <OpsIcon name="storefront" size={17} />
            <span>{t('ops.shell.navStorefront')}</span>
          </NavLink>
        </nav>

        <div className="ops-side-foot">
          <div className="ops-staff-card">
            <span className="ops-avatar">{initials(user?.name)}</span>
            <span className="ops-staff-meta">
              <strong>{trData(user?.name || t('ops.shell.staffFallback'))}</strong>
              <small>{roleLabel}</small>
            </span>
          </div>

          <div className="ops-foot-controls">
            <div className="ops-seg-dark" role="group" aria-label="Language">
              <button
                type="button"
                className={lang === 'vi' ? 'is-on' : ''}
                onClick={() => setLang('vi')}
              >
                VI
              </button>
              <button
                type="button"
                className={lang === 'en' ? 'is-on' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>

            <div className="ops-seg-dark" role="group" aria-label="Theme">
              <button
                type="button"
                className={theme === 'light' ? 'is-on' : ''}
                onClick={() => applyTheme('light')}
                title={t('ops.shell.themeLight')}
              >
                <OpsIcon name="sun" size={13} />
              </button>
              <button
                type="button"
                className={theme === 'dark' ? 'is-on' : ''}
                onClick={() => applyTheme('dark')}
                title={t('ops.shell.themeDark')}
              >
                <OpsIcon name="moon" size={13} />
              </button>
            </div>

            <button
              type="button"
              className="ops-icon-btn-dark"
              onClick={logout}
              title={t('ops.shell.logout')}
              aria-label={t('ops.shell.logout')}
            >
              <OpsIcon name="logout" size={15} />
            </button>
          </div>
        </div>
      </aside>

      <div className="ops-workspace">
        <header className="ops-topbar">
          <div className="ops-topbar-left">
            <button
              type="button"
              className="ops-mobile-trigger"
              aria-label={t('ops.shell.openMenu')}
              onClick={() => setMobileOpen(true)}
            >
              <OpsIcon name="menuBars" size={18} />
            </button>
            <div className="ops-crumb">
              <span>An Roastery</span>
              <OpsIcon name="chevronRight" size={14} />
              <strong>{pageTitle}</strong>
            </div>
          </div>

          <div className="ops-topbar-right">
            <button
              type="button"
              className="ops-cmd-trigger"
              aria-label={t('ops.shell.quickSearchAria')}
              onClick={() => setCmdOpen(true)}
            >
              <OpsIcon name="search" size={15} />
              <span>{t('ops.shell.quickSearchPlaceholder')}</span>
              <kbd>/</kbd>
            </button>

            {cashier && (
              <Link
                to="/shift"
                className={`ops-shift-pill ${shiftSummary.open ? 'is-open' : 'is-closed'}`}
                data-testid="topbar-shift-pill"
              >
                <span className="ops-shift-dot" />
                {shiftSummary.open && shiftSummary.shift ? (
                  <>
                    <span>{t('ops.shell.shiftOpen')}</span>
                    <span className="ops-mono">
                      {money(shiftSummary.shift.expectedCash ?? shiftSummary.shift.openingFloat)}
                    </span>
                  </>
                ) : (
                  <>
                    <span>{t('ops.shell.shiftClosed')}</span>
                    <span style={{ color: 'var(--an-caramel)' }}>{t('ops.shell.openDrawerPrompt')}</span>
                  </>
                )}
              </Link>
            )}

            <div className="ops-lang-toggle" role="group" aria-label="Switch language">
              <button
                type="button"
                className={lang === 'vi' ? 'is-on' : ''}
                onClick={() => setLang('vi')}
              >
                VI
              </button>
              <button
                type="button"
                className={lang === 'en' ? 'is-on' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>

            <span className="ops-clock">{clock(nowTick)}</span>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>

      {cmdOpen && (
        <div
          className="ops-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={t('ops.shell.cmdTitle')}
          onClick={() => setCmdOpen(false)}
        >
          <div className="ops-cmd-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ops-cmd-input-row">
              <OpsIcon name="search" size={17} />
              <input
                ref={cmdInputRef}
                type="text"
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder={t('ops.shell.quickSearchPlaceholder')}
              />
              <button
                type="button"
                className="ops-btn ops-btn--sm"
                onClick={() => setCmdOpen(false)}
              >
                ESC
              </button>
            </div>
            <div className="ops-cmd-list">
              {cmdResults.length === 0 ? (
                <p style={{ margin: '12px 10px', fontSize: 13, color: 'var(--an-muted)' }}>
                  {t('ops.shell.cmdEmpty')}
                </p>
              ) : (
                cmdResults.map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    className="ops-cmd-item"
                    onClick={() => {
                      setCmdOpen(false);
                      navigate(entry.to);
                    }}
                  >
                    <OpsIcon name={entry.icon} size={16} />
                    <span>{entry.label}</span>
                    <small>{entry.meta}</small>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
