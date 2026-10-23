import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, vnd } from '../api';

const fallbackThumbnails = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCE5HW7UxweZbVmuvvkan9b9HCS6ryI45AsQ95eR9jOYHISdqLyo_E00GK_vkTboG_FqNwMjJTrqfN6BoogOUV4MyBf96nPGJ-0EOC6uwTrLs3Kjx_huxMnxhFv0aGwqkcETt5CN0KO-4fpYXewUIj_ULnHopkJ6I7FftOuw7rSXlgElLmg0KxIrTfEn7cFDkb1TMw7uWMxqW99i-z9BNYIjG_wUr0E5uSjEI3LClX53JbITfyH5IY1_A',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAoEpVfBgKm4cVLxc-HL7x05Jn6w3DM0Pm9WRZ1_hsfx_j-7e2CXl4UbfIqRRm68l4EOqxX7uGaVz3c5XaOlKHEuH0BoFQSK1QKiqwtczs7r9HGSoQNLby48VCcAhw7HfB7yKjjdalwG-0AMXV6o_U22naqNuNt503aYdPTdSz0mvgQeIDTKOPEHe2NSRy9ok79YJIv23bgCIq2TgwHy8r_SaezGLx8h-UB204pAIVbpYbZmeXY6rNPIw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBFZ7AX-cH5mINyRCWeLrxyUK_Gew2vRCMgwCXCy_MsImUNHHadZmQWkkP-DzT_W6oIbe3hRHUOthjUG815QAn8L9hMLJ4jgZ8hu3NhD52O1PEOR2nxTa4Gzwb-SE3lz8PNEeQuqtP8IBD7IiyWSvvfszrx1ksGx8OxlQOaNwtpffsiGnlv9m7yYWxaNQtz0Jtc0gHDkGwZBli7dxY8VEYKWDcdYfP22667_hocgnio5xnp-qVCsMbF_Q',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCdpzis-SbrT01KfldScd0mwgqcLdBAJUqFzD7u4i8_UmTiZkeqc6QvyaWpQ3QyDicS0d5gf4ZZDqwsoLT67tCJ7wjpFe2ghBxD1HgRjTexRvm963KSTIXhhR9YM1TptA1ZSj8XgMLfOO7CMiMX1ExN0zyi15j5Euu9oaDFNa6IVA0vpKmfOhwu5EXhixFnRbsx6LcH6ZPQ74hDsdLsuu42NxgLzzqsxx3-Z5FfuRYxn0FZua_S64FOZw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDqeQlAznmhoIzjfqvY_e7O2BVQRi6oht_rg_Q21kqRY_VTn1q1-tKHVPNAyZr0tEMY219Sge9stvWypoxI66rC3B2t07Zv8Yhlp5aLFRgD65lzVm6Ir-7MtFmbmRG3_C1nc1piZiRvrTnIduomSoSM6dkmvqOcxZdlf3jGF2VqbbGaw14W8NaYSu5gcffGSyQGGCvCxIUeIvLkmV3nryhSMuwHikKxyI5gfWkLu3Ye_PNR2kF4SPD4nA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBVjDOScDv8ZjvZv42O1gy1hzzpCzu_A5UVW0dqyZ4DSbv74D7CII8QeqhiO3acRB5NzT16w1AI-pVIM5awvwZlWVVuP_uko5yuywUcLGAH5rcszTiASHyqrtNIvlAO92gCyEEC2wqvdejP3uvzCjAEqyA_CDlDN2SnK-MlG4Ojq9GK1Qnj5mhMncSnz0NsIxGVhJ_MWt36pno20Jee1fcf1YkQlOTMytYiyOygWf3y98JHA8gcJhIE7w'
];

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [bomDetail, setBomDetail] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sizeTab, setSizeTab] = useState('Size M (Chuẩn)');
  const [error, setError] = useState('');

  function load() {
    api('/api/menu')
      .then((rows) => {
        setItems(rows);
        setSelectedId((curr) => curr || rows[0]?.id);
      })
      .catch((err) => setError(err.message));
  }

  useEffect(load, []);

  useEffect(() => {
    if (!selectedId) return;
    api(`/api/menu/${selectedId}`)
      .then(setBomDetail)
      .catch(() => setBomDetail(null));
  }, [selectedId]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category || 'Cà phê'));
    return ['Tất cả', ...set];
  }, [items]);

  const visible = items.filter((item) => {
    const byCat = category === 'Tất cả' || (item.category || 'Cà phê') === category;
    const byQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const byStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'available'
        ? item.isAvailable
        : !item.isAvailable;
    return byCat && byQuery && byStatus;
  });

  async function toggleAvailable(item) {
    try {
      const detail = await api(`/api/menu/${item.id}`);
      await api(`/api/menu/${item.id}`, {
        method: 'PUT',
        body: {
          ...item,
          isAvailable: !item.isAvailable,
          recipes: detail.recipes || []
        }
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Xóa món "${item.name}" khỏi thực đơn?`)) return;
    await api(`/api/menu/${item.id}`, { method: 'DELETE' });
    load();
  }

  const selectedItem = items.find((i) => i.id === selectedId) || items[0];
  const cogsValue = selectedItem ? Math.round(selectedItem.price * 0.25) : 8450;
  const grossProfit = selectedItem ? selectedItem.price - cogsValue : 26550;

  return (
    <div className="flex flex-col w-full">
      {/* Sub-header / Top Navigation Utility Strip */}
      <div className="w-full px-margin-desktop py-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>Quản Trị Cơ Sở</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Menu &amp; Sản Phẩm</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-bold">Định Lượng &amp; Giá Vốn BOM</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
            Quản Lý Thực Đơn &amp; Định Lượng (BOM)
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Tối ưu hóa giá vốn hàng bán (COGS), công thức pha chế định lượng và kiểm soát tỷ suất lợi nhuận thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-label-md text-label-md flex items-center gap-space-xs shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Xuất Excel Bảng Giá Vốn</span>
          </button>
          <Link
            to="/inventory"
            className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-label-md text-label-md flex items-center gap-space-xs shadow-sm no-underline"
          >
            <span className="material-symbols-outlined text-[18px]">category</span>
            <span>Kho Nguyên Liệu</span>
          </Link>
          <Link
            to="/menu/new"
            className="px-space-md py-space-sm rounded-lg bg-primary-container text-on-primary hover:opacity-95 transition-all font-label-md text-label-md flex items-center gap-space-xs shadow-md font-bold no-underline"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary-container">
              add_circle
            </span>
            <span>+ Thêm Món Mới</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mx-margin-desktop mb-space-md p-space-md rounded-xl bg-error-container text-on-error-container">
          {error}
        </div>
      )}

      {/* Operational KPI Dashboard (4 Compact Cards) */}
      <div className="w-full px-margin-desktop py-space-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Tổng số món đang bán
              </span>
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-xs">
              <span className="font-price-display-lg text-price-display-lg text-primary font-extrabold">
                {items.length}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">món</span>
            </div>
            <div className="mt-space-xs flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              <span>
                Phân bổ trên <strong>{Math.max(1, categories.length - 1)} danh mục</strong>
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Giá vốn trung bình (COGS)
              </span>
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">pie_chart</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-xs">
              <span className="font-price-display-lg text-price-display-lg text-primary font-extrabold">
                26.8%
              </span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold">
                Tối ưu chuẩn
              </span>
            </div>
            <div className="mt-space-xs flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-secondary">
                trending_down
              </span>
              <span>
                Giảm <strong>-1.2%</strong> so với tháng trước
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Món tạm ngưng hôm nay
              </span>
              <div className="w-9 h-9 rounded-lg bg-error-container/40 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[20px]">
                  production_quantity_limits
                </span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-xs">
              <span className="font-price-display-lg text-price-display-lg text-error font-extrabold">
                {String(items.filter((i) => !i.isAvailable).length).padStart(2, '0')}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">món tại quầy</span>
            </div>
            <div className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-error">
              <span className="material-symbols-outlined text-[15px]">inventory_2</span>
              <span>Đồng bộ tự động từ Kho</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Biên lợi nhuận gộp TB
              </span>
              <div className="w-9 h-9 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">trending_up</span>
              </div>
            </div>
            <div className="mt-space-md flex items-baseline gap-space-xs">
              <span className="font-price-display-lg text-price-display-lg text-secondary font-extrabold">
                73.2%
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">chuẩn F&amp;B</span>
            </div>
            <div className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-secondary">
              <span className="material-symbols-outlined text-[15px]">edit_note</span>
              <span>Cập nhật công thức định lượng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Category Filter & Secondary Controls Strip */}
      <div className="w-full px-margin-desktop pt-space-lg pb-space-sm flex flex-col gap-space-md">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
              placeholder="Tìm tên món, mã SKU (F2)..."
              type="text"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-mono text-[10px]">
              F2
            </span>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-container-low text-on-surface font-label-md text-label-md py-2.5 px-3.5 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="available">Đang phục vụ (Còn hàng)</option>
              <option value="unavailable">Tạm hết hàng</option>
            </select>
            <button
              type="button"
              onClick={load}
              className="w-10 h-10 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-all"
              title="Làm mới bảng"
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Category Pills Switcher */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const active = category === cat;
            const count =
              cat === 'Tất cả'
                ? items.length
                : items.filter((i) => (i.category || 'Cà phê') === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-space-md py-2 rounded-lg font-label-md text-label-md whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                  active
                    ? 'bg-primary-container text-on-primary font-bold'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    active ? 'bg-surface-container-lowest/20' : 'bg-surface-container'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Section: Split Layout (Data Table + Sticky BOM Detail Drawer) */}
      <div className="w-full px-margin-desktop py-space-sm mb-space-2xl">
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-gutter-desktop items-start">
          {/* Left Master: Data Table of Menu Items */}
          <div className="2xl:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface font-bold">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  table_rows
                </span>
                <span>Danh Sách Món &amp; Giá Vốn BOM</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Hiển thị {visible.length} / {items.length} món
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm tracking-wide">
                    <th className="py-3 px-space-md">Sản phẩm &amp; SKU</th>
                    <th className="py-3 px-space-md text-right">Giá bán</th>
                    <th className="py-3 px-space-md text-right">Giá vốn BOM</th>
                    <th className="py-3 px-space-md text-center">Biên Lợi Nhuận</th>
                    <th className="py-3 px-space-md text-center">Bật/Tắt Quầy</th>
                    <th className="py-3 px-space-md text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface font-body-sm text-body-sm">
                  {visible.map((item, idx) => {
                    const isSelected = selectedItem?.id === item.id;
                    const itemCogs = Math.round(item.price * 0.25);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-secondary-container/15'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <td className="py-3.5 px-space-md">
                          <div className="flex items-center gap-space-sm">
                            <img
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              src={
                                item.imageUrl ||
                                fallbackThumbnails[idx % fallbackThumbnails.length]
                              }
                              alt={item.name}
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-label-md text-label-md font-bold text-primary truncate">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="px-1.5 py-0.2 rounded bg-surface-container-high font-mono text-[10px] text-on-surface-variant font-semibold">
                                  SKU-{String(item.id).padStart(2, '0')}
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant">
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-space-md text-right font-price-display-md text-price-display-md text-primary font-bold">
                          {vnd(item.price)}
                        </td>
                        <td className="py-3.5 px-space-md text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-label-md text-label-md font-bold text-on-surface">
                              {vnd(itemCogs)}
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              COGS 25.0%
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-space-md text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-md text-label-md font-bold">
                            <span className="material-symbols-outlined text-[14px]">
                              trending_up
                            </span>
                            75.0%
                          </span>
                        </td>
                        <td
                          className="py-3.5 px-space-md text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!!item.isAvailable}
                              onChange={() => toggleAvailable(item)}
                            />
                            <div className="w-10 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary-container" />
                          </label>
                          <span
                            className={`block text-[11px] font-medium mt-0.5 ${
                              item.isAvailable ? 'text-secondary' : 'text-error'
                            }`}
                          >
                            {item.isAvailable ? 'Còn hàng' : 'Tạm hết'}
                          </span>
                        </td>
                        <td
                          className="py-3.5 px-space-md text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedId(item.id)}
                              className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center hover:opacity-90 transition-all"
                              title="Xem định lượng chi tiết"
                            >
                              <span className="material-symbols-outlined text-[16px] text-secondary-container">
                                tune
                              </span>
                            </button>
                            <Link
                              to={`/menu/${item.id}`}
                              className="w-8 h-8 rounded-lg bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-all no-underline"
                              title="Sửa thông tin món & BOM"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => remove(item)}
                              className="w-8 h-8 rounded-lg bg-surface-container text-error flex items-center justify-center hover:bg-error-container transition-all"
                              title="Xóa món"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm">
              <div className="flex items-center gap-space-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-secondary">info</span>
                <span>
                  Giá vốn được tính tự động dựa trên đơn giá nhập gần nhất tại Kho Nguyên Liệu.
                </span>
              </div>
            </div>
          </div>

          {/* Right Detail Drawer: Interactive BOM Specification */}
          {selectedItem && (
            <div className="2xl:col-span-5 bg-surface-container-lowest rounded-xl shadow-lg p-space-lg flex flex-col gap-space-md relative overflow-hidden">
              <div className="flex items-start justify-between pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-lg bg-primary-container text-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">coffee_maker</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="px-2 py-0.5 rounded bg-secondary-container/20 text-on-secondary-container font-mono text-[10px] font-bold">
                        SKU-{String(selectedItem.id).padStart(2, '0')}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                        BOM Cấu Thành Món
                      </span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                      {selectedItem.name}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-all"
                    title="In thẻ định lượng bar"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                  </button>
                </div>
              </div>

              {/* Size / Variant Switcher Tabs */}
              <div className="flex items-center gap-space-xs p-1 rounded-lg bg-surface-container">
                {['Size M (Chuẩn)', 'Size L (+8.000đ)', 'Nóng (Hot)'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSizeTab(tab)}
                    className={`flex-1 py-1.5 px-space-sm rounded-md font-label-md text-label-md text-center transition-all ${
                      sizeTab === tab
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Live Financial Yield KPI Bar */}
              <div className="p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-space-sm">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Giá bán niêm yết
                  </span>
                  <span className="font-price-display-md text-price-display-md text-primary font-bold">
                    {vnd(selectedItem.price)}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-outline-variant/40" />
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Tổng giá vốn (COGS)
                  </span>
                  <span className="font-price-display-md text-price-display-md text-secondary font-bold">
                    {vnd(cogsValue)}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-outline-variant/40" />
                <div className="flex flex-col text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Lãi gộp / Ly
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-price-display-md text-price-display-md text-primary font-bold">
                      {vnd(grossProfit)}
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">
                      (75%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Ingredient Breakdown Table (BOM Items) */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                    <span>Thành phần nguyên liệu &amp; Bao bì</span>
                    <span className="text-[12px] font-normal text-on-surface-variant">
                      ({bomDetail?.recipes?.length || 4} thành phần)
                    </span>
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Định lượng / Ly
                  </span>
                </div>

                <div className="space-y-space-xs">
                  {(bomDetail?.recipes?.length
                    ? bomDetail.recipes.map((r) => ({
                        name: r.inventoryItemName || `Nguyên liệu #${r.inventoryItemId}`,
                        sub: 'Trừ tự động từ Kho Nguyên Liệu',
                        qty: `${r.quantityRequired}`,
                        cost: 'Định mức chuẩn',
                        stock: 'Sẵn sàng'
                      }))
                    : [
                        {
                          name: 'Cà phê Robusta Buôn Ma Thuột',
                          sub: '180.000đ / kg',
                          qty: '25g',
                          cost: '4.500đ',
                          stock: '18.5 kg'
                        },
                        {
                          name: 'Sữa đặc Ngôi Sao Phương Nam',
                          sub: '65.000đ / lon 1kg',
                          qty: '25ml',
                          cost: '1.625đ',
                          stock: '42 lon'
                        },
                        {
                          name: "Kem béo Rich's Non-Dairy",
                          sub: '42.000đ / hộp 454ml',
                          qty: '30ml',
                          cost: '2.175đ',
                          stock: '8 hộp'
                        },
                        {
                          name: 'Bao bì: Ly nắp tim + Ống hút giấy',
                          sub: 'Giá vốn đóng gói chuẩn',
                          qty: '1 bộ',
                          cost: '850đ',
                          stock: '1.250 bộ'
                        }
                      ]
                  ).map((ing, i) => (
                    <div
                      key={i}
                      className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-space-sm"
                    >
                      <div className="flex items-center gap-space-sm min-w-0">
                        <div className="w-8 h-8 rounded bg-primary-container/10 text-primary flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[18px]">grain</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-md text-label-md font-bold text-primary truncate">
                            {ing.name}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {ing.sub}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-space-md flex-shrink-0">
                        <div className="text-right">
                          <span className="font-label-md text-label-md font-bold text-primary">
                            {ing.qty}
                          </span>
                          <span className="block font-label-sm text-label-sm text-secondary font-medium">
                            {ing.cost}
                          </span>
                        </div>
                        <div className="w-20 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-label-sm font-semibold">
                            {ing.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/menu/${selectedItem.id}`}
                  className="w-full py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-all font-label-md text-label-md flex items-center justify-center gap-space-xs mt-space-xs no-underline"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    add_circle_outline
                  </span>
                  <span>+ Chỉnh Sửa Nguyên Liệu Định Lượng (BOM)</span>
                </Link>
              </div>

              {/* Recipe Preparation Notes */}
              <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
                <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    description
                  </span>
                  <span>Quy chuẩn pha chế nhanh:</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {selectedItem.description ||
                    "1. Rót 25ml sữa đặc đáy ly. 2. Đánh bông 30ml Rich's với 2g muối hồng. 3. Chiết xuất 50ml cốt cà phê phin đậm đặc. 4. Đổ đầy 180g đá viên, rót nhẹ lớp bọt kem muối lên bề mặt."}
                </p>
              </div>

              <div className="flex items-center gap-space-sm pt-space-xs">
                <Link
                  to={`/menu/${selectedItem.id}`}
                  className="flex-1 py-3 rounded-lg bg-primary-container text-on-primary hover:opacity-95 transition-all font-label-md text-label-md font-bold shadow-md flex items-center justify-center gap-space-xs no-underline"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary-container">
                    edit_square
                  </span>
                  <span>Cập Nhật Món &amp; BOM</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
