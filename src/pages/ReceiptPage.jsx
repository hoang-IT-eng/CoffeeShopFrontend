import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, vnd, when } from '../api';

export default function ReceiptPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function load() {
    api(`/api/payments/${id}`).then(setPayment).catch((err) => setError(err.message));
  }

  useEffect(load, [id]);

  async function confirm(success) {
    try {
      await api(`/api/payments/${id}/confirm`, { method: 'POST', body: { success } });
      setMessage(success ? 'Đã xác nhận thanh toán thành công.' : 'Đã đánh dấu thanh toán thất bại.');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) {
    return (
      <div className="p-space-xl max-w-xl mx-auto mt-space-xl rounded-xl bg-error-container text-on-error-container">
        {error}
      </div>
    );
  }
  if (!payment) {
    return (
      <div className="p-space-2xl text-center font-label-md text-on-surface-variant">
        Đang tải hóa đơn...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-margin py-space-xl flex flex-col gap-space-md">
      {message && (
        <div className="p-space-md rounded-xl bg-secondary-fixed text-on-secondary-fixed font-label-md">
          {message}
        </div>
      )}

      <section className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-xl border border-surface-container-high flex flex-col gap-space-md">
        <div className="text-center border-b border-dashed border-outline-variant pb-space-md">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-secondary-container mx-auto flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[26px]">coffee</span>
          </div>
          <h1 className="font-headline-sm text-primary font-bold">ARTISAN COFFEE ROASTERY</h1>
          <p className="font-label-sm text-on-surface-variant">
            Chi nhánh Trung Tâm (HCM-01) • Phiếu Thanh Toán #{payment.id}
          </p>
        </div>

        <div className="space-y-1 font-body-sm text-on-surface-variant">
          <div className="flex justify-between">
            <span>Mã đơn hàng:</span>
            <strong className="text-primary">#HD-{payment.orderId}</strong>
          </div>
          <div className="flex justify-between">
            <span>Bàn phục vụ:</span>
            <strong className="text-primary">{payment.tableName || 'Mang đi'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Khách hàng:</span>
            <strong className="text-primary">
              {payment.customerName || payment.customerInfo || 'Khách lẻ'}
            </strong>
          </div>
          <div className="flex justify-between">
            <span>Thời gian:</span>
            <span>{when(payment.paymentDate)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phương thức:</span>
            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm font-bold">
              {payment.paymentMethod} • {payment.status}
            </span>
          </div>
        </div>

        <div className="border-t border-b border-dashed border-outline-variant py-space-md">
          <table className="w-full text-left font-body-sm">
            <thead>
              <tr className="text-on-surface-variant font-label-sm uppercase">
                <th className="pb-2">Tên món</th>
                <th className="pb-2 text-center">SL</th>
                <th className="pb-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {(payment.details || []).map((detail, index) => (
                <tr key={index}>
                  <td className="py-2 font-semibold text-primary">{detail.name}</td>
                  <td className="py-2 text-center font-mono">x{detail.quantity}</td>
                  <td className="py-2 text-right font-mono font-bold">
                    {vnd(detail.price * detail.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="font-headline-sm text-primary font-bold">TỔNG THANH TOÁN:</span>
          <span className="font-price-display-lg text-secondary font-black">
            {vnd(payment.orderTotal)}
          </span>
        </div>

        {payment.pointsEarned > 0 && (
          <div className="p-space-sm rounded-lg bg-secondary-fixed/40 text-on-secondary-fixed font-label-sm text-center">
            ★ Khách hàng đã được cộng +{payment.pointsEarned} điểm thưởng CRM
          </div>
        )}

        {payment.paymentMethod === 'Mobile' && payment.status !== 'Completed' && (
          <div className="grid grid-cols-2 gap-space-sm pt-2">
            <button
              type="button"
              onClick={() => confirm(true)}
              className="py-3 rounded-xl bg-primary-container text-on-primary font-label-md font-bold"
            >
              Xác nhận đã nhận QR
            </button>
            <button
              type="button"
              onClick={() => confirm(false)}
              className="py-3 rounded-xl bg-error-container text-on-error-container font-label-md font-bold"
            >
              Báo lỗi thanh toán
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-space-sm pt-2 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-label-md font-bold flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>In hóa đơn 80mm</span>
          </button>
          <Link
            to="/tables"
            className="py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md font-bold flex items-center justify-center gap-1 no-underline"
          >
            <span>Về Sơ Đồ Bàn</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
