/**
 * Stateful in-browser Specialty Roastery & POS Operations engine.
 * Powers static builds (when VITE_API_URL is unset) and automated Vitest suites
 * with 100% parity against CoffeeShopSolution (ASP.NET Core 8 + SignalR).
 */

const SESSION_KEY = 'an-roastery-demo-session';

const DEMO_ACCOUNTS = {
  'newadmin@coffee.com': {
    password: 'NewAdmin@123',
    user: {
      authenticated: true,
      name: 'Quản trị An Roastery',
      email: 'newadmin@coffee.com',
      roles: ['Admin']
    }
  },
  'admin@coffee.com': {
    password: 'Admin@123',
    user: {
      authenticated: true,
      name: 'Mai Trần',
      email: 'admin@coffee.com',
      roles: ['Admin']
    }
  },
  'cashier@coffee.com': {
    password: 'Cashier@123',
    user: {
      authenticated: true,
      name: 'Nguyễn Thu Hà',
      email: 'cashier@coffee.com',
      roles: ['Cashier']
    }
  },
  'waiter@coffee.com': {
    password: 'Waiter@123',
    user: {
      authenticated: true,
      name: 'Lê Quốc Bảo',
      email: 'waiter@coffee.com',
      roles: ['Waiter']
    }
  }
};

function notifyShiftChange() {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('an:shift-updated'));
  }
}

