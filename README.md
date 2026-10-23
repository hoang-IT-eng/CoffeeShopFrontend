# CoffeeShop frontend

Giao diện React của hệ thống quản lý quán cà phê. Repo này chỉ chứa frontend. Backend ASP.NET nằm ở [CoffeeShopSolution](https://github.com/hoang-IT-eng/CoffeeShopSolution).

## Chạy local

Backend (thư mục `CoffeeShop`):

```bash
dotnet run --launch-profile http
```

API lắng nghe `http://localhost:5160`.

Frontend:

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`. Vite chuyển các request `/api` sang backend.

Tài khoản seed: `newadmin@coffee.com` / `NewAdmin@123`.

## Build

```bash
npm run build
```

File tĩnh nằm trong `dist/`. Khi deploy khác domain, đặt `VITE_API_URL` thành URL backend, ví dụ `https://api.example.com`.
