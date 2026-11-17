import { Link, NavLink } from 'react-router-dom';
import { useLang } from '../i18n';

/** Header dùng chung cho các trang khách hàng (Sản phẩm, Văn hóa cà phê).
 *  Dùng lại hệ lớp .hp-* của homepage.css để giữ nguyên ngôn ngữ thiết kế. */
export function PublicHeader() {
  const { t } = useLang();
  return (
    <header className="hp-header">
      <div className="hp-shell hp-header__inner">
        <Link className="hp-brand" to="/">
          <span className="hp-brand__name">An Roastery</span>
          <span className="hp-brand__tag">{t('brand.tag')}</span>
        </Link>

        <nav className="hp-nav" aria-label={t('nav.label')}>
          <NavLink to="/" end>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/products">{t('nav.products')}</NavLink>
          <NavLink to="/coffee-culture">{t('nav.culture')}</NavLink>
          <a href="/#thuc-don">{t('nav.menu')}</a>
          <a href="/#dat-ban">{t('nav.booking')}</a>
          <Link to="/login">{t('nav.admin')}</Link>
        </nav>

        <div className="hp-header__actions">
          <div className="hp-hotline">
            <span>{t('nav.hotline')}</span>
            <a href="tel:19006886">1900 6886</a>
          </div>
          <a className="hp-btn hp-btn--primary" href="/#thuc-don">
            {t('nav.orderNow')}
          </a>
        </div>
      </div>
    </header>
  );
}

/** Footer dùng chung — cùng cấu trúc và nội dung với chân trang chủ. */
export function PublicFooter() {
  const { t } = useLang();
  const hours = t('footer.hours');
  return (
    <footer className="hp-footer">
      <div className="hp-shell">
        <div className="hp-footer__grid">
          <div>
            <p className="hp-brand__name">An Roastery</p>
            <p>{t('footer.tagline')}</p>
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
              <li>{t('footer.emailLine')}</li>
            </ul>
          </div>
        </div>
        <div className="hp-footer__bottom">
          <p>© {new Date().getFullYear()} An Roastery</p>
          <div className="hp-footer__legal">
            <Link to="/">{t('footer.privacy')}</Link>
            <Link to="/">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
