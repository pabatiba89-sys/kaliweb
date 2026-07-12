const siteKeys = ['Open the workspace', 'Create with Kali', 'Learn more', 'Explore', 'Talk to the team'];

const siteRows = {
  'zh-cn': ['进入工作台', '使用喀理创作', '了解更多', '探索', '联系我们'],
  'zh-tw': ['進入工作區', '使用喀理創作', '深入瞭解', '探索', '聯絡我們'],
  es: ['Abrir el espacio de trabajo', 'Crear con Kali', 'Más información', 'Explorar', 'Habla con nuestro equipo'],
  fr: ['Ouvrir l’espace de travail', 'Créer avec Kali', 'En savoir plus', 'Découvrir', 'Échanger avec notre équipe'],
  ru: ['Открыть рабочее пространство', 'Создавать в Kali', 'Подробнее', 'Узнать больше', 'Связаться с командой'],
  de: ['Workspace öffnen', 'Mit Kali erstellen', 'Mehr erfahren', 'Entdecken', 'Mit unserem Team sprechen'],
  pt: ['Abrir o espaço de trabalho', 'Criar com o Kali', 'Saber mais', 'Explorar', 'Falar com a nossa equipa'],
  ar: ['فتح مساحة العمل', 'أنشئ مع Kali', 'معرفة المزيد', 'استكشف', 'تواصل مع فريقنا'],
  it: ['Apri l’area di lavoro', 'Crea con Kali', 'Scopri di più', 'Esplora', 'Parla con il nostro team'],
  ja: ['ワークスペースを開く', 'Kaliで作成', '詳しく見る', '詳しく見る', 'チームに相談'],
  ko: ['워크스페이스 열기', 'Kali로 만들기', '자세히 알아보기', '살펴보기', '팀에 문의하기'],
  id: ['Buka ruang kerja', 'Buat dengan Kali', 'Pelajari selengkapnya', 'Jelajahi', 'Hubungi tim kami'],
  vi: ['Mở không gian làm việc', 'Sáng tạo cùng Kali', 'Tìm hiểu thêm', 'Khám phá', 'Trao đổi với đội ngũ của chúng tôi'],
  tr: ['Çalışma alanını aç', 'Kali ile oluştur', 'Daha fazla bilgi', 'Keşfet', 'Ekibimizle görüş'],
  nl: ['Werkruimte openen', 'Maken met Kali', 'Meer informatie', 'Ontdekken', 'Neem contact op met ons team'],
  uk: ['Відкрити робочий простір', 'Створювати з Kali', 'Докладніше', 'Дізнатися більше', 'Зв’язатися з командою'],
  th: ['เปิดพื้นที่ทำงาน', 'สร้างสรรค์ด้วย Kali', 'ดูข้อมูลเพิ่มเติม', 'สำรวจ', 'พูดคุยกับทีมของเรา'],
  pl: ['Otwórz przestrzeń roboczą', 'Twórz z Kali', 'Dowiedz się więcej', 'Odkrywaj', 'Porozmawiaj z naszym zespołem'],
  ro: ['Deschide spațiul de lucru', 'Creează cu Kali', 'Află mai multe', 'Explorează', 'Discută cu echipa noastră'],
  el: ['Άνοιγμα χώρου εργασίας', 'Δημιούργησε με το Kali', 'Μάθε περισσότερα', 'Εξερεύνηση', 'Μίλησε με την ομάδα μας'],
  cs: ['Otevřít pracovní prostor', 'Tvořit s Kali', 'Zjistit více', 'Prozkoumat', 'Kontaktovat náš tým'],
  fi: ['Avaa työtila', 'Luo Kalilla', 'Lue lisää', 'Tutustu', 'Ota yhteyttä tiimiimme'],
  hi: ['वर्कस्पेस खोलें', 'Kali के साथ बनाएँ', 'और जानें', 'एक्सप्लोर करें', 'हमारी टीम से बात करें'],
};

