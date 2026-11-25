import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  opsVi,
  opsEn,
  trData as translateData,
  formatTemplate,
  moneyVnd,
  whenLocale,
  clockLocale
} from './opsI18n';

/**
 * Song ngữ VI/EN cho toàn bộ mặt tiền khách hàng:
 * Trang chủ, Sản phẩm, Văn hóa cà phê, Giải pháp B2B, Bền vững, Nhật ký.
 * Ngôn ngữ lưu ở localStorage "site-lang", mặc định "vi".
 */

const vi = {
  brand: { tag: 'Xưởng rang mộc & không gian cà phê' },
  nav: {
    label: 'Điều hướng chính',
    home: 'Trang chủ',
    products: 'Sản phẩm',
    culture: 'Văn hóa cà phê',
    business: 'Giải pháp B2B',
    sustain: 'Bền vững',
    journal: 'Nhật ký',
    quiz: 'Tìm gu cà phê',
    menu: 'Thực đơn quầy',
    booking: 'Đặt bàn',
    story: 'Câu chuyện hạt',
    space: 'Không gian',
    admin: 'Quản trị / POS',
    hotline: 'Đặt bàn & Sỉ',
    orderNow: 'Gọi món',
    menuOpen: 'Mục lục',
    menuClose: 'Đóng',
    drawerHouse: 'Ngôi nhà An Roastery',
    drawerExplore: 'Chuyên mục',
    drawerVisit: 'Ghé quán & Vận hành'
  },
  switcher: { label: 'Chọn ngôn ngữ' },
  story: {
    eyebrow: 'Mùa vụ Cầu Đất · Rang mộc mẻ nhỏ',
    reelTag: 'Chặng',
    cue: 'Cuộn xuống để theo hạt đi từ đồi tới tách',
    viewMenu: 'Xem thực đơn',
    book: 'Đặt bàn',
    railLabel: 'Các chặng trong hành trình',
    chapters: {
      doi: {
        label: 'Đồi Cầu Đất',
        body: 'Mỗi tách ở quán bắt đầu từ một cành cà phê chín đỏ trên đồi Cầu Đất, Lâm Đồng.',
        unit: 'm',
        caption: 'Độ cao vườn cà phê'
      },
      qua: {
        label: 'Quả chín',
        heading: ['Chỉ hái quả', 'đã chín đỏ'],
        body: 'Hái tay từng quả. Bổ đôi ra, bên trong là hai nhân nằm trong lớp thịt quả ngọt.',
        unit: 'nhân',
        caption: 'Trong mỗi quả cà phê'
      },
      rang: {
        label: 'Rang',
        heading: ['Rang mẻ nhỏ,', 'dưới 5 kg'],
        body: 'Hạt xanh đảo đều trong lồng rang. Người rang theo dõi đồ thị nhiệt tới tiếng nổ đầu tiên.',
        unit: '°C',
        caption: 'Nhiệt trong lồng rang'
      },
      'ra-lo': {
        label: 'Ra lò',
        heading: ['Ra lò là', 'đảo nguội ngay'],
        body: 'Hạt xả ra khay khi vừa đủ độ rang, quạt làm nguội nhanh để giữ hương trái cây và mật ong.',
        unit: '°C',
        caption: 'Hạt nguội dần trên khay'
      },
      xay: {
        label: 'Xay',
        heading: ['Xay ngay', 'trước khi pha'],
        body: 'Quán không xay sẵn. Hạt chỉ vào cối khi có order, để bột còn nguyên tinh dầu.',
        unit: 'µm',
        caption: 'Cỡ hạt bột cho espresso'
      },
      nen: {
        label: 'Định lượng',
        heading: ['18 gram,', 'nén thật phẳng'],
        body: 'Bột được cân cho từng shot rồi nén một lực đều, để nước đi qua bánh cà phê không bị lệch.',
        unit: 'g',
        caption: 'Bột cho một shot'
      },
      chiet: {
        label: 'Chiết xuất',
        heading: ['Chín bar,', 'hai mươi tám giây'],
        body: 'Espresso chảy thành dòng sánh, lớp crema màu hạt dẻ. Mời bạn ghé quầy.',
        unit: 'giây',
        caption: 'Chiết ở áp suất 9 bar'
      }
    }
  },
  home: {
    catalog: {
      head: 'Tủ hạt và đồ pha mang về nhà',
      sub: 'Chọn dòng sản phẩm bạn dùng mỗi sáng — hạt chỉ đóng gói khi vừa nghỉ đủ ngày sau rang.',
      viewAll: 'Mở toàn bộ cửa hàng (15 món)',
      roastLabel: 'Độ rang',
      intensityLabel: 'Độ đậm',
      acidityLabel: 'Độ thanh',
      brewLabel: 'Gợi ý pha',
      selectAria: 'Xem chi tiết {name}'
    },
    cycle: {
      head: 'Chu trình của một tách tử tế',
      sub: 'Bắt đầu từ đất đồi, thành hình trong lồng gang, cân bằng nhờ phối trộn và hoàn tất trên bàn thử nếm.',
      cta: 'Đọc sâu hơn ở trang Văn hóa cà phê'
    },
    quiz: {
      head: 'Đâu là hồ sơ vị giác hợp với bạn?',
      sub: 'Ba câu hỏi ngắn từ bàn thử nếm của quán để chọn đúng túi hạt pha tại nhà và món nước nên gọi khi ghé quầy.',
      resultHeading: 'Gợi ý dành cho bạn',
      homeBagLabel: 'Mang về nhà',
      barDrinkLabel: 'Gọi tại quầy bar',
      brewGuideLabel: 'Thông số pha chuẩn',
      resetBtn: 'Chọn lại từ đầu',
      shopCta: 'Xem trên kệ Sản phẩm'
    },
    journalPreview: {
      head: 'Ghi chép từ xưởng rang & đồi cà phê',
      sub: 'Chuyện mùa vụ, thử nghiệm cỡ xay và những người làm ra hạt cà phê bạn uống mỗi ngày.',
      allLink: 'Đọc tất cả bài viết',
      readLink: 'Đọc bài ghi chép'
    },
    b2bBanner: {
      head: 'Giải pháp cà phê cho quán, nhà hàng & văn phòng',
      body: 'Cung ứng hạt rang theo tuần trong thùng hoàn trả 5 kg, lắp đặt máy pha chuyên nghiệp và huấn luyện barista định kỳ.',
      cta: 'Khám phá giải pháp B2B',
      statA: 'Từ 10 kg/tháng',
      statB: 'Hỗ trợ kỹ thuật 7 ngày'
    },
    pillars: {
      head: 'Ba việc chúng tôi làm mỗi ngày',
      sub: 'Gọi món nhanh, pha chế trước mặt bạn, bánh nướng ra lò hai lần mỗi ngày.',
      items: [
        {
          title: 'QR Order tại bàn',
          body: 'Quét mã, chỉnh đá–ngọt–sữa yến mạch, thanh toán VietQR hoặc thẻ trong khoảng nửa phút.',
          meta: 'Giảm thời gian chờ gọi món'
        },
        {
          title: 'Quầy bar mở',
          body: 'Ngồi đối diện barista: pour-over V60, cold brew ủ 24 giờ, máy pha Synesso.',
          meta: 'Xem quy trình pha chế'
        },
        {
          title: 'Bếp bánh bơ Pháp',
          body: 'Croissant và sourdough nướng lúc 07:30 và 14:00 với bơ Bret.',
          meta: 'Mẻ mới mỗi buổi'
        }
      ]
    },
    menu: {
      head: 'Signature đang bán chạy tại quầy',
      link: 'Đặt bàn để thưởng thức tại quán',
      addAria: 'Thêm {name}',
      items: [
        {
          name: 'Cà Phê Muối Xứ Huế',
          desc: 'Kem muối biển béo ngậy phủ trên nền Robusta rang mộc đậm đà.',
          price: '45.000đ'
        },
        {
          name: 'Cold Brew Cam Vàng',
          desc: 'Arabica Cầu Đất ngâm lạnh 24 giờ hòa quyện tép cam tươi.',
          price: '52.000đ'
        },
        {
          name: 'Bạc Xỉu 3 Tầng',
          desc: 'Sữa đặc, sữa tươi Dalatmilk và espresso sánh đậm.',
          price: '42.000đ'
        },
        {
          name: 'Trà Đào Cam Sả',
          desc: 'Trà đen ủ lạnh với đào tươi và sả đập dập.',
          price: '48.000đ'
        },
        {
          name: 'Croissant Bơ Pháp',
          desc: 'Vỏ giòn ngàn lớp, ruột mềm đượm hương bơ Bret.',
          price: '38.000đ'
        }
      ]
    },
    story: {
      head: 'Bốn cam kết từ nông trại đến tách',
      lede: 'Tách ngon không cần hương liệu. Giá trị nằm ở hạt chín cây, sơ chế tỉ mỉ và tay nghề người rang.',
      imgFarmAlt: 'Vườn cà phê Cầu Đất trong sương sớm',
      imgRoastAlt: 'Hạt cà phê mới rang đang nguội trên khay',
      noteAlt: 'Cầu Đất & Bảo Lộc, Lâm Đồng',
      noteRoast: 'Đồ thị rang kiểm soát từng mẻ',
      items: [
        { title: 'Hái chín bằng tay', body: 'Chỉ tuyển quả đỏ mọng đồng đều để tối ưu đường tự nhiên trong hạt.' },
        { title: 'Sơ chế Honey & Natural', body: 'Phơi giàn nhà kính thông thoáng, giữ nốt hương hoa quả và mật ong.' },
        { title: 'Rang mẻ nhỏ thủ công', body: 'Micro-batch dưới 5kg mỗi mẻ giúp kiểm soát hương vị từng mẻ đậu.' },
        { title: 'Cupping chuẩn SCA', body: 'Nếm thử và đánh giá từng thang điểm trước khi phục vụ tại quầy bar.' }
      ]
    },
    sustain: {
      titleA: 'Từ đồi Cầu Đất',
      titleEm: 'đến',
      titleB: 'tách cà phê trên tay bạn',
      sub: 'Bền vững ở An Roastery không phải khẩu hiệu treo tường. Đó là cách quán mua hạt, cách vườn được chăm và cách mỗi ca phục vụ dùng vừa đủ nguyên liệu.',
      fullReportLink: 'Xem báo cáo Bền vững & các lô hạt hiếm',
      statsAria: 'Con số bền vững',
      stats: [
        { value: 42, suffix: '', label: 'hộ nông liên kết tại Cầu Đất, Bảo Lộc & Sơn La' },
        { value: 1650, suffix: ' m', label: 'độ cao trung bình của vườn cà phê' },
        { value: 92, suffix: '%', label: 'quả được hái chín đỏ hoàn toàn bằng tay' },
        { value: 14, suffix: '', label: 'ngày tối đa từ mẻ rang đến lúc lên quầy' }
      ],
      chapters: [
        {
          index: '01 / 03',
          title: 'Người trồng',
          heading: 'Giá trị bắt đầu từ bàn tay hái quả',
          body: 'An Roastery mua trực tiếp từ các hộ nông liên kết, trả cao hơn giá thị trường cho phần quả chín đỏ được tuyển tay. Lịch thu mua được chốt trước vụ mùa để nông hộ yên tâm chăm vườn thay vì chạy theo sản lượng.'
        },
        {
          index: '02 / 03',
          title: 'Đất & vườn',
          heading: 'Canh tác nhẹ tay với đất đồi',
          body: 'Vườn liên kết giữ lại hàng cây che bóng, hạn chế thuốc trừ cỏ và ủ vỏ cà phê làm phân hữu cơ ngay tại chỗ. Đất khỏe thì cây khỏe — và hương vị trong tách là kết quả cuối cùng của chuỗi đó.'
        },
        {
          index: '03 / 03',
          title: 'Quầy bar',
          heading: 'Ít lãng phí hơn ở mỗi ca phục vụ',
          body: 'Bã cà phê sau pha được gom cho các vườn rau đô thị, sữa tươi được chia ca theo lượng khách dự kiến và bánh cuối ngày giảm giá thay vì bỏ đi. Mỗi quán nhỏ làm phần của mình, đều đặn mỗi ngày.'
        }
      ],
      band: {
        title: 'Sân phơi giàn nhà kính',
        caption: 'Nơi hạt cà phê trải qua 30 ngày chậm rãi trước khi về xưởng rang.',
        alt: 'Sân phơi cà phê trên đồi Cầu Đất'
      },
      journeyHead: 'Hành trình của một hạt',
      journeySub: 'Bốn giai đoạn, một vụ mùa — theo đúng nhịp mà quán vẫn làm từ ngày đầu.',
      journey: [
        { phase: 'Giai đoạn I', when: 'Tháng 11 – 2', title: 'Thu hái chọn lọc', body: 'Chỉ quả đỏ mọng được hái, theo nhiều đợt trong cùng một vụ để không quả nào bị hái xanh.' },
        { phase: 'Giai đoạn II', when: '30 ngày', title: 'Sơ chế & phơi giàn', body: 'Honey và natural phơi trên giàn nhà kính, đảo đều tay cho đến khi độ ẩm hạt ổn định.' },
        { phase: 'Giai đoạn III', when: 'Ngày 0', title: 'Rang mẻ nhỏ', body: 'Mỗi mẻ dưới 5kg trên máy Giesen W6A, đồ thị rang được lưu lại để đối chiếu từng lần.' },
        { phase: 'Giai đoạn IV', when: 'Ngày 2 – 14', title: 'Lên quầy bar', body: 'Hạt nghỉ đủ ngày sau rang rồi mới xay pha — khoảng thời gian cho hương vị tròn nhất.' }
      ]
    },
    book: {
      head: 'Đặt bàn và buổi thử nếm cuối tuần',
      sub: 'Giữ chỗ làm việc yên tĩnh, góc ban công, hoặc đăng ký cupping cùng thợ rang sáng thứ Bảy.',
      perks: [
        'Giữ chỗ trước đến 30 phút, không phụ phí',
        'Ổ cắm, bàn làm việc dài và wifi ổn định',
        'Tặng một bánh cookie bơ Pháp khi đặt trước online'
      ],
      branch: 'Chi nhánh',
      date: 'Ngày',
      time: 'Khung giờ',
      guests: 'Số khách',
      area: 'Khu vực',
      name: 'Họ tên',
      phone: 'Số điện thoại',
      namePlaceholder: 'Nguyễn Văn An',
      phonePlaceholder: '0901 234 567',
      guestsOptions: ['1 người', '2 người', '3 – 5 người', '6 – 12 người'],
      areaOptions: ['Sảnh yên tĩnh', 'Ban công ngoài trời', 'Quầy bar mở / Cupping', 'Bàn làm việc có ổ cắm'],
      submit: 'Giữ bàn miễn phí',
      success: 'Đã ghi nhận. Quán sẽ gọi xác nhận trong vài phút.'
    },
    space: {
      head: 'Không gian giữa phố',
      sub: 'Gỗ sồi, bê tông mài và mùi mẻ rang mới — chỗ ngồi làm việc hoặc đọc sách.',
      gallery: [
        { caption: 'Bàn dài & ánh sáng tự nhiên', alt: 'Bàn làm việc dài dưới ánh sáng cửa sổ lớn' },
        { caption: 'Góc đọc sách', alt: 'Góc đọc sách với ghế da và kệ sách' },
        { caption: 'Ban công ngoài trời', alt: 'Ban công ngoài trời dưới tán cây' }
      ],
      quote: '“Cà phê muối rang mộc thật, không gắt dầu. QR Order tại bàn chạy mượt — đặt xong là pha.”',
      quoteBy: 'Hoàng Minh Quân · khách quen chi nhánh Tân Bình'
    },
    staff: {
      label: 'Dành cho nhân viên vận hành ca trực An Roastery',
      links: ['POS thu ngân', 'KDS bếp', 'Dashboard', 'Sơ đồ bàn']
    }
  },
  footer: {
    tagline: 'Rang mộc chuẩn SCA, pha chế thủ công và không gian thưởng thức tĩnh tại giữa đô thị.',
    exploreTitle: 'Chuyên mục',
    hoursTitle: 'Giờ mở cửa',
    hours: [
      { label: 'Thứ 2 – Thứ 6', value: '06:30 – 22:30' },
      { label: 'Thứ 7 – Chủ nhật', value: '07:00 – 23:00' },
      { label: 'Cupping mở cửa', value: '09:30 Thứ Bảy' }
    ],
    branchesTitle: 'Chi nhánh & Xưởng',
    contactTitle: 'Liên hệ',
    bookingLine: 'Đặt bàn: 1900 6886',
    b2bLine: 'Đối tác hạt sỉ: b2b@anroastery.vn',
    emailLine: 'Email: hello@anroastery.vn',
    privacy: 'Chính sách bảo mật',
    terms: 'Điều khoản'
  },
  products: {
    meta: 'Xưởng rang Tân Bình · Giao hàng toàn quốc',
    title: 'Cà phê tại nhà, đóng gói từ mẻ rang trong tuần',
    lede: 'Mười lăm dòng hạt nguyên chất, rang xay đúng cỡ phễu, phin giấy đóng khí nitơ, chai ủ lạnh mỗi sáng và bộ dụng cụ gốm – inox mà barista của quán tin dùng.',
    all: 'Tất cả dòng',
    subfilterLabel: 'Lọc theo vùng hạt:',
    subfilters: {
      all: 'Mọi vùng trồng',
      'cau-dat': 'Cầu Đất · 1.650 m',
      highlands: 'Bảo Lộc & Tây Nguyên',
      'son-la': 'Sơn La Tây Bắc',
      blend: 'Phối trộn tại xưởng'
    },
    add: 'Chọn mua',
    added: 'Đã thêm',
    addAria: 'Thêm {name} vào giỏ',
    inspect: 'Thông số pha',
    hideInspect: 'Thu gọn',
    roast: 'Độ rang',
    intensity: 'Độ đậm',
    acidity: 'Độ thanh',
    body: 'Thể chất',
    bagSummary: '{count} món trong giỏ tạm · {total}',
    bagClear: 'Xóa chọn',
    bagCheckoutNote: 'Gọi 1900 6886 hoặc ghé quầy nhận ngay trong 2 giờ',
    note: 'Miễn phí giao nội thành TP.HCM và Hà Nội cho đơn từ 300.000₫. Mọi túi hạt đều in rõ ngày rang, mã lô và tên vùng nguyên liệu.',
    quizPromptTitle: 'Chưa chắc mình hợp hạt Cầu Đất thanh nhẹ hay Bảo Lộc đậm mộc?',
    quizPromptCta: 'Làm bài trắc nghiệm gu vị 30 giây',
    categories: {
      bean: { label: 'Nguyên hạt', blurb: 'Dành cho bạn có cối xay ở nhà — giữ trọn tinh dầu đến phút cuối trước khi pha.' },
      ground: { label: 'Rang xay', blurb: 'Xay bằng đĩa phẳng tốc độ thấp theo đúng cỡ phin, ấm Moka hoặc phễu giấy.' },
      drip: { label: 'Phin giấy', blurb: 'Túi lọc 12–14 g thổi khí nitơ giữ hương, gác lên miệng ly pha ngay tại bàn làm việc.' },
      rtd: { label: 'Đóng chai lạnh', blurb: 'Ủ lạnh và đóng chai thủy tinh mỗi sáng tại quầy bar, hoàn 5.000₫ khi trả vỏ.' },
      gear: { label: 'Dụng cụ pha', blurb: 'Phin inox dày, phễu sứ nung cao lửa và tách men tro làm tay tại làng gốm.' }
    }
  },
  culture: {
    meta: 'Chuyên khảo & Cẩm nang pha chế',
    title: 'Văn hóa của sự chậm rãi trong từng giọt cà phê',
    lede: 'Từ rừng cà phê hoang dã Kaffa đến chiếc phin nhôm gõ khẽ trên mặt bàn gỗ Sài Gòn — cà phê sống được lâu đến thế vì xung quanh nó luôn có con người, nghi thức và nghề thủ công.',
    nav: {
      cycle: 'Chu trình 4 bước',
      origins: 'Dòng lịch sử',
      phin: 'Nghi thức phin',
      lab: 'Phòng Lab & Học viện',
      guides: 'Công thức tại nhà'
    },
    origins: {
      title: 'Khởi nguồn: hạt cà phê đi nửa vòng trái đất',
      body: [
        'Truyền thuyết kể rằng vào thế kỷ 9, người chăn dê Kaldi ở vùng Kaffa (Ethiopia) nhận ra đàn dê của mình tỉnh táo lạ thường sau khi ăn quả đỏ của một loài cây bụi trên núi. Từ cao nguyên Đông Phi ấy, hạt cà phê theo thuyền buôn qua cảng Mocha của Yemen, bước vào những quán qahveh khaneh ở Istanbul rồi lan khắp Venice, Paris và Vienna.',
        'Năm 1857, những cây Arabica đầu tiên đặt chân đến Việt Nam, trước khi tìm thấy thổ nhưỡng lý tưởng trên sườn núi đá đỏ Tây Nguyên và dải mây mù Cầu Đất. Hơn một thế kỷ rưỡi sau, người Việt đã tạo nên một ngôn ngữ cà phê hoàn toàn riêng biệt: đậm sánh, hồn hậu và không bao giờ uống vội.'
      ]
    },
    timelineTitle: 'Bảy cột mốc định hình tách cà phê hôm nay',
    timeline: [
      { year: 'Thế kỷ 9', title: 'Cao nguyên Kaffa, Ethiopia', body: 'Cây Arabica mọc tự nhiên dưới tán rừng già; quả chín được giã cùng bơ làm lương khô cho những chuyến đi xa.' },
      { year: 'Thế kỷ 15', title: 'Cảng Mocha & Yemen', body: 'Kỹ thuật rang hạt trên chảo gang và pha nước sôi ra đời, mở màn cho văn hóa quán cà phê trò chuyện.' },
      { year: 'Thế kỷ 17', title: 'Venice, London & Paris', body: 'Quán cà phê châu Âu trở thành nơi gặp gỡ của nhà văn, thương buôn và những tờ báo in đầu tiên.' },
      { year: '1857', title: 'Cây giống đầu tiên tại Việt Nam', body: 'Những vườn cà phê thử nghiệm ở miền Bắc và Bắc Trung Bộ đặt nền móng cho hơn 165 năm canh tác.' },
      { year: '1920s', title: 'Đất đỏ Cầu Đất & Tây Nguyên', body: 'Độ cao 1.500 m của Đà Lạt cho ra hạt Bourbon thơm ngát, trong khi Buôn Ma Thuột và Bảo Lộc trù phú giống Robusta.' },
      { year: '1940s', title: 'Sữa đá Sài Gòn & Cà phê trứng Hà Nội', body: 'Từ chiếc phin nhỏ giọt, người Việt sáng tạo nên hai biểu tượng ẩm thực đường phố được cả thế giới nhắc tên.' },
      { year: 'Hiện tại', title: 'Thế hệ rang mộc & Specialty Việt', body: 'Nông hộ và xưởng rang trẻ quay về giá trị cốt lõi: hái chín 100%, lên men sạch và minh bạch từng lô hạt.' }
    ],
    phin: {
      title: 'Nghi thức phin & hai di sản trong chiếc ly thủy tinh',
      body: [
        'Phin không dung thứ cho sự hấp tấp. Nước sôi 96°C tưới vừa đủ ủ bột nở đều trong ba mươi giây, rồi từng giọt nâu sẫm rơi đều nhịp xuống lớp sữa đặc. Khoảng năm phút chờ đợi ấy là lúc người ta gác điện thoại xuống và nhìn ra hàng cây trước hiên.',
        'Từ nền cà phê phin đậm đà ấy, Sài Gòn có ly bạc xỉu và cà phê sữa đá mát lạnh giữa trưa nắng, còn Hà Nội mùa thu giữ ấm bàn tay bằng chén cà phê trứng đánh bông mịn như kem sabayon.'
      ],
      imgAlt: 'Phin cà phê inox đang nhỏ giọt chậm rãi',
      imgCaption: 'Phin 170 ml, 25 g bột rang mộc, 5 phút 15 giây nhỏ giọt tự trọng.',
      eggCaption: 'Cà phê trứng đánh bông cùng mật ong, đặt trong chén nước nóng giữ nhiệt.'
    },
    lab: {
      title: 'Phòng thử nếm & Lớp học Barista cuối tuần',
      lede: 'Lấy cảm hứng từ các trung tâm khoa học cà phê châu Âu nhưng gần gũi như một gian bếp mở: nơi khách uống, người trồng và thợ rang ngồi chung một bàn.',
      leftTitle: 'Phòng Lab Kiểm Định & Rang Mẫu',
      leftBody: 'Trang bị máy rang mẫu Ikawa 100g, máy đo màu Agtron và khúc xạ kế đo chiết xuất TDS. Mỗi lô nhân xanh từ nông trại đều được rang thử ba cấu hình nhiệt trước khi chốt lịch rang mẻ lớn.',
      leftMeta: 'Kiểm định 100% lô nguyên liệu đầu vào',
      rightTitle: 'Lớp Cupping & Pha Thủ Công Sáng Thứ Bảy',
      rightBody: 'Mỗi sáng thứ Bảy lúc 09:30 tại chi nhánh Quận 3 (tối đa 8 người/buổi), barista hướng dẫn nếm phân biệt 4 vùng trồng Việt Nam và thực hành căn chỉnh dòng nước V60 cũng như phin truyền thống.',
      rightMeta: 'Miễn phí cho khách đặt chỗ trước',
      bookCta: 'Đăng ký chỗ ngồi sáng thứ Bảy'
    },
    guides: {
      title: 'Ba công thức nền tảng để pha ngon tại nhà',
      sub: 'Tỉ lệ chuẩn mà quầy bar dùng để huấn luyện nhân sự mới. Hãy bắt đầu từ đây rồi gia giảm theo gu đậm nhạt của riêng bạn.',
      ratioLabel: 'Định lượng',
      tempLabel: 'Nhiệt nước',
      timeLabel: 'Tổng thời gian',
      items: [
        { name: 'Phin truyền thống', ratio: '25 g cà phê : 95 ml nước', temp: '95 – 96°C', time: '5 – 6 phút', body: 'Tráng nóng phin. Cho bột vào lắc phẳng, ủ nở 20 ml nước trong 30 giây, đặt tấm chặn tự trọng rồi rót nhẹ 75 ml còn lại.' },
        { name: 'Pour-over V60', ratio: '15 g cà phê : 240 ml nước', temp: '91 – 93°C', time: '2 phút 45 giây', body: 'Xay cỡ muối biển. Rót nở 45 g nước trong 40 giây, sau đó chia làm hai lần rót xoáy đồng tâm từ tâm ra rìa mà không dội trực tiếp lên giấy.' },
        { name: 'Cold Brew ủ lạnh', ratio: '50 g cà phê : 500 ml nước mát', temp: '4°C trong tủ mát', time: '20 – 24 giờ', body: 'Xay thô cỡ tiêu vỡ, ngâm kín trong bình thủy tinh ở ngăn mát tủ lạnh rồi lọc qua giấy V60 để thu được bình cà phê trong, ngọt hậu suốt 5 ngày.' }
      ]
    },
    closing: {
      quote: '“Cà phê ngon không làm ngày dài thêm, nhưng làm mười lăm phút buổi sáng trở nên đáng nhớ.”',
      by: '— Xưởng rang An Roastery',
      shopCta: 'Chọn hạt về tự tay pha'
    }
  },
  business: {
    meta: 'Cung ứng hạt rang mộc, thiết bị & đào tạo vận hành',
    title: 'Đồng hành cùng quán cà phê, nhà hàng và văn phòng tử tế',
    lede: 'Từ quán nhỏ 25 ghế đến sảnh khách sạn hay văn phòng 200 nhân sự: chúng tôi thiết kế hồ sơ rang riêng, lắp đặt hệ máy pha bền bỉ và chăm sóc kỹ thuật định kỳ để mỗi tách phục vụ đều giữ đúng chuẩn.',
    ctaPrimary: 'Nhận bộ mẫu thử 4 loại hạt',
    ctaSecondary: 'Gọi bộ phận sỉ: 1900 6886',
    linesHead: 'Bốn dòng nguyên liệu cung ứng theo tuần',
    linesSub: 'Chọn mô hình vận hành để xem quy cách đóng gói, định mức ly và lịch giao hạt tươi.',
    machinesHead: 'Hệ máy pha và cối xay chuyên nghiệp',
    machinesSub: 'Thiết bị được kiểm chứng thực tế qua hàng vạn ly tại chính chuỗi quầy bar của An Roastery.',
    machineFilterAll: 'Tất cả cấu hình',
    servicesHead: 'Bốn cam kết kỹ thuật đi kèm mỗi hợp đồng hạt',
    services: [
      { num: '01', title: 'Rang theo lịch đặt hàng đầu tuần', body: 'Không giao hàng tồn kho lâu ngày. Hạt được rang thứ Sáu, nghỉ degassing cuối tuần và giao sáng thứ Hai.' },
      { num: '02', title: 'Huấn luyện barista & chuẩn hóa công thức', body: 'Đào tạo trực tiếp tại quầy của đối tác: chỉnh cối xay theo độ ẩm trời mưa/nắng, đánh sữa mịn và vệ sinh họng pha.' },
      { num: '03', title: 'Kỹ thuật viên có mặt trong 4 giờ', body: 'Đội bảo trì nội thành TP.HCM và Hà Nội xử lý sự cố áp suất, rò gioăng hoặc cho mượn cối xay dự phòng ngay trong ca.' },
      { num: '04', title: 'Kiểm soát chất lượng nước pha', body: 'Đo độ cứng và TDS nguồn nước miễn phí trước khi lắp máy, tư vấn lõi lọc chống đóng cặn nồi hơi.' }
    ],
    formHead: 'Yêu cầu báo giá sỉ & hộp mẫu thử miễn phí',
    formSub: 'Để lại thông tin mô hình của bạn — chuyên viên rang và thiết bị sẽ liên hệ trong giờ làm việc cùng ngày.',
    fields: {
      company: 'Tên quán / doanh nghiệp',
      companyPh: 'Ví dụ: Tiệm Cà Phê Mùa Thu / Công ty ABC',
      contact: 'Người liên hệ',
      contactPh: 'Trần Minh Khôi',
      phone: 'Số điện thoại',
      phonePh: '0903 456 789',
      segment: 'Mô hình hoạt động',
      segments: ['Quán cà phê độc lập', 'Nhà hàng / Khách sạn', 'Văn phòng doanh nghiệp', 'Chuỗi cửa hàng / Đại lý'],
      volume: 'Sản lượng dự kiến mỗi tháng',
      volumes: ['10 – 25 kg / tháng', '25 – 60 kg / tháng', 'Trên 60 kg / tháng', 'Cần tư vấn trọn gói máy + hạt'],
      notes: 'Ghi chú thêm về máy đang dùng hoặc gu vị mong muốn',
      notesPh: 'Ví dụ: Đang dùng máy 2 group, khách chuộng gu đậm vừa pha sữa tươi...',
      submit: 'Gửi yêu cầu nhận mẫu thử',
      success: 'Đã tiếp nhận yêu cầu. Bộ phận Giải pháp B2B sẽ gọi xác nhận địa chỉ gửi hộp mẫu trong hôm nay.'
    }
  },
  sustainabilityPage: {
    meta: 'Tác động tích cực từ nông trại tới sau quầy pha',
    title: 'Canh tác bền vững được nuôi dưỡng bằng giá mua công bằng',
    lede: 'Chúng tôi tin rằng không thể có cà phê bền vững nếu người trồng phải bán dưới giá thành chăm sóc. Mọi cam kết môi trường của An Roastery bắt đầu từ hợp đồng bao tiêu trực tiếp và khép lại ở vòng tuần hoàn phụ phẩm tại quán.',
    pillarsHead: 'Ba trụ cột vận hành xuyên suốt',
    microHead: 'Các lô hạt vi mô (Micro-lots) gìn giữ giống bản địa',
    microSub: 'Những mảnh vườn nhỏ dưới 2 héc-ta canh tác xen canh tự nhiên, được thu mua tách bạch từng bao để tôn vinh tên người trồng.',
    tastingLabel: 'Bốn tầng hương vị ghi nhận trên bàn thử nếm',
    circularHead: 'Kinh tế tuần hoàn: không có gì bị bỏ đi vô ích',
    circularSub: 'Từ vỏ lụa trong lồng rang đến bã espresso cuối ngày — mỗi phụ phẩm đều bước sang một vòng đời mới.',
    roadmapHead: 'Lộ trình thích ứng khí hậu & giảm phát thải 2020 – 2028',
    roadmap: [
      { period: '2020 – 2022', phase: 'Giai đoạn I', title: 'Mua trực tiếp & bỏ qua thương lái trung gian', body: 'Thiết lập mạng lưới 18 hộ nông đầu tiên tại Cầu Đất và Bảo Lộc với mức thưởng cố định +22% cho quả hái chín đỏ trên 90%.' },
      { period: '2022 – 2024', phase: 'Giai đoạn II', title: 'Tán cây che bóng & ủ phân vỏ cà phê', body: 'Trồng xen hơn 1.400 cây hồng, mắc-ca và muồng đen giữ ẩm đất đồi, giảm một nửa lượng phân bón hóa học đầu vào.' },
      { period: '2024 – 2026', phase: 'Giai đoạn III', title: 'Tuần hoàn bã pha & thùng giao hạt không rác nhựa', body: '100% bã cà phê tại 3 chi nhánh chuyển về trại nấm; đưa vào vận hành thùng inox 5 kg hoàn trả cho các quán đối tác.' },
      { period: '2026 – 2028', phase: 'Giai đoạn IV · Đang triển khai', title: 'Bảo tồn giống chịu hạn & điện mặt trời tại xưởng', body: 'Nhân giống thử nghiệm Liberica (cà phê mít) rễ cọc chịu khô hạn và chuyển đổi 60% điện năng xưởng rang sang áp mái.' }
    ]
  },
  journal: {
    meta: 'Con người, mùa vụ, kỹ thuật & chuyện quanh tách cà phê',
    title: 'Nhật ký từ xưởng rang và những triền đồi',
    lede: 'Nơi đội ngũ thợ rang, barista và nông hộ ghi lại những thử nghiệm thành công lẫn thất bại trên hành trình làm ra tách cà phê mộc mạc.',
    categories: {
      all: 'Tất cả bài viết',
      harvest: 'Mùa vụ & Vùng trồng',
      craft: 'Kỹ thuật rang & pha',
      community: 'Cộng đồng',
      press: 'Tin từ xưởng'
    },
    leadBadge: 'Bài tiêu điểm',
    readArticle: 'Đọc toàn văn',
    closeArticle: 'Đóng bài đọc',
    ledgerHead: 'Sổ tin tức & cập nhật ngắn',
    storiesHead: 'Ghi chép thực địa & phòng lab'
  }
};

