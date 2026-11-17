/**
 * Dữ liệu biên tập song ngữ (VI / EN) cho các chuyên mục lấy cảm hứng từ Delta Cafés:
 * - Chu trình 4 bước (Vùng trồng · Lồng rang · Phối trộn · Thử nếm)
 * - Trắc nghiệm gu cà phê (Coffee Profile Quiz)
 * - Giải pháp doanh nghiệp (Business Solutions)
 * - Bền vững & Lô hiếm (Sustainability & Micro-lots)
 * - Nhật ký cà phê (The Coffee Journal)
 */

export const COFFEE_CYCLE = [
  {
    id: 'origins',
    num: '01',
    img: '/scroll/1-suong-cau-dat.jpg',
    metric: '1.650 m',
    metricSub: {
      vi: 'Độ cao trung bình vườn liên kết Lâm Đồng & Sơn La',
      en: 'Mean elevation across partner gardens in Lam Dong & Son La'
    },
    tab: { vi: 'Vùng trồng', en: 'Origins' },
    title: {
      vi: ' Thổ nhưỡng và sương mù giữ đường tự nhiên trong quả',
      en: 'Highland mist and basalt soil lock natural sugars in the cherry'
    },
    body: {
      vi: 'Cây cà phê không thích vội vàng. Ở độ cao trên 1.200 m tại Cầu Đất và Mai Sơn, biên độ nhiệt ngày–đêm lớn làm quả chín chậm hơn gần sáu tuần so với vùng thấp, giúp nhân hạt đặc chắc và tích tụ axit hữu cơ thanh dịu.',
      en: 'Coffee refuses to be rushed. Above 1,200 m in Cau Dat and Mai Son, wide day-to-night temperature swings slow cherry maturation by nearly six weeks, building denser seeds and clean organic acids.'
    },
    specs: [
      { label: { vi: 'Vùng thu mua', en: 'Growing regions' }, value: { vi: 'Cầu Đất, Bảo Lộc, Mai Sơn', en: 'Cau Dat, Bao Loc, Mai Son' } },
      { label: { vi: 'Tỉ lệ quả chín', en: 'Ripe cherry rate' }, value: { vi: '≥ 92% hái chọn tay', en: '≥ 92% hand-sorted red' } },
      { label: { vi: 'Độ ẩm nhân xanh', en: 'Green moisture' }, value: { vi: '10,8 – 11,5%', en: '10.8 – 11.5%' } }
    ]
  },
  {
    id: 'roast',
    num: '02',
    img: '/scroll/3-trong-rang.jpg',
    metric: '196 °C',
    metricSub: {
      vi: 'Ngưỡng tiếng nổ đầu tiên (First Crack) trên trống gang Giesen W6A',
      en: 'First-crack threshold inside our cast-iron Giesen W6A drum'
    },
    tab: { vi: 'Lồng rang', en: 'Roast' },
    title: {
      vi: 'Mẻ nhỏ dưới 5 kg, nghe từng nhịp nở của hạt',
      en: 'Batches under 5 kg, guided by airflow and rate-of-rise'
    },
    body: {
      vi: 'Rang mộc nghĩa là không dùng bơ hay hương liệu che lấp khuyết điểm. Người thợ rang điều chỉnh áp suất gió và nhiệt truyền qua thành trống gang để đường caramel hóa vừa tới, giữ hương hoa trái của Arabica hoặc vị sô-cô-la tròn trịa của Fine Robusta.',
      en: 'Clean roasting means zero butter, caramel, or artificial glaze. Our roasters modulate drum airflow and conductive heat so sugars caramelise cleanly — keeping Arabica florals intact and Fine Robusta cocoa smooth.'
    },
    specs: [
      { label: { vi: 'Thiết bị', en: 'Roaster' }, value: { vi: 'Giesen W6A trống gang', en: 'Cast-iron Giesen W6A' } },
      { label: { vi: 'Thời gian mẻ', en: 'Batch duration' }, value: { vi: '9 phút 30 – 11 phút 45', en: '9m 30s – 11m 45s' } },
      { label: { vi: 'Thời gian nghỉ hạt', en: 'Degassing rest' }, value: { vi: '48 – 96 giờ trước khi pha', en: '48 – 96 hrs before brewing' } }
    ]
  },
  {
    id: 'blend',
    num: '03',
    img: '/img/bean-sonla.jpg',
    metric: '60 / 40',
    metricSub: {
      vi: 'Tỉ lệ Arabica Cầu Đất & Fine Robusta Bảo Lộc cho quầy espresso',
      en: 'Cau Dat Arabica to Bao Loc Fine Robusta in our bar hopper'
    },
    tab: { vi: 'Phối trộn', en: 'Blend' },
    title: {
      vi: 'Rang riêng từng giống rồi mới phối theo mùa vụ',
      en: 'Post-roast blending tuned as each harvest shifts'
    },
    body: {
      vi: 'Hạt Arabica và Robusta có kích thước cũng như mật độ tế bào khác nhau nên không bao giờ được đổ chung vào một mẻ rang. Xưởng rang riêng từng lô theo đồ thị tối ưu rồi mới phối trộn, giúp tách cà phê vừa có hương thơm mở đầu sáng, vừa có hậu vị dày bền.',
      en: 'Because Arabica and Robusta differ in bean density and cell structure, we never roast them together. Each lot follows its own curve first, then joins in post-roast harmony for aromatic lift and lingering body.'
    },
    specs: [
      { label: { vi: 'Phương pháp', en: 'Method' }, value: { vi: 'Phối sau rang (Post-roast)', en: 'Post-roast blending' } },
      { label: { vi: 'Kiểm định màu rang', en: 'Color target' }, value: { vi: 'Agtron 58 – 64', en: 'Agtron 58 – 64' } },
      { label: { vi: 'Hiệu chỉnh công thức', en: 'Seasonal tuning' }, value: { vi: 'Mỗi quý theo độ ẩm vụ mùa', en: 'Quarterly per crop moisture' } }
    ]
  },
  {
    id: 'tasting',
    num: '04',
    img: '/img/cupping-lab.jpg',
    metric: '84.5+',
    metricSub: {
      vi: 'Điểm thử nếm mù (SCA Cupping) tối thiểu để đưa hạt lên kệ',
      en: 'Minimum blind SCA cupping score required to release a lot'
    },
    tab: { vi: 'Thử nếm', en: 'Tasting' },
    title: {
      vi: 'Mọi mẻ rang đều qua bàn cupping trước khi đóng túi',
      en: 'Every production roast crosses the cupping table before packing'
    },
    body: {
      vi: 'Sáng thứ Tư và thứ Bảy hằng tuần, đội ngũ rang và barista nếm đối chứng từng mẻ sản xuất ở ba mức nhiệt độ khi cà phê nguội dần. Lô nào lệch nốt hương hoặc gắt hậu sẽ dừng lại ở phòng thử thay vì đi tới tay khách.',
      en: 'Every Wednesday and Saturday morning, roasters and baristas blind-cup production batches across three cooling stages. Any roast showing astringency or flat sweetness stops at the lab table.'
    },
    specs: [
      { label: { vi: 'Nước tiêu chuẩn', en: 'Brew water' }, value: { vi: 'TDS 85 ppm · pH 7.0', en: '85 ppm TDS · pH 7.0' } },
      { label: { vi: 'Tỉ lệ cupping', en: 'Cupping ratio' }, value: { vi: '8,25 g / 150 ml · 93°C', en: '8.25 g / 150 ml · 93°C' } },
      { label: { vi: 'Mở cửa cho khách', en: 'Public session' }, value: { vi: '09:30 sáng thứ Bảy', en: 'Saturdays at 09:30' } }
    ]
  }
];

