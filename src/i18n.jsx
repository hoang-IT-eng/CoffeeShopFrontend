import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Song ngữ VI/EN cho toàn bộ mặt tiền khách hàng (landing, sản phẩm, văn hóa).
 * Ngôn ngữ lưu ở localStorage "site-lang", mặc định "vi".
 * t('nav.products') tra theo đường dẫn chấm; giá trị có thể là chuỗi, mảng hoặc object.
 */

const vi = {
  brand: { tag: 'Cà phê đặc sản & bếp bánh' },
  nav: {
    label: 'Điều hướng trang chủ',
    home: 'Trang chủ',
    menu: 'Thực đơn',
    booking: 'Đặt bàn',
    story: 'Câu chuyện hạt',
    sustain: 'Bền vững',
    space: 'Không gian',
    products: 'Sản phẩm',
    culture: 'Văn hóa cà phê',
    admin: 'Quản trị / POS',
    hotline: 'Hotline',
    orderNow: 'Gọi món'
  },
  switcher: { label: 'Chọn ngôn ngữ' },
  story: {
    cue: 'Cuộn xuống để xem hạt đi từ đồi tới tách',
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
      head: 'Signature đang bán chạy',
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
      statsAria: 'Con số bền vững',
      stats: [
        { value: 42, suffix: '', label: 'hộ nông liên kết tại Cầu Đất & Bảo Lộc' },
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
      head: 'Đặt bàn và workshop cà phê',
      sub: 'Giữ chỗ làm việc yên tĩnh, góc ban công, hoặc đăng ký cupping cùng master roaster sáng thứ Bảy.',
      perks: [
        'Giữ chỗ trước đến 30 phút, không phụ phí',
        'Ổ cắm, bàn làm việc và wifi ổn định',
        'Một cookie bơ Pháp khi đặt trước online'
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
      areaOptions: ['Sảnh yên tĩnh', 'Ban công ngoài trời', 'Gần quầy bar', 'Bàn làm việc có ổ cắm'],
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
      quoteBy: 'Hoàng Minh Quân · khách thường xuyên chi nhánh Tân Bình'
    },
    staff: {
      label: 'Dành cho nhân viên và quản trị An Roastery',
      links: ['POS thu ngân', 'KDS bếp', 'Dashboard', 'Waiter app']
    }
  },
  footer: {
    tagline: 'Rang mộc chuẩn SCA, pha chế thủ công và không gian thưởng thức giữa đô thị.',
    hoursTitle: 'Giờ mở cửa',
    hours: [
      { label: 'Thứ 2 – Thứ 6', value: '06:30 – 22:30' },
      { label: 'Thứ 7 – Chủ nhật', value: '07:00 – 23:00' },
      { label: 'Kitchen / brunch', value: '07:30 – 14:00' }
    ],
    branchesTitle: 'Chi nhánh',
    contactTitle: 'Liên hệ',
    bookingLine: 'Đặt bàn: 1900 6886',
    emailLine: 'Email: hello@anroastery.vn',
    privacy: 'Chính sách bảo mật',
    terms: 'Điều khoản'
  },
  products: {
    kicker: 'Cửa hàng An Roastery',
    title: 'Mang hương vị quán về nhà',
    lede: 'Hạt rang mẻ nhỏ tại xưởng, đồ pha sẵn đóng chai mỗi sáng và dụng cụ pha chế mà chính barista của quán đang dùng mỗi ngày. Rang theo đơn — hạt chỉ vào lồng khi bạn đặt.',
    all: 'Tất cả',
    add: 'Thêm vào giỏ',
    added: 'Đã thêm',
    addAria: 'Thêm {name} vào giỏ',
    note: 'Đơn từ 300.000đ được miễn phí giao tại TP.HCM và Hà Nội. Hạt nguyên chất và rang xay luôn kèm ngày rang in trên bao bì.',
    categories: {
      bean: { label: 'Hạt nguyên chất', blurb: 'Nguyên hạt, rang mẻ nhỏ, nghỉ đủ ngày trước khi đóng gói.' },
      ground: { label: 'Rang xay', blurb: 'Xay theo đúng dụng cụ bạn dùng ở nhà — phin, espresso hay pour-over.' },
      rtd: { label: 'Pha sẵn', blurb: 'Đóng chai lạnh mỗi sáng tại quầy, giữ lạnh và dùng trong 5 ngày.' },
      gear: { label: 'Dụng cụ pha chế', blurb: 'Những món đồ bền, dễ dùng mà đội ngũ An Roastery tin tưởng.' }
    }
  },
  culture: {
    kicker: 'Tạp chí An Roastery',
    title: 'Văn hóa cà phê',
    lede: 'Từ cao nguyên Ethiopia đến ly phin chậm rãi trên vỉa hè Sài Gòn — cà phê chưa bao giờ chỉ là một thức uống. Đây là nơi quán ghi lại những câu chuyện, nghi thức và kỹ thuật làm nên một tách cà phê tử tế.',
    chaptersLabel: 'Các chương',
    origins: {
      index: 'Chương 01',
      title: 'Khởi nguồn: hạt cà phê đi nửa vòng trái đất',
      body: [
        'Truyền thuyết kể rằng vào thế kỷ 9, người chăn dê Kaldi ở vùng Kaffa (Ethiopia) nhận ra đàn dê của mình tỉnh táo lạ thường sau khi ăn quả đỏ của một loài cây lạ. Dù đúng hay không, Kaffa vẫn được xem là quê hương của cây cà phê arabica — nơi những hạt đầu tiên được rang, giã và pha như một thứ nước tăng lực cho những đêm cầu nguyện dài.',
        'Từ Ethiopia, cà phê theo chân thương nhân qua Yemen, trở thành thức uống của các quán qahveh khaneh ở Mecca và Istanbul, rồi cập bến Venice và lan khắp châu Âu. Mỗi nơi nó dừng chân, cà phê lại khoác một hình hài mới: espresso chớp nhoáng của Ý, café crème thong thả của Pháp — và sau này là phin nhỏ giọt của Việt Nam.'
      ]
    },
    timelineTitle: 'Dòng thời gian của một hạt',
    timeline: [
      { year: 'Thế kỷ 9', title: 'Kaffa, Ethiopia', body: 'Cây cà phê arabica mọc hoang trên cao nguyên; hạt được dùng như thức ăn tăng lực trước khi trở thành đồ uống.' },
      { year: 'Thế kỷ 15', title: 'Yemen & thế giới Hồi giáo', body: 'Cảng Mocha đưa cà phê ra thương mại. Quán cà phê đầu tiên xuất hiện — nơi người ta bàn chuyện, nghe nhạc và chơi cờ.' },
      { year: 'Thế kỷ 17', title: 'Châu Âu đón nhận', body: 'Từ Venice đến London và Paris, quán cà phê trở thành "trường học của những người khôn" — cái nôi của báo chí và khởi nghiệp.' },
      { year: '1857', title: 'Cà phê đến Việt Nam', body: 'Người Pháp đưa những cây arabica đầu tiên vào trồng tại miền Bắc, mở đầu hành trình hơn 165 năm của cà phê Việt.' },
      { year: 'Đầu thế kỷ 20', title: 'Phin ra đời trên đất Việt', body: 'Chiếc phin lọc kim loại nhỏ gọn trở thành biểu tượng: rẻ, bền và cho ra thứ cà phê đậm sánh đúng khẩu vị người Việt.' },
      { year: 'Thập niên 1980', title: 'Robusta phủ xanh Tây Nguyên', body: 'Đắk Lắk, Lâm Đồng trở thành thủ phủ robusta, đưa Việt Nam lên nhóm xuất khẩu cà phê lớn nhất thế giới.' },
      { year: 'Hôm nay', title: 'Làn sóng specialty', body: 'Một thế hệ nông hộ và thợ rang Việt Nam quay lại với chất lượng: hái chín, sơ chế tỉ mỉ, rang mẻ nhỏ — như cách An Roastery đang làm mỗi ngày.' }
    ],
    phin: {
      index: 'Chương 02',
      title: 'Nghi thức phin: nghệ thuật của sự chậm rãi',
      body: [
        'Phin không vội được. Nước sôi rót thành vòng tròn, bột nở bung như thở, rồi từng giọt rơi xuống lớp sữa đặc — khoảng năm phút cho một ly. Người Việt biến khoảng chờ ấy thành một nghi thức: ngắm phố, đọc báo, chờ đá tan. Chậm ở đây không phải thiếu sót; chậm chính là hương vị.',
        'Một phin ngon bắt đầu từ hạt robusta rang mộc xay vừa, lượng bột khoảng 25 gram cho phin 170 ml, nước 96°C và một lần "ủ nở" 30 giây trước khi rót đầy. Tại An Roastery, phin vẫn là món được gọi nhiều nhất mỗi sáng — dù quán có đủ máy móc hiện đại hơn nhiều.'
      ],
      imgAlt: 'Phin cà phê đang nhỏ giọt xuống ly sữa đặc',
      imgCaption: 'Phin 170 ml, 25 g bột, 5 phút chờ — công thức không đổi của quán.'
    },
    heritage: {
      index: 'Chương 03',
      title: 'Di sản trong ly: cà phê sữa đá & cà phê trứng',
      subA: 'Cà phê sữa đá',
      bodyA: 'Sữa đặc có đường đến Việt Nam từ thời sữa tươi còn là xa xỉ phẩm, và người Việt đã biến nó thành linh hồn của ly cà phê đá: đậm, ngọt, mát lạnh. Khuấy đều, chờ đá tan dần làm dịu vị gắt — ly cà phê thay đổi hương vị theo từng ngụm, như một câu chuyện có hồi kết chậm rãi.',
      subB: 'Cà phê trứng',
      bodyB: 'Sinh ra ở Hà Nội những năm 1940 khi sữa tươi khan hiếm, cà phê trứng đánh bông lòng đỏ với sữa đặc thành lớp kem vàng mịn phủ trên nền cà phê nóng. Nó là minh chứng đẹp nhất cho triết lý bếp Việt: thiếu thốn không ngăn được sáng tạo, và sự khéo léo có thể biến giới hạn thành di sản.',
      imgAlt: 'Ly cà phê trứng với lớp kem vàng mịn',
      imgCaption: 'Cà phê trứng — lớp kem lòng đỏ đánh bông, phục vụ trong chén nước ấm giữ nhiệt.'
    },
    guides: {
      index: 'Chương 04',
      title: 'Cẩm nang pha tại nhà',
      sub: 'Ba công thức nền tảng mà barista của quán dùng để huấn luyện nhân viên mới. Nắm vững tỉ lệ, phần còn lại là khẩu vị của riêng bạn.',
      items: [
        { name: 'Phin truyền thống', ratio: '25 g cà phê · 100 ml nước', temp: '96°C', time: '5 – 7 phút', body: 'Ủ nở 30 giây với 20 ml nước, nén nhẹ nắp gài, rót phần còn lại và chờ giọt cuối rơi hết trước khi khuấy với sữa đặc.' },
        { name: 'Pour-over V60', ratio: '15 g cà phê · 250 ml nước', temp: '92°C', time: 'khoảng 3 phút', body: 'Xay trung bình, rót nở 45 giây, sau đó rót xoáy đều tay. Vị sáng, rõ nốt hoa quả — hợp với arabica Cầu Đất sơ chế honey.' },
        { name: 'Cold brew ngâm lạnh', ratio: 'Tỉ lệ 1:10 · xay thô', temp: 'Nước lạnh / nhiệt độ phòng', time: '18 – 24 giờ', body: 'Ngâm trong bình kín, lọc qua giấy, bảo quản lạnh tối đa 5 ngày. Uống nguyên chất với đá hoặc thêm một lát cam vàng như món signature của quán.' }
      ],
      ratioLabel: 'Tỉ lệ',
      tempLabel: 'Nhiệt độ',
      timeLabel: 'Thời gian'
    },
    sustain: {
      index: 'Chương 05',
      title: 'Uống tử tế với đất và người trồng',
      body: 'Mỗi tách cà phê ngon đều bắt đầu từ một vườn khỏe và một nông hộ được trả công xứng đáng. Cách An Roastery mua hạt, sơ chế và giảm lãng phí tại quầy được kể chi tiết trong chương Bền vững ở trang chủ.',
      cta: 'Đọc chương Bền vững'
    },
    closing: {
      quote: '“Cà phê là cái cớ đẹp nhất để con người ngồi lại với nhau lâu hơn một chút.”',
      by: '— Đội ngũ An Roastery'
    }
  }
};

const en = {
  brand: { tag: 'Specialty coffee & kitchen' },
  nav: {
    label: 'Site navigation',
    home: 'Home',
    menu: 'Menu',
    booking: 'Book a table',
    story: 'Our bean story',
    sustain: 'Sustainability',
    space: 'The space',
    products: 'Products',
    culture: 'Coffee Culture',
    admin: 'Admin / POS',
    hotline: 'Hotline',
    orderNow: 'Order now'
  },
  switcher: { label: 'Choose language' },
  story: {
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
      head: 'Best-selling signatures',
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
      lede: 'A great cup needs no flavourings. Its value lies in ripe fruit, careful processing and the roaster\u2019s craft.',
      imgFarmAlt: 'A Cau Dat coffee farm in early morning mist',
      imgRoastAlt: 'Freshly roasted beans cooling on a tray',
      noteAlt: 'Cau Dat & Bao Loc, Lam Dong',
      noteRoast: 'Every batch tracked on a roast curve',
      items: [
        { title: 'Hand-picked at peak ripeness', body: 'Only evenly red cherries are selected, maximising the natural sugars inside the bean.' },
        { title: 'Honey & natural processing', body: 'Dried on airy greenhouse beds that preserve floral, fruity and honeyed notes.' },
        { title: 'Small-batch craft roasting', body: 'Micro-batches under 5 kg per roast keep every lot\u2019s flavour under control.' },
        { title: 'SCA-standard cupping', body: 'Every lot is tasted and scored before it is ever served at the bar.' }
      ]
    },
    sustain: {
      titleA: 'From the hills of Cau Dat',
      titleEm: 'to',
      titleB: 'the cup in your hand',
      sub: 'Sustainability at An Roastery is not a slogan on the wall. It is how we buy beans, how our partner farms are tended, and how every shift uses just enough of everything.',
      statsAria: 'Sustainability figures',
      stats: [
        { value: 42, suffix: '', label: 'partner farming households in Cau Dat & Bao Loc' },
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
      head: 'Table bookings & coffee workshops',
      sub: 'Reserve a quiet work corner, a balcony seat, or join a Saturday-morning cupping with our master roaster.',
      perks: [
        'Held for up to 30 minutes, free of charge',
        'Power outlets, work desks and stable wifi',
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
      areaOptions: ['Quiet hall', 'Outdoor balcony', 'Near the bar', 'Work desk with outlets'],
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
      quote: '\u201cThe salted coffee is honestly roasted, never oily or harsh. Table QR ordering runs smoothly — order placed, drink on its way.\u201d',
      quoteBy: 'Hoang Minh Quan · regular at the Tan Binh location'
    },
    staff: {
      label: 'For An Roastery staff and managers',
      links: ['Cashier POS', 'Kitchen KDS', 'Dashboard', 'Waiter app']
    }
  },
  footer: {
    tagline: 'Clean SCA-standard roasting, handcrafted brewing and a place to savour it all in the middle of the city.',
    hoursTitle: 'Opening hours',
    hours: [
      { label: 'Monday – Friday', value: '06:30 – 22:30' },
      { label: 'Saturday – Sunday', value: '07:00 – 23:00' },
      { label: 'Kitchen / brunch', value: '07:30 – 14:00' }
    ],
    branchesTitle: 'Locations',
    contactTitle: 'Contact',
    bookingLine: 'Reservations: 1900 6886',
    emailLine: 'Email: hello@anroastery.vn',
    privacy: 'Privacy policy',
    terms: 'Terms'
  },
  products: {
    kicker: 'The An Roastery Store',
    title: 'Take the café home with you',
    lede: 'Beans roasted in small batches at our roastery, drinks bottled fresh every morning, and the very brewing gear our baristas use each day. Roasted to order — beans only enter the drum once you check out.',
    all: 'All',
    add: 'Add to cart',
    added: 'Added',
    addAria: 'Add {name} to cart',
    note: 'Free delivery in Ho Chi Minh City and Hanoi on orders over ₫300,000. Whole-bean and ground coffee always carry the roast date printed on the bag.',
    categories: {
      bean: { label: 'Whole Bean', blurb: 'Whole beans, small-batch roasted and properly rested before packing.' },
      ground: { label: 'Ground', blurb: 'Ground for the brewer you actually use at home — phin, espresso or pour-over.' },
      rtd: { label: 'Ready-to-Drink', blurb: 'Bottled cold at the bar every morning; keep chilled and enjoy within 5 days.' },
      gear: { label: 'Brewing Gear', blurb: 'Durable, friendly tools the An Roastery team trusts daily.' }
    }
  },
  culture: {
    kicker: 'The An Roastery Journal',
    title: 'Coffee Culture',
    lede: 'From the Ethiopian highlands to a slow phin dripping on a Saigon sidewalk — coffee has never been just a drink. This is where we record the stories, rituals and techniques behind a properly made cup.',
    chaptersLabel: 'Chapters',
    origins: {
      index: 'Chapter 01',
      title: 'Origins: a bean that travelled half the world',
      body: [
        'Legend has it that in the 9th century, a goatherd named Kaldi in Ethiopia\u2019s Kaffa region noticed his goats unusually alert after eating the red fruit of a wild shrub. True or not, Kaffa is still regarded as the birthplace of arabica — where the first beans were roasted, crushed and brewed to keep long nights of prayer awake.',
        'From Ethiopia, coffee crossed to Yemen with traders, became the drink of qahveh khaneh coffee houses in Mecca and Istanbul, then landed in Venice and spread across Europe. Everywhere it stopped, coffee took a new shape: Italy\u2019s fleeting espresso, France\u2019s unhurried café crème — and later, Vietnam\u2019s slow-dripping phin.'
      ]
    },
    timelineTitle: 'A timeline of one bean',
    timeline: [
      { year: '9th century', title: 'Kaffa, Ethiopia', body: 'Arabica grows wild on the highlands; the beans are eaten for energy long before they are ever brewed.' },
      { year: '15th century', title: 'Yemen & the Muslim world', body: 'The port of Mocha takes coffee to market. The first coffee houses open — places for conversation, music and chess.' },
      { year: '17th century', title: 'Europe takes to coffee', body: 'From Venice to London and Paris, coffee houses become "schools of the wise" — cradles of journalism and start-ups alike.' },
      { year: '1857', title: 'Coffee reaches Vietnam', body: 'The French plant the first arabica trees in the north, beginning coffee\u2019s 165-year journey in Vietnam.' },
      { year: 'Early 20th century', title: 'The phin is born in Vietnam', body: 'The small metal drip filter becomes an icon: cheap, durable, and yielding the dense, bold cup Vietnamese drinkers love.' },
      { year: '1980s', title: 'Robusta greens the Central Highlands', body: 'Dak Lak and Lam Dong become robusta heartlands, lifting Vietnam into the world\u2019s top coffee exporters.' },
      { year: 'Today', title: 'The specialty wave', body: 'A new generation of Vietnamese farmers and roasters returns to quality: ripe picking, careful processing, small batches — exactly how An Roastery works every day.' }
    ],
    phin: {
      index: 'Chapter 02',
      title: 'The phin ritual: the art of taking it slow',
      body: [
        'A phin cannot be rushed. Hot water is poured in a slow circle, the grounds bloom like a breath, then drop by drop the coffee falls onto condensed milk — about five minutes a glass. Vietnamese drinkers turned that wait into a ritual: watch the street, read the paper, let the ice melt. Here, slow is not a flaw; slow is the flavour.',
        'A great phin starts with clean-roasted robusta ground medium-fine, about 25 grams for a 170 ml filter, water at 96°C and a 30-second bloom before the full pour. At An Roastery the phin is still our most-ordered drink every morning — despite all the far fancier machines behind the bar.'
      ],
      imgAlt: 'A phin filter dripping coffee into a glass of condensed milk',
      imgCaption: 'A 170 ml phin, 25 g of grounds, five patient minutes — the house formula, unchanged.'
    },
    heritage: {
      index: 'Chapter 03',
      title: 'Heritage in the glass: iced milk coffee & egg coffee',
      subA: 'Iced coffee with condensed milk',
      bodyA: 'Condensed milk arrived when fresh milk was still a luxury, and Vietnam turned it into the soul of cà phê sữa đá: bold, sweet and ice-cold. Stir, then let the melting ice soften the edges — the cup changes flavour with every sip, like a story with a slow ending.',
      subB: 'Egg coffee',
      bodyB: 'Born in 1940s Hanoi when fresh milk was scarce, egg coffee whisks yolk with condensed milk into a golden, cloud-like cream over hot coffee. It is the finest proof of a Vietnamese kitchen philosophy: scarcity never stopped creativity, and ingenuity can turn a limitation into heritage.',
      imgAlt: 'An egg coffee with its silky golden foam',
      imgCaption: 'Egg coffee — whipped yolk cream, served in a warm-water bowl to keep its heat.'
    },
    guides: {
      index: 'Chapter 04',
      title: 'Home brewing guides',
      sub: 'Three foundation recipes our baristas use to train every new hire. Master the ratios; the rest is your own palate.',
      items: [
        { name: 'Classic phin', ratio: '25 g coffee · 100 ml water', temp: '96°C', time: '5 – 7 minutes', body: 'Bloom for 30 seconds with 20 ml of water, seat the press gently, pour the rest and wait for the last drop before stirring into condensed milk.' },
        { name: 'V60 pour-over', ratio: '15 g coffee · 250 ml water', temp: '92°C', time: 'about 3 minutes', body: 'Medium grind, a 45-second bloom, then slow spiral pours. Bright and floral — made for honey-processed Cau Dat arabica.' },
        { name: 'Cold brew', ratio: '1:10 ratio · coarse grind', temp: 'Cold / room temperature', time: '18 – 24 hours', body: 'Steep in a sealed jar, filter through paper, keep chilled for up to 5 days. Drink neat over ice, or with a slice of orange like our signature.' }
      ],
      ratioLabel: 'Ratio',
      tempLabel: 'Temperature',
      timeLabel: 'Time'
    },
    sustain: {
      index: 'Chapter 05',
      title: 'Drinking kindly — for soil and growers',
      body: 'Every good cup starts with a healthy garden and a fairly paid farmer. How An Roastery buys, processes and cuts waste at the bar is told in full in the Sustainability chapter on our homepage.',
      cta: 'Read the Sustainability chapter'
    },
    closing: {
      quote: '\u201cCoffee is the finest excuse for people to sit together a little longer.\u201d',
      by: '— The An Roastery team'
    }
  }
};

const DICT = { vi, en };

const LanguageContext = createContext({ lang: 'vi', setLang: () => {}, t: (path) => path });

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

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (path) => {
        const hit = resolve(DICT[lang], path);
        return hit !== undefined ? hit : resolve(DICT.vi, path);
      }
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}

/** Định dạng giá VND theo ngôn ngữ hiện tại: 185.000₫ / ₫185,000. */
export function formatPrice(amount, lang) {
  const formatted = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', {
    maximumFractionDigits: 0
  }).format(amount);
  return lang === 'vi' ? `${formatted}₫` : `₫${formatted}`;
}
