const keys = ['Interactive walkthrough', 'Explore the steps. No account or credits needed.', 'Illustrative demo', 'Creative studio illustration', 'Watch the video', 'Previous step', 'Next step', 'Workspace preview'];
const rows = {
  'zh-cn': ['交互式流程演示', '逐步了解制作流程，无需登录或消耗积分。', '流程示意', '创作场景示意图', '观看视频', '上一步', '下一步', '工作台实景'],
  'zh-tw': ['互動式流程示範', '逐步了解製作流程，無需登入或消耗點數。', '流程示意', '創作場景示意圖', '觀看影片', '上一步', '下一步', '工作區實景'],
  es: ['Recorrido interactivo', 'Explora los pasos. No necesitas cuenta ni créditos.', 'Demo ilustrativa', 'Ilustración del estudio creativo', 'Ver el vídeo', 'Paso anterior', 'Siguiente paso', 'Vista del espacio de trabajo'],
  fr: ['Visite interactive', 'Explorez les étapes sans compte ni crédits.', 'Démo illustrative', 'Illustration du studio créatif', 'Voir la vidéo', 'Étape précédente', 'Étape suivante', 'Aperçu de l’espace de travail'],
  ru: ['Интерактивный обзор', 'Изучите этапы без аккаунта и кредитов.', 'Демонстрация процесса', 'Иллюстрация творческой студии', 'Смотреть видео', 'Предыдущий шаг', 'Следующий шаг', 'Обзор рабочего пространства'],
  de: ['Interaktive Tour', 'Entdecke die Schritte. Ohne Konto oder Credits.', 'Beispieldemo', 'Illustration des Kreativstudios', 'Video ansehen', 'Vorheriger Schritt', 'Nächster Schritt', 'Workspace-Vorschau'],
  pt: ['Demonstração interativa', 'Explore os passos sem conta nem créditos.', 'Demonstração ilustrativa', 'Ilustração do estúdio criativo', 'Ver vídeo', 'Passo anterior', 'Passo seguinte', 'Pré-visualização do espaço de trabalho'],
  ar: ['جولة تفاعلية', 'استكشف الخطوات دون حساب أو رصيد.', 'عرض توضيحي', 'صورة توضيحية للاستوديو الإبداعي', 'شاهد الفيديو', 'الخطوة السابقة', 'الخطوة التالية', 'معاينة مساحة العمل'],
  it: ['Tour interattivo', 'Esplora i passaggi senza account o crediti.', 'Demo illustrativa', 'Illustrazione dello studio creativo', 'Guarda il video', 'Passaggio precedente', 'Passaggio successivo', 'Anteprima dello spazio di lavoro'],
  ja: ['操作の流れを体験', 'アカウントやクレジットなしで手順を確認できます。', 'デモ画面', '制作シーンのイメージ', '動画を見る', '前のステップ', '次のステップ', 'ワークスペース画面'],
  ko: ['인터랙티브 가이드', '계정이나 크레딧 없이 제작 과정을 살펴보세요.', '예시 데모', '크리에이티브 스튜디오 예시 이미지', '영상 보기', '이전 단계', '다음 단계', '작업 공간 미리보기'],
  id: ['Panduan interaktif', 'Jelajahi langkahnya tanpa akun atau kredit.', 'Demo ilustratif', 'Ilustrasi studio kreatif', 'Tonton video', 'Langkah sebelumnya', 'Langkah berikutnya', 'Pratinjau ruang kerja'],
  vi: ['Hướng dẫn tương tác', 'Khám phá các bước mà không cần tài khoản hay điểm.', 'Bản demo minh họa', 'Hình minh họa studio sáng tạo', 'Xem video', 'Bước trước', 'Bước tiếp theo', 'Xem trước không gian làm việc'],
  tr: ['Etkileşimli tur', 'Hesap veya kredi olmadan adımları keşfedin.', 'Örnek demo', 'Yaratıcı stüdyo görseli', 'Videoyu izle', 'Önceki adım', 'Sonraki adım', 'Çalışma alanı önizlemesi'],
  nl: ['Interactieve rondleiding', 'Ontdek de stappen zonder account of credits.', 'Voorbeelddemo', 'Illustratie van de creatieve studio', 'Bekijk de video', 'Vorige stap', 'Volgende stap', 'Werkruimtevoorbeeld'],
  uk: ['Інтерактивний огляд', 'Перегляньте етапи без облікового запису та кредитів.', 'Демонстрація процесу', 'Ілюстрація творчої студії', 'Дивитися відео', 'Попередній крок', 'Наступний крок', 'Огляд робочого простору'],
  th: ['สาธิตแบบโต้ตอบ', 'สำรวจขั้นตอนโดยไม่ต้องมีบัญชีหรือใช้เครดิต', 'ตัวอย่างการสาธิต', 'ภาพประกอบสตูดิโอสร้างสรรค์', 'ดูวิดีโอ', 'ขั้นตอนก่อนหน้า', 'ขั้นตอนถัดไป', 'ตัวอย่างพื้นที่ทำงาน'],
  pl: ['Interaktywny przewodnik', 'Poznaj kroki bez konta i kredytów.', 'Demo poglądowe', 'Ilustracja studia kreatywnego', 'Obejrzyj film', 'Poprzedni krok', 'Następny krok', 'Podgląd obszaru roboczego'],
  ro: ['Tur interactiv', 'Explorează pașii fără cont sau credite.', 'Demo ilustrativ', 'Ilustrație a studioului creativ', 'Vezi videoclipul', 'Pasul anterior', 'Pasul următor', 'Previzualizare a spațiului de lucru'],
  el: ['Διαδραστική περιήγηση', 'Δείτε τα βήματα χωρίς λογαριασμό ή μονάδες.', 'Ενδεικτική επίδειξη', 'Εικόνα δημιουργικού στούντιο', 'Δείτε το βίντεο', 'Προηγούμενο βήμα', 'Επόμενο βήμα', 'Προεπισκόπηση χώρου εργασίας'],
  cs: ['Interaktivní průvodce', 'Projděte si kroky bez účtu a kreditů.', 'Ukázkové demo', 'Ilustrace kreativního studia', 'Přehrát video', 'Předchozí krok', 'Další krok', 'Náhled pracovního prostoru'],
  fi: ['Interaktiivinen esittely', 'Tutustu vaiheisiin ilman tiliä tai krediittejä.', 'Havainnollistava demo', 'Luovan studion kuvitus', 'Katso video', 'Edellinen vaihe', 'Seuraava vaihe', 'Työtilan esikatselu'],
  hi: ['इंटरैक्टिव गाइड', 'बिना खाते या क्रेडिट के चरण देखें।', 'उदाहरण डेमो', 'क्रिएटिव स्टूडियो का चित्रण', 'वीडियो देखें', 'पिछला चरण', 'अगला चरण', 'वर्कस्पेस की झलक'],
};
const downloadLabels = { 'zh-cn': '下载', 'zh-tw': '下載', es: 'Descargar', fr: 'Télécharger', ru: 'Скачать', de: 'Herunterladen', pt: 'Descarregar', ar: 'تنزيل', it: 'Scarica', ja: 'ダウンロード', ko: '다운로드', id: 'Unduh', vi: 'Tải xuống', tr: 'İndir', nl: 'Downloaden', uk: 'Завантажити', th: 'ดาวน์โหลด', pl: 'Pobierz', ro: 'Descarcă', el: 'Λήψη', cs: 'Stáhnout', fi: 'Lataa', hi: 'डाउनलोड करें' };
export const publicShowcaseTranslations = Object.fromEntries(Object.entries(rows).map(([locale, values]) => [locale, { ...Object.fromEntries(keys.map((key, index) => [key, values[index]])), Download: downloadLabels[locale] }]));