export const QUIZ_STEPS = [
  {
    id: 'ritual',
    question: {
      vi: '01. Dụng cụ hoặc thói quen pha buổi sáng của bạn?',
      en: '01. How do you usually make or drink your morning cup?'
    },
    options: [
      { value: 'phin', label: { vi: 'Phin truyền thống chậm rãi', en: 'Slow traditional phin drip' } },
      { value: 'espresso', label: { vi: 'Máy Espresso hoặc ấm Moka', en: 'Espresso machine or Moka pot' } },
      { value: 'filter', label: { vi: 'Pour-over giấy lọc / Phin giấy', en: 'Paper pour-over or drip bag' } },
      { value: 'chill', label: { vi: 'Mở nắp uống lạnh ngay', en: 'Chilled & ready straight away' } }
    ]
  },
  {
    id: 'palate',
    question: {
      vi: '02. Sắc thái hương vị bạn muốn cảm nhận rõ nhất?',
      en: '02. Which flavour character draws you in first?'
    },
    options: [
      { value: 'bold', label: { vi: 'Đậm ca cao, mật mía, ít chua', en: 'Dark cacao, molasses, low acid' } },
      { value: 'nutty', label: { vi: 'Cân bằng hạt phỉ, caramel bơ', en: 'Balanced hazelnut & brown caramel' } },
      { value: 'bright', label: { vi: 'Thanh sáng hoa trắng, cam vàng', en: 'Bright citrus, blossom & tea' } }
    ]
  },
  {
    id: 'style',
    question: {
      vi: '03. Bạn thường thưởng thức cà phê theo cách nào?',
      en: '03. How do you take your cup?'
    },
    options: [
      { value: 'black', label: { vi: 'Đen nguyên bản (nóng hoặc đá)', en: 'Neat — hot black or over ice' } },
      { value: 'milk', label: { vi: 'Cùng sữa đặc, sữa tươi hoặc kem muối', en: 'With condensed milk, fresh milk, or salt cream' } }
    ]
  }
];

