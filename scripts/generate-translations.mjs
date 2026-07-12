import fs from 'node:fs/promises';
import https from 'node:https';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { workspaceLocalizationOverrides } from './localization-overrides.mjs';

const traverse = traverseModule.default;
const sourcePaths = [
  new URL('../src/main.jsx', import.meta.url),
  new URL('../src/pageConfig.js', import.meta.url),
  new URL('../src/api.js', import.meta.url),
];
const outputDirectory = new URL('../src/locales/', import.meta.url);
const localeTargets = {
  'en-US': 'en',
  'zh-CN': 'zh-Hans',
  'zh-TW': 'zh-Hant',
  'es-MX': 'es',
  'fr-FR': 'fr',
  'ru-RU': 'ru',
  'de-DE': 'de',
  'pt-PT': 'pt-pt',
  'ar-AE': 'ar',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'id-ID': 'id',
  'vi-VN': 'vi',
  'tr-TR': 'tr',
  'nl-NL': 'nl',
  'uk-UA': 'uk',
  'th-TH': 'th',
  'pl-PL': 'pl',
  'ro-RO': 'ro',
  'el-GR': 'el',
  'cs-CZ': 'cs',
  'fi-FI': 'fi',
  'hi-IN': 'hi',
};
const localeOverrides = {
  'en-US': {
    '消息通知': 'Notifications',
    '全部已读': 'Mark all as read',
    '登录后查看任务通知': 'Sign in to view task notifications',
    '正在同步任务进度…': 'Syncing task progress…',
    '暂无任务通知': 'No task notifications yet',
    '每分钟自动同步': 'Syncs automatically every minute',
    '开启桌面提醒': 'Enable desktop notifications',
    '桌面提醒已开启': 'Desktop notifications enabled',
    '生产预览': 'Production preview',
    '文案助手': 'Script Assistant',
    '配音': 'Voiceover',
    '套餐用量': 'Plan usage',
    '人工智能内容制作工作空间': 'AI Content Production Workspace',
    '关于我们': 'About us',
    '官方媒体': 'Official media',
    '合规': 'Compliance',
    '专项授权': 'Specific authorizations',
    '协议中心': 'Agreement center',
    '联系我们': 'Contact us',
  },
  'zh-CN': {
    'Digital Human Asset Management': '数字人资产管理',
    'Go home': '返回首页',
    'Primary navigation': '主导航',
    Collapse: '收起',
    Home: '首页',
    'Hot Trends': '热点追踪',
    'AI Assistant': 'AI 助手',
    'Video Studio': '视频工作台',
    'Asset Studio': '资产工作台',
    'Music Studio': '音乐工作台',
    'Image Studio': '图片工作台',
    Materials: '素材',
    Templates: '模板',
    Billing: '套餐',
    Settings: '设置',
    'Sign in': '登录',
    'Sign out': '退出',
    'New Video': '新建视频',
    'Ready to create': '准备创作',
    'Start production with the same Yixiu trial package.': '使用亿秀同款试用套餐开始创作。',
    '1 Digital Human': '1 个数字人',
    '1 Voice': '1 个声音',
    '3 AI Videos': '3 个 AI 视频',
    'AI asset workbench': 'AI 资产工作台',
    'Hot Tracking': '热点追踪',
    'Aggregate global and media trends for script ideas.': '聚合全球与媒体热点，快速获得文案灵感。',
    'Script Assistant': '文案助手',
    'Instruction sets for copy, music, image, and video workflows.': '用指令集支持文案、音乐、图片和视频创作流程。',
    'Digital Human': '数字人',
    'Train and manage presenter avatars for video production.': '训练并管理用于视频制作的数字人形象。',
    'Voice Clone': '声音克隆',
    'Create multilingual voice assets with consent-first flows.': '通过明确授权流程创建多语言声音资产。',
    'AI Music': 'AI 音乐',
    'Generate prompt songs, lyrics songs, instrumentals, and music videos.': '生成描述歌曲、歌词歌曲、纯音乐和音乐视频。',
    'Image Generation': '图片生成',
    'Create campaign images and convert selected images into avatars.': '生成营销场景图片，并将选中图片制作成数字人。',
    'Combine scripts, avatars, voices, templates, covers, materials, and music.': '组合文案、数字人、声音、模板、封面、素材和音乐。',
    'Upload, preview, select, and reuse creative assets.': '上传、预览、选择并复用创作素材。',
    'Production preview': '制作预览',
    'Web replacement for the mini program video creation flow': 'Web 版小程序视频创作流程',
    'Upload material': '上传素材',
    'Mixed Video': '智能成片',
    'Talking Avatar': '数字人口播',
    'Play preview': '播放预览',
    Script: '文案',
    Selected: '已选择',
    Choose: '选择',
    'The original mini program flow mapped to a web console.': '将小程序原有流程映射为 Web 工作台。',
    'Capture trend': '捕捉热点',
    'Find a topic and save it into the script flow.': '选择一个话题并保存到文案创作流程。',
    'Generate script': '生成文案',
    'Use an instruction set to draft copy, lyrics, or video structure.': '使用指令集生成文案、歌词或视频结构。',
    'Select assets': '选择资产',
    'Choose digital human, voice, music, templates, cover, and materials.': '选择数字人、声音、音乐、模板、封面和素材。',
    'Produce and publish': '制作并发布',
    'Create a task, review output, publish now or schedule.': '创建任务、审核结果，并立即或定时发布。',
    'Current workspace quota': '当前工作台额度',
    'Upgrade plan': '升级套餐',
    'Latest trend data is ready.': '最新热点数据已就绪。',
    'Trend preview is ready.': '热点预览已就绪。',
  },
  'zh-TW': {
    'Digital Human Asset Management': '數位人資產管理',
    'Go home': '返回首頁',
    'Primary navigation': '主導覽',
    Collapse: '收合',
    Home: '首頁',
    'Hot Trends': '熱點追蹤',
    'AI Assistant': 'AI 助手',
    'Video Studio': '影片工作台',
    'Asset Studio': '資產工作台',
    'Music Studio': '音樂工作台',
    'Image Studio': '圖片工作台',
    Materials: '素材',
    Templates: '範本',
    Billing: '方案與計費',
    Settings: '設定',
    'Sign in': '登入',
    'Sign out': '登出',
    'New Video': '新增影片',
    'Ready to create': '準備創作',
    'Start production with the same Yixiu trial package.': '使用亿秀同款试用方案开始创作。',
    '1 Digital Human': '1 個數位人',
    '1 Voice': '1 個聲音',
    '3 AI Videos': '3 個 AI 影片',
    'AI asset workbench': 'AI 資產工作台',
    'Hot Tracking': '熱點追蹤',
    'Aggregate global and media trends for script ideas.': '聚合全球與媒體熱點，快速取得文案靈感。',
    'Script Assistant': '文案助手',
    'Instruction sets for copy, music, image, and video workflows.': '使用指令集支援文案、音樂、圖片與影片創作流程。',
    'Digital Human': '數位人',
    'Train and manage presenter avatars for video production.': '訓練並管理用於影片製作的數位人形象。',
    'Voice Clone': '聲音複製',
    'Create multilingual voice assets with consent-first flows.': '透過明確授權流程建立多語言聲音資產。',
    'AI Music': 'AI 音樂',
    'Image Generation': '圖片生成',
    'Production preview': '製作預覽',
    'Upload material': '上傳素材',
    'Mixed Video': '智慧成片',
    'Talking Avatar': '數位人口播',
    'Play preview': '播放預覽',
    Script: '文案',
    Selected: '已選擇',
    Choose: '選擇',
    'Capture trend': '捕捉熱點',
    'Generate script': '生成文案',
    'Select assets': '選擇資產',
    'Produce and publish': '製作並發佈',
    'Current workspace quota': '目前工作台額度',
    'Upgrade plan': '升級方案',
  },
};

