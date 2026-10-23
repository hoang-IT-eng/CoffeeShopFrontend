import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, vnd } from '../api';

export default function ShiftPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [size, setSize] = useState('Size M');
  const [ice, setIce] = useState('70% Đá');
  const [sugar, setSugar] = useState('70% Đường');
  const [topping, setTopping] = useState(true);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/orders/form')
      .then((data) => {
        setForm(data);
        if (data.tables?.length) setSelectedTableId(String(data.tables[0].id));
        if (data.menuItems?.length) setActiveItem(data.menuItems[0]);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (!form) {
    return (
      <div className="p-space-2xl text-center font-label-md text-on-surface-variant">
        Đang tải giao diện Mobile Waiter Order Tại Bàn...
      </div>
    );
  }

  const selectedTable =
    form.tables?.find((t) => String(t.id) === String(selectedTableId)) || form.tables?.[0];
  const filteredMenu = (form.menuItems || []).filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  function addToTicket() {
    if (!activeItem) return;
    setCart((curr) => [
      ...curr,
      {
        menuItemId: activeItem.id,
        name: activeItem.name,
        price: activeItem.price,
        quantity: qty,
        meta: `${size} • ${ice} • ${sugar}${topping ? ' • +Kem Muối Béo' : ''}${
          note ? ` • ${note}` : ''
        }`
      }
    ]);
    setQty(1);
  }

  async function dispatchOrder() {
    if (!cart.length || !selectedTable) return;
    try {
      const res = await api('/api/orders', {
        method: 'POST',
        body: {
          tableId: selectedTable.id,
          customerName: `Khách ${selectedTable.name}`,
          items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity }))
        }
      });
      navigate(`/orders/${res.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <div className="max-w-lg mx-auto px-margin py-space-md pb-32 space-y-4">
      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container">{error}</div>
      )}

      {/* Status & Table Context Banner */}
      <section className="bg-surface-container rounded-2xl p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              Waiter Handheld • Đang mở bàn
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              Ngồi 12 phút
            </span>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-xs">
            <span className="material-symbols-outlined text-[15px] animate-pulse">sensors</span>
            <span className="font-label-sm text-[11px] leading-tight font-semibold">
              Bar Sync Live
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-container-lowest p-2.5 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-headline-sm text-headline-sm">
              {selectedTable?.name?.slice(-2) || '04'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-label-lg text-label-lg text-primary font-bold">
                  Bàn {selectedTable?.name || 'T1-04'}
                </h2>
                <span className="text-on-surface-variant font-body-sm text-body-sm">
                  • {selectedTable?.area || 'Tầng 1'}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary font-semibold">
                4 Khách đang dùng
              </p>
            </div>
          </div>

          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            className="h-10 px-3 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold outline-none"
          >
            {(form.tables || []).map((t) => (
              <option key={t.id} value={t.id}>
                Đổi: {t.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Quick Search & Dynamic Horizontal Item Selector */}
      <section className="space-y-2.5">
        <div className="relative flex items-center">
          <span className="absolute left-3.5 material-symbols-outlined text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-11 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-xl shadow-xs outline-none focus:bg-surface-bright focus:shadow-md transition-all placeholder:text-outline"
            placeholder="Tìm tên món (vd: muối, latte, đào, croissant)..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {filteredMenu.map((item) => {
            const isSelected = activeItem?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItem(item)}
                className={`h-11 px-4 rounded-full font-label-md text-label-md flex-shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">coffee</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Customizer Bottom Sheet: Active Item Customization */}
      {activeItem && (
        <section className="bg-surface-container-lowest rounded-3xl p-4 shadow-md space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
                Tùy biến món tại bàn
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
              Đang order {selectedTable?.name}
            </span>
          </div>

          <div className="flex gap-3 bg-surface-container-low p-3 rounded-2xl">
            <img
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-xs"
              src={
                activeItem.imageUrl ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCENVvixsHlIy53_WmfU6bwPngEPW_bRGx0oNCYLHC9m393rkO9vpdklQPcb9Jw4lHkjw7hQU5janOJaV8_xrbpFa4ixY8ot-9unmpeKUgppda2hS4dhPFigo_PSQZH-PTaxgFOBJcCQU2TjJD7gVzozqFAMBTYp5eoGsOgGg2jwG96mIihsiKsf8dQb5n9rC1PSKqhA32rRDbgSgQCmehxXRctSqR5brxJ7GBqujkf_ghKuEcl6X1PbA'
              }
              alt={activeItem.name}
            />
            <div className="flex flex-col justify-between min-w-0">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                  {activeItem.name}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                  {activeItem.description || 'Espresso Robusta Đắk Lắk sánh đặc, kem béo muối hồng'}
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-price-display-md text-price-display-md text-secondary font-bold">
                  {vnd(activeItem.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md text-primary font-bold">
                Kích cỡ (Size ly)
              </label>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Bắt buộc chọn 1
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Size M', 'Size L (+8k)', 'Nóng (Hot)'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`py-2 px-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                    size === s
                      ? 'bg-secondary-fixed/60 text-on-secondary-fixed font-bold shadow-xs'
                      : 'bg-surface-container text-on-surface'
                  }`}
                >
                  <span className="font-label-md text-label-md">{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md text-primary font-bold">
                Mức đá lạnh
              </label>
              <span className="font-label-sm text-label-sm text-secondary">Đã chọn: {ice}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {['100% Đá', '70% Đá', '30% Đá', 'Không Đá'].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIce(i)}
                  className={`h-11 rounded-xl font-label-sm text-label-sm transition-transform ${
                    ice === i
                      ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Sweetness Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md text-primary font-bold">
                Độ ngọt (Sữa &amp; Đường)
              </label>
              <span className="font-label-sm text-label-sm text-secondary">Đã chọn: {sugar}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {['100% Ngọt', '70% Đường', '50% Đường', 'Ít/Không'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSugar(s)}
                  className={`h-11 rounded-xl font-label-sm text-label-sm transition-transform ${
                    sugar === s
                      ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Extra Toppings */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-primary font-bold block">
              Topping thêm (Thêm béo &amp; giòn)
            </label>
            <button
              type="button"
              onClick={() => setTopping((t) => !t)}
              className={`w-full h-12 px-3.5 rounded-xl flex items-center justify-between transition-all ${
                topping
                  ? 'bg-secondary-fixed/40 text-on-secondary-fixed'
                  : 'bg-surface-container text-on-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  {topping ? 'check_circle' : 'add_circle'}
                </span>
                <span className="font-label-md text-label-md font-semibold">Thêm Kem Muối Béo</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-secondary">+10.000đ</span>
            </button>
          </div>

          {/* Quick Note */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-primary font-bold block">
              Ghi chú pha chế (Bếp / Bar)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-11 px-3 bg-surface-container text-on-surface font-body-sm text-body-sm rounded-xl outline-none placeholder:text-outline"
              placeholder="Nhập ghi chú tùy biến khác..."
              type="text"
            />
          </div>

          {/* Quantity Stepper & Add to Ticket CTA */}
          <div className="pt-2 flex items-center gap-3">
            <div className="h-12 bg-surface-container rounded-2xl flex items-center px-2 shadow-xs">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-surface-container-lowest text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <span className="w-10 text-center font-headline-sm text-headline-sm text-primary font-bold">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-surface-container-lowest text-on-surface flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
            <button
              type="button"
              onClick={addToTicket}
              className="flex-1 h-12 bg-secondary text-on-secondary rounded-2xl px-4 flex items-center justify-between shadow-md font-bold"
            >
              <span className="font-label-lg text-label-lg">Thêm Vào Phiếu</span>
              <span className="font-price-display-md text-price-display-md">
                {vnd(activeItem.price * qty)}
              </span>
            </button>
          </div>
        </section>
      )}

      {/* Live Mini Ticket Order List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              receipt_long
            </span>
            <h3 className="font-label-lg text-label-lg text-primary font-bold">
              Đơn hiện tại {selectedTable?.name}
            </h3>
          </div>
          <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface">
            {cart.length} món
          </span>
        </div>

        <div className="space-y-2.5">
          {cart.map((c, index) => (
            <div
              key={`${c.menuItemId}-${index}`}
              className="bg-surface-container-lowest p-3.5 rounded-2xl shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center flex-shrink-0 font-bold">
                    {c.quantity}x
                  </span>
                  <div>
                    <h4 className="font-label-lg text-label-lg text-primary font-bold">{c.name}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{c.meta}</p>
                  </div>
                </div>
                <span className="font-price-display-md text-price-display-md text-primary font-bold">
                  {vnd(c.price * c.quantity)}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCart((curr) => curr.filter((_, i) => i !== index))}
                  className="h-8 w-8 rounded-lg bg-surface-container text-error flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={!cart.length}
          onClick={dispatchOrder}
          className="w-full h-14 bg-primary-container text-on-primary rounded-2xl p-2 flex items-center justify-between shadow-xl disabled:opacity-50"
        >
          <div className="flex items-center gap-3 pl-2.5">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">bolt</span>
            </div>
            <div className="text-left">
              <span className="font-label-lg text-label-lg uppercase tracking-wide block font-bold">
                Gửi Bếp Bar Ngay
              </span>
              <span className="text-on-primary-container font-label-sm text-[11px] leading-tight block">
                Quầy Bar nhận trong 1s
              </span>
            </div>
          </div>
          <div className="h-10 px-3.5 rounded-xl bg-surface-container-lowest/15 flex items-center gap-1.5 mr-1 text-on-primary font-bold">
            <span>{vnd(total)}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </button>
      </section>
    </div>
  );
}