export const QUIZ_PROFILES = {
  heritage: {
    title: { vi: 'Gu Đậm Mộc Di Sản', en: 'The Heritage Bold Palate' },
    summary: {
      vi: 'Bạn yêu thể chất dày sánh, vị ca cao nướng rõ nét và hậu ngọt kéo dài nơi cổ họng — đúng tinh thần ly cà phê sáng Việt Nam nhưng rang mộc sạch, không khét.',
      en: 'You gravitate toward syrupy texture, toasted cacao depth, and a long sweet finish — classic Vietnamese morning character roasted clean without harsh smoke.'
    },
    productId: 'bao-loc-robusta',
    altProductId: 'phin-truyen-thong',
    barDrink: { vi: 'Cà Phê Muối Xứ Huế tại quầy', en: 'Hue-Style Salted Coffee at the bar' },
    ratio: { vi: '25 g bột : 95 ml nước 95°C · Phin 170 ml', en: '25 g : 95 ml at 95°C · 170 ml phin' }
  },
  velvet: {
    title: { vi: 'Gu Cân Bằng Hạt Dẻ & Caramel', en: 'The Velvet Espresso Palate' },
    summary: {
      vi: 'Bạn tìm kiếm sự hài hòa giữa hương thơm tự nhiên của Arabica vùng cao và độ đằm của Fine Robusta — tròn vị khi uống đen và đặc biệt quyện ngọt khi gặp sữa.',
      en: 'You look for poise between highland Arabica aromatics and Fine Robusta structure — velvety neat and naturally sweet alongside milk.'
    },
    productId: 'an-signature-blend',
    altProductId: 'espresso-xay-san',
    barDrink: { vi: 'Bạc Xỉu 3 Tầng sữa Đà Lạt', en: 'Three-Layer Da Lat Milk Bac Xiu' },
    ratio: { vi: '18 g vào → 36 g chiết trong 28 giây · 93°C', en: '18 g in → 36 g out in 28s · 93°C' }
  },
  highland: {
    title: { vi: 'Gu Thanh Sáng Hoa Quả Vùng Cao', en: 'The Highland Floral Palate' },
    summary: {
      vi: 'Bạn thích tách cà phê trong trẻo, nhiều tầng hương cam vàng, hoa trắng và hậu vị nhẹ như trà cổ thụ — uống chậm để cảm nhận nhiệt độ thay đổi.',
      en: 'You prize clarity and layered aromatics — white blossom, sweet citrus, and a tea-like finish that opens up as the cup cools.'
    },
    productId: 'son-la-washed',
    altProductId: 'drip-cau-dat-box',
    barDrink: { vi: 'Pour-over V60 tại quầy bar mở', en: 'Hand-poured V60 at the open bar' },
    ratio: { vi: '15 g hạt : 240 ml nước 92°C · Xay vừa', en: '15 g : 240 ml at 92°C · Medium grind' }
  },
  chill: {
    title: { vi: 'Gu Ủ Lạnh Tươi Mát Nhịp Phố', en: 'The Crisp Cold-Steep Palate' },
    summary: {
      vi: 'Bạn ưu tiên sự tiện gọn nhưng không thỏa hiệp về nguyên liệu thật: cà phê ngâm lạnh dài giờ êm mượt, ít đắng gắt, sẵn sàng mở nắp cho ngày bận rộn.',
      en: 'You want immediacy without compromising honest ingredients: slow cold extraction with low bitterness, ready whenever your day starts.'
    },
    productId: 'cold-brew-cam-vang',
    altProductId: 'ca-phe-muoi-chai',
    barDrink: { vi: 'Cold Brew Cam Vàng tươi', en: 'Fresh Orange Cold Brew' },
    ratio: { vi: 'Rót qua đá viên lớn, thêm 1 lát vỏ cam vàng', en: 'Pour over large ice with expressed orange peel' }
  }
};

export function resolveQuizProfile(answers) {
  if (answers.ritual === 'chill') {
    return answers.style === 'milk' && answers.palate === 'bold'
      ? QUIZ_PROFILES.heritage
      : QUIZ_PROFILES.chill;
  }
  if (answers.palate === 'bright' || answers.ritual === 'filter') {
    return answers.palate === 'bold' ? QUIZ_PROFILES.velvet : QUIZ_PROFILES.highland;
  }
  if (answers.ritual === 'phin' || answers.palate === 'bold') {
    return QUIZ_PROFILES.heritage;
  }
  return QUIZ_PROFILES.velvet;
}

