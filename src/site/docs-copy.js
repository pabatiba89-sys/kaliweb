// Order is shared by the public documentation and workspace entry.
const labels = {
  en: ['Documentation', 'AI agent creation', 'Digital human creation', 'Voice cloning', 'Editing templates', 'Automated publishing', 'Personal branding', 'Traffic monetization'],
  'zh-cn': ['文档中心', '智能体制作', '数字人制作', '声音克隆', '剪辑模板', '自动发布', 'IP 打造', '流量变现'],
  'zh-tw': ['文件中心', '智慧代理製作', '數位人製作', '聲音複製', '剪輯範本', '自動發布', '個人品牌打造', '流量變現'],
  es: ['Documentación', 'Crear agentes de IA', 'Crear avatares digitales', 'Clonación de voz', 'Plantillas de edición', 'Publicación automática', 'Marca personal', 'Monetización del tráfico'],
  fr: ['Documentation', 'Créer des agents IA', 'Créer des avatars numériques', 'Clonage vocal', 'Modèles de montage', 'Publication automatique', 'Marque personnelle', 'Monétisation du trafic'],
  ru: ['Документация', 'Создание ИИ-агентов', 'Создание цифровых аватаров', 'Клонирование голоса', 'Шаблоны монтажа', 'Автопубликация', 'Личный бренд', 'Монетизация трафика'],
  de: ['Dokumentation', 'KI-Agenten erstellen', 'Digitale Avatare erstellen', 'Stimmen klonen', 'Schnittvorlagen', 'Automatisch veröffentlichen', 'Personal Branding', 'Traffic monetarisieren'],
  pt: ['Documentação', 'Criar agentes de IA', 'Criar avatares digitais', 'Clonagem de voz', 'Modelos de edição', 'Publicação automática', 'Marca pessoal', 'Monetização de tráfego'],
  ar: ['الوثائق', 'إنشاء وكلاء الذكاء الاصطناعي', 'إنشاء شخصيات رقمية', 'استنساخ الصوت', 'قوالب المونتاج', 'النشر التلقائي', 'بناء العلامة الشخصية', 'تحقيق الدخل من الزيارات'],
  it: ['Documentazione', 'Creare agenti IA', 'Creare avatar digitali', 'Clonazione vocale', 'Modelli di montaggio', 'Pubblicazione automatica', 'Marchio personale', 'Monetizzare il traffico'],
  ja: ['ドキュメント', 'AIエージェント制作', 'デジタルヒューマン制作', '音声クローン', '編集テンプレート', '自動投稿', '個人ブランド構築', 'トラフィックの収益化'],
  ko: ['문서', 'AI 에이전트 제작', '디지털 휴먼 제작', '음성 복제', '편집 템플릿', '자동 게시', '퍼스널 브랜딩', '트래픽 수익화'],
  id: ['Dokumentasi', 'Membuat agen AI', 'Membuat avatar digital', 'Kloning suara', 'Templat penyuntingan', 'Publikasi otomatis', 'Merek pribadi', 'Monetisasi trafik'],
  vi: ['Tài liệu', 'Tạo tác nhân AI', 'Tạo người kỹ thuật số', 'Nhân bản giọng nói', 'Mẫu biên tập', 'Đăng tự động', 'Xây dựng thương hiệu cá nhân', 'Kiếm tiền từ lưu lượng'],
  tr: ['Belgeler', 'Yapay zekâ aracısı oluşturma', 'Dijital insan oluşturma', 'Ses klonlama', 'Kurgu şablonları', 'Otomatik yayınlama', 'Kişisel marka', 'Trafikten gelir elde etme'],
  nl: ['Documentatie', 'AI-agenten maken', 'Digitale avatars maken', 'Stemmen klonen', 'Montagesjablonen', 'Automatisch publiceren', 'Persoonlijk merk', 'Verkeer monetariseren'],
  uk: ['Документація', 'Створення ШІ-агентів', 'Створення цифрових аватарів', 'Клонування голосу', 'Шаблони монтажу', 'Автопублікація', 'Особистий бренд', 'Монетизація трафіку'],
  th: ['เอกสาร', 'สร้างเอเจนต์ AI', 'สร้างมนุษย์ดิจิทัล', 'โคลนเสียง', 'เทมเพลตตัดต่อ', 'เผยแพร่อัตโนมัติ', 'สร้างแบรนด์ส่วนบุคคล', 'สร้างรายได้จากผู้เข้าชม'],
  pl: ['Dokumentacja', 'Tworzenie agentów AI', 'Tworzenie cyfrowych awatarów', 'Klonowanie głosu', 'Szablony montażu', 'Automatyczna publikacja', 'Marka osobista', 'Monetyzacja ruchu'],
  ro: ['Documentație', 'Crearea agenților AI', 'Crearea avatarurilor digitale', 'Clonarea vocii', 'Șabloane de montaj', 'Publicare automată', 'Brand personal', 'Monetizarea traficului'],
  el: ['Τεκμηρίωση', 'Δημιουργία πρακτόρων AI', 'Δημιουργία ψηφιακών ανθρώπων', 'Κλωνοποίηση φωνής', 'Πρότυπα μοντάζ', 'Αυτόματη δημοσίευση', 'Προσωπική επωνυμία', 'Δημιουργία εσόδων από επισκέψεις'],
  cs: ['Dokumentace', 'Tvorba AI agentů', 'Tvorba digitálních avatarů', 'Klonování hlasu', 'Šablony střihu', 'Automatické publikování', 'Osobní značka', 'Monetizace návštěvnosti'],
  fi: ['Dokumentaatio', 'Tekoälyagenttien luonti', 'Digitaalisten avatarien luonti', 'Äänen kloonaus', 'Editointimallit', 'Automaattinen julkaisu', 'Henkilöbrändi', 'Liikenteen kaupallistaminen'],
  hi: ['दस्तावेज़', 'AI एजेंट बनाना', 'डिजिटल मानव बनाना', 'आवाज़ की क्लोनिंग', 'संपादन टेम्पलेट', 'स्वचालित प्रकाशन', 'व्यक्तिगत ब्रांड', 'ट्रैफ़िक से कमाई'],
};
export const docModules = [
  { id: 'agents', source: 'ai-script-writer', workspace: 'assistant', guide: 'help-script-to-video' },
  { id: 'digital-humans', source: 'digital-human', workspace: 'assets', guide: 'help-script-to-video' },
  { id: 'voice-cloning', source: 'voice-cloning', workspace: 'assets' },
  { id: 'editing-templates', source: 'smart-video-editing', workspace: 'templates', guide: 'help-video-modes' },
  { id: 'publishing', source: 'social-video-publishing', workspace: 'publish' },
  { id: 'personal-branding', source: 'personal-brand-video-generator', workspace: 'assistant' },
  { id: 'monetization', source: 'product-marketing-video-maker', workspace: 'assistant' },
];
export const docsCopy = (locale) => {
  const copy = labels[locale] || labels.en;
  return { title: copy[0], modules: docModules.map((entry, index) => ({ ...entry, label: copy[index + 1] })) };
};
export const docsPath = (locale, id = '') => `/${locale}/docs/${id ? `${id}/` : ''}`;
