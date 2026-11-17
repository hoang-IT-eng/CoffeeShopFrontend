/**
 * Demo backend chạy ngay trong trình duyệt — dùng khi bản build không có
 * VITE_API_URL (ví dụ bản tĩnh trên Cloudflare Pages). Dữ liệu mẫu đồng bộ
 * với scripts/mock-api-plugin.js (bản dev), cộng thêm đăng nhập demo thật:
 * chỉ chấp nhận tài khoản in sẵn trên trang đăng nhập, giữ phiên bằng
 * sessionStorage để tải lại trang không bị văng ra.
 */

const SESSION_KEY = 'an-roastery-demo-session';

const DEMO_USER = {
  authenticated: true,
  name: 'Quản trị An Roastery',
  email: 'newadmin@coffee.com',
  roles: ['Admin']
};

const now = Date.now();
const orders = [
  {
    id: 1042,
    tableName: 'Bàn 3',
    customerName: 'Lan Anh',
    total: 185000,
    status: 'Processing',
    createdAt: new Date(now - 12 * 60_000).toISOString(),
    details: [
      { id: 1, name: 'Espresso', quantity: 2, price: 45000 },
      { id: 2, name: 'Croissant bơ', quantity: 1, price: 55000 }
    ]
  },
  {
    id: 1041,
    tableName: 'Mang đi',
    customerName: 'Minh',
    total: 65000,
    status: 'New',
    createdAt: new Date(now - 18 * 60_000).toISOString(),
    details: [{ id: 3, name: 'Latte', quantity: 1, price: 65000 }]
  },
  {
    id: 1040,
    tableName: 'Bàn 1',
    customerName: 'Hương',
    total: 240000,
    status: 'Ready',
    createdAt: new Date(now - 40 * 60_000).toISOString(),
    details: [
      { id: 4, name: 'Filter Ethiopia', quantity: 2, price: 70000 },
      { id: 5, name: 'Bánh tiramisu', quantity: 1, price: 75000 }
    ]
  },
  {
    id: 1039,
    tableName: 'Bàn 5',
    customerName: 'Tuấn',
    total: 120000,
    status: 'Completed',
    createdAt: new Date(now - 90 * 60_000).toISOString(),
    details: [{ id: 6, name: 'Cappuccino', quantity: 2, price: 60000 }]
  }
];

const week = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, index) => ({
  label,
  revenue: [1.2, 1.8, 1.4, 2.1, 2.6, 3.1, 2.4][index] * 1_000_000,
  isToday: index === 5
}));

const dashboard = {
  revenue: 4_850_000,
  previousRevenue: 4_120_000,
  openNew: 1,
  openMaking: 1,
  openReady: 1,
  orderCount: 28,
  ordersPerHour: 4.2,
  tableCount: 8,
  tablesInUse: 3,
  totalWarnings: 2,
  points: week.map((day, index) => ({
    label: `${8 + index}h`,
    revenue: day.revenue / 7
  })),
  week,
  tables: [
    { id: 1, name: 'Bàn 1', status: 'Occupied' },
    { id: 2, name: 'Bàn 2', status: 'Available' },
    { id: 3, name: 'Bàn 3', status: 'Occupied' },
    { id: 4, name: 'Bàn 4', status: 'Available' },
    { id: 5, name: 'Bàn 5', status: 'Reserved' },
    { id: 6, name: 'Bàn 6', status: 'Available' },
    { id: 7, name: 'Bàn 7', status: 'Available' },
    { id: 8, name: 'Bàn 8', status: 'Occupied' }
  ],
  recentOrders: orders,
  lowStock: [
    { id: 11, name: 'Sữa oat', quantity: 1, minimumThreshold: 4 },
    { id: 12, name: 'Hạt Ethiopia', quantity: 2, minimumThreshold: 5 }
  ],
  nearExpiry: [],
  expired: []
};

function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockApi(path, { method = 'GET', body } = {}) {
  await delay(120);

  if (path.startsWith('/api/auth/login')) {
    if (method !== 'POST') fail(405, 'Phương thức không được hỗ trợ.');
    if (body?.email === DEMO_USER.email && body?.password === 'NewAdmin@123') {
      sessionStorage.setItem(SESSION_KEY, '1');
      return { ...DEMO_USER };
    }
    fail(401, 'Email hoặc mật khẩu không đúng.');
  }
  if (path.startsWith('/api/auth/me')) {
    return sessionStorage.getItem(SESSION_KEY)
      ? { ...DEMO_USER }
      : { authenticated: false };
  }
  if (path.startsWith('/api/auth/logout')) {
    sessionStorage.removeItem(SESSION_KEY);
    return { ok: true };
  }
  if (path.startsWith('/api/dashboard')) return dashboard;
  if (path.match(/^\/api\/orders\/\d+\/status/)) {
    return { message: 'Đã cập nhật đơn.' };
  }
  if (path.startsWith('/api/orders')) return orders;
  return [];
}
