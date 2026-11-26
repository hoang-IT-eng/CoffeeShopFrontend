import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLang } from '../i18n';

/**
 * Thang đo cảm quan 5 vạch (Độ rang / Độ đậm / Độ thanh / Thể chất) —
 * dùng vạch mảnh CSS thay cho vòng tròn tiến độ hay icon màu mè.
 */
export function SensoryBar({ label, value, max = 5 }) {
  if (value == null) return null;
  return (
    <div className="ed-meter" aria-label={`${label}: ${value}/${max}`}>
      <span className="ed-meter__label">{label}</span>
      <span className="ed-meter__ticks" aria-hidden="true">
        {Array.from({ length: max }, (_, idx) => (
          <i key={idx} className={idx < value ? 'is-on' : undefined} />
        ))}
      </span>
    </div>
  );
}

/**
 * Header & ngăn mục lục dùng chung cho Trang chủ và toàn bộ các tab công khai
 * (Sản phẩm, Văn hóa cà phê, Giải pháp B2B, Bền vững, Nhật ký).
 */
export function PublicHeader() {
  const { lang, setLang, t } = useLang();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const primaryTabs = [
    { to: '/products', label: t('nav.products') },
    { to: '/coffee-culture', label: t('nav.culture') },
    { to: '/business-solutions', label: t('nav.business') },
    { to: '/sustainability', label: t('nav.sustain') },
    { to: '/journal', label: t('nav.journal') }
  ];

  return (
    <>
      <header className="hp-header">
        <div className="hp-shell hp-header__inner">
          {isHome ? (
            <a className="hp-brand" href="#top">
              <span className="hp-brand__name">An Roastery</span>
              <span className="hp-brand__tag">{t('brand.tag')}</span>
            </a>
          ) : (
            <Link className="hp-brand" to="/">
              <span className="hp-brand__name">An Roastery</span>
              <span className="hp-brand__tag">{t('brand.tag')}</span>
            </Link>
          )}

          <nav className="hp-nav ed-topnav" aria-label={t('nav.label')}>
            {primaryTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) => (isActive ? 'is-current' : undefined)}
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="hp-header__actions ed-header-actions">
            <div className="ed-lang" role="group" aria-label={t('switcher.label')}>
              <button
                type="button"
                className={lang === 'vi' ? 'is-on' : undefined}
                aria-pressed={lang === 'vi'}
                onClick={() => setLang('vi')}
              >
                VI
              </button>
              <span aria-hidden="true">/</span>
              <button
                type="button"
                className={lang === 'en' ? 'is-on' : undefined}
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>

            <a
              className="hp-btn hp-btn--primary ed-header-cta"
              href={isHome ? '#dat-ban' : '/#dat-ban'}
            >
              {t('nav.booking')}
            </a>

            <button
              type="button"
              className="ed-menu-btn"
              aria-expanded={drawerOpen}
              aria-controls="an-site-drawer"
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span className="ed-menu-btn__bars" aria-hidden="true">
                <i />
                <i />
              </span>
              <span>{drawerOpen ? t('nav.menuClose') : t('nav.menuOpen')}</span>
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="ed-drawer-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.drawerHouse')}
          id="an-site-drawer"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
        >
          <div className="ed-drawer">
            <div className="hp-shell ed-drawer__top">
              <Link className="hp-brand" to="/" onClick={() => setDrawerOpen(false)}>
                <span className="hp-brand__name">An Roastery</span>
                <span className="hp-brand__tag">{t('brand.tag')}</span>
              </Link>
              <button
                type="button"
                className="ed-drawer__close"
                onClick={() => setDrawerOpen(false)}
              >
                {t('nav.menuClose')} ×
              </button>
            </div>

            <div className="hp-shell ed-drawer__grid">
              <div>
                <p className="ed-drawer__heading">{t('nav.drawerExplore')}</p>
                <ol className="ed-drawer__primary">
                  <li>
                    <NavLink to="/" end onClick={() => setDrawerOpen(false)}>
                      <span>01</span>
                      <strong>{t('nav.home')}</strong>
                    </NavLink>
                  </li>
                  {primaryTabs.map((tab, idx) => (
                    <li key={tab.to}>
                      <NavLink to={tab.to} onClick={() => setDrawerOpen(false)}>
                        <span>{String(idx + 2).padStart(2, '0')}</span>
                        <strong>{tab.label}</strong>
                      </NavLink>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="ed-drawer__side">
                <div>
                  <p className="ed-drawer__heading">{t('nav.drawerVisit')}</p>
                  <ul className="ed-drawer__links">
                    <li>
                      <a href={isHome ? '#gu-ca-phe' : '/#gu-ca-phe'} onClick={() => setDrawerOpen(false)}>
                        {t('nav.quiz')}
                      </a>
                    </li>
                    <li>
                      <a href={isHome ? '#thuc-don' : '/#thuc-don'} onClick={() => setDrawerOpen(false)}>
                        {t('nav.menu')}
                      </a>
                    </li>
                    <li>
                      <a href={isHome ? '#dat-ban' : '/#dat-ban'} onClick={() => setDrawerOpen(false)}>
                        {t('nav.booking')}
                      </a>
                    </li>
                    <li>
                      <Link to="/login" onClick={() => setDrawerOpen(false)}>
                        {t('nav.admin')}
                      </Link>
                    </li>
                  </ul>
                </div>

                <figure className="ed-drawer__figure">
                  <img src="/img/cupping-lab.jpg" alt="An Roastery cupping table" loading="lazy" />
                  <figcaption>
                    <span>1900 6886</span>
                    <span>hello@anroastery.vn</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer kiến trúc 5 cột đồng nhất toàn trang. */
export function PublicFooter() {
  const { t } = useLang();
  const hours = t('footer.hours');
  return (
    <footer className="hp-footer ed-footer">
      <div className="hp-shell">
        <div className="hp-footer__grid ed-footer__grid">
          <div>
            <p className="hp-brand__name">An Roastery</p>
            <p>{t('footer.tagline')}</p>
          </div>
          <div>
            <h3>{t('footer.exploreTitle')}</h3>
            <ul>
              <li><Link to="/products">{t('nav.products')}</Link></li>
              <li><Link to="/coffee-culture">{t('nav.culture')}</Link></li>
              <li><Link to="/business-solutions">{t('nav.business')}</Link></li>
              <li><Link to="/sustainability">{t('nav.sustain')}</Link></li>
              <li><Link to="/journal">{t('nav.journal')}</Link></li>
              <li><a href="/#gu-ca-phe">{t('nav.quiz')}</a></li>
            </ul>
          </div>
          <div>
            <h3>{t('footer.hoursTitle')}</h3>
            <ul className="hp-footer__hours">
              {hours.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t('footer.branchesTitle')}</h3>
            <ul>
              <li>12 Hoàng Hoa Thám, Tân Bình, TP.HCM</li>
              <li>06 Trần Cao Vân, Quận 3, TP.HCM</li>
              <li>48 Trần Thái Tông, Cầu Giấy, Hà Nội</li>
            </ul>
          </div>
          <div>
            <h3>{t('footer.contactTitle')}</h3>
            <ul>
              <li>{t('footer.bookingLine')}</li>
              <li>{t('footer.b2bLine')}</li>
              <li>{t('footer.emailLine')}</li>
              <li><Link to="/login">{t('nav.admin')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="hp-footer__bottom">
          <p>© {new Date().getFullYear()} An Roastery · Designed and built by Trần Huy Hoàng, 2026.</p>
          <div className="hp-footer__legal">
            <Link to="/sustainability">{t('footer.privacy')}</Link>
            <Link to="/business-solutions">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