function createInitialState({ shiftOpen = true } = {}) {
  const now = Date.now();

  const inventory = [
    {
      id: 1,
      name: 'Hạt Arabica Cầu Đất Rang Mộc',
      quantity: 3.4,
      unit: 'kg',
      minimumThreshold: 6,
      expirationDate: new Date(now + 28 * 86_400_000).toISOString()
    },
    {
      id: 2,
      name: 'Hạt Fine Robusta Đắk Lắk',
      quantity: 8.5,
      unit: 'kg',
      minimumThreshold: 5,
      expirationDate: new Date(now + 35 * 86_400_000).toISOString()
    },
    {
      id: 3,
      name: 'Hạt Sơn La Honey Micro-lot',
      quantity: 2.1,
      unit: 'kg',
      minimumThreshold: 3,
      expirationDate: new Date(now + 24 * 86_400_000).toISOString()
    },
    {
      id: 4,
      name: 'Sữa Yến Mạch Oatside Barista',
      quantity: 4,
      unit: 'lít',
      minimumThreshold: 8,
      expirationDate: new Date(now + 5 * 86_400_000).toISOString()
    },
    {
      id: 5,
      name: 'Sữa Tươi Thanh Trùng Dalatmilk',
      quantity: 5.5,
      unit: 'lít',
      minimumThreshold: 10,
      expirationDate: new Date(now + 3 * 86_400_000).toISOString()
    },
    {
      id: 6,
      name: 'Bột Matcha Uji Lễ Trà',
      quantity: 1.6,
      unit: 'kg',
      minimumThreshold: 1,
      expirationDate: new Date(now + 60 * 86_400_000).toISOString()
    },
    {
      id: 7,
      name: 'Bơ Pháp AOP Ngàn Lớp',
      quantity: 3.2,
      unit: 'kg',
      minimumThreshold: 2,
      expirationDate: new Date(now + 12 * 86_400_000).toISOString()
    },
    {
      id: 8,
      name: 'Đào Vàng Ngâm & Sả Tươi',
      quantity: 4.8,
      unit: 'kg',
      minimumThreshold: 3,
      expirationDate: new Date(now + 14 * 86_400_000).toISOString()
    }
  ];

  const menuItems = [
    {
      id: 1,
      name: 'Cà Phê Muối Fine Robusta',
      price: 52000,
      category: 'Phin Đặc Sản',
      imageUrl: '/img/pos/salted-coffee.jpg',
      description: 'Chiết xuất đôi Fine Robusta Đắk Lắk, kem mặn muối biển Hòn Khói mịn mượt.',
      isAvailable: true,
      recipes: [
        { inventoryItemId: 2, quantityRequired: 0.022 },
        { inventoryItemId: 5, quantityRequired: 0.06 }
      ]
    },
    {
      id: 2,
      name: 'Pour-Over Arabica Cầu Đất',
      price: 68000,
      category: 'Pour-Over & Filter',
      imageUrl: '/img/pourover.jpg',
      description: 'Hạt Arabica Cầu Đất sơ chế ướt, hương hoa trắng, cam thảo và hậu ngọt mật ong.',
      isAvailable: true,
      recipes: [{ inventoryItemId: 1, quantityRequired: 0.02 }]
    },
    {
      id: 3,
      name: 'Cold Brew Tonic Thanh Yên',
      price: 65000,
      category: 'Cold Brew & Tonic',
      imageUrl: '/img/pos/coldbrew-tonic.jpg',
      description: 'Ủ lạnh 16 giờ phối tonic thảo mộc, lát cam sấy và cỏ xạ hương tươi.',
      isAvailable: true,
      recipes: [{ inventoryItemId: 1, quantityRequired: 0.025 }]
    },
    {
      id: 4,
      name: 'Espresso Đôi Phối Trộn 70/30',
      price: 45000,
      category: 'Espresso Bar',
      imageUrl: '/img/b2b-espresso.jpg',
      description: 'Cân bằng giữa vị sô-cô-la đắng dịu và hương trái cây chín, lớp crema dày.',
      isAvailable: true,
      recipes: [
        { inventoryItemId: 1, quantityRequired: 0.013 },
        { inventoryItemId: 2, quantityRequired: 0.006 }
      ]
    },
    {
      id: 5,
      name: 'Flat White Sữa Yến Mạch',
      price: 62000,
      category: 'Espresso Bar',
      imageUrl: '/img/cups.jpg',
      description: 'Microfoam sữa yến mạch Oatside quyện cùng ristretto đôi ngọt hậu.',
      isAvailable: true,
      recipes: [
        { inventoryItemId: 1, quantityRequired: 0.018 },
        { inventoryItemId: 4, quantityRequired: 0.16 }
      ]
    },
    {
      id: 6,
      name: 'Phin Sữa Đá Đồng Nguyên Chất',
      price: 45000,
      category: 'Phin Đặc Sản',
      imageUrl: '/img/phin.jpg',
      description: 'Pha phin đồng truyền thống, sữa đặc cân chỉnh vừa vặn, đậm hương rang mộc.',
      isAvailable: true,
      recipes: [{ inventoryItemId: 2, quantityRequired: 0.024 }]
    },
    {
      id: 7,
      name: 'Cà Phê Trứng Đánh Tay',
      price: 58000,
      category: 'Phin Đặc Sản',
      imageUrl: '/img/culture-egg.jpg',
      description: 'Kem lòng đỏ trứng gà đánh bông mịn cùng mật ong rừng trên nền espresso nóng.',
      isAvailable: true,
      recipes: [{ inventoryItemId: 2, quantityRequired: 0.02 }]
    },
    {
      id: 8,
      name: 'Cold Brew Ủ Lạnh Sơn La',
      price: 59000,
      category: 'Cold Brew & Tonic',
      imageUrl: '/img/coldbrew.jpg',
      description: 'Ủ lạnh chậm hạt Sơn La sơ chế mật ong, vị thanh sạch như trà đen và quả mọng.',
      isAvailable: true,
      recipes: [{ inventoryItemId: 3, quantityRequired: 0.026 }]
    },
    {
      id: 9,
      name: 'Matcha Lễ Trà Sữa Yến Mạch',
      price: 65000,
      category: 'Matcha & Trà',
      imageUrl: '/img/pos/matcha-latte.jpg',
      description: 'Bột trà xanh Uji nghiền cối đá đánh chasen cùng sữa yến mạch béo thanh.',
      isAvailable: true,
      recipes: [
        { inventoryItemId: 6, quantityRequired: 0.005 },
        { inventoryItemId: 4, quantityRequired: 0.18 }
      ]
    },
    {
      id: 10,
      name: 'Ô Long Đào Cam Sả Đồi Cao',
      price: 56000,
      category: 'Matcha & Trà',
      imageUrl: '/img/pos/peach-tea.jpg',
      description: 'Trà ô long nướng nhẹ ủ lạnh cùng đào vàng, cam tươi và sả đập dập.',
      isAvailable: true,
      recipes: [{ inventoryItemId: 8, quantityRequired: 0.08 }]
    },
    {
      id: 11,
      name: 'Bánh Sừng Bò Bơ Pháp Ngàn Lớp',
      price: 48000,
      category: 'Bánh Nướng Xưởng',
      imageUrl: '/img/pos/butter-croissant.jpg',
      description: 'Bột ngàn lớp bơ AOP Pháp nướng mới mỗi sáng tại lò bánh của xưởng.',
      isAvailable: true,
      recipes: [{ inventoryItemId: 7, quantityRequired: 0.045 }]
    },
    {
      id: 12,
      name: 'Bánh Tiramisu Chiết Xuất Espresso',
      price: 69000,
      category: 'Bánh Nướng Xưởng',
      imageUrl: '/img/pos/tiramisu.jpg',
      description: 'Bánh ladyfinger thấm đẫm espresso nhà rang và kem phô mai mascarpone Ý.',
      isAvailable: true,
      recipes: [{ inventoryItemId: 1, quantityRequired: 0.012 }]
    }
  ];

  const tables = [
    { id: 1, name: 'B-01', area: 'Quầy Bar Espresso', seats: 2, shape: 'bar', status: 'Occupied', floorState: 'waiting', guests: 2, seatedMinutes: 8 },
    { id: 2, name: 'B-02', area: 'Quầy Bar Espresso', seats: 2, shape: 'bar', status: 'Empty', floorState: 'available', guests: 0, seatedMinutes: 0 },
    { id: 3, name: 'B-03', area: 'Quầy Bar Espresso', seats: 2, shape: 'bar', status: 'Empty', floorState: 'available', guests: 0, seatedMinutes: 0 },
    { id: 4, name: 'C-01', area: 'Sân Trong Chính', seats: 4, shape: 'four', status: 'Occupied', floorState: 'ordering', guests: 3, seatedMinutes: 3 },
    { id: 5, name: 'C-02', area: 'Sân Trong Chính', seats: 4, shape: 'four', status: 'Reserved', floorState: 'check', guests: 4, seatedMinutes: 38 },
    { id: 6, name: 'C-03', area: 'Sân Trong Chính', seats: 6, shape: 'communal', status: 'Empty', floorState: 'available', guests: 0, seatedMinutes: 0 },
    { id: 7, name: 'C-04', area: 'Sân Trong Chính', seats: 2, shape: 'two', status: 'Empty', floorState: 'available', guests: 0, seatedMinutes: 0 },
    { id: 8, name: 'R-01', area: 'Khung Cửa Xưởng Rang', seats: 2, shape: 'two', status: 'Occupied', floorState: 'waiting', guests: 2, seatedMinutes: 12 },
    { id: 9, name: 'R-02', area: 'Khung Cửa Xưởng Rang', seats: 4, shape: 'four', status: 'Empty', floorState: 'available', guests: 0, seatedMinutes: 0 },
    { id: 10, name: 'R-03', area: 'Khung Cửa Xưởng Rang', seats: 2, shape: 'two', status: 'Empty', floorState: 'available', guests: 0, seatedMinutes: 0 },
    { id: 11, name: 'M-01', area: 'Gác Lửng Yên Tĩnh', seats: 4, shape: 'four', status: 'Empty', floorState: 'available', guests: 0, seatedMinutes: 0 },
    { id: 12, name: 'M-02', area: 'Gác Lửng Yên Tĩnh', seats: 6, shape: 'communal', status: 'Occupied', floorState: 'check', guests: 5, seatedMinutes: 52 }
  ];

  const orders = [
    {
      id: 1044,
      tableId: 4,
      tableName: 'C-01',
      tableArea: 'Sân Trong Chính',
      customerName: 'Minh Anh',
      total: 168000,
      status: 'New',
      createdAt: new Date(now - 3 * 60_000).toISOString(),
      details: [
        {
          id: 101,
          menuItemId: 1,
          name: 'Cà Phê Muối Fine Robusta',
          quantity: 2,
          price: 52000,
          imageUrl: '/img/pos/salted-coffee.jpg',
          category: 'Phin Đặc Sản',
          modifiers: 'Fine Robusta Đắk Lắk · 50% Ngọt · Đá Tinh Khiết'
        },
        {
          id: 102,
          menuItemId: 3,
          name: 'Cold Brew Tonic Thanh Yên',
          quantity: 1,
          price: 64000,
          imageUrl: '/img/pos/coldbrew-tonic.jpg',
          category: 'Cold Brew & Tonic',
          modifiers: 'Arabica Cầu Đất · Nguyên Bản · Đá Viên Lớn'
        }
      ]
    },
    {
      id: 1043,
      tableId: 1,
      tableName: 'B-01',
      tableArea: 'Quầy Bar Espresso',
      customerName: 'Lan Khuê',
      total: 184000,
      status: 'Processing',
      createdAt: new Date(now - 7 * 60_000).toISOString(),
      details: [
        {
          id: 103,
          menuItemId: 2,
          name: 'Pour-Over Arabica Cầu Đất',
          quantity: 2,
          price: 68000,
          imageUrl: '/img/pourover.jpg',
          category: 'Pour-Over & Filter',
          modifiers: 'Phễu Hario V60 · Nóng 92°C · Không Đường'
        },
        {
          id: 104,
          menuItemId: 11,
          name: 'Bánh Sừng Bò Bơ Pháp Ngàn Lớp',
          quantity: 1,
          price: 48000,
          imageUrl: '/img/pos/butter-croissant.jpg',
          category: 'Bánh Nướng Xưởng',
          modifiers: 'Ủ ấm lò 165°C'
        }
      ]
    },
    {
      id: 1042,
      tableId: 8,
      tableName: 'R-01',
      tableArea: 'Khung Cửa Xưởng Rang',
      customerName: 'Hoàng Bách',
      total: 196000,
      status: 'Ready',
      createdAt: new Date(now - 12 * 60_000).toISOString(),
      details: [
        {
          id: 105,
          menuItemId: 5,
          name: 'Flat White Sữa Yến Mạch',
          quantity: 2,
          price: 62000,
          imageUrl: '/img/cups.jpg',
          category: 'Espresso Bar',
          modifiers: 'Sữa Yến Mạch Oatside · Nóng 60°C'
        },
        {
          id: 106,
          menuItemId: 12,
          name: 'Bánh Tiramisu Chiết Xuất Espresso',
          quantity: 1,
          price: 72000,
          imageUrl: '/img/pos/tiramisu.jpg',
          category: 'Bánh Nướng Xưởng',
          modifiers: 'Rắc cacao mới'
        }
      ]
    },
    {
      id: 1041,
      tableId: 5,
      tableName: 'C-02',
      tableArea: 'Sân Trong Chính',
      customerName: 'Thu Hà',
      total: 177000,
      status: 'Ready',
      createdAt: new Date(now - 26 * 60_000).toISOString(),
      details: [
        {
          id: 107,
          menuItemId: 9,
          name: 'Matcha Lễ Trà Sữa Yến Mạch',
          quantity: 1,
          price: 65000,
          imageUrl: '/img/pos/matcha-latte.jpg',
          category: 'Matcha & Trà',
          modifiers: 'Sữa Yến Mạch Oatside · 30% Đường'
        },
        {
          id: 108,
          menuItemId: 10,
          name: 'Ô Long Đào Cam Sả Đồi Cao',
          quantity: 2,
          price: 56000,
          imageUrl: '/img/pos/peach-tea.jpg',
          category: 'Matcha & Trà',
          modifiers: 'Đá Tinh Khiết · 50% Ngọt'
        }
      ]
    },
    {
      id: 1040,
      tableId: 12,
      tableName: 'M-02',
      tableArea: 'Gác Lửng Yên Tĩnh',
      customerName: 'Tuấn Kiệt',
      total: 254000,
      status: 'Completed',
      createdAt: new Date(now - 64 * 60_000).toISOString(),
      details: [
        {
          id: 109,
          menuItemId: 7,
          name: 'Cà Phê Trứng Đánh Tay',
          quantity: 2,
          price: 58000,
          imageUrl: '/img/culture-egg.jpg',
          category: 'Phin Đặc Sản',
          modifiers: 'Nóng · Ly gốm giữ nhiệt'
        },
        {
          id: 110,
          menuItemId: 12,
          name: 'Bánh Tiramisu Chiết Xuất Espresso',
          quantity: 2,
          price: 69000,
          imageUrl: '/img/pos/tiramisu.jpg',
          category: 'Bánh Nướng Xưởng',
          modifiers: 'Dùng tại bàn'
        }
      ]
    }
  ];

  const payments = [
    {
      id: 501,
      orderId: 1040,
      amount: 254000,
      status: 'Paid',
      paymentMethod: 'Cash',
      paymentDate: new Date(now - 45 * 60_000).toISOString(),
      transactionId: 'AN-CASH-501',
      pointsEarned: 25,
      customerName: 'Tuấn Kiệt',
      tableName: 'M-02',
      orderTotal: 254000,
      details: orders[4].details
    }
  ];

  const customers = [
    {
      id: 1,
      name: 'Minh Anh',
      phoneNumber: '0903100001',
      email: 'minhanh@anroastery.vn',
      address: 'Đồng Khởi, Quận 1 · Gu Pour-Over Cầu Đất không đường',
      membershipLevel: 'Diamond',
      loyaltyPoints: 640,
      totalSpent: 14850000,
      totalOrders: 68,
      joinDate: new Date(now - 240 * 86_400_000).toISOString()
    },
    {
      id: 2,
      name: 'Thu Hà',
      phoneNumber: '0903100002',
      email: 'thuha@anroastery.vn',
      address: 'Thảo Điền, TP. Thủ Đức · Gu Matcha Sữa Yến Mạch',
      membershipLevel: 'Gold',
      loyaltyPoints: 380,
      totalSpent: 8420000,
      totalOrders: 41,
      joinDate: new Date(now - 180 * 86_400_000).toISOString()
    },
    {
      id: 3,
      name: 'Hoàng Bách',
      phoneNumber: '0903100003',
      email: 'hoangbach@anroastery.vn',
      address: 'Phú Nhuận · Gu Flat White & Tiramisu',
      membershipLevel: 'Silver',
      loyaltyPoints: 195,
      totalSpent: 4150000,
      totalOrders: 22,
      joinDate: new Date(now - 110 * 86_400_000).toISOString()
    },
    {
      id: 4,
      name: 'Tuấn Kiệt',
      phoneNumber: '0903100004',
      email: 'tuankiet@anroastery.vn',
      address: 'Quận 3 · Gu Cà Phê Muối & Cold Brew',
      membershipLevel: 'Bronze',
      loyaltyPoints: 85,
      totalSpent: 1920000,
      totalOrders: 11,
      joinDate: new Date(now - 50 * 86_400_000).toISOString()
    }
  ];

  const users = [
    { id: 'u-admin', fullName: 'Quản trị An Roastery', email: 'newadmin@coffee.com', roles: ['Admin'] },
    { id: 'u-cashier', fullName: 'Nguyễn Thu Hà', email: 'cashier@coffee.com', roles: ['Cashier'] },
    { id: 'u-waiter-1', fullName: 'Lê Quốc Bảo', email: 'waiter@coffee.com', roles: ['Waiter'] },
    { id: 'u-waiter-2', fullName: 'Trần Gia Huy', email: 'barista@coffee.com', roles: ['Waiter'] }
  ];

  const shiftHistory = [
    {
      id: 101,
      status: 'Closed',
      openedBy: 'cashier@coffee.com',
      closedBy: 'cashier@coffee.com',
      openedAt: new Date(now - 26 * 3_600_000).toISOString(),
      closedAt: new Date(now - 18 * 3_600_000).toISOString(),
      openingFloat: 2000000,
      cashTotal: 3420000,
      cardTotal: 2850000,
      mobileSimTotal: 4180000,
      paidIn: 0,
      paidOut: 120000,
      expectedCash: 5300000,
      actualCash: 5300000,
      variance: 0,
      grandTotal: 10450000,
      paidOrderCount: 64,
      notes: 'Ca sáng khớp két 100%',
      cashEvents: [
        { id: 1, type: 'out', amount: 120000, reason: 'Nhập 4 túi đá tinh khiết', at: new Date(now - 22 * 3_600_000).toISOString() }
      ]
    }
  ];

  const currentShift = shiftOpen
    ? {
        id: 102,
        status: 'Open',
        isOpen: true,
        openedBy: 'newadmin@coffee.com',
        closedBy: null,
        openedAt: new Date(now - 4.5 * 3_600_000).toISOString(),
        closedAt: null,
        openingFloat: 2000000,
        cashTotal: 1890000,
        cardTotal: 1640000,
        mobileSimTotal: 2320000,
        paidIn: 200000,
        paidOut: 85000,
        grandTotal: 5850000,
        paidOrderCount: 34,
        notes: 'Ca sáng xưởng trung tâm — đủ tiền lẻ mệnh giá nhỏ',
        cashEvents: [
          {
            id: 201,
            type: 'in',
            amount: 200000,
            reason: 'Bổ sung cọc tiền lẻ 10k/20k',
            by: 'newadmin@coffee.com',
            at: new Date(now - 3.8 * 3_600_000).toISOString()
          },
          {
            id: 202,
            type: 'out',
            amount: 85000,
            reason: 'Mua bổ sung đá viên tinh khiết & sả tươi',
            by: 'cashier@coffee.com',
            at: new Date(now - 2.1 * 3_600_000).toISOString()
          }
        ]
      }
    : null;

  return {
    inventory,
    menuItems,
    tables,
    orders,
    payments,
    customers,
    users,
    shiftHistory,
    currentShift,
    nextOrderId: 1045,
    nextPaymentId: 502,
    nextShiftId: 103
  };
}