const navigationKeys = ['Home', 'Hot Trends', 'AI Assistant', 'Video Studio', 'Asset Studio', 'Music Studio', 'Image Studio', 'Materials', 'Templates', 'Billing', 'Settings', 'Sign in', 'Sign out', 'New Video', 'Collapse'];
const navigationOverrides = {
  'en-US': ['Home', 'Trends', 'AI Assistant', 'Video', 'Assets', 'Music', 'Images', 'Media', 'Templates', 'Plans & billing', 'Settings', 'Sign in', 'Sign out', 'New video', 'Collapse'],
  'zh-CN': ['首页', '热点', 'AI 助手', '视频', '资产', '音乐', '图片', '素材', '模板', '套餐与账单', '设置', '登录', '退出', '新建视频', '收起'],
  'zh-TW': ['首頁', '熱點', 'AI 助手', '影片', '資產', '音樂', '圖片', '素材', '範本', '方案與帳單', '設定', '登入', '登出', '新增影片', '收合'],
  'es-MX': ['Inicio', 'Tendencias', 'Asistente de IA', 'Video', 'Recursos', 'Música', 'Imágenes', 'Contenido', 'Plantillas', 'Planes y facturación', 'Configuración', 'Iniciar sesión', 'Cerrar sesión', 'Nuevo video', 'Contraer'],
  'fr-FR': ['Accueil', 'Tendances', 'Assistant IA', 'Vidéo', 'Ressources', 'Musique', 'Images', 'Médias', 'Modèles', 'Abonnement et facturation', 'Paramètres', 'Se connecter', 'Se déconnecter', 'Nouvelle vidéo', 'Réduire'],
  'ru-RU': ['Главная', 'Тренды', 'ИИ-ассистент', 'Видео', 'Ресурсы', 'Музыка', 'Изображения', 'Медиа', 'Шаблоны', 'Тариф и оплата', 'Настройки', 'Войти', 'Выйти', 'Новое видео', 'Свернуть'],
  'de-DE': ['Startseite', 'Trends', 'KI-Assistent', 'Video', 'Assets', 'Musik', 'Bilder', 'Medien', 'Vorlagen', 'Tarif und Abrechnung', 'Einstellungen', 'Anmelden', 'Abmelden', 'Neues Video', 'Einklappen'],
  'pt-PT': ['Início', 'Tendências', 'Assistente de IA', 'Vídeo', 'Recursos', 'Música', 'Imagens', 'Multimédia', 'Modelos', 'Plano e faturação', 'Definições', 'Iniciar sessão', 'Terminar sessão', 'Novo vídeo', 'Recolher'],
  'ar-AE': ['الرئيسية', 'الرائج', 'مساعد الذكاء الاصطناعي', 'الفيديو', 'الأصول', 'الموسيقى', 'الصور', 'الوسائط', 'القوالب', 'الخطة والفوترة', 'الإعدادات', 'تسجيل الدخول', 'تسجيل الخروج', 'فيديو جديد', 'طي'],
  'it-IT': ['Home', 'Tendenze', 'Assistente IA', 'Video', 'Risorse', 'Musica', 'Immagini', 'Contenuti multimediali', 'Modelli', 'Piano e fatturazione', 'Impostazioni', 'Accedi', 'Esci', 'Nuovo video', 'Comprimi'],
  'ja-JP': ['ホーム', 'トレンド', 'AIアシスタント', '動画', 'アセット', '音楽', '画像', '素材', 'テンプレート', 'プランと請求', '設定', 'ログイン', 'ログアウト', '新規動画', '折りたたむ'],
  'ko-KR': ['홈', '트렌드', 'AI 어시스턴트', '비디오', '에셋', '음악', '이미지', '미디어', '템플릿', '요금제 및 결제', '설정', '로그인', '로그아웃', '새 비디오', '접기'],
  'id-ID': ['Beranda', 'Tren', 'Asisten AI', 'Video', 'Aset', 'Musik', 'Gambar', 'Media', 'Templat', 'Paket & Tagihan', 'Pengaturan', 'Masuk', 'Keluar', 'Video Baru', 'Ciutkan'],
  'vi-VN': ['Trang chủ', 'Xu hướng', 'Trợ lý AI', 'Video', 'Tài nguyên', 'Âm nhạc', 'Hình ảnh', 'Thư viện', 'Mẫu', 'Gói & thanh toán', 'Cài đặt', 'Đăng nhập', 'Đăng xuất', 'Video mới', 'Thu gọn'],
  'tr-TR': ['Ana Sayfa', 'Trendler', 'AI Asistanı', 'Video', 'Varlıklar', 'Müzik', 'Görseller', 'Medya', 'Şablonlar', 'Plan ve Faturalandırma', 'Ayarlar', 'Giriş yap', 'Çıkış yap', 'Yeni Video', 'Daralt'],
  'nl-NL': ['Start', 'Trends', 'AI-assistent', 'Video', 'Assets', 'Muziek', 'Afbeeldingen', 'Media', 'Sjablonen', 'Abonnement en facturering', 'Instellingen', 'Inloggen', 'Uitloggen', 'Nieuwe video', 'Inklappen'],
  'uk-UA': ['Головна', 'Тренди', 'AI-помічник', 'Відео', 'Ресурси', 'Музика', 'Зображення', 'Медіа', 'Шаблони', 'Тариф і оплата', 'Налаштування', 'Увійти', 'Вийти', 'Нове відео', 'Згорнути'],
  'th-TH': ['หน้าหลัก', 'เทรนด์ยอดนิยม', 'ผู้ช่วย AI', 'สตูดิโอวิดีโอ', 'สตูดิโอแอสเซท', 'สตูดิโอเพลง', 'สตูดิโอรูปภาพ', 'สื่อ', 'เทมเพลต', 'แพ็กเกจและการเรียกเก็บเงิน', 'การตั้งค่า', 'เข้าสู่ระบบ', 'ออกจากระบบ', 'วิดีโอใหม่', 'ย่อ'],
  'pl-PL': ['Strona główna', 'Trendy', 'Asystent AI', 'Wideo', 'Zasoby', 'Muzyka', 'Obrazy', 'Multimedia', 'Szablony', 'Plan i rozliczenia', 'Ustawienia', 'Zaloguj się', 'Wyloguj się', 'Nowe wideo', 'Zwiń'],
  'ro-RO': ['Acasă', 'Tendințe', 'Asistent AI', 'Video', 'Resurse', 'Muzică', 'Imagini', 'Conținut media', 'Șabloane', 'Plan și facturare', 'Setări', 'Autentificare', 'Deconectare', 'Videoclip nou', 'Restrânge'],
  'el-GR': ['Αρχική', 'Τάσεις', 'Βοηθός AI', 'Βίντεο', 'Πόροι', 'Μουσική', 'Εικόνες', 'Πολυμέσα', 'Πρότυπα', 'Πρόγραμμα και χρέωση', 'Ρυθμίσεις', 'Σύνδεση', 'Αποσύνδεση', 'Νέο βίντεο', 'Σύμπτυξη'],
  'cs-CZ': ['Domů', 'Trendy', 'AI asistent', 'Video', 'Prostředky', 'Hudba', 'Obrázky', 'Média', 'Šablony', 'Tarif a fakturace', 'Nastavení', 'Přihlásit se', 'Odhlásit se', 'Nové video', 'Sbalit'],
  'fi-FI': ['Etusivu', 'Trendit', 'Tekoälyavustaja', 'Video', 'Resurssit', 'Musiikki', 'Kuvat', 'Media', 'Mallit', 'Tilaus ja laskutus', 'Asetukset', 'Kirjaudu sisään', 'Kirjaudu ulos', 'Uusi video', 'Kutista'],
  'hi-IN': ['होम', 'ट्रेंड', 'AI सहायक', 'वीडियो', 'एसेट', 'संगीत', 'इमेज', 'मीडिया', 'टेमप्लेट', 'प्लान और बिलिंग', 'सेटिंग्स', 'साइन इन', 'साइन आउट', 'नया वीडियो', 'संक्षिप्त करें'],
};

