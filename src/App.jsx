import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { hasRole, useAuth } from './auth';
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

function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex items-center gap-space-sm px-space-lg py-space-md rounded-xl bg-surface-container-lowest shadow-md">
          <span className="material-symbols-outlined text-secondary animate-spin">sync</span>
          <span className="font-label-md text-label-md text-primary font-bold">Đang mở An Roastery...</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ roles, children }) {
  const { user } = useAuth();
  if (!hasRole(user, ...roles)) {
    return (
      <div className="board p-space-xl max-w-xl mx-auto mt-space-2xl rounded-xl bg-error-container text-on-error-container shadow-md flex items-center gap-space-md">
        <span className="material-symbols-outlined text-[28px]">gpp_maybe</span>
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold">Không có quyền truy cập (403)</h2>
          <p className="font-body-sm text-body-sm mt-1">Tài khoản của bạn không thuộc nhóm phân quyền được phép mở màn hình này.</p>
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
          <Route path="shift" element={<ShiftPage />} />
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
    </>
  );
}