let state = createInitialState({ shiftOpen: true });

export function resetMockApi(options = {}) {
  state = createInitialState(options);
  memorySessionEmail = null;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  notifyShiftChange();
}

function computeShiftView(shift) {
  if (!shift) return null;
  const paidIn = (shift.cashEvents || [])
    .filter((e) => e.type === 'in')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const paidOut = (shift.cashEvents || [])
    .filter((e) => e.type === 'out')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const expectedCash = Number(shift.openingFloat || 0) + Number(shift.cashTotal || 0) + paidIn - paidOut;
  const grandTotal =
    Number(shift.cashTotal || 0) + Number(shift.cardTotal || 0) + Number(shift.mobileSimTotal || 0);
  return {
    ...shift,
    paidIn,
    paidOut,
    expectedCash,
    grandTotal,
    isOpen: shift.status === 'Open'
  };
}

function enrichOrder(order) {
  const elapsed = Math.max(0, Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60_000));
  return {
    ...order,
    elapsedMinutes: elapsed,
    itemCount: (order.details || []).reduce((s, d) => s + Number(d.quantity || 0), 0),
    details: (order.details || []).map((d) => ({
      ...d,
      lineTotal: Number(d.price || 0) * Number(d.quantity || 0)
    }))
  };
}

function buildDashboard(range = 'today') {
  const mult = range === 'year' ? 92 : range === 'month' ? 24 : range === 'week' ? 6.2 : 1;
  const hourlyBase = [
    { label: '07:00', revenue: 420000, count: 7 },
    { label: '08:00', revenue: 960000, count: 16 },
    { label: '09:00', revenue: 1180000, count: 19 },
    { label: '10:00', revenue: 740000, count: 11 },
    { label: '11:00', revenue: 510000, count: 8 },
    { label: '12:00', revenue: 630000, count: 10 },
    { label: '13:00', revenue: 890000, count: 15 },
    { label: '14:00', revenue: 940000, count: 16 },
    { label: '15:00', revenue: 780000, count: 13 },
    { label: '16:00', revenue: 610000, count: 10 },
    { label: '17:00', revenue: 480000, count: 8 },
    { label: '18:00', revenue: 540000, count: 9 }
  ];

  const points = hourlyBase.map((pt) => ({
    label: pt.label,
    revenue: Math.round(pt.revenue * mult),
    count: Math.round(pt.count * mult)
  }));

  const week = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, idx) => ({
    label,
    revenue: [5.2, 5.8, 6.1, 6.9, 8.4, 9.6, 8.7][idx] * 1_000_000,
    isToday: idx === 5
  }));

  const openNew = state.orders.filter((o) => o.status === 'New').length;
  const openMaking = state.orders.filter((o) => o.status === 'Processing').length;
  const openReady = state.orders.filter((o) => o.status === 'Ready' || o.status === 'PendingMobilePayment').length;
  const tablesInUse = state.tables.filter((t) => t.status !== 'Empty').length;
  const lowStock = state.inventory.filter((i) => Number(i.quantity) <= Number(i.minimumThreshold));
  const nearExpiry = state.inventory.filter((i) => {
    const days = (new Date(i.expirationDate).getTime() - Date.now()) / 86_400_000;
    return days > 0 && days <= 7;
  });

  const shiftView = computeShiftView(state.currentShift);
  const baseRevenue = points.reduce((s, p) => s + p.revenue, 0);

  return {
    range,
    revenue: baseRevenue,
    previousRevenue: Math.round(baseRevenue * 0.87),
    orderCount: points.reduce((s, p) => s + p.count, 0),
    ordersPerHour: 11.8,
    avgPrepMinutes: 4.2,
    openNew,
    openMaking,
    openReady,
    tableCount: state.tables.length,
    tablesInUse,
    drawerOpen: Boolean(shiftView),
    drawerShiftId: shiftView?.id || null,
    drawerCash: shiftView ? shiftView.expectedCash : 0,
    totalWarnings: new Set([...lowStock.map((i) => i.id), ...nearExpiry.map((i) => i.id)]).size,
    lowStock,
    nearExpiry,
    expired: [],
    points,
    week,
    tables: state.tables,
    recentOrders: state.orders.slice(0, 8).map(enrichOrder),
    topPerformers: [
      { id: 1, name: 'Cà Phê Muối Fine Robusta', category: 'Phin Đặc Sản', cups: Math.round(42 * mult), share: 26 },
      { id: 2, name: 'Pour-Over Arabica Cầu Đất', category: 'Pour-Over & Filter', cups: Math.round(31 * mult), share: 19 },
      { id: 5, name: 'Flat White Sữa Yến Mạch', category: 'Espresso Bar', cups: Math.round(28 * mult), share: 17 },
      { id: 3, name: 'Cold Brew Tonic Thanh Yên', category: 'Cold Brew & Tonic', cups: Math.round(24 * mult), share: 15 },
      { id: 9, name: 'Matcha Lễ Trà Sữa Yến Mạch', category: 'Matcha & Trà', cups: Math.round(19 * mult), share: 12 }
    ]
  };
}

