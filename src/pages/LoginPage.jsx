import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

const PRESETS = [
  { key: 'admin', labelKey: 'ops.login.presetAdmin', email: 'newadmin@coffee.com', pass: 'NewAdmin@123' },
  { key: 'cashier', labelKey: 'ops.login.presetCashier', email: 'cashier@coffee.com', pass: 'Cashier@123' },
  { key: 'waiter', labelKey: 'ops.login.presetWaiter', email: 'waiter@coffee.com', pass: 'Waiter@123' }
];

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const { lang, setLang, t } = useLang();
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
    <div
      className="ops-shell"
      style={{
        minHeight: '100vh',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 920,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14
        }}
      >
        <Link to="/" className="ops-btn ops-btn--sm">
          <OpsIcon name="arrowLeft" size={15} />
          <span>{t('ops.shell.navStorefront')}</span>
        </Link>

        <div className="ops-lang-toggle" role="group" aria-label="Language">
          <button
            type="button"
            className={lang === 'vi' ? 'is-on' : ''}
            onClick={() => setLang('vi')}
          >
            VI
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'is-on' : ''}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 920,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid var(--an-line)',
          background: 'var(--an-panel)',
          boxShadow: '0 22px 48px rgba(43, 29, 20, 0.14)'
        }}
      >
        {/* Editorial Roastery Column */}
        <div
          style={{
            background: '#2b1d14',
            color: '#f5ecdf',
            padding: '34px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 28
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span className="ops-brand-mark">
                <OpsIcon name="roastery" size={20} />
              </span>
              <div>
                <strong
                  style={{
                    fontFamily: 'var(--an-font-display)',
                    fontSize: 27,
                    fontWeight: 600,
                    display: 'block',
                    lineHeight: 1
                  }}
                >
                  An Roastery
                </strong>
                <span style={{ fontSize: 11.5, color: '#b7a695' }}>{t('ops.login.badge')}</span>
              </div>
            </div>

            <h2
              style={{
                fontFamily: 'var(--an-font-display)',
                fontSize: 'clamp(28px, 3vw, 35px)',
                fontWeight: 600,
                lineHeight: 1.12,
                margin: '26px 0 10px',
                color: '#f5ecdf'
              }}
            >
              {t('ops.login.headline')}
            </h2>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: '#ccbba8' }}>
              {t('ops.login.sub')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#b5835a' }}>
              <OpsIcon name="shield" size={16} />
              <span>{t('ops.login.branch')}</span>
            </div>

            <div
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: 'rgba(245, 236, 223, 0.06)',
                border: '1px solid rgba(181, 131, 90, 0.28)'
              }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#e4cfb7', marginBottom: 8 }}>
                {t('ops.login.demoLabel')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => {
                      setEmail(preset.email);
                      setPassword(preset.pass);
                    }}
                    style={{
                      border:
                        email === preset.email
                          ? '1px solid #b5835a'
                          : '1px solid rgba(245,236,223,0.18)',
                      background:
                        email === preset.email ? 'rgba(181, 131, 90, 0.28)' : 'transparent',
                      color: '#f5ecdf',
                      borderRadius: 7,
                      padding: '5px 9px',
                      fontSize: 11.5,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    {t(preset.labelKey)}
                  </button>
                ))}
              </div>
              <div className="ops-mono" style={{ marginTop: 8, fontSize: 11.5, color: '#ccbba8' }}>
                {email} · {password}
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <form
          onSubmit={onSubmit}
          style={{
            padding: '34px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 16
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--an-font-display)',
                fontSize: 32,
                fontWeight: 600,
                lineHeight: 1.08
              }}
            >
              {t('ops.login.title')}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--an-muted)' }}>
              {t('ops.login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="ops-alert" role="alert">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <OpsIcon name="alert" size={17} />
                {error}
              </span>
            </div>
          )}

          <div className="ops-field">
            <label htmlFor="staff-email">{t('ops.login.emailLabel')}</label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 11,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--an-muted)',
                  display: 'grid'
                }}
              >
                <OpsIcon name="mail" size={16} />
              </span>
              <input
                id="staff-email"
                className="ops-input"
                style={{ paddingLeft: 36 }}
                type="email"
                placeholder={t('ops.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="ops-field">
            <label htmlFor="staff-password">{t('ops.login.passwordLabel')}</label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 11,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--an-muted)',
                  display: 'grid'
                }}
              >
                <OpsIcon name="lock" size={16} />
              </span>
              <input
                id="staff-password"
                className="ops-input"
                style={{ paddingLeft: 36 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              flexWrap: 'wrap',
              fontSize: 12.5
            }}
          >
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#2b1d14' }}
              />
              <span>{t('ops.login.remember')}</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setEmail('newadmin@coffee.com');
                setPassword('NewAdmin@123');
              }}
              style={{
                border: 0,
                background: 'transparent',
                color: 'var(--an-caramel)',
                fontWeight: 600,
                fontSize: 12.5,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {t('ops.login.quickFill')}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="ops-btn ops-btn--espresso"
            style={{ height: 44, fontSize: 14, marginTop: 4 }}
          >
            <OpsIcon name="arrowRight" size={17} />
            <span>{loading ? t('ops.login.submitting') : t('ops.login.submit')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