const en = {
  brand: { tag: 'Clean-roast coffee house & roastery' },
  nav: {
    label: 'Primary navigation',
    home: 'Home',
    products: 'Products',
    culture: 'Coffee Culture',
    business: 'Business Solutions',
    sustain: 'Sustainability',
    journal: 'Journal',
    quiz: 'Taste Quiz',
    menu: 'Café Menu',
    booking: 'Book a Table',
    story: 'Bean Story',
    space: 'Spaces',
    admin: 'Admin / POS',
    hotline: 'Bookings & Wholesale',
    orderNow: 'Order Drink',
    menuOpen: 'Index',
    menuClose: 'Close',
    drawerHouse: 'The House of An Roastery',
    drawerExplore: 'Editorial & Store',
    drawerVisit: 'Visit & Operations'
  },
  switcher: { label: 'Choose language' },
  story: {
    eyebrow: 'Cau Dat Harvest · Small-Batch Roastery',
    reelTag: 'Reel',
    cue: 'Scroll to follow the bean from hill to cup',
    viewMenu: 'View the menu',
    book: 'Book a table',
    railLabel: 'Stages of the journey',
    chapters: {
      doi: {
        label: 'Cau Dat Highlands',
        body: 'Every cup at our bar begins with a branch of ripe red cherries on the hills of Cau Dat, Lam Dong.',
        unit: 'm',
        caption: 'Coffee farm altitude'
      },
      qua: {
        label: 'Ripe Cherries',
        heading: ['Hand-picking only', 'fully ripe cherries'],
        body: 'Each cherry is picked by hand. Split one open and you will find two beans resting in sweet fruit pulp.',
        unit: 'beans',
        caption: 'Inside every coffee cherry'
      },
      rang: {
        label: 'Roasting',
        heading: ['Roasted in small', 'batches under 5 kg'],
        body: 'Green beans tumble evenly in the drum while the roaster watches the heat curve up to first crack.',
        unit: '°C',
        caption: 'Temperature inside the drum'
      },
      'ra-lo': {
        label: 'Off the Roast',
        heading: ['Fresh off the roast,', 'cooled at once'],
        body: 'Beans leave the drum the moment the roast is right and are fan-cooled fast to lock in fruit and honey notes.',
        unit: '°C',
        caption: 'Beans cooling on the tray'
      },
      xay: {
        label: 'Grinding',
        heading: ['Ground fresh', 'for every brew'],
        body: 'We never pre-grind. Beans meet the grinder only when an order comes in, so the oils stay in the grounds.',
        unit: 'µm',
        caption: 'Grind size for espresso'
      },
      nen: {
        label: 'Dosing',
        heading: ['18 grams,', 'tamped perfectly flat'],
        body: 'Grounds are weighed for every shot and tamped with even pressure, so water flows through the puck without channelling.',
        unit: 'g',
        caption: 'Grounds in a single shot'
      },
      chiet: {
        label: 'Extraction',
        heading: ['Nine bars,', 'twenty-eight seconds'],
        body: 'Espresso runs in a glossy stream under a hazelnut crema. Come by the bar and watch it happen.',
        unit: 'sec',
        caption: 'Extraction at 9 bar pressure'
      }
    }
  },
  home: {
    catalog: {
      head: 'Roastery pantry for your morning ritual',
      sub: 'Browse by how you brew at home — every bag leaves the roastery only after proper post-roast resting.',
      viewAll: 'Open full catalog (15 items)',
      roastLabel: 'Roast',
      intensityLabel: 'Intensity',
      acidityLabel: 'Acidity',
      brewLabel: 'Recommended brew',
      selectAria: 'Inspect {name}'
    },
    cycle: {
      head: 'The journey of coffee',
      sub: 'Coffee begins at the origin, finds its soul in the drum, its poise in the blend, and its truth on the cupping table.',
      cta: 'Explore Coffee Culture in full'
    },
    quiz: {
      head: 'What is your coffee profile?',
      sub: 'Three quick sensory prompts from our cupping table to match your home bag and the drink waiting for you at our bar.',
      resultHeading: 'Your matched profile',
      homeBagLabel: 'Take home bag',
      barDrinkLabel: 'Order at our bar',
      brewGuideLabel: 'Starting recipe',
      resetBtn: 'Start over',
      shopCta: 'View in Products'
    },
    journalPreview: {
      head: 'The Coffee Journal',
      sub: 'Field notes on harvest timing, grind-size trials, and the growers behind every cup.',
      allLink: 'Read the full Journal',
      readLink: 'Read dispatch'
    },
    b2bBanner: {
      head: 'Coffee & equipment solutions for cafés, dining and offices',
      body: 'Weekly roasted lots in zero-waste 5 kg returnable tubs, commercial espresso hardware, and hands-on barista calibration.',
      cta: 'Explore Business Solutions',
      statA: 'From 10 kg/month',
      statB: '7-day technical care'
    },
    pillars: {
      head: 'Three things we do every day',
      sub: 'Order in seconds, watch your drink being made, and catch pastries fresh from the oven twice a day.',
      items: [
        {
          title: 'QR ordering at the table',
          body: 'Scan the code, tune ice, sweetness or oat milk, and pay by VietQR or card in about half a minute.',
          meta: 'Less time waiting to order'
        },
        {
          title: 'An open brew bar',
          body: 'Sit across from the barista: V60 pour-overs, 24-hour cold brew and a Synesso espresso machine.',
          meta: 'Watch the craft up close'
        },
        {
          title: 'A French-butter bakery',
          body: 'Croissants and sourdough baked at 07:30 and 14:00 with Bret butter.',
          meta: 'A fresh batch every shift'
        }
      ]
    },
    menu: {
      head: 'Best-selling bar signatures',
      link: 'Book a table to enjoy them in store',
      addAria: 'Add {name}',
      items: [
        {
          name: 'Hue-Style Salted Coffee',
          desc: 'Silky sea-salt cream over a bold, clean-roasted Robusta base.',
          price: '₫45,000'
        },
        {
          name: 'Orange Cold Brew',
          desc: 'Cau Dat Arabica cold-steeped for 24 hours, brightened with fresh orange.',
          price: '₫52,000'
        },
        {
          name: 'Three-Layer Bac Xiu',
          desc: 'Condensed milk, Dalatmilk fresh milk and a dense, glossy espresso.',
          price: '₫42,000'
        },
        {
          name: 'Peach Orange Lemongrass Tea',
          desc: 'Cold-brewed black tea with fresh peach and bruised lemongrass.',
          price: '₫48,000'
        },
        {
          name: 'French Butter Croissant',
          desc: 'A shattering thousand-layer crust with a soft, Bret-butter heart.',
          price: '₫38,000'
        }
      ]
    },
    story: {
      head: 'Four promises from farm to cup',
      lede: 'A great cup needs no flavourings. Its value lies in ripe fruit, careful processing and the roaster’s craft.',
      imgFarmAlt: 'A Cau Dat coffee farm in early morning mist',
      imgRoastAlt: 'Freshly roasted beans cooling on a tray',
      noteAlt: 'Cau Dat & Bao Loc, Lam Dong',
      noteRoast: 'Every batch tracked on a roast curve',
      items: [
        { title: 'Hand-picked at peak ripeness', body: 'Only evenly red cherries are selected, maximising the natural sugars inside the bean.' },
        { title: 'Honey & natural processing', body: 'Dried on airy greenhouse beds that preserve floral, fruity and honeyed notes.' },
        { title: 'Small-batch craft roasting', body: 'Micro-batches under 5 kg per roast keep every lot’s flavour under control.' },
        { title: 'SCA-standard cupping', body: 'Every lot is tasted and scored before it is ever served at the bar.' }
      ]
    },
    sustain: {
      titleA: 'From the hills of Cau Dat',
      titleEm: 'to',
      titleB: 'the cup in your hand',
      sub: 'Sustainability at An Roastery is not a slogan on the wall. It is how we buy beans, how our partner farms are tended, and how every shift uses just enough of everything.',
      fullReportLink: 'Read full Sustainability report & rare micro-lots',
      statsAria: 'Sustainability figures',
      stats: [
        { value: 42, suffix: '', label: 'partner farming households across Lam Dong & Son La' },
        { value: 1650, suffix: ' m', label: 'average altitude of our coffee gardens' },
        { value: 92, suffix: '%', label: 'of cherries hand-picked fully red' },
        { value: 14, suffix: '', label: 'days at most from roast day to the bar' }
      ],
      chapters: [
        {
          index: '01 / 03',
          title: 'The growers',
          heading: 'Value starts with the hands that pick',
          body: 'An Roastery buys directly from partner households and pays above market price for hand-selected ripe cherries. The buying calendar is fixed before harvest, so farmers can tend their gardens with confidence instead of chasing volume.'
        },
        {
          index: '02 / 03',
          title: 'Soil & gardens',
          heading: 'Farming gently on hill soil',
          body: 'Partner gardens keep their shade trees, limit herbicides and compost coffee husks on site as organic fertiliser. Healthy soil grows healthy trees — and the flavour in the cup is the final result of that chain.'
        },
        {
          index: '03 / 03',
          title: 'The bar',
          heading: 'Less waste in every shift',
          body: 'Spent grounds are collected for urban vegetable gardens, milk is portioned per shift to expected demand, and end-of-day pastries are discounted instead of binned. Small cafés doing their part, steadily, every day.'
        }
      ],
      band: {
        title: 'Greenhouse drying beds',
        caption: 'Where beans spend 30 slow days before travelling to the roastery.',
        alt: 'Coffee drying beds on the Cau Dat hills'
      },
      journeyHead: 'The journey of a single bean',
      journeySub: 'Four stages, one harvest — at the same pace we have kept since day one.',
      journey: [
        { phase: 'Phase I', when: 'Nov – Feb', title: 'Selective picking', body: 'Only ripe red cherries are picked, over several passes in one season, so nothing is ever harvested green.' },
        { phase: 'Phase II', when: '30 days', title: 'Processing & raised-bed drying', body: 'Honey and natural lots dry on greenhouse beds, turned by hand until the bean moisture stabilises.' },
        { phase: 'Phase III', when: 'Day 0', title: 'Small-batch roasting', body: 'Every batch under 5 kg on a Giesen W6A, with the roast curve logged for comparison.' },
        { phase: 'Phase IV', when: 'Days 2 – 14', title: 'To the bar', body: 'Beans rest just long enough after roasting before grinding and brewing — the window where flavour is roundest.' }
      ]
    },
    book: {
      head: 'Table bookings & Saturday cuppings',
      sub: 'Reserve a quiet work corner, a balcony seat, or join a Saturday-morning cupping with our roaster.',
      perks: [
        'Held for up to 30 minutes, free of charge',
        'Power outlets, long oak desks and stable wifi',
        'A French-butter cookie with every online booking'
      ],
      branch: 'Location',
      date: 'Date',
      time: 'Time slot',
      guests: 'Guests',
      area: 'Area',
      name: 'Full name',
      phone: 'Phone number',
      namePlaceholder: 'Nguyen Van An',
      phonePlaceholder: '0901 234 567',
      guestsOptions: ['1 guest', '2 guests', '3 – 5 guests', '6 – 12 guests'],
      areaOptions: ['Quiet hall', 'Outdoor balcony', 'Open brew bar / Cupping', 'Work desk with outlets'],
      submit: 'Hold my table — free',
      success: 'Received. We will call to confirm within a few minutes.'
    },
    space: {
      head: 'A space in the middle of the city',
      sub: 'Oak wood, polished concrete and the smell of a fresh roast — a seat for working or for reading.',
      gallery: [
        { caption: 'Long tables & natural light', alt: 'A long work table under large bright windows' },
        { caption: 'The reading corner', alt: 'A reading corner with a leather chair and bookshelves' },
        { caption: 'The outdoor balcony', alt: 'An outdoor balcony under the trees' }
      ],
      quote: '“The salted coffee is honestly roasted, never oily or harsh. Table QR ordering runs smoothly — order placed, drink on its way.”',
      quoteBy: 'Hoang Minh Quan · regular at the Tan Binh location'
    },
    staff: {
      label: 'For An Roastery floor staff and shift leads',
      links: ['Cashier POS', 'Kitchen KDS', 'Dashboard', 'Floor Tables']
    }
  },
  footer: {
    tagline: 'Clean SCA-standard roasting, handcrafted brewing and unhurried spaces in the heart of the city.',
    exploreTitle: 'House & Store',
    hoursTitle: 'Opening hours',
    hours: [
      { label: 'Monday – Friday', value: '06:30 – 22:30' },
      { label: 'Saturday – Sunday', value: '07:00 – 23:00' },
      { label: 'Public cupping', value: 'Sat · 09:30' }
    ],
    branchesTitle: 'Cafés & Roastery',
    contactTitle: 'Contact',
    bookingLine: 'Reservations: 1900 6886',
    b2bLine: 'Wholesale: b2b@anroastery.vn',
    emailLine: 'Email: hello@anroastery.vn',
    privacy: 'Privacy policy',
    terms: 'Terms'
  },
  products: {
    meta: 'Tan Binh Roastery · Nationwide dispatch',
    title: 'Coffee at home, packed from this week’s roast',
    lede: 'Fifteen whole-bean origins, grind-calibrated tins, nitrogen-flushed drip bags, morning-bottled cold brews, and the stoneware and steel tools our baristas work with daily.',
    all: 'All ranges',
    subfilterLabel: 'Filter by origin:',
    subfilters: {
      all: 'All origins',
      'cau-dat': 'Cau Dat · 1,650 m',
      highlands: 'Bao Loc & Highlands',
      'son-la': 'Son La Northwest',
      blend: 'House blends'
    },
    add: 'Add to bag',
    added: 'In bag',
    addAria: 'Add {name} to bag',
    inspect: 'Brew specs',
    hideInspect: 'Collapse',
    roast: 'Roast',
    intensity: 'Intensity',
    acidity: 'Acidity',
    body: 'Body',
    bagSummary: '{count} items selected · {total}',
    bagClear: 'Clear',
    bagCheckoutNote: 'Call 1900 6886 or pick up at any bar within 2 hours',
    note: 'Complimentary courier delivery in Ho Chi Minh City and Hanoi on orders from ₫300,000. Every coffee bag carries its roast date, lot code, and hamlet origin.',
    quizPromptTitle: 'Torn between floral highland Arabica and syrupy clean-roast Robusta?',
    quizPromptCta: 'Take the 30-second Taste Profile Quiz',
    categories: {
      bean: { label: 'Whole Bean', blurb: 'For home grinders — keeping volatile oils intact until the moment you brew.' },
      ground: { label: 'Ground', blurb: 'Milled on low-RPM flat burrs for phin filters, stovetop Moka pots, or paper cones.' },
      drip: { label: 'Drip Bags', blurb: 'Nitrogen-flushed 12–14 g single-serve filters that perch over any mug at work or on the road.' },
      rtd: { label: 'Bottled Cold', blurb: 'Cold-steeped and bottled in glass every morning at the bar, with a ₫5,000 bottle return credit.' },
      gear: { label: 'Brewing Gear', blurb: 'Heavy-gauge steel phin filters, high-fired stoneware drippers, and ash-glazed village cups.' }
    }
  },
  culture: {
    meta: 'Monograph & Brewing Craft',
    title: 'The living craft behind an unhurried cup',
    lede: 'From wild Kaffa forest shrubs to a stainless phin tapping softly on a Saigon wooden table — coffee endures because people, science, and daily ritual gather around it.',
    nav: {
      cycle: 'The Coffee Cycle',
      origins: 'Chronology',
      phin: 'Phin & Heritage',
      lab: 'Sensory Lab & Academy',
      guides: 'Home Recipes'
    },
    origins: {
      title: 'Origins: how one seed crossed half the globe',
      body: [
        'Legend recalls a ninth-century goatherd in Ethiopia’s Kaffa forests noticing his flock wide awake after nibbling crimson berries. Carried across the Red Sea to Yemen’s port of Mocha, roasted over iron pans in Sufi courtyards, and debated over in Venice and London coffee houses, the seed adapted wherever it landed.',
        'Coffee trees first took root in Vietnam in 1857 before finding their true home in the misty granite hills of Cau Dat and the basalt plateaus of the Central Highlands. Over sixteen decades later, Vietnam shaped its own unmistakable coffee grammar: patient, full-bodied, and meant to be shared.'
      ]
    },
    timelineTitle: 'Seven milestones from highland shrub to specialty bar',
    timeline: [
      { year: '9th c.', title: 'Kaffa Highlands, Ethiopia', body: 'Wild Arabica thrives under forest canopy; ripe fruit is crushed for long mountain journeys before ever becoming a hot brew.' },
      { year: '15th c.', title: 'Port of Mocha & Yemen', body: 'Pan-roasting and hot infusion give birth to the first public coffee houses for music, chess, and conversation.' },
      { year: '17th c.', title: 'Venice, London & Paris', body: 'European cafés become gathering rooms for writers, scientists, and the earliest printed broadsheets.' },
      { year: '1857', title: 'First trees in Vietnam', body: 'Early Arabica groves in northern and central provinces begin Vietnam’s 165-year cultivation story.' },
      { year: '1920s', title: 'Cau Dat mist & basalt plateaus', body: 'High-altitude Bourbon flourishes at 1,500 m in Da Lat while Dak Lak and Bao Loc become Robusta heartlands.' },
      { year: '1940s', title: 'Saigon iced milk & Hanoi egg coffee', body: 'Around the slow-dripping phin, Vietnamese cafés invent two enduring icons of global coffee culture.' },
      { year: 'Today', title: 'Clean-roast & Vietnamese Specialty', body: 'Smallholders and independent roasters champion 100% ripe picking, transparent micro-lots, and zero-additive roasting.' }
    ],
    phin: {
      title: 'The phin ritual & two classics in glass',
      body: [
        'A phin refuses to be hurried. Water at 96°C wets the bed for a thirty-second bloom before dark drops fall steadily onto condensed milk — five quiet minutes to set your phone face-down and watch the street wake up.',
        'Out of that dense, clean-roasted base grew two beloved traditions: Saigon’s tall glass of cà phê sữa đá clinking with ice in tropical heat, and Hanoi’s autumn bowl of egg coffee crowned with golden whisked yolk foam.'
      ],
      imgAlt: 'A stainless phin dripping coffee slowly',
      imgCaption: '170 ml steel phin, 25 g clean-roasted grounds, 5m 15s gravity extraction.',
      eggCaption: 'Hanoi-style egg coffee whisked with wildflower honey, kept warm in a hot-water bath.'
    },
    lab: {
      title: 'Sensory Lab & Saturday Barista Table',
      lede: 'Inspired by European coffee science centres yet welcoming as an open neighbourhood kitchen — where growers, roasters, and guests taste side by side.',
      leftTitle: 'Roast Profiling & Quality Lab',
      leftBody: 'Equipped with an Ikawa 100 g sample roaster, Agtron roast color meter, and digital TDS refractometers. Every incoming green lot runs three test curves before entering production.',
      leftMeta: '100% incoming lot verification',
      rightTitle: 'Open Saturday Cupping & Pour-Over Class',
      rightBody: 'Every Saturday at 09:30 at our District 3 bar (8 seats per table), baristas guide guests through four Vietnamese terroirs alongside hands-on V60 and phin calibration.',
      rightMeta: 'Complimentary with advance reservation',
      bookCta: 'Reserve a Saturday seat'
    },
    guides: {
      title: 'Three foundational recipes for home brewing',
      sub: 'The exact starting ratios our baristas memorise in week one. Dial these in first, then adjust to your own morning palate.',
      ratioLabel: 'Dose & water',
      tempLabel: 'Water temp',
      timeLabel: 'Total time',
      items: [
        { name: 'Traditional Phin', ratio: '25 g coffee : 95 ml water', temp: '95 – 96°C', time: '5 – 6 minutes', body: 'Warm the steel filter first. Level the bed, bloom with 20 ml for 30 seconds, rest the gravity damper gently, and pour the remaining 75 ml.' },
        { name: 'V60 Pour-Over', ratio: '15 g coffee : 240 ml water', temp: '91 – 93°C', time: '2m 45s', body: 'Grind to sea-salt coarseness. Bloom with 45 g for 40 seconds, then pour in two slow concentric spirals keeping off the paper walls.' },
        { name: '24-Hour Cold Steep', ratio: '50 g coffee : 500 ml cool water', temp: '4°C chilled', time: '20 – 24 hours', body: 'Grind coarse like cracked pepper, steep sealed in the fridge, and strain through a rinsed paper filter for five days of sweet, low-acid coffee.' }
      ]
    },
    closing: {
      quote: '“Good coffee does not make the day longer, only the first fifteen minutes worth keeping.”',
      by: '— An Roastery Roasters',
      shopCta: 'Choose beans for home'
    }
  },
  business: {
    meta: 'Wholesale roasting, commercial hardware & barista training',
    title: 'Cultivating coffee solutions for cafés, dining rooms and offices',
    lede: 'From a 25-seat neighbourhood bar to boutique hotels and 200-person studios: we roast to weekly order, install dependable espresso hardware, and stand behind your bar team seven days a week.',
    ctaPrimary: 'Request a 4-lot tasting box',
    ctaSecondary: 'Wholesale desk: 1900 6886',
    linesHead: 'Four weekly-roasted supply programmes',
    linesSub: 'Select your service format to inspect packaging, cup yields, and dispatch cadence.',
    machinesHead: 'Commercial espresso & brewing hardware',
    machinesSub: 'Workhorse machines proven across tens of thousands of shifts behind our own bars.',
    machineFilterAll: 'All equipment',
    servicesHead: 'Four operational commitments with every supply agreement',
    services: [
      { num: '01', title: 'Roasted weekly to your bar’s pace', body: 'Never warehoused stock. Lots roast on Fridays, rest over the weekend, and arrive Monday morning in peak extraction window.' },
      { num: '02', title: 'Hands-on barista & dial-in training', body: 'On-site calibration at your counter: adjusting burrs for monsoon humidity, micro-foam milk texture, and daily backflush care.' },
      { num: '03', title: '4-hour city technical response', body: 'Dedicated technicians in Ho Chi Minh City and Hanoi handle pressure drift, group gaskets, and loaner grinders mid-shift.' },
      { num: '04', title: 'Brew-water mineral testing', body: 'Complimentary hardness, alkalinity, and TDS profiling prior to installation to protect boilers and cup sweetness.' }
    ],
    formHead: 'Request wholesale pricing & a complimentary sample kit',
    formSub: 'Share a few details about your venue — our roastery and equipment lead will reach out the same working day.',
    fields: {
      company: 'Café or company name',
      companyPh: 'e.g. Autumn Coffee Bar / Studio Minh',
      contact: 'Contact person',
      contactPh: 'Tran Minh Khoi',
      phone: 'Phone number',
      phonePh: '0903 456 789',
      segment: 'Venue type',
      segments: ['Independent café', 'Restaurant / Boutique hotel', 'Corporate office / Studio', 'Multi-site group / Retailer'],
      volume: 'Estimated monthly volume',
      volumes: ['10 – 25 kg / month', '25 – 60 kg / month', '60+ kg / month', 'Full machine + bean package'],
      notes: 'Current machine setup or flavour direction',
      notesPh: 'e.g. Running a 2-group machine, looking for a chocolate-forward milk espresso...',
      submit: 'Request sample box & consultation',
      success: 'Inquiry logged. Our B2B roastery desk will call today to confirm delivery of your tasting kit.'
    }
  },
  sustainabilityPage: {
    meta: 'Positive impact from highland soil to spent grounds',
    title: 'Sustainability grown through honest farmgate pricing',
    lede: 'Ecological coffee cannot exist if farming families are paid below the cost of tending soil. Our commitments begin with pre-harvest forward contracts and close in circular reuse behind every café bar.',
    pillarsHead: 'Three evergreen pillars of our work',
    microHead: 'Rare smallholder micro-lots preserving heirloom trees',
    microSub: 'Tiny parcels under two hectares farmed beneath fruit-tree shade, milled and roasted separately to honour each grower by name.',
    tastingLabel: 'Four sensory markers logged at the cupping table',
    circularHead: 'Circular economy: nothing discarded while value remains',
    circularSub: 'From roaster silverskin to evening espresso pucks — every byproduct enters a second useful life.',
    roadmapHead: 'Climate resilience & low-waste roadmap, 2020 – 2028',
    roadmap: [
      { period: '2020 – 2022', phase: 'Phase I', title: 'Direct farmgate forward contracts', body: 'Built our first 18-household grower circle in Cau Dat and Bao Loc with locked +22% premiums for >90% ripe red harvests.' },
      { period: '2022 – 2024', phase: 'Phase II', title: 'Agroforestry shade & husk composting', body: 'Interplanted 1,400+ persimmon, macadamia, and shade trees while composting cherry pulp on site to halve synthetic fertiliser use.' },
      { period: '2024 – 2026', phase: 'Phase III', title: 'Zero-landfill pucks & returnable wholesale tubs', body: 'Diverted 100% of café coffee grounds to mushroom farms and launched reusable 5 kg stainless tubs for wholesale partners.' },
      { period: '2026 – 2028', phase: 'Phase IV · In progress', title: 'Drought-hardy Liberica & solar roastery roof', body: 'Propagating deep-rooted Liberica windbreaks in central highlands and transitioning 60% of roastery electricity to rooftop solar.' }
    ]
  },
  journal: {
    meta: 'People, harvests, craft & dispatches around the cup',
    title: 'The Coffee Journal',
    lede: 'Field notes, grind-lab experiments, and quiet stories recorded by our roasters, baristas, and farming partners.',
    categories: {
      all: 'All dispatches',
      harvest: 'Harvest & Origins',
      craft: 'Roast & Brew Craft',
      community: 'Community',
      press: 'Roastery Press'
    },
    leadBadge: 'Lead story',
    readArticle: 'Read full story',
    closeArticle: 'Close reader',
    ledgerHead: 'Roastery press & short dispatches',
    storiesHead: 'Field & lab stories'
  }
};