function buildReports() {
  const now = Date.now();
  const dailySales = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now - (6 - i) * 86_400_000);
    const rev = [6450000, 7120000, 6890000, 7940000, 9180000, 11240000, 10360000][i];
    return {
      date: d.toISOString(),
      total: rev,
      count: Math.round(rev / 118000)
    };
  });

  const daypartSlots = ['07h', '09h', '11h', '13h', '15h', '17h', '19h', '21h'];
  const daypartMatrix = [
    { day: 'T2', values: [1.1, 1.8, 0.9, 1.3, 1.2, 0.7, 0.8, 0.4] },
    { day: 'T3', values: [1.2, 1.9, 1.0, 1.4, 1.3, 0.8, 0.9, 0.5] },
    { day: 'T4', values: [1.1, 2.0, 0.9, 1.5, 1.4, 0.8, 0.9, 0.5] },
    { day: 'T5', values: [1.4, 2.2, 1.1, 1.6, 1.5, 0.9, 1.1, 0.6] },
    { day: 'T6', values: [1.6, 2.5, 1.3, 1.9, 1.8, 1.2, 1.5, 0.9] },
    { day: 'T7', values: [1.9, 2.9, 1.7, 2.4, 2.3, 1.6, 1.9, 1.1] },
    { day: 'CN', values: [1.8, 2.7, 1.6, 2.2, 2.1, 1.4, 1.6, 0.8] }
  ];

  const categoryBreakdown = [
    { category: 'Espresso Bar', revenue: 18450000, cogs: 5350500, marginPct: 71, wastePct: 1.4 },
    { category: 'Pour-Over & Filter', revenue: 12680000, cogs: 3423600, marginPct: 73, wastePct: 0.9 },
    { category: 'Phin Đặc Sản', revenue: 11920000, cogs: 3337600, marginPct: 72, wastePct: 1.1 },
    { category: 'Cold Brew & Tonic', revenue: 7840000, cogs: 2508800, marginPct: 68, wastePct: 1.6 },
    { category: 'Matcha & Trà', revenue: 5120000, cogs: 1792000, marginPct: 65, wastePct: 1.2 },
    { category: 'Bánh Nướng Xưởng', revenue: 3170000, cogs: 1331400, marginPct: 58, wastePct: 2.8 }
  ];

  const revenue = dailySales.reduce((s, d) => s + d.total, 0);
  const orderCount = dailySales.reduce((s, d) => s + d.count, 0);

  return {
    orderCount,
    revenue,
    paidAmount: revenue,
    avgTicket: Math.round(revenue / Math.max(1, orderCount)),
    wasteRatio: 1.38,
    dailySales,
    daypartSlots,
    daypartMatrix,
    categoryBreakdown,
    paymentMethods: [
      { method: 'MobileSim', total: Math.round(revenue * 0.46), count: Math.round(orderCount * 0.46) },
      { method: 'Cash', total: Math.round(revenue * 0.31), count: Math.round(orderCount * 0.31) },
      { method: 'Card', total: Math.round(revenue * 0.23), count: Math.round(orderCount * 0.23) }
    ]
  };
}

