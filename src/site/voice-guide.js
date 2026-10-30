// Recording recommendations: https://openapi-doc.shanjian.tv/8489759m0
// Duration, formats, language choices and consent follow Kali's current voice form.
const guides = {
  'zh-cn': {
    lead: '想让克隆声音更像平时的你，录音时就按平时的语气说。先把背景噪音和回声降下来，录一段清楚、自然的声音，再到喀理里提交。',
    description: '声音克隆怎么录、怎么上传：30 秒到 2 分钟，安静环境、自然语气，配合喀理真实截图完成语种选择、声纹授权和提交。', toc: '跟着这几步来',
    sections: [
      { title: '先找个安静、没那么空的地方', body: '普通卧室就可以先试，不一定要去录音棚。先录几秒听听，确认除了自己说话，背景里还有什么声音。', items: [['把杂音先关掉', '关好门窗，留意空调、风扇、电脑风扇和旁边的人声。环境允许时，把明显的噪音源关掉。'], ['少一点回声', '尽量别在空旷的会议室里录。拉上窗帘，选有衣物或软装的房间，通常比四面光墙的地方更容易录清楚。'], ['只留一个人说话', '录音里不要混进其他人的讲话、电视声或背景音乐。']] },
      { title: '怎么说，比念什么更重要', body: '想以后听起来亲切，就用亲切的语气；想稳重一点，就稳稳地说。录音里的语气也会影响克隆效果，不用刻意端着播音腔。', items: [['离麦克风别太近', '可以从离嘴约 10 厘米开始试录，再按设备调整。声音太远听不清，太近又容易喷麦。'], ['像聊天一样讲', '先熟悉要说的内容，再用自然的语速和音量讲。句子之间留一点停顿，把字说清楚，别突然大喊或忽快忽慢。'], ['用自己熟悉的话题', '可以讲一段熟悉的内容，不用临时背很难的稿子。普通话素材尽量保持普通话；录其他语种时，也尽量保持同一种语言。']] },
      { title: '录完先听一遍，再决定用不用', body: '喀理当前接受 30 秒到 2 分钟的声音素材，录音和上传都按这个范围检查。别刚好卡在边界上，正常讲完一段就好。', items: [['听人声是不是清楚', '有没有明显底噪、回声、喷麦、碰麦声，或离麦克风忽远忽近？有的话，先调整位置再录。'], ['听语气像不像自己', '是不是一直在机械读稿，或跟平时说话差得很远？先多录几次，从里面挑一段状态自然的。'], ['保留干净的人声', '准备只有自己讲话的素材，先别加音乐、音效和变声处理。']] },
      { title: '在喀理里，从这里开始', body: '进入工作台，点左侧「数字人资产」，再点「创建资产」，切到「声音克隆」。截图里选中的就是这个页签。提交时需要登录自己的账号。', image: 'create-entry.png', caption: '真实操作页：数字人资产 → 创建资产 → 声音克隆。', items: [] },
      { title: '直接录音，或者上传已有文件', body: '两种方式选一种就行。已经用手机录好了，就不用在网页里再录一遍。', image: 'record-form.png', caption: '录音和上传在同一个区域，下方可以选择语种。', items: [['直接录', '点「开始录音」，按浏览器提示允许使用麦克风。讲完点「停止录音」，回放确认后再继续。'], ['上传文件', '点「上传文件」，选择准备好的 MP3、WAV、M4A 或 AAC 声音。文件也需要满足 30 秒到 2 分钟。'], ['网页录不了怎么办', '先检查浏览器的麦克风权限；也可以用手机或电脑先录好，再通过「上传文件」提交。']] },
      { title: '起个名字，选对语种，再提交', body: '给声音起个自己能认出来的名字，比如「我的中文口播声」。语种按这段录音实际说的语言选，普通话选中文，粤语选中文（粤语），其他语言也选对应项。', image: 'authorization-submit.png', caption: '确认语种，阅读声纹授权协议，再点「提交声音克隆」。', items: [['先确认声音使用权', '用自己的声音，或已获得声音权利人充分授权的素材。阅读《声纹授权协议》和页面说明后，再勾选同意。'], ['点提交，等状态就绪', '检查声音文件和语种后，点「提交声音克隆」。提交成功表示任务已送出，完成后会出现在「我的声音」中。']] },
      { title: '做好以后，先用一小段话试试', body: '回到资产库的「我的声音」，找到这次的记录。声音就绪后先试听，再选一小段你熟悉的文案试做，看看发音、语气和节奏是不是你想要的。', items: [['继续做内容', '就绪的声音可以按页面提供的入口，用于文字转语音或数字人口播。'], ['觉得不太对', '先回听原始录音。底噪明显就换环境，语气不自然就重录，语种选错就改用对应语种重新提交。遇到任务失败，先看页面给出的原因。']] },
    ],
  },
  'zh-tw': {
    lead: '想讓複製聲音更像平時的你，錄音時就按平時的語氣說。先降低背景噪音和回聲，錄一段清楚、自然的聲音，再到喀理裡提交。',
    description: '聲音複製怎麼錄、怎麼上傳：30 秒到 2 分鐘，安靜環境與自然語氣，搭配實際截圖完成語種選擇、聲紋授權和提交。', toc: '跟著這幾步來',
    sections: [
      { title: '先找個安靜、沒那麼空的地方', body: '普通臥室就可以先試，不一定要去錄音室。先錄幾秒聽聽，確認背景裡還有哪些聲音。', items: [['先關掉雜音', '關好門窗，留意空調、風扇、電腦風扇和旁邊的人聲，環境允許時先關掉明顯噪音。'], ['少一點回聲', '避免空曠會議室。拉上窗簾，選有衣物或軟裝的房間，通常更容易錄清楚。'], ['只留一個人說話', '不要混入其他人的講話、電視聲或背景音樂。']] },
      { title: '怎麼說，比念什麼更重要', body: '想以後聽起來親切，就用親切的語氣；想穩重一點，就穩穩地說。錄音語氣也會影響複製效果，不用刻意端著播音腔。', items: [['離麥克風別太近', '從離嘴約 10 公分開始試，再按設備調整，避開噴麥和人聲太遠。'], ['像聊天一樣講', '熟悉內容後自然表達，音量和語速穩定，句間留點停頓，把字說清楚。'], ['用熟悉的話題', '不用背很難的稿子。普通話素材盡量維持普通話；錄其他語種時，也盡量維持同一種語言。']] },
      { title: '錄完先聽一遍', body: '喀理目前接受 30 秒到 2 分鐘的聲音素材，錄音和上傳都按這個範圍檢查。別剛好卡在邊界上。', items: [['人聲清楚嗎', '留意底噪、回聲、噴麥、碰麥聲或忽遠忽近，必要時調整後重錄。'], ['語氣像自己嗎', '太像讀稿就多錄幾次，挑一段自然的。'], ['保留乾淨人聲', '先別加音樂、音效或變聲處理。']] },
      { title: '在喀理裡，從這裡開始', body: '進入工作台的數位人資產，點建立資產，再切到聲音複製。截圖使用簡體中文介面，欄位位置相同。提交時需要登入。', image: 'create-entry.png', caption: '實際操作頁：數位人資產 → 建立資產 → 聲音複製。', items: [] },
      { title: '直接錄音，或上傳已有檔案', body: '兩種方式選一種就行。已經用手機錄好了，就不用在網頁重錄。', image: 'record-form.png', caption: '錄音和上傳在同一區，下方選擇語種。', items: [['直接錄', '點開始錄音，按瀏覽器提示允許麥克風。講完停止錄音，回放確認。'], ['上傳檔案', '選 MP3、WAV、M4A 或 AAC，時長同樣需要 30 秒到 2 分鐘。'], ['網頁錄不了', '檢查麥克風權限，或先在手機、電腦錄好再上傳。']] },
      { title: '取個名字，選對語種，再提交', body: '取個方便辨識的名字。語種按素材實際語言選，普通話選中文，粵語選中文（粵語），其他語言選對應項目。', image: 'authorization-submit.png', caption: '確認語種、閱讀聲紋授權協議，再提交聲音複製。', items: [['確認聲音使用權', '使用自己的聲音，或已獲聲音權利人充分授權的素材。閱讀聲紋授權協議後再勾選同意。'], ['提交後等待就緒', '確認檔案和語種後提交。提交成功表示任務已送出，完成後會顯示在我的聲音。']] },
      { title: '做好後，用一小段話試試', body: '到資產庫的我的聲音找到記錄。就緒後先試聽，再用熟悉的短文案試做，檢查發音、語氣和節奏。', items: [['繼續做內容', '按頁面入口用於文字轉語音或數位人口播。'], ['效果不太對', '回聽原音。底噪明顯就換環境，語氣不自然就重錄，語種選錯就重新選擇並提交。失敗時先看頁面原因。']] },
    ],
  },
  en: {
    lead: 'For a voice that sounds like you, start by speaking as you normally would. Reduce background noise and echo, record a clear, natural sample, then submit it in Kali.',
    description: 'Record or upload a 30–120 second voice sample, choose its language, review voiceprint consent, and submit. Follow real Kali screenshots and practical recording tips.', toc: 'Follow these steps',
    sections: [
      { title: 'Find a quiet room with little echo', body: 'A bedroom can be a useful starting point. Record a few seconds and listen for sounds besides your voice.', items: [['Reduce background noise', 'Close doors and windows. Listen for air conditioners, fans, computers, and nearby conversations; reduce the sources you can.'], ['Reduce echo', 'Avoid empty meeting rooms. Curtains, clothes, and soft furnishings can help compared with bare reflective walls.'], ['One person speaking', 'Keep other voices, TV audio, and background music out of the recording.']] },
      { title: 'Use the voice you want to hear later', body: 'Speak warmly if that is how you want to sound. Use a calmer tone if that suits your content. Delivery in the sample can affect the cloned voice.', items: [['Try about 10 cm from the microphone', 'Use this as a starting point and adjust for your device. Too close can cause plosives; too far can make speech faint.'], ['Talk naturally', 'Get familiar with your text, keep a steady volume and pace, and leave small pauses between sentences.'], ['Choose familiar content', 'Use a topic you know. Keep the sample in the intended language rather than switching languages throughout.']] },
      { title: 'Listen before choosing your sample', body: 'Kali currently accepts 30 seconds to 2 minutes for both recording and upload. Leave a little room inside those limits.', items: [['Is speech clear?', 'Check for noise, echo, plosives, handling sounds, and changes in microphone distance. Adjust and record again if needed.'], ['Does it sound like you?', 'If it sounds like forced reading, try another take and choose a natural delivery.'], ['Keep the voice clean', 'Use your speech without added music, sound effects, or voice-changing filters.']] },
      { title: 'Find voice cloning in Kali', body: 'Open Digital Human Assets, choose Create asset, then switch to Voice cloning. These screenshots use the Simplified Chinese interface; the field positions are the same. Sign in before submitting.', image: 'create-entry.png', caption: 'Actual Kali screen: asset section, creation view, and voice cloning tab.', items: [] },
      { title: 'Record now or upload a file', body: 'Choose whichever is easier. If you already recorded on your phone, upload that file.', image: 'record-form.png', caption: 'The recording and upload controls, with the language selector below.', items: [['Record in the browser', 'Choose Start recording and allow microphone access when the browser asks. Stop when finished, then play it back.'], ['Upload a recording', 'Choose an MP3, WAV, M4A, or AAC file lasting 30 seconds to 2 minutes.'], ['If recording is unavailable', 'Check microphone permissions, or record on your phone or computer and upload the file.']] },
      { title: 'Name it, choose the language, and submit', body: 'Use a name you will recognize. Choose the language actually spoken in the sample; select the Cantonese option for a Cantonese sample.', image: 'authorization-submit.png', caption: 'Check the language, read the voiceprint agreement, then submit the cloning task.', items: [['Confirm voice rights', 'Use your own voice or material you have sufficient permission to use. Read the voiceprint agreement and explanation before accepting.'], ['Wait for the voice to be ready', 'Check the file and language, then submit. Submission means the task has been sent. The completed asset will appear in My voices.']] },
      { title: 'Try a short piece of text first', body: 'Find the record in My voices. Once ready, preview it and try a short familiar script to check pronunciation, tone, and rhythm.', items: [['Use it in your content', 'Follow the available page actions to use a ready voice in text-to-speech or a digital presenter video.'], ['If it misses the mark', 'Listen to the source again. Change the environment for noise, record again for delivery, or resubmit with the correct language. Read the visible error if the task fails.']] },
    ],
  },
};
export const getVoiceGuide = (locale) => guides[locale] || null;