const marketingKeys = [
  'Create publish-ready videos from any content idea',
  'One connected production system for your entire content workflow',
  'Build once. Create for every market.',
  'Create a digital presenter you can use in every video',
  'Choose a plan that fits your production volume',
];
const marketingRows = {
  'zh-cn': ['让每个内容灵感，都成为可发布的视频', '一套贯穿完整内容流程的智能创作系统', '一次搭建，面向每个市场持续创作', '打造可复用于每条视频的数字人', '选择匹配实际产量的方案'],
  'zh-tw': ['讓每個內容靈感，都成為可發布的影片', '一套串連完整內容流程的智慧創作系統', '一次建置，持續為每個市場創作', '打造可重複用於每支影片的數位人', '選擇符合實際產量的方案'],
  es: ['Convierte cualquier idea en un video listo para publicar', 'Un único sistema conectado para todo tu flujo de contenido', 'Configura una vez. Crea para todos tus mercados.', 'Crea un presentador digital listo para reutilizar en cada video', 'Elige el plan que mejor se adapte a tu ritmo de producción'],
  fr: ['Transformez chaque idée en vidéo prête à publier', 'Un seul système connecté pour piloter toute votre production de contenu', 'Configurez une fois. Créez pour tous vos marchés.', 'Créez un présentateur numérique réutilisable dans toutes vos vidéos', 'Choisissez l’offre adaptée à votre rythme de production'],
  ru: ['Превращайте любую идею в готовое к публикации видео', 'Единая система для всего цикла производства контента', 'Настройте один раз — создавайте для любых рынков', 'Создайте цифрового ведущего для всех ваших видео', 'Выберите тариф под ваш объём производства'],
  de: ['Machen Sie aus jeder Content-Idee ein veröffentlichungsfertiges Video', 'Ein vernetztes System für Ihren gesamten Content-Workflow', 'Einmal einrichten. Für jeden Markt produzieren.', 'Erstellen Sie einen digitalen Moderator für all Ihre Videos', 'Wählen Sie den Tarif, der zu Ihrem Produktionsvolumen passt'],
  pt: ['Transforme qualquer ideia num vídeo pronto a publicar', 'Um único sistema ligado para todo o fluxo de produção de conteúdos', 'Configure uma vez. Crie para todos os mercados.', 'Crie um apresentador digital reutilizável em todos os vídeos', 'Escolha o plano certo para o seu volume de produção'],
  ar: ['حوّل أي فكرة محتوى إلى فيديو جاهز للنشر', 'نظام واحد متكامل لإدارة دورة إنتاج المحتوى بالكامل', 'أعدّه مرة واحدة، وأنشئ محتوى لكل سوق', 'أنشئ مقدّمًا رقميًا قابلًا لإعادة الاستخدام في جميع فيديوهاتك', 'اختر الخطة المناسبة لحجم إنتاجك'],
  it: ['Trasforma ogni idea in un video pronto per la pubblicazione', 'Un unico sistema connesso per l’intero flusso di produzione dei contenuti', 'Configura una volta. Crea per ogni mercato.', 'Crea un presenter digitale riutilizzabile in tutti i tuoi video', 'Scegli il piano più adatto al tuo volume di produzione'],
  ja: ['あらゆるアイデアを、そのまま公開できる動画へ', 'コンテンツ制作のすべてをつなぐ、ひとつの制作システム', '一度整えれば、あらゆる市場へ継続的に発信', 'すべての動画で活用できるデジタルヒューマンを作成', '制作量に合ったプランを選択'],
  ko: ['모든 콘텐츠 아이디어를 바로 게시할 수 있는 영상으로', '콘텐츠 제작 전 과정을 하나로 연결하는 제작 시스템', '한 번 설정하고, 모든 시장을 위한 콘텐츠를 제작하세요', '모든 영상에 재사용할 수 있는 디지털 휴먼을 만드세요', '제작 규모에 맞는 요금제를 선택하세요'],
  id: ['Ubah setiap ide menjadi video yang siap dipublikasikan', 'Satu sistem terhubung untuk seluruh alur produksi konten', 'Siapkan sekali. Berkarya untuk setiap pasar.', 'Buat presenter digital yang dapat digunakan kembali di setiap video', 'Pilih paket yang sesuai dengan volume produksi Anda'],
  vi: ['Biến mọi ý tưởng thành video sẵn sàng đăng tải', 'Một hệ thống kết nối toàn bộ quy trình sản xuất nội dung', 'Thiết lập một lần. Sáng tạo cho mọi thị trường.', 'Tạo người dẫn kỹ thuật số có thể tái sử dụng trong mọi video', 'Chọn gói phù hợp với quy mô sản xuất'],
  tr: ['Her içerik fikrini yayına hazır bir videoya dönüştürün', 'Tüm içerik üretim süreciniz için tek ve bağlantılı bir sistem', 'Bir kez kurun. Her pazar için üretin.', 'Tüm videolarınızda yeniden kullanabileceğiniz dijital bir sunucu oluşturun', 'Üretim hacminize uygun planı seçin'],
  nl: ['Maak van elk contentidee een video die klaar is om te publiceren', 'Één verbonden systeem voor je volledige contentproductie', 'Één keer instellen. Creëren voor elke markt.', 'Maak een digitale presentator die je in al je video’s kunt hergebruiken', 'Kies het abonnement dat bij je productievolume past'],
  uk: ['Перетворюйте будь-яку ідею на готове до публікації відео', 'Єдина система для всього циклу виробництва контенту', 'Налаштуйте один раз — створюйте для кожного ринку', 'Створіть цифрового ведучого для повторного використання у всіх відео', 'Оберіть тариф відповідно до обсягу виробництва'],
  th: ['เปลี่ยนทุกไอเดียให้เป็นวิดีโอพร้อมเผยแพร่', 'ระบบเดียวที่เชื่อมต่อทุกขั้นตอนการผลิตคอนเทนต์', 'ตั้งค่าครั้งเดียว สร้างสรรค์ได้ทุกตลาด', 'สร้างพิธีกรดิจิทัลที่นำกลับมาใช้ได้ในทุกวิดีโอ', 'เลือกแพ็กเกจให้เหมาะกับปริมาณการผลิต'],
  pl: ['Zamień każdy pomysł w materiał wideo gotowy do publikacji', 'Jeden połączony system dla całego procesu tworzenia treści', 'Skonfiguruj raz. Twórz na każdy rynek.', 'Stwórz cyfrowego prezentera do wykorzystania w każdym filmie', 'Wybierz plan dopasowany do skali produkcji'],
  ro: ['Transformă orice idee într-un videoclip gata de publicare', 'Un singur sistem conectat pentru întregul flux de producție de conținut', 'Configurează o singură dată. Creează pentru fiecare piață.', 'Creează un prezentator digital reutilizabil în toate videoclipurile', 'Alege planul potrivit volumului tău de producție'],
  el: ['Μετατρέψτε κάθε ιδέα σε βίντεο έτοιμο για δημοσίευση', 'Ένα ενιαίο, συνδεδεμένο σύστημα για όλη την παραγωγή περιεχομένου', 'Ρυθμίστε το μία φορά. Δημιουργήστε για κάθε αγορά.', 'Δημιουργήστε έναν ψηφιακό παρουσιαστή για χρήση σε κάθε βίντεο', 'Επιλέξτε το πρόγραμμα που ταιριάζει στον όγκο παραγωγής σας'],
  cs: ['Proměňte každý nápad ve video připravené k publikování', 'Jeden propojený systém pro celý proces tvorby obsahu', 'Nastavte jednou. Tvořte pro každý trh.', 'Vytvořte digitálního moderátora pro opakované použití v každém videu', 'Vyberte tarif podle objemu produkce'],
  fi: ['Muuta jokainen sisältöidea julkaisuvalmiiksi videoksi', 'Yksi yhdistetty järjestelmä koko sisällöntuotantoon', 'Määritä kerran. Luo sisältöä kaikille markkinoille.', 'Luo digitaalinen juontaja, jota voit käyttää kaikissa videoissasi', 'Valitse tuotantomäärääsi sopiva tilaus'],
  hi: ['हर कंटेंट आइडिया को प्रकाशित करने के लिए तैयार वीडियो में बदलें', 'पूरे कंटेंट प्रोडक्शन वर्कफ़्लो के लिए एक जुड़ा हुआ सिस्टम', 'एक बार सेट करें। हर बाज़ार के लिए बनाएँ।', 'हर वीडियो में दोबारा इस्तेमाल होने वाला डिजिटल प्रस्तुतकर्ता बनाएँ', 'अपने प्रोडक्शन वॉल्यूम के अनुसार प्लान चुनें'],
};

