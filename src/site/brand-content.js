import { brandCopy } from './brand-copy.js';
import { brandName } from './localization.js';

export const capabilitySlugs = {
  script: 'ai-script-writer', video: 'ai-video-generator', avatar: 'digital-human',
  editing: 'smart-video-editing', publishing: 'social-video-publishing',
  voice: 'voice-cloning', music: 'ai-music-generator', developers: 'developers',
};
export const pipelineKeys = ['trend', 'script', 'video', 'editing', 'publishing'];
export const verifiedPlatforms = ['Xiaohongshu', 'WeChat Channels', 'Douyin', 'Kuaishou', 'TikTok', 'YouTube', 'X', 'Instagram', 'Facebook', 'Alipay Life'];
const routes = { script: '/app/', video: '/app/?page=video', avatar: '/app/?page=assets', editing: '/app/?page=video', publishing: '/app/?page=publish', voice: '/app/?page=speech', music: '/app/?page=music' };
const nextCapabilities = {
  script: ['video', 'editing'], video: ['avatar', 'publishing'], avatar: ['voice', 'video'],
  editing: ['video', 'publishing'], publishing: ['script', 'video'], voice: ['avatar', 'video'],
  music: ['video', 'editing'], developers: ['script', 'publishing'],
};
const searchTitles = {
  en: ['AI Video Pricing & Credit Packs', 'About Kali: AI Content & Personal Branding', 'AI Content & Video Creation Guides'],
  'zh-cn': ['AI 视频制作价格与积分包', '关于喀理：AI 内容创作与个人 IP', 'AI 文案与视频制作教程'],
  'zh-tw': ['AI 影片製作價格與點數包', '關於喀理：AI 內容與個人品牌', 'AI 文案與影片製作教學'],
  es: ['Precios y créditos para vídeos con IA', 'Sobre Kali y la creación de contenido con IA', 'Guías de contenido y vídeo con IA'],
  fr: ['Tarifs et crédits pour les vidéos IA', 'À propos de Kali et de la création de contenu IA', 'Guides de création de contenu et de vidéos IA'],
  de: ['KI-Video: Preise und Guthabenpakete', 'Über Kali und KI-Inhaltserstellung', 'Anleitungen für KI-Inhalte und Videos'],
  pt: ['Preços e créditos para vídeos com IA', 'Sobre o Kali e a criação de conteúdo com IA', 'Guias de criação de conteúdo e vídeos com IA'],
  it: ['Prezzi e crediti per video IA', 'Informazioni su Kali e sui contenuti IA', 'Guide per contenuti e video IA'],
  ja: ['AI 動画の料金・クレジットパック', 'Kali について：AI コンテンツとブランドづくり', 'AI 原稿・動画制作ガイド'],
  ko: ['AI 영상 가격과 크레딧 팩', 'Kali 소개: AI 콘텐츠와 브랜드 만들기', 'AI 글쓰기와 영상 제작 가이드'],
  ru: ['Цены и кредиты для ИИ-видео', 'О Kali и создании ИИ-контента', 'Руководства по ИИ-контенту и видео'],
  ar: ['أسعار وأرصدة إنشاء الفيديو بالذكاء الاصطناعي', 'عن Kali وإنشاء المحتوى بالذكاء الاصطناعي', 'أدلة إنشاء المحتوى والفيديو بالذكاء الاصطناعي'],
  id: ['Harga dan paket kredit video AI', 'Tentang Kali dan pembuatan konten AI', 'Panduan pembuatan konten dan video AI'],
  vi: ['Giá và gói điểm tạo video AI', 'Giới thiệu Kali và sáng tạo nội dung AI', 'Hướng dẫn sáng tạo nội dung và video AI'],
  tr: ['Yapay zekâ video fiyatları ve kredi paketleri', 'Kali ve yapay zekâ içerikleri hakkında', 'Yapay zekâ içerik ve video rehberleri'],
  nl: ['Prijzen en tegoed voor AI-video', 'Over Kali en AI-contentcreatie', 'Handleidingen voor AI-content en video'],
  uk: ['Ціни та кредити для ШІ-відео', 'Про Kali та створення ШІ-контенту', 'Посібники зі створення ШІ-контенту та відео'],
  pl: ['Ceny i kredyty na filmy AI', 'O Kali i tworzeniu treści AI', 'Poradniki tworzenia treści i filmów AI'],
  ro: ['Prețuri și credite pentru videoclipuri AI', 'Despre Kali și crearea de conținut AI', 'Ghiduri de conținut și videoclipuri AI'],
  cs: ['Ceny a kredity pro AI videa', 'O Kali a tvorbě AI obsahu', 'Návody na AI obsah a videa'],
  el: ['Τιμές και μονάδες για βίντεο AI', 'Σχετικά με το Kali και το περιεχόμενο AI', 'Οδηγοί δημιουργίας περιεχομένου και βίντεο AI'],
  fi: ['Tekoälyvideoiden hinnat ja krediittipaketit', 'Tietoa Kalista ja tekoälysisällöistä', 'Tekoälysisältöjen ja videoiden ohjeet'],
  th: ['ราคาและแพ็กเครดิตสำหรับวิดีโอ AI', 'เกี่ยวกับ Kali และการสร้างคอนเทนต์ AI', 'คู่มือสร้างคอนเทนต์และวิดีโอ AI'],
  hi: ['AI वीडियो की कीमत और क्रेडिट पैक', 'Kali और AI कंटेंट निर्माण के बारे में', 'AI कंटेंट और वीडियो बनाने की गाइड'],
};
const englishProductTitles = {
  script: 'AI Script Writer for Social Media Videos', video: 'AI Video Generator for Avatars & Social Content',
  avatar: 'AI Avatar Generator for Personal Brand Videos', editing: 'Smart Video Editing & AI Video Packaging',
  publishing: 'Multi-Platform Video Publishing & Scheduling', voice: 'AI Voice Cloning & Text to Speech',
  music: 'AI Music Generator for Songs & Soundtracks', developers: 'MCP Server & API Integration',
};
const questions = {
  en: ['How much does creation cost?', 'Which platforms can I publish to?', 'How do I connect MCP or request API access?'],
  'zh-cn': ['制作内容需要多少费用？', '支持发布到哪些平台？', '如何连接 MCP 或申请 API 接入？'],
  'zh-tw': ['製作內容需要多少費用？', '支援發布到哪些平台？', '如何連結 MCP 或申請 API 存取？'],
  es: ['¿Cuánto cuesta crear contenido?', '¿En qué plataformas puedo publicar?', '¿Cómo conecto MCP o solicito acceso a la API?'],
  fr: ['Combien coûte la création de contenu ?', 'Sur quelles plateformes puis-je publier ?', 'Comment connecter MCP ou demander un accès API ?'],
  de: ['Was kostet die Erstellung?', 'Auf welchen Plattformen kann ich veröffentlichen?', 'Wie verbinde ich MCP oder erhalte API-Zugang?'],
  pt: ['Quanto custa criar conteúdo?', 'Em quais plataformas posso publicar?', 'Como conecto o MCP ou solicito acesso à API?'],
  it: ['Quanto costa creare contenuti?', 'Su quali piattaforme posso pubblicare?', 'Come collego MCP o richiedo l’accesso API?'],
  ja: ['コンテンツ制作にはいくらかかりますか？', 'どのプラットフォームに投稿できますか？', 'MCP の接続や API の利用はどうすればよいですか？'],
  ko: ['콘텐츠 제작 비용은 얼마인가요?', '어떤 플랫폼에 게시할 수 있나요?', 'MCP 연결이나 API 이용은 어떻게 신청하나요?'],
  ru: ['Сколько стоит создание контента?', 'На каких платформах можно публиковать?', 'Как подключить MCP или получить доступ к API?'],
  ar: ['ما تكلفة إنشاء المحتوى؟', 'على أي منصات يمكنني النشر؟', 'كيف أربط MCP أو أطلب الوصول إلى API؟'],
  id: ['Berapa biaya pembuatan konten?', 'Ke platform mana saya bisa menerbitkan?', 'Bagaimana cara menghubungkan MCP atau meminta akses API?'],
  vi: ['Chi phí sáng tạo nội dung là bao nhiêu?', 'Tôi có thể đăng lên nền tảng nào?', 'Làm sao kết nối MCP hoặc đăng ký API?'],
  tr: ['İçerik oluşturmanın maliyeti nedir?', 'Hangi platformlarda yayınlayabilirim?', 'MCP’yi nasıl bağlarım veya API erişimi isterim?'],
  nl: ['Wat kost het maken van content?', 'Op welke platforms kan ik publiceren?', 'Hoe verbind ik MCP of vraag ik API-toegang aan?'],
  uk: ['Скільки коштує створення контенту?', 'На яких платформах можна публікувати?', 'Як підключити MCP або отримати доступ до API?'],
  pl: ['Ile kosztuje tworzenie treści?', 'Na jakich platformach mogę publikować?', 'Jak połączyć MCP lub uzyskać dostęp do API?'],
  ro: ['Cât costă crearea de conținut?', 'Pe ce platforme pot publica?', 'Cum conectez MCP sau solicit acces API?'],
  cs: ['Kolik stojí tvorba obsahu?', 'Na kterých platformách mohu publikovat?', 'Jak připojím MCP nebo požádám o přístup k API?'],
  el: ['Πόσο κοστίζει η δημιουργία περιεχομένου;', 'Σε ποιες πλατφόρμες μπορώ να δημοσιεύσω;', 'Πώς συνδέω το MCP ή ζητώ πρόσβαση API;'],
  fi: ['Mitä sisällön luominen maksaa?', 'Mille alustoille voin julkaista?', 'Miten yhdistän MCP:n tai pyydän API-käyttöoikeutta?'],
  th: ['การสร้างคอนเทนต์มีค่าใช้จ่ายเท่าไร?', 'เผยแพร่ไปยังแพลตฟอร์มใดได้บ้าง?', 'เชื่อม MCP หรือขอใช้ API อย่างไร?'],
  hi: ['कंटेंट बनाने की लागत कितनी है?', 'किन प्लेटफ़ॉर्म पर प्रकाशित कर सकते हैं?', 'MCP कैसे जोड़ें या API एक्सेस कैसे मांगें?'],
};
export function platformNames(locale) {
  if (locale === 'zh-cn') return ['小红书', '视频号', '抖音', '快手', ...verifiedPlatforms.slice(4, 9), '支付宝生活号'];
  if (locale === 'zh-tw') return ['小紅書', '微信影片號', '抖音', '快手', ...verifiedPlatforms.slice(4, 9), '支付寶生活號'];
  return verifiedPlatforms;
}
export function getBrandContent(locale) {
  const c = brandCopy[locale];
  if (!c) throw new Error(`Missing brand copy: ${locale}`);
  const u = c.ui;
  const path = (slug) => `/${locale}/${slug}/`;
  const audience = { eyebrow: brandName(locale), heading: u[5], items: c.audience.map(([title, body]) => ({ title, body })) };
  const walkthrough = {
    heading: u[4], name: brandName(locale), position: 'full', pipeline: true,
    steps: pipelineKeys.map((key, index) => ({ label: c[key][0], title: c[key][1], body: c[key][2], fields: index === 4 ? verifiedPlatforms : [c[key][0], index < 4 ? c[pipelineKeys[index + 1]][0] : u[8]] })),
  };
  const revisions = {
    '': {
      title: c.hero[2], description: c.hero[1], eyebrow: c.script[0] + ' · ' + c.video[0] + ' · ' + c.publishing[0],
      headline: c.hero[0], lead: c.hero[1], primaryCta: u[0], primaryHref: '/app/',
      proof: pipelineKeys.map((key) => c[key][0]), sectionTitle: u[6], sectionLead: u[7],
      overviewTitle: u[4], closingTitle: c.hero[3], closingCta: u[0],
      practicalSections: [audience], walkthrough,
    },
  };
  for (const [key, slug] of Object.entries(capabilitySlugs)) {
    const [label, headline, lead] = c[key];
    const next = nextCapabilities[key];
    revisions[slug] = {
      slug, title: locale === 'en' ? englishProductTitles[key] : label, description: lead, eyebrow: label, headline, lead,
      primaryCta: key === 'developers' ? u[3] : u[0],
      primaryHref: key === 'developers' ? path('contact') : routes[key],
      bullets: [label, ...next.map((item) => c[item][0])], sectionHeading: headline,
      sections: [[label, lead], [u[8], u[9]]],
      practicalSections: [{ eyebrow: brandName(locale), heading: u[4], items: next.map((item) => ({ title: c[item][0], body: c[item][2], slug: capabilitySlugs[item], linkLabel: u[2] })) }],
      faq: key === 'developers' ? [[questions[locale][2], u[17]]] : key === 'publishing' ? [[questions[locale][1], platformNames(locale).join(' · ') + '. ' + lead], [questions[locale][0], u[13]]] : [[u[10], u[11]], [questions[locale][0], u[13]]],
      related: next.map((item) => capabilitySlugs[item]), relatedHeading: u[6],
      walkthrough: {
        heading: headline, name: label, position: key === 'avatar' ? 'left' : key === 'voice' ? 'right' : key === 'video' ? 'center' : 'full',
        steps: [
          { label, title: headline, body: lead, fields: [label] },
          { label: u[8], title: u[8], body: u[9], fields: [label, u[8]] },
          { label: c[next[0]][0], title: c[next[0]][1], body: c[next[0]][2], fields: [label, c[next[0]][0]] },
        ],
      },
      ...(key === 'developers' ? { sections: [[label, lead], ['MCP', 'https://mcp.kaliai.fun/mcp'], ['API', u[17]]] } : {}),
    };
  }
  revisions.pricing = {
    title: searchTitles[locale][0], description: u[13], eyebrow: u[12], headline: u[12], lead: u[13],
    bullets: [c.video[0], c.avatar[0], c.music[0]], primaryCta: u[0], primaryHref: '/app/',
    sectionHeading: u[6], sections: [[u[12], u[13]], [u[8], u[9]]],
    faq: [[questions[locale][0], u[13]], [u[10], u[11]]], related: ['payment-policy', 'refund-policy'], relatedHeading: u[2], practicalSections: [],
  };
  revisions.about = {
    title: searchTitles[locale][1], description: u[15], headline: u[14], lead: u[15],
    bullets: c.audience.map(([title]) => title), practicalSections: [audience],
    sections: [[u[4], c.hero[1]], [u[6], u[7]]], faq: [[u[10], u[11]]],
  };
  revisions.contact = {
    title: u[3], description: `${u[3]} — ${u[17]}`, headline: u[3], lead: `${c.developers[2]} ${u[17]}`,
    primaryCta: u[3], primaryHref: 'mailto:pabatiba89@gmail.com',
  };
  revisions.help = { title: searchTitles[locale][2], headline: u[16], description: `${u[16]} ${u[9]}`, lead: c.hero[1], walkthrough, faq: [[u[10], u[11]], [questions[locale][0], u[13]]] };
  return revisions;
}

export const newMarketingPages = ['ai-script-writer', 'smart-video-editing', 'social-video-publishing', 'developers'].map((slug) => getBrandContent('en')[slug]);