Object.entries(navigationOverrides).forEach(([locale, values]) => {
  localeOverrides[locale] = {
    ...(localeOverrides[locale] || {}),
    ...Object.fromEntries(navigationKeys.map((key, index) => [key, values[index]])),
  };
});

const digitalHumanAssetManagementOverrides = {
  'en-US': 'Digital Human Asset Management',
  'zh-CN': '数字人资产管理',
  'zh-TW': '數位人資產管理',
  'es-MX': 'Gestión de activos de humanos digitales',
  'fr-FR': 'Gestion des ressources d’humains numériques',
  'ru-RU': 'Управление цифровыми аватарами',
  'de-DE': 'Verwaltung digitaler Avatare',
  'pt-PT': 'Gestão de ativos de humanos digitais',
  'ar-AE': 'إدارة أصول البشر الرقميين',
  'it-IT': 'Gestione delle risorse degli umani digitali',
  'ja-JP': 'デジタルヒューマン資産管理',
  'ko-KR': '디지털 휴먼 자산 관리',
  'id-ID': 'Pengelolaan Aset Manusia Digital',
  'vi-VN': 'Quản lý tài sản người kỹ thuật số',
  'tr-TR': 'Dijital İnsan Varlık Yönetimi',
  'nl-NL': 'Beheer van digitale menselijke assets',
  'uk-UA': 'Керування цифровими аватарами',
  'th-TH': 'การจัดการสินทรัพย์มนุษย์ดิจิทัล',
  'pl-PL': 'Zarządzanie zasobami cyfrowych postaci',
  'ro-RO': 'Gestionarea activelor umane digitale',
  'el-GR': 'Διαχείριση ψηφιακών ανθρώπινων πόρων',
  'cs-CZ': 'Správa digitálních lidských prostředků',
  'fi-FI': 'Digitaalisten ihmishahmojen hallinta',
  'hi-IN': 'डिजिटल ह्यूमन एसेट प्रबंधन',
};
Object.entries(digitalHumanAssetManagementOverrides).forEach(([locale, translation]) => {
  localeOverrides[locale] = {
    ...(localeOverrides[locale] || {}),
    'Digital Human Asset Management': translation,
  };
});

