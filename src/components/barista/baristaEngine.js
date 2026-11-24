import { PRODUCTS } from '../../data/products';

/**
 * Normalize Vietnamese & Latin text for resilient offline intent matching.
 */
export function normalizeText(input = '') {
  return String(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s.:/+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getSuggestedPrompts(lang = 'vi') {
  if (lang === 'en') {
    return [
      'Bold beans for Vietnamese Phin',
      'V60 recipe for 2 cups',
      'Low-acidity, sweet beans',
      'B2B wholesale quote'
    ];
  }
  return [
    'Gợi ý hạt pha Phin đậm vị',
    'Công thức V60 2 ly',
    'Cà phê ít chua, thơm ngọt',
    'Báo giá sỉ B2B'
  ];
}

const BREW_PROFILES = {
  phin: {
    id: 'phin',
    ratio: 3.8,
    baseDoseG: 25,
    ratioLabel: '1 : 3.8',
    name: { vi: 'Phin truyền thống', en: 'Traditional Vietnamese Phin' },
    temp: '95 – 96°C',
    grind: { vi: 'Cỡ đường cát thô (Medium-Coarse)', en: 'Coarse-sugar grind (Medium-Coarse)' },
    time: { vi: '5 – 6 phút', en: '5 – 6 min' },
    recommendedIds: ['phin-truyen-thong', 'bao-loc-robusta'],
    steps: (dose, water, lang) => {
      const bloom = Math.round(dose * 0.8);
      const rest = Math.max(10, water - bloom);
      if (lang === 'en') {
        return [
          'Pre-warm the stainless phin with hot water and discard.',
          `Add ${dose} g coffee grounds, level gently, and bloom with ${bloom} ml water at 96°C for 30s.`,
          `Seat the gravity press and slowly pour the remaining ${rest} ml water. Drip for 5–6 minutes.`
        ];
      }
      return [
        'Tráng nóng phin inox bằng nước sôi để giữ ổn định nhiệt chiết.',
        `Cho ${dose} g bột vào lắc phẳng, ủ nở với ${bloom} ml nước 96°C trong 30 giây.`,
        `Đặt tấm chặn tự trọng và rót nhẹ ${rest} ml nước còn lại. Đợi nhỏ giọt 5–6 phút.`
      ];
    }
  },
  v60: {
    id: 'v60',
    ratio: 16,
    baseDoseG: 15,
    ratioLabel: '1 : 16',
    name: { vi: 'Pour-over V60 / Kalita', en: 'V60 / Kalita Pour-Over' },
    temp: '91 – 93°C',
    grind: { vi: 'Cỡ muối biển (Medium-Fine)', en: 'Sea-salt grind (Medium-Fine)' },
    time: { vi: '2 phút 45 giây', en: '2m 45s' },
    recommendedIds: ['cau-dat-honey', 'son-la-washed'],
    steps: (dose, water, lang) => {
      const bloom = Math.round(dose * 3);
      const pour2 = Math.round((water - bloom) * 0.55);
      const pour3 = Math.max(20, water - bloom - pour2);
      if (lang === 'en') {
        return [
          'Rinse the paper filter with hot water to remove paper taste and warm the server.',
          `Dose ${dose} g coffee. Bloom with ${bloom} ml water at 92°C for 40 seconds.`,
          `Pour ${pour2} ml in slow concentric circles, then finish with ${pour3} ml to reach ${water} ml by 2m45s.`
        ];
      }
      return [
        'Tráng giấy lọc bằng nước nóng để khử mùi giấy và làm ấm bình thủy tinh.',
        `Cân ${dose} g cà phê. Rót nở ${bloom} ml nước 92°C trong 40 giây.`,
        `Rót xoáy đồng tâm nhịp hai ${pour2} ml, sau đó rót nốt ${pour3} ml để đạt ${water} ml ở 2 phút 45 giây.`
      ];
    }
  },
  espresso: {
    id: 'espresso',
    ratio: 2,
    baseDoseG: 18,
    ratioLabel: '1 : 2',
    name: { vi: 'Espresso chuẩn quầy bar', en: 'House Bar Espresso' },
    temp: '93°C · 9 bar',
    grind: { vi: 'Xay mịn chuẩn máy (Fine Espresso)', en: 'Fine espresso grind' },
    time: { vi: '27 – 30 giây', en: '27 – 30 sec' },
    recommendedIds: ['an-signature-blend', 'espresso-xay-san'],
    steps: (dose, water, lang) => {
      if (lang === 'en') {
        return [
          `Purge the group head, dry the basket, and dose ${dose} g finely ground beans.`,
          'Distribute evenly and tamp level with steady pressure.',
          `Extract at 93°C and 9 bar to yield ${water} g liquid espresso in 27–30 seconds.`
        ];
      }
      return [
        `Xả nước làm nóng họng pha, lau khô tay pha và cân ${dose} g bột xay mịn.`,
        'Dàn đều mặt bột và nén thật phẳng với lực ổn định.',
        `Chiết ở 93°C, áp suất 9 bar để thu ${water} g espresso trong 27–30 giây.`
      ];
    }
  },
  coldbrew: {
    id: 'coldbrew',
    ratio: 10,
    baseDoseG: 50,
    ratioLabel: '1 : 10',
    name: { vi: 'Cold Brew ủ lạnh 24h', en: '24-Hour Cold Brew' },
    temp: '4°C (ngăn mát)',
    grind: { vi: 'Xay thô cỡ tiêu vỡ (Extra-Coarse)', en: 'Cracked-pepper coarse grind' },
    time: { vi: '20 – 24 giờ', en: '20 – 24 hours' },
    recommendedIds: ['cau-dat-honey', 'cold-brew-cam-vang'],
    steps: (dose, water, lang) => {
      if (lang === 'en') {
        return [
          `Combine ${dose} g coarsely ground coffee with ${water} ml filtered room-temperature water.`,
          'Stir gently so all grounds are saturated, seal the jar, and refrigerate at 4°C for 20–24 hours.',
          'Double-filter through a paper V60 cone. Serve over large ice; keeps clean for up to 5 days.'
        ];
      }
      return [
        `Cho ${dose} g cà phê xay thô vào bình thủy tinh cùng ${water} ml nước lọc mát.`,
        'Khuấy nhẹ để bột thấm đều, đậy kín và ủ trong ngăn mát tủ lạnh 4°C từ 20–24 giờ.',
        'Lọc qua phễu giấy V60 để tách cặn mịn. Dùng cùng đá già, bảo quản ngon nhất trong 5 ngày.'
      ];
    }
  }
};

function detectBrewMethod(norm) {
  if (/\b(v60|pour\s*over|pourover|kalita|chemex|giay loc|dripper)\b/.test(norm)) return 'v60';
  if (/\b(cold\s*brew|coldbrew|u lanh|ngam lanh)\b/.test(norm)) return 'coldbrew';
  if (/\b(espresso|moka|may pha|shot|crema|latte|cappuccino)\b/.test(norm)) return 'espresso';
  if (/\b(phin)\b/.test(norm) && !/\bphin giay\b/.test(norm)) return 'phin';
  return null;
}

function isRecipeIntent(norm) {
  return /\b(cong thuc|cach pha|ti le|ty le|recipe|brew|ratio|gram|ly|tach|cup|cups|nhiet do|bao nhieu nuoc|huong dan pha)\b/.test(
    norm
  );
}

function extractBrewQuantity(norm, profile) {
  // Check explicit grams first (e.g., "20g", "30 gram")
  const gramMatch = norm.match(/\b(\d{1,3})\s*(g|gr|gram|gam)\b/);
  if (gramMatch) {
    const rawG = parseInt(gramMatch[1], 10);
    if (rawG >= 8 && rawG <= 250) {
      const cups = Math.max(1, Math.round(rawG / profile.baseDoseG));
      return { doseG: rawG, cups };
    }
  }

  // Check cups / servings (e.g., "2 ly", "3 cups", "4 nguoi")
  const cupMatch = norm.match(/\b(\d{1,2})\s*(ly|tach|cup|cups|nguoi|shot|shots|phan)\b/);
  if (cupMatch) {
    const cups = Math.min(10, Math.max(1, parseInt(cupMatch[1], 10)));
    return { doseG: profile.baseDoseG * cups, cups };
  }

  return { doseG: profile.baseDoseG, cups: 1 };
}

function buildBrewRecipeBlock(methodKey, norm, lang) {
  const profile = BREW_PROFILES[methodKey] || BREW_PROFILES.v60;
  const { doseG, cups } = extractBrewQuantity(norm, profile);
  const waterMl = Math.round(doseG * profile.ratio);

  return {
    type: 'brew_recipe',
    method: profile.id,
    title: profile.name[lang],
    servings:
      lang === 'en'
        ? `${cups} ${cups === 1 ? 'cup' : 'cups'}`
        : `${cups} ly`,
    ratio: profile.ratioLabel,
    coffeeGrams: `${doseG} g`,
    waterMl: profile.id === 'espresso' ? `${waterMl} g yield` : `${waterMl} ml`,
    temp: profile.id === 'coldbrew' && lang === 'en' ? '4°C (chilled)' : profile.temp,
    grind: profile.grind[lang],
    time: profile.time[lang],
    steps: profile.steps(doseG, waterMl, lang),
    recommendedIds: profile.recommendedIds
  };
}

function buildB2BBlock(lang) {
  if (lang === 'en') {
    return {
      type: 'b2b_card',
      badge: 'An Roastery Wholesale',
      title: 'Coffee & Equipment for Cafés, Dining & Offices',
      highlights: [
        { label: 'Minimum order', value: 'From 10 kg / month' },
        { label: 'Roast schedule', value: 'Weekly in 5 kg returnable stainless tubs' },
        { label: 'Technical care', value: '4-hour on-site response (HCMC & Hanoi)' },
        { label: 'Sample kit', value: 'Complimentary 4-lot tasting box' }
      ],
      contact: '1900 6886 · b2b@anroastery.vn',
      ctaLabel: 'Explore Business Solutions',
      ctaTo: '/business-solutions'
    };
  }
  return {
    type: 'b2b_card',
    badge: 'Giải pháp sỉ An Roastery',
    title: 'Cung ứng hạt rang mộc & máy pha cho quán, nhà hàng và văn phòng',
    highlights: [
      { label: 'Sản lượng tối thiểu', value: 'Từ 10 kg / tháng' },
      { label: 'Lịch rang & giao', value: 'Rang mới mỗi tuần, thùng inox 5 kg hoàn trả' },
      { label: 'Hỗ trợ kỹ thuật', value: 'Có mặt trong 4 giờ (TP.HCM & Hà Nội)' },
      { label: 'Mẫu thử miễn phí', value: 'Hộp 4 loại hạt + tư vấn hồ sơ rang riêng' }
    ],
    contact: '1900 6886 · b2b@anroastery.vn',
    ctaLabel: 'Xem trang Giải pháp B2B',
    ctaTo: '/business-solutions'
  };
}

function serializeProductCard(product, lang) {
  return {
    id: product.id,
    cat: product.cat,
    name: product.name[lang],
    origin: product.origin[lang],
    notes: product.notes[lang],
    unit: product.unit[lang],
    brew: product.brew[lang],
    price: product.price,
    img: product.img,
    tag: product.tag ? product.tag[lang] : null,
    roast: product.roast,
    intensity: product.intensity,
    acidity: product.acidity,
    body: product.body
  };
}

function matchProducts(norm, lang, limit = 3) {
  const scored = PRODUCTS.map((p) => {
    let score = 0;

    // Flavor: low acidity / bold / bitter / chocolate / dark
    if (/\b(it chua|khong chua|dam|dang|ca cao|cacao|socola|so co la|truyen thong|sua da|low acid|bold|dark|strong|chocolate|intense)\b/.test(norm)) {
      if (p.acidity != null && p.acidity <= 2) score += 4;
      if (p.intensity != null && p.intensity >= 4) score += 3;
      if (p.body != null && p.body >= 4) score += 2;
    }

    // Flavor: bright / fruity / floral / sweet honey / light roast
    if (/\b(chua thanh|trai cay|hoa|mat ong|cam|tao|rang sang|thanh nhe|bright|fruity|floral|honey|citrus|light)\b/.test(norm)) {
      if (p.acidity != null && p.acidity >= 4) score += 4;
      if (p.roast != null && p.roast <= 2) score += 3;
    }

    // Low caffeine / afternoon / milky / gentle
    if (/\b(it caffeine|nhe|chieu|sua|bac xiu|ngot|de uong|mild|gentle|afternoon|milk|low caffeine|sweet)\b/.test(norm)) {
      if (p.id === 'bac-xiu-chai') score += 6;
      if (p.id === 'cau-dat-honey' || p.id === 'filter-morning-ground' || p.id === 'drip-cau-dat-box') score += 3;
      if (p.intensity != null && p.intensity <= 3) score += 2;
    }

    // Brew method matches
    if (/\b(phin)\b/.test(norm) && !/\bphin giay\b/.test(norm)) {
      if (p.id === 'phin-truyen-thong') score += 6;
      if (p.id === 'bao-loc-robusta') score += 5;
      if (p.id === 'phin-inox-an') score += 3;
    }
    if (/\b(v60|pour\s*over|pourover|kalita|giay loc|filter)\b/.test(norm)) {
      if (p.id === 'cau-dat-honey') score += 6;
      if (p.id === 'son-la-washed') score += 5;
      if (p.id === 'filter-morning-ground') score += 4;
      if (p.id === 'bo-pourover-v60') score += 3;
    }
    if (/\b(espresso|moka|may pha|crema|latte|cappuccino)\b/.test(norm)) {
      if (p.id === 'an-signature-blend') score += 6;
      if (p.id === 'espresso-xay-san') score += 5;
      if (p.id === 'bao-loc-robusta') score += 3;
    }
    if (/\b(cold\s*brew|coldbrew|u lanh|dong chai|uong lien|da|muoi)\b/.test(norm)) {
      if (p.cat === 'rtd') score += 5;
      if (/\bmuoi\b/.test(norm) && p.id === 'ca-phe-muoi-chai') score += 5;
      if (/\b(cam|cold\s*brew)\b/.test(norm) && p.id === 'cold-brew-cam-vang') score += 5;
      if (/\bbac xiu\b/.test(norm) && p.id === 'bac-xiu-chai') score += 5;
    }
    if (/\b(phin giay|drip|mang di|du lich|tien|van phong|office|travel|desk)\b/.test(norm)) {
      if (p.cat === 'drip') score += 6;
    }
    if (/\b(qua|tang|gift|dung cu|bo pha|tach|ly|am|pheu|gear)\b/.test(norm)) {
      if (p.cat === 'gear') score += 5;
      if (p.id === 'espresso-xay-san' || p.id === 'drip-cau-dat-box') score += 3;
    }

    // Origin matches
    if (/\b(cau dat|da lat|lam dong|arabica)\b/.test(norm)) {
      if (p.originKey === 'cau-dat') score += 4;
      if (p.id === 'son-la-washed' && /\barabica\b/.test(norm)) score += 3;
    }
    if (/\b(son la|tay bac|chieng ban)\b/.test(norm) && p.originKey === 'son-la') {
      score += 6;
    }
    if (/\b(bao loc|tay nguyen|robusta)\b/.test(norm) && p.originKey === 'highlands') {
      score += 5;
    }
    if (/\b(blend|phoi tron|house)\b/.test(norm) && p.originKey === 'blend') {
      score += 5;
    }

    return { product: p, score };
  });

  const hits = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => serializeProductCard(item.product, lang));

  return hits;
}

/**
 * Deterministic local barista engine — works 100% offline and also enriches
 * Gemini responses with interactive Generative UI cards.
 */
export function analyzeBaristaQuery(query, lang = 'vi') {
  const norm = normalizeText(query);
  const isEn = lang === 'en';
  const blocks = [];

  // 1. B2B / Wholesale intent
  const isB2B =
    /\b(si|b2b|wholesale|mo quan|doanh nghiep|nha hang|khach san|hop tac|bao gia|mau thu|cong ty|thung 5 kg|supplier|cafe partner)\b/.test(
      norm
    );
  if (isB2B) {
    blocks.push(buildB2BBlock(lang));
    return {
      reply: isEn
        ? 'An Roastery supplies weekly micro-batch roasted beans from 10 kg/month in zero-waste 5 kg returnable stainless tubs, complete with commercial equipment calibration and 4-hour technical care in HCMC & Hanoi. You can request a complimentary 4-lot sample box directly on our Business Solutions page.'
        : 'An Roastery cung ứng hạt rang mộc mẻ nhỏ theo tuần từ 10 kg/tháng trong thùng inox 5 kg hoàn trả, đi kèm lắp đặt máy pha, huấn luyện barista và bảo trì trong 4 giờ tại TP.HCM & Hà Nội. Bạn có thể đăng ký nhận hộp 4 mẫu thử miễn phí ngay tại trang Giải pháp B2B.',
      blocks,
      intent: 'b2b'
    };
  }

  // 2. Brew Recipe Calculator intent
  const detectedMethod = detectBrewMethod(norm);
  if (detectedMethod && isRecipeIntent(norm)) {
    const recipe = buildBrewRecipeBlock(detectedMethod, norm, lang);
    blocks.push(recipe);
    const pairedProducts = recipe.recommendedIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => serializeProductCard(p, lang));

    if (pairedProducts.length > 0) {
      blocks.push({ type: 'product_cards', items: pairedProducts });
    }

    return {
      reply: isEn
        ? `Here is our calibrated ${recipe.title} recipe for ${recipe.servings} (${recipe.coffeeGrams} coffee to ${recipe.waterMl}, ${recipe.temp}). Below are the beans we pair with this method at the bar.`
        : `Đây là công thức ${recipe.title} chuẩn quầy bar cho ${recipe.servings} (${recipe.coffeeGrams} cà phê : ${recipe.waterMl}, nhiệt độ ${recipe.temp}). Bên dưới là các dòng hạt phù hợp nhất để bạn pha đúng vị.`,
      blocks,
      intent: 'recipe'
    };
  }

  // 3. Store hours, branches, table booking, Saturday cupping
  const isStoreInfo =
    /\b(gio mo cua|dia chi|chi nhanh|o dau|dat ban|cupping|thu bay|hotline|lien he|hours|open|address|branch|location|book|reserve)\b/.test(
      norm
    );
  if (isStoreInfo) {
    return {
      reply: isEn
        ? 'An Roastery welcomes guests at 12 Hoang Hoa Tham (Tan Binh, HCMC), 06 Tran Cao Van (District 3, HCMC), and 48 Tran Thai Tong (Cau Giay, Hanoi). We open Mon–Fri 06:30–22:30 and Sat–Sun 07:00–23:00, with complimentary Saturday public cuppings at 09:30. Call 1900 6886 or reserve a table on the homepage.'
        : 'An Roastery có 3 không gian: 12 Hoàng Hoa Thám (Tân Bình, TP.HCM), 06 Trần Cao Vân (Quận 3, TP.HCM) và 48 Trần Thái Tông (Cầu Giấy, Hà Nội). Giờ mở cửa: Thứ 2–6 (06:30–22:30), Thứ 7–CN (07:00–23:00), có lớp cupping mở cửa miễn phí lúc 09:30 sáng Thứ Bảy. Hotline đặt bàn: 1900 6886.',
      blocks,
      intent: 'store_info'
    };
  }

  // 4. Taste & Bean Matcher
  const matched = matchProducts(norm, lang, 3);
  if (matched.length > 0) {
    blocks.push({ type: 'product_cards', items: matched });
    // If user also mentioned a brew method without explicitly saying "recipe", still attach helpful context
    const topNames = matched.map((m) => m.name).join(', ');
    return {
      reply: isEn
        ? `Based on your preference, I recommend ${topNames}. Every bag is clean-roasted in micro-batches under 5 kg and packed with its roast date and lot code.`
        : `Theo gu bạn chia sẻ, mình gợi ý ${topNames}. Toàn bộ đều là hạt rang mộc mẻ nhỏ dưới 5 kg, in rõ ngày rang và vùng nguyên liệu trên từng túi.`,
      blocks,
      intent: 'products'
    };
  }

  // 5. General greeting / fallback with house favorites
  const featured = ['cau-dat-honey', 'an-signature-blend', 'bao-loc-robusta']
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => serializeProductCard(p, lang));

  blocks.push({ type: 'product_cards', items: featured });

  return {
    reply: isEn
      ? 'Welcome to An Roastery. Tell me your preferred flavor (bright & floral, bold & low-acid, or gentle milk coffee), how you brew (Phin, V60, Espresso, Cold Brew), or ask for a scaled brew recipe or B2B wholesale quote.'
      : 'Chào bạn đến với An Roastery. Bạn có thể chia sẻ gu vị (chua thanh, đậm ít chua hay dịu nhẹ buổi chiều), cách pha (Phin, V60, Espresso, Cold Brew), hoặc hỏi công thức định lượng và báo giá sỉ B2B — mình sẽ tư vấn ngay.',
    blocks,
    intent: 'welcome'
  };
}
