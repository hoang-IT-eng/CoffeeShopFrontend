import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, vnd, when } from '../api';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/api/orders/${id}`).then(setOrder).catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="p-space-xl max-w-3xl mx-auto mt-space-xl rounded-xl bg-error-container text-on-error-container">
        {error}
      </div>
    );
  }
  if (!order) {
    return (
      <div className="p-space-2xl text-center font-label-md text-on-surface-variant">
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-desktop py-space-xl flex flex-col gap-space-lg">
      <div className="flex items-center justify-between flex-wrap gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <Link to="/orders" className="hover:text-secondary no-underline">
              KDS Pha Chế &amp; Đơn Hàng
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-bold">Phiếu #HD-{order.id}</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
            Chi Tiết Hóa Đơn #HD-{order.id}
          </h1>
        </div>

        <div className="flex items-center gap-space-sm">
          <Link
            to="/orders"
            className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface font-label-md font-bold flex items-center gap-1 no-underline"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Quay lại KDS</span>
          </Link>
          <Link
            to={`/payments/${order.id}`}
            className="px-space-lg py-space-sm rounded-lg bg-secondary text-on-secondary font-label-md font-bold shadow-md flex items-center gap-1 no-underline"
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span>Thanh toán đơn này</span>
          </Link>
        </div>
      </div>

      <section className="bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
        <div className="p-space-lg bg-primary-container text-on-primary flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container font-headline-sm font-bold flex items-center justify-center">
              {order.tableName || 'POS'}
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold">
                Bàn: {order.tableName || 'Mang đi'} • Khách: {order.customerName}
              </h2>
              <span className="font-label-sm text-label-sm text-on-primary-container">
                Thời gian tạo: {when(order.createdAt)}
              </span>
            </div>
          </div>
          <span className="px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">
            Trạng thái: {order.status}
          </span>
        </div>

        <div className="p-space-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase">
                <th className="py-3 px-space-md">Tên món</th>
                <th className="py-3 px-space-md text-center">Số lượng</th>
                <th className="py-3 px-space-md text-right">Đơn giá</th>
                <th className="py-3 px-space-md text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-md">
              {(order.details || []).map((detail) => (
                <tr key={detail.id} className="hover:bg-surface-container-low/50">
                  <td className="py-3.5 px-space-md font-bold text-primary">{detail.name}</td>
                  <td className="py-3.5 px-space-md text-center font-mono font-bold">
                    x{detail.quantity}
                  </td>
                  <td className="py-3.5 px-space-md text-right font-mono">{vnd(detail.price)}</td>
                  <td className="py-3.5 px-space-md text-right font-mono font-bold text-secondary">
                    {vnd(detail.price * detail.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-space-lg p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              Tổng cộng thanh toán:
            </span>
            <span className="font-price-display-lg text-price-display-lg text-secondary font-black">
              {vnd(order.total)}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
