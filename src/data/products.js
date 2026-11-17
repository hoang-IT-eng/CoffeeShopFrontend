/**
 * Danh mục cửa hàng An Roastery — dữ liệu tĩnh song ngữ VI/EN, giá theo VND.
 * Phân nhóm lấy cảm hứng từ Delta Cafés (Nguyên hạt · Rang xay · Phin giấy · Đóng chai · Dụng cụ),
 * kèm vùng trồng, độ rang, thang vị (1–5) và thông số pha gợi ý.
 */
export const CATEGORIES = ['bean', 'ground', 'drip', 'rtd', 'gear'];

export const SUBFILTERS = ['all', 'cau-dat', 'highlands', 'son-la', 'blend'];

export const PRODUCTS = [
  {
    id: 'cau-dat-honey',
    cat: 'bean',
    originKey: 'cau-dat',
    img: '/img/bean-arabica.jpg',
    price: 195000,
    tag: { vi: 'Vụ mới', en: 'New harvest' },
    name: { vi: 'Arabica Cầu Đất Honey', en: 'Cau Dat Honey Arabica' },
    origin: { vi: 'Thôn Trường Thọ, Cầu Đất · 1.650 m', en: 'Truong Tho, Cau Dat · 1,650 m' },
    desc: {
      vi: 'Catimor và Bourbon thu hái chín đỏ, sơ chế yellow honey trên giàn kính 28 ngày. Rang sáng–vừa để giữ trọn vị mật ong rừng và cam vàng.',
      en: 'Ripe-picked Catimor and Bourbon dried 28 days on covered beds as yellow honey. Light-medium roast preserving wildflower honey and sweet orange.'
    },
    notes: { vi: 'Mật ong hoa rừng · Cam vàng · Hậu trà đen', en: 'Wild honey · Sweet orange · Black tea finish' },
    unit: { vi: 'Túi 250 g · Nguyên hạt', en: '250 g valve bag · Whole bean' },
    roast: 2,
    intensity: 3,
    acidity: 4,
    body: 3,
    brew: {
      vi: 'V60 / Kalita · 15 g : 240 ml · 92°C · 2 phút 45 giây',
      en: 'V60 / Kalita · 15 g : 240 ml · 92°C · 2m 45s'
    }
  },
  {
    id: 'son-la-washed',
    cat: 'bean',
    originKey: 'son-la',
    img: '/img/bean-sonla.jpg',
    price: 210000,
    tag: { vi: 'Lô nhỏ', en: 'Micro-lot' },
    name: { vi: 'Arabica Sơn La Chiềng Ban', en: 'Son La Chieng Ban Washed' },
    origin: { vi: 'Chiềng Ban, Mai Sơn · 1.250 m', en: 'Chieng Ban, Mai Son · 1,250 m' },
    desc: {
      vi: 'Lên men ướt 36 giờ trong bể nước suối lạnh vùng Tây Bắc, cho tách cà phê trong trẻo, thơm hoa cà phê trắng và táo xanh.',
      en: 'Washed and fermented for 36 hours in cool northwest mountain spring water, yielding a crisp cup of coffee blossom and green apple.'
    },
    notes: { vi: 'Hoa trắng · Táo xanh · Đường phèn', en: 'White blossom · Crisp apple · Rock sugar' },
    unit: { vi: 'Túi 250 g · Nguyên hạt', en: '250 g valve bag · Whole bean' },
    roast: 2,
    intensity: 2,
    acidity: 5,
    body: 2,
    brew: {
      vi: 'Pour-over / AeroPress · 16 g : 250 ml · 93°C · 2 phút 30 giây',
      en: 'Pour-over / AeroPress · 16 g : 250 ml · 93°C · 2m 30s'
    }
  },
  {
    id: 'bao-loc-robusta',
    cat: 'bean',
    originKey: 'highlands',
    img: '/img/bean-robusta.jpg',
    price: 155000,
    tag: null,
    name: { vi: 'Fine Robusta Bảo Lộc Natural', en: 'Bao Loc Natural Fine Robusta' },
    origin: { vi: 'Lộc Phát, Bảo Lộc · 950 m', en: 'Loc Phat, Bao Loc · 950 m' },
    desc: {
      vi: 'Robusta sẻ chín sẫm phơi nguyên quả chậm rãi. Thể chất dày, vị ca cao đắng dịu, hoàn toàn không khét hay gắt cổ.',
      en: 'Heirloom small-bean Robusta dried whole in the cherry. Syrupy body and dark cacao depth without harshness or burnt edges.'
    },
    notes: { vi: 'Ca cao đen · Mật mía · Hạnh nhân nướng', en: 'Dark cacao · Molasses · Toasted almond' },
    unit: { vi: 'Túi 250 g · Nguyên hạt', en: '250 g valve bag · Whole bean' },
    roast: 4,
    intensity: 5,
    acidity: 1,
    body: 5,
    brew: {
      vi: 'Phin / Espresso đậm · 22 g : 95 ml · 95°C',
      en: 'Phin / Bold espresso · 22 g : 95 ml · 95°C'
    }
  },
  {
    id: 'an-signature-blend',
    cat: 'bean',
    originKey: 'blend',
    img: '/img/bean-blend.jpg',
    price: 275000,
    tag: { vi: 'Tại quầy bar', en: 'House bar blend' },
    name: { vi: 'Lô Phối Số 01 — An House Blend', en: 'Lot 01 — An House Espresso Blend' },
    origin: { vi: '60% Cầu Đất · 40% Bảo Lộc', en: '60% Cau Dat · 40% Bao Loc' },
    desc: {
      vi: 'Công thức phối trộn đang chạy mỗi ngày trên máy Synesso của quán: lớp crema dày màu hạt dẻ, đứng vị cả khi uống đen lẫn pha sữa tươi.',
      en: 'The exact 60/40 blend running daily in our bar hoppers: hazelnut-toned crema that holds its structure neat or through steamed milk.'
    },
    notes: { vi: 'Hạt phỉ · Caramel bơ · Sô-cô-la sữa', en: 'Hazelnut · Brown butter caramel · Milk chocolate' },
    unit: { vi: 'Túi 500 g · Nguyên hạt', en: '500 g valve bag · Whole bean' },
    roast: 3,
    intensity: 4,
    acidity: 2,
    body: 4,
    brew: {
      vi: 'Espresso · 18 g vào → 36 g chiết · 93°C · 28 giây',
      en: 'Espresso · 18 g in → 36 g out · 93°C · 28s'
    }
  },
  {
    id: 'phin-truyen-thong',
    cat: 'ground',
    originKey: 'highlands',
    img: '/img/ground-bag.jpg',
    price: 125000,
    tag: null,
    name: { vi: 'Rang Xay Phin Mộc Cổ Điển', en: 'Classic Clean-Roast Phin Ground' },
    origin: { vi: 'Bảo Lộc & Đắk Nông · 900 m', en: 'Bao Loc & Dak Nong · 900 m' },
    desc: {
      vi: 'Rang mộc 100% không bơ rượu, xay đúng cỡ hạt đường cát cho phin nhôm hoặc inox. Giọt rơi chậm, sánh và thơm mùi đường thắng.',
      en: 'Unadulterated clean roast with zero butter or soy additives, ground to coarse-sugar texture for traditional metal phin filters.'
    },
    notes: { vi: 'Đậm sánh · Kẹo mạch nha · Ít chua', en: 'Dense body · Malt candy · Low acidity' },
    unit: { vi: 'Túi 250 g · Xay cỡ phin', en: '250 g bag · Ground for phin' },
    roast: 4,
    intensity: 5,
    acidity: 1,
    body: 5,
    brew: {
      vi: 'Phin 170 ml · 25 g bột · Ủ 30 giây + 90 ml nước 96°C',
      en: '170 ml phin · 25 g grounds · 30s bloom + 90 ml at 96°C'
    }
  },
  {
    id: 'espresso-xay-san',
    cat: 'ground',
    originKey: 'blend',
    img: '/img/ground-tin.jpg',
    price: 175000,
    tag: { vi: 'Hộp thiếc', en: 'Airtight tin' },
    name: { vi: 'Hộp Thiếc Espresso & Moka Pot', en: 'Espresso & Moka Pot Tin' },
    origin: { vi: 'Phối trộn Cầu Đất & Đắk Lắk', en: 'Cau Dat & Dak Lak blend' },
    desc: {
      vi: 'Xay mịn chuẩn cho ấm Moka Bialetti và máy pha gia đình, đóng lon thiếc nắp gài kín sáng để giữ trọn lớp dầu thơm.',
      en: 'Finely calibrated for stovetop Moka pots and home espresso machines, sealed in a light-proof tin to protect volatile aromatics.'
    },
    notes: { vi: 'Crema dày · Quế ấm · Sô-cô-la đắng', en: 'Rich crema · Warm cinnamon · Dark chocolate' },
    unit: { vi: 'Lon thiếc 250 g · Xay mịn', en: '250 g tin · Fine grind' },
    roast: 3,
    intensity: 4,
    acidity: 2,
    body: 4,
    brew: {
      vi: 'Moka Pot 3-cup / Máy gia đình · Đổ nước ấm vào đáy bình',
      en: '3-cup Moka pot / Home machine · Pre-heated water base'
    }
  },
  {
    id: 'filter-morning-ground',
    cat: 'ground',
    originKey: 'cau-dat',
    img: '/img/bean-arabica.jpg',
    price: 185000,
    tag: null,
    name: { vi: 'Cầu Đất Xay Sẵn Giấy Lọc', en: 'Cau Dat Filter Ground' },
    origin: { vi: 'Cầu Đất, Lâm Đồng · 1.600 m', en: 'Cau Dat, Lam Dong · 1,600 m' },
    desc: {
      vi: 'Arabica rang vừa xay cỡ trung bình cho phễu giấy và máy drip văn phòng. Vị thanh nhẹ, uống cả buổi sáng không mệt.',
      en: 'Medium-roasted highland Arabica ground specifically for paper cones and batch drip brewers. Clean, bright, effortless all morning.'
    },
    notes: { vi: 'Mơ chín · Trà bá tước · Hậu ngọt dịu', en: 'Ripe apricot · Earl Grey · Gentle sweetness' },
    unit: { vi: 'Túi 250 g · Xay cỡ giấy lọc', en: '250 g bag · Medium filter grind' },
    roast: 2,
    intensity: 3,
    acidity: 4,
    body: 2,
    brew: {
      vi: 'Phễu giấy / Máy drip · Tỉ lệ 1 : 16 · Nước 92°C',
      en: 'Paper cone / Drip brewer · 1 : 16 ratio · 92°C'
    }
  },
  {
    id: 'drip-cau-dat-box',
    cat: 'drip',
    originKey: 'cau-dat',
    img: '/img/drip-bag.jpg',
    price: 160000,
    tag: { vi: 'Tiện mang đi', en: 'Single-serve' },
    name: { vi: 'Phin Giấy Cầu Đất Sương Sớm', en: 'Cau Dat Morning Mist Drip Bags' },
    origin: { vi: '100% Arabica Cầu Đất · 1.650 m', en: '100% Cau Dat Arabica · 1,650 m' },
    desc: {
      vi: 'Mỗi túi lọc 12 g đóng khí nitơ ngay sau khi xay. Chỉ cần gác lên miệng cốc và rót nước nóng ba nhịp — tiện cho bàn làm việc và những chuyến đi xa.',
      en: 'Nitrogen-flushed 12 g single-serve filter bags. Hook onto any mug and pour in three slow pulses — crafted for desks, trains, and hotel mornings.'
    },
    notes: { vi: 'Cam vàng · Mật nhãn · Thơm dịu', en: 'Sweet orange · Longan honey · Silky clean' },
    unit: { vi: 'Hộp 10 gói × 12 g', en: 'Box of 10 × 12 g bags' },
    roast: 2,
    intensity: 3,
    acidity: 4,
    body: 3,
    brew: {
      vi: '1 gói · 180 ml nước 92°C chia 3 lần rót',
      en: '1 bag · 180 ml water at 92°C in 3 pours'
    }
  },
  {
    id: 'drip-di-san-box',
    cat: 'drip',
    originKey: 'blend',
    img: '/img/drip-bag.jpg',
    price: 145000,
    tag: null,
    name: { vi: 'Phin Giấy Phối Trộn Đậm Mộc', en: 'Heritage Bold Drip Bags' },
    origin: { vi: '50% Sơn La · 50% Fine Robusta', en: '50% Son La · 50% Fine Robusta' },
    desc: {
      vi: 'Dành cho người quen gu đậm truyền thống nhưng không tiện mang phin kim loại. Pha đen đá hay thêm một thìa sữa đặc đều trọn vị.',
      en: 'Built for lovers of bold Vietnamese phin coffee without carrying metal hardware. Holds up over ice or with condensed milk.'
    },
    notes: { vi: 'Sô-cô-la nướng · Hạt dẻ · Đậm vừa', en: 'Roasted cocoa · Chestnut · Medium-bold' },
    unit: { vi: 'Hộp 10 gói × 14 g', en: 'Box of 10 × 14 g bags' },
    roast: 4,
    intensity: 4,
    acidity: 2,
    body: 4,
    brew: {
      vi: '1 gói · 120 ml uống đậm hoặc 90 ml ăn kèm sữa đặc',
      en: '1 bag · 120 ml neat or 90 ml over condensed milk'
    }
  },
  {
    id: 'cold-brew-cam-vang',
    cat: 'rtd',
    originKey: 'cau-dat',
    img: '/img/coldbrew.jpg',
    price: 55000,
    tag: { vi: 'Mẻ sáng nay', en: 'Bottled daily' },
    name: { vi: 'Cold Brew Cam Vàng Ủ 24 Giờ', en: '24-Hour Orange Cold Brew' },
    origin: { vi: 'Arabica Cầu Đất · Đóng chai tại quầy', en: 'Cau Dat Arabica · Bottled at bar' },
    desc: {
      vi: 'Ngâm lạnh tròn 24 giờ trong phòng mát 4°C, lọc kép qua giấy và điểm vỏ cam vàng tươi. Thanh mát, không đường công nghiệp.',
      en: 'Steeped 24 hours at 4°C, double-paper filtered and finished with fresh orange zest. Crisp, naturally sweet, zero syrups.'
    },
    notes: { vi: 'Vỏ cam tươi · Mật ong · Trà hoa cúc', en: 'Fresh orange peel · Honey · Chamomile finish' },
    unit: { vi: 'Chai thủy tinh 330 ml · Giữ lạnh', en: '330 ml glass bottle · Keep chilled' },
    roast: 2,
    intensity: 2,
    acidity: 4,
    body: 2,
    brew: {
      vi: 'Rót qua đá già, ngon nhất trong 5 ngày từ ngày đóng chai',
      en: 'Pour over large ice; best within 5 days of bottling'
    }
  },
  {
    id: 'ca-phe-muoi-chai',
    cat: 'rtd',
    originKey: 'highlands',
    img: '/img/rtd-duo.jpg',
    price: 48000,
    tag: { vi: 'Được gọi nhiều', en: 'Bar favourite' },
    name: { vi: 'Cà Phê Muối Biển Đóng Chai', en: 'Bottled Sea-Salt Cream Coffee' },
    origin: { vi: 'Fine Robusta Bảo Lộc · Muối Sa Huỳnh', en: 'Bao Loc Robusta · Sa Huynh sea salt' },
    desc: {
      vi: 'Nền cà phê phin đậm kết hợp kem sữa đánh cùng muối biển hầm Sa Huỳnh. Vị mặn nhẹ đẩy hậu ngọt ca cao lên rõ rệt.',
      en: 'Dense phin-brewed Robusta layered with cream whisked with kiln-fired Sa Huynh sea salt, lifting the natural cocoa sweetness.'
    },
    notes: { vi: 'Kem muối dịu · Ca cao · Hậu béo thanh', en: 'Light salt cream · Cacao · Clean creamy finish' },
    unit: { vi: 'Chai thủy tinh 250 ml · Giữ lạnh', en: '250 ml glass bottle · Keep chilled' },
    roast: 4,
    intensity: 4,
    acidity: 1,
    body: 5,
    brew: {
      vi: 'Lắc nhẹ 3 lần trước khi rót ra ly đầy đá',
      en: 'Invert gently 3 times before pouring over ice'
    }
  },
  {
    id: 'bac-xiu-chai',
    cat: 'rtd',
    originKey: 'blend',
    img: '/img/rtd-duo.jpg',
    price: 45000,
    tag: null,
    name: { vi: 'Bạc Xỉu Sữa Đà Lạt Đóng Chai', en: 'Bottled Da Lat Milk Bac Xiu' },
    origin: { vi: 'House Blend · Sữa tươi thanh trùng', en: 'House Blend · Pasteurised highland milk' },
    desc: {
      vi: 'Tỉ lệ sữa tươi Đà Lạt và một shot ristretto kéo ngắn để giữ hương cà phê thơm ấm mà lượng caffeine vẫn nhẹ nhàng cho buổi chiều.',
      en: 'Highland fresh milk balanced with a short-pulled ristretto shot — aromatic coffee warmth with gentler afternoon caffeine.'
    },
    notes: { vi: 'Sữa tươi thanh · Caramel · Ít đắng', en: 'Fresh milk · Soft caramel · Low bitterness' },
    unit: { vi: 'Chai thủy tinh 250 ml · Giữ lạnh', en: '250 ml glass bottle · Keep chilled' },
    roast: 3,
    intensity: 2,
    acidity: 2,
    body: 4,
    brew: {
      vi: 'Dùng lạnh cùng đá viên, hoàn 5.000₫ khi trả vỏ chai sạch',
      en: 'Serve over ice; ₫5,000 bottle return credit in store'
    }
  },
  {
    id: 'phin-inox-an',
    cat: 'gear',
    originKey: 'all',
    img: '/img/phin.jpg',
    price: 115000,
    tag: null,
    name: { vi: 'Phin Inox 304 Đáy Đục Vi Lỗ', en: '304 Stainless Micro-Perforated Phin' },
    origin: { vi: 'Gia công cơ khí tại TP.HCM', en: 'Machined in Ho Chi Minh City' },
    desc: {
      vi: 'Thân inox 304 dày 1,2 mm giữ nhiệt ổn định suốt 6 phút nhỏ giọt; tấm chặn gài tự trọng không cần vặn ren.',
      en: '1.2 mm heavy-gauge 304 steel holds thermal mass across a six-minute drip; gravity tamper plate seats cleanly without threads.'
    },
    notes: { vi: 'Dung tích 170 ml · Lỗ lọc 0,6 mm · Bền trọn đời', en: '170 ml capacity · 0.6 mm holes · Lifetime build' },
    unit: { vi: 'Bộ 4 chi tiết: nắp, thân, chặn, đĩa kê', en: '4-piece set: lid, chamber, press, saucer' },
    roast: null,
    intensity: null,
    acidity: null,
    body: null,
    brew: {
      vi: 'Tráng nước sôi làm nóng phin trước khi cho 25 g bột vào',
      en: 'Pre-warm filter with boiling water before dosing 25 g'
    }
  },
  {
    id: 'bo-pourover-v60',
    cat: 'gear',
    originKey: 'all',
    img: '/img/pourover.jpg',
    price: 890000,
    tag: { vi: 'Bộ thủ công', en: 'Craft set' },
    name: { vi: 'Bộ Phễu Sứ V60, Bình Thủy Tinh & Ấm Cổ Ngỗng', en: 'Ceramic V60, Server & Gooseneck Kettle Set' },
    origin: { vi: 'Sứ nung 1.280°C · Thủy tinh chịu nhiệt', en: '1,280°C stoneware · Borosilicate glass' },
    desc: {
      vi: 'Gân xoắn bên trong phễu sứ thoát khí đều, đi kèm bình chia vạch 600 ml và ấm vòi mảnh giúp người mới dễ giữ dòng nước thẳng.',
      en: 'Spiral-ribbed stoneware cone paired with a 600 ml range server and narrow-spout kettle for steady, controlled pours.'
    },
    notes: { vi: 'Phễu cỡ 02 · Bình 600 ml · Kèm 40 giấy lọc mộc', en: 'Size 02 dripper · 600 ml server · 40 unbleached filters' },
    unit: { vi: 'Trọn bộ 3 món đóng hộp giấy kraft', en: '3-piece set in kraft box' },
    roast: null,
    intensity: null,
    acidity: null,
    body: null,
    brew: {
      vi: 'Phù hợp 1 – 3 tách (15 g đến 30 g cà phê mỗi lần pha)',
      en: 'Brews 1 – 3 cups (15 g to 30 g coffee per batch)'
    }
  },
  {
    id: 'bo-tach-su',
    cat: 'gear',
    originKey: 'all',
    img: '/img/cups.jpg',
    price: 340000,
    tag: null,
    name: { vi: 'Cặp Tách Sứ Men Tro Làng Gốm', en: 'Ash-Glaze Stoneware Cup Pair' },
    origin: { vi: 'Lò gốm Lái Thiêu, Bình Dương', en: 'Lai Thieu kiln, Binh Duong' },
    desc: {
      vi: 'Chuốt tay từ đất sét địa phương và phủ men tro trấu tự nhiên — thành tách dày giữ lớp crema espresso và phin nóng lâu hơn.',
      en: 'Wheel-thrown from local stoneware clay and dipped in rice-husk ash glaze — thick walls hold espresso crema and heat.'
    },
    notes: { vi: 'Men tro độc bản · 180 ml · Rửa máy an toàn', en: 'Unique ash glaze · 180 ml · Dishwasher safe' },
    unit: { vi: '2 tách + 2 đĩa lót gốm', en: '2 cups + 2 stoneware saucers' },
    roast: null,
    intensity: null,
    acidity: null,
    body: null,
    brew: {
      vi: 'Cỡ 180 ml vừa vặn cho cappuccino, flat white và cà phê phin nóng',
      en: '180 ml volume sized for flat whites, cappuccinos, and hot phin'
    }
  }
];
