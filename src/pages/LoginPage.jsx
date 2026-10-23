import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const [email, setEmail] = useState('newadmin@coffee.com');
  const [password, setPassword] = useState('NewAdmin@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (ready && user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />

      <div className="flex-grow flex items-center justify-center p-margin">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-2xl bg-surface-container-lowest shadow-2xl overflow-hidden border border-surface-container-highest">
          {/* Left Branding Panel */}
          <div className="md:col-span-5 bg-primary-container text-on-primary p-space-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none" />
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">coffee</span>
                </div>
                <div>
                  <span className="font-headline-sm text-headline-sm font-bold block leading-none">
                    Artisan Coffee
                  </span>
                  <span className="font-label-sm text-label-sm text-on-primary-container">
                    POS &amp; Roastery System
                  </span>
                </div>
              </div>

              <div className="mt-space-lg space-y-space-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                  SignalR Realtime v3.4
                </span>
                <h2 className="font-headline-md text-headline-md font-bold leading-snug">
                  Hệ Thống Điều Hành Quán Cà Phê &amp; Chuỗi F&amp;B
                </h2>
                <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
                  Đồng bộ tức thời từ Gọi món tại bàn, Thu ngân VietQR Pro, Màn hình KDS Pha chế đến Định lượng giá vốn BOM &amp; Quản trị kho.
                </p>
              </div>
            </div>

            <div className="pt-space-xl space-y-2 text-on-primary-container font-label-sm text-label-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">verified_user</span>
                <span>Chi nhánh Trung Tâm (HCM-01)</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-lowest/10 text-on-primary">
                <span className="block text-[11px] text-secondary-fixed font-bold uppercase">Tài khoản Demo Admin:</span>
                <span className="font-mono text-xs block mt-0.5">newadmin@coffee.com / NewAdmin@123</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <form className="md:col-span-7 p-space-2xl flex flex-col justify-center gap-space-md" onSubmit={onSubmit}>
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
                Xác thực ca làm việc
              </span>
              <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mt-1">
                Đăng Nhập Hệ Thống
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Nhập thông tin tài khoản nhân sự để mở ca POS hoặc truy cập trung tâm quản trị.
              </p>
            </div>

            {error && (
              <div className="p-space-md rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold">Email nhân viên</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  mail
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                  type="email"
                  placeholder="vd: newadmin@coffee.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold">Mật khẩu / Mã PIN</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  lock
                </span>
                <input
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-label-md text-label-md text-on-surface-variant">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#2c1810] rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Duy trì đăng nhập trong ca</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setEmail('newadmin@coffee.com');
                  setPassword('NewAdmin@123');
                }}
                className="font-label-sm text-label-sm text-secondary hover:underline font-bold"
              >
                Điền nhanh Admin
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-14 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-secondary-container text-[22px]">login</span>
              <span>{loading ? 'Đang xác thực...' : 'Vào Hệ Thống Artisan POS'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
