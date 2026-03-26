/**
 * 填充产品多语言翻译
 * 所有语言字段目前都是中文，需要替换为正确的翻译
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// 语言映射：mymemory API 语言代码
const LANG_MAP = {
  en: 'en',
  id: 'id',
  th: 'th',
  vi: 'vi',
  ar: 'ar',
};

// 产品名称预定义翻译（精准翻译，覆盖27个产品）
const PRODUCT_NAME_TRANSLATIONS = {
  '接近光传感/校对反射式红外传感器1': {
    en: 'Proximity & Reflective IR Sensor Module 1',
    id: 'Modul Sensor Inframerah Reflektif & Proximity 1',
    th: 'โมดูลเซ็นเซอร์อินฟราเรดสะท้อนแสงและระยะใกล้ 1',
    vi: 'Mô-đun Cảm biến Hồng ngoại Phản xạ & Tiếp cận 1',
    ar: 'وحدة استشعار الأشعة تحت الحمراء الانعكاسية والتقارب 1',
  },
  '接近光传感/校对反射式红外传感器2': {
    en: 'Proximity & Reflective IR Sensor Module 2',
    id: 'Modul Sensor Inframerah Reflektif & Proximity 2',
    th: 'โมดูลเซ็นเซอร์อินฟราเรดสะท้อนแสงและระยะใกล้ 2',
    vi: 'Mô-đun Cảm biến Hồng ngoại Phản xạ & Tiếp cận 2',
    ar: 'وحدة استشعار الأشعة تحت الحمراء الانعكاسية والتقارب 2',
  },
  '人脸识别/人体通过检测传感器1': {
    en: 'Face Recognition / Body Detection IR Sensor 1',
    id: 'Sensor Inframerah Pengenalan Wajah / Deteksi Tubuh 1',
    th: 'เซ็นเซอร์อินฟราเรดจดจำใบหน้า / ตรวจจับร่างกาย 1',
    vi: 'Cảm biến Hồng ngoại Nhận dạng Khuôn mặt / Phát hiện Người 1',
    ar: 'مستشعر الأشعة تحت الحمراء للتعرف على الوجه / كشف الجسم 1',
  },
  '人脸识别/人体通过检测传感器2': {
    en: 'Face Recognition / Body Detection IR Sensor 2',
    id: 'Sensor Inframerah Pengenalan Wajah / Deteksi Tubuh 2',
    th: 'เซ็นเซอร์อินฟราเรดจดจำใบหน้า / ตรวจจับร่างกาย 2',
    vi: 'Cảm biến Hồng ngoại Nhận dạng Khuôn mặt / Phát hiện Người 2',
    ar: 'مستشعر الأشعة تحت الحمراء للتعرف على الوجه / كشف الجسم 2',
  },
  '人脸识别/人体通过检测传感器3': {
    en: 'Face Recognition / Body Detection IR Sensor 3',
    id: 'Sensor Inframerah Pengenalan Wajah / Deteksi Tubuh 3',
    th: 'เซ็นเซอร์อินฟราเรดจดจำใบหน้า / ตรวจจับร่างกาย 3',
    vi: 'Cảm biến Hồng ngoại Nhận dạng Khuôn mặt / Phát hiện Người 3',
    ar: 'مستشعر الأشعة تحت الحمراء للتعرف على الوجه / كشف الجسم 3',
  },
  '高精密红外对射传感': {
    en: 'High Precision IR Break-Beam Sensor',
    id: 'Sensor Inframerah Penghalang Presisi Tinggi',
    th: 'เซ็นเซอร์อินฟราเรดแบบลำแสงความแม่นยำสูง',
    vi: 'Cảm biến Ngắt Chùm Tia Hồng ngoại Độ chính xác cao',
    ar: 'مستشعر الأشعة تحت الحمراء عالي الدقة',
  },
  '血氧监测传感器': {
    en: 'Blood Oxygen (SpO2) Monitoring Sensor',
    id: 'Sensor Pemantau Oksigen Darah (SpO2)',
    th: 'เซ็นเซอร์ตรวจสอบออกซิเจนในเลือด (SpO2)',
    vi: 'Cảm biến Theo dõi Oxy Máu (SpO2)',
    ar: 'مستشعر مراقبة الأكسجين في الدم (SpO2)',
  },
  '心率监测传感/血糖监测传感/光疗LED器件': {
    en: 'Heart Rate / Blood Glucose Monitor & Phototherapy LED',
    id: 'Monitor Detak Jantung / Gula Darah & LED Fototerapi',
    th: 'เซ็นเซอร์ตรวจหัวใจ / น้ำตาลในเลือด & LED บำบัดด้วยแสง',
    vi: 'Cảm biến Nhịp tim / Đường huyết & LED Quang trị liệu',
    ar: 'مستشعر معدل ضربات القلب / سكر الدم & LED للعلاج الضوئي',
  },
  'UVA/UVB/UVC紫外光器件1': {
    en: 'UVA/UVB/UVC Ultraviolet LED Component 1',
    id: 'Komponen LED Ultraviolet UVA/UVB/UVC 1',
    th: 'ชิ้นส่วน LED อัลตราไวโอเลต UVA/UVB/UVC 1',
    vi: 'Linh kiện LED Tia cực tím UVA/UVB/UVC 1',
    ar: 'مكون LED للأشعة فوق البنفسجية UVA/UVB/UVC 1',
  },
  'UVA/UVB/UVC紫外光器件2': {
    en: 'UVA/UVB/UVC Ultraviolet LED Component 2',
    id: 'Komponen LED Ultraviolet UVA/UVB/UVC 2',
    th: 'ชิ้นส่วน LED อัลตราไวโอเลต UVA/UVB/UVC 2',
    vi: 'Linh kiện LED Tia cực tím UVA/UVB/UVC 2',
    ar: 'مكون LED للأشعة فوق البنفسجية UVA/UVB/UVC 2',
  },
  'UVA/UVB/UVC紫外光器件3': {
    en: 'UVA/UVB/UVC Ultraviolet LED Component 3',
    id: 'Komponen LED Ultraviolet UVA/UVB/UVC 3',
    th: 'ชิ้นส่วน LED อัลตราไวโอเลต UVA/UVB/UVC 3',
    vi: 'Linh kiện LED Tia cực tím UVA/UVB/UVC 3',
    ar: 'مكون LED للأشعة فوق البنفسجية UVA/UVB/UVC 3',
  },
  '超小型可见光LED器件1': {
    en: 'Ultra-Compact Visible Light LED Component 1',
    id: 'Komponen LED Cahaya Tampak Ultra-Kompak 1',
    th: 'ชิ้นส่วน LED แสงที่มองเห็นขนาดเล็กมาก 1',
    vi: 'Linh kiện LED Ánh sáng Khả kiến Siêu nhỏ 1',
    ar: 'مكون LED للضوء المرئي فائق الصغر 1',
  },
  '超小型可见光LED器件2': {
    en: 'Ultra-Compact Visible Light LED Component 2',
    id: 'Komponen LED Cahaya Tampak Ultra-Kompak 2',
    th: 'ชิ้นส่วน LED แสงที่มองเห็นขนาดเล็กมาก 2',
    vi: 'Linh kiện LED Ánh sáng Khả kiến Siêu nhỏ 2',
    ar: 'مكون LED للضوء المرئي فائق الصغر 2',
  },
  '超小型可见光LED器件3': {
    en: 'Ultra-Compact Visible Light LED Component 3',
    id: 'Komponen LED Cahaya Tampak Ultra-Kompak 3',
    th: 'ชิ้นส่วน LED แสงที่มองเห็นขนาดเล็กมาก 3',
    vi: 'Linh kiện LED Ánh sáng Khả kiến Siêu nhỏ 3',
    ar: 'مكون LED للضوء المرئي فائق الصغر 3',
  },
  '超小型红外对射传感1': {
    en: 'Ultra-Compact IR Break-Beam Sensor 1',
    id: 'Sensor Inframerah Penghalang Ultra-Kompak 1',
    th: 'เซ็นเซอร์อินฟราเรดแบบลำแสงขนาดเล็กมาก 1',
    vi: 'Cảm biến Ngắt Chùm Hồng ngoại Siêu nhỏ 1',
    ar: 'مستشعر الأشعة تحت الحمراء فائق الصغر 1',
  },
  '超小型红外对射传感2': {
    en: 'Ultra-Compact IR Break-Beam Sensor 2',
    id: 'Sensor Inframerah Penghalang Ultra-Kompak 2',
    th: 'เซ็นเซอร์อินฟราเรดแบบลำแสงขนาดเล็กมาก 2',
    vi: 'Cảm biến Ngắt Chùm Hồng ngoại Siêu nhỏ 2',
    ar: 'مستشعر الأشعة تحت الحمراء فائق الصغر 2',
  },
  '环境光传感器': {
    en: 'Ambient Light Sensor',
    id: 'Sensor Cahaya Lingkungan',
    th: 'เซ็นเซอร์แสงโดยรอบ',
    vi: 'Cảm biến Ánh sáng Môi trường',
    ar: 'مستشعر الضوء المحيطي',
  },
  '距离感测传感器/TOF发射VCSEL传感': {
    en: 'Distance Sensing / TOF VCSEL Emitter Sensor',
    id: 'Sensor Jarak / Sensor Pemancar VCSEL TOF',
    th: 'เซ็นเซอร์วัดระยะ / เซ็นเซอร์ส่งสัญญาณ VCSEL TOF',
    vi: 'Cảm biến Đo khoảng cách / Cảm biến Phát VCSEL TOF',
    ar: 'مستشعر قياس المسافة / مستشعر VCSEL للإرسال بتقنية TOF',
  },
  '激光雷达VCSEL发射传感器': {
    en: 'LiDAR VCSEL Emitter Sensor',
    id: 'Sensor Pemancar VCSEL LiDAR',
    th: 'เซ็นเซอร์ส่งสัญญาณ VCSEL สำหรับ LiDAR',
    vi: 'Cảm biến Phát VCSEL cho LiDAR',
    ar: 'مستشعر VCSEL للإرسال في تقنية LiDAR',
  },
  '显尘模组': {
    en: 'Dust Visualization Module',
    id: 'Modul Visualisasi Debu',
    th: 'โมดูลแสดงฝุ่น',
    vi: 'Mô-đun Hiển thị Bụi',
    ar: 'وحدة تصور الغبار',
  },
  '柔性接触传感模组': {
    en: 'Flexible Contact Sensing Module',
    id: 'Modul Sensor Sentuh Fleksibel',
    th: 'โมดูลเซ็นเซอร์สัมผัสแบบยืดหยุ่น',
    vi: 'Mô-đun Cảm biến Tiếp xúc Linh hoạt',
    ar: 'وحدة استشعار اللمس المرنة',
  },
  'DTOP距离测量模组': {
    en: 'DTOP Distance Measurement Module',
    id: 'Modul Pengukur Jarak DTOP',
    th: 'โมดูลวัดระยะ DTOP',
    vi: 'Mô-đun Đo khoảng cách DTOP',
    ar: 'وحدة قياس المسافة DTOP',
  },
  '接近唤醒雷达模组': {
    en: 'Proximity Wake-Up Radar Module',
    id: 'Modul Radar Pembangun Proximitas',
    th: 'โมดูลเรดาร์ปลุกใช้งานด้วยระยะใกล้',
    vi: 'Mô-đun Radar Đánh thức Tiếp cận',
    ar: 'وحدة رادار الإيقاظ بالتقارب',
  },
  '管道式光电液位传感模组': {
    en: 'Tubular Photoelectric Liquid Level Sensor Module',
    id: 'Modul Sensor Level Cairan Fotoelektrik Tabular',
    th: 'โมดูลเซ็นเซอร์ระดับของเหลวแบบโฟโตอิเล็กทริกทรงกระบอก',
    vi: 'Mô-đun Cảm biến Mức Chất lỏng Quang điện Dạng ống',
    ar: 'وحدة استشعار مستوى السائل الكهروضوئية الأنبوبية',
  },
  '过流式紫外杀菌模组 GP23XX系列': {
    en: 'Flow-Through UV Sterilization Module GP23XX Series',
    id: 'Modul Sterilisasi UV Aliran Langsung Seri GP23XX',
    th: 'โมดูลฆ่าเชื้อ UV แบบไหลผ่าน ซีรีส์ GP23XX',
    vi: 'Mô-đun Khử trùng UV Dòng chảy qua Dòng GP23XX',
    ar: 'وحدة التعقيم بالأشعة فوق البنفسجية بالتدفق المستمر سلسلة GP23XX',
  },
  '空气紫外杀菌模组 GP-XS29xx系列': {
    en: 'Air UV Sterilization Module GP-XS29xx Series',
    id: 'Modul Sterilisasi UV Udara Seri GP-XS29xx',
    th: 'โมดูลฆ่าเชื้อ UV อากาศ ซีรีส์ GP-XS29xx',
    vi: 'Mô-đun Khử trùng UV Không khí Dòng GP-XS29xx',
    ar: 'وحدة التعقيم بالأشعة فوق البنفسجية للهواء سلسلة GP-XS29xx',
  },
  '静态紫外杀菌模组 GP-XS17xx系列': {
    en: 'Static UV Sterilization Module GP-XS17xx Series',
    id: 'Modul Sterilisasi UV Statis Seri GP-XS17xx',
    th: 'โมดูลฆ่าเชื้อ UV แบบคงที่ ซีรีส์ GP-XS17xx',
    vi: 'Mô-đun Khử trùng UV Tĩnh Dòng GP-XS17xx',
    ar: 'وحدة التعقيم بالأشعة فوق البنفسجية الثابتة سلسلة GP-XS17xx',
  },
};

// 分类翻译（精确翻译）
const CATEGORY_TRANSLATIONS = {
  '红外LED': {
    en: 'IR LEDs',
    id: 'LED Inframerah',
    th: 'LED อินฟราเรด',
    vi: 'LED Hồng ngoại',
    ar: 'ليد الأشعة تحت الحمراء',
  },
  '可见光LED': {
    en: 'Visible LEDs',
    id: 'LED Cahaya Tampak',
    th: 'LED แสงที่มองเห็น',
    vi: 'LED Ánh sáng Khả kiến',
    ar: 'ليد الضوء المرئي',
  },
  '紫外LED': {
    en: 'UV LEDs',
    id: 'LED Ultraviolet',
    th: 'LED อัลตราไวโอเลต',
    vi: 'LED Tia cực tím',
    ar: 'ليد الأشعة فوق البنفسجية',
  },
  '光源模组': {
    en: 'Light Source Modules',
    id: 'Modul Sumber Cahaya',
    th: 'โมดูลแหล่งกำเนิดแสง',
    vi: 'Mô-đun Nguồn Sáng',
    ar: 'وحدات مصدر الضوء',
  },
  '消杀模组': {
    en: 'Sterilization Modules',
    id: 'Modul Sterilisasi',
    th: 'โมดูลฆ่าเชื้อ',
    vi: 'Mô-đun Khử trùng',
    ar: 'وحدات التعقيم',
  },
  '智能传感': {
    en: 'Smart Sensors',
    id: 'Sensor Cerdas',
    th: 'เซ็นเซอร์อัจฉริยะ',
    vi: 'Cảm biến Thông minh',
    ar: 'أجهزة الاستشعار الذكية',
  },
};

async function main() {
  console.log('🌐 开始填充多语言翻译...\n');

  // 1. 更新分类翻译
  console.log('📁 更新分类翻译...');
  const categories = await client.fetch('*[_type == "category"] { _id, name }');
  
  for (const cat of categories) {
    const zhName = cat.name?.zh;
    const translations = CATEGORY_TRANSLATIONS[zhName];
    
    if (!translations) {
      console.log(`  ⚠️ 没有找到分类"${zhName}"的翻译`);
      continue;
    }
    
    const updates = { name: { zh: zhName, ...translations } };
    
    try {
      await client.patch(cat._id).set(updates).commit();
      console.log(`  ✅ ${zhName} → EN: ${translations.en}`);
    } catch (err) {
      console.error(`  ❌ 更新分类失败 (${zhName}):`, err.message);
    }
  }

  // 2. 更新产品翻译
  console.log('\n📦 更新产品翻译...');
  const products = await client.fetch('*[_type == "product"] { _id, name }');
  
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const zhName = product.name?.zh;
    const translations = PRODUCT_NAME_TRANSLATIONS[zhName];

    if (!translations) {
      console.log(`  [${i + 1}/${products.length}] ⚠️ 没有翻译: "${zhName}"`);
      skipCount++;
      continue;
    }

    const updates = { 'name.en': translations.en, 'name.id': translations.id, 'name.th': translations.th, 'name.vi': translations.vi, 'name.ar': translations.ar };

    try {
      await client.patch(product._id).set(updates).commit();
      console.log(`  [${i + 1}/${products.length}] ✅ ${zhName}`);
      console.log(`    EN: ${translations.en}`);
      successCount++;
    } catch (err) {
      console.error(`  [${i + 1}/${products.length}] ❌ 更新失败 (${zhName}):`, err.message);
      failCount++;
    }
  }

  // 3. 汇报结果
  console.log(`\n✅ 翻译填充完成！`);
  console.log(`   成功: ${successCount}`);
  console.log(`   跳过: ${skipCount}`);
  console.log(`   失败: ${failCount}`);
  console.log(`   总计: ${products.length}`);
}

main().catch(console.error);
