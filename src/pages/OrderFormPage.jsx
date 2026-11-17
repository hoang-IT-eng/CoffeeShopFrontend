import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

function privilegePct(level) {
  if (level === 'Diamond') return 10;
  if (level === 'Gold') return 5;
  if (level === 'Silver') return 3;
  return 0;
}

export default function OrderFormPage() {
  const { t, tf, trData, money } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef(null);

  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [serviceMode, setServiceMode] = useState('dinein');
  const [tableId, setTableId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loyaltyQuery, setLoyaltyQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);

  const [modModal, setModModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api('/api/orders/form'),
      api('/api/customers').catch(() => [])
    ])
      .then(([formRes, custRes]) => {
        const tbls = formRes?.tables || [];
        const items = formRes?.menuItems || [];
        const crm = formRes?.customers || custRes || [];
        setTables(tbls);
        setMenuItems(items);
        setCustomers(crm);

        const paramTbl = searchParams.get('tableId');
        if (paramTbl && tbls.some((x) => String(x.id) === String(paramTbl))) {
          setTableId(String(paramTbl));
          setServiceMode('dinein');
        } else if (tbls[0]) {
          setTableId(String(tbls[0].id));
        }
      })
      .catch((err) => setError(err.message));
  }, [searchParams]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(menuItems.map((m) => m.category || 'Espresso Bar'))),
    [menuItems]
  );

  const visibleMenu = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menuItems.filter((item) => {
      if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
      if (!q) return true;
      return (
        trData(item.name).toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        trData(item.category).toLowerCase().includes(q)
      );
    });
  }, [menuItems, activeCategory, query, trData]);

  const memberMatches = useMemo(() => {
    const q = loyaltyQuery.trim().toLowerCase();
    if (!q) return [];
    return customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.phoneNumber || '').toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [customers, loyaltyQuery]);

  const roastOpts = t('ops.pos.roastOptions') || [];
  const milkOpts = t('ops.pos.milkOptions') || [];
  const sweetOpts = t('ops.pos.sweetOptions') || [];
  const methodOpts = t('ops.pos.methodOptions') || [];

  function quickAddItem(item) {
    const defaultMods = `${roastOpts[0] || ''} · ${sweetOpts[0] || ''}`;
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (line) => line.menuItemId === item.id && line.modifiers === defaultMods
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + 1
        };
        return next;
      }
      return [
        ...prev,
        {
          uid: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          menuItemId: item.id,
          name: item.name,
          basePrice: item.price,
          unitPrice: item.price,
          quantity: 1,
          modifiers: defaultMods
        }
      ];
    });
  }

  function openModifiersForItem(item, existingLine = null) {
    setModModal({
      item,
      editUid: existingLine?.uid || null,
      roast: roastOpts[0] || '',
      milk: milkOpts[0] || '',
      sweet: sweetOpts[0] || '',
      method: methodOpts[0] || '',
      note: ''
    });
  }

  function confirmModifiers() {
    if (!modModal) return;
    const isOatExtra = modModal.milk.includes('+10k');
    const unitPrice = Number(modModal.item.price) + (isOatExtra ? 10000 : 0);
    const parts = [modModal.roast, modModal.milk, modModal.sweet, modModal.method];
    if (modModal.note.trim()) parts.push(modModal.note.trim());
    const modText = parts.filter(Boolean).join(' · ');

    if (modModal.editUid) {
      setCart((prev) =>
        prev.map((line) =>
          line.uid === modModal.editUid
            ? { ...line, unitPrice, modifiers: modText }
            : line
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          uid: `${modModal.item.id}-${Date.now()}`,
          menuItemId: modModal.item.id,
          name: modModal.item.name,
          basePrice: modModal.item.price,
          unitPrice,
          quantity: 1,
          modifiers: modText
        }
      ]);
    }
    setModModal(null);
  }

  function changeQty(uid, delta) {
    setCart((prev) =>
      prev
        .map((line) => (line.uid === uid ? { ...line, quantity: line.quantity + delta } : line))
        .filter((line) => line.quantity > 0)
    );
  }

  const totalCount = useMemo(() => cart.reduce((s, l) => s + l.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.unitPrice * l.quantity, 0), [cart]);
  const discPct = selectedMember ? privilegePct(selectedMember.membershipLevel) : 0;
  const discountAmount = Math.round((subtotal * discPct) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  async function submitOrder(settleImmediately = false) {
    if (!cart.length || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const chosenTableId =
        serviceMode === 'dinein' ? Number(tableId || tables[0]?.id || 1) : Number(tables[0]?.id || 1);
      const guest =
        (customerName || selectedMember?.name || '').trim() ||
        (serviceMode === 'takeaway' ? t('ops.pos.takeaway') : t('ops.orders.guestFallback'));

      const res = await api('/api/orders', {
        method: 'POST',
        body: {
          tableId: chosenTableId,
          serviceMode,
          customerName: guest,
          customerId: selectedMember?.id || null,
          discount: discountAmount,
          items: cart.map((line) => ({
            menuItemId: line.menuItemId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            modifiers: line.modifiers
          }))
        }
      });

      window.dispatchEvent(new CustomEvent('an:shift-updated'));
      if (settleImmediately && res?.id) {
        navigate(`/payments/${res.id}`);
      } else {
        navigate('/orders');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.pos.title')}</h1>
          <p>{t('ops.pos.subtitle')}</p>
        </div>

        <div className="ops-actions">
          <div className="ops-seg" role="group" aria-label="Service mode">
            <button
              type="button"
              className={serviceMode === 'dinein' ? 'is-on' : ''}
              onClick={() => setServiceMode('dinein')}
            >
              <OpsIcon name="floor" size={14} />
              <span>{t('ops.pos.dineIn')}</span>
            </button>
            <button
              type="button"
              className={serviceMode === 'takeaway' ? 'is-on' : ''}
              onClick={() => setServiceMode('takeaway')}
            >
              <OpsIcon name="roastery" size={14} />
              <span>{t('ops.pos.takeaway')}</span>
            </button>
            <button
              type="button"
              className={serviceMode === 'pickup' ? 'is-on' : ''}
              onClick={() => setServiceMode('pickup')}
            >
              <OpsIcon name="bean" size={14} />
              <span>{t('ops.pos.roasteryPickup')}</span>
            </button>
          </div>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      <div className="ops-pos-grid">
        {/* Left Catalog & Category Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            className="ops-panel"
            style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 14px' }}
          >
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
                <OpsIcon name="search" size={16} />
              </span>
              <input
                ref={searchInputRef}
                className="ops-input"
                style={{ paddingLeft: 36 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('ops.pos.searchPlaceholder')}
              />
            </div>

            <div className="ops-cat-tabs">
              <button
                type="button"
                className={`ops-cat-tab ${activeCategory === 'ALL' ? 'is-on' : ''}`}
                onClick={() => setActiveCategory('ALL')}
              >
                {t('ops.pos.allCategories')} ({menuItems.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`ops-cat-tab ${activeCategory === cat ? 'is-on' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {trData(cat)}
                </button>
              ))}
            </div>
          </div>

          <div className="ops-menu-cards">
            {visibleMenu.map((item) => (
              <article key={item.id} className="ops-menu-card" data-testid={`pos-item-${item.id}`}>
                <img
                  src={item.imageUrl || '/img/pos/salted-coffee.jpg'}
                  alt={trData(item.name)}
                  className="ops-menu-card__img"
                  loading="lazy"
                />
                <div className="ops-menu-card__body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: 13.5, lineHeight: 1.3 }}>{trData(item.name)}</strong>
                    <strong className="ops-mono" style={{ fontSize: 13, color: 'var(--an-caramel)' }}>
                      {money(item.price)}
                    </strong>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 11.5,
                      color: 'var(--an-muted)',
                      lineHeight: 1.42,
                      flex: 1
                    }}
                  >
                    {trData(item.description)}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
                    <button
                      type="button"
                      className="ops-btn ops-btn--sm"
                      onClick={() => openModifiersForItem(item)}
                    >
                      <OpsIcon name="sliders" size={13} />
                      <span>{t('ops.pos.customize')}</span>
                    </button>
                    <button
                      type="button"
                      className="ops-btn ops-btn--primary ops-btn--sm"
                      onClick={() => quickAddItem(item)}
                    >
                      <OpsIcon name="plus" size={14} />
                      <span>{t('ops.pos.quickAdd')}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Running Counter Ticket */}
        <aside className="ops-ticket-rail" aria-label={t('ops.pos.ticketHeader')}>
          <div
            style={{
              background: '#2b1d14',
              color: '#f5ecdf',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <OpsIcon name="receipt" size={17} />
              <strong style={{ fontSize: 14 }}>{t('ops.pos.ticketHeader')}</strong>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setCart([])}
                style={{
                  border: '1px solid rgba(245,236,223,0.22)',
                  background: 'transparent',
                  color: '#f5ecdf',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontSize: 11.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {t('ops.pos.clearCart')}
              </button>
            )}
          </div>

          {/* Table & Loyalty Assignment */}
          <div
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--an-line)',
              display: 'flex',
              flexDirection: 'column',
              gap: 9
            }}
          >
            {serviceMode === 'dinein' && (
              <div className="ops-field">
                <label htmlFor="pos-table-select">{t('ops.pos.selectTable')}</label>
                <select
                  id="pos-table-select"
                  className="ops-select"
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                >
                  {tables.map((tbl) => (
                    <option key={tbl.id} value={tbl.id}>
                      {trData(tbl.name)} · {trData(tbl.area)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <input
              className="ops-input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('ops.pos.guestNamePlaceholder')}
            />

            {/* Loyalty Member Lookup */}
            {selectedMember ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: 8,
                  background: 'color-mix(in srgb, var(--an-ok) 12%, var(--an-panel))',
                  border: '1px solid color-mix(in srgb, var(--an-ok) 35%, var(--an-line))',
                  fontSize: 12
                }}
              >
                <div>
                  <strong>{selectedMember.name}</strong>{' '}
                  <span className="ops-mono" style={{ color: 'var(--an-ok)' }}>
                    ({tf('ops.pos.loyaltyPointsTag', {
                      tier: selectedMember.membershipLevel,
                      pts: selectedMember.loyaltyPoints
                    })})
                  </span>
                </div>
                <button
                  type="button"
                  className="ops-btn ops-btn--sm"
                  onClick={() => setSelectedMember(null)}
                >
                  {t('ops.pos.loyaltyCleared')}
                </button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <input
                  className="ops-input"
                  value={loyaltyQuery}
                  onChange={(e) => setLoyaltyQuery(e.target.value)}
                  placeholder={t('ops.pos.loyaltyLookupPlaceholder')}
                />
                {memberMatches.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: '100%',
                      marginTop: 4,
                      zIndex: 15,
                      background: 'var(--an-panel)',
                      border: '1px solid var(--an-line)',
                      borderRadius: 8,
                      boxShadow: 'var(--an-shadow)',
                      overflow: 'hidden'
                    }}
                  >
                    {memberMatches.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedMember(m);
                          if (!customerName) setCustomerName(m.name);
                          setLoyaltyQuery('');
                        }}
                        style={{
                          width: '100%',
                          border: 0,
                          background: 'transparent',
                          padding: '8px 10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 12.5,
                          cursor: 'pointer',
                          color: 'var(--an-ink)',
                          fontFamily: 'inherit'
                        }}
                      >
                        <span>
                          <strong>{m.name}</strong> · {m.phoneNumber}
                        </span>
                        <span className="ops-mono">{m.membershipLevel}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Running Line Items */}
          <div style={{ padding: '12px 14px', maxHeight: 330, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <p style={{ margin: '18px 0', textAlign: 'center', fontSize: 12.5, color: 'var(--an-muted)' }}>
                {t('ops.pos.emptyCart')}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cart.map((line) => (
                  <div
                    key={line.uid}
                    style={{
                      paddingBottom: 10,
                      borderBottom: '1px dashed var(--an-line)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 5
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <strong style={{ fontSize: 13 }}>{trData(line.name)}</strong>
                      <strong className="ops-mono" style={{ fontSize: 13 }}>
                        {money(line.unitPrice * line.quantity)}
                      </strong>
                    </div>
                    {line.modifiers && (
                      <div style={{ fontSize: 11.5, color: 'var(--an-muted)' }}>
                        {trData(line.modifiers)}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const found = menuItems.find((m) => m.id === line.menuItemId);
                          if (found) openModifiersForItem(found, line);
                        }}
                        style={{
                          border: 0,
                          background: 'transparent',
                          color: 'var(--an-caramel)',
                          fontSize: 11.5,
                          fontWeight: 600,
                          padding: 0,
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        {t('ops.pos.customize')}
                      </button>

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <button
                          type="button"
                          className="ops-btn ops-btn--sm"
                          style={{ width: 28, padding: 0 }}
                          onClick={() => changeQty(line.uid, -1)}
                        >
                          <OpsIcon name="minus" size={13} />
                        </button>
                        <strong className="ops-mono" style={{ minWidth: 20, textAlign: 'center', fontSize: 13 }}>
                          {line.quantity}
                        </strong>
                        <button
                          type="button"
                          className="ops-btn ops-btn--sm"
                          style={{ width: 28, padding: 0 }}
                          onClick={() => changeQty(line.uid, 1)}
                        >
                          <OpsIcon name="plus" size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals & Fire Buttons */}
          <div
            style={{
              padding: '14px 16px',
              background: 'var(--an-soft)',
              borderTop: '1px solid var(--an-line)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span>{tf('ops.pos.subtotal', { count: totalCount })}</span>
              <span className="ops-mono">{money(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12.5,
                  color: 'var(--an-ok)'
                }}
              >
                <span>{tf('ops.pos.memberPrivilege', { pct: discPct })}</span>
                <span className="ops-mono">-{money(discountAmount)}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                paddingTop: 6,
                borderTop: '1px solid var(--an-line)'
              }}
            >
              <strong style={{ fontSize: 14 }}>{t('ops.pos.totalDue')}</strong>
              <strong className="ops-mono" style={{ fontSize: 21 }}>
                {money(grandTotal)}
              </strong>
            </div>

            <button
              type="button"
              disabled={!cart.length || submitting}
              className="ops-btn ops-btn--espresso"
              style={{ height: 42, marginTop: 4 }}
              onClick={() => submitOrder(false)}
            >
              <OpsIcon name="bolt" size={16} />
              <span>{submitting ? t('ops.pos.sending') : t('ops.pos.sendToBar')}</span>
            </button>

            <button
              type="button"
              disabled={!cart.length || submitting}
              className="ops-btn ops-btn--ok"
              onClick={() => submitOrder(true)}
            >
              <OpsIcon name="payments" size={16} />
              <span>{t('ops.pos.sendAndPay')}</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Drink Modifiers Modal */}
      {modModal && (
        <div
          className="ops-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setModModal(null)}
        >
          <div
            className="ops-cmd-dialog"
            style={{ maxWidth: 600, padding: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--an-font-display)', fontSize: 25 }}>
                {tf('ops.pos.modModalTitle', { name: trData(modModal.item.name) })}
              </h2>
              <button
                type="button"
                className="ops-btn ops-btn--sm"
                onClick={() => setModModal(null)}
              >
                <OpsIcon name="close" size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div className="ops-field">
                <label>{t('ops.pos.modRoast')}</label>
                <div className="ops-mod-grid">
                  {roastOpts.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`ops-mod-chip ${modModal.roast === opt ? 'is-on' : ''}`}
                      onClick={() => setModModal((m) => ({ ...m, roast: opt }))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ops-field">
                <label>{t('ops.pos.modMilk')}</label>
                <div className="ops-mod-grid">
                  {milkOpts.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`ops-mod-chip ${modModal.milk === opt ? 'is-on' : ''}`}
                      onClick={() => setModModal((m) => ({ ...m, milk: opt }))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ops-field">
                <label>{t('ops.pos.modSweetIce')}</label>
                <div className="ops-mod-grid">
                  {sweetOpts.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`ops-mod-chip ${modModal.sweet === opt ? 'is-on' : ''}`}
                      onClick={() => setModModal((m) => ({ ...m, sweet: opt }))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ops-field">
                <label>{t('ops.pos.modMethod')}</label>
                <div className="ops-mod-grid">
                  {methodOpts.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`ops-mod-chip ${modModal.method === opt ? 'is-on' : ''}`}
                      onClick={() => setModModal((m) => ({ ...m, method: opt }))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ops-field">
                <label>{t('ops.pos.modNote')}</label>
                <input
                  className="ops-input"
                  value={modModal.note}
                  onChange={(e) => setModModal((m) => ({ ...m, note: e.target.value }))}
                  placeholder={t('ops.pos.modNotePlaceholder')}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" className="ops-btn" onClick={() => setModModal(null)}>
                  {t('ops.common.cancel')}
                </button>
                <button type="button" className="ops-btn ops-btn--primary" onClick={confirmModifiers}>
                  <OpsIcon name="check" size={15} />
                  <span>{t('ops.pos.modConfirm')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