Object.entries(workspaceLocalizationOverrides).forEach(([locale, overrides]) => {
  localeOverrides[locale] = { ...(localeOverrides[locale] || {}), ...overrides };
});

const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
const looksUserFacing = (value) => {
  if (!value || value.length > 900 || !/[A-Za-z\u00c0-\u024f\u0370-\u03ff\u0400-\u04ff\u0600-\u06ff\u0900-\u097f\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/u.test(value)) return false;
  if (/^(https?:|\/api\/|mailto:|[.#][\w-]+$)/i.test(value)) return false;
  if (/^[a-z]+(?:_[a-z0-9]+){1,}$/i.test(value)) return false;
  if (/^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)$/i.test(value)) return false;
  if (/^[\w-]+\/(?:[\w.-]+\/)*[\w.-]+$/.test(value)) return false;
  return true;
};

const phrases = new Set();
const add = (value) => {
  const normalized = normalize(value);
  if (looksUserFacing(normalized)) phrases.add(normalized);
};

for (const sourcePath of sourcePaths) {
  const source = await fs.readFile(sourcePath, 'utf8');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  traverse(ast, {
    JSXText(path) {
      add(path.node.value);
    },
    StringLiteral(path) {
      const parent = path.parent;
      if (parent.type === 'ImportDeclaration') return;
      if (parent.type === 'JSXAttribute' && !['placeholder', 'title', 'aria-label', 'alt'].includes(parent.name?.name)) return;
      add(path.node.value);
    },
    TemplateLiteral(path) {
      path.node.quasis.forEach((quasi) => add(quasi.value.cooked));
    },
  });
}

const texts = [...phrases].sort((a, b) => a.localeCompare(b, 'en'));

if (process.argv.includes('--apply-overrides')) {
  await Promise.all(Object.entries(localeOverrides).map(async ([locale, overrides]) => {
    const localePath = new URL(`${locale}.json`, outputDirectory);
    const catalog = JSON.parse(await fs.readFile(localePath, 'utf8'));
    Object.assign(catalog, overrides);
    await fs.writeFile(localePath, `${JSON.stringify(catalog, null, 2)}\n`);
  }));
  console.log(`Applied curated overrides to ${Object.keys(localeOverrides).length} locale files.`);
  process.exit(0);
}

const request = (options, body = '') => new Promise((resolve, reject) => {
  const req = https.request({ ...options, rejectUnauthorized: false }, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const result = Buffer.concat(chunks).toString('utf8');
      if (response.statusCode >= 200 && response.statusCode < 300) resolve(result);
      else reject(new Error(`Translation request failed (${response.statusCode}): ${result.slice(0, 300)}`));
    });
  });
  req.on('error', reject);
  req.setTimeout(30000, () => req.destroy(new Error('Translation request timed out')));
  if (body) req.write(body);
  req.end();
});

