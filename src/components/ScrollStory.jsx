import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/scroll-story.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Thời lượng tương đối của từng cảnh. 1 = khoảng một màn hình cuộn.
 * Sửa `text` để đổi câu chữ. Tổng các `duration` quyết định độ dài cả đoạn.
 */
export const STORY_SCENES = [
  {
    id: 'mist',
    duration: 1,
    base: '/scroll/1-suong-cau-dat',
    title: 'An Roastery',
    text: 'Bắt đầu từ sương sớm Cầu Đất — 1.500m'
  },
  {
    id: 'yard',
    duration: 1,
    base: '/scroll/2-san-phoi',
    text: 'Phơi nắng tự nhiên, chậm rãi từng ngày.'
  },
  {
    id: 'roast',
    duration: 1,
    base: '/scroll/3-trong-rang',
    text: 'Rang mộc, đánh thức hương vị.'
  },
  {
    id: 'bar',
    duration: 1,
    base: '/scroll/4-quay-bar',
    text: 'Tươi mới từng giọt chiết xuất'
  }
];

const BOKEH = Array.from({ length: 12 }, (_, index) => ({
  left: `${8 + ((index * 17) % 78)}%`,
  size: 16 + (index % 5) * 18,
  bottom: `${6 + (index % 4) * 8}%`,
  lift: 30 + (index % 5) * 18
}));

function StoryPicture({ base, eager }) {
  return (
    <picture>
      <source srcSet={`${base}.avif`} type="image/avif" />
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img src={`${base}.jpg`} alt="" width={1920} height={1080} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </picture>
  );
}