export const B2B_LINES = [
  {
    id: 'beans-horeca',
    tab: { vi: 'Nguyên hạt HoReCa', en: 'HoReCa Whole Beans' },
    title: { vi: 'Phối trộn riêng theo cấu hình máy và nguồn sữa của quán bạn', en: 'Custom-calibrated blends matched to your espresso machine and milk' },
    desc: {
      vi: 'Cung ứng túi 1 kg và thùng 5 kg có van một chiều, rang mới đầu tuần theo sản lượng tiêu thụ thực tế để hạt tại quầy luôn nằm trong khung 5 – 18 ngày sau rang.',
      en: 'Supplied in 1 kg valve bags and 5 kg reusable tubs, roasted weekly against your actual bar volume so beans always pull within their 5-to-18-day peak window.'
    },
    specs: [
      { k: { vi: 'Quy cách', en: 'Packaging' }, v: { vi: 'Túi 1 kg · Thùng 5 kg hoàn trả', en: '1 kg bag · 5 kg returnable tub' } },
      { k: { vi: 'Sản lượng tối thiểu', en: 'Minimum order' }, v: { vi: 'Từ 10 kg / tháng', en: 'From 10 kg / month' } },
      { k: { vi: 'Hồ sơ rang', en: 'Roast profiles' }, v: { vi: '3 lô cố định hoặc thửa riêng', en: '3 house lots or bespoke curve' } }
    ]
  },
  {
    id: 'phin-batch',
    tab: { vi: 'Rang xay Phin & Batch', en: 'Phin & Batch Ground' },
    title: { vi: 'Độ mịn đồng nhất cho phin lớn nhà hàng và bình ủ khách sạn', en: 'Uniform particle calibration for large phin and hotel batch brewers' },
    desc: {
      vi: 'Xay trên hệ đĩa phẳng công nghiệp Mahlkönig giúp giảm bột mịn gây nghẹt phin, giữ tốc độ chiết xuất ổn định giữa các ca nhân viên sáng – chiều.',
      en: 'Ground on industrial flat burrs to minimise fines and channelling, keeping extraction times consistent across morning and afternoon shifts.'
    },
    specs: [
      { k: { vi: 'Ứng dụng', en: 'Best for' }, v: { vi: 'Phin lớn 100 – 250 g · Buffet sáng', en: 'Large 100–250 g phin · Breakfast service' } },
      { k: { vi: 'Định mức pha', en: 'Yield' }, v: { vi: '38 – 42 ly tiêu chuẩn / kg', en: '38 – 42 standard servings / kg' } },
      { k: { vi: 'Giao hàng', en: 'Dispatch' }, v: { vi: 'Trong 24 giờ sau khi xay', en: 'Within 24 hours of grinding' } }
    ]
  },
  {
    id: 'office-drip',
    tab: { vi: 'Phin giấy & Văn phòng', en: 'Office Drip & Pods' },
    title: { vi: 'Góc cà phê tử tế cho đội ngũ 15 đến 300 nhân sự', en: 'Honest specialty coffee for teams of 15 to 300 people' },
    desc: {
      vi: 'Thuê bao định kỳ hằng tháng gồm hộp phin giấy đóng khí nitơ, hạt cho máy tự động văn phòng và khay thu gom bã cà phê tái chế cuối tuần.',
      en: 'Monthly subscriptions combining nitrogen-flushed drip bags, whole beans for bean-to-cup office machines, and weekly spent-ground collection.'
    },
    specs: [
      { k: { vi: 'Gói linh hoạt', en: 'Plans' }, v: { vi: '200 – 2.500 tách / tháng', en: '200 – 2,500 cups / month' } },
      { k: { vi: 'Chứng từ', en: 'Billing' }, v: { vi: 'Hóa đơn VAT điện tử định kỳ', en: 'Automated monthly VAT invoicing' } },
      { k: { vi: 'Dùng thử', en: 'Tasting kit' }, v: { vi: 'Miễn phí bộ mẫu 4 vị tận văn phòng', en: 'Complimentary 4-lot office tasting box' } }
    ]
  },
  {
    id: 'cold-keg',
    tab: { vi: 'Cold Brew Keg & Cốt pha', en: 'Cold Brew Kegs & Concentrate' },
    title: { vi: 'Rút ngắn thao tác giờ cao điểm mà vẫn giữ chất thủ công', en: 'Cut peak-hour ticket times without losing craft character' },
    desc: {
      vi: 'Cốt Cold Brew ủ lạnh 24 giờ đóng can lạnh 2 lít hoặc keg inox 5 lít cho vòi nitro — chỉ cần rót ra ly hoặc phối cùng cam tươi, kem mặn, tonic.',
      en: '24-hour cold-steeped concentrate delivered in chilled 2 L jugs or 5 L stainless nitro kegs — ready to pour neat or build signature citrus tonics.'
    },
    specs: [
      { k: { vi: 'Bảo quản', en: 'Shelf life' }, v: { vi: '14 ngày ở 2 – 5°C (chưa mở nắp)', en: '14 days at 2 – 5°C unopened' } },
      { k: { vi: 'Tỉ lệ pha loãng', en: 'Dilution' }, v: { vi: 'Uống trực tiếp hoặc pha 1 : 1', en: 'Ready-to-pour or 1 : 1 concentrate' } },
      { k: { vi: 'Khu vực', en: 'Cold chain' }, v: { vi: 'Nội thành TP.HCM & Hà Nội', en: 'Ho Chi Minh City & Hanoi cold van' } }
    ]
  }
];

export const B2B_MACHINES = [
  {
    num: '01',
    group: 'espresso',
    groupLabel: { vi: 'Máy cơ 2 họng', en: '2-Group Espresso' },
    model: 'Linea Classic S 2GR & Mahlkönig E65S',
    venue: { vi: 'Quán cà phê chuyên nghiệp · 120 – 350 ly/ngày', en: 'Specialty cafés · 120 – 350 cups/day' },
    summary: {
      vi: 'Nồi hơi kép inox ổn định nhiệt PID ±0.3°C, đi kèm cối xay định lượng theo giây và bộ lọc nước làm mềm chống bám cặn.',
      en: 'Dual stainless boilers with ±0.3°C PID stability, paired with grind-by-time flat burrs and commercial water softening filtration.'
    },
    specs: ['Dual Boiler 3.5 L + 7 L', '220V / 3600W', 'Bảo trì định kỳ mỗi 60 ngày / 60-day service']
  },
  {
    num: '02',
    group: 'auto',
    groupLabel: { vi: 'Tự động văn phòng', en: 'Bean-to-Cup Office' },
    model: 'Dr.Coffee F11 Big Plus Bean-to-Cup',
    venue: { vi: 'Văn phòng & Lounge khách sạn · 50 – 120 ly/ngày', en: 'Offices & hotel lounges · 50 – 120 cups/day' },
    summary: {
      vi: 'Xay hạt tươi cho từng tách chỉ với một chạm: Americano, Espresso, Cappuccino sữa tươi tự vệ sinh đường ống cuối ngày.',
      en: 'Grinds whole beans per cup at one touch — Espresso, Americano, and fresh-milk Cappuccino with automated end-of-day milk-line rinsing.'
    },
    specs: ['Cối gốm phẳng · Hộc hạt 1.2 kg', '220V / 2750W', 'Cho thuê kèm gói hạt từ 15 kg/tháng']
  },
  {
    num: '03',
    group: 'filter',
    groupLabel: { vi: 'Hệ thống ủ & xay lọc', en: 'Batch Brew & Grinder' },
    model: 'Marco Jet 6L Twin & EK43S Lab Grinder',
    venue: { vi: 'Nhà hàng brunch, hội nghị & Roastery bar', en: 'Brunch dining, conferences & brew bars' },
    summary: {
      vi: 'Pha một mẻ 6 lít cà phê lọc chuẩn SCA trong 8 phút giữ nóng chân không không cháy vị, kết hợp cối EK43S xay túi mang về cho khách.',
      en: 'Brews 6 litres of SCA-gold filter coffee in 8 minutes into vacuum urns without scorching, paired with an EK43S for retail bag grinding.'
    },
    specs: ['Bình giữ nhiệt chân không 6 L', 'Đĩa xay 98 mm thép đúc', 'Lắp đặt & căn chỉnh công thức tận nơi']
  }
];

