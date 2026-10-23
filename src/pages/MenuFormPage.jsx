import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

const empty = {
  name: '',
  price: '',
  description: '',
  imageUrl: '',
  category: 'Cà phê truyền thống',
  isAvailable: true,
  recipes: []
};

export default function MenuFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      api('/api/menu/ingredients')
        .then(setIngredients)
        .catch((err) => setError(err.message));
      return;
    }
    api(`/api/menu/${id}`)
      .then((data) => {
        setIngredients(data.inventory || []);
        setForm({ ...data.item, recipes: data.recipes || [] });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function setRecipe(index, field, value) {
    setForm((current) => ({
      ...current,
      recipes: current.recipes.map((recipe, i) =>
        i === index ? { ...recipe, [field]: value } : recipe
      )
    }));
  }

  function removeRecipe(index) {
    setForm((current) => ({
      ...current,
      recipes: current.recipes.filter((_, i) => i !== index)
    }));
  }

  async function submit(event) {
    event.preventDefault();
    const body = {
      ...form,
      price: Number(form.price),
      recipes: (form.recipes || []).map((recipe) => ({
        inventoryItemId: Number(recipe.inventoryItemId),
        quantityRequired: Number(recipe.quantityRequired)
      }))
    };
    try {
      if (id) await api(`/api/menu/${id}`, { method: 'PUT', body });
      else await api('/api/menu', { method: 'POST', body });
      navigate('/menu');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-desktop py-space-xl flex flex-col gap-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm">
            <Link to="/menu" className="hover:text-secondary no-underline">
              Thực Đơn &amp; Định Lượng BOM
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-bold">
              {id ? 'Chỉnh sửa món & BOM' : 'Thêm món mới'}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
            {id ? `Cập Nhật Món: ${form.name}` : 'Thêm Món Mới Vào Thực Đơn'}
          </h1>
        </div>
        <Link
          to="/menu"
          className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface font-label-md font-bold no-underline"
        >
          Quay lại
        </Link>
      </div>

      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container">{error}</div>
      )}

      <form
        onSubmit={submit}
        className="bg-surface-container-lowest rounded-2xl shadow-lg p-space-xl flex flex-col gap-space-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
          <div className="md:col-span-6 flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-bold">Tên món đồ uống / bánh</label>
            <input
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Vd: Cà Phê Muối Xứ Huế"
              className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div className="md:col-span-3 flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-bold">Giá bán (VND)</label>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => setField('price', e.target.value)}
              placeholder="35000"
              className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface font-mono font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div className="md:col-span-3 flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-bold">Danh mục</label>
            <input
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
              placeholder="Cà phê truyền thống"
              className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-md text-on-surface font-bold">
            Mô tả hương vị &amp; quy chuẩn pha chế
          </label>
          <textarea
            rows={3}
            value={form.description || ''}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Mô tả chi tiết hương vị và các bước pha chế tiêu chuẩn..."
            className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
          <div className="md:col-span-9 flex flex-col gap-1">
            <label className="font-label-md text-on-surface font-bold">Đường dẫn ảnh (URL)</label>
            <input
              value={form.imageUrl || ''}
              onChange={(e) => setField('imageUrl', e.target.value)}
              placeholder="https://..."
              className="px-space-md py-2.5 rounded-xl bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="md:col-span-3 pt-5">
            <label className="flex items-center gap-2 cursor-pointer font-label-md font-bold text-primary">
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#2c1810]"
                checked={!!form.isAvailable}
                onChange={(e) => setField('isAvailable', e.target.checked)}
              />
              <span>Mở bán trên POS</span>
            </label>
          </div>
        </div>

        {/* BOM Recipes */}
        <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-primary font-bold">
                Định Lượng Nguyên Liệu (BOM)
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Tự động trừ kho khi đơn hàng hoàn tất tại KDS.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setField('recipes', [
                  ...(form.recipes || []),
                  { inventoryItemId: '', quantityRequired: 0.02 }
                ])
              }
              className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-label-sm font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Thêm nguyên liệu</span>
            </button>
          </div>

          <div className="space-y-2">
            {(form.recipes || []).map((recipe, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center bg-surface-container-lowest p-space-sm rounded-xl"
              >
                <div className="md:col-span-7">
                  <select
                    value={recipe.inventoryItemId}
                    onChange={(e) => setRecipe(index, 'inventoryItemId', e.target.value)}
                    className="w-full px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md"
                  >
                    <option value="">-- Chọn nguyên liệu trong kho --</option>
                    {ingredients.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.unit ? `(${item.unit})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-4">
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={recipe.quantityRequired}
                    onChange={(e) => setRecipe(index, 'quantityRequired', e.target.value)}
                    placeholder="Định lượng"
                    className="w-full px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-mono font-bold"
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeRecipe(index)}
                    className="w-9 h-9 rounded-lg bg-error-container text-error flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-space-sm">
          <Link
            to="/menu"
            className="px-space-lg py-3 rounded-xl bg-surface-container text-on-surface font-label-md font-bold no-underline"
          >
            Hủy
          </Link>
          <button
            type="submit"
            className="px-space-xl py-3 rounded-xl bg-primary-container text-on-primary font-label-md font-bold shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-secondary-container text-[18px]">
              save
            </span>
            <span>Lưu Món &amp; Công Thức BOM</span>
          </button>
        </div>
      </form>
    </div>
  );
}
