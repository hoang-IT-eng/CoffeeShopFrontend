import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, vnd } from '../api';

export default function PayPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState('Cash');
  const [customerInfo, setCustomerInfo] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tender, setTender] = useState(200000);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/api/orders/${orderId}`)
      .then((data) => {
        setOrder(data);
        setTender(data.total || 200000);
      })
      .catch((err) => setError(err.message));
  }, [orderId]);

  async function submit(event) {
    event.preventDefault();
    try {
      const payment = await api('/api/payments', {
        method: 'POST',
        body: { orderId: Number(orderId), paymentMethod: method, customerInfo, customerPhone }
      });
      navigate(`/receipts/${payment.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!order) {
    return (
      <div className="p-space-2xl text-center font-label-md text-on-surface-variant">
        Đang tải thông tin thanh toán...
      </div>
    );
  }

  const change = Math.max(0, Number(tender || 0) - order.total);

  return (
    <div className="max-w-4xl mx-auto px-margin-desktop py-space-xl flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-label-sm text-secondary uppercase font-bold">
            Thu Ngân Artisan POS
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
            Thanh Toán Đơn #HD-{order.id}
          </h1>
        </div>
        <Link
          to="/tables"
          className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface font-label-md font-bold no-underline"
        >
          Về sơ đồ bàn
        </Link>
      </div>

      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container">{error}</div>
      )}

      <form
        onSubmit={submit}
        className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
      >
        <div className="md:col-span-7 p-space-xl flex flex-col gap-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
            <div>
              <span className="font-label-sm text-on-surface-variant block">Bàn &amp; Khách hàng</span>
              <strong className="font-headline-sm text-primary">
                {order.tableName || 'Mang đi'} • {order.customerName}
              </strong>
            </div>
            <div className="text-right">
              <span className="font-label-sm text-on-surface-variant block">Tổng cần thu</span>
              <span className="font-price-display-lg text-secondary font-black">
                {vnd(order.total)}
              </span>
            </div>
          </div>

          <div>
            <label className="font-label-md text-on-surface font-bold block mb-space-xs">
              Chọn phương thức thanh toán
            </label>
            <div className="grid grid-cols-2 gap-space-sm">
              <button
                type="button"
                onClick={() => setMethod('Cash')}
                className={`p-space-md rounded-xl flex items-center gap-space-sm font-label-md font-bold transition-all ${
                  method === 'Cash'
                    ? 'bg-primary-container text-on-primary shadow-md'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-secondary-container">payments</span>
                <span>Tiền Mặt Tại Quầy</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('Mobile')}
                className={`p-space-md rounded-xl flex items-center gap-space-sm font-label-md font-bold transition-all ${
                  method === 'Mobile'
                    ? 'bg-primary-container text-on-primary shadow-md'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-secondary-container">
                  qr_code_scanner
                </span>
                <span>VietQR / MoMo</span>
              </button>
            </div>
          </div>

          {method === 'Cash' && (
            <div className="p-space-md rounded-xl bg-surface-container-low space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-on-surface-variant font-bold">
                  Tiền khách đưa:
                </label>
                <div className="flex gap-1">
                  {[order.total, 100000, 200000, 500000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setTender(v)}
                      className="px-2 py-1 rounded bg-surface-container-high text-xs font-mono font-bold"
                    >
                      {vnd(v)}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                value={tender}
                onChange={(e) => setTender(e.target.value)}
                className="w-full px-space-md py-2 rounded-lg bg-surface-container-lowest font-mono font-bold text-primary"
              />
              <div className="flex justify-between font-label-md pt-1">
                <span>Tiền thừa trả khách:</span>
                <strong className="text-[#15803d]">{vnd(change)}</strong>
              </div>
            </div>
          )}

          <div>
            <label className="font-label-sm text-on-surface-variant font-bold block mb-1">
              Số điện thoại hội viên (Tích điểm CRM)
            </label>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Vd: 0908123456 (10.000đ = 1 điểm)"
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-sm text-on-surface-variant font-bold block mb-1">
              Ghi chú thu ngân
            </label>
            <input
              value={customerInfo}
              onChange={(e) => setCustomerInfo(e.target.value)}
              placeholder="Ghi chú hóa đơn..."
              className="w-full px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-14 w-full rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-headline-sm font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">task_alt</span>
            <span>Xác Nhận Thanh Toán &amp; Xuất Phiếu ({vnd(order.total)})</span>
          </button>
        </div>

        <div className="md:col-span-5 bg-surface-container-low p-space-xl flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-primary font-bold mb-space-md">
              Chi tiết món trong đơn
            </h3>
            <div className="space-y-2">
              {(order.details || []).map((d) => (
                <div
                  key={d.id}
                  className="p-space-sm rounded-lg bg-surface-container-lowest flex justify-between items-center"
                >
                  <span>
                    <strong>{d.quantity}x</strong> {d.name}
                  </span>
                  <span className="font-mono font-bold">{vnd(d.price * d.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-space-md rounded-xl bg-primary-container text-on-primary mt-space-lg">
            <span className="font-label-sm text-secondary-fixed block">Máy in hóa đơn nhiệt 80mm</span>
            <span className="font-body-sm text-on-primary-container">
              Tự động mở két tiền &amp; in phiếu ngay sau khi xác nhận.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