export const siteLocalizationOverrides = Object.fromEntries(Object.keys(siteRows).map((locale) => {
  const cta = Object.fromEntries(siteKeys.map((key, index) => [key, siteRows[locale][index]]));
  const marketing = Object.fromEntries(marketingKeys.map((key, index) => [key, marketingRows[locale][index]]));
  return [locale, { ...cta, ...marketing }];
}));

const actionKeys = ['Cancel', 'Close', 'Delete', 'Upload', 'Refresh', 'Load more', 'Download', 'Save', 'Edit', 'Publish', 'Retry', 'Back', 'Loading', 'Success', 'Failed', 'Processing', 'Draft', 'Ready'];
const actionAliases = {
  Cancel: ['Cancel', '取消'], Close: ['Close', '关闭'], Delete: ['Delete', '删除'], Upload: ['Upload', '上传'],
  Refresh: ['Refresh', '刷新'], 'Load more': ['Load more', '加载更多'], Download: ['Download', '下载'], Save: ['Save', '保存'],
  Edit: ['Edit', '编辑'], Publish: ['Publish', '发布'], Retry: ['Retry', '重试'], Back: ['Back', '返回'],
  Loading: ['Loading', '加载中'], Success: ['Success', '成功'], Failed: ['Failed', '失败'], Processing: ['Processing', '制作中', '处理中'],
  Draft: ['Draft', '草稿'], Ready: ['Ready', '就绪'],
};
const actionRows = {
  'en-US': ['Cancel', 'Close', 'Delete', 'Upload', 'Refresh', 'Load more', 'Download', 'Save', 'Edit', 'Publish', 'Try again', 'Back', 'Loading…', 'Completed', 'Failed', 'Processing', 'Draft', 'Ready'],
  'zh-CN': ['取消', '关闭', '删除', '上传', '刷新', '加载更多', '下载', '保存', '编辑', '发布', '重试', '返回', '加载中…', '已完成', '失败', '处理中', '草稿', '就绪'],
  'zh-TW': ['取消', '關閉', '刪除', '上傳', '重新整理', '載入更多', '下載', '儲存', '編輯', '發佈', '重試', '返回', '載入中…', '已完成', '失敗', '處理中', '草稿', '就緒'],
  'es-MX': ['Cancelar', 'Cerrar', 'Eliminar', 'Subir', 'Actualizar', 'Cargar más', 'Descargar', 'Guardar', 'Editar', 'Publicar', 'Reintentar', 'Volver', 'Cargando…', 'Completado', 'Error', 'Procesando', 'Borrador', 'Listo'],
  'fr-FR': ['Annuler', 'Fermer', 'Supprimer', 'Importer', 'Actualiser', 'Afficher plus', 'Télécharger', 'Enregistrer', 'Modifier', 'Publier', 'Réessayer', 'Retour', 'Chargement…', 'Terminé', 'Échec', 'Traitement en cours', 'Brouillon', 'Prêt'],
  'ru-RU': ['Отмена', 'Закрыть', 'Удалить', 'Загрузить', 'Обновить', 'Показать ещё', 'Скачать', 'Сохранить', 'Изменить', 'Опубликовать', 'Повторить', 'Назад', 'Загрузка…', 'Готово', 'Ошибка', 'Обработка', 'Черновик', 'Готово'],
  'de-DE': ['Abbrechen', 'Schließen', 'Löschen', 'Hochladen', 'Aktualisieren', 'Mehr laden', 'Herunterladen', 'Speichern', 'Bearbeiten', 'Veröffentlichen', 'Erneut versuchen', 'Zurück', 'Wird geladen…', 'Abgeschlossen', 'Fehlgeschlagen', 'Wird verarbeitet', 'Entwurf', 'Bereit'],
  'pt-PT': ['Cancelar', 'Fechar', 'Eliminar', 'Carregar', 'Atualizar', 'Carregar mais', 'Transferir', 'Guardar', 'Editar', 'Publicar', 'Tentar novamente', 'Voltar', 'A carregar…', 'Concluído', 'Falhou', 'Em processamento', 'Rascunho', 'Pronto'],
  'ar-AE': ['إلغاء', 'إغلاق', 'حذف', 'رفع', 'تحديث', 'تحميل المزيد', 'تنزيل', 'حفظ', 'تعديل', 'نشر', 'إعادة المحاولة', 'رجوع', 'جارٍ التحميل…', 'مكتمل', 'فشل', 'جارٍ المعالجة', 'مسودة', 'جاهز'],
  'it-IT': ['Annulla', 'Chiudi', 'Elimina', 'Carica', 'Aggiorna', 'Carica altro', 'Scarica', 'Salva', 'Modifica', 'Pubblica', 'Riprova', 'Indietro', 'Caricamento…', 'Completato', 'Non riuscito', 'Elaborazione…', 'Bozza', 'Pronto'],
  'ja-JP': ['キャンセル', '閉じる', '削除', 'アップロード', '更新', 'さらに読み込む', 'ダウンロード', '保存', '編集', '公開', '再試行', '戻る', '読み込み中…', '完了', '失敗', '処理中', '下書き', '準備完了'],
  'ko-KR': ['취소', '닫기', '삭제', '업로드', '새로고침', '더 보기', '다운로드', '저장', '편집', '게시', '다시 시도', '뒤로', '불러오는 중…', '완료', '실패', '처리 중', '초안', '준비됨'],
  'id-ID': ['Batal', 'Tutup', 'Hapus', 'Unggah', 'Muat ulang', 'Muat lainnya', 'Unduh', 'Simpan', 'Edit', 'Publikasikan', 'Coba lagi', 'Kembali', 'Memuat…', 'Selesai', 'Gagal', 'Memproses', 'Draf', 'Siap'],
  'vi-VN': ['Hủy', 'Đóng', 'Xóa', 'Tải lên', 'Làm mới', 'Xem thêm', 'Tải xuống', 'Lưu', 'Chỉnh sửa', 'Đăng', 'Thử lại', 'Quay lại', 'Đang tải…', 'Hoàn tất', 'Thất bại', 'Đang xử lý', 'Bản nháp', 'Sẵn sàng'],
  'tr-TR': ['İptal', 'Kapat', 'Sil', 'Yükle', 'Yenile', 'Daha fazla yükle', 'İndir', 'Kaydet', 'Düzenle', 'Yayınla', 'Tekrar dene', 'Geri', 'Yükleniyor…', 'Tamamlandı', 'Başarısız', 'İşleniyor', 'Taslak', 'Hazır'],
  'nl-NL': ['Annuleren', 'Sluiten', 'Verwijderen', 'Uploaden', 'Vernieuwen', 'Meer laden', 'Downloaden', 'Opslaan', 'Bewerken', 'Publiceren', 'Opnieuw proberen', 'Terug', 'Laden…', 'Voltooid', 'Mislukt', 'Wordt verwerkt', 'Concept', 'Gereed'],
  'uk-UA': ['Скасувати', 'Закрити', 'Видалити', 'Завантажити', 'Оновити', 'Показати ще', 'Завантажити', 'Зберегти', 'Редагувати', 'Опублікувати', 'Спробувати ще раз', 'Назад', 'Завантаження…', 'Завершено', 'Помилка', 'Обробка', 'Чернетка', 'Готово'],
  'th-TH': ['ยกเลิก', 'ปิด', 'ลบ', 'อัปโหลด', 'รีเฟรช', 'โหลดเพิ่ม', 'ดาวน์โหลด', 'บันทึก', 'แก้ไข', 'เผยแพร่', 'ลองอีกครั้ง', 'กลับ', 'กำลังโหลด…', 'เสร็จสิ้น', 'ล้มเหลว', 'กำลังประมวลผล', 'แบบร่าง', 'พร้อม'],
  'pl-PL': ['Anuluj', 'Zamknij', 'Usuń', 'Prześlij', 'Odśwież', 'Wczytaj więcej', 'Pobierz', 'Zapisz', 'Edytuj', 'Opublikuj', 'Spróbuj ponownie', 'Wstecz', 'Ładowanie…', 'Gotowe', 'Niepowodzenie', 'Przetwarzanie', 'Wersja robocza', 'Gotowe'],
  'ro-RO': ['Anulează', 'Închide', 'Șterge', 'Încarcă', 'Reîmprospătează', 'Încarcă mai multe', 'Descarcă', 'Salvează', 'Editează', 'Publică', 'Încearcă din nou', 'Înapoi', 'Se încarcă…', 'Finalizat', 'Eșuat', 'În curs de procesare', 'Ciornă', 'Gata'],
  'el-GR': ['Ακύρωση', 'Κλείσιμο', 'Διαγραφή', 'Μεταφόρτωση', 'Ανανέωση', 'Φόρτωση περισσότερων', 'Λήψη', 'Αποθήκευση', 'Επεξεργασία', 'Δημοσίευση', 'Δοκιμή ξανά', 'Πίσω', 'Φόρτωση…', 'Ολοκληρώθηκε', 'Απέτυχε', 'Υπό επεξεργασία', 'Πρόχειρο', 'Έτοιμο'],
  'cs-CZ': ['Zrušit', 'Zavřít', 'Smazat', 'Nahrát', 'Obnovit', 'Načíst další', 'Stáhnout', 'Uložit', 'Upravit', 'Publikovat', 'Zkusit znovu', 'Zpět', 'Načítání…', 'Dokončeno', 'Selhalo', 'Zpracovává se', 'Koncept', 'Připraveno'],
  'fi-FI': ['Peruuta', 'Sulje', 'Poista', 'Lataa palveluun', 'Päivitä', 'Lataa lisää', 'Lataa', 'Tallenna', 'Muokkaa', 'Julkaise', 'Yritä uudelleen', 'Takaisin', 'Ladataan…', 'Valmis', 'Epäonnistui', 'Käsitellään', 'Luonnos', 'Valmis'],
  'hi-IN': ['रद्द करें', 'बंद करें', 'हटाएँ', 'अपलोड करें', 'रीफ़्रेश करें', 'और लोड करें', 'डाउनलोड करें', 'सेव करें', 'संपादित करें', 'प्रकाशित करें', 'फिर से कोशिश करें', 'वापस', 'लोड हो रहा है…', 'पूरा हुआ', 'विफल', 'प्रोसेस हो रहा है', 'ड्राफ़्ट', 'तैयार'],
};