const DICT = {
  vi: { ...vi, ops: opsVi },
  en: { ...en, ops: opsEn }
};

const LanguageContext = createContext({
  lang: 'vi',
  setLang: () => {},
  t: (path) => path,
  tf: (path) => path,
  trData: (val) => val,
  money: (val) => moneyVnd(val, 'vi'),
  when: (val) => whenLocale(val, 'vi'),
  clock: (val) => clockLocale(val, 'vi')
});

function resolve(dict, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), dict);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('site-lang');
      return saved === 'en' || saved === 'vi' ? saved : 'vi';
    } catch {
      return 'vi';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('site-lang', lang);
    } catch {
      /* private mode — ignore */
    }
    document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
  }, [lang]);

  const value = useMemo(() => {
    const t = (path) => {
      const hit = resolve(DICT[lang], path);
      return hit !== undefined ? hit : resolve(DICT.vi, path);
    };
    return {
      lang,
      setLang,
      t,
      tf: (path, vars) => formatTemplate(t(path), vars),
      trData: (val) => translateData(val, lang),
      money: (val) => moneyVnd(val, lang),
      when: (val) => whenLocale(val, lang),
      clock: (val) => clockLocale(val, lang)
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}

/** Định dạng giá VND theo ngôn ngữ hiện tại: 195.000₫ / ₫195,000. */
export function formatPrice(amount, lang) {
  const formatted = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', {
    maximumFractionDigits: 0
  }).format(amount);
  return lang === 'vi' ? `${formatted}₫` : `₫${formatted}`;
}
