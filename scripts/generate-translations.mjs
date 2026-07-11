import fs from 'node:fs/promises';
import https from 'node:https';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';

const traverse = traverseModule.default;
const sourcePaths = [
  new URL('../src/main.jsx', import.meta.url),
  new URL('../src/pageConfig.js', import.meta.url),
  new URL('../src/api.js', import.meta.url),
];
const outputDirectory = new URL('../src/locales/', import.meta.url);
const localeTargets = {
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
  'zh-CN': {
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
    'Start production with the same yixiu trial package.': '使用艺秀同款试用套餐开始创作。',
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
    'Start production with the same yixiu trial package.': '使用藝秀同款試用方案開始創作。',
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
  'es-MX': ['Inicio', 'Tendencias', 'Asistente de IA', 'Estudio de video', 'Estudio de recursos', 'Estudio de música', 'Estudio de imágenes', 'Materiales', 'Plantillas', 'Planes y facturación', 'Configuración', 'Iniciar sesión', 'Cerrar sesión', 'Nuevo video', 'Contraer'],
  'fr-FR': ['Accueil', 'Tendances', 'Assistant IA', 'Studio vidéo', 'Studio de ressources', 'Studio de musique', 'Studio d’images', 'Ressources', 'Modèles', 'Abonnement et facturation', 'Paramètres', 'Se connecter', 'Se déconnecter', 'Nouvelle vidéo', 'Réduire'],
  'ru-RU': ['Главная', 'Тренды', 'ИИ-ассистент', 'Видеостудия', 'Студия ресурсов', 'Музыкальная студия', 'Студия изображений', 'Материалы', 'Шаблоны', 'Тариф и оплата', 'Настройки', 'Войти', 'Выйти', 'Новое видео', 'Свернуть'],
  'de-DE': ['Startseite', 'Trends', 'KI-Assistent', 'Videostudio', 'Asset-Studio', 'Musikstudio', 'Bildstudio', 'Medien', 'Vorlagen', 'Tarif und Abrechnung', 'Einstellungen', 'Anmelden', 'Abmelden', 'Neues Video', 'Einklappen'],
  'pt-PT': ['Início', 'Tendências', 'Assistente de IA', 'Estúdio de vídeo', 'Estúdio de recursos', 'Estúdio de música', 'Estúdio de imagens', 'Materiais', 'Modelos', 'Plano e faturação', 'Definições', 'Iniciar sessão', 'Terminar sessão', 'Novo vídeo', 'Recolher'],
  'ar-AE': ['الرئيسية', 'الموضوعات الرائجة', 'مساعد الذكاء الاصطناعي', 'استوديو الفيديو', 'استوديو الأصول', 'استوديو الموسيقى', 'استوديو الصور', 'المواد', 'القوالب', 'الخطة والفوترة', 'الإعدادات', 'تسجيل الدخول', 'تسجيل الخروج', 'فيديو جديد', 'طي'],
  'it-IT': ['Home', 'Tendenze', 'Assistente IA', 'Studio video', 'Studio risorse', 'Studio musicale', 'Studio immagini', 'Materiali', 'Modelli', 'Piano e fatturazione', 'Impostazioni', 'Accedi', 'Esci', 'Nuovo video', 'Comprimi'],
  'ja-JP': ['ホーム', 'トレンド', 'AIアシスタント', '動画スタジオ', 'アセットスタジオ', '音楽スタジオ', '画像スタジオ', '素材', 'テンプレート', 'プラン・請求', '設定', 'ログイン', 'ログアウト', '新規動画', '折りたたむ'],
  'ko-KR': ['홈', '인기 트렌드', 'AI 어시스턴트', '비디오 스튜디오', '에셋 스튜디오', '음악 스튜디오', '이미지 스튜디오', '자료', '템플릿', '요금제 및 결제', '설정', '로그인', '로그아웃', '새 비디오', '접기'],
  'id-ID': ['Beranda', 'Tren Populer', 'Asisten AI', 'Studio Video', 'Studio Aset', 'Studio Musik', 'Studio Gambar', 'Materi', 'Templat', 'Paket & Tagihan', 'Pengaturan', 'Masuk', 'Keluar', 'Video Baru', 'Ciutkan'],
  'vi-VN': ['Trang chủ', 'Xu hướng nổi bật', 'Trợ lý AI', 'Studio video', 'Studio tài sản', 'Studio âm nhạc', 'Studio hình ảnh', 'Tư liệu', 'Mẫu', 'Gói & thanh toán', 'Cài đặt', 'Đăng nhập', 'Đăng xuất', 'Video mới', 'Thu gọn'],
  'tr-TR': ['Ana Sayfa', 'Popüler Trendler', 'AI Asistanı', 'Video Stödyosu', 'Varlık Stödyosu', 'Müzik Stödyosu', 'Görsel Stödyosu', 'Materyaller', 'Şablonlar', 'Plan ve Faturalandırma', 'Ayarlar', 'Giriş yap', 'Çıkış yap', 'Yeni Video', 'Daralt'],
  'nl-NL': ['Start', 'Trends', 'AI-assistent', 'Videostudio', 'Assetstudio', 'Muziekstudio', 'Afbeeldingsstudio', 'Materialen', 'Sjablonen', 'Abonnement en facturering', 'Instellingen', 'Inloggen', 'Uitloggen', 'Nieuwe video', 'Inklappen'],
  'uk-UA': ['Головна', 'Популярні тренди', 'AI-помічник', 'Відеостудія', 'Студія ресурсів', 'Музична студія', 'Студія зображень', 'Матеріали', 'Шаблони', 'Тариф і оплата', 'Налаштування', 'Увійти', 'Вийти', 'Нове відео', 'Згорнути'],
  'th-TH': ['หน้าหลัก', 'เทรนด์ยอดนิยม', 'ผู้ช่วย AI', 'สตูดิโอวิดีโอ', 'สตูดิโอแอสเซท', 'สตูดิโอเพลง', 'สตูดิโอรูปภาพ', 'สื่อ', 'เทมเพลต', 'แพ็กเกจและการเรียกเก็บเงิน', 'การตั้งค่า', 'เข้าสู่ระบบ', 'ออกจากระบบ', 'วิดีโอใหม่', 'ย่อ'],
  'pl-PL': ['Strona główna', 'Popularne trendy', 'Asystent AI', 'Studio wideo', 'Studio zasobów', 'Studio muzyczne', 'Studio obrazów', 'Materiały', 'Szablony', 'Plan i rozliczenia', 'Ustawienia', 'Zaloguj się', 'Wyloguj się', 'Nowe wideo', 'Zwiń'],
  'ro-RO': ['Acasă', 'Tendințe populare', 'Asistent AI', 'Studio video', 'Studio de resurse', 'Studio muzical', 'Studio de imagini', 'Materiale', 'Șabloane', 'Plan și facturare', 'Setări', 'Autentificare', 'Deconectare', 'Videoclip nou', 'Restrânge'],
  'el-GR': ['Αρχική', 'Δημοφιλείς τάσεις', 'Βοηθός AI', 'Στούντιο βίντεο', 'Στούντιο πόρων', 'Στούντιο μουσικής', 'Στούντιο εικόνας', 'Υλικό', 'Πρότυπα', 'Πρόγραμμα και χρέωση', 'Ρυθμίσεις', 'Σύνδεση', 'Αποσύνδεση', 'Νέο βίντεο', 'Σύμπτυξη'],
  'cs-CZ': ['Domů', 'Populární trendy', 'AI asistent', 'Video studio', 'Studio prostředků', 'Hudební studio', 'Obrazové studio', 'Materiály', 'Šablony', 'Tarif a fakturace', 'Nastavení', 'Přihlásit se', 'Odhlásit se', 'Nové video', 'Sbalit'],
  'fi-FI': ['Etusivu', 'Suositut trendit', 'Tekoälyavustaja', 'Videostudio', 'Resurssistudio', 'Musiikkistudio', 'Kuvastudio', 'Materiaalit', 'Mallit', 'Tilaus ja laskutus', 'Asetukset', 'Kirjaudu sisään', 'Kirjaudu ulos', 'Uusi video', 'Kutista'],
  'hi-IN': ['होम', 'लोकप्रिय रुझान', 'AI सहायक', 'वीडियो स्टूडियो', 'एसेट स्टूडियो', 'संगीत स्टूडियो', 'इमेज स्टूडियो', 'सामग्री', 'टेमप्लेट', 'प्लान और बिलिंग', 'सेटिंग्स', 'साइन इन', 'साइन आउट', 'नया वीडियो', 'संक्षिप्त करें'],
};

Object.entries(navigationOverrides).forEach(([locale, values]) => {
  localeOverrides[locale] = {
    ...(localeOverrides[locale] || {}),
    ...Object.fromEntries(navigationKeys.map((key, index) => [key, values[index]])),
  };
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
const getToken = async () => request({ hostname: 'edge.microsoft.com', path: '/translate/auth', method: 'GET', headers: browserHeaders });

let token = await getToken();
const catalogs = Object.fromEntries(Object.keys(localeTargets).map((locale) => [locale, {}]));
const targetEntries = Object.entries(localeTargets);
const targetGroups = [];
for (let index = 0; index < targetEntries.length; index += 8) targetGroups.push(targetEntries.slice(index, index + 8));

const translateBatch = async (batch, group, retry = true) => {
  const query = group.map(([, target]) => `to=${encodeURIComponent(target)}`).join('&');
  const body = JSON.stringify(batch.map((Text) => ({ Text })));
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
    if (!retry) throw error;
    token = await getToken();
    return translateBatch(batch, group, false);
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
        if (locale && translation.text && translation.text !== batch[rowIndex]) catalogs[locale][batch[rowIndex]] = translation.text;
      });
    });
    completed += 1;
    console.log(`Translated ${completed}/${batches.length * targetGroups.length} batches`);
  }
}

Object.entries(localeOverrides).forEach(([locale, overrides]) => Object.assign(catalogs[locale], overrides));
await fs.mkdir(outputDirectory, { recursive: true });
await Promise.all(Object.entries(catalogs).map(([locale, catalog]) => fs.writeFile(new URL(`${locale}.json`, outputDirectory), `${JSON.stringify(catalog, null, 2)}\n`)));
console.log(`Generated ${texts.length} source phrases for ${Object.keys(localeTargets).length + 1} locales.`);
