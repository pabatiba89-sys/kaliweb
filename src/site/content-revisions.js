// Reviewed content rolls out per locale. Other locales keep their current copy.
// Merge after localization so older machine translations cannot overwrite this batch.
import { assetContentRevisions } from './asset-content-revisions.js';
import { getBrandContent } from './brand-content.js';
export const contentRevisions = {
  en: {
    '': {
      title: 'AI Avatar Videos for Small Content Teams | Kali',
      description: 'Make presenter videos from scripts, reuse your avatar and voice, and review each result before publishing. Kali brings the steps into one workspace.',
      eyebrow: 'VIDEO CREATION FOR SMALL CONTENT TEAMS',
      headline: 'Make presenter videos from scripts you already have',
      lead: 'Turn product explanations, short lessons, and business updates into presenter videos. Choose an avatar and voice, add your materials, then review the result in Kali.',
      proof: ['Start with your own script or use a writing assistant', 'Reuse a presenter and voice in later videos', 'Choose avatar-led or mixed-media production', 'Review the finished video before publishing'],
      sectionTitle: 'Choose the tools your video needs',
      sectionLead: 'Use digital humans for the presenter, a cloned voice for narration, and music where it fits. Each studio is also available on its own.',
      primaryCta: 'Start a video',
      primaryHref: '/app/?page=video',
      overviewTitle: 'Reuse your presenter and voice for the next script',
      closingTitle: 'Start with a script you already have',
      closingCta: 'Create a video',
      practicalSections: [{
        eyebrow: 'WAYS TO USE KALI',
        heading: 'What does your audience need to hear?',
        items: [
          { title: 'Explain a product', body: 'Write down what the product does and who it helps. Add your product images or clips, then choose a presenter or a mixed-media format.', slug: 'help-script-to-video', linkLabel: 'Follow the script-to-video guide' },
          { title: 'Teach one useful thing', body: 'Prepare a short lesson and use a presenter and voice that suit it. Reuse those assets when you make the next lesson.', slug: 'digital-human', linkLabel: 'See how digital humans work' },
          { title: 'Share a business update', body: 'Start with a brief or a topic from Hot Topics. Check the facts, refine the script, and create a video for your audience.', slug: 'help-trend-to-video', linkLabel: 'Follow the topic-to-video guide' },
        ],
      }],
    },
    'ai-video-generator': {
      title: 'AI Video Generator for Scripts, Avatars & Product Clips',
      description: 'Choose a script-to-video workflow with an avatar or your own media, or generate footage from a prompt in AI Video Lab. See the inputs and review steps.',
      eyebrow: 'AI VIDEO PRODUCTION',
      headline: 'Make a video from your script or footage',
      lead: 'Use Video Studio for scripted avatar videos and mixed-media edits. Use AI Video Lab when you want to generate footage from a prompt or reference material. These are separate creation paths.',
      bullets: ['Start from a script, images, or video clips you can use', 'Choose the creation path that fits your material', 'Review the finished result before download or publishing'],
      primaryCta: 'Open Video Studio', primaryHref: '/app/?page=video',
      sectionHeading: 'Prepare your content, then choose the production mode',
      practicalSections: [{
        eyebrow: 'CHOOSE YOUR STARTING POINT', heading: 'Are you working from a script or a visual idea?',
        items: [
          { title: 'A script, with a presenter or your own media', body: 'Video Studio has avatar and mixed-media modes. The Pro modes let you place images or clips against individual script scenes. Prepare the script and choose the assets before submitting.', href: '/app/?page=video', linkLabel: 'Open Video Studio' },
          { title: 'A prompt or reference material', body: 'AI Video Lab generates footage with the selected model. Supported reference types and settings depend on that model. Check the credit estimate after choosing your settings.', href: '/app/?page=ai-video', linkLabel: 'Open AI Video Lab' },
        ],
      }],
      sections: [
        ['Prepare the script and materials', 'Check product names, claims, and pronunciation. For avatar-led videos, choose a ready digital human and voice. For mixed-media videos, prepare the images and clips you want to use.'],
        ['Choose a mode and review the setup', 'Pick avatar or mixed-media production. Use a Pro mode when the script needs separate scenes and materials. Review the selected assets and required fields before you submit.'],
        ['Check the result before it goes public', 'Watch the finished video and check the audio, subtitles, and picture. Download it for further editing if needed. Publishing through Kali requires team account setup and a running local Kali Publish service.'],
      ],
      faq: [
        ['Do I need to film a new video every time?', 'You can reuse a ready digital human and voice with a new script. Creating a custom digital human still requires the source material and authorization requested in the asset workflow.'],
        ['Can I make a video without a presenter?', 'Yes. Mixed-media production uses images and video clips. Choose the material-based Pro mode when you need to assign media to individual script scenes.'],
        ['How long does generation take?', 'There is no fixed completion time promised here. Watch the task status in the workspace; processing depends on the creation type, selected model, and service load.'],
        ['Can I publish directly from Kali?', 'Publishing needs a team publishing account and matching platform accounts in the local Kali Publish service. Complete that setup before sending a publishing task. You can also download the video.'],
        ['Where do I check the cost?', 'Open Credits & orders in the workspace for available credit packs and usage records. AI Video Lab shows a model-specific estimate after you enter valid settings and checks it again before creation.'],
      ],
      related: ['help-script-to-video', 'help-video-modes', 'pricing'],
      relatedHeading: 'Get ready for your first video',
    },
    pricing: {
      title: 'Kali Credit Packs & AI Video Generation Costs',
      description: 'Learn how Kali credit packs work, where to find current prices, and how to check model-specific AI video estimates and account usage before you buy.',
      eyebrow: 'CREDITS & USAGE',
      headline: 'Check the credits you need before you buy',
      lead: 'Kali uses credit packs for creation features. Sign in to see the packs currently available to your account, their prices, and your remaining balance. Generation costs depend on the feature and settings.',
      bullets: ['Check current pack prices in the workspace', 'Review your balance and usage records', 'Preview the public walkthrough without spending credits'],
      sectionHeading: 'Check the pack, the task, and your balance',
      sections: [
        ['Find current credit packs', 'Sign in, open the account menu, and choose Credits & orders. That page shows available packs, credit quantities, and the amount to pay. Check the current price before confirming your purchase.'],
        ['Check an AI Video Lab estimate', 'Choose a model, enter the prompt, and set the duration and other required options. The estimate updates when the inputs are valid. Kali checks the estimate and balance again before creating that task.'],
        ['Keep each feature’s costs separate', 'AI video generation, avatar training, speech, music, and other creation features do not all have the same cost. A credit pack does not promise a fixed number of finished videos.'],
        ['Review orders and consumption', 'Credits & orders has separate payment and consumption records. Check those records and the task status when you need to understand a charge or returned credits.'],
      ],
      faq: [
        ['How much does one video cost?', 'There is no single price for every video. AI Video Lab quotes the selected model and valid settings. Other creation features have their own usage rules. Check the relevant creation page and your credit records.'],
        ['Are credit packs monthly subscriptions?', 'The current checkout is for a one-time credit-pack purchase. Review the selected pack and checkout amount before paying.'],
        ['Can a failed task return credits?', 'Check the task’s settlement status and your consumption records. Returned generation credits and a refund of a payment are different processes. A failure does not mean every feature follows the same settlement rule.'],
        ['Where can I read the payment and refund rules?', 'The Payment Policy and Refund Policy linked below describe purchase and refund terms. Read those pages before buying if you need details about refund eligibility.'],
      ],
      related: ['payment-policy', 'refund-policy', 'ai-video-generator'],
      relatedHeading: 'Read before you buy',
    },
  },
  'zh-cn': {
    '': {
      title: '面向小型内容团队的 AI 数字人视频制作 | 喀理',
      description: '用现有文案制作数字人口播，复用数字人和声音，添加产品素材，审核成片后再发布。在喀理工作台完成制作流程。',
      eyebrow: '面向小型内容团队的视频制作', headline: '下一条视频，从文案开始',
      lead: '把产品介绍、知识讲解和业务动态做成数字人口播。选择数字人和声音，添加自己的素材，再在喀理里检查成片。',
      proof: ['使用现有文案，或让创作助手帮你起稿', '下一条视频继续复用数字人和声音', '按内容选择数字人口播或素材混剪', '检查成片后，再下载或发布'],
      sectionTitle: '按这条视频的需要选择工具',
      sectionLead: '数字人负责出镜，克隆声音用于配音，需要时再加入音乐。各个创作工具也可以单独使用。',
      primaryCta: '开始制作视频', primaryHref: '/app/?page=video',
      overviewTitle: '保留数字人和声音，换一份新文案', closingTitle: '先用一份已有文案，制作第一条视频', closingCta: '制作视频',
      practicalSections: [{
        eyebrow: '使用场景', heading: '你的观众，这次需要了解什么？',
        items: [
          { title: '把产品讲清楚', body: '写清产品解决什么问题、适合谁，再添加产品图片或视频。根据内容选择数字人讲解，或直接用素材制作混剪。', slug: 'help-script-to-video', linkLabel: '查看文案制作视频教程' },
          { title: '讲明白一个知识点', body: '准备一段短讲解，选择适合的数字人和声音。下次讲解继续使用这套资产，替换文案后再制作。', slug: 'digital-human', linkLabel: '了解数字人制作流程' },
          { title: '发布一条业务动态', body: '从自己的简报或热点话题开始。先核实信息、修改文案，再制作适合目标观众的视频。', slug: 'help-trend-to-video', linkLabel: '查看热点到视频教程' },
        ],
      }],
    },
    'ai-video-generator': {
      title: 'AI 视频制作：文案、数字人与产品素材',
      description: '用文案制作数字人口播或素材混剪，也可在 AI 视频工坊通过提示词生成画面。了解每条流程需要的输入、设置和审核步骤。',
      eyebrow: 'AI 视频制作', headline: '让数字人讲文案，或围绕素材做视频',
      lead: '数字人视频工作区用于文案口播和素材混剪；需要通过提示词或参考素材生成画面时，进入 AI 视频工坊。两条流程分别选择、分别制作。',
      bullets: ['从可使用的文案、图片或视频素材开始', '根据手上的内容选择制作方式', '检查成片后，再下载或发布'],
      primaryCta: '进入数字人视频', primaryHref: '/app/?page=video',
      sectionHeading: '先准备内容，再选择制作模式',
      practicalSections: [{
        eyebrow: '选择入口', heading: '你手上是文案，还是想生成一段画面？',
        items: [
          { title: '已有文案，用数字人或自己的素材制作', body: '数字人视频工作区支持口播和素材混剪。Pro 模式可以为每个文案分镜分别放入图片或视频。提交前，先完成文案和资产选择。', href: '/app/?page=video', linkLabel: '进入数字人视频' },
          { title: '已有画面想法，用提示词或参考素材生成', body: 'AI 视频工坊按所选模型生成画面。可用的参考素材类型和参数由模型决定，选好设置后再查看预计消耗积分。', href: '/app/?page=ai-video', linkLabel: '进入 AI 视频工坊' },
        ],
      }],
      sections: [
        ['整理文案与素材', '核对产品名称、事实表述和读音。做数字人口播时，先选择已就绪的数字人和声音；做素材混剪时，准备要使用的图片和视频。'],
        ['检查模式与配置', '按内容选择口播或混剪。需要逐镜配置素材时，选择对应的 Pro 模式。提交前，检查已选资产和当前模式的必填项。'],
        ['成片审核后再对外发布', '完整看一遍成片，检查配音、字幕和画面。需要精修时可下载后继续剪辑。通过喀理发布，需要先配置团队发布账号，并启动本机 Kali Publish 服务。'],
      ],
      faq: [
        ['每条视频都要重新拍摄吗？', '已就绪的数字人和声音可以搭配新文案重复使用。首次创建自己的数字人，仍需按资产制作流程提供原始素材和授权材料。'],
        ['可以不使用数字人吗？', '可以。素材混剪使用图片和视频；需要为每个文案分镜分配素材时，选择素材成片 Pro。'],
        ['生成一条视频需要多久？', '这里不承诺固定完成时间。请在工作台查看任务状态，处理时长取决于制作类型、所选模型和服务负载。'],
        ['可以直接发布到内容平台吗？', '需要先配置团队发布账号，并在本机 Kali Publish 中登录同名平台账号，再提交发布任务。也可以下载成片后自行发布。'],
        ['在哪里查看费用？', '在工作台的“积分与订单”中查看可购买的积分包和消耗记录。AI 视频工坊会根据模型和有效参数显示预计积分，创建任务前再次校验。'],
      ],
      related: ['help-script-to-video', 'help-video-modes', 'pricing'], relatedHeading: '制作前先看这些说明',
    },
    pricing: {
      title: '喀理积分包与 AI 视频制作费用',
      description: '了解喀理积分包、当前价格的查看位置、AI 视频工坊的预计积分，以及购买前如何检查余额和使用记录。',
      eyebrow: '积分与使用', headline: '买积分前，先看清这次制作需要什么',
      lead: '喀理的创作功能使用积分。登录后可以查看当前账号可购买的积分包、价格和剩余余额。具体消耗取决于功能及所选参数。',
      bullets: ['在工作台查看当前积分包价格', '购买前核对余额与消耗记录', '公开流程 Demo 不消耗积分'],
      sectionHeading: '分别核对积分包、制作任务和余额',
      sections: [
        ['查看当前积分包', '登录工作台，打开右上角账户菜单，进入“积分与订单”。页面会显示可购买的积分包、积分数量和付款金额。确认购买前，请核对当前展示的价格。'],
        ['查看 AI 视频工坊的预计消耗', '选择模型，填写提示词，并设置时长等必填参数。输入有效后，预计积分会自动更新；创建任务前，系统会再次核对报价和余额。'],
        ['不同功能分别计费', 'AI 视频生成、数字人训练、语音合成、音乐等功能的消耗不相同。一个积分包不代表固定数量的成片。'],
        ['核对订单与积分记录', '“积分与订单”分别提供支付记录和消耗记录。需要了解扣除或退回的积分时，请结合记录与任务状态一起查看。'],
      ],
      faq: [
        ['一条视频多少钱？', '不同视频没有统一单价。AI 视频工坊根据模型和有效参数试算；其他创作功能按各自的使用规则消耗积分，请在对应页面和积分记录中核对。'],
        ['购买积分包就是按月订阅吗？', '当前结账流程是一次性购买积分包。付款前请核对所选积分包和实际付款金额。'],
        ['任务失败会退回积分吗？', '请查看任务结算状态和消耗记录。生成积分退回与支付退款是不同流程，不能把某一功能的失败结算规则套用到全部功能。'],
        ['支付和退款规则在哪里？', '下方的支付政策和退款政策说明了购买与退款条款。如果需要确认可退款情形，请在购买前阅读。'],
      ],
      related: ['payment-policy', 'refund-policy', 'ai-video-generator'], relatedHeading: '购买前了解这些规则',
    },
  },
  'zh-tw': {
    '': {
      title: '適合小型內容團隊的 AI 數位人影片製作 | 喀理',
      description: '用現有文案製作數位人口播，重複使用數位人與聲音，加入產品素材，確認成片後再發布。在喀理工作區完成製作流程。',
      eyebrow: '適合小型內容團隊的影片製作', headline: '下一支影片，從文案開始',
      lead: '把產品介紹、知識講解和業務動態做成數位人口播。選擇數位人與聲音，加入自己的素材，再到喀理檢查成片。',
      proof: ['使用現有文案，或請創作助手協助起稿', '下一支影片繼續使用數位人與聲音', '依內容選擇數位人口播或素材混剪', '確認成片後，再下載或發布'],
      sectionTitle: '依這支影片的需要選擇工具', sectionLead: '數位人負責出鏡，克隆聲音用於配音，需要時再加入音樂。各個創作工具也可以單獨使用。',
      primaryCta: '開始製作影片', primaryHref: '/app/?page=video', overviewTitle: '保留數位人與聲音，換一份新文案', closingTitle: '先用一份現有文案，製作第一支影片', closingCta: '製作影片',
      practicalSections: [{
        eyebrow: '使用情境', heading: '你的觀眾，這次需要了解什麼？',
        items: [
          { title: '把產品講清楚', body: '寫清產品解決什麼問題、適合誰，再加入產品圖片或影片。依內容選擇數位人講解，或直接用素材製作混剪。', slug: 'help-script-to-video', linkLabel: '查看文案製作影片教學' },
          { title: '講明白一個知識點', body: '準備一段短講解，選擇適合的數位人與聲音。下次講解繼續使用這套資產，替換文案後再製作。', slug: 'digital-human', linkLabel: '了解數位人製作流程' },
          { title: '發布一則業務動態', body: '從自己的簡報或熱門話題開始。先核實資訊、修改文案，再製作適合目標觀眾的影片。', slug: 'help-trend-to-video', linkLabel: '查看熱門話題到影片教學' },
        ],
      }],
    },
    'ai-video-generator': {
      title: 'AI 影片製作：文案、數位人與產品素材', description: '用文案製作數位人口播或素材混剪，也可在 AI 影片工作坊透過提示詞生成畫面。了解每條流程需要的輸入、設定與審核步驟。',
      eyebrow: 'AI 影片製作', headline: '讓數位人講文案，或圍繞素材做影片',
      lead: '數位人影片工作區用於文案口播與素材混剪；需要透過提示詞或參考素材生成畫面時，進入 AI 影片工作坊。兩條流程分別選擇、分別製作。',
      bullets: ['從可使用的文案、圖片或影片素材開始', '依手上的內容選擇製作方式', '確認成片後，再下載或發布'],
      primaryCta: '進入數位人影片', primaryHref: '/app/?page=video', sectionHeading: '先準備內容，再選擇製作模式',
      practicalSections: [{
        eyebrow: '選擇入口', heading: '你手上是文案，還是想生成一段畫面？',
        items: [
          { title: '已有文案，用數位人或自己的素材製作', body: '數位人影片工作區支援口播與素材混剪。Pro 模式可以為每個文案分鏡分別加入圖片或影片。提交前，先完成文案與資產選擇。', href: '/app/?page=video', linkLabel: '進入數位人影片' },
          { title: '已有畫面想法，用提示詞或參考素材生成', body: 'AI 影片工作坊依所選模型生成畫面。可用的參考素材類型與參數由模型決定，選好設定後再查看預計消耗點數。', href: '/app/?page=ai-video', linkLabel: '進入 AI 影片工作坊' },
        ],
      }],
      sections: [
        ['整理文案與素材', '核對產品名稱、事實陳述與讀音。製作數位人口播時，先選擇已就緒的數位人與聲音；製作素材混剪時，準備要使用的圖片與影片。'],
        ['檢查模式與設定', '依內容選擇口播或混剪。需要逐鏡設定素材時，選擇對應的 Pro 模式。提交前，檢查已選資產與目前模式的必填項目。'],
        ['審核成片後再對外發布', '完整看一遍成片，檢查配音、字幕與畫面。需要精修時可下載後繼續剪輯。透過喀理發布，需要先設定團隊發布帳號，並啟動本機 Kali Publish 服務。'],
      ],
      faq: [
        ['每支影片都要重新拍攝嗎？', '已就緒的數位人與聲音可以搭配新文案重複使用。首次建立自己的數位人，仍需依資產製作流程提供原始素材與授權資料。'],
        ['可以不使用數位人嗎？', '可以。素材混剪使用圖片與影片；需要為每個文案分鏡分配素材時，選擇素材成片 Pro。'],
        ['生成一支影片需要多久？', '這裡不承諾固定完成時間。請在工作區查看任務狀態，處理時間取決於製作類型、所選模型與服務負載。'],
        ['可以直接發布到內容平台嗎？', '需要先設定團隊發布帳號，並在本機 Kali Publish 中登入同名平台帳號，再提交發布任務。也可以下載成片後自行發布。'],
        ['在哪裡查看費用？', '在工作區的「點數與訂單」中查看可購買的點數包與消耗紀錄。AI 影片工作坊會依模型與有效參數顯示預計點數，建立任務前再次檢查。'],
      ],
      related: ['help-script-to-video', 'help-video-modes', 'pricing'], relatedHeading: '製作前先看這些說明',
    },
    pricing: {
      title: '喀理點數包與 AI 影片製作費用', description: '了解喀理點數包、目前價格的查看位置、AI 影片工作坊的預計點數，以及購買前如何檢查餘額與使用紀錄。',
      eyebrow: '點數與使用', headline: '買點數前，先看清這次製作需要什麼',
      lead: '喀理的創作功能使用點數。登入後可以查看目前帳號可購買的點數包、價格與剩餘餘額。實際消耗取決於功能及所選參數。',
      bullets: ['在工作區查看目前點數包價格', '購買前核對餘額與消耗紀錄', '公開流程 Demo 不消耗點數'],
      sectionHeading: '分別核對點數包、製作任務與餘額',
      sections: [
        ['查看目前點數包', '登入工作區，開啟右上角帳戶選單，進入「點數與訂單」。頁面會顯示可購買的點數包、點數數量與付款金額。確認購買前，請核對目前顯示的價格。'],
        ['查看 AI 影片工作坊的預計消耗', '選擇模型，填寫提示詞，並設定時長等必填參數。輸入有效後，預計點數會自動更新；建立任務前，系統會再次核對報價與餘額。'],
        ['不同功能分別計費', 'AI 影片生成、數位人訓練、語音合成、音樂等功能的消耗不相同。一個點數包不代表固定數量的成片。'],
        ['核對訂單與點數紀錄', '「點數與訂單」分別提供付款紀錄與消耗紀錄。需要了解扣除或退回的點數時，請結合紀錄與任務狀態一起查看。'],
      ],
      faq: [
        ['一支影片多少錢？', '不同影片沒有統一單價。AI 影片工作坊依模型與有效參數試算；其他創作功能依各自的使用規則消耗點數，請在對應頁面與點數紀錄中核對。'],
        ['購買點數包就是按月訂閱嗎？', '目前結帳流程是一次性購買點數包。付款前請核對所選點數包與實際付款金額。'],
        ['任務失敗會退回點數嗎？', '請查看任務結算狀態與消耗紀錄。生成點數退回與付款退款是不同流程，不能把某一功能的失敗結算規則套用到全部功能。'],
        ['付款與退款規則在哪裡？', '下方的付款政策與退款政策說明了購買與退款條款。如果需要確認可退款情形，請在購買前閱讀。'],
      ],
      related: ['payment-policy', 'refund-policy', 'ai-video-generator'], relatedHeading: '購買前了解這些規則',
    },
  },
};

export const getContentRevision = (locale, slug = '') => {
  const previous = contentRevisions[locale]?.[slug] || assetContentRevisions[locale]?.[slug];
  const brand = getBrandContent(locale)[slug];
  if (!brand) return previous;
  return {
    ...previous, ...brand,
    ...(previous?.faq && slug !== '' ? { faq: previous.faq } : {}),
    ...(previous?.walkthrough ? { walkthrough: previous.walkthrough } : {}),
    ...(previous?.practicalSections && slug !== '' && slug !== 'pricing' ? { practicalSections: previous.practicalSections } : {}),
  };
};
