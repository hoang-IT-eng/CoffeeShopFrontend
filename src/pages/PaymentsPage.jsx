import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, vnd, when } from '../api';

export default function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/payments/ready').then(setOrders).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl flex flex-col gap-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>Thu Ngân &amp; Két Tiền</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-bold">Đơn Sẵn Sàng Thu Tiền</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mt-1">
            Quầy Thu Ngân &amp; Thanh Toán Hóa Đơn
          </h1>
        </div>
        <Link
          to="/tables"
          className="px-space-lg py-space-sm rounded-xl bg-primary-container text-on-primary font-label-md font-bold flex items-center gap-2 no-underline shadow-sm"
        >
          <span className="material-symbols-outlined text-secondary-container text-[20px]">table_bar</span>
          <span>Về Sơ Đồ Bàn</span>
        </Link>
      </div>

      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {orders.map((order) => (
          <article
            key={order.id}
            className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col justify-between gap-space-md border border-surface-container-high"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  Đơn #HD-{order.id}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">
                  {order.status}
                </span>
              </div>
              <p className="font-label-md text-on-surface mt-1">
                {order.tableName || 'Mang đi'} • {order.customerName}
              </p>
              <span className="font-label-sm text-on-surface-variant block">
                {when(order.createdAt)}
              </span>

              <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low space-y-1">
                {(order.details || []).map((detail) => (
                  <div
                    key={detail.id}
                    className="flex items-center justify-between font-body-sm text-on-surface"
                  >
                    <span>
                      <strong>{detail.quantity}x</strong> {detail.name}
                    </span>
                    <span className="font-mono font-semibold">
                      {vnd(detail.price * detail.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-space-sm border-t border-surface-container-high flex items-center justify-between">
              <div>
                <span className="font-label-sm text-on-surface-variant block">Cần thu:</span>
                <span className="font-price-display-md text-price-display-md text-secondary font-black">
                  {vnd(order.total)}
                </span>
              </div>
              <Link
                to={`/payments/${order.id}`}
                className="px-space-lg py-space-sm rounded-xl bg-secondary text-on-secondary font-label-md font-bold shadow-md flex items-center gap-1.5 no-underline"
              >
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>Thanh toán</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!orders.length && (
        <div className="p-space-2xl rounded-2xl bg-surface-container-lowest shadow-sm text-center">
          <span className="material-symbols-outlined text-[44px] text-secondary block mb-2">
            task_alt
          </span>
          <h2 className="font-headline-sm text-primary font-bold">
            Hiện không có hóa đơn nào chờ thanh toán
          </h2>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Khi bộ phận KDS bấm &ldquo;Xong toàn bộ&rdquo;, đơn hàng sẽ xuất hiện tại đây để thu tiền.
          </p>
        </div>
      )}
    </div>
  );
}
