import { mockApi } from './mockApi';

const base = import.meta.env.VITE_API_URL || '';

export async function api(path, { method = 'GET', body } = {}) {
  // Bản build không cấu hình máy chủ (demo tĩnh) → dùng backend mô phỏng
  // ngay trong trình duyệt thay vì gọi vào host tĩnh (vốn trả lỗi 405).
  if (!base) return mockApi(path, { method, body });

  const response = await fetch(`${base}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || 'Không thực hiện được yêu cầu.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export function vnd(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function when(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('vi-VN');
}