export default function ScrollStory() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return undefined;

    const mm = gsap.matchMedia();
    const words = root.querySelectorAll('[data-word]');
    const scenes = STORY_SCENES.map((scene) => root.querySelector(`[data-scene="${scene.id}"]`));
    const images = scenes.map((scene) => scene.querySelector('img'));
    const copies = scenes.map((scene) => scene.querySelector('.story__copy'));
    const mist = root.querySelector('.story__mist');
    const warm = root.querySelector('.story__warm');
    const dots = root.querySelectorAll('.story__dot');
    const tempEl = root.querySelector('.story__temp');
    const progressEl = root.querySelector('.story__progress');
    const hint = root.querySelector('.story__hint');
    const temp = { value: 0 };
    const total = STORY_SCENES.reduce((sum, scene) => sum + scene.duration, 0);
    const starts = [];
    STORY_SCENES.reduce((cursor, scene, index) => {
      starts[index] = cursor;
      return cursor + scene.duration;
    }, 0);

    const setProgress = (time) => {
      let index = STORY_SCENES.length - 1;
      for (let i = 0; i < starts.length; i += 1) {
        if (time < starts[i] + STORY_SCENES[i].duration) {
          index = i;
          break;
        }
      }
      if (progressEl) progressEl.textContent = `${String(index + 1).padStart(2, '0')}/04`;
    };

    mm.add(
      {
        isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        isMobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        isReduce: '(prefers-reduced-motion: reduce)'
      },
      (context) => {
        const { isDesktop, isReduce } = context.conditions;
        const allowBlur = Boolean(isDesktop);
        const allowBokeh = Boolean(isDesktop);

        gsap.set(images[0], { scale: allowBlur ? 1.1 : 1, transformOrigin: '50% 50%' });
        gsap.set(images[1], { xPercent: 0 });
        gsap.set(scenes[1], { opacity: 0 });
        gsap.set(scenes[2], { opacity: 0 });
        gsap.set(scenes[3], { opacity: isReduce ? 0 : 1 });
        gsap.set(mist, { xPercent: 6, opacity: isReduce ? 0 : 1 });
        gsap.set(warm, { opacity: 0 });
        gsap.set(copies, { opacity: 0, y: 0 });
        gsap.set(copies[0], { opacity: 1 });
        gsap.set(words, allowBlur
          ? { filter: 'blur(10px)', opacity: 0 }
          : { filter: 'none', opacity: 1 });
        if (!isReduce) {
          gsap.set(scenes[3], { clipPath: 'circle(0% at 50% 50%)' });
          if (allowBlur) gsap.set(images[3], { filter: 'blur(12px)' });
        }
        if (tempEl) tempEl.textContent = '0°C';

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: () => `+=${total * window.innerHeight}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              document.documentElement.classList.toggle('story-active', self.isActive);
            },
            onUpdate: (self) => setProgress(self.progress * total)
          }
        });

        const [d0, d1, d2, d3] = STORY_SCENES.map((scene) => scene.duration);

        if (isReduce) {
          timeline
            .to(scenes[1], { opacity: 1, duration: d1 }, starts[1])
            .to(scenes[0], { opacity: 0, duration: d1 * 0.6 }, starts[1])
            .to(copies[0], { opacity: 0, duration: d1 * 0.4 }, starts[1])
            .to(copies[1], { opacity: 1, duration: d1 * 0.4 }, starts[1] + d1 * 0.2)
            .to(scenes[2], { opacity: 1, duration: d2 }, starts[2])
            .to(scenes[1], { opacity: 0, duration: d2 * 0.6 }, starts[2])
            .to(copies[1], { opacity: 0, duration: d2 * 0.4 }, starts[2])
            .to(copies[2], { opacity: 1, duration: d2 * 0.4 }, starts[2] + d2 * 0.2)
            .to(temp, {
              value: 210,
              duration: d2,
              onUpdate: () => {
                if (tempEl) tempEl.textContent = `${Math.round(temp.value)}°C`;
              }
            }, starts[2])
            .to(scenes[3], { opacity: 1, duration: d3 }, starts[3])
            .to(scenes[2], { opacity: 0, duration: d3 * 0.6 }, starts[3])
            .to(copies[2], { opacity: 0, duration: d3 * 0.4 }, starts[3])
            .to(copies[3], { opacity: 1, duration: d3 * 0.4 }, starts[3] + d3 * 0.25);
        } else {
          timeline.to(images[0], { scale: 1, duration: d0 }, 0);
          timeline.to(mist, { xPercent: -12, duration: d0 }, 0);
          if (allowBlur) {
            const order = gsap.utils.shuffle([...words].map((_, index) => index));
            order.forEach((wordIndex, step) => {
              timeline.to(words[wordIndex], {
                filter: 'blur(0px)',
                opacity: 1,
                duration: d0 * 0.45
              }, step * d0 * 0.18);
            });
          }
          timeline
            .to(hint, { opacity: 0, duration: 0.25 }, d0 * 0.45)
            .to(copies[0], { opacity: 0, duration: 0.28 }, starts[1] - 0.22)
            .to(scenes[1], { opacity: 1, duration: d1 * 0.45 }, starts[1])
            .to(mist, { opacity: 0, duration: d1 * 0.55 }, starts[1])
            .to(images[1], { xPercent: -5, duration: d1 }, starts[1])
            .to(copies[1], { opacity: 1, duration: 0.3 }, starts[1] + 0.16)
            .to(copies[1], { opacity: 0, duration: 0.24 }, starts[2] - 0.22)
            .to(scenes[2], { opacity: 1, duration: d2 * 0.35 }, starts[2])
            .to(warm, { opacity: 0.5, duration: d2 * 0.8 }, starts[2])
            .to(copies[2], { opacity: 1, duration: 0.3 }, starts[2] + 0.12)
            .to(temp, {
              value: 210,
              duration: d2,
              onUpdate: () => {
                if (tempEl) tempEl.textContent = `${Math.round(temp.value)}°C`;
              }
            }, starts[2])
            .to(copies[2], { opacity: 0, duration: 0.24 }, starts[3] - 0.22)
            .to(scenes[3], { clipPath: 'circle(150% at 50% 50%)', duration: d3 * 0.72 }, starts[3])
            .to(copies[3], { opacity: 1, duration: 0.32 }, starts[3] + d3 * 0.28);

          if (allowBlur) {
            timeline.to(images[3], { filter: 'blur(0px)', duration: d3 * 0.72 }, starts[3]);
          }
          if (allowBokeh) {
            dots.forEach((dot, index) => {
              timeline.to(dot, { yPercent: -BOKEH[index].lift, duration: d2 }, starts[2]);
            });
          }
        }

        setProgress(0);
        return () => {
          document.documentElement.classList.remove('story-active');
        };
      }
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      document.documentElement.classList.remove('story-active');
      mm.revert();
    };
  }, []);

  const titleWords = STORY_SCENES[0].title.split(' ');

  return (
    <section className="story" ref={rootRef} aria-label="Câu chuyện An Roastery">
      <div className="story__pin" ref={pinRef}>
        {STORY_SCENES.map((scene, index) => (
          <article className={`story__scene story__scene--${scene.id}`} data-scene={scene.id} key={scene.id}>
            <StoryPicture base={scene.base} eager={index === 0} />
            {scene.id === 'roast' && <div className="story__warm" />}
            {scene.id === 'roast' && (
              <div className="story__bokeh" aria-hidden="true">
                {BOKEH.map((dot, dotIndex) => (
                  <span
                    className="story__dot"
                    key={dotIndex}
                    style={{ left: dot.left, width: dot.size, height: dot.size, bottom: dot.bottom }}
                    data-dot={dotIndex}
                  />
                ))}
              </div>
            )}
            <div className="story__copy">
              {scene.id === 'mist' && (
                <h1 className="story__title">
                  {titleWords.map((word) => (
                    <span data-word key={word}>{word}</span>
                  ))}
                </h1>
              )}
              {scene.id === 'roast' && <p className="story__temp">0°C</p>}
              <p className="story__text">{scene.text}</p>
              {scene.id === 'bar' && (
                <div className="story__actions">
                  <a className="story__btn story__btn--solid" href="#thuc-don">Xem menu</a>
                  <a className="story__btn" href="#dat-ban">Ghé quán</a>
                </div>
              )}
            </div>
          </article>
        ))}
        <div className="story__mist" aria-hidden="true" />
        <p className="story__hint">Cuộn để khám phá <span className="story__arrow">↓</span></p>
        <p className="story__progress" aria-live="polite">01/04</p>
      </div>
    </section>
  );
}
