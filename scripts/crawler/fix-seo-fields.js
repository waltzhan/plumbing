/**
 * 修复产品SEO字段：清理HTML描述、生成SEO标题和slug
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// 产品核心优势（从原始HTML中提取的纯文本，人工整理）
const PRODUCT_DESCRIPTIONS = {
  '接近光传感/校对反射式红外传感器1': {
    zh: '核心优势：产品高灵敏度，一站式解决方案服务。适用于距离感测、手势识别、闸口通道检测、机器人等场景。',
    en: 'Core advantage: High sensitivity with one-stop solution service. Suitable for proximity sensing, gesture recognition, gate detection, and robotics.',
    id: 'Keunggulan utama: Sensitivitas tinggi dengan layanan solusi satu atap. Cocok untuk penginderaan jarak, pengenalan gestur, deteksi gerbang, dan robotik.',
    th: 'ข้อดีหลัก: ความไวสูงพร้อมบริการโซลูชันครบวงจร เหมาะสำหรับการตรวจจับระยะ การรู้จำท่าทาง การตรวจจับประตู และหุ่นยนต์',
    vi: 'Ưu điểm cốt lõi: Độ nhạy cao với dịch vụ giải pháp một cửa. Phù hợp cho cảm biến khoảng cách, nhận dạng cử chỉ, phát hiện cổng, và robot.',
    ar: 'الميزة الأساسية: حساسية عالية مع خدمة الحل الشامل. مناسب لاستشعار المسافة، التعرف على الإيماءات، كشف البوابة، والروبوتات.',
  },
  '接近光传感/校对反射式红外传感器2': {
    zh: '核心优势：产品高灵敏度，一站式解决方案服务。适用于距离感测、AMT检测、手势识别、闸口通道检测、机器人等场景。',
    en: 'Core advantage: High sensitivity with one-stop solution service. Suitable for proximity sensing, AMT detection, gesture recognition, gate detection, and robotics.',
    id: 'Keunggulan utama: Sensitivitas tinggi dengan layanan solusi satu atap. Cocok untuk penginderaan jarak, deteksi AMT, pengenalan gestur, dan robotik.',
    th: 'ข้อดีหลัก: ความไวสูงพร้อมบริการโซลูชันครบวงจร เหมาะสำหรับการตรวจจับระยะ การตรวจจับ AMT การรู้จำท่าทาง และหุ่นยนต์',
    vi: 'Ưu điểm cốt lõi: Độ nhạy cao với dịch vụ giải pháp một cửa. Phù hợp cho cảm biến khoảng cách, phát hiện AMT, nhận dạng cử chỉ, và robot.',
    ar: 'الميزة الأساسية: حساسية عالية مع خدمة الحل الشامل. مناسب لاستشعار المسافة، كشف AMT، التعرف على الإيماءات، والروبوتات.',
  },
  '人脸识别/人体通过检测传感器1': {
    zh: '高精度红外传感器，专为人脸识别和人体通过检测设计，具备超小尺寸和高稳定性。',
    en: 'High-precision IR sensor designed for face recognition and human body detection, featuring ultra-small size and high stability.',
    id: 'Sensor inframerah presisi tinggi yang dirancang untuk pengenalan wajah dan deteksi tubuh manusia dengan ukuran sangat kecil.',
    th: 'เซ็นเซอร์อินฟราเรดความแม่นยำสูงออกแบบมาสำหรับการจดจำใบหน้าและการตรวจจับร่างกายมนุษย์',
    vi: 'Cảm biến hồng ngoại độ chính xác cao được thiết kế cho nhận dạng khuôn mặt và phát hiện cơ thể người.',
    ar: 'مستشعر أشعة تحت حمراء عالي الدقة مصمم للتعرف على الوجه واكتشاف جسم الإنسان.',
  },
  '人脸识别/人体通过检测传感器2': {
    zh: '小型化红外传感器，专用于人脸识别和人体通道检测，抗干扰能力强，稳定性高。',
    en: 'Compact IR sensor for face recognition and human passage detection with strong anti-interference and high stability.',
    id: 'Sensor inframerah kompak untuk pengenalan wajah dan deteksi lewatnya manusia dengan anti-interferensi kuat.',
    th: 'เซ็นเซอร์อินฟราเรดขนาดกะทัดรัดสำหรับการจดจำใบหน้าและตรวจจับการผ่านของมนุษย์',
    vi: 'Cảm biến hồng ngoại nhỏ gọn cho nhận dạng khuôn mặt và phát hiện người đi qua.',
    ar: 'مستشعر أشعة تحت حمراء مضغوط للتعرف على الوجه وكشف مرور الإنسان.',
  },
  '人脸识别/人体通过检测传感器3': {
    zh: '高灵敏度红外传感器，适用于人脸识别、人体检测、安防监控等智能应用场景。',
    en: 'High-sensitivity IR sensor suitable for face recognition, body detection, and security monitoring applications.',
    id: 'Sensor inframerah sensitivitas tinggi cocok untuk pengenalan wajah, deteksi tubuh, dan pemantauan keamanan.',
    th: 'เซ็นเซอร์อินฟราเรดความไวสูงเหมาะสำหรับการจดจำใบหน้า ตรวจจับร่างกาย และการตรวจสอบความปลอดภัย',
    vi: 'Cảm biến hồng ngoại độ nhạy cao phù hợp cho nhận dạng khuôn mặt, phát hiện cơ thể và giám sát an ninh.',
    ar: 'مستشعر أشعة تحت حمراء عالي الحساسية مناسب للتعرف على الوجه والكشف عن الجسم ومراقبة الأمن.',
  },
  '高精密红外对射传感': {
    zh: '高精密红外对射传感器，适用于精密计数、位置检测、光幕等工业应用，具备极低功耗和高可靠性。',
    en: 'High-precision IR break-beam sensor for precise counting, position detection, and light curtain industrial applications with ultra-low power.',
    id: 'Sensor inframerah penghalang presisi tinggi untuk penghitungan presisi, deteksi posisi, dan aplikasi industri tirai cahaya.',
    th: 'เซ็นเซอร์อินฟราเรดแบบลำแสงความแม่นยำสูงสำหรับการนับที่แม่นยำ ตรวจจับตำแหน่ง และม่านแสงในงานอุตสาหกรรม',
    vi: 'Cảm biến ngắt chùm hồng ngoại độ chính xác cao cho đếm chính xác, phát hiện vị trí và ứng dụng công nghiệp rèm ánh sáng.',
    ar: 'مستشعر أشعة تحت حمراء عالي الدقة للعد الدقيق وكشف الموضع وتطبيقات الستائر الضوئية الصناعية.',
  },
  '血氧监测传感器': {
    zh: '专业血氧监测传感器，采用光电容积脉搏波描记法，精准检测血氧饱和度（SpO2）和心率，适用于健康监护设备。',
    en: 'Professional blood oxygen monitoring sensor using photoplethysmography to accurately detect SpO2 and heart rate for health monitoring devices.',
    id: 'Sensor pemantau oksigen darah profesional menggunakan fotoplethysmografi untuk mendeteksi SpO2 dan detak jantung secara akurat.',
    th: 'เซ็นเซอร์ตรวจสอบออกซิเจนในเลือดระดับมืออาชีพใช้โฟโตเพล็ทิสโมกราฟีเพื่อตรวจจับ SpO2 และอัตราการเต้นของหัวใจ',
    vi: 'Cảm biến theo dõi oxy máu chuyên nghiệp sử dụng phương pháp đo xung quang học để phát hiện SpO2 và nhịp tim chính xác.',
    ar: 'مستشعر مراقبة الأكسجين في الدم الاحترافي باستخدام قياس الحجم الضوئي للكشف الدقيق عن SpO2 ومعدل ضربات القلب.',
  },
  '心率监测传感/血糖监测传感/光疗LED器件': {
    zh: '多功能生物传感器，可用于心率监测、血糖监测及光疗应用，采用精密光学设计。',
    en: 'Multi-function biosensor for heart rate monitoring, blood glucose measurement, and phototherapy applications with precision optical design.',
    id: 'Biosensor multifungsi untuk pemantauan detak jantung, pengukuran gula darah, dan aplikasi fototerapi.',
    th: 'ไบโอเซ็นเซอร์หลายฟังก์ชันสำหรับตรวจสอบอัตราการเต้นของหัวใจ การวัดน้ำตาลในเลือด และการบำบัดด้วยแสง',
    vi: 'Cảm biến sinh học đa chức năng cho giám sát nhịp tim, đo đường huyết và ứng dụng quang trị liệu.',
    ar: 'مستشعر حيوي متعدد الوظائف لمراقبة معدل ضربات القلب وقياس سكر الدم وتطبيقات العلاج الضوئي.',
  },
  'UVA/UVB/UVC紫外光器件1': {
    zh: '高性能紫外LED器件，支持UVA/UVB/UVC波段，适用于消毒杀菌、荧光检测、光固化等领域。',
    en: 'High-performance UV LED component supporting UVA/UVB/UVC bands for disinfection, fluorescence detection, and UV curing applications.',
    id: 'Komponen LED UV berkinerja tinggi mendukung band UVA/UVB/UVC untuk desinfeksi, deteksi fluoresensi, dan aplikasi pengawetan UV.',
    th: 'ชิ้นส่วน LED UV ประสิทธิภาพสูงรองรับแถบ UVA/UVB/UVC สำหรับการฆ่าเชื้อ การตรวจจับฟลูออเรสเซนซ์',
    vi: 'Linh kiện LED UV hiệu suất cao hỗ trợ dải UVA/UVB/UVC cho khử trùng, phát hiện huỳnh quang và ứng dụng đóng rắn UV.',
    ar: 'مكون LED للأشعة فوق البنفسجية عالي الأداء يدعم نطاقات UVA/UVB/UVC للتعقيم وكشف الفلورة.',
  },
  'UVA/UVB/UVC紫外光器件2': {
    zh: '紫外LED器件，覆盖UVA/UVB/UVC波段，光效高、寿命长，适用于工业紫外照射、医疗消毒。',
    en: 'UV LED component covering UVA/UVB/UVC bands with high efficiency and long lifespan for industrial UV irradiation and medical disinfection.',
    id: 'Komponen LED UV mencakup band UVA/UVB/UVC dengan efisiensi tinggi dan umur panjang untuk iradiasi UV industri dan desinfeksi medis.',
    th: 'ชิ้นส่วน LED UV ครอบคลุมแถบ UVA/UVB/UVC ประสิทธิภาพสูงและอายุยาวนาน',
    vi: 'Linh kiện LED UV bao phủ dải UVA/UVB/UVC hiệu suất cao và tuổi thọ dài.',
    ar: 'مكون LED للأشعة فوق البنفسجية يغطي نطاقات UVA/UVB/UVC بكفاءة عالية وعمر طويل.',
  },
  'UVA/UVB/UVC紫外光器件3': {
    zh: '高功率紫外LED器件，专用于UVC杀菌消毒，具备高辐射强度，适用于水处理、空气净化。',
    en: 'High-power UV LED component for UVC sterilization with high irradiance, suitable for water treatment and air purification.',
    id: 'Komponen LED UV daya tinggi untuk sterilisasi UVC dengan iradiasi tinggi, cocok untuk pengolahan air dan pemurnian udara.',
    th: 'ชิ้นส่วน LED UV กำลังสูงสำหรับการฆ่าเชื้อ UVC ที่มีความเข้มของรังสีสูง',
    vi: 'Linh kiện LED UV công suất cao cho khử trùng UVC với cường độ bức xạ cao, phù hợp cho xử lý nước và lọc không khí.',
    ar: 'مكون LED للأشعة فوق البنفسجية عالي القدرة لتعقيم UVC بشدة إشعاعية عالية.',
  },
  '超小型可见光LED器件1': {
    zh: '超小型可见光LED器件，体积极小，亮度高，适用于智能穿戴、医疗器械、微型显示等精密应用场景。',
    en: 'Ultra-compact visible light LED with extremely small size and high brightness for wearables, medical devices, and micro-display applications.',
    id: 'LED cahaya tampak ultra-kompak berukuran sangat kecil dan kecerahan tinggi untuk wearable, perangkat medis, dan aplikasi mikro-display.',
    th: 'LED แสงที่มองเห็นขนาดเล็กมากที่มีความสว่างสูงสำหรับอุปกรณ์สวมใส่ อุปกรณ์การแพทย์',
    vi: 'LED ánh sáng khả kiến siêu nhỏ với kích thước cực nhỏ và độ sáng cao cho thiết bị đeo, thiết bị y tế.',
    ar: 'مصباح LED للضوء المرئي فائق الصغر بحجم صغير جداً وسطوع عالٍ للأجهزة القابلة للارتداء.',
  },
  '超小型可见光LED器件2': {
    zh: '超小型可见光LED，采用先进封装工艺，低功耗，高可靠性，适合精密仪器和消费电子。',
    en: 'Ultra-compact visible LED with advanced packaging, low power consumption and high reliability for precision instruments.',
    id: 'LED tampak ultra-kompak dengan kemasan canggih, konsumsi daya rendah dan keandalan tinggi.',
    th: 'LED ที่มองเห็นขนาดเล็กมากพร้อมบรรจุภัณฑ์ขั้นสูง การใช้พลังงานต่ำและความน่าเชื่อถือสูง',
    vi: 'LED khả kiến siêu nhỏ với đóng gói tiên tiến, tiêu thụ điện năng thấp và độ tin cậy cao.',
    ar: 'مصباح LED مرئي فائق الصغر بتغليف متقدم واستهلاك طاقة منخفض وموثوقية عالية.',
  },
  '超小型可见光LED器件3': {
    zh: '超小型可见光LED器件，全彩可选，适用于状态指示、背光、装饰照明等多种应用。',
    en: 'Ultra-compact visible LED available in full colors, suitable for status indication, backlighting, and decorative lighting.',
    id: 'LED tampak ultra-kompak tersedia dalam warna penuh, cocok untuk indikasi status, pencahayaan latar, dan pencahayaan dekoratif.',
    th: 'LED ที่มองเห็นขนาดเล็กมากมีในหลายสี เหมาะสำหรับการแสดงสถานะ แสงพื้นหลัง',
    vi: 'LED khả kiến siêu nhỏ có sẵn trong đầy đủ màu sắc, phù hợp cho chỉ báo trạng thái, chiếu sáng nền.',
    ar: 'مصباح LED مرئي فائق الصغر متاح بألوان كاملة مناسب لمؤشرات الحالة والإضاءة الخلفية.',
  },
  '超小型红外对射传感1': {
    zh: '超小型红外对射传感器，体积小巧，安装方便，适用于小家电、文具、玩具的物体检测场景。',
    en: 'Ultra-compact IR break-beam sensor with small size, easy installation for object detection in appliances, stationery, and toys.',
    id: 'Sensor inframerah penghalang ultra-kompak berukuran kecil untuk deteksi objek pada peralatan rumah tangga kecil.',
    th: 'เซ็นเซอร์อินฟราเรดแบบลำแสงขนาดเล็กมากติดตั้งง่ายสำหรับตรวจจับวัตถุ',
    vi: 'Cảm biến ngắt chùm hồng ngoại siêu nhỏ dễ lắp đặt cho phát hiện vật thể trong thiết bị gia dụng nhỏ.',
    ar: 'مستشعر أشعة تحت حمراء صغير جداً سهل التركيب لكشف الأجسام في الأجهزة المنزلية الصغيرة.',
  },
  '超小型红外对射传感2': {
    zh: '高精度超小型红外对射传感器，适用于精密计数、位置检测等应用，低功耗，稳定可靠。',
    en: 'High-precision ultra-compact IR break-beam sensor for precise counting and position detection with low power consumption.',
    id: 'Sensor inframerah penghalang ultra-kompak presisi tinggi untuk penghitungan tepat dan deteksi posisi.',
    th: 'เซ็นเซอร์อินฟราเรดแบบลำแสงขนาดเล็กมากความแม่นยำสูงสำหรับการนับที่แม่นยำ',
    vi: 'Cảm biến ngắt chùm hồng ngoại siêu nhỏ độ chính xác cao cho đếm chính xác và phát hiện vị trí.',
    ar: 'مستشعر أشعة تحت حمراء صغير جداً عالي الدقة للعد الدقيق وكشف الموضع.',
  },
  '环境光传感器': {
    zh: '高精度环境光传感器，可精准感知环境亮度，广泛应用于屏幕自动调光、智能照明控制系统。',
    en: 'High-precision ambient light sensor for accurate brightness sensing, widely used in auto-dimming screens and smart lighting control.',
    id: 'Sensor cahaya lingkungan presisi tinggi untuk penginderaan kecerahan yang akurat, digunakan dalam layar redupan otomatis.',
    th: 'เซ็นเซอร์แสงโดยรอบความแม่นยำสูงสำหรับการตรวจจับความสว่างที่แม่นยำ',
    vi: 'Cảm biến ánh sáng môi trường độ chính xác cao cho cảm nhận độ sáng chính xác, dùng trong điều chỉnh màn hình tự động.',
    ar: 'مستشعر الضوء المحيطي عالي الدقة للكشف الدقيق عن السطوع، يستخدم في التحكم التلقائي في الإضاءة.',
  },
  '距离感测传感器/TOF发射VCSEL传感': {
    zh: 'TOF飞行时间测距传感器，采用VCSEL激光发射技术，测距精度高，响应速度快，适用于机器人避障、空间识别。',
    en: 'TOF time-of-flight distance sensor using VCSEL laser technology with high accuracy and fast response for robot obstacle avoidance.',
    id: 'Sensor jarak TOF menggunakan teknologi laser VCSEL dengan akurasi tinggi dan respons cepat untuk penghindaran rintangan robot.',
    th: 'เซ็นเซอร์วัดระยะ TOF โดยใช้เทคโนโลยีเลเซอร์ VCSEL ที่มีความแม่นยำสูงและการตอบสนองรวดเร็ว',
    vi: 'Cảm biến đo khoảng cách TOF sử dụng công nghệ laser VCSEL với độ chính xác cao và phản hồi nhanh.',
    ar: 'مستشعر قياس المسافة TOF باستخدام تقنية الليزر VCSEL بدقة عالية وسرعة استجابة سريعة.',
  },
  '激光雷达VCSEL发射传感器': {
    zh: '激光雷达专用VCSEL发射传感器，高功率、高频率，适用于自动驾驶、无人机、工业测量等激光雷达系统。',
    en: 'LiDAR dedicated VCSEL emitter sensor with high power and high frequency for autonomous driving, drones, and industrial measurement.',
    id: 'Sensor pemancar VCSEL khusus LiDAR dengan daya tinggi dan frekuensi tinggi untuk kendaraan otonom dan pengukuran industri.',
    th: 'เซ็นเซอร์ส่งสัญญาณ VCSEL เฉพาะ LiDAR กำลังสูงและความถี่สูงสำหรับยานพาหนะอัตโนมัติ',
    vi: 'Cảm biến phát VCSEL chuyên dụng LiDAR công suất cao và tần số cao cho lái xe tự động và đo lường công nghiệp.',
    ar: 'مستشعر VCSEL متخصص في LiDAR عالي القدرة والتردد للسيارات ذاتية القيادة والقياس الصناعي.',
  },
  '显尘模组': {
    zh: '智能显尘模组，可直观显示空气中的颗粒物浓度，适用于空气净化器、智能家居、环境监测设备。',
    en: 'Smart dust visualization module for intuitive display of particulate matter concentration in air purifiers and smart home devices.',
    id: 'Modul visualisasi debu cerdas untuk tampilan intuitif konsentrasi partikel udara dalam pemurni udara dan perangkat rumah pintar.',
    th: 'โมดูลแสดงฝุ่นอัจฉริยะสำหรับแสดงความเข้มข้นของอนุภาคในเครื่องฟอกอากาศ',
    vi: 'Mô-đun hiển thị bụi thông minh cho hiển thị trực quan nồng độ hạt trong máy lọc không khí và thiết bị nhà thông minh.',
    ar: 'وحدة تصور الغبار الذكية لعرض سهم تركيز الجسيمات في أجهزة تنقية الهواء.',
  },
  '柔性接触传感模组': {
    zh: '柔性接触传感模组，可弯曲适形，灵敏度高，适用于可穿戴设备、医疗健康监测、软体机器人等应用。',
    en: 'Flexible contact sensing module with conformal bending and high sensitivity for wearables, medical health monitoring, and soft robotics.',
    id: 'Modul sensor sentuh fleksibel dengan tekukan konform dan sensitivitas tinggi untuk wearable dan pemantauan kesehatan medis.',
    th: 'โมดูลเซ็นเซอร์สัมผัสแบบยืดหยุ่นที่มีความไวสูงสำหรับอุปกรณ์สวมใส่และการตรวจสอบสุขภาพ',
    vi: 'Mô-đun cảm biến tiếp xúc linh hoạt với uốn cong phù hợp và độ nhạy cao cho thiết bị đeo và giám sát sức khỏe.',
    ar: 'وحدة استشعار اللمس المرنة ذات الانحناء المطابق والحساسية العالية للأجهزة القابلة للارتداء.',
  },
  'DTOP距离测量模组': {
    zh: 'DTOP高精度距离测量模组，集成化设计，测量范围广，适用于工业自动化、智能制造等精密测距场合。',
    en: 'DTOP high-precision distance measurement module with integrated design and wide range for industrial automation and smart manufacturing.',
    id: 'Modul pengukur jarak presisi tinggi DTOP dengan desain terintegrasi dan jangkauan luas untuk otomasi industri.',
    th: 'โมดูลวัดระยะความแม่นยำสูง DTOP ที่มีการออกแบบแบบรวมและระยะกว้างสำหรับระบบอัตโนมัติในอุตสาหกรรม',
    vi: 'Mô-đun đo khoảng cách độ chính xác cao DTOP với thiết kế tích hợp và phạm vi rộng cho tự động hóa công nghiệp.',
    ar: 'وحدة قياس المسافة عالية الدقة DTOP بتصميم متكامل ونطاق واسع للأتمتة الصناعية.',
  },
  '接近唤醒雷达模组': {
    zh: '接近唤醒雷达模组，通过感应人体靠近自动唤醒设备，降低功耗，适用于智能家居、显示器、自助终端。',
    en: 'Proximity wake-up radar module that automatically activates devices when detecting approach, reducing power for smart home and kiosk applications.',
    id: 'Modul radar wake-up proximity yang secara otomatis mengaktifkan perangkat saat mendeteksi pendekatan untuk rumah pintar.',
    th: 'โมดูลเรดาร์ปลุกใช้งานด้วยระยะใกล้ที่เปิดใช้งานอุปกรณ์โดยอัตโนมัติเมื่อตรวจพบการเข้าใกล้',
    vi: 'Mô-đun radar đánh thức tiếp cận tự động kích hoạt thiết bị khi phát hiện người đến gần.',
    ar: 'وحدة رادار الإيقاظ بالتقارب التي تنشط الأجهزة تلقائياً عند اكتشاف الاقتراب.',
  },
  '管道式光电液位传感模组': {
    zh: '管道式光电液位传感模组，非接触式检测，不受液体颜色和泡沫影响，适用于医疗、食品、化工液位检测。',
    en: 'Tubular photoelectric liquid level sensor module with non-contact detection, unaffected by liquid color or foam, for medical and chemical use.',
    id: 'Modul sensor level cairan fotoelektrik tabular dengan deteksi non-kontak, tidak terpengaruh oleh warna cairan.',
    th: 'โมดูลเซ็นเซอร์ระดับของเหลวแบบโฟโตอิเล็กทริกทรงกระบอกที่มีการตรวจจับแบบไม่สัมผัส',
    vi: 'Mô-đun cảm biến mức chất lỏng quang điện dạng ống với phát hiện không tiếp xúc cho y tế và hóa chất.',
    ar: 'وحدة استشعار مستوى السائل الكهروضوئية الأنبوبية مع كشف غير تلامسي للاستخدام الطبي والكيميائي.',
  },
  '过流式紫外杀菌模组 GP23XX系列': {
    zh: 'GP23XX系列过流式紫外杀菌模组，高UV输出功率，适用于净水机、直饮机、医疗器械等流水式杀菌场景。',
    en: 'GP23XX series flow-through UV sterilization module with high UV output power for water purifiers and medical device sterilization.',
    id: 'Modul sterilisasi UV aliran langsung seri GP23XX dengan daya UV tinggi untuk pemurni air dan perangkat medis.',
    th: 'โมดูลฆ่าเชื้อ UV แบบไหลผ่าน ซีรีส์ GP23XX กำลัง UV สูงสำหรับเครื่องกรองน้ำ',
    vi: 'Mô-đun khử trùng UV dòng chảy qua Dòng GP23XX công suất UV cao cho máy lọc nước và thiết bị y tế.',
    ar: 'وحدة التعقيم بالأشعة فوق البنفسجية بالتدفق المستمر سلسلة GP23XX بقدرة أشعة فوق بنفسجية عالية.',
  },
  '空气紫外杀菌模组 GP-XS29xx系列': {
    zh: 'GP-XS29xx系列空气紫外杀菌模组，高效灭杀细菌病毒，适用于新风系统、空调、空气净化器等设备。',
    en: 'GP-XS29xx series air UV sterilization module efficiently kills bacteria and viruses for fresh air systems and air purifiers.',
    id: 'Modul sterilisasi UV udara seri GP-XS29xx efisien membunuh bakteri dan virus untuk sistem udara segar.',
    th: 'โมดูลฆ่าเชื้อ UV อากาศ ซีรีส์ GP-XS29xx ฆ่าเชื้อแบคทีเรียและไวรัสอย่างมีประสิทธิภาพ',
    vi: 'Mô-đun khử trùng UV không khí Dòng GP-XS29xx hiệu quả tiêu diệt vi khuẩn và virus cho hệ thống thông khí.',
    ar: 'وحدة التعقيم بالأشعة فوق البنفسجية للهواء سلسلة GP-XS29xx تقتل البكتيريا والفيروسات بكفاءة.',
  },
  '静态紫外杀菌模组 GP-XS17xx系列': {
    zh: 'GP-XS17xx系列静态紫外杀菌模组，适用于密闭空间静态消毒，高效安全，适合医疗、实验室、食品存储环境。',
    en: 'GP-XS17xx series static UV sterilization module for enclosed space disinfection, suitable for medical, laboratory, and food storage.',
    id: 'Modul sterilisasi UV statis seri GP-XS17xx untuk disinfeksi ruang tertutup, cocok untuk medis dan penyimpanan makanan.',
    th: 'โมดูลฆ่าเชื้อ UV แบบคงที่ ซีรีส์ GP-XS17xx สำหรับการฆ่าเชื้อในพื้นที่ปิด',
    vi: 'Mô-đun khử trùng UV tĩnh Dòng GP-XS17xx cho khử trùng không gian kín, phù hợp cho y tế và lưu trữ thực phẩm.',
    ar: 'وحدة التعقيم بالأشعة فوق البنفسجية الثابتة سلسلة GP-XS17xx لتعقيم المساحات المغلقة.',
  },
};

// 根据英文名生成URL友好的slug
function generateSlug(enName) {
  return enName
    .toLowerCase()
    .replace(/[\/\(\)\[\]]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

async function main() {
  console.log('🔧 修复产品描述和SEO字段...\n');
  
  const products = await client.fetch('*[_type == "product"] { _id, name, slug }');
  
  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const zhName = product.name?.zh;
    const enName = product.name?.en;
    const desc = PRODUCT_DESCRIPTIONS[zhName];

    if (!desc) {
      console.log(`  [${i + 1}/${products.length}] ⚠️ 无描述数据: "${zhName}"`);
      skipCount++;
      continue;
    }

    // 生成新的 slug
    const newSlug = generateSlug(enName);
    
    // 构建 SEO 标题（多语言）
    const seoMetaTitle = {
      zh: `${zhName} | 光莆LED`,
      en: `${enName} | GoPro LED`,
      id: `${product.name?.id || enName} | GoPro LED`,
      th: `${product.name?.th || enName} | GoPro LED`,
      vi: `${product.name?.vi || enName} | GoPro LED`,
      ar: `${product.name?.ar || enName} | GoPro LED`,
    };

    const updates = {
      'slug.current': newSlug,
      'shortDescription': desc,
      'seo.metaTitle': seoMetaTitle,
      'seo.metaDescription': desc,
    };

    try {
      await client.patch(product._id).set(updates).commit();
      console.log(`  [${i + 1}/${products.length}] ✅ ${zhName}`);
      console.log(`    Slug: ${newSlug}`);
      successCount++;
    } catch (err) {
      console.error(`  [${i + 1}/${products.length}] ❌ ${zhName}:`, err.message);
    }
  }

  console.log(`\n✅ 修复完成！`);
  console.log(`   成功: ${successCount}`);
  console.log(`   跳过: ${skipCount}`);
  console.log(`   总计: ${products.length}`);
}

main().catch(console.error);