const workflowKeys = [
  'HOT TOPIC TO VIDEO',
  'MAIN FLOW',
  'Workflow essentials',
  '从热点开始',
  '直接制作视频',
  '从热点到发布',
  '主流程',
  '确认热点',
  '生成文案',
  '制作视频',
  '热点确认',
  '发给智能体',
  '视频制作',
  '发布',
  '环节拆解',
  '当前推进',
  '工作流',
  '打开热点',
  '选择智能体',
  '查看发布',
  '套餐与额度',
  '查看套餐',
];

const workflowRows = {
  'en-US': ['Hot topic to video', 'Main flow', 'Workflow', 'Start with trends', 'Make a video now', 'From trend to publish', 'Main flow', 'Confirm trend', 'Generate script', 'Make video', 'Confirm trend', 'Send to agent', 'Video production', 'Publish', 'Breakdown', 'Progress', 'Workflow', 'Open trends', 'Choose agent', 'View publishing', 'Plan and quota', 'View plan'],
  'zh-CN': ['热点到视频', '主流程', '工作流', '从热点开始', '直接制作视频', '从热点到发布', '主流程', '确认热点', '生成文案', '制作视频', '热点确认', '发给智能体', '视频制作', '发布', '环节拆解', '当前推进', '工作流', '打开热点', '选择智能体', '查看发布', '套餐与额度', '查看套餐'],
  'zh-TW': ['熱點到影片', '主流程', '工作流', '從熱點開始', '直接製作影片', '從熱點到發佈', '主流程', '確認熱點', '生成文案', '製作影片', '熱點確認', '發給智能體', '影片製作', '發佈', '環節拆解', '目前推進', '工作流', '打開熱點', '選擇智能體', '查看發佈', '方案與額度', '查看方案'],
  'es-MX': ['Del tema en tendencia al video', 'Flujo principal', 'Flujo de trabajo', 'Empezar con tendencias', 'Crear video ahora', 'De tendencia a publicación', 'Flujo principal', 'Confirmar tendencia', 'Generar guion', 'Crear video', 'Confirmar tendencia', 'Enviar al agente', 'Producción de video', 'Publicar', 'Desglose', 'Progreso', 'Flujo', 'Abrir tendencias', 'Elegir agente', 'Ver publicación', 'Plan y cuota', 'Ver plan'],
  'fr-FR': ['Du sujet tendance à la vidéo', 'Flux principal', 'Workflow', 'Commencer par les tendances', 'Créer une vidéo', 'De la tendance à la publication', 'Flux principal', 'Valider la tendance', 'Générer le script', 'Créer la vidéo', 'Validation tendance', 'Envoyer à l’agent', 'Production vidéo', 'Publier', 'Découpage', 'Progression', 'Workflow', 'Ouvrir les tendances', 'Choisir un agent', 'Voir la publication', 'Offre et quota', 'Voir l’offre'],
  'ru-RU': ['От тренда к видео', 'Основной поток', 'Рабочий процесс', 'Начать с трендов', 'Создать видео', 'От тренда к публикации', 'Основной поток', 'Подтвердить тренд', 'Создать сценарий', 'Сделать видео', 'Подтверждение тренда', 'Отправить агенту', 'Производство видео', 'Опубликовать', 'Разбор этапов', 'Прогресс', 'Процесс', 'Открыть тренды', 'Выбрать агента', 'Смотреть публикацию', 'Тариф и квота', 'Смотреть тариф'],
  'de-DE': ['Vom Trend zum Video', 'Hauptablauf', 'Workflow', 'Mit Trends starten', 'Video direkt erstellen', 'Vom Trend zur Veröffentlichung', 'Hauptablauf', 'Trend bestätigen', 'Skript erstellen', 'Video erstellen', 'Trendbestätigung', 'An Agent senden', 'Videoproduktion', 'Veröffentlichen', 'Aufschlüsselung', 'Fortschritt', 'Workflow', 'Trends öffnen', 'Agent wählen', 'Veröffentlichung ansehen', 'Plan und Kontingent', 'Plan ansehen'],
  'pt-PT': ['Do tópico em alta ao vídeo', 'Fluxo principal', 'Fluxo de trabalho', 'Começar pelas tendências', 'Criar vídeo agora', 'Da tendência à publicação', 'Fluxo principal', 'Confirmar tendência', 'Gerar guião', 'Criar vídeo', 'Confirmação de tendência', 'Enviar ao agente', 'Produção de vídeo', 'Publicar', 'Detalhamento', 'Progresso', 'Fluxo', 'Abrir tendências', 'Escolher agente', 'Ver publicação', 'Plano e quota', 'Ver plano'],
  'ar-AE': ['من الموضوع الرائج إلى الفيديو', 'المسار الرئيسي', 'سير العمل', 'ابدأ بالموضوعات الرائجة', 'إنشاء فيديو الآن', 'من الترند إلى النشر', 'المسار الرئيسي', 'تأكيد الترند', 'إنشاء النص', 'إنشاء الفيديو', 'تأكيد الترند', 'إرسال إلى الوكيل', 'إنتاج الفيديو', 'نشر', 'تفصيل المراحل', 'التقدم', 'سير العمل', 'فتح الترندات', 'اختيار الوكيل', 'عرض النشر', 'الخطة والحصة', 'عرض الخطة'],
  'it-IT': ['Dal trend al video', 'Flusso principale', 'Workflow', 'Inizia dai trend', 'Crea subito un video', 'Dal trend alla pubblicazione', 'Flusso principale', 'Conferma trend', 'Genera script', 'Crea video', 'Conferma trend', 'Invia all’agente', 'Produzione video', 'Pubblica', 'Scomposizione', 'Avanzamento', 'Workflow', 'Apri trend', 'Scegli agente', 'Vedi pubblicazione', 'Piano e quota', 'Vedi piano'],
  'ja-JP': ['トレンドから動画へ', 'メインフロー', 'ワークフロー', 'トレンドから開始', 'すぐ動画を作成', 'トレンドから公開まで', 'メインフロー', 'トレンド確認', '台本生成', '動画制作', 'トレンド確認', 'エージェントへ送信', '動画制作', '公開', '工程分解', '進行状況', 'ワークフロー', 'トレンドを開く', 'エージェントを選択', '公開を確認', 'プランと枠', 'プランを見る'],
  'ko-KR': ['트렌드에서 영상까지', '메인 플로우', '워크플로', '트렌드로 시작', '바로 영상 제작', '트렌드에서 게시까지', '메인 플로우', '트렌드 확인', '대본 생성', '영상 제작', '트렌드 확인', '에이전트로 보내기', '영상 제작', '게시', '단계 분해', '진행 상황', '워크플로', '트렌드 열기', '에이전트 선택', '게시 보기', '요금제와 한도', '요금제 보기'],
  'id-ID': ['Dari tren ke video', 'Alur utama', 'Alur kerja', 'Mulai dari tren', 'Buat video sekarang', 'Dari tren ke publikasi', 'Alur utama', 'Konfirmasi tren', 'Buat naskah', 'Buat video', 'Konfirmasi tren', 'Kirim ke agen', 'Produksi video', 'Publikasikan', 'Rincian tahap', 'Progres', 'Alur kerja', 'Buka tren', 'Pilih agen', 'Lihat publikasi', 'Paket dan kuota', 'Lihat paket'],
  'vi-VN': ['Từ xu hướng đến video', 'Luồng chính', 'Quy trình', 'Bắt đầu từ xu hướng', 'Tạo video ngay', 'Từ xu hướng đến đăng tải', 'Luồng chính', 'Xác nhận xu hướng', 'Tạo kịch bản', 'Tạo video', 'Xác nhận xu hướng', 'Gửi cho agent', 'Sản xuất video', 'Đăng tải', 'Tách bước', 'Tiến độ', 'Quy trình', 'Mở xu hướng', 'Chọn agent', 'Xem đăng tải', 'Gói và hạn mức', 'Xem gói'],
  'tr-TR': ['Trendden videoya', 'Ana akış', 'İş akışı', 'Trendlerden başla', 'Hemen video oluştur', 'Trendden yayına', 'Ana akış', 'Trendi onayla', 'Metin oluştur', 'Video oluştur', 'Trend onayı', 'Ajana gönder', 'Video üretimi', 'Yayınla', 'Aşamalar', 'İlerleme', 'İş akışı', 'Trendleri aç', 'Ajan seç', 'Yayını görüntüle', 'Plan ve kota', 'Planı görüntüle'],
  'nl-NL': ['Van trend naar video', 'Hoofdstroom', 'Workflow', 'Begin met trends', 'Maak direct een video', 'Van trend naar publicatie', 'Hoofdstroom', 'Trend bevestigen', 'Script genereren', 'Video maken', 'Trendbevestiging', 'Naar agent sturen', 'Videoproductie', 'Publiceren', 'Uitsplitsing', 'Voortgang', 'Workflow', 'Trends openen', 'Agent kiezen', 'Publicatie bekijken', 'Plan en quota', 'Plan bekijken'],
  'uk-UA': ['Від тренду до відео', 'Основний потік', 'Робочий процес', 'Почати з трендів', 'Створити відео зараз', 'Від тренду до публікації', 'Основний потік', 'Підтвердити тренд', 'Створити сценарій', 'Створити відео', 'Підтвердження тренду', 'Надіслати агенту', 'Виробництво відео', 'Опублікувати', 'Розбір етапів', 'Прогрес', 'Процес', 'Відкрити тренди', 'Вибрати агента', 'Переглянути публікацію', 'План і квота', 'Переглянути план'],
  'th-TH': ['จากเทรนด์สู่วิดีโอ', 'โฟลว์หลัก', 'เวิร์กโฟลว์', 'เริ่มจากเทรนด์', 'สร้างวิดีโอทันที', 'จากเทรนด์สู่การเผยแพร่', 'โฟลว์หลัก', 'ยืนยันเทรนด์', 'สร้างสคริปต์', 'สร้างวิดีโอ', 'ยืนยันเทรนด์', 'ส่งให้เอเจนต์', 'ผลิตวิดีโอ', 'เผยแพร่', 'แยกขั้นตอน', 'ความคืบหน้า', 'เวิร์กโฟลว์', 'เปิดเทรนด์', 'เลือกเอเจนต์', 'ดูการเผยแพร่', 'แพ็กเกจและโควตา', 'ดูแพ็กเกจ'],
  'pl-PL': ['Od trendu do wideo', 'Główny przepływ', 'Workflow', 'Zacznij od trendów', 'Utwórz wideo teraz', 'Od trendu do publikacji', 'Główny przepływ', 'Potwierdź trend', 'Wygeneruj scenariusz', 'Utwórz wideo', 'Potwierdzenie trendu', 'Wyślij do agenta', 'Produkcja wideo', 'Opublikuj', 'Podział etapów', 'Postęp', 'Workflow', 'Otwórz trendy', 'Wybierz agenta', 'Zobacz publikację', 'Plan i limit', 'Zobacz plan'],
  'ro-RO': ['De la trend la video', 'Flux principal', 'Workflow', 'Începe cu tendințele', 'Creează video acum', 'De la trend la publicare', 'Flux principal', 'Confirmă trendul', 'Generează scriptul', 'Creează video', 'Confirmare trend', 'Trimite către agent', 'Producție video', 'Publică', 'Descompunere', 'Progres', 'Workflow', 'Deschide tendințe', 'Alege agentul', 'Vezi publicarea', 'Plan și cotă', 'Vezi planul'],
  'el-GR': ['Από τάση σε βίντεο', 'Κύρια ροή', 'Ροή εργασίας', 'Ξεκινήστε από τις τάσεις', 'Δημιουργία βίντεο τώρα', 'Από την τάση στη δημοσίευση', 'Κύρια ροή', 'Επιβεβαίωση τάσης', 'Δημιουργία σεναρίου', 'Δημιουργία βίντεο', 'Επιβεβαίωση τάσης', 'Αποστολή στον agent', 'Παραγωγή βίντεο', 'Δημοσίευση', 'Ανάλυση σταδίων', 'Πρόοδος', 'Ροή εργασίας', 'Άνοιγμα τάσεων', 'Επιλογή agent', 'Προβολή δημοσίευσης', 'Πλάνο και όριο', 'Προβολή πλάνου'],
  'cs-CZ': ['Od trendu k videu', 'Hlavní tok', 'Workflow', 'Začít trendy', 'Vytvořit video', 'Od trendu k publikování', 'Hlavní tok', 'Potvrdit trend', 'Vygenerovat scénář', 'Vytvořit video', 'Potvrzení trendu', 'Odeslat agentovi', 'Produkce videa', 'Publikovat', 'Rozpad etap', 'Postup', 'Workflow', 'Otevřít trendy', 'Vybrat agenta', 'Zobrazit publikování', 'Plán a kvóta', 'Zobrazit plán'],
  'fi-FI': ['Trendistä videoksi', 'Päävirta', 'Työnkulku', 'Aloita trendeistä', 'Luo video nyt', 'Trendistä julkaisuun', 'Päävirta', 'Vahvista trendi', 'Luo käsikirjoitus', 'Luo video', 'Trendin vahvistus', 'Lähetä agentille', 'Videotuotanto', 'Julkaise', 'Vaiheistus', 'Edistyminen', 'Työnkulku', 'Avaa trendit', 'Valitse agentti', 'Näytä julkaisu', 'Paketti ja kiintiö', 'Näytä paketti'],
  'hi-IN': ['ट्रेंड से वीडियो तक', 'मुख्य फ़्लो', 'वर्कफ़्लो', 'ट्रेंड से शुरू करें', 'अभी वीडियो बनाएँ', 'ट्रेंड से पब्लिश तक', 'मुख्य फ़्लो', 'ट्रेंड की पुष्टि करें', 'स्क्रिप्ट बनाएँ', 'वीडियो बनाएँ', 'ट्रेंड पुष्टि', 'एजेंट को भेजें', 'वीडियो उत्पादन', 'प्रकाशित करें', 'स्टेप ब्रेकडाउन', 'प्रगति', 'वर्कफ़्लो', 'ट्रेंड खोलें', 'एजेंट चुनें', 'प्रकाशन देखें', 'प्लान और कोटा', 'प्लान देखें'],
};

export const workspaceLocalizationOverrides = Object.fromEntries(Object.entries(actionRows).map(([locale, values]) => {
  const overrides = {};
  actionKeys.forEach((key, index) => actionAliases[key].forEach((source) => { overrides[source] = values[index]; }));
  workflowKeys.forEach((key, index) => { overrides[key] = workflowRows[locale][index]; });
  return [locale, overrides];
}));
