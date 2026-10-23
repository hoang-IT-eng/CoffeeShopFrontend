import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

const blank = {
  name: '',
  phoneNumber: '',
  email: '',
  address: '',
  membershipLevel: 'Bronze'
};

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api(`/api/customers/${id}`)
      .then(setForm)
      .catch((err) => setError(err.message));
  }, [id]);

  async function submit(event) {
    event.preventDefault();
    try {
      if (id) await api(`/api/customers/${id}`, { method: 'PUT', body: form });
      else await api('/api/customers', { method: 'POST', body: form });
      navigate('/customers');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-margin-desktop py-space-xl flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm">
            <Link to="/customers" className="hover:text-secondary no-underline">
              Khách Hàng &amp; Khuyến Mãi
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-bold">
              {id ? 'Cập nhật hội viên' : 'Đăng ký hội viên mới'}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
            {id ? `Hồ Sơ Hội Viên: ${form.name}` : 'Đăng Ký Hội Viên Thân Thiết'}
          </h1>
        </div>
        <Link
          to="/customers"
          className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface font-label-md font-bold no-underline"
        >
          Quay lại
        </Link>
      </div>

      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container">
          {error}
        </div>
      )}

      <form
        onSubmit={submit}
        className="bg-surface-container-lowest rounded-2xl shadow-lg p-space-xl flex flex-col gap-space-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-bold">Họ và tên khách hàng</label>
            <input
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Vd: Nguyễn Hoàng Nam"
              className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-bold">
              Số điện thoại (Tích điểm POS)
            </label>
            <input
              value={form.phoneNumber || ''}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder="Vd: 0908123456"
              className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-bold">Email</label>
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nam.nguyen@email.com"
              className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-bold">Hạng thẻ hội viên</label>
            <select
              value={form.membershipLevel || 'Bronze'}
              onChange={(e) => setForm({ ...form, membershipLevel: e.target.value })}
              className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-label-md"
            >
              <option value="Bronze">Đồng / Member (Bronze)</option>
              <option value="Silver">Hạng Bạc (Silver)</option>
              <option value="Gold">Hạng Vàng (Gold)</option>
              <option value="Diamond">Kim Cương (Diamond)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-md text-on-surface font-bold">
            Địa chỉ / Ghi chú sở thích đồ uống
          </label>
          <input
            value={form.address || ''}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Vd: Quận 1, TP.HCM • Thích Cà phê muối ít ngọt"
            className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div className="flex justify-end gap-space-sm pt-2">
          <Link
            to="/customers"
            className="px-space-lg py-3 rounded-xl bg-surface-container text-on-surface font-label-md font-bold no-underline"
          >
            Hủy
          </Link>
          <button
            type="submit"
            className="px-space-xl py-3 rounded-xl bg-primary-container text-on-primary font-label-md font-bold shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-secondary-container text-[18px]">
              save
            </span>
            <span>Lưu Hồ Sơ Hội Viên</span>
          </button>
        </div>
      </form>
    </div>
  );
}
