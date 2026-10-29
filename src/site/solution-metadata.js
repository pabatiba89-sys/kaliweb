import { brandCopy } from './brand-copy.js';
import { solutionSlugs } from './solution-content.js';

const titles = {
  'zh-cn': ['AI 个人品牌视频生成器', 'AI 产品营销视频制作', 'AI 培训视频生成器'],
  'zh-tw': ['AI 個人品牌影片生成器', 'AI 產品行銷影片製作', 'AI 培訓影片生成器'],
  es: ['Generador de vídeos para tu marca personal', 'Creador de vídeos de marketing de productos', 'Generador de vídeos de formación con IA'],
  fr: ['Générateur de vidéos pour votre marque personnelle', 'Création de vidéos marketing produit', 'Générateur de vidéos de formation avec IA'],
  ru: ['Генератор видео для личного бренда', 'Создание маркетинговых видео о продукте', 'Генератор обучающих видео с ИИ'],
  de: ['KI-Videogenerator für die Personenmarke', 'Produktmarketing-Videos mit KI erstellen', 'KI-Generator für Schulungsvideos'],
  pt: ['Gerador de vídeos para marca pessoal', 'Criador de vídeos de marketing de produtos', 'Gerador de vídeos de formação com IA'],
  ar: ['مولّد فيديوهات العلامة الشخصية', 'إنشاء فيديوهات تسويق المنتجات', 'مولّد فيديوهات التدريب بالذكاء الاصطناعي'],
  it: ['Generatore di video per il personal branding', 'Creazione di video di marketing di prodotto', 'Generatore di video formativi con IA'],
  ja: ['AIパーソナルブランド動画生成', 'AI商品マーケティング動画制作', 'AI研修動画生成'],
  ko: ['AI 퍼스널 브랜딩 영상 생성기', 'AI 제품 마케팅 영상 제작', 'AI 교육 영상 생성기'],
  id: ['Generator video untuk personal branding', 'Pembuat video pemasaran produk', 'Generator video pelatihan dengan AI'],
  vi: ['Tạo video thương hiệu cá nhân bằng AI', 'Tạo video tiếp thị sản phẩm bằng AI', 'Tạo video đào tạo bằng AI'],
  tr: ['Kişisel marka için yapay zekâ video oluşturucu', 'Ürün pazarlama videosu oluşturma', 'Yapay zekâ ile eğitim videosu oluşturma'],
  nl: ['AI-videogenerator voor je persoonlijke merk', 'Productmarketingvideo’s maken met AI', 'AI-generator voor trainingsvideo’s'],
  uk: ['Генератор відео для особистого бренду', 'Створення маркетингових відео про продукт', 'Генератор навчальних відео зі ШІ'],
  th: ['สร้างวิดีโอแบรนด์ส่วนบุคคลด้วย AI', 'สร้างวิดีโอการตลาดผลิตภัณฑ์ด้วย AI', 'สร้างวิดีโอฝึกอบรมด้วย AI'],
  pl: ['Generator filmów dla marki osobistej', 'Tworzenie filmów marketingowych o produktach', 'Generator filmów szkoleniowych z AI'],
  ro: ['Generator de videoclipuri pentru brandul personal', 'Creare de videoclipuri de marketing pentru produse', 'Generator de videoclipuri de instruire cu AI'],
  el: ['Δημιουργία βίντεο για την προσωπική επωνυμία', 'Δημιουργία βίντεο μάρκετινγκ προϊόντων', 'Δημιουργία εκπαιδευτικών βίντεο με AI'],
  cs: ['Generátor videí pro osobní značku', 'Tvorba produktových marketingových videí', 'Generátor školicích videí s AI'],
  fi: ['Tekoälyvideot henkilöbrändille', 'Tuotemarkkinointivideoiden luominen tekoälyllä', 'Koulutusvideoiden luominen tekoälyllä'],
  hi: ['निजी ब्रांड के लिए AI वीडियो जनरेटर', 'AI से उत्पाद मार्केटिंग वीडियो बनाएँ', 'AI प्रशिक्षण वीडियो जनरेटर'],
};

export function getSolutionMetadata(locale, slug) {
  const index = solutionSlugs.indexOf(slug);
  if (index < 0 || !titles[locale]) return null;
  const title = titles[locale][index];
  const copy = brandCopy[locale];
  return { title, description: `${title}. ${copy.audience[index][1]} ${copy.video[2]}` };
}
