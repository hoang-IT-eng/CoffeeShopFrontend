import { useEffect, useRef } from 'react';
import '../styles/frame-story.css';

/**
 * /public/frames cắt từ coffee_journey_preview.mp4 (1280×720), frame 166 → 1240
 * lấy cách một frame, phóng lanczos lên 1920×1080: 0000.webp, 0001.webp, …
 */
const FIRST = 166;
const LAST = 1240;
const STEP = 2;
const COUNT = (LAST - FIRST) / STEP + 1;
const HOLD_START = 0.05;
const HOLD_END = 0.08;
const LOADERS = 6;

const FRAMES_BASE = String(import.meta.env.VITE_FRAMES_BASE_URL || '/frames').replace(/\/$/, '');
const frameSrc = (index) => `${FRAMES_BASE}/${String(index).padStart(4, '0')}.webp?v=720`;
const framesAreRemote = /^https?:\/\//i.test(FRAMES_BASE);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const lerp = (from, to, t) => from + (to - from) * t;
const smooth = (edge0, edge1, value) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const toProgress = (frame) =>
  HOLD_START + ((frame - FIRST) / (LAST - FIRST)) * (1 - HOLD_START - HOLD_END);
const toFrameIndex = (progress) =>
  clamp01((progress - HOLD_START) / (1 - HOLD_START - HOLD_END)) * (COUNT - 1);

const whole = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 });
const tenth = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * `from`/`to` là số frame của video gốc (coffee_scroll_demo/frames), khớp với cảnh thật.
 * `value(t)` nhận tiến độ 0–1 của chương và trả về con số hiển thị ở góc.
 */
export const CHAPTERS = [
  {
    id: 'doi',
    label: 'Đồi Cầu Đất',
    from: 166,
    to: 228,
    side: 'left',
    body: 'Mỗi tách ở quán bắt đầu từ một cành cà phê chín đỏ trên đồi Cầu Đất, Lâm Đồng.',
    unit: 'm',
    caption: 'Độ cao vườn cà phê',
    value: () => whole.format(1650)
  },
  {
    id: 'qua',
    label: 'Quả chín',
    from: 228,
    to: 340,
    side: 'right',
    heading: ['Chỉ hái quả', 'đã chín đỏ'],
    body: 'Hái tay từng quả. Bổ đôi ra, bên trong là hai nhân nằm trong lớp thịt quả ngọt.',
    unit: 'nhân',
    caption: 'Trong mỗi quả cà phê',
    value: () => '2'
  },
  {
    id: 'rang',
    label: 'Rang',
    from: 340,
    to: 470,
    side: 'left',
    heading: ['Rang mẻ nhỏ,', 'dưới 5 kg'],
    body: 'Hạt xanh đảo đều trong lồng rang. Người rang theo dõi đồ thị nhiệt tới tiếng nổ đầu tiên.',
    unit: '°C',
    caption: 'Nhiệt trong lồng rang',
    value: (t) => whole.format(Math.round(lerp(32, 196, smooth(0, 1, t))))
  },
  {
    id: 'ra-lo',
    label: 'Ra lò',
    from: 470,
    to: 660,
    side: 'right',
    heading: ['Ra lò là', 'đảo nguội ngay'],
    body: 'Hạt xả ra khay khi vừa đủ độ rang, quạt làm nguội nhanh để giữ hương trái cây và mật ong.',
    unit: '°C',
    caption: 'Hạt nguội dần trên khay',
    value: (t) => whole.format(Math.round(lerp(205, 38, smooth(0.1, 1, t))))
  },
  {
    id: 'xay',
    label: 'Xay',
    from: 660,
    to: 900,
    side: 'left',
    heading: ['Xay ngay', 'trước khi pha'],
    body: 'Quán không xay sẵn. Hạt chỉ vào cối khi có order, để bột còn nguyên tinh dầu.',
    unit: 'µm',
    caption: 'Cỡ hạt bột cho espresso',
    value: (t) => whole.format(Math.round(lerp(6000, 250, smooth(0.15, 0.85, t))))
  },
  {
    id: 'nen',
    label: 'Định lượng',
    from: 900,
    to: 1120,
    side: 'right',
    heading: ['18 gram,', 'nén thật phẳng'],
    body: 'Bột được cân cho từng shot rồi nén một lực đều, để nước đi qua bánh cà phê không bị lệch.',
    unit: 'g',
    caption: 'Bột cho một shot',
    value: (t) => tenth.format(lerp(0, 18, smooth(0, 0.7, t)))
  },
  {
    id: 'chiet',
    label: 'Chiết xuất',
    from: 1120,
    to: 1240,
    side: 'left',
    heading: ['Chín bar,', 'hai mươi tám giây'],
    body: 'Espresso chảy thành dòng sánh, lớp crema màu hạt dẻ. Mời bạn ghé quầy.',
    unit: 'giây',
    caption: 'Chiết ở áp suất 9 bar',
    value: (t) => whole.format(Math.round(lerp(0, 28, smooth(0, 0.75, t)))),
    actions: true
  }
];

