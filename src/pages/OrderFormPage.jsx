import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, vnd } from '../api';

const fallbackPhotos = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuARtXY7gtUTJ7MhXJwwVa_ZjwftuajXm_r9N5vRvd9ZAcLkN3g5sMbiUL_quPXkQ_PNpY-4nBJn_hAqrc7bVfeZcfpQdyVhVGHk89PEOzRDnOyHV-qRJDyO27eKJGGD0f0l9vUpBZMriZPZ3RiH1QdjunS0LFuyexV62LG77Mabj08vSL6DvQ26w5SuRVR6E3UBKG_vBF9-cWIfqFoRw_H414Xyj3dGhpLnFtIDMhO0rqmgScNcFP_tEw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBmoLmpi9xGbg3EPbSwPsXbnXH96rCnz2L9cLUDA-pZmBHtN7V2tKcILV3I_kMXHWV2_-ghCVXzecUeMe17TRVAkTskrZIcBYckv1lA3DDXiC1ioSnbZQN0R9RiM9B9PSULGcVElDmSxC8Fnuio4sbonOyVaoLLo9cX_HcVpjr64N4nqagRSAHhOEW09gA5pgJIF3hOzs0q6oahngX4oY3eKd0_WJCM6PcILvnW98UkguiBebr7joR0_Q',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDItwaE3R_9an1Ljy5T5rEpoZtupSr6AUQaNizbfqSXQzI5fToL_IVpdidzoApzus3AG_DwFdiCWPMl2mdYX3GgsM6u31FPUNJKs7kkMbMclPNHyjKpAUtnRfwYexN8v-vwiM5OJewnmySo5QGuP53VK_GsdOCi9gGPC3-fbEyIWIqzdqtkgTzf4oqg1uc7c_32xqo9LIc3Ew4CXDiaN6by3ZYCfLs0dIZ5Epmo6zBQR4jff8y_mm49iA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC12OcpjkBP6QEwSfKxczO9s46svVIlvVQot9zKtVXueFrMB98j2gg50B8zJ0XronlejzHgWOpplyAcArCcO0eLqR-VpUNwRqGxxxWgF24zVgk8FFobp9KbNVJH8BVhlsv6fw4jIkW2n4XLThLxJcfeYOF3u91DPnm_V7_oOAfTOKfe6T6nIZaICrJdkot_Uz297EzqAtSLtiHXC_HXDSwJME5p1oondmLwuoFTwn_U4izNMhr0ObujPQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCa4wnXXV4DqogneoPWRB32HW327FvjDCQpfb-9pRbthbOepilpc-O-BQJh8MnD9yd2NmTSdg-_COpAoPENjGp9eBKsVmBtJ-qViyiX-sfVzAt-WI0ukXp0g5B8ZNrzX0ApP2F3FcySF_HPhlUjfxwmK24e0PavXmmjPOB-vKOQK-zaNUKKqPOID2XYciJQR1-inDxfbDXgJc89KKkDmhYjnnASuvvj0OCOxgH7L27XOIlDl7s26GRk3Q',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDKq8D3ZLzMWJ5fnTODNEET7oJrWRDYsSLI1b2pl5qR7bd4enTNb1fSimfU0hK4xgbC8BwjeXqdWIJIYXXTmI_7kTs8CltuRbBIWwzhp6VhoICmExzbnNjH710HnHZrWw7VxpxIpugFywz6ZAFnqL-dHfU7RgAKXbEaL9yfcNdIwZYpNm45aKkg4Iy55WclzLLmjtRWvJISlClmU2Y3s8ycBJoUfOGMHTP61YTT34RpLwCx2AZaaZIAGQ'
];

function skuFor(name = '', id = 1) {
  const words = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  const letters = words.slice(0, 3).map((w) => w[0]?.toUpperCase() || '').join('');
  return letters || `CF${id}`;
}

