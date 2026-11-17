/**
 * Danh mục cửa hàng An Roastery — dữ liệu tĩnh song ngữ, giá theo VND.
 * cat: 'bean' | 'ground' | 'rtd' | 'gear' — nhãn danh mục nằm ở i18n (products.categories).
 */
export const PRODUCTS = [
  {
    id: 'cau-dat-honey',
    cat: 'bean',
    img: '/img/bean-arabica.jpg',
    price: 185000,
    badge: { vi: 'Bán chạy', en: 'Best seller' },
    name: { vi: 'Arabica Cầu Đất Honey', en: 'Cau Dat Honey Arabica' },
    desc: {
      vi: 'Arabica độ cao 1.650 m sơ chế honey, rang vừa để giữ nốt mật ong và cam vàng. Hợp pour-over và espresso nhẹ.',
      en: 'Honey-processed arabica from 1,650 m, roasted medium to keep its honey and orange notes. Lovely as pour-over or a gentle espresso.'
    },
    notes: { vi: 'Mật ong · Cam vàng · Trà đen', en: 'Honey · Orange · Black tea' },
    unit: { vi: 'Túi 250 g · Nguyên hạt', en: '250 g bag · Whole bean' }
  },
  {
    id: 'bao-loc-robusta',
    cat: 'bean',
    img: '/img/bean-robusta.jpg',
    price: 145000,
    badge: null,
    name: { vi: 'Robusta Bảo Lộc Natural', en: 'Bao Loc Natural Robusta' },
    desc: {
      vi: 'Robusta tuyển chín phơi natural nguyên quả — đậm, ít chua, sinh ra để pha phin và cà phê sữa đá.',
      en: 'Ripe-selected robusta dried natural in the cherry — bold, low-acid, born for phin filters and iced milk coffee.'
    },
    notes: { vi: 'Ca cao · Mật mía · Hậu khói nhẹ', en: 'Cacao · Cane sugar · Gentle smoke' },
    unit: { vi: 'Túi 250 g · Nguyên hạt', en: '250 g bag · Whole bean' }
  },
  {
    id: 'an-signature-blend',
    cat: 'bean',
    img: '/img/bean-blend.jpg',
    price: 265000,
    badge: { vi: 'Đặc trưng', en: 'Signature' },
    name: { vi: 'An Signature Blend', en: 'An Signature Blend' },
    desc: {
      vi: 'Phối 60% arabica Cầu Đất và 40% robusta Bảo Lộc — công thức espresso đang pha tại quầy bar của quán mỗi ngày.',
      en: 'A 60% Cau Dat arabica and 40% Bao Loc robusta blend — the very espresso recipe our bar pulls every day.'
    },
    notes: { vi: 'Hạt dẻ · Caramel · Sô-cô-la sữa', en: 'Hazelnut · Caramel · Milk chocolate' },
    unit: { vi: 'Túi 500 g · Nguyên hạt', en: '500 g bag · Whole bean' }
  },
  {
    id: 'phin-truyen-thong',
    cat: 'ground',
    img: '/img/ground-bag.jpg',
    price: 120000,
    badge: null,
    name: { vi: 'Cà Phê Phin Truyền Thống', en: 'Traditional Phin Ground Coffee' },
    desc: {
      vi: 'Robusta rang mộc xay đúng cỡ phin, đậm sánh và ít chua. Chỉ cần phin, nước sôi và 5 phút chậm rãi.',
      en: 'Clean-roasted robusta ground to phin size — dense, smooth and low in acid. All you need is a filter, hot water and five slow minutes.'
    },
    notes: { vi: 'Đậm đà · Hậu ca cao · Ít chua', en: 'Full-bodied · Cocoa finish · Low acid' },
    unit: { vi: 'Túi 250 g · Xay sẵn cho phin', en: '250 g bag · Ground for phin' }
  },
  {
    id: 'espresso-xay-san',
    cat: 'ground',
    img: '/img/ground-tin.jpg',
    price: 165000,
    badge: null,
    name: { vi: 'Espresso Xay Sẵn', en: 'Pre-Ground Espresso' },
    desc: {
      vi: 'Signature Blend xay mịn cho máy espresso gia đình, đóng hộp thiếc kín khí kèm van một chiều giữ hương.',
      en: 'Our Signature Blend ground fine for home espresso machines, sealed in an airtight tin with a one-way freshness valve.'
    },
    notes: { vi: 'Crema dày · Cân bằng · Ngọt hậu', en: 'Thick crema · Balanced · Sweet finish' },
    unit: { vi: 'Hộp 250 g · Xay sẵn espresso', en: '250 g tin · Ground for espresso' }
  },
  {
    id: 'cold-brew-cam-vang',
    cat: 'rtd',
    img: '/img/coldbrew.jpg',
    price: 55000,
    badge: { vi: 'Mới', en: 'New' },
    name: { vi: 'Cold Brew Cam Vàng', en: 'Orange Cold Brew' },
    desc: {
      vi: 'Arabica Cầu Đất ngâm lạnh 24 giờ, điểm một lát cam vàng tươi — món signature của quán, đóng chai mang đi.',
      en: 'Cau Dat arabica steeped cold for 24 hours with a slice of fresh orange — our signature, bottled to go.'
    },
    notes: { vi: 'Cam tươi · Mật ong · Hậu trà', en: 'Fresh orange · Honey · Tea-like finish' },
    unit: { vi: 'Chai 330 ml · Giữ lạnh', en: '330 ml bottle · Keep chilled' }
  },
  {
    id: 'ca-phe-muoi-chai',
    cat: 'rtd',
    img: '/img/rtd-duo.jpg',
    price: 48000,
    badge: { vi: 'Bán chạy', en: 'Best seller' },
    name: { vi: 'Cà Phê Muối Đóng Chai', en: 'Bottled Salted Coffee' },
    desc: {
      vi: 'Robusta đậm phủ kem muối biển béo nhẹ, đóng chai tại quầy mỗi sáng. Lắc đều, rót qua đá và thưởng thức.',
      en: 'Bold robusta under a light sea-salt cream, bottled at the bar each morning. Shake, pour over ice and enjoy.'
    },
    notes: { vi: 'Kem muối · Ca cao · Đậm vừa', en: 'Salt cream · Cocoa · Medium-bold' },
    unit: { vi: 'Chai 250 ml · Giữ lạnh', en: '250 ml bottle · Keep chilled' }
  },
  {
    id: 'bac-xiu-chai',
    cat: 'rtd',
    img: '/img/rtd-duo.jpg',
    price: 45000,
    badge: null,
    name: { vi: 'Bạc Xỉu Đóng Chai', en: 'Bottled Bac Xiu' },
    desc: {
      vi: 'Bạc xỉu ba tầng phiên bản mang đi: sữa đặc, sữa tươi Đà Lạt và một shot espresso sánh ở lớp trên cùng.',
      en: 'Our three-layer bac xiu to go: condensed milk, Da Lat fresh milk and a dense espresso shot floating on top.'
    },
    notes: { vi: 'Sữa tươi · Dịu ngọt · Ít đắng', en: 'Fresh milk · Gently sweet · Low bitterness' },
    unit: { vi: 'Chai 250 ml · Giữ lạnh', en: '250 ml bottle · Keep chilled' }
  },
  {
    id: 'phin-inox-an',
    cat: 'gear',
    img: '/img/phin.jpg',
    price: 95000,
    badge: null,
    name: { vi: 'Phin Inox An Roastery 170 ml', en: 'An Roastery Stainless Phin 170 ml' },
    desc: {
      vi: 'Phin inox 304 dày, lỗ lọc đều cho dòng chảy ổn định — đúng chiếc phin barista của quán dùng mỗi sáng.',
      en: 'Thick 304 stainless phin with even filter holes for a steady drip — the same filter our baristas use every morning.'
    },
    notes: { vi: 'Inox 304 · Dòng chảy đều · Bền bỉ', en: '304 steel · Even flow · Built to last' },
    unit: { vi: '1 phin 170 ml + nắp gài', en: '1 × 170 ml filter + press lid' }
  },
  {
    id: 'bo-pourover-v60',
    cat: 'gear',
    img: '/img/pourover.jpg',
    price: 890000,
    badge: { vi: 'Thủ công', en: 'Handcrafted' },
    name: { vi: 'Bộ Pour-Over V60 & Ấm Cổ Ngỗng', en: 'V60 Pour-Over & Gooseneck Set' },
    desc: {
      vi: 'Phễu sứ V60 nung tay, bình server thủy tinh 600 ml và ấm cổ ngỗng kiểm soát dòng rót — trọn bộ cho pour-over tại nhà.',
      en: 'A hand-glazed ceramic V60 dripper, 600 ml glass server and a flow-control gooseneck kettle — the complete home pour-over set.'
    },
    notes: { vi: 'Sứ nung tay · 600 ml · Rót chuẩn xác', en: 'Hand-glazed ceramic · 600 ml · Precise pour' },
    unit: { vi: 'Bộ 3 món · Hộp quà', en: '3-piece set · Gift box' }
  },
  {
    id: 'bo-tach-su',
    cat: 'gear',
    img: '/img/cups.jpg',
    price: 320000,
    badge: null,
    name: { vi: 'Bộ Tách Sứ Thủ Công (2 tách)', en: 'Handmade Ceramic Cup Set (2 cups)' },
    desc: {
      vi: 'Tách sứ men tro nung tay tại làng gốm, mỗi chiếc một vân men riêng. Cầm ấm tay, giữ nhiệt tốt cho phin và espresso.',
      en: 'Ash-glazed cups hand-thrown at a pottery village, each with its own glaze pattern. Warm in the hand and kind to phin or espresso.'
    },
    notes: { vi: 'Men tro · 180 ml · Làm tay', en: 'Ash glaze · 180 ml · Handmade' },
    unit: { vi: '2 tách + 2 đĩa lót', en: '2 cups + 2 saucers' }
  }
];

export const CATEGORIES = ['bean', 'ground', 'rtd', 'gear'];