export const MICRO_LOTS = [
  {
    id: 'lot-truong-tho',
    code: 'LOT 26-01',
    img: '/img/harvest-hands.jpg',
    name: { vi: 'Vườn Cô Bảy — Thôn Trường Thọ', en: 'Mrs. Bay’s Garden — Truong Tho Hamlet' },
    region: { vi: 'Cầu Đất, Lâm Đồng · 1.680 m', en: 'Cau Dat, Lam Dong · 1,680 m' },
    story: {
      vi: '420 gốc Bourbon cổ xen dưới tán hồng ăn trái không phun thuốc cỏ suốt 9 năm. Mỗi vụ chỉ thu được 180 kg nhân xanh phơi chậm trên giàn tre trong nhà lồng.',
      en: '420 heritage Bourbon trees intercropped beneath persimmon shade with zero herbicide for nine years. Yields just 180 kg of green coffee dried on raised bamboo beds.'
    },
    notes: [
      { vi: 'Hương hoa cam và quả hồng chín giòn', en: 'Orange blossom and crisp ripe persimmon' },
      { vi: 'Thể chất mượt như si-rô đường phèn', en: 'Silky rock-sugar syrup mouthfeel' },
      { vi: 'Độ chua thanh của táo đỏ vùng lạnh', en: 'Clean malic acidity of highland red apple' },
      { vi: 'Hậu vị trà ô long nướng kéo dài', en: 'Long roasted oolong tea finish' }
    ]
  },
  {
    id: 'lot-chieng-ban',
    code: 'LOT 26-02',
    img: '/img/bean-sonla.jpg',
    name: { vi: 'Tổ Hợp Tác Nữ Thái Đen — Chiềng Ban', en: 'Black Thai Women’s Collective — Chieng Ban' },
    region: { vi: 'Mai Sơn, Sơn La · 1.280 m', en: 'Mai Son, Son La · 1,280 m' },
    story: {
      vi: 'Nhóm 14 hộ phụ nữ dân tộc Thái thu hái chín sẫm và ủ yếm khí 48 giờ trong chum sành trước khi rửa sạch bằng nước suối núi đá vôi.',
      en: 'Fourteen Black Thai smallholder households picking deep-purple cherries for 48-hour sealed ceramic-jar fermentation before washing in limestone spring water.'
    },
    notes: [
      { vi: 'Nốt mận hậu và đào trắng rõ nét', en: 'Bright northern plum and white peach' },
      { vi: 'Cấu trúc vị trong trẻo, cân đối', en: 'Crystalline, poised mid-palate' },
      { vi: 'Chua dịu kiểu chanh vàng ngâm mật', en: 'Gentle preserved-lemon brightness' },
      { vi: 'Dư vị sô-cô-la trắng và hoa nhài', en: 'White chocolate and jasmine aftertaste' }
    ]
  },
  {
    id: 'lot-khe-sanh',
    code: 'LOT 26-03',
    img: '/scroll/2-san-phoi.jpg',
    name: { vi: 'Liberica (Cà Phê Mít) — Hướng Phùng', en: 'Heirloom Liberica — Huong Phung' },
    region: { vi: 'Khe Sanh, Quảng Trị · 680 m', en: 'Khe Sanh, Quang Tri · 680 m' },
    story: {
      vi: 'Giống cà phê mít thân gỗ lớn chịu gió Lào khô nóng, từng bị chặt bỏ vì năng suất thấp. An Roastery bao tiêu giá gấp đôi để giữ lại hàng cây chắn gió cho nương.',
      en: 'Tall wind-resistant Liberica trees once felled for low yield. Purchased at double commodity rates to preserve living windbreaks across smallholder slopes.'
    },
    notes: [
      { vi: 'Hương mít chín và dứa nướng độc bản', en: 'Distinctive ripe jackfruit and roasted pineapple' },
      { vi: 'Thể chất dày ấm, ít caffeine', en: 'Warm, rounded body with naturally lower caffeine' },
      { vi: 'Chua thanh nhiệt đới rất khẽ', en: 'Delicate tropical fruit lift' },
      { vi: 'Hậu vị gỗ tuyết tùng và mật mía', en: 'Cedarwood and cane-molasses finish' }
    ]
  }
];

