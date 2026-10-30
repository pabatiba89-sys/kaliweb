// Reference: https://openapi-doc.shanjian.tv/8489759m0
// Filming guidance checked against the provider's official notes and Kali's current forms.
// Public sample media must be supplied or explicitly approved by the owner.
const guides = {
  'zh-cn': {
    lead: '数字人像不像你，先看形象素材拍得怎么样。喀理支持视频 1:1 复刻和图片数字人：先把人拍清楚，再按页面要求完成授权，就可以提交制作。',
    description: '了解视频 1:1 复刻与图片数字人的区别，跟着准备光线、机位、口播视频或形象照片，再完成本人授权和提交。',
    toc: '这篇怎么用',
    sections: [
      { title: '先选：用视频，还是用图片？', body: '想沿用自己出镜时的形象，就准备一段口播视频，选「视频训练」；手里已经有合适的形象照片，也可以选「图生数字人」。两种方式都需要完成授权。', items: [
        ['视频 1:1 复刻', '准备一段 30–120 秒的本人出镜视频。人在画面里正常张嘴说话，形象、表情和姿态都尽量接近平时出镜的状态。这里的 1:1 指视频形象复刻，不是画面的宽高比例。'],
        ['图片数字人', '准备一张清楚、无遮挡的单人形象图。从已有 AI 图片中选择，或上传本地 JPG、JPEG、PNG、WebP 图片。照片负责提供形象，后续再用文案和声音制作口播。'],
      ] },
      { title: '拍之前，先把光线和机位摆好', body: '不用先买一套摄影设备。先看拍出来的人脸是不是清楚、稳定，眼睛和嘴巴有没有被挡住。下面是拍摄建议，可以按自己的场地调整。', items: [
        ['光从正面来', '找光线均匀的位置，窗户或柔和的灯放在脸的前方。别背对亮窗，也别让一半脸亮、一半脸黑。'],
        ['镜头放稳，人看镜头', '手机或相机固定好，镜头尽量与眼睛齐平。以正面为主，别大幅转头、低头或仰头；人一直留在画面里。'],
        ['先想好要呈现的样子', '穿准备长期出镜的衣服，整理好头发。建议从自然的半身构图开始，留出头顶和肩膀的空间，背景尽量简洁。'],
        ['画面里只留一个人', '确认背景、镜子或屏幕里没有其他人脸。头发、手、麦克风都别挡住嘴巴，拍完放大检查一次。'],
      ] },
      { title: '视频 1:1 复刻：录的时候注意这些', body: '个人形象视频录 30 秒到 2 分钟，内容可以是自我介绍，也可以讲一段自己熟悉的话题。先练一遍，再开始录。', items: [
        ['开头先闭嘴，再自然开口', '第一秒保持闭嘴，随后正常张嘴说话。用于视频复刻的素材不能全程抿嘴、只摆姿势。'],
        ['像平时聊天一样说', '选安静的地方，用自然的表情、语速和音量讲完。不要为了显得有表现力，一直晃头、频繁转身或用手遮住脸。'],
        ['建议一段连续拍完', '机位、光线和构图保持稳定。尽量保留原始素材，不加美颜变脸、字幕贴纸或转场，避免处理后看不清真实五官。'],
        ['从头到尾看一遍', '检查是否失焦、脸太暗、嘴被挡住、有人闯入画面，或讲到一半走出了镜头。有这些问题，重新录一段更省事。'],
      ] },
      { title: '图片数字人：照片怎么选', body: '先看照片能不能把这个人的脸交代清楚。好看的氛围照，不一定适合拿来做数字人。下面这些是选图建议。', items: [
        ['先选清楚的正面单人照', '脸部尽量朝向镜头，眼睛和嘴巴清楚可见。别用合照、远景、严重侧脸、墨镜遮眼或头发遮脸的照片。'],
        ['表情自然，五官别改过头', '建议选嘴巴自然闭合、神态放松的照片。避免过度美颜、夸张滤镜，以及嘴部、牙齿或脸型已经变形的图片。'],
        ['留出合适的画面空间', '建议用能看清头部和肩膀的照片，别紧贴脸边裁切。衣服、姿态和背景，尽量贴近你之后想呈现的出镜风格。'],
        ['用你有权使用的图片', '支持已有 AI 图片或本地上传。使用 AI 图片时也要检查五官是否自然，并确认可以使用其中的人物形象。'],
      ] },
      { title: '形象素材和授权视频，分开准备', body: '形象素材决定数字人长什么样；授权视频用于确认本人允许使用相关形象。两份材料各有用途，不要把普通自我介绍当成授权视频。', items: [
        ['跟着当前页面读授权文案', '在喀理制作页查看本次授权口播，按提示录制。不要照搬其他平台的品牌名或旧文案。'],
        ['图片数字人也要授权', '选好照片后，仍需上传本人授权视频；页面支持时，也可以选择对应的团队授权视频，并确认授权与本次人物匹配。'],
        ['看完协议再提交', '确认形象素材、授权视频属于同一位人物，阅读页面中的专项协议后再勾选同意。'],
      ] },
      { title: '准备好了，在喀理里这样提交', body: '进入「数字人资产」，给形象起个方便识别的名字，再选择制作方式。', items: [
        ['做视频复刻', '选「视频训练」，上传个人形象视频，再上传或选择对应的授权视频。确认资料和协议后，点「提交数字人训练」。'],
        ['做图片数字人', '选「图生数字人」，选择已有图片或点「上传图片」，再准备对应授权视频。确认后，点「提交图生数字人」。'],
        ['先试做一条，再继续创作', '等待资产状态就绪，选一段短文案和合适的声音试做口播。重点看脸、嘴型、表情是否自然；遇到失败，先打开任务查看原因。'],
      ] },
    ],
  },
  'zh-tw': {
    lead: '數位人像不像你，先看形象素材拍得怎麼樣。喀理支援影片 1:1 複刻和圖片數位人：先把人拍清楚，再按頁面要求完成授權，就可以提交製作。',
    description: '了解影片 1:1 複刻與圖片數位人的差別，準備光線、機位、口播影片或形象照片，再完成本人授權和提交。', toc: '這篇怎麼用',
    sections: [
      { title: '先選：用影片，還是用圖片？', body: '想沿用自己出鏡時的形象，就準備一段口播影片，選影片訓練；有合適的形象照片，也可以選圖生數位人。兩種方式都需要授權。', items: [['影片 1:1 複刻', '準備 30–120 秒的本人出鏡影片，正常張嘴說話，表情和姿態接近平時出鏡的狀態。1:1 指形象複刻，不是畫面的長寬比。'], ['圖片數位人', '從已有 AI 圖片中選擇，或上傳清楚的單人 JPG、JPEG、PNG、WebP 圖片。照片提供形象，再配文案和聲音製作口播。']] },
      { title: '拍之前，先把光線和機位擺好', body: '不用先買一套攝影設備。先看人臉是不是清楚、穩定，眼睛和嘴巴有沒有被擋住。以下是拍攝建議。', items: [['光從正面來', '找光線均勻的位置，讓窗戶或柔和的燈在臉前方，避免逆光或半邊臉太暗。'], ['鏡頭放穩，人看鏡頭', '固定手機或相機，鏡頭盡量與眼睛齊平。以正面為主，不大幅轉頭，人物全程留在畫面中。'], ['先想好出鏡的樣子', '穿準備長期出鏡的衣服，整理頭髮。建議從自然的半身構圖開始，頭頂和肩膀留點空間，背景簡潔。'], ['畫面裡只留一個人', '檢查鏡子、螢幕或背景沒有其他人臉，頭髮、手和麥克風也別擋住嘴巴。']] },
      { title: '影片 1:1 複刻：錄的時候注意這些', body: '形象影片錄 30 秒到 2 分鐘。可以自我介紹，也可以聊熟悉的話題，先練一遍再錄。', items: [['開頭先閉嘴，再自然開口', '第一秒保持閉嘴，隨後正常張嘴說話，不能全程只擺姿勢。'], ['像平時聊天一樣說', '在安靜的地方自然表達，不頻繁晃頭、轉身或用手遮臉。'], ['建議一段連續拍完', '光線、構圖和機位保持穩定，盡量保留原始素材，避免美顏變臉、字幕貼紙和轉場。'], ['從頭到尾看一遍', '確認沒有失焦、嘴巴被擋住、其他人入鏡或人物離開鏡頭，必要時重錄。']] },
      { title: '圖片數位人：照片怎麼選', body: '先看照片能不能清楚呈現這個人的臉。好看的氛圍照，不一定適合製作數位人。以下是選圖建議。', items: [['選清楚的正面單人照', '眼睛和嘴巴清楚可見，避開合照、遠景、嚴重側臉、墨鏡或頭髮遮臉。'], ['表情自然，五官別改過頭', '建議嘴巴自然閉合、神態放鬆，避免過度美顏或嘴部、牙齒變形的圖片。'], ['留出畫面空間', '頭部和肩膀清楚，不要貼著臉邊裁切；衣服、姿態和背景貼近之後想呈現的風格。'], ['確認圖片使用權', '支援已有 AI 圖片或本地上傳；使用 AI 圖片時，也要檢查五官自然並確認人物形象使用權。']] },
      { title: '形象素材和授權影片，分開準備', body: '形象素材決定數位人的樣子；授權影片確認本人同意使用。普通自我介紹不能代替授權。', items: [['按目前頁面讀授權文案', '查看喀理製作頁的本次授權文案，不照搬其他平台的品牌名或舊文案。'], ['圖片數位人也要授權', '選好照片後仍需本人授權影片；頁面支援時可選對應團隊授權影片，確認人物匹配。'], ['閱讀協議後提交', '確認兩份材料是同一位人物，閱讀專項協議後再勾選同意。']] },
      { title: '準備好了，在喀理裡這樣提交', body: '進入數位人資產，為形象命名並選擇製作方式。', items: [['做影片複刻', '選影片訓練，上傳個人形象影片和對應授權影片，確認資料及協議後提交。'], ['做圖片數位人', '選圖生數位人，選已有圖片或上傳圖片，準備對應授權影片，確認後提交。'], ['先試做一支', '等待資產就緒，用短文案和合適的聲音試做口播，檢查臉、嘴型和表情。失敗時先查看任務原因。']] },
    ],
  },
  en: {
    lead: 'A good digital presenter starts with good source material. Kali supports video-based 1:1 replication and image-based presenters. Capture a clear likeness, then complete the authorization shown in the workspace.',
    description: 'Prepare a talking video or portrait for a digital presenter: lighting, framing, facial movement, image selection, authorization, and submission in Kali.', toc: 'In this guide',
    sections: [
      { title: 'Choose a video or a photo', body: 'Use Video training when you want to work from your on-camera appearance. Use an image-based presenter when you already have a suitable portrait. Both paths require authorization.', items: [['Video-based 1:1 replication', 'Provide a 30–120 second video of yourself speaking with normal mouth movement and a natural expression. Here, 1:1 describes likeness replication, not a square aspect ratio.'], ['Image-based presenter', 'Select an existing AI image or upload a clear single-person JPG, JPEG, PNG, or WebP image. The image supplies the appearance; scripts and a selected voice are used in later video creation.']] },
      { title: 'Set up the light and camera first', body: 'Start with a steady, clear view of your face. These filming suggestions can be adapted to your location.', items: [['Light your face from the front', 'Use even window light or a soft lamp. Avoid a bright window behind you or deep shadows across half your face.'], ['Keep the camera steady', 'Place it near eye level and face it directly. Avoid large head turns, looking down, or leaving the frame.'], ['Choose your on-camera look', 'Wear the clothes you plan to present in. A natural upper-body shot with space around your head and shoulders is a useful starting point. Keep the background simple.'], ['Keep other faces out', 'Check mirrors, screens, and the background. Keep hair, hands, and microphones away from your mouth.']] },
      { title: 'Recording for video-based replication', body: 'Record 30 seconds to 2 minutes. Introduce yourself or discuss a familiar topic; rehearse before recording.', items: [['Start with your mouth closed', 'Keep your mouth closed for the first second, then speak normally. A silent posing video is unsuitable for this replication workflow.'], ['Speak as you normally would', 'Use a quiet location and natural delivery. Avoid repeated head movements, turning away, or covering your face.'], ['Prefer one continuous take', 'Keep the light and framing stable. Use the original footage where possible and avoid face-altering filters, stickers, captions, or transitions.'], ['Watch the whole recording', 'Check focus, lighting, mouth visibility, other faces, and whether you stay in frame. Record again if these issues appear.']] },
      { title: 'Choosing a portrait for an image-based presenter', body: 'Choose a photo that clearly shows the person. An atmospheric photo is not always a useful input. These are selection suggestions.', items: [['Prefer a clear, front-facing portrait', 'Keep the eyes and mouth visible. Avoid group photos, distant subjects, strong profiles, sunglasses, and hair over the face.'], ['Keep the expression natural', 'A relaxed expression with the mouth naturally closed is a useful starting point. Avoid heavy beauty filters and distorted facial features.'], ['Leave some space', 'Show the head and shoulders without cropping tightly against the face. Choose clothing, posture, and a background suited to the intended presentation.'], ['Check the image rights', 'Use an existing AI image or upload your own. Check AI faces for natural features and confirm that you can use the depicted likeness.']] },
      { title: 'Prepare authorization separately', body: 'The source material provides the appearance. The authorization video confirms permission. A casual introduction does not replace authorization.', items: [['Read the wording shown in Kali', 'Use the current authorization script in the creation form. Do not copy another service’s brand name or an old script.'], ['Photos still need authorization', 'Provide the matching authorization video. Where the form offers a team authorization library, select the record for the correct person.'], ['Review before submitting', 'Check that the source and authorization concern the same person, then read and accept the relevant agreements.']] },
      { title: 'Submit in Kali and review a first result', body: 'Open Digital Human Assets, name the presenter, and choose the creation path.', items: [['Video replication', 'Choose Video training. Upload the profile video and provide the matching authorization video. Review the form and agreements, then submit.'], ['Image-based creation', 'Choose the image-based tab, select an existing image or upload one, and provide matching authorization before submitting.'], ['Try a short script first', 'Wait for the asset to become ready, then make a short talking video with a suitable voice. Review the face, mouth movement, and expression. If a task fails, read its detail before retrying.']] },
    ],
  },
};
export const getAvatarGuide = (locale) => guides[locale] || null;