function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

const isTestEnv = typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, isTestEnv ? 0 : ms));
let memorySessionEmail = null;

export async function mockApi(rawPath, { method = 'GET', body } = {}) {
  await delay(18);

  const [path, queryString = ''] = rawPath.split('?');
  const query = new URLSearchParams(queryString);

  // ——— AUTH ———
  if (path === '/api/auth/login') {
    if (method !== 'POST') fail(405, 'Method not allowed.');
    const email = (body?.email || '').trim().toLowerCase();
    const record = DEMO_ACCOUNTS[email];
    if (record && body?.password === record.password) {
      memorySessionEmail = email;
      try {
        sessionStorage.setItem(SESSION_KEY, email);
      } catch {
        /* ignore */
      }
      return { ...record.user };
    }
    fail(401, 'Invalid staff email or password.');
  }

  if (path === '/api/auth/me') {
    let saved = memorySessionEmail;
    try {
      saved = sessionStorage.getItem(SESSION_KEY) || saved;
    } catch {
      /* ignore */
    }
    if (saved === '1') saved = 'newadmin@coffee.com';
    const record = saved ? DEMO_ACCOUNTS[saved] : null;
    return record ? { ...record.user } : { authenticated: false };
  }

  if (path === '/api/auth/logout') {
    memorySessionEmail = null;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    return { ok: true };
  }

  // ——— DASHBOARD & HOME ———
  if (path === '/api/dashboard') {
    return buildDashboard(query.get('range') || 'today');
  }

  if (path === '/api/home') {
    return {
      emptyTables: state.tables.filter((t) => t.status === 'Empty').length,
      occupiedTables: state.tables.filter((t) => t.status === 'Occupied').length,
      reservedTables: state.tables.filter((t) => t.status === 'Reserved').length,
      orders: state.orders
        .filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled')
        .map(enrichOrder)
    };
  }

  // ——— ORDERS & KDS ———
  if (path === '/api/orders/form' && method === 'GET') {
    return {
      tables: state.tables,
      menuItems: state.menuItems.filter((m) => m.isAvailable),
      customers: state.customers
    };
  }

  const orderStatusMatch = path.match(/^\/api\/orders\/(\d+)\/status$/);
  if (orderStatusMatch && method === 'POST') {
    const id = Number(orderStatusMatch[1]);
    const order = state.orders.find((o) => o.id === id);
    if (!order) fail(404, 'Order not found.');
    const next = (body?.status || '').trim();
    order.status = next;
    if (next === 'Completed' || next === 'Cancelled') {
      const tbl = state.tables.find((t) => t.id === order.tableId);
      const stillOpen = state.orders.some(
        (o) => o.id !== id && o.tableId === order.tableId && o.status !== 'Completed' && o.status !== 'Cancelled'
      );
      if (tbl && !stillOpen) {
        tbl.status = 'Empty';
        tbl.floorState = 'available';
        tbl.guests = 0;
        tbl.seatedMinutes = 0;
      }
    } else if (next === 'Ready') {
      const tbl = state.tables.find((t) => t.id === order.tableId);
      if (tbl) tbl.floorState = 'check';
    } else if (next === 'Processing') {
      const tbl = state.tables.find((t) => t.id === order.tableId);
      if (tbl) tbl.floorState = 'waiting';
    }
    return { ok: true, id, status: next, message: `Ticket #${id} → ${next}` };
  }

  const orderCancelMatch = path.match(/^\/api\/orders\/(\d+)\/cancel$/);
  if (orderCancelMatch && method === 'POST') {
    const id = Number(orderCancelMatch[1]);
    const order = state.orders.find((o) => o.id === id);
    if (!order) fail(404, 'Order not found.');
    order.status = 'Cancelled';
    return { ok: true, message: `Ticket #${id} cancelled.` };
  }

  const singleOrderMatch = path.match(/^\/api\/orders\/(\d+)$/);
  if (singleOrderMatch && method === 'GET') {
    const id = Number(singleOrderMatch[1]);
    const order = state.orders.find((o) => o.id === id);
    if (!order) fail(404, 'Order not found.');
    return enrichOrder(order);
  }

  if (path === '/api/orders' && method === 'GET') {
    return state.orders.map(enrichOrder);
  }

  if (path === '/api/orders' && method === 'POST') {
    const items = body?.items || [];
    if (!items.length) fail(400, 'Please add at least one item to the ticket.');
    const table = state.tables.find((t) => Number(t.id) === Number(body?.tableId));
    const details = items.map((line, idx) => {
      const menu = state.menuItems.find((m) => Number(m.id) === Number(line.menuItemId)) || state.menuItems[0];
      const unitPrice = Number(line.unitPrice || menu?.price || 45000);
      return {
        id: Date.now() + idx,
        menuItemId: menu?.id || line.menuItemId,
        name: menu?.name || line.name || 'Specialty Drink',
        quantity: Number(line.quantity || 1),
        price: unitPrice,
        imageUrl: menu?.imageUrl || '/img/pos/salted-coffee.jpg',
        category: menu?.category || 'Espresso Bar',
        modifiers: line.modifiers || line.note || ''
      };
    });
    const subtotal = details.reduce((s, d) => s + d.price * d.quantity, 0);
    const discount = Number(body?.discount || 0);
    const total = Math.max(0, subtotal - discount);
    const id = state.nextOrderId++;
    const newOrder = {
      id,
      tableId: table?.id || 0,
      tableName: body?.serviceMode === 'takeaway' ? 'Mang đi' : table?.name || 'Mang đi',
      tableArea: table?.area || '',
      customerName: (body?.customerName || 'Khách lẻ').trim(),
      total,
      status: 'New',
      createdAt: new Date().toISOString(),
      details
    };
    state.orders.unshift(newOrder);
    if (table && body?.serviceMode !== 'takeaway') {
      table.status = 'Occupied';
      table.floorState = 'ordering';
      table.guests = table.guests || Math.min(table.seats || 2, 2);
      table.seatedMinutes = 1;
    }
    return { id, order: enrichOrder(newOrder), message: `Ticket #${id} sent to bar KDS.` };
  }

  // ——— TABLES & FLOOR STUDIO ———
  if (path === '/api/tables/merge' && method === 'POST') {
    const src = state.tables.find((t) => Number(t.id) === Number(body?.sourceTableId));
    const dst = state.tables.find((t) => Number(t.id) === Number(body?.targetTableId));
    if (!src || !dst || src.id === dst.id) fail(400, 'Invalid source or target table.');
    state.orders.forEach((o) => {
      if (o.tableId === src.id && o.status !== 'Completed' && o.status !== 'Cancelled') {
        o.tableId = dst.id;
        o.tableName = dst.name;
        o.tableArea = dst.area;
      }
    });
    dst.status = 'Occupied';
    dst.floorState = src.floorState === 'available' ? 'ordering' : src.floorState;
    dst.guests = (dst.guests || 0) + (src.guests || 2);
    dst.seatedMinutes = Math.max(dst.seatedMinutes || 1, src.seatedMinutes || 5);
    src.status = 'Empty';
    src.floorState = 'available';
    src.guests = 0;
    src.seatedMinutes = 0;
    return { ok: true, sourceId: src.id, targetId: dst.id };
  }

  const tableStatusMatch = path.match(/^\/api\/tables\/(\d+)\/status$/);
  if (tableStatusMatch && method === 'POST') {
    const id = Number(tableStatusMatch[1]);
    const table = state.tables.find((t) => t.id === id);
    if (!table) fail(404, 'Table not found.');
    const next = body?.status || 'Empty';
    if (next === 'Empty') {
      state.orders.forEach((o) => {
        if (o.tableId === id && o.status !== 'Completed' && o.status !== 'Cancelled') {
          o.status = 'Completed';
        }
      });
      table.status = 'Empty';
      table.floorState = 'available';
      table.guests = 0;
      table.seatedMinutes = 0;
    } else if (next === 'Reserved') {
      table.status = 'Reserved';
      table.floorState = body?.floorState || 'check';
      table.guests = table.guests || 2;
    } else {
      table.status = 'Occupied';
      table.floorState = body?.floorState || 'ordering';
      table.guests = body?.guests || table.guests || 2;
      table.seatedMinutes = table.seatedMinutes || 1;
    }
    return { ok: true, id: table.id, status: table.status, floorState: table.floorState };
  }

  if (path === '/api/tables' && method === 'GET') {
    return state.tables.map((t) => {
      const open = state.orders.find(
        (o) => o.tableId === t.id && o.status !== 'Completed' && o.status !== 'Cancelled'
      );
      let floorState = t.floorState || 'available';
      if (t.status === 'Empty') floorState = 'available';
      else if (open?.status === 'Ready') floorState = 'check';
      else if (open?.status === 'Processing') floorState = 'waiting';
      else if (t.status === 'Reserved') floorState = 'check';
      else if (t.status === 'Occupied' && floorState === 'available') floorState = 'ordering';
      return {
        ...t,
        floorState,
        openOrderId: open?.id || null,
        openOrderStatus: open?.status || null,
        openOrderTotal: open?.total || 0,
        openOrderCustomer: open?.customerName || null,
        openOrderDetails: open?.details || []
      };
    });
  }

  // ——— CASHIER SHIFT & PETTY CASH ———
  if (path === '/api/shift' && method === 'GET') {
    const view = computeShiftView(state.currentShift);
    return {
      open: Boolean(view),
      shift: view,
      history: state.shiftHistory
    };
  }

  if (path === '/api/shift/history' && method === 'GET') {
    return state.shiftHistory;
  }

  if (path === '/api/shift/open' && method === 'POST') {
    if (state.currentShift) fail(400, 'A shift is already open.');
    const shift = {
      id: state.nextShiftId++,
      status: 'Open',
      isOpen: true,
      openedBy: 'newadmin@coffee.com',
      closedBy: null,
      openedAt: new Date().toISOString(),
      closedAt: null,
      openingFloat: Math.max(0, Number(body?.openingFloat || 0)),
      cashTotal: 0,
      cardTotal: 0,
      mobileSimTotal: 0,
      paidOrderCount: 0,
      notes: body?.notes || '',
      cashEvents: []
    };
    state.currentShift = shift;
    notifyShiftChange();
    return computeShiftView(shift);
  }

  if (path === '/api/shift/cash-event' && method === 'POST') {
    if (!state.currentShift) fail(400, 'Open a shift before recording cash drawer events.');
    const amount = Number(body?.amount || 0);
    if (amount <= 0) fail(400, 'Amount must be greater than zero.');
    const event = {
      id: Date.now(),
      type: body?.type === 'in' ? 'in' : 'out',
      amount,
      reason: (body?.reason || 'Drawer adjustment').trim(),
      by: 'newadmin@coffee.com',
      at: new Date().toISOString()
    };
    state.currentShift.cashEvents.unshift(event);
    notifyShiftChange();
    return computeShiftView(state.currentShift);
  }

  if (path === '/api/shift/close' && method === 'POST') {
    if (!state.currentShift) fail(400, 'No active shift to close.');
    const view = computeShiftView(state.currentShift);
    const actualCash =
      body?.actualCash !== undefined && body?.actualCash !== ''
        ? Number(body.actualCash)
        : view.expectedCash;
    const closed = {
      ...view,
      status: 'Closed',
      isOpen: false,
      closedBy: 'newadmin@coffee.com',
      closedAt: new Date().toISOString(),
      actualCash,
      variance: actualCash - view.expectedCash,
      notes: [view.notes, body?.notes].filter(Boolean).join(' · ')
    };
    state.shiftHistory.unshift(closed);
    state.currentShift = null;
    notifyShiftChange();
    return closed;
  }

  // ——— PAYMENTS & RECEIPTS ———
  if (path === '/api/payments/ready' && method === 'GET') {
    return state.orders
      .filter((o) => o.status === 'Ready' || o.status === 'Processing' || o.status === 'New')
      .map(enrichOrder);
  }

  if (path === '/api/payments' && method === 'POST') {
    const order = state.orders.find((o) => Number(o.id) === Number(body?.orderId));
    if (!order) fail(404, 'Order not found.');
    const rawMethod = (body?.paymentMethod || 'Cash').trim();
    const isPendingMobile = rawMethod === 'Mobile' || rawMethod === 'MobileSim';
    const payment = {
      id: state.nextPaymentId++,
      orderId: order.id,
      amount: order.total,
      orderTotal: order.total,
      paymentMethod: isPendingMobile ? 'MobileSim' : rawMethod,
      status: 'Paid',
      isPaid: true,
      paymentDate: new Date().toISOString(),
      transactionId: `AN-${rawMethod.toUpperCase().slice(0, 4)}-${1000 + order.id}`,
      pointsEarned: Math.floor(order.total / 10000),
      customerInfo: body?.customerInfo || '',
      customerName: order.customerName,
      tableName: order.tableName,
      details: order.details
    };
    state.payments.unshift(payment);
    order.status = 'Completed';
    const tbl = state.tables.find((t) => t.id === order.tableId);
    if (tbl) {
      tbl.status = 'Empty';
      tbl.floorState = 'available';
      tbl.guests = 0;
      tbl.seatedMinutes = 0;
    }
    if (state.currentShift) {
      if (rawMethod === 'Cash') state.currentShift.cashTotal += order.total;
      else if (rawMethod === 'Card') state.currentShift.cardTotal += order.total;
      else state.currentShift.mobileSimTotal += order.total;
      state.currentShift.paidOrderCount += 1;
      notifyShiftChange();
    }
    return payment;
  }

  const paymentConfirmMatch = path.match(/^\/api\/payments\/(\d+)\/confirm$/);
  if (paymentConfirmMatch && method === 'POST') {
    const id = Number(paymentConfirmMatch[1]);
    const p = state.payments.find((item) => item.id === id) || state.payments[0];
    if (p) {
      p.status = body?.success === false ? 'Failed' : 'Paid';
      p.isPaid = p.status === 'Paid';
    }
    return p || { ok: true };
  }

  const paymentGetMatch = path.match(/^\/api\/payments\/(\d+)$/);
  if (paymentGetMatch && method === 'GET') {
    const id = Number(paymentGetMatch[1]);
    const found = state.payments.find((p) => p.id === id) || state.payments[0];
    if (!found) fail(404, 'Receipt not found.');
    return found;
  }

  // ——— MENU & BOM ———
  if (path === '/api/menu/ingredients' && method === 'GET') {
    return state.inventory.map((i) => ({ id: i.id, name: i.name, unit: i.unit }));
  }

  const menuItemMatch = path.match(/^\/api\/menu\/(\d+)$/);
  if (menuItemMatch) {
    const id = Number(menuItemMatch[1]);
    const item = state.menuItems.find((m) => m.id === id);
    if (!item) fail(404, 'Menu item not found.');
    if (method === 'GET') {
      return {
        item,
        recipes: (item.recipes || []).map((r) => ({
          ...r,
          inventoryItemName: state.inventory.find((i) => i.id === r.inventoryItemId)?.name || ''
        })),
        inventory: state.inventory.map((i) => ({ id: i.id, name: i.name, unit: i.unit }))
      };
    }
    if (method === 'PUT') {
      Object.assign(item, {
        name: body?.name ?? item.name,
        price: Number(body?.price ?? item.price),
        description: body?.description ?? item.description,
        imageUrl: body?.imageUrl ?? item.imageUrl,
        category: body?.category ?? item.category,
        isAvailable: body?.isAvailable ?? item.isAvailable,
        recipes: body?.recipes ?? item.recipes
      });
      return { id: item.id };
    }
    if (method === 'DELETE') {
      state.menuItems = state.menuItems.filter((m) => m.id !== id);
      return { ok: true };
    }
  }

  if (path === '/api/menu') {
    if (method === 'GET') return state.menuItems;
    if (method === 'POST') {
      const created = {
        id: Math.max(0, ...state.menuItems.map((m) => m.id)) + 1,
        name: body?.name || 'New Drink',
        price: Number(body?.price || 45000),
        description: body?.description || '',
        imageUrl: body?.imageUrl || '/img/pos/salted-coffee.jpg',
        category: body?.category || 'Espresso Bar',
        isAvailable: body?.isAvailable !== false,
        recipes: body?.recipes || []
      };
      state.menuItems.push(created);
      return { id: created.id };
    }
  }

  // ——— INVENTORY ———
  const invStockMatch = path.match(/^\/api\/inventory\/(\d+)\/stock$/);
  if (invStockMatch && method === 'POST') {
    const id = Number(invStockMatch[1]);
    const item = state.inventory.find((i) => i.id === id);
    if (!item) fail(404, 'SKU not found.');
    const qty = Number(body?.quantity || 0);
    if (body?.action === 'deduct') {
      item.quantity = Math.max(0, Number((item.quantity - qty).toFixed(2)));
    } else {
      item.quantity = Number((item.quantity + qty).toFixed(2));
      if (body?.expirationDate) item.expirationDate = new Date(body.expirationDate).toISOString();
    }
    return { ok: true };
  }

  const invIdMatch = path.match(/^\/api\/inventory\/(\d+)$/);
  if (invIdMatch && method === 'DELETE') {
    const id = Number(invIdMatch[1]);
    state.inventory = state.inventory.filter((i) => i.id !== id);
    return { ok: true };
  }

  if (path === '/api/inventory') {
    if (method === 'GET') return state.inventory;
    if (method === 'POST') {
      const created = {
        id: Math.max(0, ...state.inventory.map((i) => i.id)) + 1,
        name: body?.name || 'New Ingredient',
        quantity: Number(body?.quantity || 0),
        unit: body?.unit || 'kg',
        minimumThreshold: Number(body?.minimumThreshold || 1),
        expirationDate: body?.expirationDate
          ? new Date(body.expirationDate).toISOString()
          : new Date(Date.now() + 30 * 86_400_000).toISOString()
      };
      state.inventory.push(created);
      return { id: created.id };
    }
  }

  // ——— CUSTOMERS ———
  const custIdMatch = path.match(/^\/api\/customers\/(\d+)$/);
  if (custIdMatch) {
    const id = Number(custIdMatch[1]);
    const cust = state.customers.find((c) => c.id === id);
    if (!cust) fail(404, 'Customer not found.');
    if (method === 'GET') return cust;
    if (method === 'PUT') {
      Object.assign(cust, body);
      return cust;
    }
    if (method === 'DELETE') {
      state.customers = state.customers.filter((c) => c.id !== id);
      return { ok: true };
    }
  }

  if (path === '/api/customers') {
    if (method === 'GET') {
      const q = (query.get('search') || '').toLowerCase();
      return q
        ? state.customers.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              (c.phoneNumber || '').toLowerCase().includes(q) ||
              (c.email || '').toLowerCase().includes(q)
          )
        : state.customers;
    }
    if (method === 'POST') {
      const created = {
        id: Math.max(0, ...state.customers.map((c) => c.id)) + 1,
        name: body?.name || 'Member',
        phoneNumber: body?.phoneNumber || '',
        email: body?.email || '',
        address: body?.address || '',
        membershipLevel: body?.membershipLevel || 'Bronze',
        loyaltyPoints: 0,
        totalSpent: 0,
        totalOrders: 0,
        joinDate: new Date().toISOString()
      };
      state.customers.unshift(created);
      return created;
    }
  }

  // ——— USERS ———
  const userRoleMatch = path.match(/^\/api\/users\/([^/]+)\/role$/);
  if (userRoleMatch && method === 'POST') {
    const id = userRoleMatch[1];
    const u = state.users.find((item) => item.id === id);
    if (u && body?.status) u.roles = [body.status];
    return { ok: true };
  }

  if (path === '/api/users') {
    if (method === 'GET') {
      return { users: state.users, roles: ['Admin', 'Cashier', 'Waiter'] };
    }
    if (method === 'POST') {
      const role = body?.role || 'Waiter';
      const created = {
        id: `u-${Date.now()}`,
        fullName: body?.fullName || body?.email || 'Staff',
        email: body?.email || '',
        roles: [role]
      };
      state.users.push(created);
      return { id: created.id };
    }
  }

  // ——— REPORTS ———
  if (path === '/api/reports/sales') {
    return buildReports();
  }

  return [];
}