export default function OrderFormPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [form, setForm] = useState(null);
  const [category, setCategory] = useState('Tất cả');
  const [query, setQuery] = useState('');
  const [serviceMode, setServiceMode] = useState('dinein');
  const [tableId, setTableId] = useState(params.get('tableId') || '');
  const [customerName, setCustomerName] = useState('Khách lẻ');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Modifier Modal State
  const [modItem, setModItem] = useState(null);
  const [modSize, setModSize] = useState('Size M');
  const [modSugar, setModSugar] = useState('50% Đường');
  const [modIce, setModIce] = useState('70% Đá');

  // Checkout Modal State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState('vietqr');
  const [cashGiven, setCashGiven] = useState(200000);

  useEffect(() => {
    api('/api/orders/form')
      .then((data) => {
        setForm(data);
        if (!tableId && data.tables?.length) {
          setTableId(String(data.tables[0].id));
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'F2') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'F9' && cart.length) {
        e.preventDefault();
        setCheckoutOpen(true);
      } else if (e.key === 'Escape') {
        setModItem(null);
        setCheckoutOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cart.length]);

  const categories = useMemo(() => {
    const names = new Set((form?.menuItems || []).map((item) => item.category || 'Khác'));
    return ['Tất cả', ...names];
  }, [form]);

  const visible = (form?.menuItems || []).filter((item) => {
    const byCategory = category === 'Tất cả' || item.category === category;
    const q = query.toLowerCase();
    const byName =
      item.name.toLowerCase().includes(q) ||
      skuFor(item.name, item.id).toLowerCase().includes(q);
    return byCategory && byName;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = subtotal;
  const table = form?.tables?.find((item) => String(item.id) === String(tableId));

  function addItem(item, note = 'Size M • 50% Đường • 70% Đá') {
    setCart((current) => {
      const found = current.find((line) => line.menuItemId === item.id);
      if (found) {
        return current.map((line) =>
          line.menuItemId === item.id ? { ...line, quantity: line.quantity + 1, note } : line
        );
      }
      return [
        ...current,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          note
        }
      ];
    });
  }

  function changeQty(menuItemId, delta) {
    setCart((current) =>
      current
        .map((line) =>
          line.menuItemId === menuItemId ? { ...line, quantity: line.quantity + delta } : line
        )
        .filter((line) => line.quantity > 0)
    );
  }

  function removeLine(menuItemId) {
    setCart((current) => current.filter((line) => line.menuItemId !== menuItemId));
  }

  function confirmModifier() {
    if (!modItem) return;
    addItem(modItem, `${modSize} • ${modSugar} • ${modIce}`);
    setModItem(null);
  }

  async function submitOrder(andPay = false) {
    if (!cart.length) return;
    setError('');
    setSubmitting(true);
    try {
      const selectedTableId = Number(tableId || form?.tables?.[0]?.id || 0);
      const result = await api('/api/orders', {
        method: 'POST',
        body: {
          tableId: selectedTableId,
          customerName: customerName || 'Khách lẻ',
          items: cart.map((line) => ({ menuItemId: line.menuItemId, quantity: line.quantity }))
        }
      });
      setCheckoutOpen(false);
      if (andPay) {
        navigate(`/payments/${result.id}`);
      } else {
        navigate(`/orders`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!form) {
    return (
      <div className="p-space-2xl text-center font-label-md text-on-surface-variant">
        Đang mở quầy POS bán hàng...
      </div>
    );
  }

  const changeAmount = Number(cashGiven || 0) - total;

  return (
    <div className="w-full px-gutter-desktop py-space-md">
      {error && (
        <div className="mb-space-md p-space-md rounded-xl bg-error-container text-on-error-container font-label-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="font-bold">
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-space-lg items-start">
        {/* CỘT TRÁI & GIỮA: KHU VỰC CHỌN MÓN (Chiếm ~68%) */}
        <div className="w-full lg:w-[68%] flex flex-col gap-space-md">
          {/* Thanh điều khiển & Tìm kiếm đa năng */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row gap-space-md items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-16 py-space-sm bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-bright focus:shadow-[0_0_0_2px_#fe932c] transition-all"
                placeholder="Tìm món nhanh (F2) hoặc mã viết tắt: CFM, BAX, TDO..."
                type="text"
              />
              <span className="absolute right-space-sm top-1/2 -translate-y-1/2 px-space-xs py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant font-mono">
                F2
              </span>
            </div>

            {/* Lựa chọn loại hình phục vụ */}
            <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setServiceMode('dinein')}
                className={`px-space-md py-space-sm rounded-lg font-label-md text-label-md flex items-center gap-1 transition-all ${
                  serviceMode === 'dinein'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
                <span>Tại bàn ({table?.name || 'Chọn bàn'})</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceMode('takeaway')}
                className={`px-space-md py-space-sm rounded-lg font-label-md text-label-md flex items-center gap-1 transition-all ${
                  serviceMode === 'takeaway'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">local_mall</span>
                <span>Mang đi</span>
              </button>
              <button
                type="button"
                onClick={() => setServiceMode('delivery')}
                className={`px-space-md py-space-sm rounded-lg font-label-md text-label-md flex items-center gap-1 transition-all ${
                  serviceMode === 'delivery'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                <span>Giao hàng</span>
              </button>
            </div>
          </div>

          {/* Thanh lọc danh mục món (Category Pills) */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 scrollbar-none">
            {categories.map((name) => {
              const count =
                name === 'Tất cả'
                  ? (form.menuItems || []).length
                  : (form.menuItems || []).filter((i) => (i.category || 'Khác') === name).length;
              const active = category === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  className={`px-space-md py-space-sm rounded-full font-label-md text-label-md shrink-0 transition-all flex items-center gap-1 ${
                    active
                      ? 'bg-secondary text-on-secondary shadow-sm font-bold'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span>{name}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-label-sm text-label-sm ${
                      active
                        ? 'bg-surface-container-lowest/30 text-on-secondary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Lưới sản phẩm (Product Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-space-md">
            {visible.map((item, idx) => {
              const photo = item.imageUrl || fallbackPhotos[idx % fallbackPhotos.length];
              return (
                <div
                  key={item.id}
                  onClick={() => addItem(item)}
                  className="cursor-pointer group bg-surface-container-lowest rounded-xl p-space-sm shadow-sm hover:shadow-md hover:bg-secondary-fixed/20 transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  {idx < 2 && (
                    <span className="absolute top-2 right-2 z-10 px-space-xs py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                      Bán chạy
                    </span>
                  )}
                  <div className="w-full h-32 rounded-lg bg-surface-container mb-space-sm overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={photo}
                      alt={item.name}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-label-sm text-label-sm text-secondary font-mono">
                        {skuFor(item.name, item.id)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline" />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {item.category || 'Cà phê'}
                      </span>
                    </div>
                    <h3 className="font-label-lg text-label-lg text-on-surface font-bold leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                      {item.description || 'Pha chế chuẩn vị Artisan Coffee'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-space-md pt-space-xs">
                    <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                      {vnd(item.price)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="Tùy chỉnh Size / Đường / Đá"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModItem(item);
                        }}
                        className="w-9 h-9 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem(item);
                        }}
                        className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: KHU VỰC HÓA ĐƠN & ORDER (Chiếm ~32%, Thanh Cố Định) */}
        <div className="w-full lg:w-[32%] flex flex-col bg-surface-container-lowest rounded-xl shadow-md overflow-hidden sticky top-24">
          {/* Header đơn hàng */}
          <div className="p-space-md bg-surface-container-low flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">#HD-POS</span>
                  <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                    {table ? `${table.name} (${table.area})` : 'Chưa chọn bàn'}
                  </span>
                </div>
                <div className="flex items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">group</span> {customerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> Hôm nay
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCart([])}
                className="p-2 rounded-lg bg-surface-container-high text-error hover:bg-error-container transition-colors"
                title="Xóa tất cả món"
              >
                <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
              </button>
            </div>

            {/* Chọn bàn & Tên khách */}
            <div className="grid grid-cols-2 gap-space-xs pt-1">
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="px-2.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              >
                <option value="">-- Chọn bàn --</option>
                {(form.tables || []).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} • {t.area}
                  </option>
                ))}
              </select>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tên khách hàng"
                className="px-2.5 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-label-sm text-label-sm focus:outline-none focus:ring-1 focus:ring-secondary"
                required
              />
            </div>
          </div>

          {/* Danh sách các món trong Order (Order Items List) */}
          <div className="p-space-md flex flex-col gap-space-sm max-h-[360px] overflow-y-auto">
            {cart.map((line) => (
              <div
                key={line.menuItemId}
                className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <div className="font-label-lg text-label-lg text-on-surface font-bold">{line.name}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant italic">
                      {line.note || 'Size M • 50% Đường • 70% Đá'}
                    </div>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-primary font-bold text-right shrink-0">
                    {vnd(line.price * line.quantity)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1 bg-surface-container-lowest rounded-lg p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => changeQty(line.menuItemId, -1)}
                      className="w-7 h-7 rounded bg-surface-container flex items-center justify-center hover:bg-surface-container-high text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="w-8 text-center font-label-md text-label-md font-bold">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQty(line.menuItemId, 1)}
                      className="w-7 h-7 rounded bg-surface-container flex items-center justify-center hover:bg-surface-container-high text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setModItem({ id: line.menuItemId, name: line.name, price: line.price })}
                      className="p-1.5 rounded text-outline hover:text-on-surface hover:bg-surface-container"
                      title="Ghi chú"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLine(line.menuItemId)}
                      className="p-1.5 rounded text-error hover:bg-error-container"
                      title="Xóa món"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!cart.length && (
              <div className="py-space-xl text-center text-on-surface-variant font-body-sm">
                <span className="material-symbols-outlined text-[36px] text-outline block mb-1">
                  shopping_basket
                </span>
                Chạm vào món bên trái để thêm vào hóa đơn.
              </div>
            )}
          </div>

          {/* Tóm tắt chi phí (Billing Calculation) */}
          <div className="p-space-md bg-surface-container-high flex flex-col gap-space-xs">
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>
                Tạm tính ({cart.length} món - {totalQty} ly/đĩa):
              </span>
              <span className="font-bold text-on-surface">{vnd(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-secondary font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                <span>Khuyến mãi hội viên:</span>
              </span>
              <span className="font-bold">0đ</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>Thuế GTGT / VAT (8% đã gồm):</span>
              <span>{vnd(Math.round(total * 0.08))}</span>
            </div>
            <div className="pt-space-xs mt-space-xs flex items-baseline justify-between">
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-primary font-bold">TỔNG THANH TOÁN:</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Đồng bộ KDS &amp; Thu ngân
                </span>
              </div>
              <span className="font-price-display-lg text-price-display-lg text-secondary font-black">
                {vnd(total)}
              </span>
            </div>
          </div>

          {/* Bảng phím thao tác thu ngân 1 chạm & Nút hành động chính */}
          <div className="p-space-md bg-surface-container-lowest flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => {
                  setCashGiven(total);
                  setCheckoutOpen(true);
                }}
                className="flex-1 py-space-xs bg-surface-container-high hover:bg-secondary-fixed rounded-lg font-label-md text-label-md text-on-surface font-semibold text-center transition-colors disabled:opacity-50"
              >
                Đủ tiền
              </button>
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => {
                  setCashGiven(200000);
                  setCheckoutOpen(true);
                }}
                className="flex-1 py-space-xs bg-surface-container-high hover:bg-secondary-fixed rounded-lg font-label-md text-label-md text-on-surface font-semibold text-center transition-colors disabled:opacity-50"
              >
                200.000đ
              </button>
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => {
                  setCashGiven(500000);
                  setCheckoutOpen(true);
                }}
                className="flex-1 py-space-xs bg-surface-container-high hover:bg-secondary-fixed rounded-lg font-label-md text-label-md text-on-surface font-semibold text-center transition-colors disabled:opacity-50"
              >
                500.000đ
              </button>
            </div>

            <div className="grid grid-cols-2 gap-space-xs">
              <Link
                to="/tables"
                className="py-space-sm px-space-xs bg-surface-container hover:bg-surface-container-high rounded-lg font-label-md text-label-md text-on-surface font-medium flex items-center justify-center gap-1 transition-colors no-underline"
              >
                <span className="material-symbols-outlined text-[18px]">call_split</span>
                <span>Sơ Đồ Bàn</span>
              </Link>
              <button
                type="button"
                disabled={!cart.length || submitting}
                onClick={() => submitOrder(false)}
                className="py-space-sm px-space-xs bg-primary-container text-on-primary hover:bg-primary rounded-lg font-label-md text-label-md font-medium flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>Gửi Bar/Bếp (F4)</span>
              </button>
            </div>

            <button
              type="button"
              disabled={!cart.length || submitting}
              onClick={() => {
                setCashGiven(total || 200000);
                setCheckoutOpen(true);
              }}
              className="w-full h-14 bg-secondary hover:bg-secondary-container active:scale-[0.99] text-on-secondary rounded-xl font-headline-sm text-headline-sm font-bold flex items-center justify-between px-space-lg shadow-md transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px]">payments</span>
                <span>THANH TOÁN (F9)</span>
              </div>
              <span className="px-space-sm py-1 rounded-lg bg-surface-container-lowest/25 font-headline-sm text-headline-sm font-black">
                {vnd(total)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* POPUP CẤU HÌNH NHANH (MODIFIER MODAL) */}
      {modItem && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
              <div>
                <h4 className="font-headline-md text-headline-md text-primary font-bold">{modItem.name}</h4>
                <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                  {vnd(modItem.price)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModItem(null)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-space-lg flex flex-col gap-space-lg max-h-[60vh] overflow-y-auto">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant mb-space-xs block">
                  1. Chọn Size Cốc:
                </label>
                <div className="grid grid-cols-3 gap-space-sm">
                  {['Size S (Vừa)', 'Size M', 'Size L (+10k)'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setModSize(s)}
                      className={`py-space-sm px-space-xs rounded-xl font-label-md text-label-md text-center ${
                        modSize === s
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface-variant mb-space-xs block">
                  2. Mức Đường:
                </label>
                <div className="grid grid-cols-4 gap-space-xs">
                  {['Không đường', '30% Đường', '50% Đường', '100% Đường'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setModSugar(s)}
                      className={`py-space-xs rounded-lg font-label-sm text-label-sm ${
                        modSugar === s
                          ? 'bg-secondary text-on-secondary font-bold'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-label-md text-label-md text-on-surface-variant mb-space-xs block">
                  3. Mức Đá:
                </label>
                <div className="grid grid-cols-4 gap-space-xs">
                  {['Không đá', '30% Đá', '70% Đá', '100% Đá'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setModIce(s)}
                      className={`py-space-xs rounded-lg font-label-sm text-label-sm ${
                        modIce === s
                          ? 'bg-secondary text-on-secondary font-bold'
                          : 'bg-surface-container text-on-surface'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-space-lg bg-surface-container-low flex items-center gap-space-md">
              <button
                type="button"
                onClick={() => setModItem(null)}
                className="w-1/3 py-space-sm rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmModifier}
                className="w-2/3 py-space-sm rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-bold shadow-md hover:bg-primary-container transition-colors"
              >
                Xác nhận thêm ({vnd(modItem.price)})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP / MODAL THANH TOÁN TÍCH HỢP VIETQR & SIGNALR REALTIME */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">
                    Thanh Toán Đơn POS
                  </h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {table?.name || 'Mang đi'} • Khách: {customerName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-space-lg grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="flex flex-col gap-space-md">
                <label className="font-label-md text-label-md text-on-surface-variant">
                  Chọn phương thức:
                </label>
                <div className="grid grid-cols-3 gap-space-xs">
                  {[
                    { id: 'vietqr', icon: 'qr_code_scanner', label: 'VietQR Pro' },
                    { id: 'cash', icon: 'attach_money', label: 'Tiền mặt' },
                    { id: 'pos', icon: 'credit_card', label: 'Thẻ / POS' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentTab(tab.id)}
                      className={`py-space-sm px-space-xs rounded-xl font-label-md text-label-md flex flex-col items-center gap-1 ${
                        paymentTab === tab.id
                          ? 'bg-primary text-on-primary font-bold shadow-sm'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Tổng tiền cần thu:</span>
                  <span className="font-price-display-lg text-price-display-lg text-secondary font-black">
                    {vnd(total)}
                  </span>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Tiền khách đưa:</label>
                  <input
                    type="number"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    className="w-full px-space-md py-space-sm bg-surface-container-low rounded-lg font-headline-sm text-headline-sm text-primary font-mono font-bold focus:outline-none focus:bg-surface-bright"
                  />
                  <div className="p-space-sm bg-surface-container rounded-lg flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant">Tiền thối lại:</span>
                    <span
                      className={`font-headline-sm text-headline-sm font-bold ${
                        changeAmount >= 0 ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      {changeAmount >= 0 ? vnd(changeAmount) : `Thiếu ${vnd(Math.abs(changeAmount))}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold mb-space-sm">
                  Tự động sinh mã VietQR 24/7
                </div>
                <div className="w-48 h-48 bg-surface-container-lowest p-2 rounded-xl shadow-md flex flex-col items-center justify-center relative">
                  <svg className="w-40 h-40 text-primary" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" />
                    <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" />
                    <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" />
                    <rect height="15" width="8" x="45" y="10" />
                    <rect height="8" width="8" x="45" y="35" />
                    <rect height="10" width="12" x="45" y="50" />
                    <rect height="8" width="20" x="65" y="45" />
                    <rect height="25" width="10" x="60" y="60" />
                    <rect height="15" width="15" x="75" y="70" />
                    <rect height="8" width="12" x="25" y="45" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-8 h-8 rounded-full bg-surface-container-lowest p-1 shadow flex items-center justify-center text-secondary font-black text-[10px]">
                      CF
                    </span>
                  </div>
                </div>
                <div className="mt-space-sm flex flex-col items-center">
                  <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary font-semibold">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                    <span>Đang chờ chuyển khoản (SignalR)...</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Nội dung: <strong className="text-on-surface">ARTISAN {table?.name || 'POS'}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="px-space-lg py-space-sm rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              >
                Đóng cửa sổ
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => submitOrder(true)}
                className="px-space-xl py-space-sm rounded-xl bg-secondary text-on-secondary font-headline-sm text-headline-sm font-bold shadow-md hover:bg-secondary-container transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                <span>{submitting ? 'Đang tạo đơn...' : 'Hoàn Tất & Chuyển Thu Ngân'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