export const CIRCULAR_FLOWS = [
  {
    code: 'VÒNG 01',
    title: { vi: 'Bã cà phê → Giá thể nấm & vườn rau đô thị', en: 'Spent grounds → Urban mushroom substrate & compost' },
    metric: { vi: '1,4 tấn / tháng', en: '1.4 tonnes / month' },
    body: {
      vi: 'Toàn bộ bã espresso và cold brew ở ba chi nhánh được để ráo mỗi tối, chuyển cho trại nấm bào ngư tại Củ Chi và hai vườn rau sân thượng cộng đồng ở Quận 3.',
      en: 'Spent espresso pucks and cold-brew grounds from all three cafés are drained nightly and collected by an oyster-mushroom farm in Cu Chi and rooftop gardens in District 3.'
    }
  },
  {
    code: 'VÒNG 02',
    title: { vi: 'Thu hồi vỏ chai thủy tinh Cold Brew tại quầy', en: 'Glass Cold-Brew bottle return & sanitisation loop' },
    metric: { vi: '68% vỏ quay vòng', en: '68% bottle return rate' },
    body: {
      vi: 'Mỗi vỏ chai thủy tinh 250 ml / 330 ml mang trả lại quầy được trừ trực tiếp 5.000₫ vào đơn tiếp theo, sau đó hấp tiệt trùng ở 121°C để tái sử dụng tối đa 25 vòng.',
      en: 'Every returned 250 ml or 330 ml bottle earns an instant ₫5,000 credit and undergoes 121°C steam sterilisation for up to 25 refill cycles.'
    }
  },
  {
    code: 'VÒNG 03',
    title: { vi: 'Vỏ lụa từ lồng rang → Đệm ủ gốc cho cây con', en: 'Roaster chaff → Nursery mulch for highland seedlings' },
    metric: { vi: '100% không đốt bỏ', en: '100% zero incineration' },
    body: {
      vi: 'Lớp vỏ lụa tách ra từ cyclone máy rang Giesen nhẹ và giàu nitơ, được đóng bao gửi ngược lên vườn ươm Cầu Đất làm lớp phủ giữ ẩm cho bầu cây giống.',
      en: 'Nitrogen-rich silverskin collected in our Giesen cyclone is bagged and sent back up to Cau Dat nurseries on return delivery trucks as moisture-retaining mulch.'
    }
  }
];

