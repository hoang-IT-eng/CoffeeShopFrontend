import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollStory from '../components/ScrollStory';
import '../styles/homepage.css';

const MENU = [
  {
    name: 'Cà Phê Muối Xứ Huế',
    desc: 'Kem muối biển béo ngậy phủ trên nền Robusta rang mộc đậm đà.',
    price: '45.000đ',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC117OxdRy2nel927BqAp30l75gOBC-YE17MqQYUgdaZa9lf6ToZvvXMpBY5h7ZB82Z7XXYNx3LZs1ufRC5KnqV8aWg6hM4f0zdjMy4OmtvhMZOAd8fB4H9YwoLVZH8HcGJJpzK9hW8L1d4iNRDzKe5FqwwxvKOchxlNvGjxKR2-xR2QNdjQ250ifqN47goKwYOhlbwrBaTvnPxDlmpNanXrcJQy_g8iTkwPUX8julgRcA9bvMOChJaFQ'
  },
  {
    name: 'Cold Brew Cam Vàng',
    desc: 'Arabica Cầu Đất ngâm lạnh 24 giờ hòa quyện tép cam tươi.',
    price: '52.000đ',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-S8GufDfjMVNHJZU6eEYPKpWeY4hG8FlE6dJgfZ_En81MYwDBRP2C_ipMlLS2qFq-GHUqhLNN3e3pFMrCxeaYGa_B_KQRk1M43ZFDFmu5imzNKZiis_WIVTzrTXsPhcwB0h5JQf45IQxfTFDmtqkuC1-TNe-QE37eLGltHQULkfBi7DTrAwfXGG7SCzjjZxbaEpDJb3OXQPKkHCwtO9xLwiMvH-DvZcHO66sxhG3ASKCdnvh1V3EpjQ'
  },
  {
    name: 'Bạc Xỉu 3 Tầng',
    desc: 'Sữa đặc, sữa tươi Dalatmilk và espresso sánh đậm.',
    price: '42.000đ',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3XmI8F4VFwDAPGLE4p5T1wVUse3TM6HBapgmR5G0LHgyqEQM8K1GOq_EWuIjmzckB4iOq_eoGJIhX_NTuG63cORveVtmWrCfMAX_Ie9e6Hb40V-13jwHVetI9UzuPvGGObJR4SkpEquSUcieehcTrz5Ta6mCjZTlEWBWJQX8U3u-G4xwGlZ13zq53BIFpt5t5iS7pOo1YXPyfclLHWAkW4ojy2-WTNY6aJKFkn6Ixoy_do2WBLxg-og'
  },
  {
    name: 'Trà Đào Cam Sả',
    desc: 'Trà đen ủ lạnh với đào tươi và sả đập dập.',
    price: '48.000đ',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXM9OH7D2rKMTXz6Lo8PlKwn4wHGQkDE58G7cBHqa5yU4xUPIzIWttFnGq3-kmispic2gdKl4d7PNNT4K2Ubyet6jcTuWx8QdkOCmEoa6d3MPLPoskItQi6kRZtbEP2s1QpeK4dfnw6MZrW8NuVTurdrVi6MkpjmKcvRAPF56o0t7K7JRdopB1QYrTLnhVnuaUl6qb4rKrdrkgmfeUjtnHiul-axPjtGg1vbib_MmvOl7aYvAbP7vwyw'
  },
  {
    name: 'Croissant Bơ Pháp',
    desc: 'Vỏ giòn ngàn lớp, ruột mềm đượm hương bơ Bret.',
    price: '38.000đ',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKOvn7OWVJ5avDEcc7_MXkkxBUqP89EDGxkJYf3-VC1UikBLlzjgdLhL4xGB9GknBKFiliZCXPLyJI4qP6sVgZadpCC2zKuni5f7Q6Z2fCDLWysHNnUeBxZgDBrfIQfdHyE_Oa4i_exB5mQy4lFCr5njWQ9wLgMx4yg8878BIpER2AXtz6IDUF-knDGr2PNS_u-dPvIxcditoK9c4U9ayRZPLQFf7u3lQInERB5Q7KtkHXj_B6DHKRUw'
  }
];

