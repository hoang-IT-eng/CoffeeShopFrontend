import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import OpsIcon from './components/OpsIcons';
import { hasRole, useAuth } from './auth';
import { useLang } from './i18n';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CoffeeCulturePage from './pages/CoffeeCulturePage';
import BusinessSolutionsPage from './pages/BusinessSolutionsPage';
import SustainabilityPage from './pages/SustainabilityPage';
import JournalPage from './pages/JournalPage';
import DashboardPage from './pages/DashboardPage';
import ShiftPage from './pages/ShiftPage';
import OrdersPage from './pages/OrdersPage';
import OrderFormPage from './pages/OrderFormPage';
import OrderDetailPage from './pages/OrderDetailPage';
import TablesPage from './pages/TablesPage';
import MenuPage from './pages/MenuPage';
import MenuFormPage from './pages/MenuFormPage';
import InventoryPage from './pages/InventoryPage';
import CustomersPage from './pages/CustomersPage';
import CustomerFormPage from './pages/CustomerFormPage';
import UsersPage from './pages/UsersPage';
import PaymentsPage from './pages/PaymentsPage';
import PayPage from './pages/PayPage';
import ReceiptPage from './pages/ReceiptPage';
import ReportsPage from './pages/ReportsPage';
import BaristaChatWidget from './components/barista/BaristaChatWidget';

const PUBLIC_STOREFRONT_PATHS = new Set([
  '/',
  '/products',
  '/coffee-culture',
  '/business-solutions',
  '/sustainability',
  '/journal'
]);

function PublicBaristaMount() {
  const { pathname } = useLocation();
  if (!PUBLIC_STOREFRONT_PATHS.has(pathname)) return null;
  return <BaristaChatWidget />;
}

function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const { t } = useLang();
  if (!ready) {
    return (
      <div
        className="ops-shell"
        style={{ alignItems: 'center', justifyContent: 'center', padding: 24 }}
      >
        <div className="ops-panel" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <OpsIcon name="roastery" size={20} />
          <strong style={{ fontSize: 13.5 }}>{t('ops.shell.loadingApp')}</strong>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ roles, children }) {
  const { user } = useAuth();
  const { t } = useLang();
  if (!hasRole(user, ...roles)) {
    return (
      <div className="ops-page">
        <div className="ops-alert" role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <OpsIcon name="shield" size={22} />
            <div>
              <strong style={{ display: 'block', fontSize: 14.5 }}>{t('ops.shell.forbiddenTitle')}</strong>
              <span style={{ fontWeight: 400 }}>{t('ops.shell.forbiddenBody')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return children;
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const timer = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/coffee-culture" element={<CoffeeCulturePage />} />
        <Route path="/business-solutions" element={<BusinessSolutionsPage />} />
        <Route path="/sustainability" element={<SustainabilityPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="shift" element={<RequireRole roles={['Admin', 'Cashier']}><ShiftPage /></RequireRole>} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="orders" element={<RequireRole roles={['Admin', 'Waiter', 'Cashier']}><OrdersPage /></RequireRole>} />
          <Route path="orders/new" element={<RequireRole roles={['Admin', 'Waiter', 'Cashier']}><OrderFormPage /></RequireRole>} />
          <Route path="orders/:id" element={<RequireRole roles={['Admin', 'Waiter', 'Cashier']}><OrderDetailPage /></RequireRole>} />
          <Route path="payments" element={<RequireRole roles={['Admin', 'Cashier', 'Waiter']}><PaymentsPage /></RequireRole>} />
          <Route path="payments/:orderId" element={<RequireRole roles={['Admin', 'Cashier', 'Waiter']}><PayPage /></RequireRole>} />
          <Route path="receipts/:id" element={<RequireRole roles={['Admin', 'Cashier', 'Waiter']}><ReceiptPage /></RequireRole>} />
          <Route path="menu" element={<RequireRole roles={['Admin']}><MenuPage /></RequireRole>} />
          <Route path="menu/new" element={<RequireRole roles={['Admin']}><MenuFormPage /></RequireRole>} />
          <Route path="menu/:id" element={<RequireRole roles={['Admin']}><MenuFormPage /></RequireRole>} />
          <Route path="inventory" element={<RequireRole roles={['Admin']}><InventoryPage /></RequireRole>} />
          <Route path="customers" element={<RequireRole roles={['Admin', 'Cashier']}><CustomersPage /></RequireRole>} />
          <Route path="customers/new" element={<RequireRole roles={['Admin', 'Cashier']}><CustomerFormPage /></RequireRole>} />
          <Route path="customers/:id" element={<RequireRole roles={['Admin', 'Cashier']}><CustomerFormPage /></RequireRole>} />
          <Route path="users" element={<RequireRole roles={['Admin']}><UsersPage /></RequireRole>} />
          <Route path="reports" element={<RequireRole roles={['Admin']}><ReportsPage /></RequireRole>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PublicBaristaMount />
    </>
  );
}