export const JOURNAL_ARTICLES = [
  {
    slug: 'thu-nghiem-177-co-xay-cho-phin-va-espresso',
    cat: 'craft',
    date: '2026-10-28',
    readTime: { vi: '6 phút đọc', en: '6 min read' },
    location: { vi: 'Xưởng rang Tân Bình', en: 'Tan Binh Roastery Lab' },
    img: '/img/cupping-lab.jpg',
    featured: true,
    title: {
      vi: 'Khi 50 micromet cỡ bột quyết định vị ngọt hay chát của một ly phin sáng',
      en: 'How 50 micrometres of grind size separate sweet cacao from dry astringency in a morning phin'
    },
    excerpt: {
      vi: 'Suốt bốn tháng, phòng lab của xưởng đo phân bố hạt bột trên rây Kruve để tìm ra điểm rơi ngọt nhất cho chiếc phin inox 170 ml quen thuộc.',
      en: 'Over four months our lab sieved dozens of burr settings through Kruve screens to map where a 170 ml stainless phin stops tasting harsh and turns syrupy sweet.'
    },
    paragraphs: {
      vi: [
        'Nhiều người nghĩ phin là dụng cụ dễ dãi nhất: cứ cho bột vào, châm nước sôi và đợi. Nhưng chính vì dòng chảy của phin chỉ dựa vào trọng lực (khoảng 0,01 bar so với 9 bar của máy espresso), bất kỳ lượng bột siêu mịn (fines dưới 200 µm) nào dư thừa cũng sẽ lắng xuống đáy lỗ lọc, làm ly cà phê nghẹt dòng và kéo ra vị chát khô ở cuối lưỡi.',
        'Trong đợt hiệu chỉnh mùa thu năm nay, đội ngũ rang và barista đã rây thử 42 mẫu xay từ Fine Robusta Bảo Lộc. Kết quả thú vị nhất nằm ở dải 650 – 750 µm: khi tỉ lệ hạt mịn dưới 200 µm được giữ dưới 9%, thời gian nhỏ giọt tự nhiên về đúng mốc 5 phút 15 giây mà không cần vặn chặt nắp gài.',
        'Đó cũng là lý do mọi túi Rang Xay Phin Mộc xuất xưởng đều được xay trên đĩa phẳng lớn ở tốc độ vòng quay thấp để hạn chế sinh nhiệt — giúp bạn pha ở nhà vẫn ra đúng độ sánh ngọt như ngồi trước quầy bar của quán.'
      ],
      en: [
        'The Vietnamese phin looks deceptively forgiving: spoon in grounds, add boiling water, and wait. Yet because gravity alone drives extraction — roughly 0.01 bar against an espresso machine’s 9 bar — excess micro-fines below 200 µm settle across the perforated plate, stalling flow and pulling dry, woody tannins into the glass.',
        'Across 42 test grinds of Bao Loc Fine Robusta this autumn, our cleanest cups clustered around a 650–750 µm modal peak. Keeping sub-200 µm fines under 9% brought total drip time naturally to 5 minutes 15 seconds with gravity tamping alone.',
        'Every bag of Classic Phin Ground leaving our roastery is milled on low-RPM flat burrs to keep heat and fines down — so a quiet kitchen brew tastes as composed as a cup pulled at our bar.'
      ]
    }
  },
  {
    slug: 'mua-hai-chin-muon-tren-doi-truong-tho',
    cat: 'harvest',
    date: '2026-10-11',
    readTime: { vi: '5 phút đọc', en: '5 min read' },
    location: { vi: 'Cầu Đất, Lâm Đồng', en: 'Cau Dat, Lam Dong' },
    img: '/img/harvest-hands.jpg',
    featured: false,
    title: {
      vi: 'Sương muối đến sớm và quyết định lùi lịch hái hai tuần trên đồi Trường Thọ',
      en: 'Early highland frost and why our partner growers waited two extra weeks to pick'
    },
    excerpt: {
      vi: 'Thay vì thu hoạch đồng loạt vào đầu tháng Mười, 12 hộ liên kết chờ độ đường Brix trong thịt quả chạm ngưỡng 22% mới xuống giỏ đợt đầu.',
      en: 'Rather than stripping branches in early October, twelve partner households waited until cherry mucilage hit 22° Brix before the first pass.'
    },
    paragraphs: {
      vi: [
        'Đầu tháng Mười, sương về dày hơn mọi năm trên sườn đồi Trường Thọ. Khi đo khúc xạ kế ngoài vườn, quả tuy đã chuyển cam đỏ nhưng độ Brix mới dừng ở mức 17,5%. Nếu hái ngay để kịp tiến độ phơi nắng đầu mùa, mẻ honey năm nay sẽ thiếu hẳn hậu ngọt mật nhãn quen thuộc.',
        'Bản hợp đồng bao tiêu ký từ tháng Sáu phát huy tác dụng đúng vào lúc này: vì mức thưởng chất lượng đã chốt cố định trên từng ký quả chín sẫm, các hộ nông yên tâm giữ quả trên cành thêm mười bốn ngày nữa và chia làm bốn đợt hái tỉa.'
      ],
      en: [
        'Mist rolled into Truong Tho heavier than usual this October. Field refractometer readings showed cherries blushing red-orange on the skin while internal mucilage sat at just 17.5° Brix — too lean for the wild-honey sweetness Cau Dat is loved for.',
        'Pre-harvest forward contracts signed in June proved their worth: with quality premiums locked per kilo of deep-crimson fruit, families left cherries on the branch two weeks longer and picked across four selective passes.'
      ]
    }
  },
  {
    slug: 'chiec-phin-giay-cho-nhung-chuyen-tau-dem',
    cat: 'craft',
    date: '2026-09-19',
    readTime: { vi: '4 phút đọc', en: '4 min read' },
    location: { vi: 'Tuyến Sài Gòn – Nha Trang', en: 'Saigon – Nha Trang Rail' },
    img: '/img/drip-bag.jpg',
    featured: false,
    title: {
      vi: 'Đóng gói một quầy pour-over vừa vặn trong phong bì 12 gram',
      en: 'Fitting a pour-over bar inside a nitrogen-flushed 12-gram envelope'
    },
    excerpt: {
      vi: 'Làm sao để túi phin giấy không bị mùi giấy cũ sau 3 tuần mở hộp? Câu trả lời nằm ở độ dư oxy dưới 1% lúc hàn miệng túi.',
      en: 'How do you keep single-serve drip bags from tasting papery three weeks later? Residual oxygen under 1% at the sealing jaw.'
    },
    paragraphs: {
      vi: [
        'Cà phê sau khi xay tăng diện tích tiếp xúc với không khí lên gấp hàng nghìn lần; chỉ sau mười lăm phút ngoài trời, phần lớn hợp chất hương hoa bay hơi đã thất thoát. Vì vậy nhiều người từng thử phin giấy đều có chung cảm giác tiện nhưng phẳng vị.',
        'Khi lắp dây chuyền đóng gói lô nhỏ tại xưởng, chúng tôi đặt máy xay nối thẳng vào phễu thổi khí nitơ thực phẩm. Từ lúc hạt vỡ ra đến lúc màng nhôm hàn kín chưa đầy bốn mươi giây, giữ lượng oxy dư dưới 0,8%.'
      ],
      en: [
        'Grinding multiplies coffee’s exposed surface area a thousandfold; within fifteen minutes in open air, delicate floral volatiles dissipate. That is why convenient single-serve filters so often taste flat.',
        'When we built our micro-lot packing line, we coupled the grinder chute directly to a food-grade nitrogen flush. Less than forty seconds elapse from burr to heat-seal, holding residual oxygen below 0.8%.'
      ]
    }
  },
  {
    slug: 'lop-cupping-sang-thu-bay-mo-cua-mien-phi',
    cat: 'community',
    date: '2026-08-30',
    readTime: { vi: '3 phút đọc', en: '3 min read' },
    location: { vi: '06 Trần Cao Vân, Quận 3', en: '06 Tran Cao Van, District 3' },
    img: '/img/culture-hero.jpg',
    featured: false,
    title: {
      vi: 'Ba mươi buổi sáng thứ Bảy cùng khách quen tập gọi tên mùi hương trong tách',
      en: 'Thirty Saturday mornings teaching regulars to name what they taste'
    },
    excerpt: {
      vi: 'Không cần thuật ngữ cầu kỳ: bàn thử nếm cuối tuần ở Quận 3 bắt đầu bằng mùi vỏ quýt nướng, kẹo đậu phộng và trà đá quen thuộc.',
      en: 'No sommelier jargon required: our open weekend table translates sensory notes into familiar Vietnamese kitchen memories.'
    },
    paragraphs: {
      vi: [
        'Bảng vòng tròn hương vị quốc tế thường nhắc tới quả mâm xôi đen hay si-rô phong — những thứ xa lạ với bữa ăn hằng ngày ở Việt Nam. Ở bàn cupping sáng thứ Bảy của An Roastery, chúng tôi thay bằng mật nhãn Hưng Yên, khế chua, vỏ quýt phơi khô và kẹo mạch nha.',
        'Khi rào cản ngôn ngữ biến mất, ai cũng nhận ra mình hoàn toàn phân biệt được một lô Sơn La lên men ướt với một lô Cầu Đất phơi mật ong chỉ sau hai lượt húp thử.'
      ],
      en: [
        'International flavour wheels lean heavily on blackberry and maple syrup — references distant from a Vietnamese pantry. Around our Saturday table, baristas anchor sensory calibration in longan honey, starfruit, dried tangerine peel, and malt candy.',
        'Once pretentious vocabulary steps aside, first-time guests reliably tell a washed Son La apart from a honey-processed Cau Dat within two rounds of spoons.'
      ]
    }
  },
  {
    slug: 'tu-ba-espresso-den-1400kg-gia-the-nam-moi-thang',
    cat: 'press',
    date: '2026-08-04',
    readTime: { vi: '4 phút đọc', en: '4 min read' },
    location: { vi: 'TP.HCM & Củ Chi', en: 'HCMC & Cu Chi' },
    img: '/img/circular-compost.jpg',
    featured: false,
    title: {
      vi: 'Báo cáo giữa năm: 100% bã cà phê tại ba chi nhánh không còn đi ra bãi rác',
      en: 'Mid-year dispatch: zero spent coffee grounds sent to landfill across all three cafés'
    },
    excerpt: {
      vi: 'Hành trình biến thùng rác nặng nhất cuối mỗi ca trực thành nguồn nguyên liệu sạch cho hai hợp tác xã nông nghiệp ven đô.',
      en: 'Turning the heaviest bin at the end of every barista shift into pasteurised substrate for peri-urban growers.'
    },
    paragraphs: {
      vi: [
        'Một quán cà phê trung bình thải ra gần 18 kg bã ướt mỗi ngày. Khi chôn lấp yếm khí chung với rác sinh hoạt, lượng bã này phân hủy sinh khí mê-tan; nhưng nếu được thu gom riêng trong vòng 24 giờ, nó vốn đã được "thanh trùng nhẹ" bởi nước nóng 93°C trong lúc pha.',
        'Từ tháng Tư năm 2026, ba chi nhánh của An Roastery trang bị thùng thoát nước hai đáy dưới gầm quầy đập bã, giúp giảm 35% trọng lượng vận chuyển trước khi xe thu gom đưa về trại nấm Củ Chi.'
      ],
      en: [
        'A busy neighbourhood café discards roughly 18 kg of wet coffee pucks daily. Buried in mixed landfill, those grounds generate methane; collected cleanly within 24 hours, they are already lightly pasteurised by 93°C brew water.',
        'Since April 2026, double-bottom draining bins beneath every knock-box cut transport weight by 35% before evening vans deliver the grounds to oyster-mushroom growers in Cu Chi.'
      ]
    }
  },
  {
    slug: 'ra-mat-chuong-trinh-doi-tac-hat-rang-theo-tuan',
    cat: 'press',
    date: '2026-07-15',
    readTime: { vi: '3 phút đọc', en: '3 min read' },
    location: { vi: 'TP.HCM & Hà Nội', en: 'HCMC & Hanoi' },
    img: '/img/b2b-espresso.jpg',
    featured: false,
    title: {
      vi: 'Mở rộng xưởng rang mẻ sỉ: giao hạt trong thùng hoàn trả 5 kg không rác túi nhựa',
      en: 'Wholesale roastery update: zero-waste 5 kg returnable tubs for partner cafés'
    },
    excerpt: {
      vi: 'Thay thế hàng trăm túi ghép màng nhôm dùng một lần mỗi tháng bằng thùng kín khí inox có van xả CO₂ cho các quán đối tác nội thành.',
      en: 'Replacing hundreds of single-use foil-lined bags each month with valved stainless-steel tubs on local courier loops.'
    },
    paragraphs: {
      vi: [
        'Túi cà phê ghép ba lớp (nhựa – nhôm – giấy) giữ hương rất tốt cho khách lẻ, nhưng với một quán đối tác tiêu thụ 40 kg hạt mỗi tháng, chúng tạo ra gần một ngàn vỏ túi khó phân loại mỗi năm.',
        'Chương trình thùng hoàn trả 5 kg mới hoạt động giống như giao sữa tươi ngày xưa: mỗi sáng thứ Hai, nhân viên giao thùng hạt vừa nghỉ đủ 4 ngày sau rang và thu về thùng rỗng tuần trước để rửa khô tại xưởng.'
      ],
      en: [
        'Tri-laminate valve pouches protect home bags well, yet a partner café pulling 40 kg a month discards nearly a thousand non-recyclable pouches a year.',
        'Our 5 kg tub loop works like classic milk delivery: every Monday morning our van drops rested beans and collects last week’s empty valved containers for dry sanitising at the roastery.'
      ]
    }
  }
];
