import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

const PHOTO_PRESETS = [
  '/img/pos/salted-coffee.jpg',
  '/img/pos/coldbrew-tonic.jpg',
  '/img/pos/matcha-latte.jpg',
  '/img/pos/peach-tea.jpg',
  '/img/pos/butter-croissant.jpg',
  '/img/pos/tiramisu.jpg',
  '/img/pourover.jpg',
  '/img/phin.jpg'
];

const CATEGORIES = [
  'Espresso Bar',
  'Pour-Over & Filter',
  'Phin Đặc Sản',
  'Cold Brew & Tonic',
  'Matcha & Trà',
  'Bánh Nướng Xưởng'
];

export default function MenuFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t, trData } = useLang();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('55000');
  const [category, setCategory] = useState('Espresso Bar');
  const [imageUrl, setImageUrl] = useState(PHOTO_PRESETS[0]);
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api(`/api/menu/${id}`)
        .then((res) => {
          const item = res?.item;
          if (item) {
            setName(item.name || '');
            setPrice(String(item.price || 0));
            setCategory(item.category || 'Espresso Bar');
            setImageUrl(item.imageUrl || PHOTO_PRESETS[0]);
            setDescription(item.description || '');
            setIsAvailable(item.isAvailable !== false);
          }
          setRecipes(
            (res?.recipes || []).map((r) => ({
              inventoryItemId: r.inventoryItemId,
              quantityRequired: r.quantityRequired
            }))
          );
          setIngredients(res?.inventory || []);
        })
        .catch((err) => setError(err.message));
    } else {
      api('/api/menu/ingredients')
        .then((list) => setIngredients(list || []))
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  function addRecipeRow() {
    if (!ingredients.length) return;
    setRecipes((prev) => [
      ...prev,
      { inventoryItemId: ingredients[0].id, quantityRequired: 0.02 }
    ]);
  }

  function updateRecipeRow(idx, patch) {
    setRecipes((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  function removeRecipeRow(idx) {
    setRecipes((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = {
        name,
        price: Number(price || 0),
        category,
        imageUrl,
        description,
        isAvailable,
        recipes: recipes.map((r) => ({
          inventoryItemId: Number(r.inventoryItemId),
          quantityRequired: Number(r.quantityRequired)
        }))
      };
      if (isEdit) {
        await api(`/api/menu/${id}`, { method: 'PUT', body: payload });
      } else {
        await api('/api/menu', { method: 'POST', body: payload });
      }
      navigate('/menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{isEdit ? t('ops.menu.formEditTitle') : t('ops.menu.formNewTitle')}</h1>
        </div>

        <div className="ops-actions">
          <Link to="/menu" className="ops-btn">
            <OpsIcon name="arrowLeft" size={15} />
            <span>{t('ops.menu.backMenu')}</span>
          </Link>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="ops-shift-grid">
        <div className="ops-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="ops-field">
            <label htmlFor="menu-name">{t('ops.menu.nameLabel')}</label>
            <input
              id="menu-name"
              className="ops-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="ops-field">
              <label htmlFor="menu-price">{t('ops.menu.priceLabel')}</label>
              <input
                id="menu-price"
                type="number"
                min="1000"
                step="1000"
                className="ops-input ops-mono"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="ops-field">
              <label htmlFor="menu-cat">{t('ops.menu.categoryLabel')}</label>
              <select
                id="menu-cat"
                className="ops-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {trData(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ops-field">
            <label htmlFor="menu-img">{t('ops.menu.imageLabel')}</label>
            <input
              id="menu-img"
              className="ops-input ops-mono"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {PHOTO_PRESETS.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImageUrl(src)}
                  style={{
                    padding: 2,
                    borderRadius: 6,
                    border: imageUrl === src ? '2px solid var(--an-caramel)' : '1px solid var(--an-line)',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{ width: 44, height: 34, objectFit: 'cover', borderRadius: 4, display: 'block' }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="ops-field">
            <label htmlFor="menu-desc">{t('ops.menu.descLabel')}</label>
            <textarea
              id="menu-desc"
              rows={3}
              className="ops-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              style={{ accentColor: '#2b1d14' }}
            />
            <span>{t('ops.menu.availableCheck')}</span>
          </label>
        </div>

        <div className="ops-panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="ops-panel-head" style={{ marginBottom: 0 }}>
            <h2>{t('ops.menu.bomSectionTitle')}</h2>
            <button type="button" className="ops-btn ops-btn--sm" onClick={addRecipeRow}>
              <OpsIcon name="plus" size={14} />
              <span>{t('ops.menu.addIngredient')}</span>
            </button>
          </div>

          {recipes.length === 0 ? (
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--an-muted)' }}>
              {t('ops.menu.bomEmpty')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recipes.map((row, idx) => (
                <div
                  key={idx}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 110px auto', gap: 8, alignItems: 'center' }}
                >
                  <select
                    className="ops-select"
                    value={row.inventoryItemId}
                    onChange={(e) => updateRecipeRow(idx, { inventoryItemId: Number(e.target.value) })}
                  >
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {trData(ing.name)} ({trData(ing.unit)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    className="ops-input ops-mono"
                    value={row.quantityRequired}
                    onChange={(e) => updateRecipeRow(idx, { quantityRequired: e.target.value })}
                  />
                  <button
                    type="button"
                    className="ops-btn ops-btn--danger ops-btn--sm"
                    onClick={() => removeRecipeRow(idx)}
                  >
                    <OpsIcon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--an-line)' }}>
            <button
              type="submit"
              disabled={busy}
              className="ops-btn ops-btn--espresso"
              style={{ width: '100%', height: 42 }}
            >
              <OpsIcon name="check" size={16} />
              <span>{t('ops.menu.saveMenu')}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
