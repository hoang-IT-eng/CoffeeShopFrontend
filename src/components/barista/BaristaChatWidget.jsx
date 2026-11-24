import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, useLang } from '../../i18n';
import { analyzeBaristaQuery, getSuggestedPrompts } from './baristaEngine';
import '../../styles/barista-chat.css';

function BaristaIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 9h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9z" />
      <path d="M16 10h2.2a2.3 2.3 0 0 1 0 4.6H16" />
      <path d="M8.5 3.5c0 1.4 1.2 1.8 1.2 3.1" />
      <path d="M12.5 3.5c0 1.4 1.2 1.8 1.2 3.1" />
    </svg>
  );
}

function CloseIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SendIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function ResetIcon({ size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function RoastTicks({ value, label }) {
  if (value == null) return null;
  return (
    <span className="bc-ticks" aria-label={`${label}: ${value}/5`}>
      <span className="bc-ticks__label">{label}</span>
      <span className="bc-ticks__bars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, idx) => (
          <i key={idx} className={idx < value ? 'is-on' : undefined} />
        ))}
      </span>
    </span>
  );
}

function ProductCardsBlock({ items, lang, onNavigate }) {
  const isEn = lang === 'en';
  return (
    <div className="bc-cards">
      {items.map((item) => (
        <article key={item.id} className="bc-product-card">
          <div className="bc-product-card__top">
            <img
              src={item.img}
              alt={item.name}
              className="bc-product-card__img"
              loading="lazy"
            />
            <div className="bc-product-card__meta">
              <div className="bc-product-card__title-row">
                <h4 className="bc-product-card__name">{item.name}</h4>
                <span className="bc-product-card__price">
                  {formatPrice(item.price, lang)}
                </span>
              </div>
              <p className="bc-product-card__origin">{item.origin}</p>
              <p className="bc-product-card__notes">{item.notes}</p>
            </div>
          </div>

          <div className="bc-product-card__foot">
            <RoastTicks
              value={item.roast}
              label={isEn ? 'Roast' : 'Độ rang'}
            />
            <button
              type="button"
              className="bc-inline-link"
              onClick={() => onNavigate('/products')}
            >
              {isEn ? 'View in Store' : 'Xem cửa hàng'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function BrewRecipeBlock({ block, lang }) {
  const isEn = lang === 'en';
  return (
    <section className="bc-recipe-card" aria-label={block.title}>
      <div className="bc-recipe-card__head">
        <div>
          <span className="bc-recipe-card__kicker">
            {isEn ? 'Brew Recipe' : 'Công thức pha chuẩn'} · {block.ratio}
          </span>
          <h4 className="bc-recipe-card__title">{block.title}</h4>
        </div>
        <span className="bc-recipe-card__badge">{block.servings}</span>
      </div>

      <dl className="bc-recipe-grid">
        <div>
          <dt>{isEn ? 'Coffee' : 'Cà phê'}</dt>
          <dd>{block.coffeeGrams}</dd>
        </div>
        <div>
          <dt>{isEn ? 'Water' : 'Nước'}</dt>
          <dd>{block.waterMl}</dd>
        </div>
        <div>
          <dt>{isEn ? 'Temp' : 'Nhiệt độ'}</dt>
          <dd>{block.temp}</dd>
        </div>
        <div>
          <dt>{isEn ? 'Time' : 'Thời gian'}</dt>
          <dd>{block.time}</dd>
        </div>
      </dl>

      <p className="bc-recipe-card__grind">
        <strong>{isEn ? 'Grind:' : 'Cỡ xay:'}</strong> {block.grind}
      </p>

      <ol className="bc-recipe-steps">
        {block.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

function B2BCardBlock({ block, onNavigate }) {
  return (
    <section className="bc-b2b-card" aria-label={block.title}>
      <span className="bc-b2b-card__badge">{block.badge}</span>
      <h4 className="bc-b2b-card__title">{block.title}</h4>
      <dl className="bc-b2b-list">
        {block.highlights.map((row) => (
          <div key={row.label} className="bc-b2b-list__row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="bc-b2b-card__foot">
        <span className="bc-b2b-card__contact">{block.contact}</span>
        <button
          type="button"
          className="bc-b2b-card__cta"
          onClick={() => onNavigate(block.ctaTo)}
        >
          {block.ctaLabel}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

function createWelcomeMessage(lang) {
  return {
    id: 'welcome',
    role: 'assistant',
    source: 'local',
    text:
      lang === 'en'
        ? 'Hello, I am An Roastery’s AI Barista. Tell me your flavour preference, ask for a scaled Phin / V60 / Espresso / Cold Brew recipe, or inquire about B2B wholesale.'
        : 'Chào bạn, mình là AI Barista của An Roastery. Hãy chia sẻ gu vị yêu thích, hỏi công thức định lượng Phin / V60 / Espresso / Cold Brew, hoặc nhận báo giá sỉ B2B.',
    blocks: []
  };
}

export default function BaristaChatWidget() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const isEn = lang === 'en';

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('concierge'); // 'concierge' | 'gemini' | 'local'
  const [messages, setMessages] = useState(() => [createWelcomeMessage(lang)]);

  const inputRef = useRef(null);
  const endRef = useRef(null);
  const msgCounter = useRef(1);

  // Sync initial welcome message when site language toggles before user chats
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [createWelcomeMessage(lang)];
      }
      return prev;
    });
  }, [lang]);

  // Escape key to close drawer & focus input when opened
  useEffect(() => {
    if (!open) return undefined;
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading, open]);

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth <= 640) {
      setOpen(false);
    }
  };

  const handleReset = () => {
    setMessages([createWelcomeMessage(lang)]);
    setInput('');
    setLoading(false);
  };

  const sendMessage = async (rawText) => {
    const text = String(rawText ?? input).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `u-${msgCounter.current++}`,
      role: 'user',
      text
    };

    const nextHistory = [...messages, userMsg]
      .filter((m) => m.id !== 'welcome')
      .slice(-6)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Deterministic local analysis provides instant offline fallback + Generative UI blocks
    const localResult = analyzeBaristaQuery(text, lang);
    const useMockOnly = import.meta.env.VITE_MOCK_API === '1';

    let finalReply = localResult.reply;
    let finalSource = 'local';

    if (!useMockOnly) {
      try {
        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            lang,
            history: nextHistory.slice(0, -1)
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data?.reply === 'string' && data.reply.trim()) {
            finalReply = data.reply.trim();
            finalSource = 'gemini';
          }
        }
      } catch {
        // Offline or dev server without Pages Functions — fall back silently
      }
    }

    if (finalSource === 'local') {
      // Brief natural typing beat when using local engine
      await new Promise((resolve) => window.setTimeout(resolve, 260));
    }

    setMode(finalSource);

    // Attach structured Generative UI blocks for actionable intents
    const shouldAttachBlocks =
      localResult.intent === 'products' ||
      localResult.intent === 'recipe' ||
      localResult.intent === 'b2b' ||
      finalSource === 'local';

    const assistantMsg = {
      id: `a-${msgCounter.current++}`,
      role: 'assistant',
      source: finalSource,
      text: finalReply,
      blocks: shouldAttachBlocks ? localResult.blocks : []
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const suggested = getSuggestedPrompts(lang);
  const statusLabel =
    mode === 'gemini'
      ? isEn
        ? 'AI Barista · Live'
        : 'AI Barista · Trực tuyến'
      : isEn
        ? 'Roastery Concierge'
        : 'Tư vấn rang mộc';

  return (
    <div className="bc-root">
      {open && (
        <div
          className="bc-backdrop"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <section
          id="an-barista-drawer"
          className="bc-panel"
          role="dialog"
          aria-label={isEn ? 'An Roastery AI Barista' : 'AI Barista An Roastery'}
        >
          <header className="bc-header">
            <div className="bc-header__id">
              <span className="bc-header__emblem" aria-hidden="true">
                <BaristaIcon size={18} />
              </span>
              <div>
                <h3 className="bc-header__title">AI Barista</h3>
                <p className="bc-header__status">
                  <span className="bc-status-dot" aria-hidden="true" />
                  <span>{statusLabel}</span>
                </p>
              </div>
            </div>

            <div className="bc-header__actions">
              <button
                type="button"
                className="bc-icon-btn"
                onClick={handleReset}
                title={isEn ? 'New conversation' : 'Làm mới cuộc trò chuyện'}
                aria-label={isEn ? 'New conversation' : 'Làm mới cuộc trò chuyện'}
              >
                <ResetIcon size={15} />
              </button>
              <button
                type="button"
                className="bc-icon-btn"
                onClick={() => setOpen(false)}
                title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
                aria-label={isEn ? 'Close AI Barista' : 'Đóng AI Barista'}
              >
                <CloseIcon size={16} />
              </button>
            </div>
          </header>

          <div className="bc-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bc-msg bc-msg--${msg.role}`}
              >
                <div className="bc-bubble">
                  <p className="bc-bubble__text">{msg.text}</p>
                </div>

                {Array.isArray(msg.blocks) && msg.blocks.length > 0 && (
                  <div className="bc-blocks">
                    {msg.blocks.map((block, idx) => {
                      if (block.type === 'product_cards') {
                        return (
                          <ProductCardsBlock
                            key={`${msg.id}-p-${idx}`}
                            items={block.items}
                            lang={lang}
                            onNavigate={handleNavigate}
                          />
                        );
                      }
                      if (block.type === 'brew_recipe') {
                        return (
                          <BrewRecipeBlock
                            key={`${msg.id}-r-${idx}`}
                            block={block}
                            lang={lang}
                          />
                        );
                      }
                      if (block.type === 'b2b_card') {
                        return (
                          <B2BCardBlock
                            key={`${msg.id}-b-${idx}`}
                            block={block}
                            onNavigate={handleNavigate}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="bc-chips" aria-label={isEn ? 'Suggested questions' : 'Gợi ý câu hỏi'}>
                {suggested.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="bc-chip"
                    onClick={() => sendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="bc-msg bc-msg--assistant" aria-label={isEn ? 'Barista is thinking' : 'Barista đang phản hồi'}>
                <div className="bc-bubble bc-bubble--typing">
                  <span className="bc-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <form className="bc-composer" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="bc-composer__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isEn
                  ? 'Ask about beans, V60 recipe, or B2B...'
                  : 'Hỏi về hạt rang, công thức pha, sỉ B2B...'
              }
              maxLength={800}
              disabled={loading}
              aria-label={isEn ? 'Message AI Barista' : 'Nhắn cho AI Barista'}
            />
            <button
              type="submit"
              className="bc-composer__send"
              disabled={loading || !input.trim()}
              aria-label={isEn ? 'Send message' : 'Gửi tin nhắn'}
            >
              <SendIcon size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`bc-fab ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-controls="an-barista-drawer"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="bc-fab__icon" aria-hidden="true">
          {open ? <CloseIcon size={17} /> : <BaristaIcon size={18} />}
        </span>
        <span className="bc-fab__label">
          {open ? (isEn ? 'Close' : 'Đóng') : 'AI Barista'}
        </span>
      </button>
    </div>
  );
}
