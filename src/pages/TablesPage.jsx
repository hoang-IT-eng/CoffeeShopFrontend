import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { hasRole, useAuth } from '../auth';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

function stateAccent(floorState) {
  if (floorState === 'ordering') return '#b5835a';
  if (floorState === 'waiting') return '#a6631b';
  if (floorState === 'check') return '#b84a39';
  return '#2e5a44';
}

function TableGeometrySvg({ shape = 'four', seats = 4, floorState = 'available' }) {
  const accent = stateAccent(floorState);
  const fill =
    floorState === 'available'
      ? 'rgba(46, 90, 68, 0.10)'
      : floorState === 'ordering'
        ? 'rgba(181, 131, 90, 0.16)'
        : floorState === 'waiting'
          ? 'rgba(166, 99, 27, 0.15)'
          : 'rgba(184, 74, 57, 0.15)';

  if (shape === 'bar') {
    return (
      <svg width="132" height="68" viewBox="0 0 132 68" aria-hidden="true">
        <rect x="14" y="12" width="104" height="22" rx="6" fill={fill} stroke={accent} strokeWidth="2" />
        <circle cx="44" cy="49" r="9" fill="var(--an-panel)" stroke={accent} strokeWidth="1.8" />
        <circle cx="88" cy="49" r="9" fill="var(--an-panel)" stroke={accent} strokeWidth="1.8" />
      </svg>
    );
  }

  if (shape === 'communal' || seats >= 6) {
    return (
      <svg width="144" height="72" viewBox="0 0 144 72" aria-hidden="true">
        <rect x="30" y="6" width="18" height="8" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
        <rect x="63" y="6" width="18" height="8" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
        <rect x="96" y="6" width="18" height="8" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
        <rect x="20" y="18" width="104" height="34" rx="8" fill={fill} stroke={accent} strokeWidth="2" />
        <rect x="30" y="56" width="18" height="8" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
        <rect x="63" y="56" width="18" height="8" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
        <rect x="96" y="56" width="18" height="8" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
      </svg>
    );
  }

  if (shape === 'two' || seats <= 2) {
    return (
      <svg width="120" height="70" viewBox="0 0 120 70" aria-hidden="true">
        <rect x="18" y="25" width="12" height="20" rx="5" fill="var(--an-panel)" stroke={accent} strokeWidth="1.7" />
        <circle cx="60" cy="35" r="22" fill={fill} stroke={accent} strokeWidth="2" />
        <rect x="90" y="25" width="12" height="20" rx="5" fill="var(--an-panel)" stroke={accent} strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg width="124" height="72" viewBox="0 0 124 72" aria-hidden="true">
      <rect x="49" y="5" width="26" height="8" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
      <rect x="49" y="59" width="26" height="8" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
      <rect x="16" y="24" width="8" height="24" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
      <rect x="100" y="24" width="8" height="24" rx="3" fill="var(--an-panel)" stroke={accent} strokeWidth="1.6" />
      <rect x="30" y="16" width="64" height="40" rx="9" fill={fill} stroke={accent} strokeWidth="2" />
    </svg>
  );
}

function normalizeTable(tbl) {
  let floorState = tbl.floorState;
  if (!floorState) {
    if (tbl.status === 'Empty') floorState = 'available';
    else if (tbl.openOrderStatus === 'Ready' || tbl.status === 'Reserved') floorState = 'check';
    else if (tbl.openOrderStatus === 'Processing') floorState = 'waiting';
    else floorState = 'ordering';
  }
  const seats = tbl.seats || (tbl.shape === 'communal' ? 6 : tbl.shape === 'two' ? 2 : 4);
  return {
    ...tbl,
    seats,
    floorState,
    guests: tbl.guests ?? (floorState === 'available' ? 0 : Math.min(seats, 2)),
    seatedMinutes: tbl.seatedMinutes ?? (floorState === 'available' ? 0 : 9)
  };
}

export default function TablesPage() {
  const { user } = useAuth();
  const { t, tf, trData, money } = useLang();
  const navigate = useNavigate();
  const canOperate = hasRole(user, 'Admin', 'Cashier', 'Waiter');

  const [tables, setTables] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [zoneFilter, setZoneFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [mergeTargetId, setMergeTargetId] = useState('');
  const [orderInspector, setOrderInspector] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadTables = useCallback(async () => {
    try {
      const list = await api('/api/tables');
      const normalized = (list || []).map(normalizeTable);
      setTables(normalized);
      setSelectedId((prev) => prev ?? normalized[0]?.id ?? null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const selectedTable = useMemo(
    () => tables.find((tbl) => tbl.id === selectedId) || tables[0] || null,
    [tables, selectedId]
  );

  useEffect(() => {
    setMergeTargetId('');
    if (!selectedTable?.openOrderId) {
      setOrderInspector(null);
      return;
    }
    api(`/api/orders/${selectedTable.openOrderId}`)
      .then(setOrderInspector)
      .catch(() => setOrderInspector(null));
  }, [selectedTable?.id, selectedTable?.openOrderId]);

  const zones = useMemo(
    () => Array.from(new Set(tables.map((tbl) => tbl.area || 'Sân Trong Chính'))),
    [tables]
  );

  const counts = useMemo(() => {
    const acc = { available: 0, ordering: 0, waiting: 0, check: 0 };
    tables.forEach((tbl) => {
      acc[tbl.floorState] = (acc[tbl.floorState] || 0) + 1;
    });
    return acc;
  }, [tables]);

  const filteredByZone = useMemo(() => {
    const q = search.trim().toLowerCase();
    const visibleZones = zoneFilter === 'all' ? zones : zones.filter((z) => z === zoneFilter);
    return visibleZones
      .map((zone) => ({
        zone,
        items: tables.filter((tbl) => {
          if ((tbl.area || 'Sân Trong Chính') !== zone) return false;
          if (!q) return true;
          return (
            tbl.name.toLowerCase().includes(q) ||
            trData(tbl.area).toLowerCase().includes(q)
          );
        })
      }))
      .filter((group) => group.items.length > 0);
  }, [zones, zoneFilter, tables, search, trData]);

  async function setTableState(tableId, status, floorState) {
    setError('');
    setFeedback('');
    try {
      await api(`/api/tables/${tableId}/status`, {
        method: 'POST',
        body: { status, floorState }
      });
      if (status === 'Empty') setFeedback(t('ops.floor.clearedSuccess'));
      await loadTables();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMerge() {
    if (!selectedTable || !mergeTargetId) return;
    setError('');
    setFeedback('');
    try {
      await api('/api/tables/merge', {
        method: 'POST',
        body: {
          sourceTableId: selectedTable.id,
          targetTableId: Number(mergeTargetId)
        }
      });
      setSelectedId(Number(mergeTargetId));
      setMergeTargetId('');
      setFeedback(t('ops.floor.mergedSuccess'));
      await loadTables();
    } catch (err) {
      setError(err.message);
    }
  }

  function stateLabel(floorState) {
    if (floorState === 'ordering') return t('ops.floor.stateOrdering');
    if (floorState === 'waiting') return t('ops.floor.stateWaiting');
    if (floorState === 'check') return t('ops.floor.stateCheck');
    return t('ops.floor.stateAvailable');
  }

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{t('ops.floor.title')}</h1>
          <p>{t('ops.floor.subtitle')}</p>
        </div>

        <div className="ops-actions">
          <button type="button" className="ops-btn" onClick={loadTables}>
            <OpsIcon name="refresh" size={15} />
            <span>{t('ops.floor.refresh')}</span>
          </button>
          <Link to="/orders/new" className="ops-btn ops-btn--primary">
            <OpsIcon name="plus" size={16} />
            <span>{t('ops.floor.openNewOrder')}</span>
          </Link>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}
      {feedback && <div className="ops-alert ops-alert--ok">{feedback}</div>}

      {/* Legend & Zone Filter Toolbar */}
      <div
        className="ops-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          padding: '12px 16px'
        }}
      >
        <div className="ops-cat-tabs" style={{ paddingBottom: 0 }}>
          <button
            type="button"
            className={`ops-cat-tab ${zoneFilter === 'all' ? 'is-on' : ''}`}
            onClick={() => setZoneFilter('all')}
          >
            {t('ops.floor.allZones')} ({tables.length})
          </button>
          {zones.map((z) => (
            <button
              key={z}
              type="button"
              className={`ops-cat-tab ${zoneFilter === z ? 'is-on' : ''}`}
              onClick={() => setZoneFilter(z)}
            >
              {trData(z)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
            <span className="ops-badge ops-badge--ok">
              {t('ops.floor.stateAvailable')}: {counts.available}
            </span>
            <span className="ops-badge ops-badge--caramel">
              {t('ops.floor.stateOrdering')}: {counts.ordering}
            </span>
            <span className="ops-badge ops-badge--warn">
              {t('ops.floor.stateWaiting')}: {counts.waiting}
            </span>
            <span className="ops-badge ops-badge--danger">
              {t('ops.floor.stateCheck')}: {counts.check}
            </span>
          </div>

          <div style={{ width: 220 }}>
            <input
              className="ops-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('ops.floor.searchPlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Spatial Floor Canvas + Slide-Over Inspector */}
      <div className="ops-floor-layout">
        <div className="ops-floor-canvas">
          {filteredByZone.map((group) => (
            <section key={group.zone} className="ops-zone-section">
              <div className="ops-zone-head">
                <h3>{trData(group.zone)}</h3>
                <span className="ops-mono" style={{ fontSize: 12, color: 'var(--an-muted)' }}>
                  {group.items.filter((i) => i.floorState !== 'available').length}/{group.items.length}
                </span>
              </div>

              <div className="ops-zone-tables">
                {group.items.map((tbl) => {
                  const selected = selectedTable?.id === tbl.id;
                  return (
                    <button
                      key={tbl.id}
                      type="button"
                      onClick={() => setSelectedId(tbl.id)}
                      className={`ops-table-tile state-${tbl.floorState} ${selected ? 'is-selected' : ''}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <strong className="ops-mono" style={{ fontSize: 15 }}>
                          {trData(tbl.name)}
                        </strong>
                        <span className="ops-mono" style={{ fontSize: 11.5, color: 'var(--an-muted)' }}>
                          {tf('ops.floor.seats', { count: tbl.seats })}
                        </span>
                      </div>

                      <div className="ops-table-svg-stage">
                        <TableGeometrySvg
                          shape={tbl.shape}
                          seats={tbl.seats}
                          floorState={tbl.floorState}
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          fontSize: 11.5,
                          gap: 6
                        }}
                      >
                        <span style={{ fontWeight: 600, color: stateAccent(tbl.floorState) }}>
                          {stateLabel(tbl.floorState)}
                        </span>
                        {tbl.floorState !== 'available' ? (
                          <span className="ops-mono" style={{ color: 'var(--an-muted)' }}>
                            {tf('ops.floor.guests', { count: tbl.guests })} · {tbl.seatedMinutes}m
                          </span>
                        ) : (
                          <span style={{ color: 'var(--an-muted)' }}>{t('ops.floor.cleanReady')}</span>
                        )}
                      </div>

                      {tbl.openOrderId && (
                        <div
                          style={{
                            width: '100%',
                            paddingTop: 6,
                            borderTop: '1px dashed var(--an-line)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 12
                          }}
                        >
                          <span className="ops-mono">#{tbl.openOrderId}</span>
                          <strong className="ops-mono">{money(tbl.openOrderTotal)}</strong>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Right Slide-Over Inspector Drawer */}
        {selectedTable && (
          <aside className="ops-drawer-card" aria-label={t('ops.floor.inspectorTitle')}>
            <div className="ops-drawer-banner">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 11.5, color: '#ccbba8' }}>{trData(selectedTable.area)}</span>
                  <h2
                    style={{
                      margin: '2px 0 0',
                      fontFamily: 'var(--an-font-display)',
                      fontSize: 30,
                      fontWeight: 600,
                      lineHeight: 1.05
                    }}
                  >
                    {trData(selectedTable.name)}
                  </h2>
                </div>
                <span className="ops-badge" style={{ background: 'rgba(255,255,255,0.14)', color: '#f5ecdf' }}>
                  {stateLabel(selectedTable.floorState)}
                </span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 12, color: '#e0d2c1' }}>
                <span className="ops-mono">{tf('ops.floor.seats', { count: selectedTable.seats })}</span>
                {selectedTable.floorState !== 'available' && (
                  <>
                    <span className="ops-mono">
                      {tf('ops.floor.guests', { count: selectedTable.guests })}
                    </span>
                    <span className="ops-mono">{selectedTable.seatedMinutes}m</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Primary Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                <button
                  type="button"
                  className="ops-btn ops-btn--primary"
                  onClick={() => navigate(`/orders/new?tableId=${selectedTable.id}`)}
                >
                  <OpsIcon name="pos" size={16} />
                  <span>
                    {selectedTable.openOrderId
                      ? t('ops.floor.addMoreItems')
                      : t('ops.floor.openNewOrder')}
                  </span>
                </button>

                {selectedTable.openOrderId && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <Link
                      to={`/payments/${selectedTable.openOrderId}`}
                      className="ops-btn ops-btn--ok"
                    >
                      <OpsIcon name="payments" size={15} />
                      <span>{t('ops.floor.settleTab')}</span>
                    </Link>
                    <Link
                      to={`/orders/${selectedTable.openOrderId}`}
                      className="ops-btn"
                    >
                      <OpsIcon name="receipt" size={15} />
                      <span>#{selectedTable.openOrderId}</span>
                    </Link>
                  </div>
                )}

                {canOperate && selectedTable.floorState !== 'available' && (
                  <button
                    type="button"
                    className="ops-btn ops-btn--danger"
                    onClick={() => setTableState(selectedTable.id, 'Empty', 'available')}
                  >
                    <OpsIcon name="check" size={15} />
                    <span>{t('ops.floor.clearTable')}</span>
                  </button>
                )}
              </div>

              {/* Current Running Tab */}
              <div
                style={{
                  borderTop: '1px solid var(--an-line)',
                  paddingTop: 12
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8
                  }}
                >
                  <strong style={{ fontSize: 12.5 }}>{t('ops.floor.currentTab')}</strong>
                  {selectedTable.openOrderTotal > 0 && (
                    <strong className="ops-mono" style={{ fontSize: 14 }}>
                      {money(selectedTable.openOrderTotal)}
                    </strong>
                  )}
                </div>

                {!selectedTable.openOrderId ? (
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--an-muted)', lineHeight: 1.5 }}>
                    {t('ops.floor.noActiveOrder')}
                  </p>
                ) : (
                  <ul className="ops-kds-items" style={{ borderBottom: 0 }}>
                    {(orderInspector?.details || selectedTable.openOrderDetails || []).map((line) => (
                      <li key={line.id || line.menuItemId}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <span>
                            <strong className="ops-mono">{line.quantity}×</strong> {trData(line.name)}
                          </span>
                          <span className="ops-mono">{money(line.price * line.quantity)}</span>
                        </div>
                        {line.modifiers && <small>{trData(line.modifiers)}</small>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Merge / Transfer Table */}
              {canOperate && selectedTable.floorState !== 'available' && (
                <div style={{ borderTop: '1px solid var(--an-line)', paddingTop: 12 }}>
                  <div className="ops-field">
                    <label>{t('ops.floor.mergeLabel')}</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <select
                        className="ops-select"
                        value={mergeTargetId}
                        onChange={(e) => setMergeTargetId(e.target.value)}
                      >
                        <option value="">{t('ops.floor.mergeSelect')}</option>
                        {tables
                          .filter((other) => other.id !== selectedTable.id)
                          .map((other) => (
                            <option key={other.id} value={other.id}>
                              {trData(other.name)} · {trData(other.area)}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        className="ops-btn"
                        disabled={!mergeTargetId}
                        onClick={handleMerge}
                      >
                        <OpsIcon name="merge" size={15} />
                        <span>{t('ops.floor.mergeAction')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Status Override */}
              {canOperate && (
                <div style={{ borderTop: '1px solid var(--an-line)', paddingTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--an-muted)', marginBottom: 6 }}>
                    {t('ops.floor.setStatusLabel')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <button
                      type="button"
                      className="ops-btn ops-btn--sm"
                      onClick={() => setTableState(selectedTable.id, 'Empty', 'available')}
                    >
                      {t('ops.floor.stateAvailable')}
                    </button>
                    <button
                      type="button"
                      className="ops-btn ops-btn--sm"
                      onClick={() => setTableState(selectedTable.id, 'Occupied', 'ordering')}
                    >
                      {t('ops.floor.stateOrdering')}
                    </button>
                    <button
                      type="button"
                      className="ops-btn ops-btn--sm"
                      onClick={() => setTableState(selectedTable.id, 'Occupied', 'waiting')}
                    >
                      {t('ops.floor.stateWaiting')}
                    </button>
                    <button
                      type="button"
                      className="ops-btn ops-btn--sm"
                      onClick={() => setTableState(selectedTable.id, 'Reserved', 'check')}
                    >
                      {t('ops.floor.stateCheck')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
