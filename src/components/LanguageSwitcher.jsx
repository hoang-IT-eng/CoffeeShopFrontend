import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import '../styles/lang-switcher.css';

const OPTIONS = [
  { code: 'vi', label: 'Tiếng Việt', short: 'VI' },
  { code: 'en', label: 'English', short: 'EN' }
];

/**
 * Nút chuyển ngôn ngữ cố định ở góc trên bên phải — pill bo tròn với icon quả
 * địa cầu + mã ngôn ngữ; mở ra thẻ dropdown hai dòng VI/EN, dòng đang chọn có
 * dấu tick. Đóng khi click ra ngoài hoặc nhấn Escape.
 */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  const active = OPTIONS.find((option) => option.code === lang) || OPTIONS[0];

  return (
    <div className="ls" ref={rootRef}>
      <button
        type="button"
        className="ls-pill"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('switcher.label')}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="material-symbols-outlined ls-pill__icon" aria-hidden="true">
          language
        </span>
        <span className="ls-pill__code">{active.short}</span>
        <span
          className={`material-symbols-outlined ls-pill__caret${open ? ' is-open' : ''}`}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="ls-card" role="listbox" aria-label={t('switcher.label')}>
          {OPTIONS.map((option) => {
            const selected = option.code === lang;
            return (
              <button
                key={option.code}
                type="button"
                role="option"
                aria-selected={selected}
                className={`ls-row${selected ? ' is-active' : ''}`}
                onClick={() => {
                  setLang(option.code);
                  setOpen(false);
                }}
              >
                <span className="ls-row__label">{option.label}</span>
                {selected && (
                  <span className="material-symbols-outlined ls-row__check" aria-hidden="true">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