const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
};
const withRetries = async (operation, attempts = 4) => {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
    }
  }
  throw lastError;
};
const getToken = async () => withRetries(() => request({ hostname: 'edge.microsoft.com', path: '/translate/auth', method: 'GET', headers: browserHeaders }));

const protectBrand = (text) => text
  .replaceAll('Kali', 'KALI_BRAND_TOKEN_9841')
  .replaceAll('Yixiu', 'YIXIU_BRAND_TOKEN_9841')
  .replaceAll('{{name}}', 'AUTH_NAME_TOKEN_9841');
const restoreBrand = (text) => text
  .replaceAll('KALI_BRAND_TOKEN_9841', 'Kali')
  .replaceAll('YIXIU_BRAND_TOKEN_9841', 'Yixiu')
  .replaceAll('AUTH_NAME_TOKEN_9841', '{{name}}');

const requestedLocale = process.argv.find((argument) => argument.startsWith('--locale='))?.split('=')[1];
if (requestedLocale && !localeTargets[requestedLocale]) throw new Error(`Unsupported locale: ${requestedLocale}`);
const activeLocaleTargets = requestedLocale ? { [requestedLocale]: localeTargets[requestedLocale] } : localeTargets;
let token = await getToken();
const catalogs = Object.fromEntries(Object.keys(activeLocaleTargets).map((locale) => [locale, {}]));
const targetEntries = Object.entries(activeLocaleTargets);
const targetGroups = [];
for (let index = 0; index < targetEntries.length; index += 8) targetGroups.push(targetEntries.slice(index, index + 8));