const COMMITMENTS = [
  {
    title: 'Hái chín bằng tay',
    body: 'Chỉ tuyển quả đỏ mọng đồng đều để tối ưu đường tự nhiên trong hạt.'
  },
  {
    title: 'Sơ chế Honey & Natural',
    body: 'Phơi giàn nhà kính thông thoáng, giữ nốt hương hoa quả và mật ong.'
  },
  {
    title: 'Rang mẻ nhỏ thủ công',
    body: 'Micro-batch dưới 5kg mỗi mẻ giúp kiểm soát hương vị từng mẻ đậu.'
  },
  {
    title: 'Cupping chuẩn SCA',
    body: 'Nếm thử và đánh giá từng thang điểm trước khi phục vụ tại quầy bar.'
  }
];

export default function HomePage() {
  const rootRef = useRef(null);
  const [added, setAdded] = useState({});
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const drifts = root.querySelectorAll('[data-drift]');
    let lenis;

    const paint = (scrollY, velocity = 0) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      root.style.setProperty('--hp-progress', progress.toFixed(4));

      drifts.forEach((node) => {
        const speed = Number(node.dataset.drift) || 0.08;
        const rect = node.getBoundingClientRect();
        const shift = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        node.style.setProperty('--drift', `${(-shift).toFixed(1)}px`);
      });
    };

    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-seen');
          seen.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );
    root.querySelectorAll('.hp-menu-item').forEach((item, index) => {
      item.style.setProperty('--hp-i', String(index));
      seen.observe(item);
    });

    const onAnchor = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || !root.contains(link)) return;
      const hash = link.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -76, duration: 1.15 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    };
    root.addEventListener('click', onAnchor);

    if (reduce) {
      const onScroll = () => {
        paint(window.scrollY);
        ScrollTrigger.update();
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        root.removeEventListener('click', onAnchor);
        seen.disconnect();
      };
    }

    document.documentElement.classList.add('lenis');
    lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.05
    });
    const onLenisScroll = (event) => {
      paint(event.scroll);
      ScrollTrigger.update();
    };
    lenis.on('scroll', onLenisScroll);
    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    paint(window.scrollY);
    ScrollTrigger.update();

    return () => {
      gsap.ticker.remove(tick);
      root.removeEventListener('click', onAnchor);
      seen.disconnect();
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  function onAdd(name) {
    setAdded((prev) => ({ ...prev, [name]: true }));
    window.setTimeout(() => {
      setAdded((prev) => ({ ...prev, [name]: false }));
    }, 1200);
  }

  function onBook(event) {
    event.preventDefault();
    setBooked(true);
  }

  return (
    <div className="hp" ref={rootRef}>
      <div className="hp-rail" aria-hidden="true">
        <span className="hp-rail__fill" />
      </div>
      <header className="hp-header">
        <div className="hp-shell hp-header__inner">
          <a className="hp-brand" href="#top">
            <span className="hp-brand__name">An Roastery</span>
            <span className="hp-brand__tag">Specialty coffee & kitchen</span>
          </a>

          <nav className="hp-nav" aria-label="Điều hướng trang chủ">
            <a href="#thuc-don">Thực đơn</a>
            <a href="#dat-ban">Đặt bàn</a>
            <a href="#cau-chuyen">Câu chuyện hạt</a>
            <a href="#khong-gian">Không gian</a>
            <Link to="/login">Quản trị / POS</Link>
          </nav>

          <div className="hp-header__actions">
            <div className="hp-hotline">
              <span>Hotline</span>
              <a href="tel:19006886">1900 6886</a>
            </div>
            <a className="hp-btn hp-btn--primary" href="#thuc-don">
              Gọi món
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <ScrollStory />

        <section className="hp-section hp-section--foam">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>Ba việc chúng tôi làm mỗi ngày</h2>
              <p>Gọi món nhanh, pha chế trước mặt bạn, bánh nướng ra lò hai lần mỗi ngày.</p>
            </div>
            <div className="hp-pillars">
              <article className="hp-pillar">
                <h3>QR Order tại bàn</h3>
                <p>
                  Quét mã, chỉnh đá–ngọt–sữa yến mạch, thanh toán VietQR hoặc thẻ trong khoảng nửa phút.
                </p>
                <span className="hp-pillar__meta">Giảm thời gian chờ gọi món</span>
              </article>
              <article className="hp-pillar">
                <h3>Quầy bar mở</h3>
                <p>
                  Ngồi đối diện barista: pour-over V60, cold brew ủ 24 giờ, máy pha Synesso.
                </p>
                <span className="hp-pillar__meta">Xem quy trình pha chế</span>
              </article>
              <article className="hp-pillar">
                <h3>Bếp bánh bơ Pháp</h3>
                <p>
                  Croissant và sourdough nướng lúc 07:30 và 14:00 với bơ Bret.
                </p>
                <span className="hp-pillar__meta">Mẻ mới mỗi buổi</span>
              </article>
            </div>
          </div>
        </section>

        <section className="hp-section" id="thuc-don">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>Signature đang bán chạy</h2>
              <a className="hp-link" href="#dat-ban">
                Đặt bàn để thưởng thức tại quán
              </a>
            </div>
            <div className="hp-menu">
              {MENU.map((item) => (
                <article className="hp-menu-item" key={item.name}>
                  <div className="hp-menu-item__img">
                    <img
                      className="hp-drift"
                      data-drift="0.04"
                      src={item.img}
                      alt={item.name}
                      width={176}
                      height={176}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <div className="hp-menu-item__buy">
                    <span className="hp-price">{item.price}</span>
                    <button
                      type="button"
                      className={`hp-add${added[item.name] ? ' is-added' : ''}`}
                      aria-label={`Thêm ${item.name}`}
                      onClick={() => onAdd(item.name)}
                    >
                      {added[item.name] ? '✓' : '+'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hp-section hp-section--foam" id="cau-chuyen">
          <div className="hp-shell hp-story">
            <div className="hp-story__visual">
              <div className="hp-frame">
              <img
                className="hp-drift"
                data-drift="0.08"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqDL4pxQXm-QEu5d9xNQIWgie0vwKBfpwBwGaJ3EspbfEKN4BJabbaY9bviyN7PdoAE8ifCSXLwnYiSp8Yx9KIK0rP9-NzzuYe4SSZSgK1MUarnBp6B7SUQpv-HXIz8VpE0MuaBE5Y8cj6aPlz6cAPLG9mhk5ryS46D1cyAiIZ6iVkUzdQBg7Mf_3x0pqq_PJoaWBJCcSi4nb9La3U-0Yo1XNEyXfDzg59_EjisCOD_F_UWZFqD74U1w"
                alt="Vườn cà phê Cầu Đất trong sương sớm"
                width={640}
                height={800}
                loading="lazy"
              />
              </div>
              <div className="hp-story__note">
                <strong>1.650m</strong>
                <span>Cầu Đất & Bảo Lộc, Lâm Đồng</span>
              </div>
              <div className="hp-story__note hp-story__note--dark">
                <strong>Giesen W6A</strong>
                <span>Đồ thị rang kiểm soát từng mẻ</span>
              </div>
              <div className="hp-frame">
              <img
                className="hp-drift"
                data-drift="0.12"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqHKTNaqWBmkTZingmeTQfG_APVvRk0ey9eNI6u725znsnG7Yp7BMVJgqWRsubge5phrxlKou7BpoeHp-BzCklXzyyTX0ug2CKTDmaIiRuWIEJ-6KIj26PPm1bBj0ObU1MtJ2t_fOIgY9w-76wIGpTsJJJNdMITSXo1GGhV9cTH9j0p1DL2MznkNpDwJHhpeLrw_njpojUvY_9h-ur6XVThFhK3SJJlLp6an2GS_Vlfcz47eQxShsjzw"
                alt="Hạt cà phê mới rang đang nguội trên khay"
                width={640}
                height={800}
                loading="lazy"
              />
              </div>
            </div>

            <div>
              <div className="hp-section__head hp-section__head--tight">
                <h2>Bốn cam kết từ nông trại đến tách</h2>
              </div>
              <p className="hp-lede">
                Tách ngon không cần hương liệu. Giá trị nằm ở hạt chín cây, sơ chế tỉ mỉ và tay nghề người rang.
              </p>
              <ol className="hp-commitments">
                {COMMITMENTS.map((item, index) => (
                  <li key={item.title}>
                    <b aria-hidden="true">{index + 1}</b>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="hp-section hp-section--ink" id="dat-ban">
          <div className="hp-shell hp-book">
            <div className="hp-book__copy">
              <h2>Đặt bàn và workshop cà phê</h2>
              <p>
                Giữ chỗ làm việc yên tĩnh, góc ban công, hoặc đăng ký cupping cùng master roaster sáng thứ Bảy.
              </p>
              <ul className="hp-book__list">
                <li>Giữ chỗ trước đến 30 phút, không phụ phí</li>
                <li>Ổ cắm, bàn làm việc và wifi ổn định</li>
                <li>Một cookie bơ Pháp khi đặt trước online</li>
              </ul>
            </div>

            <form className="hp-form" onSubmit={onBook}>
              <div className="hp-field">
                <label htmlFor="hp-branch">Chi nhánh</label>
                <select id="hp-branch" name="branch" defaultValue="tan-binh" required>
                  <option value="tan-binh">12 Hoàng Hoa Thám, Tân Bình, TP.HCM</option>
                  <option value="quan-3">06 Trần Cao Vân, Quận 3, TP.HCM</option>
                  <option value="cau-giay">48 Trần Thái Tông, Cầu Giấy, Hà Nội</option>
                </select>
              </div>
              <div className="hp-form__row">
                <div className="hp-field">
                  <label htmlFor="hp-date">Ngày</label>
                  <input id="hp-date" name="date" type="date" required />
                </div>
                <div className="hp-field">
                  <label htmlFor="hp-time">Khung giờ</label>
                  <select id="hp-time" name="time" defaultValue="10:00" required>
                    <option value="08:00">08:00 – 10:00</option>
                    <option value="10:00">10:00 – 12:00</option>
                    <option value="14:00">14:00 – 17:00</option>
                    <option value="18:30">18:30 – 21:30</option>
                  </select>
                </div>
              </div>
              <div className="hp-form__row">
                <div className="hp-field">
                  <label htmlFor="hp-guests">Số khách</label>
                  <select id="hp-guests" name="guests" defaultValue="2" required>
                    <option value="1">1 người</option>
                    <option value="2">2 người</option>
                    <option value="3-5">3 – 5 người</option>
                    <option value="6-12">6 – 12 người</option>
                  </select>
                </div>
                <div className="hp-field">
                  <label htmlFor="hp-area">Khu vực</label>
                  <select id="hp-area" name="area" defaultValue="quiet" required>
                    <option value="quiet">Sảnh yên tĩnh</option>
                    <option value="garden">Ban công ngoài trời</option>
                    <option value="bar">Gần quầy bar</option>
                    <option value="work">Bàn làm việc có ổ cắm</option>
                  </select>
                </div>
              </div>
              <div className="hp-form__row">
                <div className="hp-field">
                  <label htmlFor="hp-name">Họ tên</label>
                  <input id="hp-name" name="name" type="text" placeholder="Nguyễn Văn An" required />
                </div>
                <div className="hp-field">
                  <label htmlFor="hp-phone">Số điện thoại</label>
                  <input id="hp-phone" name="phone" type="tel" placeholder="0901 234 567" required />
                </div>
              </div>
              <button className="hp-btn hp-btn--brass hp-btn--block" type="submit">
                Giữ bàn miễn phí
              </button>
              {booked && (
                <p className="hp-form__msg" role="status">
                  Đã ghi nhận. Quán sẽ gọi xác nhận trong vài phút.
                </p>
              )}
            </form>
          </div>
        </section>

        <section className="hp-section" id="khong-gian">
          <div className="hp-shell">
            <div className="hp-section__head">
              <h2>Không gian giữa phố</h2>
              <p>Gỗ sồi, bê tông mài và mùi mẻ rang mới — chỗ ngồi làm việc hoặc đọc sách.</p>
            </div>
            <div className="hp-gallery">
              <figure>
                <img
                  className="hp-drift"
                  data-drift="0.06"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxY7SnJeyv3sKueKwezTVUjXEPnTMpEgmVoawFkH_Hw8uTr0wWbNIM4GSdPKwSulYnj8kokWnvFcd7VEDmFjA1bw7u4tW6ksAvEhywyySYewNDO95Yky8Xk7JXK7as7hczCk4YxEHLwq9BPxof8ZRJLjKJY3XP4nLVNcZsXeKsPrXqLvPYKf2N0D4G6psuTs5HzE067QYyX-VjcTzeHQEn5fnKjL__fAlpXzStDIixYaqdykSbrh6OVg"
                  alt="Bàn làm việc dài dưới ánh sáng cửa sổ lớn"
                  width={1200}
                  height={800}
                  loading="lazy"
                />
                <figcaption>Bàn dài & ánh sáng tự nhiên</figcaption>
              </figure>
              <figure>
                <img
                  className="hp-drift"
                  data-drift="0.1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOerLfMoGxddEuaHcl9Hlzkt26CBr5k7VA_bhoh7k1oj4Cp5dradxhl-uYvAPglCNIRFRUvdECspbYIeiifIBq2xwy5KK4sXRFvnsQR5mC0udWvSyX1lWj3O_td5zsWrZdi7MoJJ0evIcaHY939W6xLeHWROnycy_vachLzCggjwLcjyY_1qbBX_3lYdYTrKrvBRF-wDt_9YfgZXKmRfNU01Uv3YGC4hEK_gD8zvn4phlpE6t8jGphzw"
                  alt="Góc đọc sách với ghế da và kệ sách"
                  width={800}
                  height={800}
                  loading="lazy"
                />
                <figcaption>Góc đọc sách</figcaption>
              </figure>
              <figure>
                <img
                  className="hp-drift"
                  data-drift="0.07"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQDnutRmyYrbM4EJyPbf-E19RkmoqWW3XUkz5_YIk2XQtNaycZad4XZ5T6E93NILM83vDFS9HVoamUVH6O6ZHSOeCrSspCih3TD2GGowpTuamLjmOqam7NU2qPpn-hEaFBvgdrQOD8wwNPYqKMy2DbErJAdJZPkxmZ7YzTKZiHF7vWzdTGeK5TRCOy82mQbt15qeCRa0DfboamoGMC6v20g90eoaRVDSV2rWFJLtAIbHML7IJ01827qQ"
                  alt="Ban công ngoài trời dưới tán cây"
                  width={1000}
                  height={700}
                  loading="lazy"
                />
                <figcaption>Ban công ngoài trời</figcaption>
              </figure>
            </div>
            <blockquote className="hp-quote">
              <p>
                “Cà phê muối rang mộc thật, không gắt dầu. QR Order tại bàn chạy mượt — đặt xong là pha.”
              </p>
              <footer>Hoàng Minh Quân · khách thường xuyên chi nhánh Tân Bình</footer>
            </blockquote>
          </div>
        </section>

        <section className="hp-section hp-section--foam hp-section--flush-top">
          <div className="hp-shell">
            <div className="hp-staff">
              <p className="hp-staff__label">Dành cho nhân viên và quản trị An Roastery</p>
              <div className="hp-staff__links">
                <Link to="/login">POS thu ngân</Link>
                <Link to="/login">KDS bếp</Link>
                <Link to="/login">Dashboard</Link>
                <Link to="/login">Waiter app</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="hp-footer">
        <div className="hp-shell">
          <div className="hp-footer__grid">
            <div>
              <p className="hp-brand__name">An Roastery</p>
              <p>
                Rang mộc chuẩn SCA, pha chế thủ công và không gian thưởng thức giữa đô thị.
              </p>
            </div>
            <div>
              <h3>Giờ mở cửa</h3>
              <ul className="hp-footer__hours">
                <li>
                  <span>Thứ 2 – Thứ 6</span>
                  <strong>06:30 – 22:30</strong>
                </li>
                <li>
                  <span>Thứ 7 – Chủ nhật</span>
                  <strong>07:00 – 23:00</strong>
                </li>
                <li>
                  <span>Kitchen / brunch</span>
                  <strong>07:30 – 14:00</strong>
                </li>
              </ul>
            </div>
            <div>
              <h3>Chi nhánh</h3>
              <ul>
                <li>12 Hoàng Hoa Thám, Tân Bình, TP.HCM</li>
                <li>06 Trần Cao Vân, Quận 3, TP.HCM</li>
                <li>48 Trần Thái Tông, Cầu Giấy, Hà Nội</li>
              </ul>
            </div>
            <div>
              <h3>Liên hệ</h3>
              <ul>
                <li>Đặt bàn: 1900 6886</li>
                <li>Email: hello@anroastery.vn</li>
              </ul>
            </div>
          </div>
          <div className="hp-footer__bottom">
            <p>© {new Date().getFullYear()} An Roastery</p>
            <div className="hp-footer__legal">
              <a href="#top">Chính sách bảo mật</a>
              <a href="#top">Điều khoản</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
