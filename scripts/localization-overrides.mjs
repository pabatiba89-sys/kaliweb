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

export const workspaceLocalizationOverrides = Object.fromEntries(Object.entries(actionRows).map(([locale, values]) => {
  const overrides = {};
  actionKeys.forEach((key, index) => actionAliases[key].forEach((source) => { overrides[source] = values[index]; }));
  return [locale, overrides];
}));