const translateBatch = async (batch, group, retries = 3) => {
  const query = group.map(([, target]) => `to=${encodeURIComponent(target)}`).join('&');
  const body = JSON.stringify(batch.map((Text) => ({ Text: protectBrand(Text) })));
  try {
    const result = await request({
      hostname: 'api-edge.cognitive.microsofttranslator.com',
      path: `/translate?api-version=3.0&${query}`,
      method: 'POST',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': Buffer.byteLength(body),
      },
    }, body);
    return JSON.parse(result);
  } catch (error) {
    if (retries <= 0) throw error;
    token = await getToken();
    await new Promise((resolve) => setTimeout(resolve, 350));
    return translateBatch(batch, group, retries - 1);
  }
};

const batches = [];
for (let index = 0; index < texts.length; index += 80) batches.push(texts.slice(index, index + 80));
let completed = 0;
for (const batch of batches) {
  for (const group of targetGroups) {
    const translatedRows = await translateBatch(batch, group);
    translatedRows.forEach((row, rowIndex) => {
      row.translations.forEach((translation) => {
        const locale = group.find(([, target]) => target.toLowerCase() === translation.to.toLowerCase())?.[0];
        const translatedText = restoreBrand(translation.text || '');
        if (locale && translatedText && translatedText !== batch[rowIndex]) catalogs[locale][batch[rowIndex]] = translatedText;
      });
    });
    completed += 1;
    console.log(`Translated ${completed}/${batches.length * targetGroups.length} batches`);
  }
}

Object.entries(localeOverrides).forEach(([locale, overrides]) => {
  if (catalogs[locale]) Object.assign(catalogs[locale], overrides);
});
await fs.mkdir(outputDirectory, { recursive: true });
await Promise.all(Object.entries(catalogs).map(([locale, catalog]) => fs.writeFile(new URL(`${locale}.json`, outputDirectory), `${JSON.stringify(catalog, null, 2)}\n`)));
console.log(`Generated ${texts.length} source phrases for ${Object.keys(activeLocaleTargets).length} locale(s).`);