const WINDOWS = CHAPTERS.map((chapter, index) => {
  const start = index === 0 ? 0 : toProgress(chapter.from);
  const end = index === CHAPTERS.length - 1 ? 1 : toProgress(chapter.to);
  return { start, end, anchor: index === 0 ? 0 : lerp(start, end, 0.3) };
});

function Lines({ lines, offset = 0 }) {
  return lines.map((line, index) => (
    <span className="fs-line" key={line}>
      <span className="fs-line__in" style={{ '--i': index + offset }}>
        {line}
      </span>
    </span>
  ));
}

export default function FrameStory() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const readoutRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const readout = readoutRef.current;
    if (!track || !stage || !canvas || !readout) return undefined;

    const ctx = canvas.getContext('2d', { alpha: false });
    const html = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const chapterEls = CHAPTERS.map((chapter) => stage.querySelector(`[data-chapter="${chapter.id}"]`));
    const railEls = CHAPTERS.map((chapter) => stage.querySelector(`[data-rail="${chapter.id}"]`));
    const valueEl = readout.querySelector('.fs-readout__value');
    const unitEl = readout.querySelector('.fs-readout__unit');
    const captionEl = readout.querySelector('.fs-readout__caption');

    const frames = new Array(COUNT);
    const chapterState = CHAPTERS.map(() => ({ enter: '', exit: '', on: null }));
    let disposed = false;
    let dirty = true;
    let drawnImage = null;
    let current = 0;
    let lastProgress = -1;
    let activeIndex = -1;
    let lastValue = '';
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    const order = [];
    const queued = new Uint8Array(COUNT);
    [0, COUNT - 1].forEach((index) => {
      queued[index] = 1;
      order.push(index);
    });
    [32, 16, 8, 4, 2, 1].forEach((step) => {
      for (let index = 0; index < COUNT; index += step) {
        if (queued[index]) continue;
        queued[index] = 1;
        order.push(index);
      }
    });

    let cursor = 0;
    const loadNext = () => {
      if (disposed || cursor >= order.length) return;
      const index = order[cursor];
      cursor += 1;
      const img = new Image();
      img.decoding = 'async';
      if (framesAreRemote) img.crossOrigin = 'anonymous';
      img.src = frameSrc(index);
      img
        .decode()
        .then(() => {
          if (disposed) return;
          frames[index] = img;
          dirty = true;
        })
        .catch(() => {})
        .finally(loadNext);
    };
    for (let i = 0; i < LOADERS; i += 1) loadNext();

    const nearest = (index) => {
      for (let distance = 0; distance < 40; distance += 1) {
        if (frames[index - distance]) return frames[index - distance];
        if (frames[index + distance]) return frames[index + distance];
      }
      return drawnImage;
    };

    const header = document.querySelector('.hp-header');

    const resize = () => {
      if (header) track.style.setProperty('--fs-header', `${header.offsetHeight}px`);
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.min(1920, Math.round(rect.width * dpr));
      canvas.width = width;
      canvas.height = Math.round((width * rect.height) / rect.width);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      drawnImage = null;
      dirty = true;
    };

    const draw = (img) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const imageRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (imageRatio > canvasRatio) sw = sh * canvasRatio;
      else sh = sw / canvasRatio;
      ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cw, ch);
      drawnImage = img;
    };

    const setActive = (index) => {
      if (index === activeIndex) return;
      activeIndex = index;
      const chapter = CHAPTERS[index];
      unitEl.textContent = chapter.unit;
      captionEl.textContent = chapter.caption;
      railEls.forEach((el, railIndex) => {
        el.classList.toggle('is-active', railIndex === index);
        el.classList.toggle('is-past', railIndex < index);
      });
      if (!reduce) {
        readout.animate(
          [
            { opacity: 0, transform: 'translate3d(0, 0.6rem, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
          ],
          { duration: 620, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' }
        );
      }
    };

    const paintCopy = (progress) => {
      let nextActive = CHAPTERS.length - 1;
      WINDOWS.forEach((win, index) => {
        const t = (progress - win.start) / (win.end - win.start);
        if (progress >= win.start && progress < win.end && index < nextActive) nextActive = index;
        const enter = index === 0 ? 1 : smooth(0.02, 0.24, t);
        const exit = index === CHAPTERS.length - 1 ? 1 : 1 - smooth(0.78, 0.98, t);
        const on = t > -0.02 && t < 1.02 && Math.min(enter, exit) > 0.001;
        const state = chapterState[index];
        const el = chapterEls[index];
        const enterStr = enter.toFixed(3);
        const exitStr = exit.toFixed(3);
        if (enterStr !== state.enter) {
          el.style.setProperty('--in', enterStr);
          state.enter = enterStr;
        }
        if (exitStr !== state.exit) {
          el.style.setProperty('--out', exitStr);
          state.exit = exitStr;
        }
        if (on !== state.on) {
          el.dataset.on = on ? '1' : '0';
          state.on = on;
        }
      });

      setActive(nextActive);
      const win = WINDOWS[nextActive];
      const value = CHAPTERS[nextActive].value(clamp01((progress - win.start) / (win.end - win.start)));
      if (value !== lastValue) {
        valueEl.textContent = value;
        lastValue = value;
      }

      stage.style.setProperty('--p', progress.toFixed(4));
      stage.style.setProperty('--cue', (1 - smooth(0, 0.025, progress)).toFixed(3));
    };

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const max = rect.height - window.innerHeight;
      const progress = max > 0 ? clamp01(-rect.top / max) : 0;
      html.classList.toggle('story-active', rect.top <= 1 && rect.bottom > (header ? header.offsetHeight : 72));
      return progress;
    };

    let raf = 0;
    let running = false;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const progress = measure();
      const target = toFrameIndex(progress);
      current = reduce ? target : current + (target - current) * 0.2;
      if (Math.abs(target - current) < 0.05) current = target;

      const img = nearest(Math.round(current));
      if (img && (dirty || img !== drawnImage)) {
        draw(img);
        dirty = false;
      }

      if (Math.abs(progress - lastProgress) > 0.00005) {
        paintCopy(progress);
        lastProgress = progress;
      }

      if (finePointer && !reduce) {
        pointerX += (targetX - pointerX) * 0.06;
        pointerY += (targetY - pointerY) * 0.06;
        stage.style.setProperty('--mx', pointerX.toFixed(4));
        stage.style.setProperty('--my', pointerY.toFixed(4));
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      html.classList.remove('story-active');
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(track);

    const onPointer = (event) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };
    if (finePointer && !reduce) window.addEventListener('pointermove', onPointer, { passive: true });

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (header) ro.observe(header);
    resize();
    paintCopy(measure());

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <section className="fs" ref={trackRef} aria-label="Hành trình của hạt cà phê">
      {CHAPTERS.map((chapter, index) => (
        <span
          className="fs-marker"
          id={`hanh-trinh-${chapter.id}`}
          key={chapter.id}
          style={{ '--at': WINDOWS[index].anchor }}
          aria-hidden="true"
        />
      ))}

      <div className="fs-stage" ref={stageRef}>
        <div className="fs-media" aria-hidden="true">
          <canvas className="fs-canvas" ref={canvasRef} />
        </div>
        <div className="fs-scrim" aria-hidden="true" />
        <div className="fs-grain" aria-hidden="true" />

        <div className="fs-copy">
          {CHAPTERS.map((chapter, index) => (
            <article
              className={`fs-chapter fs-chapter--${chapter.side}${index === 0 ? ' fs-chapter--opening' : ''}`}
              data-chapter={chapter.id}
              data-on={index === 0 ? '1' : '0'}
              key={chapter.id}
            >
              {index === 0 ? (
                <h1 className="fs-title">
                  <span className="fs-line">
                    <span className="fs-line__in fs-rise" style={{ '--i': 0 }}>An</span>
                  </span>
                  <span className="fs-line fs-title__indent">
                    <span className="fs-line__in fs-rise" style={{ '--i': 1 }}>Roastery</span>
                  </span>
                </h1>
              ) : (
                <h2 className="fs-heading">
                  <Lines lines={chapter.heading} />
                </h2>
              )}
              <p className={`fs-body${index === 0 ? ' fs-rise' : ''}`} style={{ '--i': 2 }}>
                {chapter.body}
              </p>
              {chapter.actions && (
                <div className="fs-actions">
                  <a className="fs-btn fs-btn--solid" href="#thuc-don">Xem thực đơn</a>
                  <a className="fs-btn" href="#dat-ban">Đặt bàn</a>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="fs-readout" ref={readoutRef} aria-hidden="true">
          <p className="fs-readout__figure">
            <span className="fs-readout__value">{CHAPTERS[0].value(0)}</span>
            <span className="fs-readout__unit">{CHAPTERS[0].unit}</span>
          </p>
          <p className="fs-readout__caption">{CHAPTERS[0].caption}</p>
        </div>

        <nav className="fs-rail" aria-label="Các chặng trong hành trình">
          <span className="fs-rail__track" aria-hidden="true">
            <span className="fs-rail__fill" />
          </span>
          <ol>
            {CHAPTERS.map((chapter, index) => (
              <li key={chapter.id} style={{ '--at': WINDOWS[index].start }}>
                <a
                  href={`#hanh-trinh-${chapter.id}`}
                  data-rail={chapter.id}
                  className={index === 0 ? 'is-active' : undefined}
                >
                  <span className="fs-rail__label">{chapter.label}</span>
                  <span className="fs-rail__tick" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="fs-cue" aria-hidden="true">
          <span className="fs-cue__line" />
          Cuộn xuống để xem hạt đi từ đồi tới tách
        </p>
        <span className="fs-bar" aria-hidden="true" />
      </div>
    </section>
  );
}
