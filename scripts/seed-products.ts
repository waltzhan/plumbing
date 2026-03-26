// 初始化20个核心产品数据脚本
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'nckyp28c',
  dataset: 'production',
  apiVersion: '2024-03-10',
  token: 'skb7xF9nxsT6bfoJsTAQGBgA7q1iSNjQecXG0NmHCNx42QreJAHuWEwmOQcAPBUcPoO9TrsVMFyYPUZD8jIjA5d1jJEf0fyjCGwUpDGrvcgTfix322mvO0WHKduQ00kxYZ3rU4VGQOnncTOl9qDMtWF947NA5gcltdJm9xxjOcwuFFMphfqL',
  useCdn: false,
});

// 20个核心产品数据
const products = [
  // CHIP LED - 消费电子类
  {
    _type: 'product',
    name: { zh: '0603 标准CHIP LED', en: '0603 Standard CHIP LED' },
    model: 'GP0603-01',
    categorySlug: 'chip-led',
    description: {
      zh: '超小型0603封装，适用于智能手机、可穿戴设备等精密电子产品指示灯',
      en: 'Ultra-small 0603 package, ideal for indicator lights in smartphones and wearables',
    },
    shortDescription: { zh: '超小型指示灯LED', en: 'Ultra-small indicator LED' },
    features: {
      zh: ['尺寸：1.6×0.8×0.6mm', '低功耗设计', '高亮度输出', '符合RoHS标准'],
      en: ['Size: 1.6×0.8×0.6mm', 'Low power design', 'High brightness output', 'RoHS compliant'],
    },
    applications: {
      zh: ['智能手机', '智能手表', '蓝牙耳机', '移动电源'],
      en: ['Smartphones', 'Smartwatches', 'Bluetooth earphones', 'Power banks'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam'],
    status: 'active',
    orderRank: 1,
  },
  {
    _type: 'product',
    name: { zh: '0805 高亮CHIP LED', en: '0805 High Brightness CHIP LED' },
    model: 'GP0805-HB',
    categorySlug: 'chip-led',
    description: {
      zh: '0805封装高亮度LED，平衡尺寸与亮度，适用于各类消费电子产品',
      en: '0805 package high brightness LED, balancing size and brightness for consumer electronics',
    },
    shortDescription: { zh: '高亮度指示灯', en: 'High brightness indicator' },
    features: {
      zh: ['尺寸：2.0×1.25×0.8mm', '多种颜色可选', '宽视角设计', '长寿命'],
      en: ['Size: 2.0×1.25×0.8mm', 'Multiple colors available', 'Wide viewing angle', 'Long lifespan'],
    },
    applications: {
      zh: ['平板电脑', '路由器', '充电器', '小家电'],
      en: ['Tablets', 'Routers', 'Chargers', 'Small appliances'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam', 'middle-east'],
    status: 'active',
    orderRank: 2,
  },
  {
    _type: 'product',
    name: { zh: '1206 大功率CHIP LED', en: '1206 High Power CHIP LED' },
    model: 'GP1206-HP',
    categorySlug: 'chip-led',
    description: {
      zh: '1206封装大功率LED，适用于需要更高亮度的应用场景',
      en: '1206 package high power LED for applications requiring higher brightness',
    },
    shortDescription: { zh: '大功率指示灯', en: 'High power indicator' },
    features: {
      zh: ['尺寸：3.2×1.6×1.1mm', '高功率输出', '优异散热性能', '稳定可靠'],
      en: ['Size: 3.2×1.6×1.1mm', 'High power output', 'Excellent heat dissipation', 'Stable and reliable'],
    },
    applications: {
      zh: ['汽车电子', '工业控制', '医疗设备', '仪器仪表'],
      en: ['Automotive electronics', 'Industrial control', 'Medical devices', 'Instrumentation'],
    },
    targetMarkets: ['middle-east', 'malaysia'],
    status: 'active',
    orderRank: 3,
  },
  // PLCC LED - 照明类
  {
    _type: 'product',
    name: { zh: 'PLCC-2 白光LED', en: 'PLCC-2 White LED' },
    model: 'GP-PLCC2-W',
    categorySlug: 'plcc-led',
    description: {
      zh: 'PLCC-2封装白光LED，高光效，适用于背光和照明应用',
      en: 'PLCC-2 package white LED with high luminous efficacy for backlight and lighting',
    },
    shortDescription: { zh: '高光效白光LED', en: 'High efficacy white LED' },
    features: {
      zh: ['色温：3000K-6500K可选', 'CRI>80', '光效：120-150lm/W', '低热阻封装'],
      en: ['CCT: 3000K-6500K options', 'CRI>80', 'Efficacy: 120-150lm/W', 'Low thermal resistance'],
    },
    applications: {
      zh: ['LCD背光', '面板灯', '灯管', '筒灯'],
      en: ['LCD backlight', 'Panel lights', 'Tube lights', 'Downlights'],
    },
    targetMarkets: ['indonesia', 'thailand', 'vietnam', 'middle-east'],
    status: 'active',
    orderRank: 4,
  },
  {
    _type: 'product',
    name: { zh: 'PLCC-4 RGB LED', en: 'PLCC-4 RGB LED' },
    model: 'GP-PLCC4-RGB',
    categorySlug: 'plcc-led',
    description: {
      zh: 'PLCC-4封装RGB全彩LED，内置IC控制，实现丰富色彩效果',
      en: 'PLCC-4 package RGB full-color LED with built-in IC control for rich color effects',
    },
    shortDescription: { zh: '全彩RGB LED', en: 'Full color RGB LED' },
    features: {
      zh: ['内置控制IC', '1670万色彩', '单线数据传输', '可级联控制'],
      en: ['Built-in control IC', '16.7 million colors', 'Single-wire data', 'Cascade control'],
    },
    applications: {
      zh: ['氛围灯', '装饰照明', '广告灯箱', '舞台灯光'],
      en: ['Ambient lighting', 'Decorative lighting', 'Light boxes', 'Stage lighting'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'thailand'],
    status: 'active',
    orderRank: 5,
  },
  {
    _type: 'product',
    name: { zh: 'PLCC-6 高亮白光LED', en: 'PLCC-6 High Brightness White LED' },
    model: 'GP-PLCC6-HB',
    categorySlug: 'plcc-led',
    description: {
      zh: 'PLCC-6封装超高亮度白光LED，适用于大功率照明应用',
      en: 'PLCC-6 package ultra-high brightness white LED for high-power lighting applications',
    },
    shortDescription: { zh: '超高亮白光LED', en: 'Ultra bright white LED' },
    features: {
      zh: ['功率：0.5W-1W', '光通量：80-150lm', '热阻：<10K/W', 'ESD防护'],
      en: ['Power: 0.5W-1W', 'Luminous flux: 80-150lm', 'Thermal resistance: <10K/W', 'ESD protection'],
    },
    applications: {
      zh: ['路灯', '投光灯', '工矿灯', '商业照明'],
      en: ['Street lights', 'Floodlights', 'High-bay lights', 'Commercial lighting'],
    },
    targetMarkets: ['middle-east', 'vietnam', 'indonesia'],
    status: 'active',
    orderRank: 6,
  },
  // 红外传感器 - 家电控制类
  {
    _type: 'product',
    name: { zh: '940nm 红外发射管', en: '940nm IR Emitter' },
    model: 'GP-IR940-E',
    categorySlug: 'ir-sensors',
    description: {
      zh: '940nm波长红外发射管，高辐射强度，适用于遥控和感应应用',
      en: '940nm wavelength IR emitter with high radiant intensity for remote control and sensing',
    },
    shortDescription: { zh: '标准红外发射管', en: 'Standard IR emitter' },
    features: {
      zh: ['波长：940nm', '视角：±30°', '低正向电压', '高可靠性'],
      en: ['Wavelength: 940nm', 'Viewing angle: ±30°', 'Low forward voltage', 'High reliability'],
    },
    applications: {
      zh: ['电视遥控', '空调遥控', '机顶盒', '红外感应'],
      en: ['TV remote', 'AC remote', 'Set-top boxes', 'IR sensing'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam', 'middle-east'],
    status: 'active',
    orderRank: 7,
  },
  {
    _type: 'product',
    name: { zh: '850nm 红外发射管', en: '850nm IR Emitter' },
    model: 'GP-IR850-E',
    categorySlug: 'ir-sensors',
    description: {
      zh: '850nm波长红外发射管，适用于安防监控和夜视应用',
      en: '850nm wavelength IR emitter for security monitoring and night vision applications',
    },
    shortDescription: { zh: '安防级红外发射管', en: 'Security grade IR emitter' },
    features: {
      zh: ['波长：850nm', '高辐射功率', '低衰减', '长寿命'],
      en: ['Wavelength: 850nm', 'High radiant power', 'Low attenuation', 'Long lifespan'],
    },
    applications: {
      zh: ['监控摄像头', '夜视仪', '红外照明', '人脸识别'],
      en: ['CCTV cameras', 'Night vision', 'IR illumination', 'Face recognition'],
    },
    targetMarkets: ['middle-east', 'malaysia', 'thailand'],
    status: 'active',
    orderRank: 8,
  },
  {
    _type: 'product',
    name: { zh: '红外接收头', en: 'IR Receiver Module' },
    model: 'GP-IR-RX',
    categorySlug: 'ir-sensors',
    description: {
      zh: '一体化红外接收头，内置解调电路，抗干扰能力强',
      en: 'Integrated IR receiver module with built-in demodulation circuit and strong anti-interference',
    },
    shortDescription: { zh: '一体化红外接收', en: 'Integrated IR receiver' },
    features: {
      zh: ['载波频率：38kHz', '接收距离：15-30m', '低功耗', '抗环境光干扰'],
      en: ['Carrier frequency: 38kHz', 'Receiving distance: 15-30m', 'Low power', 'Anti-ambient light'],
    },
    applications: {
      zh: ['家电遥控', '工业遥控', '智能开关', '自动门控'],
      en: ['Appliance remote', 'Industrial remote', 'Smart switches', 'Automatic doors'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam'],
    status: 'active',
    orderRank: 9,
  },
  {
    _type: 'product',
    name: { zh: '红外对射传感器', en: 'IR Beam Sensor' },
    model: 'GP-IR-BEAM',
    categorySlug: 'ir-sensors',
    description: {
      zh: '红外对射式传感器，用于物体检测和距离感应',
      en: 'IR beam sensor for object detection and distance sensing',
    },
    shortDescription: { zh: '红外对射传感器', en: 'IR beam sensor' },
    features: {
      zh: ['检测距离：1-5m', '响应速度快', 'NPN/PNP输出可选', 'IP65防护'],
      en: ['Detection range: 1-5m', 'Fast response', 'NPN/PNP output options', 'IP65 rated'],
    },
    applications: {
      zh: ['自动感应', '计数器', '安全防护', '生产线检测'],
      en: ['Auto sensing', 'Counters', 'Safety protection', 'Production line detection'],
    },
    targetMarkets: ['middle-east', 'malaysia', 'indonesia'],
    status: 'active',
    orderRank: 10,
  },
  // UV LED
  {
    _type: 'product',
    name: { zh: 'UVC 275nm 消毒LED', en: 'UVC 275nm Disinfection LED' },
    model: 'GP-UVC-275',
    categorySlug: 'uv-led',
    description: {
      zh: '深紫外UVC LED，高效杀菌消毒，适用于水处理和空气净化',
      en: 'Deep UV UVC LED for efficient sterilization, suitable for water treatment and air purification',
    },
    shortDescription: { zh: '深紫外消毒LED', en: 'Deep UV disinfection LED' },
    features: {
      zh: ['波长：275nm', '杀菌率：99.9%', '无汞环保', '瞬时启动'],
      en: ['Wavelength: 275nm', 'Sterilization rate: 99.9%', 'Mercury-free', 'Instant start'],
    },
    applications: {
      zh: ['净水器', '空气净化器', '消毒柜', '医疗消毒'],
      en: ['Water purifiers', 'Air purifiers', 'Disinfection cabinets', 'Medical disinfection'],
    },
    targetMarkets: ['middle-east', 'malaysia', 'thailand'],
    status: 'active',
    orderRank: 11,
  },
  {
    _type: 'product',
    name: { zh: 'UVA 365nm 固化LED', en: 'UVA 365nm Curing LED' },
    model: 'GP-UVA-365',
    categorySlug: 'uv-led',
    description: {
      zh: 'UVA 365nm紫外LED，适用于UV胶固化和荧光检测',
      en: 'UVA 365nm UV LED for UV adhesive curing and fluorescence detection',
    },
    shortDescription: { zh: 'UV固化LED', en: 'UV curing LED' },
    features: {
      zh: ['波长：365nm', '高光功率密度', '均匀性好', '长寿命'],
      en: ['Wavelength: 365nm', 'High optical power density', 'Good uniformity', 'Long lifespan'],
    },
    applications: {
      zh: ['UV胶固化', '印刷固化', '3D打印', '荧光检测'],
      en: ['UV adhesive curing', 'Printing curing', '3D printing', 'Fluorescence detection'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'vietnam', 'middle-east'],
    status: 'active',
    orderRank: 12,
  },
  {
    _type: 'product',
    name: { zh: 'UVA 395nm 大功率LED', en: 'UVA 395nm High Power LED' },
    model: 'GP-UVA-395',
    categorySlug: 'uv-led',
    description: {
      zh: 'UVA 395nm大功率紫外LED，适用于工业固化和印刷',
      en: 'UVA 395nm high power UV LED for industrial curing and printing',
    },
    shortDescription: { zh: '大功率UV LED', en: 'High power UV LED' },
    features: {
      zh: ['波长：395nm', '功率：3W-10W', 'COB封装', '高能量输出'],
      en: ['Wavelength: 395nm', 'Power: 3W-10W', 'COB package', 'High energy output'],
    },
    applications: {
      zh: ['工业固化', '丝网印刷', '木器涂装', '电子封装'],
      en: ['Industrial curing', 'Screen printing', 'Wood coating', 'Electronic packaging'],
    },
    targetMarkets: ['middle-east', 'malaysia', 'thailand'],
    status: 'active',
    orderRank: 13,
  },
  {
    _type: 'product',
    name: { zh: 'UVB 310nm LED', en: 'UVB 310nm LED' },
    model: 'GP-UVB-310',
    categorySlug: 'uv-led',
    description: {
      zh: 'UVB 310nm紫外LED，适用于光疗和植物生长',
      en: 'UVB 310nm UV LED for phototherapy and plant growth',
    },
    shortDescription: { zh: 'UVB光疗LED', en: 'UVB phototherapy LED' },
    features: {
      zh: ['波长：310nm', '窄波段输出', '稳定可靠', '医疗级品质'],
      en: ['Wavelength: 310nm', 'Narrow band output', 'Stable and reliable', 'Medical grade'],
    },
    applications: {
      zh: ['光疗设备', '植物补光', '维生素D合成', '科研实验'],
      en: ['Phototherapy devices', 'Plant lighting', 'Vitamin D synthesis', 'Scientific research'],
    },
    targetMarkets: ['middle-east', 'malaysia'],
    status: 'active',
    orderRank: 14,
  },
  // 更多CHIP LED产品
  {
    _type: 'product',
    name: { zh: '0402 微型CHIP LED', en: '0402 Micro CHIP LED' },
    model: 'GP0402-01',
    categorySlug: 'chip-led',
    description: {
      zh: '超微型0402封装，适用于超紧凑电子产品',
      en: 'Ultra-micro 0402 package for ultra-compact electronic products',
    },
    shortDescription: { zh: '微型指示灯', en: 'Micro indicator LED' },
    features: {
      zh: ['尺寸：1.0×0.5×0.35mm', '超轻薄', '高可靠性', '自动化贴装友好'],
      en: ['Size: 1.0×0.5×0.35mm', 'Ultra thin', 'High reliability', 'SMT friendly'],
    },
    applications: {
      zh: ['TWS耳机', '智能手环', '微型传感器', '医疗器械'],
      en: ['TWS earphones', 'Smart bands', 'Micro sensors', 'Medical devices'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'vietnam'],
    status: 'active',
    orderRank: 15,
  },
  {
    _type: 'product',
    name: { zh: '1210 双色CHIP LED', en: '1210 Bi-color CHIP LED' },
    model: 'GP1210-BC',
    categorySlug: 'chip-led',
    description: {
      zh: '1210封装双色LED，红绿/红蓝组合，状态指示更灵活',
      en: '1210 package bi-color LED with red/green or red/blue combinations',
    },
    shortDescription: { zh: '双色指示灯', en: 'Bi-color indicator' },
    features: {
      zh: ['尺寸：3.2×2.5×1.1mm', '双色独立控制', '共阴/共阳可选', '高对比度'],
      en: ['Size: 3.2×2.5×1.1mm', 'Dual color independent control', 'Common cathode/anode', 'High contrast'],
    },
    applications: {
      zh: ['充电器状态', '电池指示', '网络设备', '工业控制'],
      en: ['Charger status', 'Battery indicators', 'Network devices', 'Industrial control'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam'],
    status: 'active',
    orderRank: 16,
  },
  // 更多红外产品
  {
    _type: 'product',
    name: { zh: '贴片式红外发射管', en: 'SMD IR Emitter' },
    model: 'GP-SMD-IR',
    categorySlug: 'ir-sensors',
    description: {
      zh: '表面贴装红外发射管，适用于自动化生产的电子产品',
      en: 'Surface mount IR emitter for automated production of electronic products',
    },
    shortDescription: { zh: '贴片红外发射', en: 'SMD IR emitter' },
    features: {
      zh: ['1206/0805封装可选', '回流焊兼容', '高一致性', '卷带包装'],
      en: ['1206/0805 packages', 'Reflow compatible', 'High consistency', 'Tape & reel'],
    },
    applications: {
      zh: ['智能手机', '平板电脑', '智能家居', '可穿戴设备'],
      en: ['Smartphones', 'Tablets', 'Smart home', 'Wearables'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam'],
    status: 'active',
    orderRank: 17,
  },
  {
    _type: 'product',
    name: { zh: '高速红外接收管', en: 'High Speed IR Receiver' },
    model: 'GP-IR-HS',
    categorySlug: 'ir-sensors',
    description: {
      zh: '高速响应红外接收管，适用于高速数据传输',
      en: 'High speed response IR receiver for high-speed data transmission',
    },
    shortDescription: { zh: '高速红外接收', en: 'High speed IR receiver' },
    features: {
      zh: ['响应时间：<10μs', '高灵敏度', '宽光谱响应', '低电容'],
      en: ['Response time: <10μs', 'High sensitivity', 'Wide spectral response', 'Low capacitance'],
    },
    applications: {
      zh: ['光纤通信', '高速遥控', '数据通信', '传感器'],
      en: ['Fiber optic communication', 'High-speed remote', 'Data communication', 'Sensors'],
    },
    targetMarkets: ['middle-east', 'malaysia'],
    status: 'active',
    orderRank: 18,
  },
  // 更多PLCC产品
  {
    _type: 'product',
    name: { zh: 'PLCC-2 红光LED', en: 'PLCC-2 Red LED' },
    model: 'GP-PLCC2-R',
    categorySlug: 'plcc-led',
    description: {
      zh: 'PLCC-2封装红光LED，适用于信号指示和装饰照明',
      en: 'PLCC-2 package red LED for signal indication and decorative lighting',
    },
    shortDescription: { zh: '高亮红光LED', en: 'High brightness red LED' },
    features: {
      zh: ['波长：620-625nm', '高亮度', '低光衰', '多种视角可选'],
      en: ['Wavelength: 620-625nm', 'High brightness', 'Low light decay', 'Multiple viewing angles'],
    },
    applications: {
      zh: ['交通信号', '警示灯', '装饰灯', '显示屏'],
      en: ['Traffic signals', 'Warning lights', 'Decorative lights', 'Displays'],
    },
    targetMarkets: ['malaysia', 'indonesia', 'thailand', 'vietnam', 'middle-east'],
    status: 'active',
    orderRank: 19,
  },
  {
    _type: 'product',
    name: { zh: 'PLCC-4 双色温LED', en: 'PLCC-4 Dual White LED' },
    model: 'GP-PLCC4-CCT',
    categorySlug: 'plcc-led',
    description: {
      zh: 'PLCC-4封装双色温LED，可调色温2700K-6500K',
      en: 'PLCC-4 package dual CCT LED, adjustable from 2700K to 6500K',
    },
    shortDescription: { zh: '可调色温LED', en: 'Adjustable CCT LED' },
    features: {
      zh: ['色温范围：2700K-6500K', '独立通道控制', '平滑调光', '高显色性'],
      en: ['CCT range: 2700K-6500K', 'Independent channel control', 'Smooth dimming', 'High CRI'],
    },
    applications: {
      zh: ['智能照明', '面板灯', '筒灯', '台灯'],
      en: ['Smart lighting', 'Panel lights', 'Downlights', 'Desk lamps'],
    },
    targetMarkets: ['middle-east', 'malaysia', 'thailand'],
    status: 'active',
    orderRank: 20,
  },
];

async function seedProducts() {
  console.log('开始初始化产品数据...');
  
  for (const product of products) {
    try {
      // 获取分类引用
      const category = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]{_id}`,
        { slug: product.categorySlug }
      );
      
      if (!category) {
        console.error(`分类不存在: ${product.categorySlug}，跳过产品: ${product.name.zh}`);
        continue;
      }
      
      // 检查产品是否已存在
      const existing = await client.fetch(
        `*[_type == "product" && model == $model][0]`,
        { model: product.model }
      );
      
      if (existing) {
        console.log(`产品已存在: ${product.name.zh}`);
        continue;
      }
      
      // 构建产品文档
      const productDoc = {
        _type: 'product',
        name: product.name,
        slug: {
          current: product.model.toLowerCase().replace(/\s+/g, '-'),
        },
        model: product.model,
        category: {
          _type: 'reference',
          _ref: category._id,
        },
        description: product.description,
        shortDescription: product.shortDescription,
        features: product.features,
        applications: product.applications,
        targetMarkets: product.targetMarkets,
        status: product.status,
        orderRank: product.orderRank,
      };
      
      const result = await client.create(productDoc);
      console.log(`创建产品成功: ${product.name.zh} (ID: ${result._id})`);
    } catch (error) {
      console.error(`创建产品失败: ${product.name.zh}`, error);
    }
  }
  
  console.log('产品数据初始化完成！');
}

seedProducts();
