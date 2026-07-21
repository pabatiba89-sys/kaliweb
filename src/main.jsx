import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Bell,
  BellRing,
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  CheckCircle2,
  Clapperboard,
  Clock3,
  Cuboid,
  Download,
  Edit3,
  ExternalLink,
  FileVideo,
  Fingerprint,
  GalleryVerticalEnd,
  Globe2,
  Home,
  Image,
  KeyRound,
  Layers3,
  Library,
  Mail,
  Menu,
  Mic2,
  Music2,
  PanelLeftClose,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ScanFace,
  Sparkles,
  TrendingUp,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  Video,
  X,
} from 'lucide-react';
import {
  apiFetch,
  bindPhoneNumber,
  changePassword,
  clearSession,
  confirmPasswordReset,
  createEvonetOneTimePaymentSession,
  emailLogin,
  getAccessToken,
  reportEvonetOneTimePaymentEvent,
  requestPasswordReset,
  sendPhoneVerificationCode,
  storeSession,
  toList,
  uploadFile,
} from './api';
import { getInitialLocale, languages, translateStatic, useAutoTranslate, useLocaleCatalog } from './i18n';
import { pageConfigs } from './pageConfig';
import packageJson from '../package.json';
import './styles.css';

const APP_VERSION = `v${packageJson.version}`;

const copy = {
  en: {
    workspace: 'Turn a trend into a publish-ready talking-avatar video',
    subline: 'A focused production desk for overseas teams: capture demand, draft the script, choose the presenter, package the video, and publish.',
    trial: 'Free trial benefits',
    cta: 'New Video',
    search: 'Search trends, scripts, assets',
    workflow: 'Recommended workflow',
    billing: 'Plan usage',
    preview: 'Production preview',
  },
  zh: {
    workspace: '把热点变成可发布的数字人口播视频',
    subline: '',
    trial: '免费体验权益',
    cta: '新建视频',
    search: '搜索热点、脚本、资产',
    workflow: '推荐流程',
    billing: '套餐用量',
    preview: '生产预览',
  },
  ja: {
    workspace: 'トレンドを公開可能なアバター動画へ',
    subline: '海外チーム向けの制作デスク。需要を捉え、台本を作り、話者と音声を選び、動画として公開します。',
    trial: '無料トライアル特典',
    cta: '動画を作成',
    search: 'トレンド、台本、素材を検索',
    workflow: '推奨フロー',
    billing: 'プラン利用状況',
    preview: '制作プレビュー',
  },
  ko: {
    workspace: '트렌드를 바로 게시 가능한 디지털 휴먼 영상으로',
    subline: '해외 팀을 위한 제작 데스크입니다. 수요를 포착하고, 대본을 만들고, 발표자와 음성을 선택해 영상으로 게시합니다.',
    trial: '무료 체험 혜택',
    cta: '새 영상',
    search: '트렌드, 스크립트, 자산 검색',
    workflow: '추천 흐름',
    billing: '플랜 사용량',
    preview: '제작 미리보기',
  },
  de: {
    workspace: 'Vom Trend zum veröffentlichungsreifen Avatar-Video',
    subline: 'Ein fokussierter Produktionsbereich für globale Teams: Thema finden, Skript schreiben, Sprecher wählen, Video paketieren und veröffentlichen.',
    trial: 'Kostenlose Testvorteile',
    cta: 'Neues Video',
    search: 'Trends, Skripte, Assets suchen',
    workflow: 'Empfohlener Ablauf',
    billing: 'Plannutzung',
    preview: 'Produktionsvorschau',
  },
  ru: {
    workspace: 'От тренда к готовому видео с цифровым ведущим',
    subline: 'Рабочий стол для международных команд: найти спрос, подготовить сценарий, выбрать ведущего и голос, собрать видео и опубликовать.',
    trial: 'Бесплатные возможности',
    cta: 'Новое видео',
    search: 'Поиск трендов, сценариев, ассетов',
    workflow: 'Рекомендуемый процесс',
    billing: 'Использование тарифа',
    preview: 'Предпросмотр производства',
  },
};

const sourceCopyLocales = {
  'zh-CN': 'zh',
  'ja-JP': 'ja',
  'ko-KR': 'ko',
  'de-DE': 'de',
  'ru-RU': 'ru',
};
const getCopy = (locale) => copy[sourceCopyLocales[locale] || 'en'];

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trends', label: 'Hot Trends', icon: TrendingUp },
  { id: 'assistant', label: 'AI Assistant', icon: Bot },
  { id: 'video', label: 'Video Studio', icon: Video },
  { id: 'assets', label: 'Asset Studio', icon: Layers3 },
  { id: 'music', label: 'Music Studio', icon: Music2 },
  { id: 'image', label: 'Image Studio', icon: Image },
  { id: 'materials', label: 'Materials', icon: Library },
  { id: 'templates', label: 'Templates', icon: GalleryVerticalEnd },
  { id: 'billing', label: 'Billing', icon: CircleDollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const OFFICIAL_USER_AGREEMENT_URL = 'https://p.xyaip.fun/user-agreement.html';
const OFFICIAL_PRIVACY_POLICY_URL = 'https://p.xyaip.fun/privacy-policy.html';

const legalDocuments = {
  'legal-user': {
    eyebrow: 'ACCOUNT & SERVICE',
    title: '用户服务协议（含登录注册规则）',
    description: '约定账号注册、服务使用、用户行为、内容权利与责任边界。',
    updated: 'V1.0 · 2026-02-13',
    icon: BookOpen,
    officialUrl: OFFICIAL_USER_AGREEMENT_URL,
    sections: [
      ['1. 协议的接受与生效', '本服务由 Kali 团队提供。登录、注册或使用服务前，请完整阅读并理解协议；不同意时请停止注册或使用。'],
      ['2. 账号注册与安全', '用户可通过平台支持的邮箱、移动号码或第三方账号注册。用户应提供真实、合法的账号信息，妥善保管密码与登录凭证，并对账号下的活动负责。'],
      ['3. 产品与服务', '平台提供热点、文案、图片、音乐、声音、数字人与视频生产相关服务。部分能力可能依赖第三方模型或服务，也可能随合规与产品需求调整。'],
      ['4. 用户行为与内容', '不得上传、生成或发布违法违规、欺诈冒充、侵害他人人格权、隐私权、声音权、肖像权或知识产权的内容。用户应确保对上传素材与输出内容拥有充分权利。'],
      ['5. 服务变更、中止与争议', '平台可因产品、安全或合规需要调整服务。正式协议的法律适用、争议解决与详细责任以下方“正式全文”为准。'],
    ],
  },
  'legal-privacy': {
    eyebrow: 'PRIVACY & DATA',
    title: '隐私政策',
    description: '说明我们如何收集、使用、存储、保护及处理你的个人信息。',
    updated: '更新 2026-02-13 · 生效 2026-02-20',
    icon: ShieldCheck,
    officialUrl: OFFICIAL_PRIVACY_POLICY_URL,
    sections: [
      ['1. 我们处理的信息', '根据你使用的功能，可能处理账号、联系方式、上传素材、创作记录、设备与操作日志。声纹、肖像与形象素材可能属于敏感个人信息，会通过专项协议取得单独同意。'],
      ['2. 使用目的', '信息用于账号运行、素材管理、AI 生成、任务通知、客户支持、安全风控和服务改进；我们不会将信息出售给无关第三方。'],
      ['3. 合作方与跨境场景', '为完成模型处理、存储、支付或发布等功能，可能在必要范围内向服务合作方提供信息。涉及跨境处理时，应按适用法律完成告知、单独同意和必要的合规程序。'],
      ['4. 存储与安全', '仅在实现服务目的与法定期限内保留信息，并采取访问控制、加密、日志审计等安全措施。'],
      ['5. 你的权利', '你可依法查询、更正、删除、复制个人信息，撤回同意或申请注销账号。具体申请可通过隐私邮箱提交。'],
    ],
  },
  'legal-voice': {
    eyebrow: 'VOICE BIOMETRICS',
    title: '声纹授权协议',
    description: '在克隆声音、声音训练和 AI 配音前，请仔细阅读并单独同意。',
    updated: '生效日期 2026-06-18',
    icon: Fingerprint,
    sections: [
      ['1. 授权目的', '为提供克隆声音、声音训练和 AI 视频配音服务，我们需要处理你主动录制或上传的声音文件，提取声音特征、训练声音模型并生成经授权的音频内容。'],
      ['2. 收集与使用范围', '可处理原始声音文件、文件名、时长、上传时间、训练状态与实现服务所需的声纹特征，仅用于本协议约定的功能场景。'],
      ['3. 你的承诺', '你确认素材为本人声音，或已获得权利人合法、充分、可证明的授权。不得用于冒充、欺诈、侵权、违法宣传或其他非法场景。'],
      ['4. 存储与保护', '我们将采取合理安全措施，并仅在实现服务目的所需期限内保留声音与声纹信息。'],
      ['5. 撤回授权', '你可停止上传或联系平台撤回授权。撤回后我们将停止后续处理，但不影响撤回前已基于授权进行的处理。'],
      ['6. 未成年人保护', '素材涉及未成年人时，应由其监护人阅读并同意后提交。'],
    ],
  },
  'legal-avatar': {
    eyebrow: 'DIGITAL HUMAN',
    title: '数字人形象授权协议',
    description: '适用于真人视频训练、图生数字人与数字人视频生成。',
    updated: '版本 2026-07-10',
    icon: UserRound,
    sections: [
      ['1. 授权内容', '你授权平台为本人账号中的数字人训练与创作，处理你提交的肖像、形象视频、授权视频及其中的必要声音信息。'],
      ['2. 使用边界', '授权仅用于你主动发起的训练、预览、视频生成、安全审核和相关服务记录，不代表平台可将你的形象用于未经授权的广告或对外背书。'],
      ['3. 权利保证', '你确认上传的为本人形象，或已获得肖像权人充分、明确、可证明的授权。禁止未经同意制作他人数字分身。'],
      ['4. 生成内容责任', '你应在发布前审核生成结果，必要时显著标识 AI 生成或合成内容，并对最终发布、投放与传播负责。'],
      ['5. 授权期限与撤回', '授权自单独同意时生效，在你保留相关数字人资产并使用服务期间持续。你可申请删除资产并撤回后续处理授权。'],
    ],
  },
  'legal-image': {
    eyebrow: 'PORTRAIT COLLECTION',
    title: '形象信息采集与使用协议',
    description: '适用于上传本人照片、拍摄形象视频、生成 AI 形象图与创建数字人。',
    updated: '版本 2026-07-10',
    icon: ScanFace,
    sections: [
      ['1. 采集范围', '可包括你主动提交的照片、视频、文件属性、拍摄时间、处理状态，以及实现形象生成所需的面部与形象特征。'],
      ['2. 处理目的', '仅用于你选择的形象图生成、数字人训练、视频创作、资产管理、质量检测与安全审核。'],
      ['3. 敏感个人信息', '面部与形象特征可能属于敏感个人信息。拒绝同意不影响其他基础功能，但我们将无法提供相关形象处理服务。'],
      ['4. 存储、共享与删除', '原始素材与特征数据仅在实现服务的必要范围内处理。使用模型或存储合作方时，仅提供必要信息并约束其处理目的。你可申请删除。'],
      ['5. 你的确认', '你已了解采集目的、方式、范围和可能风险，并确保素材属于本人或已获得充分授权。'],
    ],
  },
  'legal-ai': {
    eyebrow: 'RESPONSIBLE AI',
    title: 'AI 生成内容使用规则',
    description: '用于约束 AI 文案、图片、音乐、声音、数字人和视频内容的生成与发布。',
    updated: '版本 2026-07-10',
    icon: Sparkles,
    sections: [
      ['1. 内容审核', '生成结果可能存在错误、偏差或不完整信息。你应在对外发布前完成真实性、合法性和权利核验。'],
      ['2. 禁止用途', '不得用于欺诈、冒充、造谣、未经同意的深度合成、侵权营销、违法政治广告、违规医疗或金融承诺等高风险场景。'],
      ['3. AI 标识', '法律法规、发布平台或内容场景要求时，应使用清晰、可见、不易误解的方式标识 AI 生成或合成内容。'],
      ['4. 素材与输出权利', '你应确保输入素材、提示词与最终使用不侵害他人知识产权、肖像权、声音权、隐私权或其他合法权益。'],
    ],
  },
  'legal-payment': {
    eyebrow: 'PAYMENT POLICY',
    title: '支付政策',
    description: '说明价格、币种、税费、支付处理、套餐生效、额度使用与续费规则。',
    updated: '生效日期 2026-07-11',
    icon: CircleDollarSign,
    sections: [
      ['1. 价格、币种与税费', '价格可能因地区、币种、套餐、促销与适用税收规则不同。确认订单前，结算页面会展示最终应付金额、币种和适用税费。'],
      ['2. 支付处理', '付款可能由获授权的第三方支付服务商处理。请勿通过邮件或客服消息发送密码、验证码或完整银行卡信息。'],
      ['3. 套餐与额度生效', '支付服务商确认付款成功后，对应套餐、额度包或付费能力生效。具体扣减规则以购买页面和工作台当时展示为准。'],
      ['4. 续费与取消', '只有在结算页面明确标注为自动续费的购买才会周期续费，并在付款前展示周期、金额和取消方式。取消后续续费不等于退还此前已支付费用。'],
    ],
  },
  'legal-refund': {
    eyebrow: 'REFUND POLICY',
    title: '退款政策',
    description: '说明可申请退款的情形、通常不退款的已消耗服务，以及申请和审核流程。',
    updated: '生效日期 2026-07-11',
    icon: RefreshCw,
    sections: [
      ['1. 可审核退款的情形', '重复扣款、扣款金额错误、因经核实的平台故障导致已付款服务未交付，以及适用法律要求或经审核同意的未使用购买，可提交退款申请。'],
      ['2. 通常不退款的情形', '已消耗额度、已完成的生成任务、已经下载或交付的数字结果、已经发生的第三方成本，以及因违反平台规则受到限制的账号，除适用法律另有强制要求外通常不退款。'],
      ['3. 申请方式', '请发送邮件至 feedback@xyaip.fun，提供账号邮箱、订单或支付编号、购买日期、金额、申请原因和必要证据。不要提供密码、验证码或完整银行卡信息。'],
      ['4. 审核与到账', '我们会结合使用记录和支付记录审核。获批退款将尽可能原路退回；最终到账时间取决于支付服务商和金融机构。取消续费不会自动产生当前账期退款。'],
    ],
  },
};

const agreementCards = [
  ['legal-user', '账号与服务', '登录、注册、账号与服务使用规则'],
  ['legal-privacy', '隐私与数据', '个人信息收集、使用、存储与权利'],
  ['legal-voice', '声纹授权', '声音训练前的敏感信息单独同意'],
  ['legal-avatar', '数字人形象授权', '肖像、形象与数字分身使用边界'],
  ['legal-image', '形象信息采集', '照片、视频与面部特征的处理说明'],
  ['legal-ai', 'AI 生成内容规则', '生成、审核、标识与发布规则'],
  ['legal-payment', '支付政策', '价格、支付、套餐生效与续费规则'],
  ['legal-refund', '退款政策', '退款适用范围、申请与审核流程'],
];

const supportCards = [
  {
    id: 'assets',
    title: '数字人与声音',
    icon: Layers3,
    color: '#64748b',
  },
  {
    id: 'materials',
    title: '素材库',
    icon: Library,
    color: '#0e8fbd',
  },
  {
    id: 'templates',
    title: '视频模板',
    icon: GalleryVerticalEnd,
    color: '#6d4dc2',
  },
  {
    id: 'music',
    title: '音乐',
    icon: Music2,
    color: '#a05b12',
  },
  {
    id: 'image',
    title: '图片',
    icon: Image,
    color: '#bf4652',
  },
  {
    id: 'billing',
    title: '套餐与额度',
    icon: CircleDollarSign,
    color: '#9a6a2f',
  },
];

const trendRows = [
  { source: 'TikTok', topic: 'AI presenter product demos', category: 'AI' },
  { source: 'YouTube', topic: 'Founder-led short video funnels', category: 'Marketing' },
  { source: 'BBC', topic: 'Synthetic media disclosure rules', category: 'News' },
];
const trendCategories = [
  { key: 'all', label: '综合', icon: '🐌', aliases: ['all', '综合', '全部'] },
  { key: 'technology', label: '科技', icon: '💡', aliases: ['technology', '科技'] },
  { key: 'finance', label: '财经', icon: '💹', aliases: ['finance', '财经'] },
  { key: 'livelihood', label: '民生', icon: '🏡', aliases: ['livelihood', '民生', '生活'] },
  { key: 'ai', label: 'AI', icon: '🤖', aliases: ['ai', 'AI'] },
  { key: 'alltalk', label: '争议', icon: '🎬', aliases: ['alltalk', '争议', '争议榜'] },
  { key: 'education', label: '教育', icon: '🎬', aliases: ['education', '教育', 'jiaoyu'] },
  { key: 'game', label: '游戏', icon: '🎮', aliases: ['game', '游戏'] },
  { key: 'entertainment', label: '媒体', icon: '🎬', aliases: ['entertainment', '媒体'] },
];
const mediaSources = [
  ['抖音', '🎵'],
  ['B站', '📺'],
  ['微博', '📣'],
  ['百度', '🎬'],
  ['头条新闻', '📰'],
  ['腾讯新闻', '📱'],
  ['纽约时报', '🌎'],
  ['BBC', '🌐'],
  ['法广', '📻'],
  ['澎湃新闻', '🌊'],
].map(([key, icon]) => ({ key, label: key, icon }));
const instructionSetTypes = [
  { value: '文案创作', key: 'copywriting', label: '文案创作', shortLabel: '文案', color: '#0b796f', icon: Edit3 },
  { value: '音乐创作', key: 'music', label: '音乐创作', shortLabel: '音乐', color: '#a05b12', icon: Music2 },
  { value: '图片创作', key: 'image', label: '图片创作', shortLabel: '图片', color: '#6d4dc2', icon: Image },
  { value: '视频创作', key: 'video', label: '视频创作', shortLabel: '视频', color: '#bf4652', icon: Video },
];
const instructionTypeAliases = {
  copy: '文案创作',
  copywriting: '文案创作',
  text: '文案创作',
  script: '文案创作',
  article: '文案创作',
  writing: '文案创作',
  文案: '文案创作',
  文案创作: '文案创作',
  音乐: '音乐创作',
  音乐创作: '音乐创作',
  歌词: '音乐创作',
  歌词创作: '音乐创作',
  music: '音乐创作',
  song: '音乐创作',
  lyric: '音乐创作',
  lyrics: '音乐创作',
  audio: '音乐创作',
  图片: '图片创作',
  图片创作: '图片创作',
  image: '图片创作',
  picture: '图片创作',
  photo: '图片创作',
  视频: '视频创作',
  视频创作: '视频创作',
  video: '视频创作',
  oral: '视频创作',
  mix: '视频创作',
};

const workflowSteps = [
  { no: '01', id: 'trends', title: '热点确认', icon: TrendingUp, action: '打开热点' },
  { no: '02', id: 'assistant', title: '发给智能体', icon: Bot, action: '选择智能体' },
  { no: '03', id: 'assistant', title: '生成文案', icon: Edit3, action: '生成文案' },
  { no: '04', id: 'video', title: '视频制作', icon: Video, action: '制作视频', production: 'oral' },
  { no: '05', id: 'video', title: '发布', icon: Send, action: '查看发布' },
];

const studioModes = [
  { id: 'mix', label: 'Mixed Video', icon: Clapperboard },
  { id: 'talking', label: 'Talking Avatar', icon: UserRound },
  { id: 'musicVideo', label: 'Music Video', icon: Music2 },
];
const PAGE_SIZE = 20;
const HOT_PAGE_SIZE = 100;
const MATERIAL_PAGE_SIZE = 48;
const MATERIAL_MIN_PAGE_SIZE_FOR_MORE = 20;
const TEMPLATE_PAGE_SIZE = 100;
const HOT_TOPIC_FLOW_KEY = 'hot_topic_script_flow';
const AGENT_CONTEXT_KEY = 'video_chat_agent_context';
const MUSIC_PREFILL_KEY = 'music_production_prefill_draft';
const VIDEO_PREFILL_KEY = 'mix_video_production_prefill_draft';
const DEFAULT_IMAGE_SCENE_PROMPT = '请保持人物五官和身份特征，参考场景图片的空间布局、光线与氛围，将人物自然融入场景，画面真实自然。';
const IMAGE_GENERATION_SCENES = [
  { id: 'business_studio', name: '商务演播厅', desc: '柔光棚拍 · 企业口播', prompt: '保持人物身份和五官特征，置于现代商务演播厅，背景有简洁屏幕与品牌级空间层次，使用柔和三点布光，适合专业企业口播，写实摄影' },
  { id: 'modern_office', name: '高管办公室', desc: '城市窗景 · 管理者形象', prompt: '保持人物身份和五官特征，置于现代高管办公室，落地窗外有城市建筑，空间简洁克制，日光与室内柔光平衡，呈现专业管理者形象，写实摄影' },
  { id: 'lifestyle_home', name: '精品会客厅', desc: '暖调软装 · 访谈氛围', prompt: '保持人物身份和五官特征，置于精品会客厅，使用木质、皮革与暖色软装营造高级访谈氛围，光线柔和自然，画面真实亲和' },
  { id: 'city_outdoor', name: '建筑外景', desc: '都市纵深 · 自然日光', prompt: '保持人物身份和五官特征，置于现代城市建筑外景，利用建筑线条形成纵深构图，自然日光，背景适度虚化，呈现专业都市形象，写实摄影' },
  { id: 'clean_portrait', name: '专业无影棚', desc: '纯净背景 · 标准肖像', prompt: '保持人物身份和五官特征，置于专业无影摄影棚，使用纯净中性背景和均匀柔光，肤色准确，人物轮廓清晰，适合标准品牌肖像，写实摄影' },
  { id: 'newsroom', name: '新闻直播间', desc: '屏幕背景 · 权威播报', prompt: '保持人物身份和五官特征，置于现代新闻直播间，背景包含克制的数据屏幕与演播台，冷暖光平衡，画面稳重权威，适合新闻播报，写实摄影' },
  { id: 'product_launch_stage', name: '品牌发布会', desc: '舞台灯光 · 新品发布', prompt: '保持人物身份和五官特征，置于高端品牌发布会舞台，背景为简洁大屏与层次灯带，舞台聚光自然，保留适量展示空间，适合新品发布演讲，写实摄影' },
  { id: 'minimal_gallery', name: '艺术展厅', desc: '建筑线条 · 高级留白', prompt: '保持人物身份和五官特征，置于极简当代艺术展厅，使用干净建筑线条、浅色墙面和高级留白，漫射光柔和，画面克制有设计感，写实摄影' },
  { id: 'city_rooftop_night', name: '城市夜景', desc: '霓虹散景 · 夜间氛围', prompt: '保持人物身份和五官特征，置于城市高层露台夜景，远处建筑灯光形成柔和散景，人物面部有自然补光，冷暖对比协调，具有高级电影氛围，写实摄影' },
];
const IMAGE_CAMERA_LANGUAGES = [
  { id: 'rembrandt_side_light', name: '伦勃朗侧光', desc: '45°主光 · 立体明暗', prompt: '伦勃朗人像布光，主光从人物侧前方约45度照射，面部形成自然三角光和柔和阴影，层次立体' },
  { id: 'cinematic_three_quarter_profile', name: '三分侧脸', desc: '侧面视线 · 电影构图', prompt: '人物呈三分之二侧脸，视线自然看向画外，电影感构图，浅景深，背景柔和虚化，保留适量负空间' },
  { id: 'rim_light', name: '轮廓逆光', desc: '边缘亮线 · 主体分离', prompt: '人物背后设置柔和轮廓逆光，头发和肩部边缘形成清晰光晕，主体与背景自然分离，画面具有电影质感' },
  { id: 'window_blind_shadow', name: '百叶窗光影', desc: '条纹阴影 · 节奏光影', prompt: '百叶窗投射出有节奏的条纹光影，光线掠过人物侧脸与背景，明暗对比自然，氛围克制高级' },
  { id: 'soft_window_light', name: '窗边柔光', desc: '自然漫射 · 通透肤色', prompt: '人物靠近窗边，使用大面积自然柔光从侧面照亮面部，阴影过渡细腻，肤色通透，真实摄影质感' },
  { id: 'low_key_dramatic', name: '低调戏剧光', desc: '深色阴影 · 高反差', prompt: '低调人像布光，背景偏暗，单侧主光塑造人物面部，保留深色阴影和高反差层次，氛围沉稳有张力' },
  { id: 'high_key_soft_light', name: '高调柔光', desc: '明亮均匀 · 品牌肖像', prompt: '高调人像布光，整体明亮干净，柔光均匀包裹人物，阴影轻柔，适合专业品牌和商务形象摄影' },
  { id: 'environmental_portrait_35mm', name: '35mm 环境', desc: '广角叙事 · 人景兼顾', prompt: '使用35mm环境人像视角，人物与空间关系清晰，前景和背景具有自然层次，构图有现场感和叙事感' },
  { id: 'telephoto_portrait_85mm', name: '85mm 特写', desc: '长焦压缩 · 奶油虚化', prompt: '使用85mm中长焦人像视角，采用胸像或近景构图，轻微压缩空间，人物五官自然端正，背景形成柔和奶油散景，主体清晰突出' },
  { id: 'butterfly_beauty_light', name: '蝴蝶美人光', desc: '正面高位光 · 精致五官', prompt: '使用经典蝴蝶光布光，主光位于人物正前方略高位置，在鼻下形成自然蝶形阴影，面部对称精致，辅光柔和控制反差，适合品牌肖像' },
  { id: 'low_angle_hero', name: '低机位仰拍', desc: '轻微仰角 · 权威力量', prompt: '使用轻微低机位仰拍，镜头低于人物视线但避免夸张变形，肩颈姿态自然，背景线条向上延伸，呈现自信、权威和力量感' },
  { id: 'symmetrical_composition', name: '中心对称', desc: '秩序构图 · 稳定高级', prompt: '使用中心对称构图，人物位于画面中轴，背景建筑或陈设保持左右视觉平衡，水平垂直线端正，画面秩序清晰、稳定高级' },
];

function Sidebar({ active, collapsed, onSelect, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`}>
      <button className="sidebar__brand" onClick={() => onSelect('home')} aria-label="Go home">
        <span className="brand-mark">K</span>
        <span className="brand-copy">
          <strong>Kali</strong>
          <small>Yixiu</small>
        </span>
      </button>
      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'is-active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar__version" aria-label={`Version ${APP_VERSION}`}>
        <span>{APP_VERSION}</span>
      </div>
      <button className="sidebar__toggle" onClick={onToggle}>
        <PanelLeftClose size={18} />
        <span>Collapse</span>
      </button>
    </aside>
  );
}

const notificationIconMap = {
  video: Video,
  smartVideo: Clapperboard,
  image: Image,
  human: UserRound,
  imageHuman: Sparkles,
  voice: Mic2,
  music: Music2,
};

function NotificationCenter({
  authed,
  items,
  unreadCount,
  loading,
  desktopPermission,
  onEnableDesktop,
  onLogin,
  onMarkAllRead,
  onOpenItem,
  onRefresh,
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const shellRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutside = (event) => {
      if (!shellRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const visibleItems = items.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'read') return item.read;
    return true;
  });

  const togglePanel = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && authed) onRefresh();
  };

  return (
    <div className="notification-shell" ref={shellRef}>
      <button
        className={`notification-trigger ${open ? 'is-open' : ''}`}
        onClick={togglePanel}
        aria-label={unreadCount ? `消息通知，${unreadCount} 条未读` : '消息通知'}
        aria-expanded={open}
      >
        <Bell size={19} />
        {unreadCount > 0 && <span>{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      {open && (
        <section className="notification-panel" aria-label="消息通知">
          <header className="notification-panel__header">
            <div><span>TASK UPDATES</span><h2>消息通知</h2></div>
            <div className="notification-panel__tools">
              <button onClick={onRefresh} disabled={loading} aria-label="刷新通知"><RefreshCw className={loading ? 'is-spinning' : ''} size={17} /></button>
              {unreadCount > 0 && <button className="notification-read-all" onClick={onMarkAllRead}>全部已读</button>}
            </div>
          </header>

          {!authed ? (
            <div className="notification-empty">
              <BellRing size={30} />
              <strong>登录后查看任务通知</strong>
              <p>视频、图片、数字人、声音和音乐的制作进度会集中显示在这里。</p>
              <button className="primary-button" onClick={() => { setOpen(false); onLogin(); }}>去登录</button>
            </div>
          ) : (
            <>
              <div className="notification-filter" role="tablist" aria-label="通知筛选">
                {[
                  ['all', '全部'],
                  ['unread', '未读'],
                  ['read', '已读'],
                ].map(([key, label]) => (
                  <button key={key} className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)} role="tab" aria-selected={filter === key}>{label}</button>
                ))}
              </div>
              <div className="notification-list">
                {loading && !items.length ? (
                  <div className="notification-empty is-compact"><RefreshCw className="is-spinning" size={24} /><strong>正在同步任务进度…</strong></div>
                ) : visibleItems.length ? visibleItems.map((item) => {
                  const Icon = notificationIconMap[item.kind] || Bell;
                  const StateIcon = item.status.key === 'success' ? CheckCircle2 : item.status.key === 'failed' ? AlertCircle : Clock3;
                  return (
                    <button className={`notification-item ${item.read ? '' : 'is-unread'}`} key={item.eventId} onClick={() => { onOpenItem(item); setOpen(false); }}>
                      <span className={`notification-item__icon is-${item.kind}`}><Icon size={18} /></span>
                      <span className="notification-item__copy">
                        <span className="notification-item__title"><strong>{item.title}</strong>{!item.read && <i />}</span>
                        <span>{item.subject}</span>
                        <small>{item.timeLabel || '最近更新'}</small>
                      </span>
                      <StateIcon className={`notification-item__state is-${item.status.key}`} size={17} />
                    </button>
                  );
                }) : (
                  <div className="notification-empty is-compact"><Bell size={25} /><strong>{filter === 'all' ? '暂无任务通知' : `暂无${filter === 'unread' ? '未读' : '已读'}通知`}</strong><p>任务成功或失败后，会自动通知你。</p></div>
                )}
              </div>
              <footer className="notification-panel__footer">
                <span><span className="status-dot" />每分钟自动同步</span>
                {desktopPermission === 'default' && <button onClick={onEnableDesktop}><BellRing size={14} />开启桌面提醒</button>}
                {desktopPermission === 'granted' && <em><Check size={13} />桌面提醒已开启</em>}
              </footer>
            </>
          )}
        </section>
      )}
    </div>
  );
}

function Topbar({ language, setLanguage, onNewVideo, onMenu, onLogin, onLogout, authed, notifications }) {
  const t = getCopy(language);
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open navigation">
        <Menu size={21} />
      </button>
      <div className="topbar__actions">
        <label className="language-select" translate="no">
          <Globe2 size={17} />
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <NotificationCenter authed={authed} onLogin={onLogin} {...notifications} />
        <button className="outline-top-button" onClick={authed ? onLogout : onLogin}>
          <UserRound size={17} />
          <span>{authed ? 'Sign out' : 'Sign in'}</span>
        </button>
        <button className="primary-button" onClick={onNewVideo}>
          <Plus size={18} />
          <span>{t.cta}</span>
        </button>
      </div>
    </header>
  );
}

function HomeWorkflow({ onSelect, onStartVideo }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % workflowSteps.length);
    }, 2300);
    return () => window.clearInterval(timer);
  }, []);

  const openStep = (step) => {
    setActiveIndex(workflowSteps.findIndex((item) => item.no === step.no));
    if (step.production) {
      onStartVideo({ productionType: step.production });
      return;
    }
    onSelect(step.id);
  };

  return (
    <section className="home-workflow" aria-label="主要工作流">
      <div className="home-workflow__head">
        <div>
          <span>MAIN FLOW</span>
          <h2>从热点到发布</h2>
        </div>
      </div>
      <div className="flow-track">
        <span className="flow-track__line" />
        <span className="flow-track__pulse" style={{ '--flow-progress': `${(activeIndex / (workflowSteps.length - 1)) * 100}%` }} />
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;
          const active = index === activeIndex;
          const done = index < activeIndex;
          return (
            <button
              key={step.no}
              className={`flow-step ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}`}
              onClick={() => openStep(step)}
            >
              <span className="flow-step__node"><Icon size={20} /></span>
              <span className="flow-step__copy">
                <small>{step.no}</small>
                <strong>{step.title}</strong>
              </span>
              <span className="flow-step__action">
                {step.action}
                <ChevronRight size={15} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SupportGrid({ active, onSelect }) {
  return (
    <section className="home-section" aria-label="支撑入口">
      <div className="section-title">
        <h2>支撑入口</h2>
      </div>
      <div className="action-grid">
        {supportCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              className={`action-card ${active === card.id ? 'is-selected' : ''}`}
              style={{ '--card-accent': card.color }}
              onClick={() => onSelect(card.id)}
            >
              <span className="action-card__media">
                <Icon size={24} />
              </span>
              <span className="action-card__body">
                <span className="action-card__icon">
                  <Icon size={22} />
                </span>
                <strong>{card.title}</strong>
              </span>
              <ChevronRight className="action-card__arrow" size={18} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PreviewPanel({ language, activeMode, setActiveMode }) {
  return (
    <section className="preview-panel">
      <div className="panel-head">
        <div>
          <h2>视频制作拆解</h2>
        </div>
        <button className="icon-button" aria-label="Upload material">
          <Upload size={18} />
        </button>
      </div>
      <div className="mode-switcher">
        {studioModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              className={activeMode === mode.id ? 'is-active' : ''}
              onClick={() => setActiveMode(mode.id)}
            >
              <Icon size={16} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
      <div className="video-builder">
        <div className="video-frame">
          <img src="/yixiu-assets/swiper0.png" alt="Kali production preview" />
          <button className="play-button" aria-label="Play preview">
            <Play size={22} fill="currentColor" />
          </button>
        </div>
        <div className="builder-list">
          {['Trend or brief', 'Script', 'Digital human', 'Voice', 'Template', 'Cover', 'Music', 'Publish account'].map((item, index) => (
            <div className="builder-row" key={item}>
              <span>{item}</span>
              <strong>{index < 4 ? 'Ready' : 'Choose'}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrendsPanel() {
  const [rows, setRows] = useState(trendRows);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let ignore = false;

    setStatus('loading');
    apiFetch('/api/hotlist/list', { auth: false, params: { category: 'all' } }).then((result) => {
      if (ignore) return;

      const list = toList(result.data);
      setRows(
        result.ok && list.length
          ? list.slice(0, 3).map((item, index) => ({
              source: item.source || item.platform || item.media || 'Trend',
              topic: item.title || item.name || item.keyword || item.topic || `Trend ${index + 1}`,
              category: item.category || item.channel || 'General',
            }))
          : trendRows,
      );
      setStatus(result.ok ? 'live' : 'fallback');
    });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="trends-panel">
      <div className="panel-head">
        <div>
          <h2>Hot Trends</h2>
        </div>
        <Sparkles size={20} />
      </div>
      <div className="trend-table" translate="no">
        {rows.map((row, index) => (
          <button className="trend-row" key={row.topic}>
            <span className="rank">{String(index + 1).padStart(2, '0')}</span>
            <span>
              <strong>{row.topic}</strong>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

const getPageParams = (endpoint, page) => ({
  ...(endpoint.params || {}),
  page,
  page_size: PAGE_SIZE,
  pageSize: PAGE_SIZE,
  limit: PAGE_SIZE,
});

const loadEndpoint = async (endpoint, page = 1) => {
  const result = await apiFetch(endpoint.path, {
    ...endpoint,
    params: getPageParams(endpoint, page),
  });
  const list = toList(result.data).slice(0, PAGE_SIZE);

  return {
    ...result,
    endpoint,
    page,
    list,
    hasMore: result.ok && list.length === PAGE_SIZE,
  };
};

function useEndpointGroup(config, authVersion) {
  const [state, setState] = useState({ loading: false, results: [] });

  useEffect(() => {
    if (!config) return undefined;
    let ignore = false;

    setState({ loading: true, results: [] });
    Promise.all(config.endpoints.map((endpoint) => loadEndpoint(endpoint, 1))).then((results) => {
      if (ignore) return;
      setState({ loading: false, results });
    });

    return () => {
      ignore = true;
    };
  }, [config, authVersion]);

  const loadMore = async (label) => {
    const current = state.results.find((item) => item.endpoint.label === label);
    if (!current || current.loadingMore || !current.hasMore) return;

    setState((value) => ({
      ...value,
      results: value.results.map((item) =>
        item.endpoint.label === label ? { ...item, loadingMore: true } : item,
      ),
    }));

    const next = await loadEndpoint(current.endpoint, current.page + 1);
    setState((value) => ({
      ...value,
      results: value.results.map((item) =>
        item.endpoint.label === label
          ? { ...next, list: item.list.concat(next.list), loadingMore: false }
          : item,
      ),
    }));
  };

  return { ...state, loadMore };
}

function readableRecord(item = {}, index) {
  const title =
    item.title ||
    item.name ||
    item.keyword ||
    item.topic ||
    item.task_name ||
    item.file_name ||
    item.nickname ||
    item.id ||
    `Record ${index + 1}`;
  const status = [
    item.statusText,
    item.status_text,
    item.displayStatus,
    item.display_status,
    item.status,
    item.state,
    item.task_status,
    item.taskStatus,
    item.result_status,
    item.resultStatus,
    item.production_status,
    item.productionStatus,
    item.publish_status,
    item.publishStatus,
    item.draftStatus,
    item.draft_status,
    item.draftState,
    item.draft_state,
    item.code,
    item.is_draft || item.draft ? 'draft' : '',
  ]
    .filter((value) => value !== undefined && value !== null && value !== '')
    .join(' ');
  const meta = item.category || item.type || item.source || item.created_at || item.updated_at || item.createdAt || item.duration || '';

  return {
    title: String(title),
    meta: String(meta || 'Ready'),
    status: normalizeStatus(status),
    media: getMedia(item),
  };
}

function normalizeStatus(status) {
  const text = `${status || ''}`.toLowerCase();
  if (/draft|drafted|saved_draft|temporary|暂存|草稿|已保存|保存/.test(text)) {
    return { key: 'draft', label: '草稿' };
  }
  if (/published|publish_done|publish_success|已发布|发布完成|发布成功/.test(text)) {
    return { key: 'published', label: '发布完成' };
  }
  if (/fail|failed|error|失败|异常|denied|reject|生成失败/.test(text)) {
    return { key: 'failed', label: '失败' };
  }
  if (/pending|queue|wait|processing|running|progress|generating|training|制作中|生成中|处理中|进行中|训练中|等待|待处理/.test(text)) {
    return { key: 'processing', label: '制作中' };
  }
  if (/success|succeeded|done|complete|completed|succeed|ok|成功|已完成|完成|视频生成|200/.test(text)) {
    return { key: 'success', label: '成功' };
  }
  return { key: 'ready', label: '草稿' };
}

function getMedia(item = {}) {
  const keys = [
    'image',
    'image_url',
    'imageUrl',
    'cover',
    'cover_url',
    'coverUrl',
    'avatar',
    'avatar_url',
    'thumbnail',
    'thumbnail_url',
    'video',
    'video_url',
    'videoUrl',
    'url',
    'audio_url',
    'audioUrl',
    'preview_audio_url',
    'music_url',
  ];
  const url = keys.map((key) => item[key]).find((value) => typeof value === 'string' && /^https?:\/\//.test(value));
  if (!url) return null;
  if (/\.(mp4|mov|webm|m3u8)(\?|$)/i.test(url)) return { type: 'video', url };
  if (/\.(mp3|wav|m4a|aac|ogg)(\?|$)/i.test(url)) return { type: 'audio', url };
  return { type: 'image', url };
}

function MediaPreview({ media }) {
  if (!media) return <div className="media-preview media-preview--empty"><Sparkles size={18} /></div>;
  if (media.type === 'video') return <video className="media-preview" src={media.url} controls muted playsInline />;
  if (media.type === 'audio') {
    return (
      <div className="media-preview media-preview--audio">
        <Music2 size={18} />
        <audio src={media.url} controls />
      </div>
    );
  }
  return <img className="media-preview" src={media.url} alt="" loading="lazy" />;
}

const templatePayloads = (result = {}) => {
  const raw = compactObject(result.raw);
  const rawData = compactObject(raw.data);
  const rawNestedData = compactObject(rawData.data);
  return [compactObject(result.data), rawNestedData, rawData, raw].filter((item) => Object.keys(item).length);
};
const getTemplateNextCursor = (result = {}) =>
  pick(
    ...templatePayloads(result).flatMap((payload) => [
      payload.sid,
      payload.next_cursor,
      payload.nextCursor,
      payload.start_cursor,
      payload.startCursor,
      payload.cursor,
    ]),
  );
const getTemplateHasMore = ({ result, cursor, list, page }) => {
  const payloads = templatePayloads(result);
  const explicit = payloads
    .map((payload) => (payload.has_more !== undefined ? payload.has_more : payload.hasMore))
    .find((value) => value !== undefined);

  if (explicit !== undefined) return Boolean(explicit);

  const nextCursorValue = getTemplateNextCursor(result);
  if (nextCursorValue && nextCursorValue !== cursor && list.length) return true;

  const total = Number(pick(...payloads.flatMap((payload) => [payload.total, payload.count, payload.totalCount, payload.total_count]))) || 0;
  const totalPage = Number(pick(...payloads.flatMap((payload) => [payload.total_page, payload.totalPage, payload.pages]))) || 0;
  if (totalPage) return page < totalPage;
  if (total) return page * TEMPLATE_PAGE_SIZE < total;

  return list.length >= TEMPLATE_PAGE_SIZE;
};
const getTemplateMedia = (item = {}) => {
  const demo = getApiMediaUrl(
    pick(
      item.demo,
      item.demo_url,
      item.demoUrl,
      item.preview_video,
      item.previewVideo,
      item.preview_video_url,
      item.previewVideoUrl,
      item.video,
      item.video_url,
      item.videoUrl,
    ),
  );
  const cover = getApiMediaUrl(
    pick(
      item.cover,
      item.cover_url,
      item.coverUrl,
      item.image,
      item.image_url,
      item.imageUrl,
      item.thumbnail,
      item.thumbnail_url,
      item.thumbnailUrl,
      item.preview,
      item.preview_url,
      item.previewUrl,
      item.url,
    ),
  );
  const demoType = demo && /\.(mp4|mov|webm|m3u8)(\?|#|$)/i.test(demo) ? 'video' : 'link';

  return { demo, demoType, cover: cover || (demoType === 'video' ? getVideoFrameUrl(demo) : demo) };
};
const normalizeTemplate = (item = {}, index = 0, group = '') => {
  const media = getTemplateMedia(item);
  const id = pick(item.templateId, item.template_id, item.id, item.value, item.code, item.key, `${group}-${index}`);
  const duration = Number(item.duration || item.durationTime || item.duration_time || item.videoDuration || item.video_duration) || 0;
  const ratio = pick(item.ratio, item.aspect_ratio, item.aspectRatio, item.size, item.resolution);
  const tags = normalizeTagList(item).slice(0, 3);

  return {
    id,
    title: pick(item.title, item.name, item.templateName, item.template_name, item.label) || `模板 ${index + 1}`,
    meta: [duration ? formatDuration(duration) : '', ratio, pick(item.category, item.type, item.scene, item.source)].filter(Boolean).join(' · ') || group,
    cover: media.cover,
    demo: media.demo,
    demoType: media.demoType,
    tags,
    raw: item,
  };
};

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const VIDEO_EXTENSIONS = ['mp4', 'mov'];
const MAX_MATERIAL_COUNT = 9;
const MAX_VIDEO_DURATION = 60;
const MAX_TRAINING_VIDEO_DURATION = 120;
const MAX_VOICE_DURATION = 120;
const MAX_VIDEO_SIDE = 2000;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const VIDEO_PRODUCTION_TYPES = {
  oral: {
    key: 'oral',
    listKey: 'oral',
    label: '数字人口播',
    createLabel: '制作数字人视频',
    emptyLabel: '数字人口播视频',
    syncLabel: '数字人视频',
    eyebrow: 'DIGITAL HUMAN VIDEO',
    icon: UserRound,
    description: '查看数字人口播视频的制作记录、成片状态和发布流程。',
    sectionHint: '数字人、声音与口播文案',
    title: '数字人视频',
    templateScene: 'virtualman',
    productionScene: 'digital_human_video',
    listPath: '/api/video/production/list',
    createPath: '/api/video/production/create',
  },
  mix: {
    key: 'mix',
    listKey: 'mix',
    label: '混剪视频',
    createLabel: '制作混剪视频',
    emptyLabel: '混剪视频',
    syncLabel: '混剪视频',
    eyebrow: 'MIXED VIDEO',
    icon: Clapperboard,
    description: '查看混剪视频的制作记录、成片状态和发布流程。',
    sectionHint: '图片、视频与包装素材混剪',
    title: '混剪视频',
    templateScene: 'oralMixCutting',
    productionScene: 'oralMixCutting',
    listPath: '/api/video-mix/list',
    createPath: '/api/video-mix/create',
  },
  professional: {
    key: 'professional',
    listKey: 'professional',
    label: '形象播报 Pro',
    createLabel: '制作形象播报 Pro',
    emptyLabel: '形象播报 Pro 视频',
    syncLabel: '形象播报 Pro 视频',
    eyebrow: 'PROFESSIONAL BROADCAST',
    icon: GalleryVerticalEnd,
    description: '查看形象播报 Pro 的分镜素材视频制作记录、成片状态和发布流程。',
    sectionHint: '数字人、声音、文案分镜与素材',
    title: '形象播报 Pro 视频',
    templateScene: 'virtualman',
    productionScene: 'custom_virtualman_broadcast',
    listPath: '/api/video-mix/list',
    createPath: '/api/video/custom-virtualman-broadcast/create',
    createPaths: ['/api/video/custom-virtualman-broadcast/create', '/api/video/production/custom-virtualman-broadcast/create', '/api/video/production/create'],
    endpoint: 'custom_virtualman_broadcast',
    openapiPath: '/v1/clip/video/custom_virtualman_broadcast',
  },
  materialPackage: {
    key: 'materialPackage',
    listKey: 'materialPackage',
    label: '素材成片 Pro',
    createLabel: '制作素材成片 Pro',
    emptyLabel: '素材成片 Pro 视频',
    syncLabel: '素材成片 Pro 视频',
    eyebrow: 'CUSTOM BROADCAST MIXCUT',
    icon: Layers3,
    description: '查看素材成片 Pro 的分镜素材视频制作记录、成片状态和发布流程。',
    sectionHint: '声音、文案分镜与素材',
    title: '素材成片 Pro 视频',
    templateScene: 'oralMixCutting',
    productionScene: 'custom_broadcast_mixcut',
    listPath: '/api/video-mix/list',
    createPath: '/api/video-mix/custom-broadcast-mixcut/create',
    createPaths: ['/api/video-mix/custom-broadcast-mixcut/create', '/api/video-mix/create'],
    endpoint: 'custom_broadcast_mixcut',
    openapiPath: '/v1/clip/video/custom_broadcast_mixcut',
  },
};

const formatFileSize = (size = 0) => {
  const value = Number(size) || 0;
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)}MB`;
  if (value >= 1024) return `${Math.ceil(value / 1024)}KB`;
  return value ? `${value}B` : '';
};
const formatDuration = (duration = 0) => {
  const total = Math.ceil(Number(duration) || 0);
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};
const getVideoDuration = (file) =>
  new Promise((resolve) => {
    if (!file) {
      resolve(0);
      return;
    }
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(Number.isFinite(video.duration) ? video.duration : 0);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(0);
    };
    video.src = objectUrl;
  });
const getAudioDuration = (file) =>
  new Promise((resolve) => {
    if (!file) {
      resolve(0);
      return;
    }
    const audio = document.createElement('audio');
    const objectUrl = URL.createObjectURL(file);
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(0);
    };
    audio.src = objectUrl;
  });
const getExtension = (name = '') => {
  const clean = textOf(name).split('?')[0].toLowerCase();
  const parts = clean.split('.');
  return parts.length > 1 ? parts.pop() : '';
};
const getUploadedUrl = (result = {}) => {
  const pickUrl = (payload, depth = 0) => {
    if (!payload || depth > 5) return '';
    if (typeof payload === 'string') return getApiMediaUrl(payload);
    if (Array.isArray(payload)) return payload.map((item) => pickUrl(item, depth + 1)).find(Boolean) || '';
    if (typeof payload !== 'object') return '';

    const direct = pick(
      payload.filepath,
      payload.file_path,
      payload.full_path,
      payload.fullPath,
      payload.url,
      payload.fileUrl,
      payload.file_url,
      payload.audio_url,
      payload.audioUrl,
      payload.video_url,
      payload.videoUrl,
      payload.oss_url,
      payload.ossUrl,
      payload.object_url,
      payload.objectUrl,
      payload.download_url,
      payload.downloadUrl,
      payload.uri,
      payload.src,
      payload.path,
    );
    if (direct) return getApiMediaUrl(direct);

    return pickUrl(payload.data, depth + 1) || pickUrl(payload.file, depth + 1) || pickUrl(payload.result, depth + 1);
  };

  return pickUrl(result.data) || pickUrl(result.raw?.data) || pickUrl(result.raw) || pickUrl(result);
};
const omitEmpty = (payload = {}) =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== ''));
const getMaterialSourceObject = (item = {}) => {
  if (typeof item === 'string') return { url: item };
  const source = videoObject(item);
  const nested = ['material', 'media', 'file', 'resource', 'asset', 'item', 'data']
    .map((key) => videoObject(source[key]))
    .find((value) => Object.keys(value).length);
  if (!nested) return source;
  return {
    ...nested,
    ...source,
    url: videoText(source.url, source.fileUrl, source.file_url, source.mediaUrl, source.media_url, nested.url, nested.fileUrl, nested.file_url, nested.mediaUrl, nested.media_url),
  };
};
const getMaterialId = (item = {}) => {
  const source = getMaterialSourceObject(item);
  return pick(source.materialId, source.material_id, source.fileId, source.file_id, source.assetId, source.asset_id, source.id, source.value, source.code, source.key);
};
const getMaterialUrl = (item = {}) => {
  const source = getMaterialSourceObject(item);
  return pick(
    source.fileUrl,
    source.file_url,
    source.url,
    source.mediaUrl,
    source.media_url,
    source.materialUrl,
    source.material_url,
    source.sourceUrl,
    source.source_url,
    source.resourceUrl,
    source.resource_url,
    source.assetUrl,
    source.asset_url,
    source.downloadUrl,
    source.download_url,
    source.ossUrl,
    source.oss_url,
    source.fullPath,
    source.full_path,
    source.filepath,
    source.src,
    source.path,
    source.videoUrl,
    source.video_url,
    source.imageUrl,
    source.image_url,
  );
};
const getMaterialType = (item = {}) => {
  const source = getMaterialSourceObject(item);
  const type = pick(source.type, source.materialType, source.material_type, source.mediaType, source.media_type, source.fileType, source.file_type).toLowerCase();
  const url = getMaterialUrl(source).toLowerCase();
  if (type.includes('video') || type === '视频' || /\.(mp4|mov|webm|m3u8)(\?|#|$)/i.test(url)) return 'video';
  return 'image';
};
const getVideoFrameUrl = (url) => {
  const clean = textOf(url);
  if (!clean || clean.includes('vframe/jpg/offset/0')) return clean;
  return `${clean}${clean.includes('?') ? '&' : '?'}vframe/jpg/offset/0`;
};
const normalizeMaterial = (item = {}, index = 0) => {
  const type = getMaterialType(item);
  const url = getMaterialUrl(item);
  const cover =
    pick(item.coverUrl, item.cover_url, item.thumbnailUrl, item.thumbnail_url, item.previewUrl, item.preview_url, item.imageUrl, item.image_url) ||
    (type === 'video' ? getVideoFrameUrl(url) : url);
  const duration = Number(item.duration || item.durationTime || item.duration_time) || 0;
  const size = Number(item.size || item.fileSize || item.file_size || item.data_size) || 0;
  const createdAt = pick(item.createdAt, item.created_at, item.createTime, item.create_time);
  const meta = [type === 'video' && duration ? formatDuration(duration) : '', size ? formatFileSize(size) : '', createdAt].filter(Boolean).join(' · ');

  return {
    id: getMaterialId(item) || `${type}-${index}-${url}`,
    materialId: getMaterialId(item),
    title: pick(item.name, item.title, item.fileName, item.file_name) || `素材 ${index + 1}`,
    type,
    typeName: type === 'video' ? '视频' : '图片',
    url,
    cover,
    meta: meta || '暂无素材信息',
    raw: item,
  };
};

const authVideoListKeys = [
  'authVideos',
  'auth_videos',
  'authVideoUrls',
  'auth_video_urls',
  'authVideoList',
  'auth_video_list',
  'authorizationVideos',
  'authorization_videos',
  'videos',
  'list',
  'items',
  'records',
  'rows',
];
const authVideoNestedKeys = [
  'data',
  'result',
  'team',
  'organization',
  'workspace',
  'authVideo',
  'auth_video',
  'authorizationVideo',
  'authorization_video',
  'video',
  'user',
  'profile',
];
const getApiMediaUrl = (url) => {
  const value = textOf(url);
  if (!value) return '';
  if (/^\/\//.test(value)) return `https:${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `https://yixiuapi.xyaip.fun${value}`;
  return value;
};
const getAuthVideoUrl = (item = {}) => {
  if (typeof item === 'string') return getApiMediaUrl(item);
  return getApiMediaUrl(
    pick(
      item.authVideoUrl,
      item.auth_video_url,
      item.authorizationVideoUrl,
      item.authorization_video_url,
      item.videoUrl,
      item.video_url,
      item.fileUrl,
      item.file_url,
      item.url,
      item.path,
    ),
  );
};
const getAuthVideoIdValue = (item = {}) =>
  pick(item.authorizationVideoId, item.authorization_video_id, item.authVideoId, item.auth_video_id, item.videoId, item.video_id, item.id);
const findAuthVideoItems = (payload, depth = 0) => {
  if (depth > 6 || payload === null || payload === undefined) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload === 'string') return [payload];
  if (typeof payload !== 'object') return [];

  for (const key of authVideoListKeys) {
    if (Array.isArray(payload[key])) return payload[key];
    if (payload[key] !== undefined) {
      const nested = findAuthVideoItems(payload[key], depth + 1);
      if (nested.length) return nested;
    }
  }

  for (const key of authVideoNestedKeys) {
    const nested = findAuthVideoItems(payload[key], depth + 1);
    if (nested.length) return nested;
  }

  return getAuthVideoUrl(payload) ? [payload] : [];
};
const getAuthVideoId = (response = {}) => {
  let payload = response.data !== undefined ? response.data : response;
  let depth = 0;

  while (payload && typeof payload === 'object' && !Array.isArray(payload) && depth < 6) {
    const id = getAuthVideoIdValue(payload);
    if (id) return id;
    payload = payload.data || payload.result || payload.authVideo || payload.auth_video || payload.authorizationVideo || payload.authorization_video || payload.video;
    depth += 1;
  }

  return '';
};
const normalizeAuthVideo = (item = {}, index = 0) => {
  const source = typeof item === 'string' ? { url: item } : item || {};
  const url = getAuthVideoUrl(source);
  if (!url) return null;

  const owner = pick(source.ownerName, source.owner_name, source.uploaderName, source.uploader_name, source.memberName, source.member_name, source.createdByName, source.created_by_name);
  const duration = Number(source.duration || source.videoDuration || source.video_duration) || 0;
  const durationText = pick(source.durationText, source.duration_text) || (duration ? formatDuration(duration) : '团队已保存');
  const id = getAuthVideoIdValue(source);

  return {
    id: id || url,
    authorizationVideoId: id,
    key: id || url,
    url,
    name: pick(source.name, source.title, source.label, source.fileName, source.file_name, source.videoName, source.video_name) || `${owner || '团队'}授权视频 ${index + 1}`,
    meta: `${owner || '团队共享'} · ${durationText}`,
    duration,
    saved: true,
    selected: false,
    raw: source,
  };
};
const getAuthVideoLibrary = (response = {}) => {
  const videos = findAuthVideoItems(response).map(normalizeAuthVideo).filter(Boolean);
  const selected = videos.length === 1 ? videos[0] : null;
  return {
    videos: videos.map((item) => ({ ...item, selected: selected ? item.key === selected.key : false })),
    selected,
  };
};
const normalizeHuman = (item = {}, index = 0) => {
  const cover = getApiMediaUrl(pick(item.coverUrl, item.coverurl, item.cover_url, item.imageUrl, item.image_url, item.avatarUrl, item.avatar_url, item.thumbnailUrl, item.thumbnail_url, item.firstFrame, item.first_frame));
  const video = getApiMediaUrl(pick(item.video_url, item.videoUrl, item.url, item.filepath));
  const status = normalizeStatus(pick(item.statusText, item.status_text, item.status, item.train_status, item.trainStatus, item.task_status, item.taskStatus, item.state));
  const createdAt = pick(item.created_at, item.createdAt, item.create_time, item.createTime);
  const greenScreen = item.isGreenBg ?? item.is_green_bg;
  return {
    id: pick(item.aihumanId, item.aihuman_id, item.ai_human_id, item.humanId, item.human_id, item.taskId, item.task_id, item.id, `${index}`),
    title: pick(item.custom_tag, item.name, item.title, item.aihumanName, item.aihuman_name, item.ai_human_name, item.humanName, item.human_name, item.virtualmanName, item.virtualman_name) || `数字人 ${index + 1}`,
    meta: [pick(item.gender, item.sex), greenScreen === true || greenScreen === 1 || greenScreen === '1' ? '绿幕形象' : '', createdAt].filter(Boolean).join(' · ') || (video ? '形象视频已上传' : '数字人形象'),
    cover,
    video,
    status,
    raw: item,
  };
};
const VOICE_LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '中文' },
  { value: 'zh-CN-yue', label: '中文（粤语）' },
  { value: 'en-US', label: '英文' },
  { value: 'es-MX', label: '西班牙语' },
  { value: 'fr-FR', label: '法语' },
  { value: 'ru-RU', label: '俄语' },
  { value: 'de-DE', label: '德语' },
  { value: 'pt-PT', label: '葡萄牙语' },
  { value: 'ar-AE', label: '阿拉伯语' },
  { value: 'it-IT', label: '意大利语' },
  { value: 'ja-JP', label: '日语' },
  { value: 'ko-KR', label: '韩语' },
  { value: 'id-ID', label: '印度尼西亚语' },
  { value: 'vi-VN', label: '越南语' },
  { value: 'tr-TR', label: '土耳其语' },
  { value: 'nl-NL', label: '荷兰语' },
  { value: 'uk-UA', label: '乌克兰语' },
  { value: 'th-TH', label: '泰语' },
  { value: 'pl-PL', label: '波兰语' },
  { value: 'ro-RO', label: '罗马尼亚语' },
  { value: 'el-GR', label: '希腊语' },
  { value: 'cs-CZ', label: '捷克语' },
  { value: 'fi-FI', label: '芬兰语' },
  { value: 'hi-IN', label: '印地语' },
];
const getVoiceItems = (result = {}) => {
  const keys = ['voices', 'list', 'items', 'records', 'rows', 'results'];
  const payloads = [result.data, result.raw?.data?.data, result.raw?.data, result.raw];
  for (const payload of payloads) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') continue;
    for (const key of keys) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }
  return [];
};
const normalizeVoiceAsset = (item = {}, index = 0) => {
  const audioUrl = getApiMediaUrl(pick(item.audio_url, item.audioUrl, item.preview_url, item.previewUrl, item.demo_url, item.demoUrl, item.url));
  const cover = getApiMediaUrl(pick(item.coverUrl, item.cover_url, item.avatarUrl, item.avatar_url, item.imageUrl, item.image_url));
  const rawStatus = pick(item.statusText, item.status_text, item.status, item.train_status, item.trainStatus, item.task_status, item.taskStatus, item.state);
  const status = audioUrl && !rawStatus ? { key: 'success', label: '成功' } : normalizeStatus(rawStatus);
  const speed = Number(item.voice_speed || item.voiceSpeed || item.speed) || 1;
  const languages = Array.isArray(item.langs) ? item.langs.join(' / ') : pick(item.langs, item.languages, item.language);
  return {
    id: pick(item.voiceId, item.voice_id, item.speakerId, item.speaker_id, item.taskId, item.task_id, item.id, `voice-${index}`),
    title: pick(item.custom_tag, item.name, item.title, item.voiceName, item.voice_name, item.speakerName, item.speaker_name) || `克隆声音 ${index + 1}`,
    meta: [pick(item.gender, item.sex), languages, pick(item.created_at, item.createdAt, item.create_time, item.createTime), `语速 ${speed}x`].filter(Boolean).join(' · '),
    audioUrl,
    cover,
    speed,
    status,
    raw: item,
  };
};
const normalizeGeneratedImage = (item = {}, index = 0) => {
  const nested = item.generatedImage || item.generated_image || (typeof item.image === 'object' ? item.image : {});
  const source = { ...item, ...nested };
  const url = getApiMediaUrl(pick(source.imageUrl, source.image_url, source.generatedImageUrl, source.generated_image_url, source.outputUrl, source.output_url, source.finalImageUrl, source.final_image_url, source.url, source.path, source.filepath, source.resultUrl, source.result_url, typeof source.image === 'string' ? source.image : ''));
  const rawStatus = pick(source.statusText, source.status_text, source.taskStatus, source.task_status, source.status, source.state);
  const status = url ? { key: 'success', label: '已完成' } : normalizeStatus(rawStatus || 'processing');
  const createdAt = pick(source.createdAt, source.created_at, source.createTime, source.create_time, source.updatedAt, source.updated_at);
  return {
    id: pick(source.generatedImageId, source.generated_image_id, source.imageGenerationId, source.image_generation_id, source.taskId, source.task_id, source.id, `${index}`),
    title: pick(source.sceneName, source.scene_name, source.sceneLabel, source.scene_label, source.name, source.title, source.scene) || `AI 形象图 ${index + 1}`,
    prompt: pick(source.prompt, source.instruction, source.description, source.desc),
    url,
    status,
    createdAt,
    raw: source,
  };
};
const getImageGenerationItems = (result = {}) => {
  const listKeys = ['images', 'generatedImages', 'generated_images', 'list', 'items', 'records', 'results', 'rows'];
  const seen = new Set();
  const visit = (value, depth = 0) => {
    if (!value || depth > 6) return [];
    if (Array.isArray(value)) return value;
    if (typeof value !== 'object' || seen.has(value)) return [];
    seen.add(value);
    for (const key of listKeys) {
      if (Array.isArray(value[key])) return value[key];
    }
    for (const key of ['data', 'result', 'payload']) {
      const nested = visit(value[key], depth + 1);
      if (nested.length) return nested;
    }
    return [];
  };
  const dataItems = visit(result.data);
  return dataItems.length ? dataItems : visit(result.raw);
};
const readMediaInfo = (file, type) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const element = document.createElement(type === 'video' ? 'video' : 'img');
    const cleanup = () => URL.revokeObjectURL(url);

    if (type === 'video') {
      element.preload = 'metadata';
      element.onloadedmetadata = () => {
        const info = {
          width: element.videoWidth || 0,
          height: element.videoHeight || 0,
          duration: element.duration || 0,
        };
        cleanup();
        resolve(info);
      };
    } else {
      element.onload = () => {
        const info = { width: element.naturalWidth || 0, height: element.naturalHeight || 0, duration: 0 };
        cleanup();
        resolve(info);
      };
    }
    element.onerror = () => {
      cleanup();
      reject(new Error('素材文件读取失败'));
    };
    element.src = url;
  });
const validateMaterialFile = async (file) => {
  const extension = getExtension(file.name);
  const fileType = file.type.startsWith('video/') || VIDEO_EXTENSIONS.includes(extension) ? 'video' : 'image';

  if (fileType === 'image' && !IMAGE_EXTENSIONS.includes(extension)) {
    throw new Error('图片仅支持 jpg / png / webp 静态图');
  }
  if (fileType === 'video' && !VIDEO_EXTENSIONS.includes(extension)) {
    throw new Error('视频仅支持 mp4 / mov');
  }
  if (fileType === 'video' && file.size >= MAX_VIDEO_SIZE) {
    throw new Error('单个视频需小于 500MB');
  }

  const info = await readMediaInfo(file, fileType);
  if (fileType === 'video') {
    const side = Math.max(info.width || 0, info.height || 0);
    if (info.duration && info.duration >= MAX_VIDEO_DURATION) throw new Error('视频时长需小于 60 秒');
    if (side && side >= MAX_VIDEO_SIDE) throw new Error('视频单边分辨率需小于 2000px');
  }

  return { type: fileType, ...info };
};
const compactObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const materialPayloads = (result = {}) => {
  const raw = compactObject(result.raw);
  const rawData = compactObject(raw.data);
  const rawNestedData = compactObject(rawData.data);
  return [compactObject(result.data), rawNestedData, rawData, raw].filter((item) => Object.keys(item).length);
};
const getMaterialNextCursor = (result = {}) =>
  pick(
    ...materialPayloads(result).flatMap((payload) => [
      payload.next_cursor,
      payload.nextCursor,
      payload.start_cursor,
      payload.startCursor,
      payload.sid,
      payload.cursor,
    ]),
  );
const getMaterialHasMore = ({ result, cursor, list, page }) => {
  const payloads = materialPayloads(result);
  const explicit = payloads
    .map((payload) => (payload.has_more !== undefined ? payload.has_more : payload.hasMore))
    .find((value) => value !== undefined);

  if (explicit !== undefined) return Boolean(explicit);

  const nextCursorValue = getMaterialNextCursor(result);
  if (nextCursorValue && nextCursorValue !== cursor && list.length) return true;

  const total = Number(pick(...payloads.flatMap((payload) => [payload.total, payload.count, payload.totalCount, payload.total_count]))) || 0;
  const totalPage = Number(pick(...payloads.flatMap((payload) => [payload.total_page, payload.totalPage, payload.pages]))) || 0;
  if (totalPage) return page < totalPage;
  if (total) return page * MATERIAL_PAGE_SIZE < total;

  return list.length >= MATERIAL_MIN_PAGE_SIZE_FOR_MORE;
};

function MaterialsPage({ authVersion, onLogin }) {
  const [materials, setMaterials] = useState([]);
  const [page, setPage] = useState(1);
  const [nextCursor, setNextCursor] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadFailures, setUploadFailures] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const gridWrapRef = useRef(null);
  const authed = Boolean(getAccessToken());

  const selectedItems = materials.filter((item) => selected[item.id]);
  const selectedCount = selectedItems.length;

  const loadMaterials = async ({ nextPage = 1, append = false } = {}) => {
    if (!authed) {
      setMaterials([]);
      setHasMore(false);
      return;
    }
    append ? setLoadingMore(true) : setLoading(true);
    setMessage('');
    const cursor = append ? nextCursor : '';
    const result = await apiFetch('/api/material/list', {
      params: {
        page: nextPage,
        page_size: MATERIAL_PAGE_SIZE,
        pageSize: MATERIAL_PAGE_SIZE,
        limit: MATERIAL_PAGE_SIZE,
        ...(cursor ? { start_cursor: cursor } : {}),
      },
      timeoutMs: 9000,
    });
    const list = toList(result.data).map((item, index) => normalizeMaterial(item, append ? materials.length + index : index));
    const cursorValue = getMaterialNextCursor(result);

    if (result.ok) {
      setMaterials((current) => (append ? current.concat(list) : list));
      setPage(nextPage);
      setNextCursor(cursorValue);
      setHasMore(getMaterialHasMore({ result, cursor, list, page: nextPage }));
      if (!append) {
        setSelecting(false);
        setSelected({});
      }
    } else {
      setMessage(result.authMissing ? '请先登录后查看素材' : getResultMessage(result, '素材列表获取失败'));
      if (!append) setMaterials([]);
      setHasMore(false);
    }
    append ? setLoadingMore(false) : setLoading(false);
  };

  useEffect(() => {
    loadMaterials({ nextPage: 1, append: false });
  }, [authVersion, authed]);

  useEffect(() => {
    const element = gridWrapRef.current;
    if (!element || !authed || loading || loadingMore || !hasMore || !materials.length) return;
    if (element.scrollHeight <= element.clientHeight + 24) {
      loadMaterials({ nextPage: page + 1, append: true });
    }
  }, [materials.length, hasMore, loading, loadingMore, page, authed]);

  const toggleSelection = (material) => {
    setSelecting(true);
    setSelected((current) => ({ ...current, [material.id]: !current[material.id] }));
  };
  const cancelSelection = () => {
    setSelecting(false);
    setSelected({});
  };
  const previewMaterial = (material) => {
    if (selecting) {
      toggleSelection(material);
      return;
    }
    if (material.url) window.open(material.url, '_blank', 'noopener,noreferrer');
  };
  const updateUploadItem = (id, patch) => {
    setUploadQueue((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };
  const uploadPickedFiles = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, MAX_MATERIAL_COUNT);
    event.target.value = '';
    if (!files.length) return;
    if (!authed) {
      onLogin();
      return;
    }

    const failures = [];
    const created = [];
    const queue = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name || 'material'}`,
      name: file.name || `素材 ${index + 1}`,
      progress: 0,
      status: 'pending',
      message: '等待上传',
    }));
    setUploading(true);
    setUploadQueue(queue);
    setUploadFailures([]);
    setMessage('');

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const queueItem = queue[index];
      try {
        updateUploadItem(queueItem.id, { progress: 5, status: 'validating', message: '检查文件' });
        const info = await validateMaterialFile(file);
        updateUploadItem(queueItem.id, { progress: 10, status: 'uploading', message: '上传中' });
        const uploadResult = await uploadFile(file, {
          source: 'material',
          onProgress: (progress) => updateUploadItem(queueItem.id, { progress: Math.min(90, Math.max(10, progress)), status: 'uploading', message: '上传中' }),
        });
        if (!uploadResult.ok) throw new Error(getResultMessage(uploadResult, '素材上传失败'));
        const url = getUploadedUrl(uploadResult);
        if (!url) throw new Error('素材上传未返回 URL');

        updateUploadItem(queueItem.id, { progress: 95, status: 'saving', message: '保存素材' });
        const payload = {
          name: file.name,
          type: info.type,
          url,
          file_url: url,
          filepath: url,
          size: file.size,
          width: info.width || 0,
          height: info.height || 0,
          duration: Math.max(Math.ceil(info.duration || 0), info.type === 'video' ? 1 : 0),
        };
        const addResult = await apiFetch('/api/material/add', { method: 'POST', body: payload, timeoutMs: 12000 });
        if (!addResult.ok) throw new Error(getResultMessage(addResult, '素材保存失败'));
        created.push(normalizeMaterial({ ...payload, ...(addResult.data || {}) }, index));
        updateUploadItem(queueItem.id, { progress: 100, status: 'done', message: '已完成' });
      } catch (error) {
        const reason = error.message || '素材上传失败';
        failures.push({ id: queueItem.id, name: queueItem.name, reason });
        setUploadFailures(failures.slice());
        updateUploadItem(queueItem.id, { progress: 100, status: 'failed', message: reason });
      }
    }

    setUploading(false);
    setUploadFailures(failures);
    if (created.length) {
      setMaterials((current) => created.concat(current));
      loadMaterials({ nextPage: 1, append: false });
    }
    setMessage(failures.length ? `上传完成，失败 ${failures.length} 个` : '素材上传完成');
  };
  const deleteSelected = async () => {
    if (!selectedCount || deleting) return;
    const ids = Array.from(new Set(selectedItems.map((item) => item.materialId || getMaterialId(item.raw)).filter(Boolean)));
    if (!ids.length) {
      setMessage('所选素材缺少 ID，无法删除');
      return;
    }
    if (!window.confirm(`确定删除已选的 ${selectedCount} 个素材吗？删除后不可恢复。`)) return;

    setDeleting(true);
    const result = await apiFetch('/api/material/delete', { method: 'POST', body: { ids: ids.join(',') }, timeoutMs: 12000 });
    setDeleting(false);
    if (!result.ok) {
      setMessage(getResultMessage(result, '删除失败'));
      return;
    }
    setMaterials((current) => current.filter((item) => !selected[item.id]));
    cancelSelection();
    setMessage('删除成功');
    loadMaterials({ nextPage: 1, append: false });
  };
  const handleScroll = (event) => {
    const element = event.currentTarget;
    if (loading || loadingMore || !hasMore) return;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 80) {
      loadMaterials({ nextPage: page + 1, append: true });
    }
  };

  return (
    <div className="material-page">
      <section className="material-header">
        <div>
          <h1>Materials</h1>
          <p>管理图片和视频素材，支持批量上传、预览和删除。</p>
        </div>
        <div className="material-actions">
          {materials.length > 0 && !selecting && (
            <button className="outline-button" disabled={uploading || deleting} onClick={() => setSelecting(true)}>
              <Check size={17} />
              <span>管理</span>
            </button>
          )}
          {selecting && (
            <button className="outline-button" disabled={deleting} onClick={cancelSelection}>
              <X size={17} />
              <span>取消</span>
            </button>
          )}
          <label className={`primary-button ${deleting ? 'is-disabled' : ''}`}>
            <Upload size={18} />
            <span>{uploading ? '上传中' : '上传'}</span>
            <input type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={uploadPickedFiles} disabled={uploading || deleting} />
          </label>
        </div>
      </section>
      <section className="material-rules">
        <strong>视频</strong>
        <span>mp4 / mov，时长 &lt; 60 秒，单边 &lt; 2000px，单个 &lt; 500MB</span>
      </section>
      {uploadQueue.length > 0 && (
        <section className="material-upload-queue">
          <div className="material-upload-queue__head">
            <strong>上传队列</strong>
            <span>{uploadQueue.filter((item) => item.status === 'done').length}/{uploadQueue.length} 已完成</span>
          </div>
          <div className="material-upload-list">
            {uploadQueue.map((item) => (
              <div className={`material-upload-item is-${item.status}`} key={item.id}>
                <span className="material-upload-item__icon">
                  {item.status === 'done' ? <CheckCircle2 size={18} /> : item.status === 'failed' ? <AlertCircle size={18} /> : uploading ? <RefreshCw className="is-spinning" size={18} /> : <Upload size={18} />}
                </span>
                <span className="material-upload-item__body">
                  <span className="material-upload-item__meta">
                    <strong>{item.name}</strong>
                    <small>{item.message}</small>
                  </span>
                  <span className="material-upload-item__bar">
                    <i style={{ width: `${item.progress}%` }} />
                  </span>
                </span>
                <em>{item.progress}%</em>
              </div>
            ))}
          </div>
        </section>
      )}
      {uploadFailures.length > 0 && (
        <section className="material-failures">
          <div className="material-failures__head">
            <strong>上传失败原因</strong>
            <span>{uploadFailures.length} 个</span>
          </div>
          {uploadFailures.map((failure) => (
            <div className="material-failure" key={failure.id}>
              <strong>{failure.name}</strong>
              <span>{failure.reason}</span>
            </div>
          ))}
        </section>
      )}
      {message && <div className="form-message">{message}</div>}
      <section ref={gridWrapRef} className={`material-grid-wrap ${selecting ? 'is-managing' : ''}`} onScroll={handleScroll}>
        {loading ? (
          <div className="material-state">
            <strong>素材加载中</strong>
            <span>正在同步素材列表</span>
          </div>
        ) : materials.length ? (
          <div className="material-grid">
            {materials.map((material) => {
              const isSelected = Boolean(selected[material.id]);
              return (
                <button
                  className={`material-card ${isSelected ? 'is-selected' : ''}`}
                  key={material.id}
                  onClick={() => previewMaterial(material)}
                  onDoubleClick={() => toggleSelection(material)}
                >
                  <span className="material-card__media">
                    {material.cover ? (
                      <img src={material.cover} alt="" loading="lazy" />
                    ) : material.type === 'video' && material.url ? (
                      <video src={material.url} muted playsInline preload="metadata" />
                    ) : (
                      <span className="material-card__placeholder">
                        {material.type === 'video' ? <Play size={30} /> : <Image size={30} />}
                      </span>
                    )}
                    {material.type === 'video' && <span className="material-card__play"><Play size={18} fill="currentColor" /></span>}
                    <span className="material-card__type">{material.typeName}</span>
                    {selecting && (
                      <span className={`material-card__check ${isSelected ? 'is-selected' : ''}`}>
                        {isSelected && <Check size={15} />}
                      </span>
                    )}
                  </span>
                  <span className="material-card__body">
                    <strong>{material.title}</strong>
                    <small>{material.meta}</small>
                  </span>
                </button>
              );
            })}
            {(hasMore || loadingMore) && (
              <button className="material-load-more" disabled={loadingMore} onClick={() => loadMaterials({ nextPage: page + 1, append: true })}>
                {loadingMore ? '加载更多中' : '加载更多'}
              </button>
            )}
          </div>
        ) : (
          <div className="material-state">
            <strong>{message || '暂无素材'}</strong>
            <span>{authed ? '点击上传，添加图片或视频素材' : '登录后可查看和管理素材'}</span>
          </div>
        )}
      </section>
      {selecting && (
        <div className="material-delete-bar">
          <div>
            <strong>已选择 {selectedCount} 个素材</strong>
            <span>可继续下滑加载更多素材</span>
          </div>
          <button className="danger-button" disabled={!selectedCount || deleting} onClick={deleteSelected}>
            <Trash2 size={17} />
            <span>{deleting ? '删除中' : '删除'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

const MUSIC_PAGE_SIZE = 20;
const MUSIC_DEFAULT_MODEL = 'V5_5';
const MUSIC_DEFAULT_WEIGHT = 0.65;
const MUSIC_STYLES = [
  { key: 'mandopop', label: '华语流行', desc: '旋律清晰', prompt: 'Mandopop, catchy melody, modern pop arrangement, clean vocal-forward mix' },
  { key: 'ballad', label: '抒情', desc: '钢琴情绪', prompt: 'Pop ballad, emotional vocal, memorable chorus, warm arrangement, polished mix' },
  { key: 'rock', label: '摇滚', desc: '吉他鼓点', prompt: 'Rock, electric guitar, driving drums, powerful vocal, energetic chorus' },
  { key: 'rap', label: '说唱', desc: '强节奏', prompt: 'Hip-hop, rap vocal, strong beat, punchy drums, modern urban sound' },
  { key: 'guofeng', label: '国风', desc: '民乐融合', prompt: 'Chinese traditional fusion, guzheng, erhu, pipa, modern pop rhythm, elegant vocal' },
  { key: 'electronic', label: '电子', desc: '合成器', prompt: 'Electronic pop, synth layers, dance beat, bright hook, clean modern production' },
  { key: 'folk', label: '民谣', desc: '木吉他', prompt: 'Folk pop, acoustic guitar, warm vocal, intimate storytelling, natural drums' },
  { key: 'cinematic', label: '电影感', desc: '弦乐铺陈', prompt: 'Cinematic pop, atmospheric pads, dramatic strings, emotional build, spacious mix' },
  { key: 'ambient', label: '氛围纯音', desc: '柔和器乐', prompt: 'Ambient instrumental, evolving pads, soft piano textures, spacious reverb, no vocal' },
];
const MUSIC_PROMPT_IDEAS = [
  { label: '品牌宣传', text: '一首明亮、有记忆点的品牌宣传歌，适合短视频开头，节奏轻快，副歌适合重复传播。' },
  { label: '情绪治愈', text: '一首温柔治愈的歌，关于疲惫一天后重新找回力量，女声，钢琴和木吉他，慢板。' },
  { label: '产品发布', text: '一首有科技感的产品发布背景音乐，电子流行，节奏稳定，逐步推向高潮。' },
];
const MUSIC_SECTION_TAGS = [
  ['前奏', '[Intro]'], ['主歌', '[Verse]'], ['预副歌', '[Pre-Chorus]'], ['副歌', '[Chorus]'], ['桥段', '[Bridge]'], ['尾奏', '[Outro]'],
];
const EMPTY_MUSIC_FORM = { title: '', prompt: '', lyrics: '', styleKey: MUSIC_STYLES[0].key, customStyle: '', negativeTags: '', vocalGender: '', voiceId: '' };

const takeMusicPrefill = () => {
  try {
    const draft = JSON.parse(window.localStorage.getItem(MUSIC_PREFILL_KEY) || '{}');
    window.localStorage.removeItem(MUSIC_PREFILL_KEY);
    if (!draft || typeof draft !== 'object' || (!draft.title && !draft.lyrics && !draft.prompt)) return null;
    const inputType = ['prompt', 'instrumental'].includes(draft.inputType) ? draft.inputType : 'lyrics';
    return {
      inputType,
      form: {
        ...EMPTY_MUSIC_FORM,
        title: textOf(draft.title),
        prompt: inputType === 'lyrics' ? '' : textOf(draft.prompt || draft.lyrics),
        lyrics: inputType === 'lyrics' ? textOf(draft.lyrics || draft.prompt) : '',
        customStyle: textOf(draft.customStyle || draft.style),
        negativeTags: textOf(draft.negativeTags),
        vocalGender: textOf(draft.vocalGender),
        voiceId: textOf(draft.selectedVoiceId || draft.voiceId),
      },
    };
  } catch {
    window.localStorage.removeItem(MUSIC_PREFILL_KEY);
    return null;
  }
};

const getMusicPayloads = (result = {}) => {
  const raw = result.raw || {};
  const values = [result.data, raw.data?.data, raw.data, raw];
  return values.filter((item) => item && typeof item === 'object');
};
const getMusicList = (result = {}) => {
  for (const payload of getMusicPayloads(result)) {
    if (Array.isArray(payload)) return payload;
    for (const key of ['generated_music', 'generatedMusic', 'results', 'list', 'items', 'records', 'rows']) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }
  return [];
};
const getMusicVoiceList = (result = {}) => {
  for (const payload of getMusicPayloads(result)) {
    if (Array.isArray(payload)) return payload;
    for (const key of ['suno_voices', 'sunoVoices', 'results', 'list', 'items', 'records', 'rows']) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }
  return [];
};
const normalizeMusicStatus = (value) => {
  const status = textOf(value).toLowerCase();
  if (['success', 'succeeded', 'completed', 'complete'].includes(status)) return { key: 'success', label: '已完成' };
  if (['failed', 'fail', 'error'].includes(status)) return { key: 'failed', label: '生成失败' };
  if (['pending', 'queued'].includes(status)) return { key: 'processing', label: '排队中' };
  return { key: 'processing', label: '生成中' };
};
const formatMusicDate = (value) => {
  if (!value) return '';
  const numeric = Number(value);
  const date = new Date(Number.isFinite(numeric) && numeric > 0 && numeric < 1000000000000 ? numeric * 1000 : value);
  if (Number.isNaN(date.getTime())) return textOf(value);
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
};
const getMusicAudioUrl = (item = {}) => {
  const related = item.related || {};
  const resultUrls = item.result_urls || item.resultUrls || related.result_urls || related.resultUrls || [];
  return getApiMediaUrl(pick(
    item.preview_audio_url, item.previewAudioUrl, item.preview_url, item.previewUrl,
    item.download_audio_url, item.downloadAudioUrl, item.final_audio_url, item.finalAudioUrl,
    item.music_url, item.musicUrl, item.audio_url, item.audioUrl, item.url,
    related.preview_audio_url, related.previewAudioUrl, related.download_audio_url, related.downloadAudioUrl,
    related.music_url, related.musicUrl, related.audio_url, related.audioUrl, related.url,
    Array.isArray(resultUrls) ? resultUrls[0] : '',
  ));
};
const getMusicTrackSource = (item = {}) => {
  for (const key of ['items', 'songs', 'tracks', 'audios', 'audio_items', 'audioItems', 'result_items', 'resultItems']) {
    if (Array.isArray(item[key])) return item[key];
  }
  return [];
};
const normalizeMusicTrack = (item = {}, index = 0, parent = {}) => {
  const audioId = pick(item.musicid, item.musicId, item.music_id, item.audio_id, item.audioId, item.id);
  const audioUrl = getMusicAudioUrl(item);
  return {
    id: audioId || `${parent.id || parent.taskId || 'track'}-${index}`,
    audioId,
    taskId: parent.taskId,
    title: pick(item.title, item.name, item.version_name, item.versionName) || `${parent.title || 'AI 音乐'} ${index + 1}`,
    audioUrl,
    duration: formatDuration(item.duration || item.duration_seconds || item.durationSeconds || 0),
    createdAt: formatMusicDate(item.created_at || item.createdAt),
    raw: item,
    video: null,
  };
};
const getFirstMusicResult = (result = {}) => {
  for (const payload of getMusicPayloads(result)) {
    if (Array.isArray(payload)) return payload[0] || {};
    for (const key of ['videos', 'video_list', 'videoList', 'results', 'list', 'items', 'records', 'rows']) {
      if (Array.isArray(payload[key])) return payload[key][0] || {};
    }
    if (Object.keys(payload).length) return payload;
  }
  return {};
};
const normalizeMusicVideo = (item = {}) => {
  if (!item || !Object.keys(item).length) return null;
  const related = item.related || {};
  const result = item.result || item.result_data || item.resultData || {};
  const status = normalizeMusicStatus(item.status || related.status);
  const videoUrl = getApiMediaUrl(pick(item.video_url, item.videoUrl, item.url, item.file_url, item.fileUrl, item.output_url, item.outputUrl, result.video_url, result.videoUrl, result.url, related.video_url, related.videoUrl, related.url));
  const id = pick(item.id, item.task_id, item.taskId, related.id, related.task_id, related.taskId);
  const hasDetail = Boolean(id || videoUrl || item.status || related.status);
  if (!hasDetail) return null;
  return {
    id,
    taskId: pick(item.task_id, item.taskId, related.task_id, related.taskId),
    status: { ...status, label: status.key === 'success' ? '视频已完成' : status.key === 'failed' ? '视频制作失败' : '视频制作中' },
    videoUrl,
    coverUrl: getApiMediaUrl(pick(item.cover_url, item.coverUrl, item.image_url, item.imageUrl, item.thumbnail_url, item.thumbnailUrl, result.cover_url, result.coverUrl, result.image_url, result.imageUrl, related.cover_url, related.coverUrl, related.image_url, related.imageUrl)),
    failReason: pick(item.fail_reason, item.failReason, item.failure_reason, item.error_message, item.message, related.fail_reason),
    createdAt: formatMusicDate(item.updated_at || item.updatedAt || item.created_at || item.createdAt || related.updated_at || related.created_at),
    raw: item,
  };
};
const normalizeMusicItem = (item = {}, index = 0) => {
  const related = item.related || {};
  const status = normalizeMusicStatus(item.status || related.status);
  const audioUrl = getMusicAudioUrl(item);
  const base = {
    id: pick(item.id, item.music_id, item.musicId, item.task_id, item.taskId, `music-${index}`),
    taskId: pick(item.task_id, item.taskId, related.task_id, related.taskId),
    title: pick(item.title, item.name, related.title, related.name) || `AI 音乐 ${index + 1}`,
    prompt: pick(item.prompt, item.description, related.prompt, related.description),
    style: pick(item.style, item.tags, related.style),
    imageUrl: getApiMediaUrl(pick(item.image_url, item.imageUrl, item.cover_url, item.coverUrl, related.image_url)),
    audioUrl,
    duration: formatDuration(item.duration || item.duration_seconds || item.durationSeconds || related.duration || 0),
    createdAt: formatMusicDate(item.created_at || item.createdAt || related.created_at || related.createdAt),
    failReason: pick(item.fail_reason, item.failReason, item.failure_reason, item.error_message, item.message, related.fail_reason),
    status,
    raw: item,
  };
  return { ...base, tracks: getMusicTrackSource(item).map((track, trackIndex) => normalizeMusicTrack(track, trackIndex, base)), video: null };
};
const normalizeMusicVoice = (item = {}, index = 0) => {
  const related = item.related || {};
  const status = normalizeMusicStatus(item.status || related.status);
  return {
    id: pick(item.id, item.task_id, item.taskId, item.voice_id, item.voiceId, `voice-${index}`),
    voiceId: pick(item.voice_id, item.voiceId, related.voice_id, related.voiceId),
    name: pick(item.voice_name, item.voiceName, item.name, related.voice_name, related.voiceName) || `自建音色 ${index + 1}`,
    status,
  };
};
const getMusicRemaining = (result = {}) => {
  for (const payload of getMusicPayloads(result)) {
    const plan = payload.user_plan || payload.userPlan || payload.plan || payload;
    const value = plan.music_remaining ?? plan.musicRemaining;
    if (value !== undefined && value !== null && value !== '') return Number(value);
  }
  return null;
};

function MusicStudioPage({ authVersion, onLogin, onOpenLyrics, onOpenBilling }) {
  const [prefill] = useState(takeMusicPrefill);
  const [view, setView] = useState(prefill ? 'create' : 'list');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [message, setMessage] = useState('');
  const [musicRemaining, setMusicRemaining] = useState(null);
  const [voices, setVoices] = useState([]);
  const [inputType, setInputType] = useState(prefill?.inputType || 'lyrics');
  const [form, setForm] = useState(prefill?.form || EMPTY_MUSIC_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRefreshing, setDetailRefreshing] = useState(false);
  const [detailMessage, setDetailMessage] = useState('');
  const [creatingVideoId, setCreatingVideoId] = useState('');
  const authed = Boolean(getAccessToken());
  const selectedStyle = MUSIC_STYLES.find((item) => item.key === form.styleKey) || MUSIC_STYLES[0];
  const isPrompt = inputType === 'prompt';
  const isInstrumental = inputType === 'instrumental';
  const promptText = isPrompt || isInstrumental ? textOf(form.prompt) : textOf(form.lyrics);
  const styleText = [selectedStyle.prompt, textOf(form.customStyle)].filter(Boolean).join(', ');
  const canGenerate = isPrompt
    ? Boolean(promptText && promptText.length <= 500)
    : Boolean(textOf(form.title) && styleText && (isInstrumental || promptText));

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const loadMusic = async ({ nextPage = 1, append = false } = {}) => {
    if (!authed) {
      setItems([]);
      setHasMore(false);
      return;
    }
    append ? setLoadingMore(true) : setLoading(true);
    setMessage('');
    const result = await apiFetch('/api/music/generated', {
      params: { page: nextPage, page_size: MUSIC_PAGE_SIZE, pageSize: MUSIC_PAGE_SIZE, limit: MUSIC_PAGE_SIZE },
      timeoutMs: 10000,
    });
    if (result.ok) {
      const received = getMusicList(result).map(normalizeMusicItem);
      setItems((current) => {
        if (!append) return received;
        const known = new Set(current.map((item) => item.id));
        return current.concat(received.filter((item) => !known.has(item.id)));
      });
      setPage(nextPage);
      setHasMore(received.length >= MUSIC_PAGE_SIZE);
    } else {
      if (!append) setItems([]);
      setHasMore(false);
      setMessage(result.authMissing ? '' : getResultMessage(result, '音乐列表获取失败'));
    }
    append ? setLoadingMore(false) : setLoading(false);
  };
  const loadCreationData = async () => {
    if (!authed) return;
    const [planResult, voiceResult] = await Promise.all([
      apiFetch('/api/plan/user-plan', { timeoutMs: 8000 }),
      apiFetch('/api/music/voice/list', { params: { page: 1, page_size: MUSIC_PAGE_SIZE, status: 'succeeded' }, timeoutMs: 8000 }),
    ]);
    if (planResult.ok) setMusicRemaining(getMusicRemaining(planResult));
    if (voiceResult.ok) {
      setVoices(getMusicVoiceList(voiceResult).map(normalizeMusicVoice).filter((voice) => voice.voiceId && voice.status.key === 'success'));
    }
  };
  const fetchMusicVideo = async (target, music) => {
    const musicId = pick(target.audioId, target.id);
    if (!musicId) return null;
    const raw = music.raw || {};
    const result = await apiFetch(`/api/music/video/by-music/${encodeURIComponent(musicId)}`, {
      params: omitEmpty({
        refresh: 1,
        taskId: music.taskId,
        sourceTaskId: pick(raw.source_task_id, raw.sourceTaskId, music.taskId),
      }),
      timeoutMs: 10000,
    });
    return result.ok ? normalizeMusicVideo(getFirstMusicResult(result)) : null;
  };
  const loadMusicVideoDetails = async (music) => {
    if (!music?.id) return music;
    if (music.tracks?.length) {
      const tracks = await Promise.all(music.tracks.map(async (track) => ({ ...track, video: await fetchMusicVideo(track, music) })));
      return { ...music, tracks };
    }
    return { ...music, video: await fetchMusicVideo(music, music) };
  };
  const loadMusicDetail = async (source, { refresh = false } = {}) => {
    if (!source) return;
    setView('detail');
    setSelectedMusic(source);
    setDetailMessage('');
    refresh ? setDetailRefreshing(true) : setDetailLoading(true);
    let music = source;
    if (source.taskId) {
      const result = await apiFetch(`/api/music/tasks/${encodeURIComponent(source.taskId)}`, {
        params: { refresh: 1 },
        timeoutMs: 12000,
      });
      if (result.ok) {
        music = normalizeMusicItem({ ...(source.raw || {}), ...getFirstMusicResult(result), task_id: source.taskId, title: source.title }, 0);
      } else {
        setDetailMessage(getResultMessage(result, '音乐详情获取失败'));
      }
    }
    setSelectedMusic(music);
    const withVideos = await loadMusicVideoDetails(music);
    setSelectedMusic(withVideos);
    refresh ? setDetailRefreshing(false) : setDetailLoading(false);
  };
  const retryMusic = (music) => {
    const raw = music?.raw || {};
    const related = raw.related || {};
    const retryPayload = raw.retry_payload || raw.retryPayload || raw.request_payload || raw.requestPayload || raw.generate_payload || raw.generatePayload || raw.payload || raw.params || raw.input || related.retry_payload || related.request_payload || raw;
    const customModeValue = retryPayload.customMode ?? retryPayload.custom_mode;
    const customMode = customModeValue === undefined ? Boolean(retryPayload.title || retryPayload.style || music.title || music.style) : !['false', '0', 'no'].includes(textOf(customModeValue).toLowerCase());
    const instrumental = !['false', '0', 'no', ''].includes(textOf(retryPayload.instrumental).toLowerCase());
    const nextType = customMode ? (instrumental ? 'instrumental' : 'lyrics') : 'prompt';
    const prompt = pick(retryPayload.prompt, retryPayload.lyrics, raw.prompt, raw.lyrics, music.prompt);
    setInputType(nextType);
    setForm({
      title: pick(retryPayload.title, music.title),
      prompt: nextType === 'lyrics' ? '' : prompt,
      lyrics: nextType === 'lyrics' ? prompt : '',
      styleKey: MUSIC_STYLES[0].key,
      customStyle: pick(retryPayload.customStyle, retryPayload.custom_style, retryPayload.style, music.style),
      negativeTags: pick(retryPayload.negativeTags, retryPayload.negative_tags),
      vocalGender: pick(retryPayload.vocalGender, retryPayload.vocal_gender),
      voiceId: pick(retryPayload.voiceId, retryPayload.voice_id),
    });
    setMessage('已恢复上次生成参数，请检查后重新提交。');
    setView('create');
    loadCreationData();
  };
  const createMusicVideo = async (music, track = null) => {
    const target = track || music;
    const audioId = pick(target.audioId, target.id);
    if (!music?.taskId || !audioId || creatingVideoId) {
      if (!music?.taskId || !audioId) setDetailMessage('音乐音频尚未生成，暂时不能制作视频。');
      return;
    }
    setCreatingVideoId(target.id);
    setDetailMessage('');
    const raw = { ...(music.raw || {}), ...(target.raw || {}) };
    const result = await apiFetch('/api/music/video/generate', {
      method: 'POST',
      body: omitEmpty({
        taskId: music.taskId,
        audioId,
        author: raw.author,
        domainName: raw.domainName || raw.domain_name,
        callBackUrl: raw.callBackUrl || raw.callbackUrl || raw.call_back_url,
      }),
      timeoutMs: 30000,
    });
    if (result.ok) {
      setDetailMessage('音乐视频已提交后台制作。');
      const refreshed = await loadMusicVideoDetails(music);
      setSelectedMusic(refreshed);
    } else {
      setDetailMessage(getResultMessage(result, '音乐视频提交失败'));
    }
    setCreatingVideoId('');
  };

  useEffect(() => {
    loadMusic({ nextPage: 1 });
    loadCreationData();
  }, [authVersion, authed]);

  const openCreate = () => {
    if (!authed) {
      onLogin();
      return;
    }
    setMessage('');
    setView('create');
    loadCreationData();
  };
  const selectSource = (type) => {
    setInputType(type);
    if (type === 'voice') {
      setInputType('lyrics');
      if (voices[0]) updateForm('voiceId', voices[0].voiceId);
      else setMessage('暂无可用的自建音色，可先使用默认声音。');
    }
  };
  const appendSection = (tag) => updateForm('lyrics', `${form.lyrics ? `${form.lyrics}\n\n` : ''}${tag}\n`);
  const resetForm = () => {
    setInputType('lyrics');
    setForm(EMPTY_MUSIC_FORM);
  };
  const submitMusic = async () => {
    if (!authed) {
      onLogin();
      return;
    }
    if (!canGenerate || submitting) return;
    setSubmitting(true);
    setMessage('正在提交音乐生成任务…');
    const payload = isPrompt
      ? { prompt: promptText, customMode: false }
      : omitEmpty({
          prompt: promptText,
          style: styleText,
          title: textOf(form.title),
          customMode: true,
          instrumental: isInstrumental,
          model: MUSIC_DEFAULT_MODEL,
          voiceId: isInstrumental ? '' : textOf(form.voiceId),
          negativeTags: textOf(form.negativeTags),
          vocalGender: isInstrumental ? '' : textOf(form.vocalGender),
          styleWeight: MUSIC_DEFAULT_WEIGHT,
          weirdnessConstraint: MUSIC_DEFAULT_WEIGHT,
          audioWeight: MUSIC_DEFAULT_WEIGHT,
        });
    const result = await apiFetch('/api/music/generate', { method: 'POST', body: payload, timeoutMs: 30000 });
    if (result.ok) {
      const remaining = getMusicRemaining(result);
      if (remaining !== null) setMusicRemaining(remaining);
      resetForm();
      setView('list');
      await loadMusic({ nextPage: 1 });
      setMessage('音乐任务已提交，可在列表查看生成进度。');
    } else {
      const error = getResultMessage(result, '音乐生成失败');
      setMessage(error);
    }
    setSubmitting(false);
  };

  if (view === 'detail') {
    const music = selectedMusic;
    return (
      <div className="music-detail-page">
        <header className="music-detail-header">
          <button className="outline-button" onClick={() => { setView('list'); setDetailMessage(''); }}>返回我的音乐</button>
          <div><span>MUSIC DETAIL</span><h1>音乐详情</h1><p>查看任务状态、试听每一首成品，并继续制作音乐视频。</p></div>
          {music?.taskId && <button className="music-detail-refresh" disabled={detailRefreshing || detailLoading} onClick={() => loadMusicDetail(music, { refresh: true })}><Sparkles size={16} />{detailRefreshing ? '刷新中…' : '刷新状态'}</button>}
        </header>

        {detailLoading && !music ? <div className="music-detail-state"><Music2 size={34} /><strong>音乐详情加载中</strong></div> : music ? <>
          <section className="music-detail-overview">
            <div className="music-detail-cover">
              {music.imageUrl ? <img src={music.imageUrl} alt={music.title} /> : <div className="music-cover-art art-0"><span /><Music2 size={46} /></div>}
              <em className={`state-chip--${music.status.key}`}>{music.status.label}</em>
            </div>
            <div className="music-detail-summary">
              <div className="music-detail-title"><div><small>{music.taskId ? `TASK ${music.taskId}` : 'AI MUSIC'}</small><h2>{music.title}</h2></div>{detailLoading && <span>读取任务中…</span>}</div>
              <div className="music-detail-meta">
                {music.style && <span><strong>风格</strong>{music.style}</span>}
                {music.createdAt && <span><strong>创建时间</strong>{music.createdAt}</span>}
                {music.duration && <span><strong>时长</strong>{music.duration}</span>}
              </div>
              {music.status.key === 'failed' && music.failReason && <div className="music-detail-error"><strong>生成失败</strong><span>{music.failReason}</span></div>}
              {!music.tracks?.length && music.audioUrl && <audio controls preload="metadata" src={music.audioUrl} />}
              <div className="music-detail-actions">
                {music.status.key === 'failed' && <button className="danger-button" onClick={() => retryMusic(music)}>重试制作</button>}
                {!music.tracks?.length && music.audioUrl && <button className="primary-button" disabled={creatingVideoId === music.id} onClick={() => createMusicVideo(music)}><Video size={16} /><span>{creatingVideoId === music.id ? '提交中…' : '制作音乐视频'}</span></button>}
                {!music.tracks?.length && music.audioUrl && <a className="music-download-link" href={music.audioUrl} target="_blank" rel="noreferrer">下载音乐</a>}
              </div>
            </div>
          </section>

          {detailMessage && <div className="music-message"><span>{detailMessage}</span></div>}

          {music.tracks?.length > 0 && <section className="music-detail-section">
            <div className="music-detail-section-head"><div><span>GENERATED TRACKS</span><h2>成品歌曲</h2></div><em>{music.tracks.length} 个版本</em></div>
            <div className="music-track-list">{music.tracks.map((track, index) => <article className="music-track-card" key={track.id}>
              <div className="music-track-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="music-track-main"><div><strong>{track.title}</strong><small>{track.duration || track.createdAt || '已生成'}</small></div>{track.audioUrl ? <audio controls preload="none" src={track.audioUrl} /> : <span className="music-audio-pending">音频尚未生成</span>}</div>
              <div className="music-track-actions">
                {track.audioUrl && <button onClick={() => createMusicVideo(music, track)} disabled={creatingVideoId === track.id}><Video size={15} />{creatingVideoId === track.id ? '提交中' : '制作视频'}</button>}
                {track.audioUrl && <a href={track.audioUrl} target="_blank" rel="noreferrer">下载</a>}
              </div>
              {track.video && <div className={`music-video-result is-${track.video.status.key}`}><div><strong>音乐视频</strong><span>{track.video.status.label}{track.video.createdAt ? ` · ${track.video.createdAt}` : ''}</span></div>{track.video.failReason && <p>{track.video.failReason}</p>}{track.video.videoUrl && <video src={track.video.videoUrl} poster={track.video.coverUrl || music.imageUrl} controls playsInline />}</div>}
            </article>)}</div>
          </section>}

          {!music.tracks?.length && music.video && <section className={`music-detail-section music-video-single is-${music.video.status.key}`}>
            <div className="music-detail-section-head"><div><span>MUSIC VIDEO</span><h2>音乐视频</h2></div><em>{music.video.status.label}</em></div>
            {music.video.failReason && <div className="music-detail-error">{music.video.failReason}</div>}
            {music.video.videoUrl && <video src={music.video.videoUrl} poster={music.video.coverUrl || music.imageUrl} controls playsInline />}
          </section>}

          <section className="music-detail-section music-prompt-section"><div className="music-detail-section-head"><div><span>CREATIVE BRIEF</span><h2>创作描述</h2></div></div><p>{music.prompt || '暂无创作描述'}</p></section>
        </> : <div className="music-detail-state"><Music2 size={36} /><strong>没有找到音乐详情</strong><button className="primary-button" onClick={() => setView('list')}>返回我的音乐</button></div>}
      </div>
    );
  }

  if (view === 'create') {
    const selectedVoice = voices.find((voice) => voice.voiceId === form.voiceId);
    return (
      <div className="music-create-page">
        <header className="music-create-header">
          <button className="outline-button" onClick={() => { setView('list'); setMessage(''); }}>返回音乐列表</button>
          <div><span>MUSIC CREATOR</span><h1>音乐制作</h1><p>描述想法、写入歌词或选择纯音乐，生成可直接试听的 AI 音乐。</p></div>
          <div className="music-create-tools">
            <button onClick={onOpenLyrics}><Edit3 size={16} />AI 写歌词</button>
            <span><Music2 size={16} />剩余 {musicRemaining === null ? '--' : musicRemaining} 次</span>
          </div>
        </header>

        <nav className="music-source-grid" aria-label="音乐创作方式">
          <button className={inputType === 'prompt' ? 'is-active' : ''} onClick={() => selectSource('prompt')}><Sparkles size={20} /><strong>描述生成</strong><small>用一句话说明想法</small></button>
          <button className={inputType === 'lyrics' && !form.voiceId ? 'is-active' : ''} onClick={() => { selectSource('lyrics'); updateForm('voiceId', ''); }}><Edit3 size={20} /><strong>歌词歌曲</strong><small>精确控制歌词与风格</small></button>
          <button className={inputType === 'lyrics' && Boolean(form.voiceId) ? 'is-active' : ''} onClick={() => selectSource('voice')}><Mic2 size={20} /><strong>我的声音</strong><small>{selectedVoice ? selectedVoice.name : '使用自建音色'}</small></button>
          <button className={inputType === 'instrumental' ? 'is-active' : ''} onClick={() => selectSource('instrumental')}><Music2 size={20} /><strong>纯音乐</strong><small>不含人声的配乐</small></button>
        </nav>

        <div className="music-create-layout">
          <section className="music-form-panel">
            <div className="music-panel-head"><span>01</span><div><strong>填写创作内容</strong><small>{isPrompt ? '最多 500 字' : isInstrumental ? '标题必填，描述可选' : '标题与歌词必填'}</small></div></div>
            {!isPrompt && <label className="music-field"><span>歌曲标题</span><input value={form.title} maxLength={80} onChange={(event) => updateForm('title', event.target.value)} placeholder="例如：下班以后" /></label>}
            {isPrompt ? (
              <label className="music-field music-field--textarea"><span>描述你想要的歌</span><textarea value={form.prompt} maxLength={500} onChange={(event) => updateForm('prompt', event.target.value)} placeholder="例如：一首温柔的华语流行歌，关于夜晚下班路上的释怀…" /><small>{form.prompt.length}/500</small></label>
            ) : isInstrumental ? (
              <label className="music-field music-field--textarea"><span>画面、节奏与乐器 <em>可选</em></span><textarea value={form.prompt} maxLength={500} onChange={(event) => updateForm('prompt', event.target.value)} placeholder="例如：日落海岸，慢速钢琴与弦乐，后半段逐渐明亮" /><small>{form.prompt.length}/500</small></label>
            ) : (
              <><label className="music-field music-field--textarea"><span>歌词</span><textarea className="is-lyrics" value={form.lyrics} maxLength={4500} onChange={(event) => updateForm('lyrics', event.target.value)} placeholder={'[Verse]\n在这里写下歌词，一句一行\n\n[Chorus]\n副歌可以更抓耳'} /><small>{form.lyrics.length}/4500</small></label><div className="music-tag-row">{MUSIC_SECTION_TAGS.map(([label, tag]) => <button key={tag} onClick={() => appendSection(tag)}>{label}</button>)}</div></>
            )}
            {isPrompt && <div className="music-idea-row">{MUSIC_PROMPT_IDEAS.map((idea) => <button key={idea.label} onClick={() => updateForm('prompt', idea.text)}>{idea.label}</button>)}</div>}
          </section>

          {!isPrompt && <section className="music-form-panel">
            <div className="music-panel-head"><span>02</span><div><strong>设置风格与声音</strong><small>从预设开始，再补充细节</small></div></div>
            <div className="music-style-grid">{MUSIC_STYLES.map((style) => <button key={style.key} className={form.styleKey === style.key ? 'is-active' : ''} onClick={() => updateForm('styleKey', style.key)}><strong>{style.label}</strong><small>{style.desc}</small>{form.styleKey === style.key && <Check size={14} />}</button>)}</div>
            <label className="music-field music-field--textarea is-compact"><span>风格补充 <em>可选</em></span><textarea value={form.customStyle} maxLength={500} onChange={(event) => updateForm('customStyle', event.target.value)} placeholder="例如：钢琴、木吉他、女声、慢板" /></label>
            {!isInstrumental ? <>
              <label className="music-field"><span>生成声音</span><select value={form.voiceId} onChange={(event) => updateForm('voiceId', event.target.value)}><option value="">默认声音</option>{voices.map((voice) => <option key={voice.id} value={voice.voiceId}>{voice.name}</option>)}</select></label>
              <div className="music-choice-row"><span>人声性别</span>{[['自动', ''], ['男声', 'm'], ['女声', 'f']].map(([label, value]) => <button key={label} className={form.vocalGender === value ? 'is-active' : ''} onClick={() => updateForm('vocalGender', value)}>{label}</button>)}</div>
            </> : <div className="music-instrumental-note"><Music2 size={18} />纯音乐不使用人声或自建音色</div>}
            <label className="music-field"><span>排除风格 <em>可选</em></span><input value={form.negativeTags} maxLength={120} onChange={(event) => updateForm('negativeTags', event.target.value)} placeholder="例如：人声失真、噪声、低清" /></label>
          </section>}
        </div>
        {message && <div className={`music-message ${/权益|额度|次数|余额|insufficient/i.test(message) ? 'is-quota' : ''}`}><span>{message}</span>{/权益|额度|次数|余额|insufficient/i.test(message) && <button onClick={onOpenBilling}>查看套餐</button>}</div>}
        <div className="music-create-submit"><div><strong>{canGenerate ? '创作信息已完成' : '请补全必填内容'}</strong><span>提交后可在音乐列表查看进度</span></div><button className="primary-button" disabled={!canGenerate || submitting} onClick={submitMusic}><Sparkles size={17} /><span>{submitting ? '提交中…' : '开始创作'}</span></button></div>
      </div>
    );
  }

  return (
    <div className="music-studio-page">
      <header className="music-studio-hero">
        <div><span>MUSIC STUDIO</span><h1>我的音乐</h1><p>管理 AI 音乐任务，查看生成状态并直接试听成品。</p></div>
        <div className="music-hero-actions"><button className="outline-button" onClick={authed ? () => loadMusic({ nextPage: 1 }) : onLogin} disabled={loading}><Sparkles size={16} />{loading ? '同步中' : '刷新'}</button><button className="primary-button" onClick={openCreate}><Plus size={17} /><span>制作音乐</span></button></div>
      </header>
      {message && <div className="music-list-message">{message}</div>}
      <section className="music-library" aria-busy={loading}>
        {loading ? <div className="music-empty"><Music2 size={32} /><strong>音乐列表加载中</strong></div> : items.length ? (
          <div className="music-card-grid">{items.map((music, index) => <article className={`music-card is-${music.status.key}`} key={music.id}>
            <button className="music-card-cover" onClick={() => loadMusicDetail(music)} aria-label={`查看 ${music.title} 详情`}>{music.imageUrl ? <img src={music.imageUrl} alt="" loading="lazy" /> : <div className={`music-cover-art art-${index % 4}`}><span /><Music2 size={30} /></div>}<em className={`state-chip--${music.status.key}`}>{music.status.label}</em></button>
            <div className="music-card-body"><div><strong>{music.title}</strong><small>{[music.duration, music.createdAt].filter(Boolean).join(' · ') || music.taskId || 'AI 音乐'}</small></div>{music.prompt && <p>{music.prompt}</p>}{music.status.key === 'failed' && music.failReason && <div className="music-fail-reason">{music.failReason}</div>}{music.audioUrl ? <audio controls preload="none" src={music.audioUrl} /> : <div className="music-audio-pending"><Play size={15} />{music.status.key === 'failed' ? '暂无可试听音频' : '音频生成后可试听'}</div>}</div>
            <button className="music-card-detail" onClick={() => loadMusicDetail(music)}>查看详情<ChevronRight size={15} /></button>
          </article>)}</div>
        ) : <div className="music-empty"><Music2 size={38} /><strong>{authed ? '暂无 AI 音乐' : '登录后查看音乐'}</strong><span>{authed ? '从一句话、歌词或纯音乐开始创作' : '你的音乐和生成任务会显示在这里'}</span><button className="primary-button" onClick={authed ? openCreate : onLogin}><Plus size={16} /><span>{authed ? '制作音乐' : '登录'}</span></button></div>}
        {hasMore && <button className="load-more-button music-load-more" onClick={() => loadMusic({ nextPage: page + 1, append: true })} disabled={loadingMore}>{loadingMore ? '加载中…' : '加载更多'}</button>}
      </section>
    </div>
  );
}

function ImageStudioPage({ authVersion, onLogin, onUseForDigitalHuman, onOpenBilling, onOpenInfo }) {
  const [view, setView] = useState('list');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [usingImageId, setUsingImageId] = useState('');
  const [sceneMode, setSceneMode] = useState('template');
  const [sourceImage, setSourceImage] = useState(null);
  const [sceneImage, setSceneImage] = useState(null);
  const [selectedSceneId, setSelectedSceneId] = useState('');
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [templatePrompt, setTemplatePrompt] = useState('');
  const [scenePrompt, setScenePrompt] = useState(DEFAULT_IMAGE_SCENE_PROMPT);
  const [imageAgreement, setImageAgreement] = useState(false);
  const [generating, setGenerating] = useState(false);
  const authed = Boolean(getAccessToken());
  const selectedScene = IMAGE_GENERATION_SCENES.find((item) => item.id === selectedSceneId) || null;
  const selectedCamera = IMAGE_CAMERA_LANGUAGES.find((item) => item.id === selectedCameraId) || null;
  const canGenerate = Boolean(sourceImage && (sceneMode === 'template' ? selectedScene : sceneImage && textOf(scenePrompt)));

  const formatImageDate = (value) => {
    if (!value) return '';
    const numeric = Number(value);
    const date = new Date(Number.isFinite(numeric) && numeric > 0 && numeric < 1000000000000 ? numeric * 1000 : value);
    if (Number.isNaN(date.getTime())) return textOf(value);
    return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
  };
  const loadImages = async ({ nextPage = 1, append = false } = {}) => {
    if (!authed) {
      setImages([]);
      setHasMore(false);
      setMessage('');
      return;
    }
    append ? setLoadingMore(true) : setLoading(true);
    setMessage('');
    const result = await apiFetch('/api/image-generation/images', {
      params: { page: nextPage, page_size: PAGE_SIZE, pageSize: PAGE_SIZE, limit: PAGE_SIZE },
      timeoutMs: 10000,
    });
    if (result.ok) {
      const received = getImageGenerationItems(result).map(normalizeGeneratedImage);
      const known = new Set(images.map((item) => item.id));
      const unique = append ? received.filter((item) => !known.has(item.id)) : received;
      setImages(append ? images.concat(unique) : received);
      setHasMore(received.length >= PAGE_SIZE && (!append || unique.length > 0));
      setPage(nextPage);
    } else {
      setMessage(result.authMissing ? '' : getResultMessage(result, '生成图片列表获取失败'));
      if (!append) setImages([]);
      setHasMore(false);
    }
    append ? setLoadingMore(false) : setLoading(false);
  };

  useEffect(() => {
    loadImages({ nextPage: 1, append: false });
  }, [authVersion, authed]);

  useEffect(() => () => {
    if (sourceImage?.url) URL.revokeObjectURL(sourceImage.url);
  }, [sourceImage?.url]);

  useEffect(() => () => {
    if (sceneImage?.url) URL.revokeObjectURL(sceneImage.url);
  }, [sceneImage?.url]);

  const selectImageFile = async (event, kind) => {
    const file = event.target.files?.[0] || null;
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') && !IMAGE_EXTENSIONS.includes(getExtension(file.name))) {
      setMessage('图片仅支持 jpg / png / webp');
      return;
    }
    try {
      const info = await readMediaInfo(file, 'image');
      const picked = { file, url: URL.createObjectURL(file), name: file.name, size: file.size, width: info.width, height: info.height };
      if (kind === 'source') setSourceImage(picked);
      else setSceneImage(picked);
      setMessage('');
    } catch (error) {
      setMessage('图片读取失败，请重新选择');
    }
  };
  const buildPrompt = () => [
    sceneMode === 'template' ? selectedScene?.prompt : '',
    selectedCamera?.prompt,
    sceneMode === 'template' ? textOf(templatePrompt) : textOf(scenePrompt),
  ].filter(Boolean).join('；');
  const resetCreator = () => {
    setSourceImage(null);
    setSceneImage(null);
    setSceneMode('template');
    setSelectedSceneId('');
    setSelectedCameraId('');
    setTemplatePrompt('');
    setScenePrompt(DEFAULT_IMAGE_SCENE_PROMPT);
    setImageAgreement(false);
  };
  const submitGeneration = async () => {
    if (!authed) {
      onLogin();
      return;
    }
    if (!imageAgreement) {
      setMessage('请先阅读并同意形象信息采集与使用协议');
      return;
    }
    if (!canGenerate || generating) return;
    setGenerating(true);
    setMessage('正在上传图片并创建生成任务…');
    try {
      const sourceUploadPromise = uploadFile(sourceImage.file, { source: 'image-generation-source' });
      const sceneUploadPromise = sceneMode === 'upload' ? uploadFile(sceneImage.file, { source: 'image-generation-scene' }) : Promise.resolve(null);
      const [sourceResult, sceneResult] = await Promise.all([sourceUploadPromise, sceneUploadPromise]);
      if (!sourceResult.ok) throw new Error(getResultMessage(sourceResult, '本人照片上传失败'));
      if (sceneResult && !sceneResult.ok) throw new Error(getResultMessage(sceneResult, '场景图片上传失败'));
      const sourceImageUrl = getUploadedUrl(sourceResult);
      const sceneImageUrl = sceneResult ? getUploadedUrl(sceneResult) : '';
      if (!sourceImageUrl) throw new Error('本人照片上传后未返回可用地址');
      if (sceneMode === 'upload' && !sceneImageUrl) throw new Error('场景图片上传后未返回可用地址');
      const result = await apiFetch('/api/image-generation/create', {
        method: 'POST',
        timeoutMs: 30000,
        body: omitEmpty({
          sourceImageUrl,
          source_image_url: sourceImageUrl,
          imageUrl: sourceImageUrl,
          image_url: sourceImageUrl,
          prompt: buildPrompt(),
          sceneMode,
          scene_mode: sceneMode,
          scene: sceneMode === 'template' ? selectedScene?.id : 'custom',
          sceneId: sceneMode === 'template' ? selectedScene?.id : '',
          scene_id: sceneMode === 'template' ? selectedScene?.id : '',
          cameraLanguage: selectedCamera?.id,
          camera_language: selectedCamera?.id,
          cameraLanguageName: selectedCamera?.name,
          camera_language_name: selectedCamera?.name,
          cameraLanguagePrompt: selectedCamera?.prompt,
          camera_language_prompt: selectedCamera?.prompt,
          shot: selectedCamera?.id,
          shotType: selectedCamera?.id,
          shot_type: selectedCamera?.id,
          shotName: selectedCamera?.name,
          shot_name: selectedCamera?.name,
          shotPrompt: selectedCamera?.prompt,
          shot_prompt: selectedCamera?.prompt,
          sceneImageUrl,
          scene_image_url: sceneImageUrl,
          referenceImageUrl: sceneImageUrl,
          reference_image_url: sceneImageUrl,
        }),
      });
      if (!result.ok) {
        const quota = result.status === 403 || /权益|次数|额度|余额/.test(getResultMessage(result, ''));
        if (quota) {
          setMessage('图片生成需要视频权益，当前权益不足。');
          return;
        }
        throw new Error(getResultMessage(result, '图片生成任务创建失败'));
      }
      resetCreator();
      setView('list');
      await loadImages({ nextPage: 1, append: false });
      setMessage('生成任务已提交，可在列表查看进度。');
    } catch (error) {
      setMessage(error.message || '图片生成失败，请重试');
    } finally {
      setGenerating(false);
    }
  };
  const useForDigitalHuman = async (image) => {
    if (!image?.id || image.status.key !== 'success' || !image.url || usingImageId) return;
    setUsingImageId(image.id);
    let selected = image;
    const detail = await apiFetch(`/api/image-generation/images/${encodeURIComponent(image.id)}`, { timeoutMs: 8000 });
    if (detail.ok) {
      const detailItems = getImageGenerationItems(detail);
      selected = normalizeGeneratedImage(detailItems[0] || detail.data || detail.raw, 0);
    }
    setUsingImageId('');
    if (!selected.url) {
      setMessage('图片仍在生成中，请稍后刷新');
      return;
    }
    onUseForDigitalHuman(selected);
  };

  if (view === 'create') {
    return (
      <div className="image-create-page">
        <header className="image-create-header">
          <button className="outline-button" onClick={() => { setView('list'); setMessage(''); }}>返回图片列表</button>
          <div>
            <h1>制作图片</h1>
            <p>上传本人照片，选择场景或上传参考场景，生成可继续制作数字人的新形象。</p>
          </div>
        </header>
        <div className="image-consent-notice">
          <label><input type="checkbox" checked={imageAgreement} onChange={(event) => setImageAgreement(event.target.checked)} /><span>我已阅读并同意</span></label>
          <button onClick={() => onOpenInfo('legal-image')}>《形象信息采集与使用协议》</button>
        </div>
        <div className="image-create-layout">
          <section className="image-create-panel image-source-panel">
            <div className="image-panel-title"><span>01</span><div><strong>上传本人照片</strong><small>支持 jpg / png / webp</small></div></div>
            {sourceImage ? (
              <div className="image-upload-preview">
                <img src={sourceImage.url} alt="本人照片预览" />
                <div><span>{sourceImage.width}×{sourceImage.height} · {formatFileSize(sourceImage.size)}</span><button onClick={() => setSourceImage(null)}><Trash2 size={15} />删除</button></div>
              </div>
            ) : (
              <label className="image-upload-empty"><Image size={34} /><strong>添加本人照片</strong><span>建议正脸清晰、光线均匀</span><input type="file" accept="image/jpeg,image/png,image/webp,image/*" onChange={(event) => selectImageFile(event, 'source')} /></label>
            )}
            {sourceImage && <label className="image-replace-button"><Upload size={15} />重新上传<input type="file" accept="image/jpeg,image/png,image/webp,image/*" onChange={(event) => selectImageFile(event, 'source')} /></label>}
          </section>
          <section className="image-create-panel image-scene-panel">
            <div className="image-panel-title"><span>02</span><div><strong>设置生成场景</strong><small>选择平台模板，或上传自己的场景图</small></div></div>
            <div className="image-mode-tabs">
              <button className={sceneMode === 'template' ? 'is-active' : ''} onClick={() => setSceneMode('template')}>场景模板</button>
              <button className={sceneMode === 'upload' ? 'is-active' : ''} onClick={() => setSceneMode('upload')}>上传场景图</button>
            </div>
            {sceneMode === 'template' ? (
              <div className="image-scene-grid">
                {IMAGE_GENERATION_SCENES.map((scene) => <button key={scene.id} className={selectedSceneId === scene.id ? 'is-active' : ''} onClick={() => setSelectedSceneId(selectedSceneId === scene.id ? '' : scene.id)}><strong>{scene.name}</strong><small>{scene.desc}</small>{selectedSceneId === scene.id && <Check size={15} />}</button>)}
              </div>
            ) : sceneImage ? (
              <div className="image-upload-preview image-scene-preview">
                <img src={sceneImage.url} alt="场景图片预览" />
                <div><span>{sceneImage.width}×{sceneImage.height} · {formatFileSize(sceneImage.size)}</span><button onClick={() => setSceneImage(null)}><Trash2 size={15} />删除</button></div>
              </div>
            ) : (
              <label className="image-upload-empty image-scene-empty"><Upload size={32} /><strong>上传场景图片</strong><span>选择希望人物出现的环境或背景</span><input type="file" accept="image/jpeg,image/png,image/webp,image/*" onChange={(event) => selectImageFile(event, 'scene')} /></label>
            )}
            {sceneMode === 'upload' && sceneImage && <label className="image-replace-button"><Upload size={15} />更换场景图<input type="file" accept="image/jpeg,image/png,image/webp,image/*" onChange={(event) => selectImageFile(event, 'scene')} /></label>}
            <div className="image-field-head"><strong>镜头语言 <em>可选</em></strong><span>再次点击已选项可取消</span></div>
            <div className="image-shot-grid">
              {IMAGE_CAMERA_LANGUAGES.map((camera) => <button key={camera.id} className={selectedCameraId === camera.id ? 'is-active' : ''} onClick={() => setSelectedCameraId(selectedCameraId === camera.id ? '' : camera.id)}><strong>{camera.name}</strong><small>{camera.desc}</small></button>)}
            </div>
            <label className="image-prompt-field">
              <span>{sceneMode === 'template' ? '自定义指令（可选）' : '自定义指令（必填）'}</span>
              <textarea value={sceneMode === 'template' ? templatePrompt : scenePrompt} maxLength={500} onChange={(event) => sceneMode === 'template' ? setTemplatePrompt(event.target.value) : setScenePrompt(event.target.value)} placeholder={sceneMode === 'template' ? '例如：人物看向镜头，保留右侧标题空间' : '说明人物如何融入场景'} />
              <small>{(sceneMode === 'template' ? templatePrompt : scenePrompt).length}/500</small>
            </label>
          </section>
        </div>
        {message && <div className={`image-form-message ${/权益不足/.test(message) ? 'is-quota' : ''}`}><span>{message}</span>{/权益不足/.test(message) && <button onClick={onOpenBilling}>查看套餐</button>}</div>}
        <div className="image-create-submit"><div><strong>{canGenerate && imageAgreement ? '配置已完成' : canGenerate ? '请确认形象信息采集协议' : '请完成照片和场景设置'}</strong><span>提交后可回到列表查看生成状态</span></div><button className="primary-button" disabled={!canGenerate || !imageAgreement || generating} onClick={submitGeneration}><Sparkles size={17} /><span>{generating ? '提交中…' : '开始生成'}</span></button></div>
      </div>
    );
  }

  return (
    <div className="image-studio-page">
      <header className="image-studio-hero">
        <div><span>IMAGE STUDIO</span><h1>生成图片</h1><p>管理 AI 生成形象，查看生成状态，并将满意的图片继续制作成数字人。</p></div>
        <div className="image-hero-actions"><button className="outline-button" onClick={authed ? () => loadImages({ nextPage: 1 }) : onLogin} disabled={loading}><Sparkles size={16} />{loading ? '同步中' : '刷新'}</button><button className="primary-button" onClick={authed ? () => { setMessage(''); setView('create'); } : onLogin}><Plus size={17} /><span>制作图片</span></button></div>
      </header>
      {message && <div className="image-list-message">{message}</div>}
      <section className="generated-image-wrap" aria-busy={loading}>
        {loading ? <div className="generated-image-state"><Sparkles size={28} /><strong>图片列表加载中</strong></div> : images.length ? (
          <div className="generated-image-grid">
            {images.map((image) => (
              <article className={`generated-image-card is-${image.status.key}`} key={image.id}>
                <button className="generated-image-media" onClick={() => image.url && setPreview(image)} disabled={!image.url}>
                  {image.url ? <img src={image.url} alt={image.title} /> : <span><Image size={28} /><strong>{image.status.label}</strong></span>}
                  <em className={`state-chip--${image.status.key}`}>{image.status.label}</em>
                </button>
                <div className="generated-image-body"><strong>{image.title}</strong>{image.prompt && <p>{image.prompt}</p>}<small>{formatImageDate(image.createdAt) || 'AI 形象图'}</small></div>
                <button className="generated-image-action" disabled={image.status.key !== 'success' || usingImageId === image.id} onClick={() => useForDigitalHuman(image)}>{usingImageId === image.id ? '读取中…' : '制作数字人'}<ChevronRight size={15} /></button>
              </article>
            ))}
          </div>
        ) : <div className="generated-image-state"><Image size={34} /><strong>{authed ? '暂无生成图片' : '登录后查看生成图片'}</strong><span>{authed ? '制作第一张 AI 场景形象图' : '你的图片和生成任务会显示在这里'}</span><button className="primary-button" onClick={authed ? () => setView('create') : onLogin}><Plus size={16} /><span>{authed ? '制作图片' : '登录'}</span></button></div>}
        {hasMore && <button className="load-more-button image-load-more" onClick={() => loadImages({ nextPage: page + 1, append: true })} disabled={loadingMore}>{loadingMore ? '加载中…' : '加载更多'}</button>}
      </section>
      {preview && <div className="image-preview-layer" role="dialog" aria-modal="true" aria-label="生成图片预览" onClick={() => setPreview(null)}><div className="image-preview-card" onClick={(event) => event.stopPropagation()}><button className="image-preview-close" onClick={() => setPreview(null)} aria-label="关闭"><X size={18} /></button><img src={preview.url} alt={preview.title} /><div><strong>{preview.title}</strong>{preview.prompt && <p>{preview.prompt}</p>}<button className="primary-button" onClick={() => useForDigitalHuman(preview)}><Sparkles size={16} /><span>制作数字人</span></button></div></div></div>}
    </div>
  );
}

const getCommonAssetSid = (result = {}) => pick(
  result.data?.sid,
  result.data?.next_sid,
  result.data?.nextSid,
  result.raw?.data?.data?.sid,
  result.raw?.data?.sid,
  result.raw?.sid,
);

function AssetLibraryPanel({
  activeTab, onTabChange, query, onQueryChange, humans, voices, commonHumans, commonVoices,
  authed, loading, message, commonHumanHasMore, loadingMoreCommonHumans,
  onLoadMoreCommonHumans, onLogin, onRefresh, onUseAsset,
}) {
  const tabs = [
    ['mine-human', '我的形象', humans.length],
    ['public-human', '公共形象', commonHumans.length],
    ['mine-voice', '我的声音', voices.length],
    ['public-voice', '公共声音', commonVoices.length],
  ];
  const isPublic = activeTab.startsWith('public-');
  const isVoice = activeTab.endsWith('-voice');
  const assets = activeTab === 'public-human' ? commonHumans : activeTab === 'mine-human' ? humans : activeTab === 'public-voice' ? commonVoices : voices;
  const keyword = query.trim().toLowerCase();
  const visibleAssets = keyword ? assets.filter((asset) => `${asset.title} ${asset.meta}`.toLowerCase().includes(keyword)) : assets;

  return (
    <section className="asset-library-panel">
      <header className="asset-library-head">
        <div><span>ASSET LIBRARY</span><h2>{isPublic ? '公共素材库' : '我的资产'}</h2><p>{isPublic ? '平台提供的通用数字人形象与声音，可直接用于视频创作。' : '查看你已训练的数字人形象和克隆声音。'}</p></div>
        <button className="asset-library-refresh" onClick={authed ? onRefresh : onLogin} disabled={loading}><RefreshCw className={loading ? 'is-spinning' : ''} size={16} />{loading ? '同步中' : '同步素材'}</button>
      </header>
      <div className="asset-library-toolbar">
        <div className="asset-library-tabs" role="tablist" aria-label="资产库分类">
          {tabs.map(([id, label, count]) => <button key={id} role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'is-active' : ''} onClick={() => onTabChange(id)}><span>{label}</span><em>{count}</em></button>)}
        </div>
        <label className="asset-library-search"><Search size={16} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={isVoice ? '搜索声音名称或语种' : '搜索形象名称'} /></label>
      </div>
      {message && isPublic && <div className="asset-library-message">{message}</div>}
      {!authed ? (
        <div className="asset-library-empty"><Library size={34} /><strong>登录后查看资产库</strong><p>公共形象、公共声音和你的个人资产会集中展示在这里。</p><button className="primary-button" onClick={onLogin}>去登录</button></div>
      ) : loading && !assets.length ? (
        <div className="asset-library-empty"><RefreshCw className="is-spinning" size={30} /><strong>正在同步素材库</strong></div>
      ) : visibleAssets.length ? (
        <>
          <div className={`asset-library-grid ${isVoice ? 'is-voice' : 'is-human'}`}>
            {visibleAssets.map((asset, index) => isVoice ? (
              <article className="library-voice-card" key={`${activeTab}-${asset.id}-${index}`}>
                <div className="library-voice-card__head">
                  <span className="library-voice-avatar">{asset.cover ? <img src={asset.cover} alt="" loading="lazy" /> : <Mic2 size={21} />}</span>
                  <span><strong>{asset.title}</strong><small>{asset.meta || '通用声音'}</small></span>
                  <em>{isPublic ? '公共' : asset.status.label}</em>
                </div>
                {asset.audioUrl ? <audio controls preload="none" src={asset.audioUrl} /> : <div className="library-audio-empty">暂无试听音频</div>}
                <button onClick={() => onUseAsset(asset, 'voice')}>用于视频创作<ChevronRight size={15} /></button>
              </article>
            ) : (
              <article className="library-human-card" key={`${activeTab}-${asset.id}-${index}`}>
                <span className="library-human-media">{asset.cover ? <img src={asset.cover} alt={asset.title} loading="lazy" /> : <UserRound size={34} />}{isPublic && <em>公共形象</em>}</span>
                <div><strong>{asset.title}</strong><small>{asset.meta || '数字人形象'}</small></div>
                <button onClick={() => onUseAsset(asset, 'human')}>用于视频创作<ChevronRight size={15} /></button>
              </article>
            ))}
          </div>
          {activeTab === 'public-human' && commonHumanHasMore && <button className="asset-library-more" onClick={onLoadMoreCommonHumans} disabled={loadingMoreCommonHumans}>{loadingMoreCommonHumans ? '加载中…' : '加载更多公共形象'}</button>}
        </>
      ) : (
        <div className="asset-library-empty"><Library size={32} /><strong>{keyword ? '没有匹配的素材' : isVoice ? '暂无声音素材' : '暂无形象素材'}</strong><p>{keyword ? '换一个关键词试试。' : isPublic ? '公共素材上线后会自动显示。' : '可以切换到“创建资产”开始训练。'}</p></div>
      )}
    </section>
  );
}

function AssetStudioPage({ authVersion, language, onLogin, onOpenInfo, onUseAsset, initialImageId = '', initialMode = '' }) {
  const [view, setView] = useState(initialImageId ? 'create' : 'library');
  const [mode, setMode] = useState(initialMode || (initialImageId ? 'image' : 'video'));
  const [libraryTab, setLibraryTab] = useState(initialMode === 'voice' ? 'public-voice' : 'public-human');
  const [libraryQuery, setLibraryQuery] = useState('');
  const [humans, setHumans] = useState([]);
  const [voices, setVoices] = useState([]);
  const [commonHumans, setCommonHumans] = useState([]);
  const [commonVoices, setCommonVoices] = useState([]);
  const [commonHumanSid, setCommonHumanSid] = useState('');
  const [commonHumanHasMore, setCommonHumanHasMore] = useState(false);
  const [loadingMoreCommonHumans, setLoadingMoreCommonHumans] = useState(false);
  const [publicAssetMessage, setPublicAssetMessage] = useState('');
  const [images, setImages] = useState([]);
  const [authVideos, setAuthVideos] = useState([]);
  const [selectedAuthKey, setSelectedAuthKey] = useState('');
  const [selectedImageId, setSelectedImageId] = useState('');
  const [form, setForm] = useState({ name: '', profileVideo: null, authVideo: null });
  const [voiceForm, setVoiceForm] = useState({ name: '', language: 'zh-CN', audio: null, agreement: false });
  const [profileAgreement, setProfileAgreement] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const recorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const recordingStartedAtRef = useRef(0);
  const authed = Boolean(getAccessToken());
  const localeCatalog = useLocaleCatalog(language);
  const selectedAuthVideo = authVideos.find((item) => item.key === selectedAuthKey) || null;
  const selectedImage = images.find((item) => item.id === selectedImageId) || null;
  const authorizationTemplate = 'My name is {{name}}. I authorize Kali to use my likeness and voice from this authorization video to generate a custom digital human and voice for me, and to use them in my Kali account for content creation.';
  const authorizationLines = [
    translateStatic(authorizationTemplate, language, localeCatalog).replaceAll('{{name}}', textOf(form.name) || 'XXX'),
  ];
  const authorizationText = authorizationLines.join('\n');
  const uploadedAuthText = authorizationText.toLowerCase().includes('kaili') ? authorizationText : `${authorizationText}\nkaili`;

  const loadAssets = async () => {
    setLoading(true);
    setPublicAssetMessage('');
    const [humanResult, commonHumanResult, authResult, imageResult, voiceResult, commonVoiceResult] = await Promise.all([
      apiFetch('/api/aihuman/list', { params: { page: 1, page_size: PAGE_SIZE, pageSize: PAGE_SIZE, limit: PAGE_SIZE } }),
      apiFetch('/api/aihuman/common-list', { params: { page: 1, page_size: 50, pageSize: 50 }, timeoutMs: 30000 }),
      apiFetch('/api/aihuman/auth-videos', { timeoutMs: 8000 }),
      apiFetch('/api/image-generation/images', { params: { page: 1, page_size: PAGE_SIZE, pageSize: PAGE_SIZE, limit: PAGE_SIZE } }),
      apiFetch('/api/ai-voice/list', { params: { page: 1, page_size: 50, pageSize: 50, limit: 50 } }),
      apiFetch('/api/ai-voice/common-list', { params: { page: 1, page_size: 50, pageSize: 50 }, timeoutMs: 30000 }),
    ]);
    const nextHumans = toList(humanResult.data).map(normalizeHuman);
    const nextCommonHumans = toList(commonHumanResult.data).map((item, index) => ({ ...normalizeHuman(item, index), scope: 'public' }));
    const library = getAuthVideoLibrary(authResult);
    const nextImages = getImageGenerationItems(imageResult).map(normalizeGeneratedImage).filter((item) => item.url);
    const nextCommonVoices = getVoiceItems(commonVoiceResult).map((item, index) => ({ ...normalizeVoiceAsset(item, index), scope: 'public' }));
    const nextSid = getCommonAssetSid(commonHumanResult);

    setHumans(nextHumans);
    setVoices(getVoiceItems(voiceResult).map(normalizeVoiceAsset));
    setCommonHumans(nextCommonHumans);
    setCommonVoices(nextCommonVoices);
    setCommonHumanSid(nextSid);
    setCommonHumanHasMore(Boolean(commonHumanResult.ok && nextSid && nextCommonHumans.length));
    if (!commonHumanResult.ok || !commonVoiceResult.ok) {
      const failed = [!commonHumanResult.ok ? '公共形象' : '', !commonVoiceResult.ok ? '公共声音' : ''].filter(Boolean).join('、');
      setPublicAssetMessage(`${failed}暂时加载失败，可点击“同步素材”重试。`);
    }
    setAuthVideos(library.videos);
    setSelectedAuthKey((current) => current || library.selected?.key || library.videos[0]?.key || '');
    setImages(nextImages);
    setSelectedImageId((current) => {
      if (current && nextImages.some((item) => item.id === current)) return current;
      if (initialImageId && nextImages.some((item) => item.id === initialImageId)) return initialImageId;
      return nextImages[0]?.id || '';
    });
    setLoading(false);
  };

  const loadMoreCommonHumanAssets = async () => {
    if (!authed || !commonHumanSid || loadingMoreCommonHumans) return;
    setLoadingMoreCommonHumans(true);
    setPublicAssetMessage('');
    const result = await apiFetch('/api/aihuman/common-list', {
      params: { page: 1, page_size: 50, pageSize: 50, sid: commonHumanSid },
      timeoutMs: 30000,
    });
    if (result.ok) {
      const received = toList(result.data).map((item, index) => ({ ...normalizeHuman(item, commonHumans.length + index), scope: 'public' }));
      const known = new Set(commonHumans.map((item) => `${item.id}`));
      const unique = received.filter((item) => !known.has(`${item.id}`));
      const nextSid = getCommonAssetSid(result);
      setCommonHumans((current) => current.concat(unique));
      setCommonHumanSid(nextSid);
      setCommonHumanHasMore(Boolean(nextSid && nextSid !== commonHumanSid && unique.length));
    } else {
      setPublicAssetMessage('公共形象加载失败，请稍后重试。');
    }
    setLoadingMoreCommonHumans(false);
  };

  useEffect(() => {
    if (authed) loadAssets();
    else {
      setHumans([]);
      setVoices([]);
      setCommonHumans([]);
      setCommonVoices([]);
      setCommonHumanSid('');
      setCommonHumanHasMore(false);
      setPublicAssetMessage('');
      setAuthVideos([]);
      setImages([]);
      setSelectedAuthKey('');
      setSelectedImageId('');
    }
  }, [authVersion]);

  useEffect(() => {
    if (!initialImageId) return;
    setView('create');
    setMode('image');
    setSelectedImageId(initialImageId);
  }, [initialImageId]);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setLibraryTab(initialMode === 'voice' ? 'mine-voice' : 'mine-human');
    }
  }, [initialMode]);

  useEffect(() => () => {
    window.clearInterval(recordingTimerRef.current);
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
    recorder?.stream?.getTracks().forEach((track) => track.stop());
  }, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateVoice = (key, value) => setVoiceForm((current) => ({ ...current, [key]: value }));
  const pickVideo = async (event, key) => {
    const file = event.target.files?.[0] || null;
    event.target.value = '';
    if (!file) return;
    if (!/^video\//.test(file.type) && !/\.(mp4|mov|m4v|3gp)$/i.test(file.name)) {
      setMessage('请上传 mp4 / mov / m4v / 3gp 视频文件');
      return;
    }
    const duration = await getVideoDuration(file);
    if (duration && duration > MAX_TRAINING_VIDEO_DURATION) {
      setMessage('训练视频不能超过 2 分钟');
      return;
    }
    update(key, { file, name: file.name, duration, size: file.size, url: URL.createObjectURL(file) });
    if (key === 'authVideo') setSelectedAuthKey('');
    setMessage('');
  };
  const setVoiceAudio = async (file, durationHint = 0) => {
    if (!file) return;
    if (!/^audio\//.test(file.type) && !/\.(mp3|wav|m4a|aac|webm|ogg)$/i.test(file.name)) {
      setMessage('请上传 mp3 / wav / m4a / aac 声音文件');
      return;
    }
    const duration = durationHint || await getAudioDuration(file);
    if (duration && duration > MAX_VOICE_DURATION) {
      setMessage('声音时长不能超过 2 分钟');
      return;
    }
    updateVoice('audio', { file, name: file.name, duration, size: file.size, url: URL.createObjectURL(file) });
    setMessage('');
  };
  const pickAudio = async (event) => {
    const file = event.target.files?.[0] || null;
    event.target.value = '';
    await setVoiceAudio(file);
  };
  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
  };
  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setMessage('当前浏览器不支持录音，请上传声音文件');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
        .find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, preferredMimeType ? { mimeType: preferredMimeType } : undefined);
      recordingChunksRef.current = [];
      recordingStartedAtRef.current = Date.now();
      recorder.ondataavailable = (event) => {
        if (event.data?.size) recordingChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const duration = Math.max(1, (Date.now() - recordingStartedAtRef.current) / 1000);
        const mimeType = recorder.mimeType || 'audio/webm';
        const extension = /mp4/.test(mimeType) ? 'm4a' : /ogg/.test(mimeType) ? 'ogg' : 'webm';
        const blob = new Blob(recordingChunksRef.current, { type: mimeType });
        const file = new File([blob], `voice-recording-${Date.now()}.${extension}`, { type: mimeType });
        stream.getTracks().forEach((track) => track.stop());
        window.clearInterval(recordingTimerRef.current);
        setIsRecording(false);
        setRecordingSeconds(0);
        recorderRef.current = null;
        await setVoiceAudio(file, duration);
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        const seconds = Math.floor((Date.now() - recordingStartedAtRef.current) / 1000);
        setRecordingSeconds(seconds);
        if (seconds >= MAX_VOICE_DURATION) stopRecording();
      }, 500);
      setMessage('');
    } catch (error) {
      setMessage(error?.name === 'NotAllowedError' ? '需要允许麦克风权限才能录音' : '录音启动失败，请改为上传声音文件');
    }
  };
  const uploadTrainingVideo = async (video, source) => {
    if (!video?.file) throw new Error('请先选择视频文件');
    const result = await uploadFile(video.file, { source });
    if (!result.ok) throw new Error(getResultMessage(result, '视频上传失败'));
    const url = getUploadedUrl(result);
    if (!url) throw new Error('视频上传未返回可用地址');
    return url;
  };
  const saveAuthVideo = async (authVideoUrl) => {
    const result = await apiFetch('/api/aihuman/auth-videos', {
      method: 'POST',
      body: { authVideoUrl, auth_video_url: authVideoUrl },
      timeoutMs: 12000,
    });
    if (!result.ok) throw new Error(getResultMessage(result, '授权视频保存失败'));
    return getAuthVideoId(result) || getAuthVideoId(result.raw) || getAuthVideoId(result.data);
  };
  const resolveAuthVideo = async () => {
    if (!form.authVideo?.file && selectedAuthVideo?.authorizationVideoId) {
      return {
        authorizationVideoId: selectedAuthVideo.authorizationVideoId,
        authVideoUrl: selectedAuthVideo.url,
        isUploadedAuthVideo: false,
      };
    }
    if (!form.authVideo?.file) throw new Error('请选择团队授权视频或上传新的授权视频');
    const url = await uploadTrainingVideo(form.authVideo, 'aihuman-auth-video');
    let authorizationVideoId = await saveAuthVideo(url);
    if (!authorizationVideoId) {
      const refreshed = await apiFetch('/api/aihuman/auth-videos', { timeoutMs: 8000 });
      const library = getAuthVideoLibrary(refreshed);
      const created = library.videos.find((item) => item.url === url) || library.selected;
      authorizationVideoId = created?.authorizationVideoId || '';
      setAuthVideos(library.videos);
      if (created?.key) setSelectedAuthKey(created.key);
    }
    if (!authorizationVideoId) throw new Error('授权视频缺少 ID，请重新选择或上传');
    return {
      authorizationVideoId,
      authVideoUrl: url,
      isUploadedAuthVideo: true,
    };
  };
  const submitVideoTraining = async () => {
    const name = textOf(form.name);
    if (!name) throw new Error('请输入数字人名称');
    if (!form.profileVideo?.file) throw new Error('请上传个人形象视频');
    if (!profileAgreement) throw new Error('请先同意数字人形象授权和形象信息采集协议');
    const videoUrl = await uploadTrainingVideo(form.profileVideo, 'aihuman-profile-video');
    const { authorizationVideoId, authVideoUrl, isUploadedAuthVideo } = await resolveAuthVideo();
    const payload = omitEmpty({
      name,
      custom_tag: name,
      customTag: name,
      video_url: videoUrl,
      videoUrl,
      video: videoUrl,
      authorizationVideoId,
      authorization_video_id: authorizationVideoId,
      auth_video_url: authVideoUrl,
      authVideoUrl,
      authorization_video_url: authVideoUrl,
      authorizationVideoUrl: authVideoUrl,
      authorization_text: authorizationText,
      authorizationText,
      ...(isUploadedAuthVideo ? { authText: uploadedAuthText } : {}),
    });
    const result = await apiFetch('/api/aihuman/train', {
      method: 'POST',
      timeoutMs: 20000,
      body: payload,
    });
    if (!result.ok) throw new Error(getResultMessage(result, '数字人训练提交失败'));
    return result;
  };
  const submitImageTraining = async () => {
    if (!selectedImage?.id) throw new Error('请选择 AI 形象图');
    if (!profileAgreement) throw new Error('请先同意数字人形象授权和形象信息采集协议');
    const { authorizationVideoId, authVideoUrl, isUploadedAuthVideo } = await resolveAuthVideo();
    const payload = omitEmpty({
      generatedImageId: selectedImage.id,
      generated_image_id: selectedImage.id,
      imageGenerationId: selectedImage.id,
      image_generation_id: selectedImage.id,
      authorizationVideoId,
      authorization_video_id: authorizationVideoId,
      auth_video_url: authVideoUrl,
      authVideoUrl: authVideoUrl,
      custom_tag: textOf(form.name),
      customTag: textOf(form.name),
      name: textOf(form.name),
      ...(isUploadedAuthVideo ? { authText: uploadedAuthText } : {}),
    });
    const result = await apiFetch('/api/aihuman/image/train', {
      method: 'POST',
      timeoutMs: 20000,
      body: payload,
    });
    if (!result.ok) throw new Error(getResultMessage(result, '图生数字人提交失败'));
    return result;
  };
  const submitVoiceTraining = async () => {
    if (!voiceForm.audio?.file) throw new Error('请录制或上传声音文件');
    if (!voiceForm.agreement) throw new Error('请先同意声纹授权协议');
    const uploadResult = await uploadFile(voiceForm.audio.file, { source: 'ai-voice-training' });
    if (!uploadResult.ok) throw new Error(getResultMessage(uploadResult, '声音上传失败'));
    const audioUrl = getUploadedUrl(uploadResult);
    if (!audioUrl) throw new Error('声音上传未返回可用地址');
    const fallbackName = voiceForm.audio.name.replace(/\.[^.]+$/, '');
    const voiceName = textOf(voiceForm.name) || fallbackName || '我的声音';
    const result = await apiFetch('/api/ai-voice/train', {
      method: 'POST',
      timeoutMs: 20000,
      body: {
        audio_url: audioUrl,
        audioUrl,
        audio_path: audioUrl,
        audioPath: audioUrl,
        audio: audioUrl,
        voice_url: audioUrl,
        voiceUrl: audioUrl,
        custom_tag: voiceName,
        customTag: voiceName,
        name: voiceName,
        voice_name: voiceName,
        voiceName,
        language: voiceForm.language,
        voiceprint_authorized: true,
        voiceprint_agreement: true,
      },
    });
    if (!result.ok) throw new Error(getResultMessage(result, '声音克隆提交失败'));
    return result;
  };
  const submitTraining = async () => {
    if (!authed) {
      onLogin();
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setMessage('');
    try {
      const result = mode === 'video' ? await submitVideoTraining() : mode === 'image' ? await submitImageTraining() : await submitVoiceTraining();
      const taskId = pick(result.data?.taskId, result.data?.task_id, result.data?.voiceId, result.data?.voice_id, result.data?.id, result.raw?.taskId, result.raw?.task_id, result.raw?.data?.taskId, result.raw?.data?.voiceId);
      const successText = mode === 'voice' ? '声音克隆已提交，完成后会出现在我的声音' : '训练已提交，完成后会出现在我的数字人';
      setMessage(taskId ? `训练已提交，任务 ${taskId}` : successText);
      setForm((current) => ({ ...current, profileVideo: null, authVideo: null }));
      if (mode === 'voice') setVoiceForm((current) => ({ ...current, name: '', audio: null, agreement: false }));
      else setProfileAgreement(false);
      await loadAssets();
    } catch (error) {
      setMessage(error.message || '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="asset-page">
      <section className={`asset-hero ${(view === 'library' ? libraryTab.endsWith('-voice') : mode === 'voice') ? 'is-voice' : ''}`}>
        <div>
          <h1>{view === 'library' ? 'Asset Library' : mode === 'voice' ? 'Voice Cloning' : 'Digital Human Asset Management'}</h1>
          <p>{view === 'library' ? '统一浏览我的资产与公共素材，预览形象、试听声音并直接带入视频创作。' : mode === 'voice' ? '录制或上传本人授权的清晰声音，训练可复用的多语种克隆声音。' : '把真人形象视频、AI 形象图和授权视频整理成可追踪的数字人训练流程。'}</p>
        </div>
        <div className="asset-hero-actions"><button className="outline-button" onClick={authed ? loadAssets : onLogin} disabled={loading}><RefreshCw className={loading ? 'is-spinning' : ''} size={17} /><span>{loading ? '同步中' : '同步资产'}</span></button><button className="primary-button" onClick={() => setView(view === 'library' ? 'create' : 'library')}>{view === 'library' ? <Plus size={17} /> : <Library size={17} />}<span>{view === 'library' ? '创建资产' : '返回资产库'}</span></button></div>
      </section>
      <div className="asset-view-tabs" role="tablist" aria-label="Asset Studio 页面"><button role="tab" aria-selected={view === 'library'} className={view === 'library' ? 'is-active' : ''} onClick={() => setView('library')}><Library size={17} />资产库</button><button role="tab" aria-selected={view === 'create'} className={view === 'create' ? 'is-active' : ''} onClick={() => setView('create')}><Plus size={17} />创建资产</button></div>
      {view === 'library' ? (
        <AssetLibraryPanel activeTab={libraryTab} onTabChange={(tab) => { setLibraryTab(tab); setLibraryQuery(''); }} query={libraryQuery} onQueryChange={setLibraryQuery} humans={humans} voices={voices} commonHumans={commonHumans} commonVoices={commonVoices} authed={authed} loading={loading} message={publicAssetMessage} commonHumanHasMore={commonHumanHasMore} loadingMoreCommonHumans={loadingMoreCommonHumans} onLoadMoreCommonHumans={loadMoreCommonHumanAssets} onLogin={onLogin} onRefresh={loadAssets} onUseAsset={onUseAsset} />
      ) : <>
      <section className="training-flow">
        {(mode === 'voice' ? ['准备声音', '选择语种', '确认声纹授权', '提交克隆'] : ['命名形象', '选择训练素材', '确认授权', '提交训练']).map((item, index) => (
          <article key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
          </article>
        ))}
      </section>
      <div className="asset-layout">
        <section className="training-panel">
          <div className="asset-tabs">
            <button className={mode === 'video' ? 'is-active' : ''} onClick={() => setMode('video')}>视频训练</button>
            <button className={mode === 'image' ? 'is-active' : ''} onClick={() => setMode('image')}>图生数字人</button>
            <button className={mode === 'voice' ? 'is-active' : ''} onClick={() => setMode('voice')}>声音克隆</button>
          </div>
          {mode === 'voice' ? (
            <>
              <div className="voice-requirements">
                <strong>录制要求</strong>
                <span>环境安静，无明显背景噪音</span>
                <span>使用正常语速和音量说话</span>
                <span>声音时长不超过 2 分钟</span>
              </div>
              <label className="training-field">
                <span>声音名称</span>
                <input value={voiceForm.name} onChange={(event) => updateVoice('name', event.target.value)} placeholder="例如：Ava 中文声音" />
              </label>
              <div className="voice-audio-panel">
                {voiceForm.audio ? (
                  <div className="voice-audio-file">
                    <span className="voice-audio-icon"><Mic2 size={22} /></span>
                    <span><strong>{voiceForm.audio.name}</strong><small>{voiceForm.audio.duration ? `时长 ${formatDuration(voiceForm.audio.duration)}` : formatFileSize(voiceForm.audio.size)}</small></span>
                    <button onClick={() => updateVoice('audio', null)} aria-label="删除声音"><Trash2 size={17} /></button>
                    <audio controls src={voiceForm.audio.url} />
                  </div>
                ) : (
                  <div className="voice-audio-empty"><Mic2 size={34} /><strong>{isRecording ? `正在录音 ${formatDuration(recordingSeconds)}` : '录制或上传声音文件'}</strong><small>最长 2:00，支持 mp3 / wav / m4a / aac</small></div>
                )}
                <div className="voice-audio-actions">
                  <button className={isRecording ? 'danger-button' : 'primary-button'} onClick={isRecording ? stopRecording : startRecording}><Mic2 size={16} /><span>{isRecording ? '停止录音' : '开始录音'}</span></button>
                  <label className={`outline-button ${isRecording ? 'is-disabled' : ''}`}><Upload size={16} /><span>上传文件</span><input type="file" accept="audio/mpeg,audio/wav,audio/mp4,audio/aac,audio/webm,audio/*" disabled={isRecording} onChange={pickAudio} /></label>
                </div>
              </div>
              <label className="training-field">
                <span>语种</span>
                <select value={voiceForm.language} onChange={(event) => updateVoice('language', event.target.value)}>{VOICE_LANGUAGE_OPTIONS.map((language) => <option key={language.value} value={language.value}>{language.label} · {language.value}</option>)}</select>
              </label>
              <div className="voice-consent">
                <label><input type="checkbox" checked={voiceForm.agreement} onChange={(event) => updateVoice('agreement', event.target.checked)} /><span>我已阅读并同意</span></label>
                <button className="consent-document-link" onClick={() => onOpenInfo('legal-voice')}>《声纹授权协议》</button>
                <details><summary>查看授权说明</summary><p>你确认提交的是本人声音，或已获得声音权利人合法、充分、可证明的授权。不得用于冒充、欺诈、侵权或其他违法场景。</p></details>
              </div>
            </>
          ) : (
            <>
              <label className="training-field">
                <span>数字人名称</span>
                <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="例如：品牌主理人 Ava" />
              </label>
              {mode === 'video' ? (
                <div className="training-upload-grid">
                  <label className="training-uploader"><UserRound size={28} /><strong>{form.profileVideo?.name || '上传个人形象视频'}</strong><small>清晰正脸，最长 2:00</small><input type="file" accept="video/mp4,video/quicktime,video/*" capture="user" onChange={(event) => pickVideo(event, 'profileVideo')} /></label>
                  <label className="training-uploader"><Video size={28} /><strong>{form.authVideo?.name || '上传新的授权视频'}</strong><small>可用团队视频替代</small><input type="file" accept="video/mp4,video/quicktime,video/*" capture="user" onChange={(event) => pickVideo(event, 'authVideo')} /></label>
                </div>
              ) : (
                <>
                  <div className="image-choice-grid">{images.length ? images.slice(0, 8).map((image) => <button key={image.id} className={`image-choice ${selectedImageId === image.id ? 'is-active' : ''}`} onClick={() => setSelectedImageId(image.id)}><img src={image.url} alt="" /><span>{image.title}</span></button>) : <div className="asset-empty">暂无可用 AI 形象图</div>}</div>
                  <label className="training-uploader training-uploader--wide"><Video size={28} /><strong>{form.authVideo?.name || '上传本次授权视频'}</strong><small>图片数字人必须绑定本人授权视频；也可从下方团队授权视频选择</small><input type="file" accept="video/mp4,video/quicktime,video/*" capture="user" onChange={(event) => pickVideo(event, 'authVideo')} /></label>
                </>
              )}
              <div className="auth-script"><strong>授权口播文案</strong>{authorizationLines.map((line) => <span key={line}>{line}</span>)}</div>
              <div className="profile-consent">
                <label><input type="checkbox" checked={profileAgreement} onChange={(event) => setProfileAgreement(event.target.checked)} /><span>我已阅读并单独同意以下专项协议</span></label>
                <span><button onClick={() => onOpenInfo('legal-avatar')}>《数字人形象授权协议》</button><button onClick={() => onOpenInfo('legal-image')}>《形象信息采集与使用协议》</button></span>
              </div>
              <div className="auth-video-picker">
                <div className="asset-section-head"><strong>团队授权视频</strong><span>{authVideos.length ? `${authVideos.length} 条可选` : '没有团队视频时可上传新视频'}</span></div>
                <div className="auth-video-list">{authVideos.map((video) => <button key={video.key} className={selectedAuthKey === video.key ? 'is-active' : ''} onClick={() => setSelectedAuthKey(video.key)}><Video size={16} /><span><strong>{video.name}</strong><small>{video.meta}</small></span>{selectedAuthKey === video.key && <Check size={16} />}</button>)}{!authVideos.length && <div className="asset-empty">暂无团队授权视频</div>}</div>
              </div>
            </>
          )}
          {message && <div className="form-message">{message}</div>}
          <button className="primary-button training-submit" onClick={submitTraining} disabled={submitting}>
            <Sparkles size={17} />
            <span>{submitting ? '提交中' : mode === 'video' ? '提交数字人训练' : mode === 'image' ? '提交图生数字人' : '提交声音克隆'}</span>
          </button>
        </section>
        <aside className="asset-side-panel">
          <div className="asset-section-head">
            <strong>{mode === 'voice' ? '我的声音' : '我的数字人'}</strong>
            <span>{mode === 'voice' ? voices.length : humans.length} 个</span>
          </div>
          {mode === 'voice' ? <div className="voice-list">
            {voices.length ? voices.slice(0, 12).map((voice) => <article key={voice.id} className="voice-card"><span className="voice-card__icon"><Mic2 size={20} /></span><span><strong>{voice.title}</strong><small>{voice.meta || '克隆声音'}</small></span><em className={`state-dot state-dot--${voice.status.key}`}>{voice.status.label}</em>{voice.audioUrl && <audio controls preload="none" src={voice.audioUrl} />}</article>) : <div className="asset-empty">{authed ? '暂无声音克隆记录' : '登录后查看克隆声音'}</div>}
          </div> : <div className="human-list">
            {humans.length ? humans.slice(0, 8).map((human) => (
              <article key={human.id} className="human-card">
                <span className="human-card__media">
                  {human.cover ? <img src={human.cover} alt="" /> : <UserRound size={24} />}
                </span>
                <span>
                  <strong>{human.title}</strong>
                  <small>{human.meta}</small>
                </span>
                <em className={`state-dot state-dot--${human.status.key}`}>{human.status.label}</em>
              </article>
            )) : (
              <div className="asset-empty">{authed ? '暂无数字人训练记录' : '登录后查看训练记录'}</div>
            )}
          </div>}
        </aside>
      </div>
      </>}
    </div>
  );
}

function EndpointBlock({ result, onLoadMore }) {
  const { endpoint, ok, authMissing, message, list } = result;
  const state = authMissing ? { key: 'locked', label: 'Sign in required' } : ok ? { key: 'success', label: `${list.length} items` } : { key: 'failed', label: message || 'Unavailable' };
  const sample = list.map(readableRecord);
  const handleScroll = (event) => {
    const element = event.currentTarget;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 40) onLoadMore(endpoint.label);
  };

  return (
    <article className={`endpoint-block ${ok ? 'is-ok' : ''}`}>
      <div className="endpoint-block__head">
        <div>
          <h3>{endpoint.label}</h3>
        </div>
        <span className={`state-chip state-chip--${state.key}`}>{state.label}</span>
      </div>
      <div className="endpoint-list" onScroll={handleScroll}>
        {sample.length ? (
          sample.map((item) => (
            <div className="endpoint-row" key={`${endpoint.label}-${item.title}-${item.meta}`}>
              <MediaPreview media={item.media} />
              <span className="endpoint-row__body">
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </span>
              <span className={`state-dot state-dot--${item.status.key}`}>{item.status.label}</span>
            </div>
          ))
        ) : (
          <div className="endpoint-empty">
            {authMissing ? 'Sign in to view this content.' : 'No content yet.'}
          </div>
        )}
        {result.hasMore && (
          <button className="load-more-button" onClick={() => onLoadMore(endpoint.label)} disabled={result.loadingMore}>
            {result.loadingMore ? 'Loading' : 'Load more'}
          </button>
        )}
      </div>
    </article>
  );
}

const VIDEO_PAGE_SIZE = 50;
const ASSIGNMENT_ADMIN_USER_ID = '1';
const ASSIGNMENT_ADMIN_TEAM_PHONE = '15921964590';

const formatLocalDateTimeInput = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getDefaultPublishAt = (delayMinutes = 5) => formatLocalDateTimeInput(new Date(Date.now() + delayMinutes * 60 * 1000));

const videoText = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
};

const videoObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

const getStoredUserInfo = () => {
  try {
    return videoObject(JSON.parse(window.localStorage.getItem('user_info') || '{}'));
  } catch {
    return {};
  }
};

const mergeUserInfo = (localInfo = {}, remoteInfo = {}) => {
  const local = videoObject(localInfo);
  const remote = videoObject(remoteInfo);
  return {
    ...local,
    ...remote,
    user: {
      ...videoObject(local.user || local.user_info || local.userInfo),
      ...videoObject(remote.user || remote.user_info || remote.userInfo),
    },
  };
};

const hasVideoAssignmentAccess = (data = {}) => {
  const source = videoObject(data);
  const user = videoObject(source.user || source.user_info || source.userInfo);
  const userId = videoText(source.id, source.userId, source.user_id, source.uid, user.id, user.userId, user.user_id, user.uid);
  const phone = videoText(
    source.teamPhone,
    source.team_phone,
    source.phoneNumber,
    source.phone_number,
    source.mobile,
    source.phone,
    source.purePhoneNumber,
    source.pure_phone_number,
    user.teamPhone,
    user.team_phone,
    user.phoneNumber,
    user.phone_number,
    user.mobile,
    user.phone,
    user.purePhoneNumber,
    user.pure_phone_number,
  );
  return userId === ASSIGNMENT_ADMIN_USER_ID && phone === ASSIGNMENT_ADMIN_TEAM_PHONE;
};

const videoFailureReason = (...values) => {
  for (const value of values) {
    if (!value) continue;
    if (typeof value === 'object') {
      const nested = videoFailureReason(
        value.failureReason,
        value.failure_reason,
        value.failReason,
        value.fail_reason,
        value.errorMessage,
        value.error_message,
        value.message,
        value.msg,
        value.detail,
        value.error,
      );
      if (nested) return nested;
      continue;
    }
    const text = String(value).trim();
    if (text && text !== '[object Object]') return text;
  }
  return '';
};

const getVideoRecords = (value, depth = 0) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object' || depth > 5) return [];
  for (const key of ['videos', 'video_list', 'videoList', 'accounts', 'account_list', 'publish_accounts', 'publishAccounts', 'teams', 'team_list', 'teamList', 'results', 'list', 'items', 'records', 'rows']) {
    if (Array.isArray(value[key])) return value[key];
  }
  for (const key of ['data', 'result', 'payload']) {
    const nested = getVideoRecords(value[key], depth + 1);
    if (nested.length) return nested;
  }
  return [];
};

const getVideoDetailRecord = (result = {}) => {
  const values = [result.data, result.raw?.data, result.raw];
  for (const value of values) {
    if (Array.isArray(value) && value.length && typeof value[0] === 'object') return value[0];
    const payload = videoObject(value);
    if (Array.isArray(payload.data) && payload.data.length && typeof payload.data[0] === 'object') return payload.data[0];
    const detail = payload.detail || payload.item || payload.record || payload.video;
    if (detail && typeof detail === 'object' && !Array.isArray(detail)) return detail;
    if (Object.keys(payload).length && !getVideoRecords(payload).length) return payload;
  }
  return {};
};

const getVideoStatusValue = (video = {}) =>
  videoText(
    video.rating,
    video.rating_status,
    video.resultStatus,
    video.result_status,
    video.generationStatus,
    video.generation_status,
    video.statusText,
    video.status_text,
    video.status,
    video.task_status,
    video.taskStatus,
    video.state,
    video.videoStatus,
    video.video_status,
    video.publishStatus,
    video.publish_status,
    video.draftStatus,
    video.draft_status,
    video.is_draft || video.draft ? 'draft' : '',
  );

const normalizeVideoRecord = (item = {}, index = 0) => {
  const response = videoObject(item.response);
  const detail = videoObject(item.detail);
  const video = { ...item, ...detail, ...response };
  const statusRaw = getVideoStatusValue(video);
  const status = normalizeStatus(statusRaw);
  const taskId = videoText(
    video.taskId,
    video.task_id,
    video.videoTaskId,
    video.video_task_id,
    video.virtualmanId,
    video.virtualman_id,
  );
  const id = videoText(video.id, video.videoId, video.video_id, video.draftId, video.draft_id, video.recordId, video.record_id, taskId, `video-${index}`);
  const videoUrl = getApiMediaUrl(
    videoText(
      video.videoUrl,
      video.video_url,
      video.result_url,
      video.resultUrl,
      video.output_url,
      video.outputUrl,
      video.download_url,
      video.downloadUrl,
      video.fileUrl,
      video.file_url,
      video.filepath,
      video.path,
      video.url,
    ),
  );
  const coverUrl = getApiMediaUrl(
    videoText(
      video.cover,
      video.coverUrl,
      video.cover_url,
      video.imageUrl,
      video.image_url,
      video.poster,
      video.posterUrl,
      video.poster_url,
      video.coverImage,
      video.cover_image,
    ),
  );
  const humanName = videoText(video.aiHumanName, video.ai_human_name, video.humanName, video.human_name, video.virtualmanName, video.virtualman_name);
  const voiceName = videoText(video.voiceName, video.voice_name, video.speakerName, video.speaker_name);
  const videoTemplateName = videoText(video.videoTemplateName, video.video_template_name, video.styleName, video.style_name);
  const coverTemplateName = videoText(video.coverTemplateName, video.cover_template_name);
  const creator = videoObject(video.creator || video.creator_user || video.creatorUser || video.user || video.user_info);
  const creatorName = videoText(video.creatorName, video.creator_name, creator.nickname, creator.nickName, creator.name, video.userName, video.user_name);
  const creatorPhone = videoText(video.creatorPhone, video.creator_phone, creator.phone, creator.mobile);
  const maskedPhone = creatorPhone.length >= 7 ? `${creatorPhone.slice(0, 3)}****${creatorPhone.slice(-4)}` : creatorPhone;
  const successful = status.key === 'success';

  return {
    id,
    publishId: videoText(video.publishId, video.publish_id, video.id, video.videoId, video.video_id, taskId),
    taskId,
    title: videoText(video.title, video.name, item.title) || `数字人口播视频 ${index + 1}`,
    topic: videoText(video.topic, video.tags, video.tag),
    script: videoText(video.script, video.content, video.text, item.desc),
    status,
    statusRaw,
    failureReason: status.key === 'failed' ? videoFailureReason(video, item) || '暂无失败原因' : '',
    videoUrl,
    coverUrl: coverUrl || (videoUrl ? getVideoFrameUrl(videoUrl) : ''),
    humanName,
    voiceName,
    videoTemplateName,
    coverTemplateName,
    createdAt: videoText(video.createTime, video.created_at, video.createdAt, video.created_time),
    creatorText: creatorName && maskedPhone ? `${creatorName}（${maskedPhone}）` : creatorName || maskedPhone,
    canPublish: successful && Boolean(videoUrl),
    canAssignTeam: successful && Boolean(videoUrl),
    canRemake: status.key === 'failed',
    canContinueDraft: status.key === 'draft',
    raw: video,
  };
};

const getVideoHasMore = (result, page, list) => {
  const payloads = [result.data, result.raw?.data, result.raw].map(videoObject);
  const explicit = payloads
    .map((payload) => (payload.has_more !== undefined ? payload.has_more : payload.hasMore))
    .find((value) => value !== undefined);
  if (explicit !== undefined) return Boolean(explicit);
  const total = Number(videoText(...payloads.flatMap((payload) => [payload.total, payload.count, payload.total_count, payload.totalCount]))) || 0;
  if (total) return page * VIDEO_PAGE_SIZE < total;
  return list.length >= VIDEO_PAGE_SIZE;
};

const normalizePublishAccount = (item, index) => {
  if (typeof item === 'string') return { id: `account-${index}`, name: item };
  return {
    id: videoText(item.publishAccountId, item.publish_account_id, item.accountId, item.account_id, item.userId, item.user_id, item.openId, item.open_id, item.aiHumanId, item.ai_human_id, item.humanId, item.human_id, item.virtualmanId, item.virtualman_id, item.id, `publish-account-${index}`),
    name: videoText(item.accountName, item.account_name, item.publishAccountName, item.publish_account_name, item.nickName, item.nickname, item.userName, item.username, item.displayName, item.display_name, item.platformName, item.platform_name, item.notionName, item.notion_name, item.douyinName, item.douyin_name, item.humanName, item.human_name, item.aiHumanName, item.ai_human_name, item.virtualmanName, item.virtualman_name, item.name, item.title, item.custom_tag),
  };
};

const normalizeAssignmentTeam = (item = {}, index = 0) => {
  const mainUser = videoObject(item.mainUser || item.main_user || item.owner || item.user);
  const phone = videoText(item.teamPhone, item.team_phone, item.phoneNumber, item.phone_number, item.mobile, item.phone);
  const mainUserId = videoText(item.mainUserId, item.main_user_id, item.ownerId, item.owner_id, item.userId, item.user_id, mainUser.id, mainUser.userId, mainUser.user_id);
  const name = videoText(item.teamName, item.team_name, item.teamTitle, item.team_title, item.mainUserName, item.main_user_name, item.nickname, item.realName, item.real_name, item.name, mainUser.nickname, mainUser.name) || `团队 ${index + 1}`;
  const benefit = Number(videoText(item.videoBenefit, item.video_benefit, item.videoRemaining, item.video_remaining, item.remaining, item.balance)) || 0;
  const flag = item.assignable !== undefined ? item.assignable : item.isAssignable !== undefined ? item.isAssignable : item.is_assignable;
  const assignable = flag === true || flag === 1 || ['1', 'true', 'yes', '可分配'].includes(String(flag || '').toLowerCase()) || (flag === undefined && benefit > 0);
  return { id: `${phone || 'team'}-${mainUserId || index}`, phone, mainUserId, name, benefit, assignable };
};

function VideoActionDialog({ title, description, children, busy, submitLabel, onClose, onSubmit }) {
  return (
    <div className="video-action-layer" role="dialog" aria-modal="true" aria-label={title}>
      <button className="video-action-layer__mask" aria-label="关闭" onClick={busy ? undefined : onClose} />
      <section className="video-action-dialog">
        <button className="video-action-dialog__close" onClick={onClose} disabled={busy} aria-label="关闭"><X size={18} /></button>
        <div className="video-action-dialog__head"><span>VIDEO WORKFLOW</span><h2>{title}</h2><p>{description}</p></div>
        <div className="video-action-dialog__body">{children}</div>
        <div className="video-action-dialog__footer">
          <button className="outline-button" onClick={onClose} disabled={busy}>取消</button>
          <button className="primary-button" onClick={onSubmit} disabled={busy}>{busy ? '提交中…' : submitLabel}</button>
        </div>
      </section>
    </div>
  );
}

function VideoStudioPage({ authVersion, onLogin, onNewVideo }) {
  const [studioSection, setStudioSection] = useState('oral');
  const [view, setView] = useState('list');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionMessage, setActionMessage] = useState('');
  const [publishDialog, setPublishDialog] = useState(false);
  const [publishAccounts, setPublishAccounts] = useState([]);
  const [publishAccountId, setPublishAccountId] = useState('');
  const [publishMode, setPublishMode] = useState('scheduled');
  const [publishAt, setPublishAt] = useState(() => getDefaultPublishAt());
  const [publishBusy, setPublishBusy] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const [assignDialog, setAssignDialog] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamQuery, setTeamQuery] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [assignBusy, setAssignBusy] = useState(false);
  const [assignMessage, setAssignMessage] = useState('');
  const [canAssignVideo, setCanAssignVideo] = useState(() => hasVideoAssignmentAccess(getStoredUserInfo()));
  const token = getAccessToken();
  const studioConfig = VIDEO_PRODUCTION_TYPES[studioSection] || VIDEO_PRODUCTION_TYPES.oral;
  const isMixedVideo = studioSection === 'mix';
  const isEndpointVideo = Boolean(studioConfig.endpoint);

  const loadVideos = async ({ nextPage = 1, append = false } = {}) => {
    append ? setLoadingMore(true) : setLoading(true);
    if (!append) setMessage('');
    const result = await apiFetch(studioConfig.listPath, {
      params: {
        page: nextPage,
        page_size: VIDEO_PAGE_SIZE,
        pageSize: VIDEO_PAGE_SIZE,
        ...(!isMixedVideo ? { scene: studioConfig.productionScene } : {}),
        ...(isEndpointVideo ? { endpoint: studioConfig.endpoint, productionType: studioConfig.key, production_type: studioConfig.key, templateScene: studioConfig.templateScene } : {}),
      },
      timeoutMs: 12000,
    });
    const source = getVideoRecords(result.data).length ? getVideoRecords(result.data) : getVideoRecords(result.raw);
    const records = source.map((item, index) => normalizeVideoRecord(item, (nextPage - 1) * VIDEO_PAGE_SIZE + index));
    if (result.ok) {
      setVideos((current) => (append ? current.concat(records) : records));
      setPage(nextPage);
      setHasMore(getVideoHasMore(result, nextPage, source));
    } else {
      if (!append) setVideos([]);
      setMessage(result.authMissing ? '' : getResultMessage(result, '视频制作列表获取失败'));
      setHasMore(false);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    loadVideos();
  }, [authVersion, studioSection]);

  const selectStudioSection = (section) => {
    if (section === studioSection) return;
    setStudioSection(section);
    setView('list');
    setSelectedVideo(null);
    setVideos([]);
    setPage(1);
    setHasMore(false);
    setQuery('');
    setStatusFilter('all');
    setMessage('');
  };

  useEffect(() => {
    let ignore = false;
    const localInfo = getStoredUserInfo();

    if (!token) {
      setCanAssignVideo(false);
      return undefined;
    }

    setCanAssignVideo(hasVideoAssignmentAccess(localInfo));
    apiFetch('/api/user/info', { timeoutMs: 10000 }).then((result) => {
      if (ignore || !result.ok) return;
      const userInfo = mergeUserInfo(localInfo, videoObject(result.data));
      window.localStorage.setItem('user_info', JSON.stringify(userInfo));
      setCanAssignVideo(hasVideoAssignmentAccess(userInfo));
    });

    return () => {
      ignore = true;
    };
  }, [authVersion, token]);

  const visibleVideos = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return videos.filter((video) => {
      const statusMatches = statusFilter === 'all' || video.status.key === statusFilter;
      const queryMatches = !keyword || [video.title, video.topic, video.script, video.humanName, video.voiceName, video.taskId].some((value) => String(value || '').toLowerCase().includes(keyword));
      return statusMatches && queryMatches;
    });
  }, [videos, query, statusFilter]);

  const openDetail = async (video, { refresh = false } = {}) => {
    setView('detail');
    setSelectedVideo(video);
    setDetailLoading(true);
    setActionMessage('');
    const detailId = video.publishId || video.id || video.taskId;
    const result = await apiFetch('/api/video-mix/detail', { params: { id: detailId }, timeoutMs: 12000 });
    if (result.ok) {
      const detail = getVideoDetailRecord(result);
      const normalized = normalizeVideoRecord({ ...video.raw, ...detail, id: detail.id || video.id, taskId: detail.taskId || detail.task_id || video.taskId, title: detail.title || video.title });
      setSelectedVideo(normalized);
      setVideos((current) => current.map((item) => (item.id === video.id ? normalized : item)));
      if (refresh) setActionMessage('详情已刷新');
    } else {
      setActionMessage(getResultMessage(result, '详情获取失败，当前显示列表中的记录'));
    }
    setDetailLoading(false);
  };

  const downloadVideo = (video) => {
    if (!video?.videoUrl) return;
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.download = `${video.title || 'video'}.mp4`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setActionMessage('已开始保存视频');
  };

  const remakeVideo = (video) => {
    const continuationId = video.canContinueDraft ? video.publishId || video.id : '';
    const draft = { ...(continuationId ? { draftRecordId: continuationId, id: continuationId } : {}), productionType: studioConfig.key, source: video.canContinueDraft ? 'videoDetailDraft' : 'videoDetailRemake', status: video.status.key, detail: video.raw, title: video.title, topic: video.topic, script: video.script, content: video.script, createdAt: Date.now() };
    window.localStorage.setItem(VIDEO_PREFILL_KEY, JSON.stringify(draft));
    onNewVideo({ prefill: true, productionType: studioConfig.key });
  };

  const openPublish = async () => {
    setPublishDialog(true);
    setActionMessage('');
    setPublishMessage('');
    setPublishMode('scheduled');
    setPublishAt(getDefaultPublishAt());
    const result = await apiFetch('/api/team-notion/publish-account', { timeoutMs: 10000 });
    const accountSource = getVideoRecords(result.data).length ? getVideoRecords(result.data) : getVideoRecords(result.raw);
    const accounts = accountSource.map(normalizePublishAccount).filter((item) => item.name);
    setPublishAccounts(accounts);
    setPublishAccountId((current) => accounts.some((account) => account.id === current) ? current : accounts[0]?.id || '');
    if (!result.ok) setPublishMessage(getResultMessage(result, '发布账号加载失败'));
  };

  const publishVideo = async () => {
    const account = publishAccounts.find((item) => item.id === publishAccountId);
    if (!account) { setPublishMessage('请选择发布账号'); return; }
    const isNow = publishMode === 'now';
    if (!isNow) {
      const scheduledAt = new Date(publishAt);
      if (!publishAt || Number.isNaN(scheduledAt.getTime())) { setPublishMessage('请选择发布时间'); return; }
      if (scheduledAt.getTime() <= Date.now()) { setPublishMessage('定时发布时间必须晚于当前时间'); return; }
    }
    const id = selectedVideo.publishId || selectedVideo.id || selectedVideo.taskId;
    if (!id) { setPublishMessage('视频 ID 不存在'); return; }
    const publishTime = (isNow ? getDefaultPublishAt(0) : publishAt).replace('T', ' ');
    setPublishBusy(true);
    setPublishMessage('');
    const result = await apiFetch('/api/team-notion/publish-video', {
      method: 'POST',
      body: { id, video_id: id, publish_account_id: account.id, publishAccountId: account.id, account_id: account.id, account_name: account.name, accountName: account.name, publish_time: publishTime, publishTime, publish_now: isNow, publishNow: isNow },
      timeoutMs: 15000,
    });
    setPublishBusy(false);
    if (result.ok) { setPublishDialog(false); setActionMessage('发布任务已提交'); }
    else setPublishMessage(getResultMessage(result, '发布失败'));
  };

  const loadTeams = async (keyword = '') => {
    setTeamsLoading(true);
    setAssignMessage('');
    const result = await apiFetch('/api/video/production/teams', { params: { page: 1, page_size: 50, ...(keyword.trim() ? { keyword: keyword.trim() } : {}) }, timeoutMs: 10000 });
    const nextTeams = getVideoRecords(result.data).map(normalizeAssignmentTeam).filter((item) => item.phone && item.mainUserId);
    setTeams(nextTeams);
    setTeamId((current) => nextTeams.some((item) => item.id === current) ? current : '');
    setTeamsLoading(false);
    if (!result.ok) setAssignMessage(getResultMessage(result, '团队列表加载失败'));
  };

  const openAssign = () => {
    if (!canAssignVideo) {
      setActionMessage('当前账号没有视频分配权限');
      return;
    }
    setAssignDialog(true);
    setActionMessage('');
    setAssignMessage('');
    setTeamQuery('');
    loadTeams();
  };

  const assignVideo = async () => {
    const team = teams.find((item) => item.id === teamId);
    if (!team) { setAssignMessage('请选择可分配的团队'); return; }
    setAssignBusy(true);
    setAssignMessage('');
    const videoId = selectedVideo.publishId || selectedVideo.id || selectedVideo.taskId;
    const numericId = /^\d+$/.test(String(videoId)) ? Number(videoId) : videoId;
    const numericUserId = /^\d+$/.test(String(team.mainUserId)) ? Number(team.mainUserId) : team.mainUserId;
    const result = await apiFetch('/api/video/production/assign-team', { method: 'POST', body: { videoId: numericId, targetTeamPhone: team.phone, targetMainUserId: numericUserId }, timeoutMs: 15000 });
    setAssignBusy(false);
    if (result.ok) {
      setAssignDialog(false);
      await loadVideos();
      setMessage('视频已分配');
      setView('list');
    } else {
      setAssignMessage(getResultMessage(result, '视频分配失败'));
    }
  };

  if (view === 'detail') {
    const video = selectedVideo;
    return (
      <div className="video-studio-page video-detail-page">
        <header className="video-detail-toolbar">
          <button className="video-back-button" onClick={() => { setView('list'); setActionMessage(''); }}><ArrowLeft size={18} />返回视频列表</button>
          <button className="video-refresh-button" onClick={() => openDetail(video, { refresh: true })} disabled={detailLoading}><RefreshCw size={16} />{detailLoading ? '刷新中…' : '刷新详情'}</button>
        </header>
        {video ? (
          <section className="video-detail-layout">
            <div className="video-detail-preview">
              {video.videoUrl ? <video src={video.videoUrl} poster={video.coverUrl} controls playsInline /> : video.coverUrl ? <img src={video.coverUrl} alt="" /> : <div className="video-detail-preview__empty"><Video size={42} /><strong>{detailLoading ? '正在读取视频' : '视频尚未生成'}</strong></div>}
            </div>
            <div className="video-detail-content">
              <div className="video-detail-title-row"><div><span>VIDEO DETAIL</span><h1>{video.title}</h1></div><em className={`state-chip--${video.status.key}`}>{video.status.label}</em></div>
              <div className="video-detail-actions">
                <button className="primary-button" disabled={!video.videoUrl} onClick={() => downloadVideo(video)}><Download size={16} />保存视频</button>
                {video.canPublish && <button className="outline-button" onClick={openPublish}><Send size={16} />发布</button>}
                {canAssignVideo && video.canAssignTeam && <button className="outline-button" onClick={openAssign}><UsersRound size={16} />分配</button>}
                {(video.canRemake || video.canContinueDraft) && <button className="outline-button" onClick={() => remakeVideo(video)}><RefreshCw size={16} />{video.canContinueDraft ? '继续制作' : '重新制作'}</button>}
              </div>
              {actionMessage && <div className="video-action-message">{actionMessage}</div>}
              <dl className="video-detail-info">
                <div><dt>话题</dt><dd>{video.topic || '-'}</dd></div>
                <div><dt>形象</dt><dd>{video.humanName || '-'}</dd></div>
                <div><dt>声音</dt><dd>{video.voiceName || '-'}</dd></div>
                <div><dt>视频包装模板</dt><dd>{video.videoTemplateName || '-'}</dd></div>
                <div><dt>视频封面模板</dt><dd>{video.coverTemplateName || '-'}</dd></div>
                {video.createdAt && <div><dt>创建时间</dt><dd>{video.createdAt}</dd></div>}
                {video.creatorText && <div><dt>创建人</dt><dd>{video.creatorText}</dd></div>}
                {video.taskId && <div><dt>任务 ID</dt><dd>{video.taskId}</dd></div>}
              </dl>
              {video.failureReason && <div className="video-failure"><strong>制作失败</strong><p>{video.failureReason}</p></div>}
              <section className="video-script-card"><span>VIDEO SCRIPT</span><h2>文案</h2><p>{video.script || '暂无文案'}</p></section>
            </div>
          </section>
        ) : <div className="video-empty-state"><Video size={38} /><strong>没有找到视频详情</strong><button className="primary-button" onClick={() => setView('list')}>返回视频列表</button></div>}
        {publishDialog && <VideoActionDialog title="发布设置" description={video?.title || '选择发布账号与时间'} busy={publishBusy} submitLabel="确认发布" onClose={() => setPublishDialog(false)} onSubmit={publishVideo}>
          <label className="video-dialog-field"><span>发布账号</span><select value={publishAccountId} onChange={(event) => { setPublishAccountId(event.target.value); setPublishMessage(''); }}><option value="">请选择发布账号</option>{publishAccounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select></label>
          {!publishAccounts.length && <div className="video-dialog-empty">暂无可用发布账号</div>}
          <div className="video-publish-modes"><button className={publishMode === 'scheduled' ? 'is-active' : ''} onClick={() => { setPublishMode('scheduled'); setPublishMessage(''); }}><CalendarDays size={17} />定时发布</button><button className={publishMode === 'now' ? 'is-active' : ''} onClick={() => { setPublishMode('now'); setPublishMessage(''); }}><Send size={17} />立即发布</button></div>
          {publishMode === 'scheduled' && <label className="video-dialog-field"><span>发布时间</span><input type="datetime-local" min={getDefaultPublishAt(1)} value={publishAt} onChange={(event) => { setPublishAt(event.target.value); setPublishMessage(''); }} /></label>}
          {publishMessage && <div className="video-dialog-message">{publishMessage}</div>}
        </VideoActionDialog>}
        {assignDialog && <VideoActionDialog title="分配到团队" description={video?.title || '选择接收视频的团队主账号'} busy={assignBusy} submitLabel="确认分配" onClose={() => setAssignDialog(false)} onSubmit={assignVideo}>
          <form className="video-team-search" onSubmit={(event) => { event.preventDefault(); loadTeams(teamQuery); }}><input value={teamQuery} onChange={(event) => setTeamQuery(event.target.value)} placeholder="搜索手机号、昵称或真实姓名" /><button type="submit" disabled={teamsLoading}><Search size={16} /></button></form>
          {assignMessage && <div className="video-dialog-message">{assignMessage}</div>}
          <div className="video-team-list">{teamsLoading ? <div className="video-dialog-empty">正在加载团队…</div> : teams.length ? teams.map((team) => <button key={team.id} disabled={!team.assignable} className={teamId === team.id ? 'is-active' : ''} onClick={() => setTeamId(team.id)}><span><strong>{team.name}</strong><small>主账号 ID {team.mainUserId}</small></span><em>权益 {team.benefit}<small>{team.assignable ? '可分配' : '不可分配'}</small></em></button>) : <div className="video-dialog-empty">暂无符合条件的团队</div>}</div>
          <p className="video-team-notice">分配成功后，视频归属目标团队，目标团队视频权益减少 1。</p>
        </VideoActionDialog>}
      </div>
    );
  }

  return (
    <div className="video-studio-page">
      <section className="video-studio-hero">
        <div><span>VIDEO STUDIO</span><h1>视频制作</h1><p>{studioConfig.description}</p></div>
        <button className="primary-button" onClick={() => onNewVideo({ productionType: studioConfig.key })}><Plus size={18} />{studioConfig.createLabel}</button>
      </section>
      <nav className="video-studio-sections" aria-label="视频制作板块">
        {Object.values(VIDEO_PRODUCTION_TYPES).map((section) => {
          const Icon = section.icon;
          return <button key={section.key} className={studioSection === section.key ? 'is-active' : ''} onClick={() => selectStudioSection(section.key)}><Icon size={18} /><span><strong>{section.label}</strong><small>{section.sectionHint}</small></span></button>;
        })}
      </nav>
      <section className="video-list-tools">
        <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、话题、形象或任务 ID" /></label>
        <div className="video-status-tabs">{[['all', '全部'], ['processing', '制作中'], ['success', '成功'], ['failed', '失败'], ['published', '已发布'], ['draft', '草稿']].map(([key, label]) => <button key={key} className={statusFilter === key ? 'is-active' : ''} onClick={() => setStatusFilter(key)}>{label}<em>{key === 'all' ? videos.length : videos.filter((video) => video.status.key === key).length}</em></button>)}</div>
        <button className="video-list-refresh" onClick={() => loadVideos()} disabled={loading}><RefreshCw size={16} />刷新</button>
      </section>
      {message && token && <div className="video-list-message">{message}</div>}
      {loading ? <div className="video-empty-state"><RefreshCw className="is-spinning" size={30} /><strong>正在同步{studioConfig.syncLabel}记录</strong></div> : !token ? <div className="video-empty-state"><FileVideo size={38} /><strong>登录后查看视频制作记录</strong><p>登录后可查看状态、进入详情并保存或发布视频。</p><button className="primary-button" onClick={onLogin}>登录</button></div> : visibleVideos.length ? <>
        <section className="video-record-grid">{visibleVideos.map((video, index) => <article className="video-record-card" key={`${video.id}-${index}`}>
          <button className="video-record-media" onClick={() => openDetail(video)} aria-label={`查看 ${video.title} 详情`}>{video.coverUrl ? <img src={video.coverUrl} alt="" loading="lazy" /> : <span><Play size={28} /></span>}<em className={`state-chip--${video.status.key}`}>{video.status.label}</em><i>AI 生成</i></button>
          <button className="video-record-body" onClick={() => openDetail(video)}><span className="video-record-heading"><strong>{video.title}</strong><ChevronRight size={17} /></span><small>{[video.humanName, video.voiceName].filter(Boolean).join(' · ') || '未记录形象和声音'}</small>{video.topic && <small>话题：{video.topic}</small>}<p>{video.script || '暂无文案摘要'}</p>{video.failureReason && <b>失败原因：{video.failureReason}</b>}<time>{video.createdAt || video.taskId || '等待制作信息'}</time></button>
        </article>)}</section>
        {hasMore && statusFilter === 'all' && !query && <button className="video-load-more" onClick={() => loadVideos({ nextPage: page + 1, append: true })} disabled={loadingMore}>{loadingMore ? '加载中…' : '加载更多视频'}</button>}
      </> : <div className="video-empty-state"><Video size={38} /><strong>{message || (videos.length ? '没有符合筛选条件的视频' : `还没有${studioConfig.emptyLabel}制作记录`)}</strong><p>{videos.length ? '更换状态或搜索关键词后再试。' : `点击制作，提交第一条${studioConfig.emptyLabel}。`}</p>{!videos.length && <button className="primary-button" onClick={() => onNewVideo({ productionType: studioConfig.key })}>开始制作</button>}</div>}
    </div>
  );
}

const VIDEO_CREATOR_RESOURCE_CONFIG = {
  human: { title: '选择数字人形象', empty: '暂无可用数字人形象' },
  voice: { title: '选择声音', empty: '暂无可用声音' },
  videoTemplate: { title: '选择视频包装模板', empty: '暂无视频包装模板' },
  coverTemplate: { title: '选择视频封面模板', empty: '暂无视频封面模板' },
  music: { title: '选择背景音乐', empty: '暂无已完成的音乐' },
  material: { title: '从素材库选择', empty: '素材库暂无可用图片或视频' },
  preset: { title: '选择已配置方案', empty: '暂无已配置方案' },
};

const getCreatorPayloadList = (result = {}) => {
  const keys = ['ai_humans', 'aihumans', 'voices', 'templates', 'video_templates', 'cover_templates', 'materials', 'generated_music', 'generatedMusic', 'results', 'list', 'items', 'records', 'rows', 'data'];
  const visit = (value, depth = 0) => {
    if (!value || depth > 5) return [];
    if (Array.isArray(value)) return value;
    if (typeof value !== 'object') return [];
    for (const key of keys) {
      if (Array.isArray(value[key])) return value[key];
    }
    for (const key of ['data', 'result', 'payload']) {
      const nested = visit(value[key], depth + 1);
      if (nested.length) return nested;
    }
    return [];
  };
  const direct = visit(result.data);
  return direct.length ? direct : visit(result.raw);
};

const getCreatorRawDraft = (usePrefill) => {
  if (!usePrefill) return {};
  try {
    return videoObject(JSON.parse(window.localStorage.getItem(VIDEO_PREFILL_KEY) || '{}'));
  } catch {
    return {};
  }
};

const getCreatorJsonObject = (value, depth = 0) => {
  if (value === undefined || value === null || value === '' || depth > 5) return {};
  if (typeof value === 'string') {
    try {
      return getCreatorJsonObject(JSON.parse(value), depth + 1);
    } catch {
      return {};
    }
  }
  return videoObject(value);
};

const getCreatorPayloadObject = (...values) => {
  const keys = ['payload_json', 'payloadJson', 'productionPayload', 'production_payload', 'draft_payload', 'draftPayload', 'request_payload', 'requestPayload', 'createPayload', 'create_payload', 'jsonPayload', 'json_payload', 'requestData', 'request_data', 'shanjianData', 'shanjian_data', 'body', 'params', 'input', 'data', 'payload'];
  const unwrap = (value, depth = 0) => {
    const source = getCreatorJsonObject(value, depth);
    if (!Object.keys(source).length || depth > 5) return {};
    if (source.sceneList || source.scene_list || source.scenes) return source;
    for (const key of keys) {
      const nested = unwrap(source[key], depth + 1);
      if (Object.keys(nested).length) return nested;
    }
    if (source.materials || source.materialList || source.material_list) return source;
    return source;
  };
  for (const value of values) {
    const payload = unwrap(value);
    if (Object.keys(payload).length) return payload;
  }
  return {};
};

const hasCreatorHumanId = (value, depth = 0) => {
  const source = getCreatorJsonObject(value, depth);
  if (!Object.keys(source).length || depth > 5) return false;
  const id = videoText(
    source.aiHumanId,
    source.ai_human_id,
    source.aihumanId,
    source.aihuman_id,
    source.virtualmanId,
    source.virtualman_id,
    source.humanId,
    source.human_id,
    source.digitalHumanId,
    source.digital_human_id,
    videoObject(source.human).id,
    videoObject(source.aiHuman).id,
    videoObject(source.ai_human).id,
    videoObject(source.virtualman).id,
    videoObject(source.digitalHuman).id,
    videoObject(source.digital_human).id,
  );
  if (id) return true;
  for (const key of ['payload_json', 'payloadJson', 'productionPayload', 'production_payload', 'draft_payload', 'draftPayload', 'detail', 'raw', 'payload', 'data']) {
    if (hasCreatorHumanId(source[key], depth + 1)) return true;
  }
  return false;
};

const inferCreatorProductionType = (...values) => {
  const payload = getCreatorPayloadObject(...values);
  const rawType = videoText(payload.productionType, payload.production_type, payload.type, payload.mode);
  if (VIDEO_PRODUCTION_TYPES[rawType]) return rawType;

  const endpoint = videoText(payload.endpoint, payload.shanjianEndpoint, payload.shanjian_endpoint, payload.scene, payload.productionScene, payload.production_scene, payload.openapiPath, payload.openapi_path);
  if (endpoint.includes('custom_virtualman_broadcast')) return 'professional';
  if (endpoint.includes('custom_broadcast_mixcut')) return 'materialPackage';
  if (endpoint.includes('oralMixCutting')) return 'mix';
  const hasScenes = getCreatorSceneDraftList(payload.sceneList, payload.scene_list, payload.scenes, payload, ...values).length > 0;
  if (hasScenes) return [payload, ...values].some((value) => hasCreatorHumanId(value)) ? 'professional' : 'materialPackage';
  return '';
};

const getCreatorMaterialsJsonList = (...values) => {
  const visit = (value, depth = 0) => {
    if (value === undefined || value === null || value === '' || depth > 6) return [];
    if (typeof value === 'string') {
      try {
        return visit(JSON.parse(value), depth + 1);
      } catch {
        return [];
      }
    }
    if (Array.isArray(value)) return value;
    if (typeof value !== 'object') return [];
    for (const key of ['materials', 'materialList', 'material_list', 'materialsJson', 'materials_json', 'selectedMaterials', 'selected_materials', 'clipMaterials', 'clip_materials', 'items', 'mediaList', 'media_list', 'resources']) {
      const nested = visit(value[key], depth + 1);
      if (nested.length) return nested;
    }
    if (value.material || value.media || value.file || value.resource || value.asset || value.item) return [value];
    for (const key of ['payload_json', 'payloadJson', 'productionPayload', 'production_payload', 'draft_payload', 'draftPayload', 'request_payload', 'requestPayload', 'createPayload', 'create_payload', 'jsonPayload', 'json_payload', 'requestData', 'request_data', 'shanjianData', 'shanjian_data', 'body', 'params', 'input', 'data', 'payload']) {
      const nested = visit(value[key], depth + 1);
      if (nested.length) return nested;
    }
    return [];
  };
  for (const value of values) {
    const list = visit(value);
    if (list.length) return list;
  }
  return [];
};

const normalizeCreatorPrefillMaterial = (item = {}, index = 0) => {
  if (typeof item === 'string') {
    const url = getApiMediaUrl(item);
    const type = getMaterialType({ url });
    return {
      id: url || `prefill-${index}`,
      title: `素材 ${Number(index) + 1 || index}`,
      type,
      url,
      previewUrl: type === 'video' ? getVideoFrameUrl(url) : url,
      duration: type === 'image' ? 2 : 0,
      origin: 'library',
    };
  }
  const source = getMaterialSourceObject(item);
  const url = getApiMediaUrl(getMaterialUrl(source));
  const type = getMaterialType({ ...source, url });
  return {
    id: videoText(source.id, source.materialId, source.material_id, source.fileId, source.file_id, url, `prefill-${index}`),
    title: videoText(source.title, source.name, source.fileName, source.file_name) || `素材 ${index + 1}`,
    type,
    url,
    previewUrl: type === 'video' ? getVideoFrameUrl(url) : url,
    duration: Number(source.duration || source.duration_seconds || source.durationSeconds || source.durationTime || source.duration_time) || (type === 'image' ? 2 : 0),
    origin: 'library',
  };
};

const getCreatorDirectSceneMaterials = (scene = {}) => {
  const source = videoObject(scene);
  const materialKeys = ['materials', 'materialList', 'material_list', 'materialsJson', 'materials_json', 'selectedMaterials', 'selected_materials', 'clipMaterials', 'clip_materials', 'items', 'mediaList', 'media_list', 'resources'];
  const listKeys = ['list', 'items', 'records', 'rows', 'data', 'materials', 'materialList', 'material_list'];
  const readValue = (value, depth = 0) => {
    if (value === undefined || value === null || value === '' || depth > 4) return [];
    if (typeof value === 'string') {
      try {
        return readValue(JSON.parse(value), depth + 1);
      } catch {
        const url = getApiMediaUrl(value);
        return url ? [value] : [];
      }
    }
    if (Array.isArray(value)) return value;
    if (typeof value !== 'object') return [];

    const materialUrl = getApiMediaUrl(getMaterialUrl(value));
    if (materialUrl) return [value];

    for (const key of listKeys) {
      const nested = readValue(value[key], depth + 1);
      if (nested.length) return nested;
    }
    return [];
  };

  for (const key of materialKeys) {
    const list = readValue(source[key]);
    if (list.length) return list;
  }

  return readValue(source.material || source.media || source.file || source.resource || source.asset);
};

const getCreatorSceneDraftList = (...values) => {
  const visit = (value, depth = 0) => {
    if (value === undefined || value === null || value === '' || depth > 6) return [];
    if (typeof value === 'string') {
      try {
        return visit(JSON.parse(value), depth + 1);
      } catch {
        return parseGeneratedScenes(value).map((content) => ({ content }));
      }
    }
    if (Array.isArray(value)) return value;
    if (typeof value !== 'object') return [];
    for (const key of ['sceneList', 'scene_list', 'scenes', 'storyboards', 'shots']) {
      const nested = visit(value[key], depth + 1);
      if (nested.length) return nested;
    }
    for (const key of ['payload_json', 'payloadJson', 'productionPayload', 'production_payload', 'draft_payload', 'draftPayload', 'request_payload', 'requestPayload', 'createPayload', 'create_payload', 'jsonPayload', 'json_payload', 'requestData', 'request_data', 'shanjianData', 'shanjian_data', 'body', 'params', 'input', 'data', 'payload']) {
      const nested = visit(value[key], depth + 1);
      if (nested.length) return nested;
    }
    return [];
  };
  for (const value of values) {
    const list = visit(value);
    if (list.length) return list;
  }
  return [];
};

const getCreatorInitialState = (usePrefill) => {
  const draft = getCreatorRawDraft(usePrefill);
  const detail = videoObject(draft.detail || draft.raw || draft);
  const payload = getCreatorPayloadObject(
    draft.payload_json,
    draft.payloadJson,
    detail.payload_json,
    detail.payloadJson,
    draft.request_payload,
    draft.requestPayload,
    detail.request_payload,
    detail.requestPayload,
    draft.payload,
    detail.payload,
  );
  const shanjian = videoObject(detail.shanjianData || detail.shanjian_data || draft.shanjianData || draft.shanjian_data || payload.shanjianData || payload.shanjian_data);
  const speakerExtra = videoObject(detail.speakerExtra || detail.speaker_extra || shanjian.speakerExtra || shanjian.speaker_extra);
  const coverUrl = getApiMediaUrl(videoText(draft.coverUrl, draft.cover, detail.coverUrl, detail.cover_url, detail.cover, payload.coverUrl, payload.cover_url, payload.cover));
  const humanPreviewUrl = getApiMediaUrl(videoText(draft.humanPreviewUrl, detail.humanPreviewUrl, detail.human_preview_url));
  const materialSource = getCreatorMaterialsJsonList(
    draft.materials_json,
    draft.materialsJson,
    detail.materials_json,
    detail.materialsJson,
    draft.materials,
    detail.materials,
    shanjian.materials,
    payload.materials,
    payload.materialList,
    payload.material_list,
    payload,
    draft,
    detail,
    shanjian,
  );
  const materials = materialSource.map(normalizeCreatorPrefillMaterial).filter((item) => item.url);
  const payloadSceneSource = getCreatorSceneDraftList(payload.sceneList, payload.scene_list, payload);
  const sceneSource = payloadSceneSource.length
    ? payloadSceneSource
    : getCreatorSceneDraftList(draft.sceneList, draft.scene_list, detail.sceneList, detail.scene_list, shanjian.sceneList, shanjian.scene_list, draft.scenes, detail.scenes, shanjian.scenes, draft, detail, shanjian, payload);
  const scenes = sceneSource
    .map((item, index) => {
      const source = videoObject(item);
      const captions = videoObject(source.captions || source.caption);
      const content = cleanGeneratedScene(videoText(source.content, source.text, source.script, captions.content, captions.text, source.captions, source.caption));
      const sceneMaterials = getCreatorDirectSceneMaterials(source)
        .map((material, materialIndex) => normalizeCreatorPrefillMaterial(material, `${index}-${materialIndex}`))
        .filter((material) => material.url);
      return content || sceneMaterials.length ? createCreatorScene(content || `分镜 ${index + 1}`, sceneMaterials) : null;
    })
    .filter(Boolean);
  if (!payloadSceneSource.length && scenes.length && materials.length && !getCreatorSceneMaterials(scenes).length) scenes[0].materials = materials;
  const prefillStatus = normalizeStatus(getVideoStatusValue({ ...detail, ...draft }));
  const isFailedPrefill = prefillStatus.key === 'failed' || draft.source === 'videoDetailRemake';

  return {
    form: {
      title: videoText(draft.title, draft.formTitle, detail.title, payload.title),
      topic: videoText(draft.topic, draft.tags, detail.topic, detail.tags, payload.topic, payload.tags),
      script: videoText(draft.script, draft.content, detail.script, detail.content, payload.script, payload.content, shanjian.content),
    },
    selected: {
      human: {
        id: videoText(draft.humanId, draft.aiHumanId, draft.virtualmanId, detail.aiHumanId, detail.ai_human_id, detail.virtualmanId, payload.aiHumanId, payload.ai_human_id, payload.virtualmanId, payload.virtualman_id, shanjian.aiHumanId, shanjian.virtualmanId),
        title: videoText(draft.humanName, draft.aiHumanName, draft.virtualmanName, detail.aiHumanName, detail.ai_human_name, detail.virtualmanName),
        cover: humanPreviewUrl,
      },
      voice: {
        id: videoText(draft.voiceId, draft.speakerId, detail.voiceId, detail.voice_id, detail.speakerId, payload.voiceId, payload.voice_id, payload.speakerId, payload.speaker_id, shanjian.speakerId),
        title: videoText(draft.voiceName, draft.speakerName, detail.voiceName, detail.voice_name, detail.speakerName),
        speed: Number(draft.voiceSpeedRatio || detail.voiceSpeedRatio || speakerExtra.speedRatio) || 1,
      },
      videoTemplate: {
        id: videoText(draft.videoTemplateId, draft.styleId, detail.videoTemplateId, detail.video_template_id, payload.videoTemplateId, payload.video_template_id, payload.styleId, payload.style_id, shanjian.styleId),
        title: videoText(draft.videoTemplateName, draft.styleName, detail.videoTemplateName, detail.video_template_name),
        cover: getApiMediaUrl(videoText(draft.videoTemplatePreviewUrl, detail.videoTemplatePreviewUrl)),
      },
      coverTemplate: {
        id: videoText(draft.coverTemplateId, detail.coverTemplateId, detail.cover_template_id, payload.coverTemplateId, payload.cover_template_id),
        title: videoText(draft.coverTemplateName, detail.coverTemplateName, detail.cover_template_name),
        cover: getApiMediaUrl(videoText(draft.coverTemplatePreviewUrl, detail.coverTemplatePreviewUrl)),
      },
      music: {
        id: videoText(draft.musicId, detail.musicId, payload.musicId, payload.music_id),
        title: videoText(draft.musicName, detail.musicName),
        audioUrl: getApiMediaUrl(videoText(draft.bgmusic, draft.bgMusic, detail.bgmusic?.url, detail.bgMusic, payload.bgmusic?.url, payload.bgMusic, shanjian.bgmusic?.url)),
      },
    },
    cover: coverUrl ? { title: '当前封面', url: coverUrl, previewUrl: coverUrl, origin: coverUrl === humanPreviewUrl ? 'human' : 'remote' } : null,
    materials,
    scenes,
    draftId: isFailedPrefill ? '' : videoText(draft.draftRecordId, draft.draft_id, draft.id, detail.draftRecordId, detail.id),
  };
};

const getCreatorObject = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const getCreatorFlag = (value) => value === true || value === 1 || ['1', 'true', 'yes', 'y'].includes(String(value || '').toLowerCase());

const normalizeCreatorPreset = (item = {}, index = 0) => {
  const voiceId = videoText(item.voiceId, item.voice_id, item.speakerId, item.speaker_id);
  const voiceTitle = videoText(item.voiceName, item.voice_name, item.speakerName, item.speaker_name);
  const speakerExtra = getCreatorObject(item.speakerExtra || item.speaker_extra);
  return {
    id: videoText(item.id, item.presetId, item.preset_id, `preset-${index}`),
    title: videoText(item.name, item.title, item.digitalHumanName, item.digital_human_name, item.humanName, item.human_name) || `配置 ${index + 1}`,
    isDefault: getCreatorFlag(item.isDefault ?? item.is_default ?? item.default),
    human: {
      id: videoText(item.digitalHumanId, item.digital_human_id, item.humanId, item.human_id, item.aiHumanId, item.ai_human_id, item.aihumanId, item.aihuman_id, item.virtualmanId, item.virtualman_id),
      title: videoText(item.digitalHumanName, item.digital_human_name, item.humanName, item.human_name, item.aiHumanName, item.ai_human_name, item.aihumanName, item.aihuman_name, item.virtualmanName, item.virtualman_name),
      cover: getApiMediaUrl(videoText(item.coverUrl, item.cover_url, item.humanCoverUrl, item.human_cover_url, item.aihumanCoverUrl, item.aihuman_cover_url, item.imageUrl, item.image_url)),
    },
    voice: {
      id: voiceId,
      title: voiceTitle || voiceId,
      speed: Number(item.voiceSpeedRatio || item.voice_speed_ratio || item.speedRatio || item.speed_ratio || speakerExtra.speedRatio || speakerExtra.speed_ratio) || 1,
    },
    videoTemplate: {
      id: videoText(item.clipTemplateId, item.clip_template_id, item.videoTemplateId, item.video_template_id, item.styleId, item.style_id),
      title: videoText(item.clipTemplateName, item.clip_template_name, item.videoTemplateName, item.video_template_name, item.styleName, item.style_name),
      cover: getApiMediaUrl(videoText(item.clipTemplateImageUrl, item.clip_template_image_url, item.videoTemplatePreviewUrl, item.video_template_preview_url, item.stylePreviewUrl, item.style_preview_url)),
    },
    coverTemplate: {
      id: videoText(item.coverTemplateId, item.cover_template_id),
      title: videoText(item.coverTemplateName, item.cover_template_name),
      cover: getApiMediaUrl(videoText(item.coverTemplateImageUrl, item.cover_template_image_url, item.coverTemplatePreviewUrl, item.cover_template_preview_url)),
    },
  };
};

const hydrateCreatorPresetVoice = (preset, voices) => {
  const presetVoice = preset.voice || {};
  const matched = voices.find((voice) => voice.id === presetVoice.id) ||
    (!presetVoice.id && presetVoice.title ? voices.find((voice) => voice.title === presetVoice.title) : null);
  if (!matched) return preset;
  return {
    ...preset,
    voice: {
      ...matched,
      ...presetVoice,
      id: presetVoice.id || matched.id,
      title: presetVoice.title || matched.title || presetVoice.id || matched.id,
      speed: Number(presetVoice.speed || matched.speed) || 1,
    },
  };
};

const getCreatorMaterialDuration = (item = {}) => item.type === 'image' ? 2 : Number(item.duration) || MAX_VIDEO_DURATION;

function VideoCreatorDialog({ type, titleOverride, options, selected, loading, hasMore, loadingMore, loadMessage, onClose, onSelect, onLoadMore }) {
  const config = VIDEO_CREATOR_RESOURCE_CONFIG[type];
  const title = titleOverride || config?.title;
  const gridRef = useRef(null);
  useEffect(() => {
    const element = gridRef.current;
    if (!loading && !loadingMore && !loadMessage && hasMore && element && element.scrollHeight <= element.clientHeight + 4) onLoadMore?.();
  }, [options.length, loading, loadingMore, loadMessage, hasMore, onLoadMore]);
  if (!config) return null;
  const handleScroll = (event) => {
    const element = event.currentTarget;
    if (hasMore && !loadingMore && element.scrollTop + element.clientHeight >= element.scrollHeight - 80) onLoadMore?.();
  };
  return (
    <div className="video-action-layer video-creator-resource-layer" role="dialog" aria-modal="true" aria-label={title}>
      <button className="video-action-layer__mask" aria-label="关闭" onClick={onClose} />
      <section className="video-creator-resource-dialog">
        <header><div><span>PRODUCTION RESOURCE</span><h2>{title}</h2></div><button onClick={onClose} aria-label="关闭"><X size={19} /></button></header>
        <div ref={gridRef} className="video-creator-resource-grid" onScroll={handleScroll}>
          {loading ? <div className="video-dialog-empty"><RefreshCw className="is-spinning" size={22} />正在加载资源…</div> : options.length ? options.map((option, index) => {
            const active = type === 'material' ? selected.some((item) => item.id === option.id) : selected?.id === option.id;
            const media = option.cover || option.previewUrl || option.imageUrl;
            const audioUrl = option.audioUrl;
            return (
              <button className={`video-creator-resource-card ${active ? 'is-active' : ''}`} key={`${type}-${option.id}-${index}`} onClick={() => onSelect(option)}>
                <span className="video-creator-resource-media">
                  {media ? <img src={media} alt="" loading="lazy" /> : type === 'voice' || type === 'music' ? <Music2 size={26} /> : type === 'preset' ? <Layers3 size={26} /> : <Sparkles size={26} />}
                  {active && <i><Check size={15} /></i>}
                </span>
                <span><strong>{option.title}</strong><small>{option.meta || (option.isDefault ? '默认配置' : '可用')}</small>{audioUrl && <audio src={audioUrl} controls onClick={(event) => event.stopPropagation()} />}</span>
              </button>
            );
          }) : <div className="video-dialog-empty">{config.empty}</div>}
          {!loading && options.length > 0 && loadingMore && <div className="video-creator-resource-more"><RefreshCw className="is-spinning" size={17} />正在加载更多…</div>}
          {!loading && options.length > 0 && !loadingMore && hasMore && <button className="video-creator-resource-more" onClick={onLoadMore}>加载更多</button>}
          {!loadingMore && loadMessage && <div className="video-creator-resource-error">{loadMessage}</div>}
        </div>
        <footer><button className="primary-button" onClick={onClose}>{type === 'material' ? `完成选择（${selected.length}）` : '关闭'}</button></footer>
      </section>
    </div>
  );
}

const createCreatorScene = (content = '', materials = []) => ({
  id: `scene-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  content,
  materials,
});

const getInitialCreatorScenes = (form = {}, materials = []) => {
  const chunks = textOf(form.script)
    .split(/\n{2,}|\n(?=\d+[.、])|(?=\s*(?:分镜|镜头|场景|片段)\s*[第]?\s*[0-9０-９一二三四五六七八九十百]*\s*[）).、:：-]?)|(?=第[一二三四五六七八九十]+[个段幕镜])/)
    .map((item) => cleanGeneratedScene(item.replace(/^\s*\d+[.、]\s*/, '').replace(GENERATED_SCENE_REGEX, '')))
    .filter(Boolean);
  if (chunks.length) return chunks.map((content, index) => createCreatorScene(content, index === 0 ? materials : []));
  return [createCreatorScene(textOf(form.script), materials)];
};

const getCreatorSceneMaterials = (scenes = []) => scenes.flatMap((scene) => scene.materials || []);

const VIDEO_CREATOR_MODE_KEYS = ['oral', 'mix', 'professional', 'materialPackage'];
const mergeCreatorMaterials = (...groups) => {
  const seen = new Set();
  return groups.flat().filter((item) => {
    if (!item) return false;
    const key = String(item.id || item.url || item.previewUrl || item.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

function VideoCreatorPage({ authVersion, usePrefill, productionType = 'oral', backLabel = '返回视频管理', onBack, onLogin, onCreated, onChangeProductionType }) {
  const [currentProductionType, setCurrentProductionType] = useState(VIDEO_PRODUCTION_TYPES[productionType] ? productionType : 'oral');
  const currentProductionTypeRef = useRef(currentProductionType);
  const getProductionModeSnapshot = useCallback((mode = currentProductionTypeRef.current) => {
    const key = VIDEO_PRODUCTION_TYPES[mode] ? mode : 'oral';
    const config = VIDEO_PRODUCTION_TYPES[key];
    const isMixedMode = key === 'mix';
    const isProfessionalMode = key === 'professional';
    const isMaterialPackageMode = key === 'materialPackage';
    return {
      key,
      config,
      isMixed: isMixedMode,
      isProfessional: isProfessionalMode,
      isMaterialPackage: isMaterialPackageMode,
      isCustomMixcut: isProfessionalMode || isMaterialPackageMode,
      needsHuman: !isMixedMode && !isMaterialPackageMode,
      templateScene: config.templateScene,
      productionScene: config.productionScene,
    };
  }, []);
  useEffect(() => {
    if (VIDEO_PRODUCTION_TYPES[productionType] && productionType !== currentProductionType) {
      currentProductionTypeRef.current = productionType;
      setCurrentProductionType(productionType);
    }
  }, [productionType]);
  useEffect(() => { currentProductionTypeRef.current = currentProductionType; }, [currentProductionType]);
  const isMixed = currentProductionType === 'mix';
  const isProfessional = currentProductionType === 'professional';
  const isMaterialPackage = currentProductionType === 'materialPackage';
  const creatorConfig = VIDEO_PRODUCTION_TYPES[isProfessional ? 'professional' : isMaterialPackage ? 'materialPackage' : isMixed ? 'mix' : 'oral'];
  const isCustomMixcut = isProfessional || isMaterialPackage;
  const needsHuman = !isMixed && !isMaterialPackage;
  const templateScene = creatorConfig.templateScene;
  const productionScene = creatorConfig.productionScene;
  const initial = useMemo(() => {
    const state = getCreatorInitialState(usePrefill);
    if (!needsHuman) state.selected.human = { id: '', title: '', cover: '' };
    return state;
  }, [usePrefill, needsHuman]);
  const [form, setForm] = useState(initial.form);
  const [selected, setSelected] = useState(initial.selected);
  const [professionalOptions] = useState({
    language: 'zh-CN',
    materialComposition: 'random',
    showWatermark: true,
    headerSwitch: true,
    materialSwitch: true,
    subtitleSwitch: true,
    keywordSwitch: true,
    headerLayer: true,
    bgmVolume: '1',
  });
  const [cover, setCover] = useState(initial.cover);
  const [materials, setMaterials] = useState(initial.materials);
  const [scenes, setScenes] = useState(() => initial.scenes?.length ? initial.scenes : getInitialCreatorScenes(initial.form, initial.materials));
  const [activeSceneId, setActiveSceneId] = useState('');
  const [draftId, setDraftId] = useState(initial.draftId);
  const [resources, setResources] = useState({ human: [], voice: [], videoTemplate: [], coverTemplate: [], music: [], material: [], preset: [] });
  const [resourcePaging, setResourcePaging] = useState({
    videoTemplate: { page: 1, cursor: '', hasMore: false, loadingMore: false, message: '' },
    coverTemplate: { page: 1, cursor: '', hasMore: false, loadingMore: false, message: '' },
    material: { page: 1, cursor: '', hasMore: false, loadingMore: false, message: '' },
  });
  const [loadingResources, setLoadingResources] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const draftIdRef = useRef(draftId);
  const coverRef = useRef(cover);
  const materialsRef = useRef(materials);
  const scenesRef = useRef(scenes);
  const resourceLoadingRef = useRef({ videoTemplate: false, coverTemplate: false, material: false });
  const token = getAccessToken();

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const materialDuration = useMemo(() => {
    const source = isCustomMixcut ? getCreatorSceneMaterials(scenes) : materials;
    return source.reduce((total, item) => total + getCreatorMaterialDuration(item), 0);
  }, [isCustomMixcut, materials, scenes]);

  useEffect(() => { coverRef.current = cover; }, [cover]);
  useEffect(() => { materialsRef.current = materials; }, [materials]);
  useEffect(() => { scenesRef.current = scenes; }, [scenes]);
  useEffect(() => { draftIdRef.current = draftId; }, [draftId]);
  useEffect(() => () => {
    const currentCover = coverRef.current;
    if (currentCover?.origin === 'local' && currentCover.previewUrl) URL.revokeObjectURL(currentCover.previewUrl);
    materialsRef.current.filter((item) => item.origin === 'local').forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
    getCreatorSceneMaterials(scenesRef.current).filter((item) => item.origin === 'local').forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    let ignore = false;
    const load = async () => {
      setLoadingResources(true);
      const [ownHumans, commonHumans, ownVoices, commonVoices, videoTemplates, coverTemplates, materialResult, musicResult, userResult] = await Promise.all([
        needsHuman ? apiFetch('/api/aihuman/list', { params: { page: 1, page_size: 50 }, timeoutMs: 12000 }) : Promise.resolve({ ok: true, data: [], raw: {} }),
        needsHuman ? apiFetch('/api/aihuman/common-list', { params: { page: 1, page_size: 50 }, timeoutMs: 12000 }) : Promise.resolve({ ok: true, data: [], raw: {} }),
        apiFetch('/api/ai-voice/list', { params: { page: 1, page_size: 50 }, timeoutMs: 12000 }),
        apiFetch('/api/ai-voice/common-list', { params: { page: 1, page_size: 50 }, timeoutMs: 12000 }),
        apiFetch('/api/shanjian/video-templates', { auth: false, params: { page: 1, page_size: 100, scene: templateScene }, timeoutMs: 12000 }),
        apiFetch('/api/shanjian/cover-templates', { auth: false, params: { page: 1, page_size: 100, scene: templateScene }, timeoutMs: 12000 }),
        apiFetch('/api/material/list', { params: { page: 1, page_size: MATERIAL_PAGE_SIZE, pageSize: MATERIAL_PAGE_SIZE, limit: MATERIAL_PAGE_SIZE, include_total: 0 }, timeoutMs: 12000 }),
        apiFetch('/api/music/generated', { params: { page: 1, page_size: 50 }, timeoutMs: 12000 }),
        needsHuman ? apiFetch('/api/user/info', { timeoutMs: 10000 }) : Promise.resolve({ ok: true, data: {}, raw: {} }),
      ]);
      if (ignore) return;

      const humans = [ownHumans, commonHumans].flatMap((result) => getCreatorPayloadList(result)).map(normalizeHuman).filter((item) => item.id && !['failed', 'processing'].includes(item.status.key));
      const voices = [ownVoices, commonVoices].flatMap((result) => {
        const list = getVoiceItems(result);
        return list.length ? list : getCreatorPayloadList(result);
      }).map(normalizeVoiceAsset).filter((item) => item.id && !['failed', 'processing'].includes(item.status.key));
      const music = getMusicList(musicResult).map(normalizeMusicItem).flatMap((item) => item.tracks.length ? item.tracks.map((track) => ({ ...track, title: track.title || item.title, meta: item.createdAt })) : [{ id: item.id, title: item.title, audioUrl: item.audioUrl, meta: item.createdAt }]).filter((item) => item.audioUrl);
      const teamPhone = videoText(userResult.data?.teamPhone, userResult.data?.team_phone, userResult.data?.phone, userResult.data?.phone_number, userResult.data?.user?.teamPhone, userResult.data?.user?.team_phone, userResult.data?.user?.phone, userResult.data?.user?.phone_number, getStoredUserInfo().teamPhone, getStoredUserInfo().phone);
      let presets = [];
      if (needsHuman && teamPhone) {
        const presetResult = await apiFetch('/api/team-video-preset/list', { params: { teamPhone }, timeoutMs: 10000 });
        if (!ignore && presetResult.ok) presets = getCreatorPayloadList(presetResult).map(normalizeCreatorPreset).map((preset) => hydrateCreatorPresetVoice(preset, voices));
      }
      if (ignore) return;
      const videoTemplateItems = getCreatorPayloadList(videoTemplates);
      const coverTemplateItems = getCreatorPayloadList(coverTemplates);
      const materialItems = toList(materialResult.data);
      const next = {
        human: humans,
        voice: voices,
        videoTemplate: videoTemplateItems.map((item, index) => normalizeTemplate(item, index, isMixed ? '混剪剪辑模板' : isCustomMixcut ? '包装混剪模板' : '视频包装')),
        coverTemplate: coverTemplateItems.map((item, index) => normalizeTemplate(item, index, '封面包装')),
        material: materialItems.map(normalizeMaterial).filter((item) => item.url),
        music,
        preset: presets,
      };
      setResources(next);
      setResourcePaging({
        videoTemplate: {
          page: 1,
          cursor: getTemplateNextCursor(videoTemplates),
          hasMore: videoTemplates.ok && getTemplateHasMore({ result: videoTemplates, cursor: '', list: videoTemplateItems, page: 1 }),
          loadingMore: false,
          message: videoTemplates.ok ? '' : getResultMessage(videoTemplates, '视频包装模板加载失败'),
        },
        coverTemplate: {
          page: 1,
          cursor: getTemplateNextCursor(coverTemplates),
          hasMore: coverTemplates.ok && getTemplateHasMore({ result: coverTemplates, cursor: '', list: coverTemplateItems, page: 1 }),
          loadingMore: false,
          message: coverTemplates.ok ? '' : getResultMessage(coverTemplates, '封面模板加载失败'),
        },
        material: {
          page: 1,
          cursor: getMaterialNextCursor(materialResult),
          // Some deployed material APIs report has_more=false while older rows still exist.
          // Probe the next page whenever this page returned records; stop on an empty or duplicate page.
          hasMore: materialResult.ok && materialItems.length > 0,
          loadingMore: false,
          message: materialResult.ok ? '' : getResultMessage(materialResult, '素材加载失败'),
        },
      });
      setSelected((current) => {
        const result = { ...current };
        const defaultPreset = presets.filter((item) => item.isDefault);
        if (!result.human.id && !result.voice.id && !result.videoTemplate.id && !result.coverTemplate.id && defaultPreset.length === 1) {
          Object.assign(result, { human: defaultPreset[0].human, voice: defaultPreset[0].voice, videoTemplate: defaultPreset[0].videoTemplate, coverTemplate: defaultPreset[0].coverTemplate });
          if (!cover && defaultPreset[0].human.cover) setCover({ title: `${defaultPreset[0].human.title || '数字人'}封面`, url: defaultPreset[0].human.cover, previewUrl: defaultPreset[0].human.cover, origin: 'human', humanId: defaultPreset[0].human.id });
          return result;
        }
        if (!result.human.id && humans.length === 1) result.human = humans[0];
        if (!result.voice.id && voices.length === 1) result.voice = { ...voices[0], speed: Number(voices[0].speed) || 1 };
        return result;
      });
      setLoadingResources(false);
    };
    load();
    return () => { ignore = true; };
  }, [authVersion, token, isMixed, isProfessional, isCustomMixcut, needsHuman, templateScene]);

  const loadMoreCreatorResources = async (type) => {
    if (!['videoTemplate', 'coverTemplate', 'material'].includes(type)) return;
    const paging = resourcePaging[type];
    if (!paging?.hasMore || paging.loadingMore || resourceLoadingRef.current[type]) return;

    resourceLoadingRef.current[type] = true;
    setResourcePaging((current) => ({
      ...current,
      [type]: { ...current[type], loadingMore: true, message: '' },
    }));

    const isMaterial = type === 'material';
    const path = isMaterial ? '/api/material/list' : type === 'videoTemplate' ? '/api/shanjian/video-templates' : '/api/shanjian/cover-templates';
    const group = type === 'videoTemplate' ? (isMixed ? '混剪剪辑模板' : isCustomMixcut ? '包装混剪模板' : '视频包装') : '封面包装';
    const nextPage = paging.page + 1;
    const result = await apiFetch(path, {
      auth: isMaterial,
      params: {
        page: nextPage,
        page_size: isMaterial ? MATERIAL_PAGE_SIZE : TEMPLATE_PAGE_SIZE,
        pageSize: isMaterial ? MATERIAL_PAGE_SIZE : TEMPLATE_PAGE_SIZE,
        ...(isMaterial ? { limit: MATERIAL_PAGE_SIZE, include_total: 0 } : { scene: templateScene }),
        ...(paging.cursor ? (isMaterial ? { start_cursor: paging.cursor } : { sid: paging.cursor }) : {}),
      },
      timeoutMs: 12000,
    });
    const rawItems = isMaterial ? toList(result.data) : getCreatorPayloadList(result);
    const normalized = rawItems
      .map((item, index) => isMaterial ? normalizeMaterial(item, resources[type].length + index) : normalizeTemplate(item, resources[type].length + index, group))
      .filter((item) => !isMaterial || item.url);
    const existingIds = new Set(resources[type].map((item) => String(item.id)));
    const uniqueItems = normalized.filter((item) => !existingIds.has(String(item.id)));
    const nextCursor = isMaterial ? getMaterialNextCursor(result) : getTemplateNextCursor(result);

    if (result.ok && uniqueItems.length) {
      setResources((current) => ({ ...current, [type]: current[type].concat(uniqueItems) }));
    }
    setResourcePaging((current) => ({
      ...current,
      [type]: {
        page: result.ok ? nextPage : current[type].page,
        cursor: result.ok ? nextCursor : current[type].cursor,
        hasMore: result.ok
          ? (isMaterial
            ? uniqueItems.length > 0
            : uniqueItems.length > 0 && getTemplateHasMore({ result, cursor: paging.cursor, list: rawItems, page: nextPage }))
          : current[type].hasMore,
        loadingMore: false,
        message: result.ok ? '' : getResultMessage(result, isMaterial ? '素材加载失败，请重试' : '模板加载失败，请重试'),
      },
    }));
    resourceLoadingRef.current[type] = false;
  };

  const chooseResource = (type, option) => {
    if (type === 'material') {
      setMessage('');
      if (isCustomMixcut && activeSceneId) {
        setScenes((current) => current.map((scene) => {
          if (scene.id !== activeSceneId) return scene;
          const sceneMaterials = scene.materials || [];
          const exists = sceneMaterials.some((item) => item.id === option.id);
          const duration = Number(option.raw?.duration || option.raw?.duration_seconds) || (option.type === 'image' ? 2 : MAX_VIDEO_DURATION);
          const nextDuration = materialDuration + (exists ? -getCreatorMaterialDuration(sceneMaterials.find((item) => item.id === option.id)) : duration);
          if (!exists && nextDuration > 300) { setMessage('素材总时长不能超过 5 分钟'); return scene; }
          return {
            ...scene,
            materials: exists
              ? sceneMaterials.filter((item) => item.id !== option.id)
              : sceneMaterials.concat({ ...option, title: option.title, previewUrl: option.cover, duration, origin: 'library' }),
          };
        }));
        return;
      }
      setMaterials((current) => {
        const exists = current.some((item) => item.id === option.id);
        if (exists) return current.filter((item) => item.id !== option.id);
        const duration = Number(option.raw?.duration || option.raw?.duration_seconds) || (option.type === 'image' ? 2 : MAX_VIDEO_DURATION);
        const nextDuration = current.reduce((sum, item) => sum + getCreatorMaterialDuration(item), 0) + duration;
        if (nextDuration > 300) { setMessage('素材总时长不能超过 5 分钟'); return current; }
        return current.concat({ ...option, title: option.title, previewUrl: option.cover, duration, origin: 'library' });
      });
      return;
    }
    const syncHumanCover = (human) => {
      setCover((current) => {
        const currentUrl = current?.url || current?.previewUrl || '';
        const previousHumanCover = selected.human?.cover || '';
        const followsHuman = !current || current.origin === 'human' || (previousHumanCover && currentUrl === previousHumanCover);
        if (!followsHuman) return current;
        if (!human?.cover) return null;
        return { title: `${human.title || '数字人'}封面`, url: human.cover, previewUrl: human.cover, origin: 'human', humanId: human.id };
      });
    };
    if (type === 'preset') {
      setSelected((current) => ({ ...current, human: option.human, voice: option.voice, videoTemplate: option.videoTemplate, coverTemplate: option.coverTemplate }));
      syncHumanCover(option.human);
    } else {
      setSelected((current) => ({ ...current, [type]: option }));
      if (type === 'human') syncHumanCover(option);
    }
    setDialogType('');
  };

  const chooseCover = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/') || !IMAGE_EXTENSIONS.includes(getExtension(file.name))) { setMessage('封面仅支持 jpg、png、webp 图片'); return; }
    if (cover?.origin === 'local' && cover.previewUrl) URL.revokeObjectURL(cover.previewUrl);
    setCover({ title: file.name, file, previewUrl: URL.createObjectURL(file), origin: 'local' });
    setMessage('');
  };

  const chooseLocalMaterials = async (event, sceneId = '') => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    const accepted = [];
    const failures = [];
    for (const file of files) {
      try {
        const info = await validateMaterialFile(file);
        accepted.push({ id: `local-${Date.now()}-${accepted.length}`, title: file.name, type: info.type, duration: info.type === 'image' ? 2 : info.duration, file, previewUrl: URL.createObjectURL(file), origin: 'local' });
      } catch (error) {
        failures.push(`${file.name}：${error.message}`);
      }
    }
    const nextDuration = materialDuration + accepted.reduce((sum, item) => sum + getCreatorMaterialDuration(item), 0);
    if (nextDuration > 300) {
      accepted.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setMessage('素材总时长不能超过 5 分钟');
      return;
    }
    if (isCustomMixcut && sceneId) {
      setScenes((current) => current.map((scene) => (scene.id === sceneId ? { ...scene, materials: (scene.materials || []).concat(accepted) } : scene)));
      setMessage(failures.join('；'));
      return;
    }
    setMaterials((current) => current.concat(accepted));
    setMessage(failures.join('；'));
  };

  const removeMaterial = (id) => setMaterials((current) => {
    const target = current.find((item) => item.id === id);
    if (target?.origin === 'local' && target.previewUrl) URL.revokeObjectURL(target.previewUrl);
    return current.filter((item) => item.id !== id);
  });

  const updateScene = (sceneId, patch) => setScenes((current) => current.map((scene) => (scene.id === sceneId ? { ...scene, ...patch } : scene)));
  const changeSceneContent = (sceneId, value) => updateScene(sceneId, { content: value });
  const splitSceneAtCursor = (sceneId, textarea) => {
    const content = String(textarea?.value || '');
    const selectionStart = textarea?.selectionStart ?? content.length;
    const selectionEnd = textarea?.selectionEnd ?? selectionStart;
    const before = content.slice(0, selectionStart);
    const after = content.slice(selectionEnd);
    setScenes((current) => {
      const sceneIndex = current.findIndex((scene) => scene.id === sceneId);
      if (sceneIndex < 0) return current;
      return current.flatMap((scene, index) => (index === sceneIndex
        ? [{ ...scene, content: before }, createCreatorScene(after)]
        : [scene]));
    });
  };
  const splitScriptToScenes = () => {
    const nextScenes = getInitialCreatorScenes(form, []);
    setScenes((current) => nextScenes.map((scene, index) => ({ ...scene, materials: current[index]?.materials || [] })));
    setMessage(nextScenes.length > 1 ? `已拆成 ${nextScenes.length} 个分镜` : '当前文案只有 1 个分镜');
  };
  const addScene = () => setScenes((current) => current.concat(createCreatorScene('')));
  const removeScene = (sceneId) => setScenes((current) => {
    const target = current.find((scene) => scene.id === sceneId);
    (target?.materials || []).filter((item) => item.origin === 'local').forEach((item) => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
    const next = current.filter((scene) => scene.id !== sceneId);
    return next.length ? next : [createCreatorScene('')];
  });
  const removeSceneMaterial = (sceneId, materialId) => setScenes((current) => current.map((scene) => {
    if (scene.id !== sceneId) return scene;
    const target = (scene.materials || []).find((item) => item.id === materialId);
    if (target?.origin === 'local' && target.previewUrl) URL.revokeObjectURL(target.previewUrl);
    return { ...scene, materials: (scene.materials || []).filter((item) => item.id !== materialId) };
  }));

  const hasDraftContent = () => Boolean(form.title || form.topic || form.script || scenes.some((scene) => scene.content || scene.materials?.length) || Object.values(selected).some((item) => item?.id || item?.audioUrl) || cover || materials.length);
  const validate = (isDraft, mode = currentProductionTypeRef.current) => {
    const modeSnapshot = getProductionModeSnapshot(mode);
    const validationMaterials = modeSnapshot.isCustomMixcut ? getCreatorSceneMaterials(scenes) : materials;
    const validationDuration = validationMaterials.reduce((total, item) => total + getCreatorMaterialDuration(item), 0);
    if (!token) { onLogin(); return '请先登录'; }
    if (isDraft) {
      if (!hasDraftContent()) return '请先填写或选择内容';
      return validationDuration > 300 ? '素材总时长不能超过 5 分钟' : '';
    }
    if (!form.title.trim()) return '请填写标题';
    if (!form.topic.trim()) return '请填写话题';
    if (modeSnapshot.needsHuman && !selected.human.id) return '请选择数字人形象';
    if (!selected.voice.id) return '请选择声音';
    if (!selected.videoTemplate.id) return modeSnapshot.isMixed ? '请选择混剪剪辑模板' : '请选择视频包装模板';
    if (!selected.coverTemplate.id) return '请选择视频封面模板';
    if (!cover) return '请上传封面图片';
    if (modeSnapshot.isCustomMixcut) {
      const validScenes = scenes.filter((scene) => scene.content.trim() || scene.materials?.length);
      if (!validScenes.length) return '请至少创建一个分镜';
      const shortScene = validScenes.find((scene) => scene.content.trim().length < 3);
      if (shortScene) return '每个分镜字幕不能少于 3 个字符';
      if (!getCreatorSceneMaterials(validScenes).length) return '请至少选择一个素材';
      if (validationDuration > 300) return '素材总时长不能超过 5 分钟';
      return '';
    }
    if (!form.script.trim()) return '请填写文案';
    if (!materials.length) return '请至少选择一个素材';
    if (validationDuration > 300) return '素材总时长不能超过 5 分钟';
    return '';
  };

  const submit = async (isDraft = false) => {
    const {
      key: submitProductionType,
      config: creatorConfig,
      isMixed,
      isProfessional,
      isCustomMixcut,
      needsHuman,
      templateScene,
      productionScene,
    } = getProductionModeSnapshot();
    const activeDraftId = draftIdRef.current;
    const validation = validate(isDraft, submitProductionType);
    if (validation) { setMessage(validation); return; }
    setBusy(isDraft ? 'draft' : 'submit');
    setMessage('');
    let savedUploadCount = 0;
    try {
      let coverUrl = cover?.url || '';
      if (cover?.file && !coverUrl) {
        setUploadProgress('正在上传封面…');
        const result = await uploadFile(cover.file, { source: 'cover' });
        if (!result.ok) throw new Error(getResultMessage(result, '封面上传失败'));
        coverUrl = getUploadedUrl(result);
        if (!coverUrl) throw new Error('封面上传未返回地址');
        savedUploadCount += 1;
        setCover((current) => current?.file === cover.file ? { ...current, url: coverUrl, uploaded: true } : current);
      }
      const submitMaterials = [];
      const submitScenes = [];
      const sourceMaterials = isCustomMixcut ? getCreatorSceneMaterials(scenes) : materials;
      const pendingMaterialCount = sourceMaterials.filter((item) => item.file && !item.url).length;
      let pendingMaterialIndex = 0;
      const prepareMaterial = async (material) => {
        let url = material.url || '';
        if (material.file && !url) {
          pendingMaterialIndex += 1;
          setUploadProgress(`正在上传未完成素材 ${pendingMaterialIndex}/${pendingMaterialCount}…`);
          const result = await uploadFile(material.file, { source: 'material' });
          if (!result.ok) throw new Error(`${material.title}：${getResultMessage(result, '上传失败')}`);
          url = getUploadedUrl(result);
          if (!url) throw new Error(`${material.title} 上传未返回地址`);
          savedUploadCount += 1;
          if (isCustomMixcut) {
            setScenes((current) => current.map((scene) => ({
              ...scene,
              materials: (scene.materials || []).map((item) => item.id === material.id ? { ...item, url, uploaded: true } : item),
            })));
          } else {
            setMaterials((current) => current.map((item) => item.id === material.id ? { ...item, url, uploaded: true } : item));
          }
        }
        if (!url) throw new Error(`${material.title} 上传未返回地址`);
        const submitUrl = material.type === 'image' && !url.includes('imageView2/') ? `${url}${url.includes('?') ? '&' : '?'}imageView2/0/w/1980/h/1980/format/copy/ignore-error/1` : url;
        return { type: material.type, fileUrl: submitUrl, soundSwitch: isCustomMixcut && material.type === 'video' };
      };
      if (isCustomMixcut) {
        const validScenes = scenes.filter((scene) => scene.content.trim() || scene.materials?.length);
        for (let sceneIndex = 0; sceneIndex < validScenes.length; sceneIndex += 1) {
          const scene = validScenes[sceneIndex];
          const sceneMaterials = [];
          for (let materialIndex = 0; materialIndex < (scene.materials || []).length; materialIndex += 1) {
            const prepared = await prepareMaterial(scene.materials[materialIndex]);
            sceneMaterials.push({ fileUrl: prepared.fileUrl, soundSwitch: Boolean(prepared.soundSwitch) });
            submitMaterials.push(prepared);
          }
          submitScenes.push({ captions: { content: scene.content.trim() }, materials: sceneMaterials });
        }
      } else {
        for (let index = 0; index < materials.length; index += 1) {
          submitMaterials.push(await prepareMaterial(materials[index]));
        }
      }
      if (coverUrl && !coverUrl.includes('imageView2/')) coverUrl = `${coverUrl}${coverUrl.includes('?') ? '&' : '?'}imageView2/0/w/1980/h/1980/format/copy/ignore-error/1`;
      const speakerExtra = {
        speedRatio: Math.min(2, Math.max(0.5, Number(selected.voice.speed) || 1)),
        ...(isCustomMixcut ? { language: professionalOptions.language || 'zh-CN' } : {}),
      };
      const musicVolume = Math.min(2, Math.max(0, Number(professionalOptions.bgmVolume) || 1));
      const backgroundMusic = { audioSwitch: Boolean(selected.music.audioUrl), audioUrl: selected.music.audioUrl || '', url: selected.music.audioUrl || '', volume: musicVolume };
      const customMixcutScenes = submitScenes;
      const scriptContent = isCustomMixcut ? (form.script.trim() || sceneScriptContent) : form.script.trim();
      const customMixcutPackRules = {
        headerSwitch: professionalOptions.headerSwitch,
        materialSwitch: professionalOptions.materialSwitch,
        subtitleSwitch: professionalOptions.subtitleSwitch,
        keywordSwitch: professionalOptions.keywordSwitch,
        ...(selected.music.audioUrl ? { backgroundMusic } : {}),
      };
      const customMixcutProcessRules = {
        materialComposition: professionalOptions.materialComposition,
        watermarkShow: professionalOptions.showWatermark,
        firstFrameCover: { coverSwitch: true, templateId: selected.coverTemplate.id, imageUrl: coverUrl },
      };
      const customMixcutStructLayers = [{
        markCode: 'headerLayer',
        show: professionalOptions.headerLayer,
        showMode: 'customize',
        showTime: 20,
      }];
      const shanjianData = {
        styleId: selected.videoTemplate.id,
        speakerId: selected.voice.id,
        speakerExtra,
        content: scriptContent,
        title: form.title.trim(),
        topic: form.topic.trim(),
        tags: form.topic.trim(),
        scene: productionScene,
        templateScene,
        materials: submitMaterials,
        packRules: { headerSwitch: true, materialSwitch: true, subtitleSwitch: true, keywordSwitch: true, backgroundMusic },
        processRules: { watermarkShow: true, firstFrameCover: { coverSwitch: true, templateId: selected.coverTemplate.id, imageUrl: coverUrl } },
        bgmusic: { url: selected.music.audioUrl || '' },
      };
      if (isCustomMixcut) {
        Object.assign(shanjianData, {
          endpoint: creatorConfig.endpoint,
          scenes: customMixcutScenes,
          packRules: customMixcutPackRules,
          processRules: customMixcutProcessRules,
          structLayers: customMixcutStructLayers,
        });
      }
      if (isProfessional) {
        Object.assign(shanjianData, {
          openapiPath: creatorConfig.openapiPath,
          shanjianEndpoint: creatorConfig.openapiPath,
          virtualmanId: selected.human.id,
          aiHumanId: selected.human.id,
        });
      }
      const payload = {
        title: form.title.trim(), topic: form.topic.trim(), tags: form.topic.trim(), script: scriptContent, content: scriptContent,
        cover: coverUrl, coverUrl, voiceId: selected.voice.id, voiceName: selected.voice.title, speakerId: selected.voice.id,
        speakerExtra, speaker_extra: speakerExtra, coverTemplateId: selected.coverTemplate.id, coverTemplateName: selected.coverTemplate.title,
        videoTemplateId: selected.videoTemplate.id, videoTemplateName: selected.videoTemplate.title, scene: productionScene, templateScene,
        materials: submitMaterials, is_draft: Boolean(isDraft), bgmusic: { url: selected.music.audioUrl || '' }, shanjianData,
        ...(creatorConfig.endpoint ? { endpoint: creatorConfig.endpoint } : {}),
        ...(activeDraftId ? { id: activeDraftId, draft_id: activeDraftId, ...(isCustomMixcut ? { draftId: activeDraftId } : {}) } : {}),
        ...(isCustomMixcut ? {
          isDraft: Boolean(isDraft),
          saveDraft: Boolean(isDraft),
          draft: Boolean(isDraft),
          bgMusic: { url: selected.music.audioUrl || '' },
          musicUrl: selected.music.audioUrl || '',
          productionType: creatorConfig.key,
          production_type: creatorConfig.key,
          scenes: customMixcutScenes,
          packRules: customMixcutPackRules,
          processRules: customMixcutProcessRules,
          structLayers: customMixcutStructLayers,
        } : {}),
        ...(isProfessional ? {
          openapiPath: creatorConfig.openapiPath,
          shanjianEndpoint: creatorConfig.openapiPath,
        } : {}),
      };
      if (needsHuman) {
        shanjianData.aiHumanId = selected.human.id;
        shanjianData.virtualmanId = selected.human.id;
        Object.assign(payload, {
          aiHumanId: selected.human.id,
          aiHumanName: selected.human.title,
          virtualmanId: selected.human.id,
          virtualmanName: selected.human.title,
        });
      }
      setUploadProgress(isDraft ? '正在暂存…' : '正在提交制作任务…');
      const createPaths = creatorConfig.createPaths || [creatorConfig.createPath];
      let result = null;
      for (const path of createPaths) {
        result = await apiFetch(path, { method: 'POST', body: payload, timeoutMs: 180000 });
        if (result.ok || result.authMissing || ![404, 405].includes(result.status)) break;
      }
      if (!result.ok) throw new Error(getResultMessage(result, isDraft ? '暂存失败' : '视频任务提交失败'));
      if (isDraft) {
        const detail = getVideoDetailRecord(result);
        const nextDraftId = videoText(detail.id, detail.draftId, detail.draft_id, result.data?.id, activeDraftId);
        draftIdRef.current = nextDraftId;
        setDraftId(nextDraftId);
        setMessage('已暂存，可继续编辑');
      } else {
        window.localStorage.removeItem(VIDEO_PREFILL_KEY);
        setMessage(isCustomMixcut ? `${creatorConfig.label}任务已提交` : isMixed ? '混剪视频任务已提交' : '数字人视频任务已提交');
        window.setTimeout(onCreated, 650);
      }
    } catch (error) {
      const reason = error.message || (isDraft ? '暂存失败' : '提交失败');
      setMessage(savedUploadCount ? `${reason}；已保留 ${savedUploadCount} 个成功上传，下次仅重试未完成内容` : reason);
    } finally {
      setBusy('');
      setUploadProgress('');
    }
  };

  const selectorRows = [
    ...(needsHuman ? [{ key: 'human', label: '数字人形象', hint: '请选择已完成的形象', icon: UserRound }] : []),
    { key: 'voice', label: '声音', hint: '请选择已完成的声音', icon: Mic2 },
    { key: 'videoTemplate', label: isMixed ? '混剪剪辑模板' : isCustomMixcut ? '包装混剪模板' : '视频包装模板', hint: isMixed ? '请选择混剪专用剪辑模板' : isCustomMixcut ? '请选择包装混剪模板' : '请选择视频包装模板', icon: Video },
    { key: 'coverTemplate', label: '视频封面模板', hint: '请选择视频封面模板', icon: Image },
    { key: 'music', label: '背景音乐', hint: '可选，不选则不添加音乐', icon: Music2 },
  ];
  const sceneScriptContent = scenes.map((scene) => scene.content.trim()).filter(Boolean).join('\n\n');
  const activeSceneMaterials = isCustomMixcut && activeSceneId ? scenes.find((scene) => scene.id === activeSceneId)?.materials || [] : materials;
  const sceneMaterialCount = getCreatorSceneMaterials(scenes).length;
  const switchProductionType = (nextType) => {
    if (!VIDEO_PRODUCTION_TYPES[nextType] || nextType === currentProductionType || busy) return;
    const nextIsCustomMixcut = nextType === 'professional' || nextType === 'materialPackage';
    const nextTemplateScene = VIDEO_PRODUCTION_TYPES[nextType].templateScene;
    setDialogType('');
    setActiveSceneId('');
    setMessage('');
    currentProductionTypeRef.current = nextType;
    if (nextIsCustomMixcut !== isCustomMixcut) {
      draftIdRef.current = '';
      setDraftId('');
    }
    if (nextTemplateScene !== templateScene) {
      setSelected((current) => ({
        ...current,
        videoTemplate: { id: '', title: '', cover: '' },
        coverTemplate: { id: '', title: '', cover: '' },
      }));
    }
    if (nextIsCustomMixcut && !isCustomMixcut) {
      setScenes((current) => current.some((scene) => scene.content?.trim() || scene.materials?.length) ? current : getInitialCreatorScenes(form, materials));
    }
    if (!nextIsCustomMixcut && isCustomMixcut) {
      const sceneMaterials = getCreatorSceneMaterials(scenes);
      setMaterials((current) => mergeCreatorMaterials(current, sceneMaterials));
      if (sceneScriptContent) setForm((current) => ({ ...current, script: sceneScriptContent }));
    }
    setCurrentProductionType(nextType);
    onChangeProductionType?.(nextType);
  };
  const coverPanel = (
    <div className="video-creator-cover">
      <h3>封面图片 <em>必填</em></h3>
      {cover ? (
        <div className="video-creator-cover-preview">
          <img src={cover.previewUrl || cover.url} alt="" />
          <span>
            <strong>{cover.title}</strong>
            <button onClick={() => { if (cover.origin === 'local') URL.revokeObjectURL(cover.previewUrl); setCover(null); }}>
              <Trash2 size={15} />删除
            </button>
          </span>
        </div>
      ) : (
        <label className="video-creator-dropzone">
          <Image size={26} />
          <strong>上传封面图片</strong>
          <small>jpg / png / webp</small>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseCover} />
        </label>
      )}
    </div>
  );

  return (
    <div className="video-creator-page">
      <header className="video-creator-header"><button className="video-back-button" onClick={onBack} disabled={Boolean(busy)}><ArrowLeft size={18} />{backLabel}</button><div><span>{creatorConfig.eyebrow}</span><h1>{usePrefill ? `继续制作${creatorConfig.title}` : `制作${creatorConfig.title}`}</h1><p>{isCustomMixcut ? '按新的包装混剪接口组合声音、分镜素材和包装规则。' : isMixed ? '填写内容并组合声音、混剪剪辑模板、封面和素材，提交后进入混剪制作队列。' : '填写内容并组合数字人、声音、包装和素材，提交后进入视频制作队列。'}</p></div><div className="video-creator-progress"><span className="is-done"><Check size={14} />内容</span><i /><span className="is-done"><Check size={14} />配置</span><i /><span>提交</span></div></header>
      <nav className="video-creator-mode-switch" aria-label="切换视频制作模式">
        {VIDEO_CREATOR_MODE_KEYS.map((modeKey) => {
          const mode = VIDEO_PRODUCTION_TYPES[modeKey];
          const Icon = mode.icon;
          return (
            <button key={modeKey} type="button" className={currentProductionType === modeKey ? 'is-active' : ''} onClick={() => switchProductionType(modeKey)} disabled={Boolean(busy)}>
              <Icon size={18} />
              <span><strong>{mode.label}</strong><small>{mode.sectionHint}</small></span>
            </button>
          );
        })}
      </nav>
      {!token ? <div className="video-empty-state"><UserRound size={38} /><strong>登录后开始制作</strong><p>登录后才能读取数字人、声音、素材并提交制作任务。</p><button className="primary-button" onClick={onLogin}>登录</button></div> : <>
        <div className="video-creator-layout">
          <main className="video-creator-main">
            <section className="video-creator-section"><div className="video-creator-section__head"><span>01</span><div><h2>基础内容</h2><p>{isCustomMixcut ? '标题和话题用于成片包装，总文案可一键拆成分镜。' : isMixed ? '标题和话题用于成片包装，文案用于字幕、关键词和素材编排。' : '标题和话题用于成片包装，文案会由数字人朗读。'}</p></div></div><div className="video-creator-fields"><label><span>标题 <em>必填</em></span><input maxLength={80} value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="请输入视频标题" /><small>{form.title.length}/80</small></label><label><span>话题 <em>必填</em></span><input value={form.topic} onChange={(event) => updateForm('topic', event.target.value)} placeholder="例如：同城获客、门店活动" /></label><label className="is-wide"><span>{isCustomMixcut ? '总文案' : '文案'} {!isCustomMixcut && <em>必填</em>}</span><textarea maxLength={2000} value={form.script} onChange={(event) => updateForm('script', event.target.value)} placeholder={isCustomMixcut ? '可先输入完整文案，再点击按文案拆分' : isMixed ? '请输入混剪视频文案' : '请输入数字人口播文案'} /><small>{form.script.length}/2000</small></label></div></section>
            <section className="video-creator-section"><div className="video-creator-section__head"><span>02</span><div><h2>选择配置</h2><p>{isCustomMixcut ? '选择声音、包装混剪模板、封面包装和背景音乐。' : isMixed ? '选择声音、混剪剪辑模板、封面包装和背景音乐。' : '使用已有资源，也可以一键应用团队预设。'}</p></div>{needsHuman && resources.preset.length > 0 && <button className="video-creator-preset-button" onClick={() => setDialogType('preset')}><Layers3 size={16} />选择已配置</button>}</div><div className="video-creator-select-list">{selectorRows.map(({ key, label, hint, icon: Icon }) => { const value = selected[key]; const preview = value.cover; return <button key={key} onClick={() => setDialogType(key)}><i><Icon size={19} /></i><span><strong>{label}</strong><small>{value.title || hint}</small></span>{preview && <img src={preview} alt="" />}{key === 'music' && value.audioUrl && <audio src={value.audioUrl} controls onClick={(event) => event.stopPropagation()} />}<ChevronRight size={18} /></button>; })}</div>{isCustomMixcut && <div className="video-creator-upload-grid video-creator-cover-grid">{coverPanel}</div>}</section>
            <section className="video-creator-section"><div className="video-creator-section__head"><span>03</span><div><h2>{isCustomMixcut ? '文案分镜' : '封面与素材'}</h2><p>{isCustomMixcut ? '分镜需要字幕文本，素材可挂在任意分镜，但至少选择 1 个。' : '图片按 2 秒计，单个视频小于 60 秒，总时长不超过 5 分钟。'}</p></div></div>{!isCustomMixcut && <div className="video-creator-upload-grid"><div className="video-creator-cover"><h3>封面图片 <em>必填</em></h3>{cover ? <div className="video-creator-cover-preview"><img src={cover.previewUrl || cover.url} alt="" /><span><strong>{cover.title}</strong><button onClick={() => { if (cover.origin === 'local') URL.revokeObjectURL(cover.previewUrl); setCover(null); }}><Trash2 size={15} />删除</button></span></div> : <label className="video-creator-dropzone"><Image size={26} /><strong>上传封面图片</strong><small>jpg / png / webp</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseCover} /></label>}</div><div className="video-creator-material-actions"><h3>视频素材 <em>必填</em></h3><div><button onClick={() => setDialogType('material')}><Library size={18} />从素材库选择</button><label><Upload size={18} />本地上传<input type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={chooseLocalMaterials} /></label></div><small>已选 {materials.length} 个 · 总时长 {formatDuration(materialDuration)}</small></div></div>}{isCustomMixcut ? <div className="video-scene-builder"><div className="video-scene-builder__toolbar"><button onClick={splitScriptToScenes}><Sparkles size={16} />按文案拆分</button><button onClick={addScene}><Plus size={16} />新增分镜</button><span>{scenes.length} 个分镜 · {sceneMaterialCount} 个素材 · {formatDuration(materialDuration)}</span></div><div className="video-scene-list">{scenes.map((scene, index) => <article className="video-scene-card" key={scene.id}><header><span>分镜 {index + 1}</span><button onClick={() => removeScene(scene.id)} disabled={scenes.length <= 1} aria-label="删除分镜"><Trash2 size={15} /></button></header><label><span>字幕文本 <em>必填</em></span><textarea value={scene.content} onChange={(event) => changeSceneContent(scene.id, event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey && !event.nativeEvent?.isComposing) { event.preventDefault(); splitSceneAtCursor(scene.id, event.currentTarget); } }} placeholder="按回车从光标处分成两个分镜" /></label><div className="video-scene-actions"><button onClick={() => { setActiveSceneId(scene.id); setDialogType('material'); }}><Library size={16} />从素材库选择</button><label><Upload size={16} />本地上传<input type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={(event) => chooseLocalMaterials(event, scene.id)} /></label><small>{(scene.materials || []).length} 个素材</small></div>{(scene.materials || []).length > 0 && <div className="video-creator-material-grid video-scene-material-grid">{scene.materials.map((material) => <article key={`${scene.id}-${material.id}`}><span>{material.type === 'video' && material.file ? <video src={material.previewUrl} muted playsInline /> : material.previewUrl ? <img src={material.previewUrl} alt="" /> : <Video size={24} />}</span><div><strong>{material.title}</strong><small>{material.type === 'video' ? `视频 · ${formatDuration(material.duration)}` : '图片 · 2 秒'}</small></div><button onClick={() => removeSceneMaterial(scene.id, material.id)} aria-label="删除素材"><X size={16} /></button></article>)}</div>}</article>)}</div></div> : materials.length > 0 && <div className="video-creator-material-grid">{materials.map((material) => <article key={material.id}><span>{material.type === 'video' && material.file ? <video src={material.previewUrl} muted playsInline /> : material.previewUrl ? <img src={material.previewUrl} alt="" /> : <Video size={24} />}</span><div><strong>{material.title}</strong><small>{material.type === 'video' ? `视频 · ${formatDuration(material.duration)}` : '图片 · 2 秒'}</small></div><button onClick={() => removeMaterial(material.id)} aria-label="删除素材"><X size={16} /></button></article>)}</div>}</section>
          </main>
          <aside className="video-creator-summary"><span>PRODUCTION SUMMARY</span><h2>制作确认</h2><dl><div><dt>标题</dt><dd>{form.title || '未填写'}</dd></div>{needsHuman && <div><dt>数字人</dt><dd>{selected.human.title || '未选择'}</dd></div>}<div><dt>声音</dt><dd>{selected.voice.title || '未选择'}</dd></div><div><dt>{isMixed ? '混剪模板' : isCustomMixcut ? '包装模板' : '视频包装'}</dt><dd>{selected.videoTemplate.title || '未选择'}</dd></div><div><dt>封面包装</dt><dd>{selected.coverTemplate.title || '未选择'}</dd></div><div><dt>背景音乐</dt><dd>{selected.music.title || '未选择'}</dd></div>{isCustomMixcut && <div><dt>分镜</dt><dd>{scenes.length} 个</dd></div>}<div><dt>素材</dt><dd>{isCustomMixcut ? sceneMaterialCount : materials.length} 个 / {formatDuration(materialDuration)}</dd></div></dl>{uploadProgress && <div className="video-creator-uploading"><RefreshCw className="is-spinning" size={17} />{uploadProgress}</div>}{message && <div className={`video-list-message ${/失败|请|不能|未返回|最多/.test(message) ? 'is-error' : ''}`}>{message}</div>}<div className="video-creator-submit"><button className="outline-button" onClick={() => submit(true)} disabled={Boolean(busy)}>{busy === 'draft' ? '暂存中…' : '暂存'}</button><button className="primary-button" onClick={() => submit(false)} disabled={Boolean(busy)}><Sparkles size={17} />{busy === 'submit' ? '提交中…' : '提交制作'}</button></div><p>提交后会进入制作队列，可在 Video Studio 查看进度。</p></aside>
        </div>
      </>}
      {dialogType && <VideoCreatorDialog type={dialogType} titleOverride={isMixed && dialogType === 'videoTemplate' ? '选择混剪剪辑模板' : isCustomMixcut && dialogType === 'videoTemplate' ? '选择包装混剪模板' : ''} options={resources[dialogType] || []} selected={dialogType === 'material' ? activeSceneMaterials : selected[dialogType]} loading={loadingResources} hasMore={resourcePaging[dialogType]?.hasMore || false} loadingMore={resourcePaging[dialogType]?.loadingMore || false} loadMessage={resourcePaging[dialogType]?.message || ''} onClose={() => { setDialogType(''); setActiveSceneId(''); }} onSelect={(option) => chooseResource(dialogType, option)} onLoadMore={() => loadMoreCreatorResources(dialogType)} />}
    </div>
  );
}

function ResourcePage({ active, language, onNewVideo, authVersion }) {
  const config = pageConfigs[active];
  const { loading, results, loadMore } = useEndpointGroup(config, authVersion);

  if (!config) return null;

  return (
    <div className="resource-page">
      <section className="resource-hero">
        <div>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <button className="primary-button" onClick={active === 'video' ? onNewVideo : undefined}>
          <Plus size={18} />
          <span>{config.actions[0]}</span>
        </button>
      </section>
      <section className="module-actions">
        {config.actions.map((action) => (
          <button key={action} className="module-action">
            <Sparkles size={16} />
            <span>{action}</span>
          </button>
        ))}
      </section>
      <section className="endpoint-grid" aria-busy={loading}>
        {loading ? (
          <div className="endpoint-loading">Loading {config.title}...</div>
        ) : (
          results.map((result) => <EndpointBlock key={result.endpoint.label} result={result} onLoadMore={loadMore} />)
        )}
      </section>
      {active === 'video' && (
        <PreviewPanel language={language} activeMode="mix" setActiveMode={() => {}} />
      )}
    </div>
  );
}

const billingQuotaMap = [
  {
    key: 'digitalHumans',
    label: 'Digital humans',
    icon: UserRound,
    remaining: ['digital_human_remaining', 'digitalHumanRemaining', 'aihuman_remaining', 'aiHumanRemaining', 'human_remaining', 'humanRemaining'],
    total: ['digital_human_total', 'digitalHumanTotal', 'aihuman_total', 'aiHumanTotal', 'human_total', 'humanTotal', 'digital_human_quota', 'digitalHumanQuota'],
  },
  {
    key: 'voices',
    label: 'Voices',
    icon: Mic2,
    remaining: ['voice_remaining', 'voiceRemaining', 'ai_voice_remaining', 'aiVoiceRemaining'],
    total: ['voice_total', 'voiceTotal', 'ai_voice_total', 'aiVoiceTotal', 'voice_quota', 'voiceQuota'],
  },
  {
    key: 'videos',
    label: 'Videos',
    icon: Video,
    remaining: ['video_remaining', 'videoRemaining', 'video_count_remaining', 'videoCountRemaining', 'production_remaining', 'productionRemaining'],
    total: ['video_total', 'videoTotal', 'video_quota', 'videoQuota', 'production_total', 'productionTotal'],
  },
  {
    key: 'music',
    label: 'AI music',
    icon: Music2,
    remaining: ['music_remaining', 'musicRemaining', 'ai_music_remaining', 'aiMusicRemaining'],
    total: ['music_total', 'musicTotal', 'music_quota', 'musicQuota', 'ai_music_total', 'aiMusicTotal'],
  },
];

const billingPick = (source = {}, keys = []) => {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return '';
};
const billingNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};
const billingPayloads = (result = {}) => {
  const raw = result.raw || {};
  return [result.data, raw.data?.data, raw.data, raw]
    .flatMap((payload) => (payload && typeof payload === 'object' ? [payload] : []));
};
const findBillingPlan = (result = {}) => {
  for (const payload of billingPayloads(result)) {
    if (Array.isArray(payload)) return payload[0] || {};
    const plan = payload.user_plan || payload.userPlan || payload.current_plan || payload.currentPlan || payload.plan || payload;
    if (plan && typeof plan === 'object' && !Array.isArray(plan)) return plan;
  }
  return {};
};
const getBillingPlans = (result = {}) => {
  for (const payload of billingPayloads(result)) {
    if (Array.isArray(payload)) return payload;
    for (const key of ['plans', 'plan_list', 'planList', 'packages', 'list', 'items', 'records', 'rows', 'data']) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }
  return [];
};
const formatBillingDate = (value) => {
  if (!value) return '';
  const numeric = Number(value);
  const date = new Date(Number.isFinite(numeric) && numeric > 0 && numeric < 1000000000000 ? numeric * 1000 : value);
  if (Number.isNaN(date.getTime())) return textOf(value);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
};
const formatBillingMoney = (plan = {}) => {
  const amount = billingPick(plan, ['price', 'amount', 'sale_price', 'salePrice', 'pay_amount', 'payAmount']);
  const number = billingNumber(amount);
  if (number === null) return pick(plan.price_text, plan.priceText, plan.display_price, plan.displayPrice, plan.billingText, plan.billing_text) || 'Contact sales';
  const currency = pick(plan.currency, plan.currency_code, plan.currencyCode) || 'USD';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(number);
  } catch {
    return `${currency} ${number}`;
  }
};
const translateBilling = (value, locale, catalog) => translateStatic(textOf(value), locale, catalog);
const billingUnitLabels = {
  digitalHumans: { singular: 'digital human', plural: 'digital humans' },
  voices: { singular: 'voice', plural: 'voices' },
  videos: { singular: 'video', plural: 'videos' },
  music: { singular: 'AI music track', plural: 'AI music tracks' },
};
const billingPlanNameMap = {
  '初级体验版（限 1 次）': 'Starter trial (1 use)',
  '初级体验版（限一次）': 'Starter trial (1 use)',
  '进阶体验版（限 1 次）': 'Advanced trial (1 use)',
  '进阶体验版（限一次）': 'Advanced trial (1 use)',
  '豪华体验版（限 1 次）': 'Premium trial (1 use)',
  '豪华体验版（限一次）': 'Premium trial (1 use)',
  专业版: 'Pro plan',
  视频包: 'Video pack',
  音乐包: 'Music pack',
};
const getBillingPlanTitleSource = (title) => billingPlanNameMap[textOf(title)] || textOf(title);
const formatBillingCount = (count, unit, locale, catalog) => {
  const number = Number(count);
  const labelSource = Number.isFinite(number) && number === 1 ? unit.singular : unit.plural;
  return `${count} ${translateBilling(labelSource, locale, catalog)}`;
};
const normalizeBillingQuota = (source = {}, item, locale = 'en-US', catalog = {}) => {
  const remaining = billingNumber(billingPick(source, item.remaining));
  const total = billingNumber(billingPick(source, item.total));
  const used = total !== null && remaining !== null ? Math.max(total - remaining, 0) : null;
  const percent = total && used !== null ? Math.min(Math.max((used / total) * 100, 0), 100) : 0;

  return {
    ...item,
    remaining,
    total,
    label: translateBilling(item.label, locale, catalog),
    value: remaining !== null && total !== null
      ? `${remaining} / ${total}`
      : remaining !== null
        ? `${formatBillingCount(remaining, billingUnitLabels[item.key], locale, catalog)} ${translateBilling('left', locale, catalog)}`
        : total !== null
          ? `${formatBillingCount(total, billingUnitLabels[item.key], locale, catalog)} ${translateBilling('included', locale, catalog)}`
          : translateBilling('Not included', locale, catalog),
    percent,
  };
};
const normalizePlanCard = (plan = {}, index = 0, locale = 'en-US', catalog = {}) => {
  const quotaText = billingQuotaMap
    .map((item) => {
      const total = billingNumber(billingPick(plan, item.total));
      return total !== null ? formatBillingCount(total, billingUnitLabels[item.key], locale, catalog) : '';
    })
    .filter(Boolean)
    .slice(0, 3);
  const period = pick(plan.period, plan.duration, plan.valid_days && `${plan.valid_days} days`, plan.validDays && `${plan.validDays} days`, plan.cycle, plan.billing_cycle, plan.billingCycle);
  const rawTitle = pick(plan.title, plan.name, plan.plan_name, plan.planName, plan.package_name, plan.packageName);

  return {
    id: pick(plan.id, plan.plan_id, plan.planId, plan.name, `plan-${index}`),
    raw: plan,
    title: translateBilling(rawTitle ? getBillingPlanTitleSource(rawTitle) : `Plan ${index + 1}`, locale, catalog),
    price: translateBilling(formatBillingMoney(plan), locale, catalog),
    period: translateBilling(period || 'One-time quota', locale, catalog),
    summary: quotaText.length ? quotaText.join(' · ') : translateBilling(pick(plan.description, plan.desc, plan.remark, plan.note) || 'Quota package', locale, catalog),
  };
};
const getBillingResult = (results, label) => results.find((result) => result.endpoint.label === label) || {};
const EVONET_DROPIN_CDN = 'https://cdn.jsdelivr.net/npm/cil-dropin-components@latest/dist/index.min.js';
let evonetDropInPromise = null;
const loadEvonetDropIn = () => {
  if (window.DropInSDK) return Promise.resolve(window.DropInSDK);
  if (evonetDropInPromise) return evonetDropInPromise;
  evonetDropInPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${EVONET_DROPIN_CDN}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.DropInSDK), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = EVONET_DROPIN_CDN;
    script.async = true;
    script.onload = () => window.DropInSDK ? resolve(window.DropInSDK) : reject(new Error('Payment SDK did not initialize'));
    script.onerror = () => reject(new Error('Payment SDK failed to load'));
    document.head.appendChild(script);
  });
  return evonetDropInPromise;
};
const normalizeEvonetSession = (result = {}) => {
  const payloads = billingPayloads(result);
  for (const payload of payloads) {
    const params = payload.pay_params || payload.payParams || {};
    const order = payload.order || {};
    const sessionID = pick(params.sessionID, params.sessionId, params.session_id, payload.sessionID, payload.sessionId, payload.session_id, order.evonet_session_id, order.evonetSessionId);
    if (sessionID) {
      return {
        ...payload,
        sessionID,
        order_no: pick(payload.order_no, payload.orderNo, order.order_no, order.orderNo),
        order_id: pick(payload.order_id, payload.orderId, order.id),
        linkUrl: pick(payload.linkUrl, payload.link_url, payload.link, order.evonet_link_url, order.evonetLinkUrl),
        merchantOrderID: pick(payload.order_no, payload.orderNo, order.order_no, order.orderNo, payload.merchantOrderID, payload.merchantOrderId, payload.merchant_order_id),
        merchantTransID: pick(payload.merchantTransID, payload.merchantTransId, payload.merchant_trans_id),
        environment: pick(params.environment, params.env, payload.sdk_environment, payload.sdkEnvironment, payload.environment, payload.env, import.meta.env.VITE_EVONET_ENV) || 'UAT',
      };
    }
  }
  return {};
};
const evonetPaymentMessage = (event = {}) => {
  if (event.type === 'payment_completed') return 'Payment successful. Your plan will update after confirmation.';
  if (event.type === 'payment_cancelled') return 'Payment cancelled.';
  if (event.type === 'payment_not_preformed') return event.message || 'Payment not completed. Please try again.';
  return event.message || 'Payment failed. Please try again.';
};

function EvonetPaymentModal({ checkout, language, onClose, onEvent }) {
  const containerId = 'evonet-dropin-app';
  const [status, setStatus] = useState({ tone: 'loading', text: 'Loading secure checkout...' });

  useEffect(() => {
    let disposed = false;
    let sdk = null;

    const handleEvent = async (event) => {
      if (disposed) return;
      const tone = event.type === 'payment_completed' ? 'success' : event.type === 'payment_cancelled' ? 'idle' : 'error';
      setStatus({ tone, text: evonetPaymentMessage(event) });
      await onEvent(event);
    };

    loadEvonetDropIn()
      .then((DropInSDK) => {
        if (disposed) return;
        setStatus({ tone: 'idle', text: 'Complete the one-time payment in the secure checkout.' });
        sdk = new DropInSDK({
          id: `#${containerId}`,
          type: 'payment',
          sessionID: checkout.session.sessionID,
          locale: language,
          mode: 'embedded',
          environment: checkout.session.environment || 'UAT',
          appearance: { colorBackground: '#ffffff' },
          payment_completed: (event) => handleEvent(event),
          payment_failed: (event) => handleEvent(event),
          payment_not_preformed: (event) => handleEvent(event),
          payment_cancelled: (event) => handleEvent(event),
        });
      })
      .catch((error) => {
        if (!disposed) setStatus({ tone: 'error', text: error.message || 'Payment checkout failed to load.' });
      });

    return () => {
      disposed = true;
      if (sdk && typeof sdk.destroy === 'function') sdk.destroy();
    };
  }, [checkout.session, language, onEvent]);

  return (
    <div className="payment-modal-backdrop" role="presentation">
      <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="evonet-payment-title">
        <header>
          <div>
            <small>One-time payment</small>
            <h2 id="evonet-payment-title">{checkout.plan.title}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close checkout">
            <X size={18} />
          </button>
        </header>
        <div className="payment-modal-summary">
          <span>{checkout.plan.price}</span>
          <small>{checkout.plan.period}</small>
        </div>
        <div className={`payment-modal-status is-${status.tone}`}>
          {status.tone === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{status.text}</span>
        </div>
        <div id={containerId} className="payment-dropin-container" />
      </section>
    </div>
  );
}

function OverseasBillingPage({ language, authVersion }) {
  const localeCatalog = useLocaleCatalog(language);
  const config = pageConfigs.billing;
  const [checkout, setCheckout] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [startingPlanId, setStartingPlanId] = useState('');
  const { loading, results } = useEndpointGroup(config, authVersion);
  const currentResult = getBillingResult(results, 'Current plan');
  const planResult = getBillingResult(results, 'Plan list');
  const currentPlan = findBillingPlan(currentResult);
  const planCards = getBillingPlans(planResult).map((plan, index) => normalizePlanCard(plan, index, language, localeCatalog));
  const quotas = billingQuotaMap.map((item) => normalizeBillingQuota(currentPlan, item, language, localeCatalog));
  const rawPlanName = pick(currentPlan.title, currentPlan.name, currentPlan.plan_name, currentPlan.planName, currentPlan.package_name, currentPlan.packageName);
  const planName = translateBilling(rawPlanName ? getBillingPlanTitleSource(rawPlanName) : (currentResult.authMissing ? 'Sign in required' : 'No active plan'), language, localeCatalog);
  const expireText = formatBillingDate(pick(currentPlan.expire_at, currentPlan.expireAt, currentPlan.end_at, currentPlan.endAt, currentPlan.valid_until, currentPlan.validUntil));
  const updatedText = formatBillingDate(pick(currentPlan.updated_at, currentPlan.updatedAt, currentPlan.created_at, currentPlan.createdAt));
  const hasCurrentPlan = Boolean(Object.keys(currentPlan).length);
  const message = currentResult.authMissing
    ? 'Sign in to view your quota and current plan.'
    : currentResult.ok === false && currentResult.message
      ? currentResult.message
      : '';
  const startOneTimePayment = async (plan) => {
    setPaymentMessage('');
    setPaymentError('');
    setStartingPlanId(plan.id);
    const result = await createEvonetOneTimePaymentSession({ plan: plan.raw, locale: language });
    setStartingPlanId('');
    if (!result.ok) {
      setPaymentError(result.authMissing ? 'Sign in before starting checkout.' : result.message || 'Payment checkout is not available yet.');
      return;
    }
    const session = normalizeEvonetSession(result);
    if (!session.sessionID) {
      setPaymentError('Payment session was not returned by the server.');
      return;
    }
    setCheckout({ plan, session });
  };
  const handlePaymentEvent = useCallback(async (event) => {
    if (!checkout?.session) return;
    const result = await reportEvonetOneTimePaymentEvent({ session: checkout.session, event });
    const text = evonetPaymentMessage(event);
    if (event.type === 'payment_completed') {
      setPaymentMessage(text);
      window.dispatchEvent(new Event('yixiu-auth-change'));
    } else {
      setPaymentError(text);
    }
    if (!result.ok && !result.authMissing) setPaymentError(result.message || 'Payment result could not be recorded.');
  }, [checkout]);

  return (
    <div className="billing-page">
      <section className="billing-hero">
        <div>
          <span className="billing-eyebrow">PLANS & BILLING</span>
          <h1>Plans & billing</h1>
          <p>Review your active plan, remaining production quota, and available packages.</p>
        </div>
        <div className="billing-hero-actions">
          <button className="outline-button" onClick={() => window.location.reload()} disabled={loading}>
            <RefreshCw size={17} />
            {loading ? 'Refreshing' : 'Refresh'}
          </button>
          <a className="primary-button" href="mailto:feedback@xyaip.fun">
            <CircleDollarSign size={17} />
            Upgrade
          </a>
        </div>
      </section>

      {message && (
        <section className={`billing-message ${currentResult.authMissing ? '' : 'is-error'}`}>
          <AlertCircle size={18} />
          <span>{message}</span>
        </section>
      )}
      {paymentMessage && (
        <section className="billing-message is-success">
          <CheckCircle2 size={18} />
          <span>{paymentMessage}</span>
        </section>
      )}
      {paymentError && (
        <section className="billing-message is-error">
          <AlertCircle size={18} />
          <span>{paymentError}</span>
        </section>
      )}

      <section className="billing-summary-grid" aria-busy={loading}>
        <article className="billing-current-card">
          <div className="billing-card-head">
            <span><CircleDollarSign size={20} /></span>
            <div>
              <small>Current plan</small>
              <h2>{planName}</h2>
            </div>
          </div>
          <dl className="billing-current-meta">
            <div><dt>Status</dt><dd>{hasCurrentPlan ? 'Active' : currentResult.authMissing ? 'Locked' : 'Not started'}</dd></div>
            <div><dt>Renews / expires</dt><dd>{expireText || 'Not set'}</dd></div>
            <div><dt>Last updated</dt><dd>{updatedText || 'Not available'}</dd></div>
          </dl>
        </article>

        <div className="billing-quota-grid">
          {quotas.map(({ key, label, icon: Icon, value, percent }) => (
            <article className="billing-quota-card" key={key}>
              <div>
                <span><Icon size={18} /></span>
                <strong>{label}</strong>
              </div>
              <b>{value}</b>
              <i><em style={{ width: `${percent}%` }} /></i>
            </article>
          ))}
        </div>
      </section>

      <section className="billing-plans-panel">
        <div className="billing-section-head">
          <div>
            <h2>Available plans</h2>
            <p>{planCards.length ? `${planCards.length} ${translateBilling('packages available', language, localeCatalog)}` : 'No published packages returned yet'}</p>
          </div>
          <a href="mailto:feedback@xyaip.fun">View invoices <ChevronRight size={16} /></a>
        </div>
        {loading ? (
          <div className="billing-empty">Loading billing data...</div>
        ) : planCards.length ? (
          <div className="billing-plan-list">
            {planCards.map((plan) => (
              <article className="billing-plan-card" key={plan.id}>
                <div>
                  <strong>{plan.title}</strong>
                  <small>{plan.summary}</small>
                </div>
                <span>
                  <b>{plan.price}</b>
                  <small>{plan.period}</small>
                </span>
                <button type="button" onClick={() => startOneTimePayment(plan)} disabled={Boolean(startingPlanId)}>
                  {startingPlanId === plan.id ? 'Starting' : 'Choose'}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="billing-empty">{planResult.ok === false ? planResult.message || 'Plan list unavailable.' : 'No plans available yet.'}</div>
        )}
      </section>
      {checkout && (
        <EvonetPaymentModal
          checkout={checkout}
          language={language}
          onClose={() => setCheckout(null)}
          onEvent={handlePaymentEvent}
        />
      )}
    </div>
  );
}

const phoneCountryCodes = [
  { value: '+1', label: 'US / Canada +1' },
  { value: '+44', label: 'United Kingdom +44' },
  { value: '+61', label: 'Australia +61' },
  { value: '+81', label: 'Japan +81' },
  { value: '+82', label: 'Korea +82' },
  { value: '+86', label: 'China +86' },
  { value: '+852', label: 'Hong Kong +852' },
  { value: '+886', label: 'Taiwan +886' },
  { value: '+49', label: 'Germany +49' },
  { value: '+33', label: 'France +33' },
  { value: '+34', label: 'Spain +34' },
  { value: '+39', label: 'Italy +39' },
  { value: '+31', label: 'Netherlands +31' },
  { value: '+55', label: 'Brazil +55' },
  { value: '+7', label: 'Russia +7' },
  { value: '+91', label: 'India +91' },
  { value: '+62', label: 'Indonesia +62' },
  { value: '+84', label: 'Vietnam +84' },
  { value: '+66', label: 'Thailand +66' },
  { value: '+90', label: 'Turkey +90' },
];

const readStoredUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem('user_info') || '{}') || {};
  } catch {
    return {};
  }
};

function SettingsPage({ authVersion, onLogin, onLogout }) {
  const [profile, setProfile] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [phoneForm, setPhoneForm] = useState({ countryCode: '+1', phone: '', code: '' });
  const [busy, setBusy] = useState('');
  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      setProfile({});
      return undefined;
    }
    let ignore = false;
    setLoading(true);
    apiFetch('/api/user/info', { timeoutMs: 10000 }).then((result) => {
      if (ignore) return;
      setLoading(false);
      if (result.ok) {
        const nextProfile = result.data?.user || result.data || {};
        setProfile(nextProfile);
        window.localStorage.setItem('user_info', JSON.stringify(nextProfile));
      } else {
        setMessage(result.message || 'Profile loading failed');
      }
    });
    return () => {
      ignore = true;
    };
  }, [token, authVersion]);

  const updatePassword = (key, value) => setPasswordForm((current) => ({ ...current, [key]: value }));
  const updatePhone = (key, value) => setPhoneForm((current) => ({ ...current, [key]: value }));

  const submitPassword = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword.length < 8) {
      setMessage('New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('The two new passwords do not match.');
      return;
    }
    setBusy('password');
    setMessage('');
    const result = await changePassword(passwordForm);
    setBusy('');
    if (result.ok) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Password updated. Please keep your new password safe.');
      return;
    }
    setMessage(result.message || 'Password change failed');
  };

  const sendCode = async () => {
    if (!phoneForm.phone.trim()) {
      setMessage('Enter a phone number first.');
      return;
    }
    setBusy('send-code');
    setMessage('');
    const result = await sendPhoneVerificationCode(phoneForm);
    setBusy('');
    setMessage(result.ok ? 'Verification code sent.' : result.message || 'Verification code failed');
  };

  const submitPhone = async (event) => {
    event.preventDefault();
    if (!phoneForm.phone.trim() || !phoneForm.code.trim()) {
      setMessage('Enter phone number and verification code.');
      return;
    }
    setBusy('bind-phone');
    setMessage('');
    const result = await bindPhoneNumber(phoneForm);
    setBusy('');
    if (result.ok) {
      setMessage('Phone number bound successfully.');
      setProfile((current) => ({ ...current, phone: phoneForm.phone, countryCode: phoneForm.countryCode }));
      setPhoneForm((current) => ({ ...current, code: '' }));
      return;
    }
    setMessage(result.message || 'Phone binding failed');
  };

  const email = pick(profile.email, profile.mail, profile.account, profile.username);
  const nickname = pick(profile.nickname, profile.name, profile.userName, profile.user_name);
  const phone = pick(profile.phone, profile.mobile, profile.tel);

  if (!token) {
    return (
      <div className="settings-page">
        <section className="settings-hero">
          <div>
            <span>ACCOUNT SECURITY</span>
            <h1>Settings</h1>
          </div>
        </section>
        <div className="settings-empty">
          <UserRound size={34} />
          <strong>Sign in to manage account security.</strong>
          <button className="primary-button" onClick={onLogin}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <section className="settings-hero">
        <div>
          <span>ACCOUNT SECURITY</span>
          <h1>Settings</h1>
        </div>
        <button className="outline-button" onClick={onLogout}>
          <UserRound size={17} />
          Sign out
        </button>
      </section>

      {message && <div className={`settings-message ${/failed|fail|not available|match|first|required|Enter/i.test(message) ? 'is-error' : ''}`}>{message}</div>}

      <section className="settings-grid" aria-busy={loading}>
        <article className="settings-card">
          <header>
            <Mail size={20} />
            <div><h2>Account</h2></div>
          </header>
          <dl className="settings-profile">
            <div><dt>Email</dt><dd>{email || 'Not available'}</dd></div>
            <div><dt>Nickname</dt><dd>{nickname || 'Not set'}</dd></div>
            <div><dt>Phone</dt><dd>{phone || 'Optional'}</dd></div>
          </dl>
        </article>

        <form className="settings-card settings-form" onSubmit={submitPassword}>
          <header>
            <KeyRound size={20} />
            <div><h2>Change password</h2></div>
          </header>
          <label>
            <span>Current password</span>
            <input type="password" value={passwordForm.currentPassword} onChange={(event) => updatePassword('currentPassword', event.target.value)} required />
          </label>
          <label>
            <span>New password</span>
            <input type="password" minLength={8} value={passwordForm.newPassword} onChange={(event) => updatePassword('newPassword', event.target.value)} required />
          </label>
          <label>
            <span>Confirm new password</span>
            <input type="password" minLength={8} value={passwordForm.confirmPassword} onChange={(event) => updatePassword('confirmPassword', event.target.value)} required />
          </label>
          <button className="primary-button" disabled={busy === 'password'}>
            <ShieldCheck size={17} />
            {busy === 'password' ? 'Saving' : 'Update password'}
          </button>
        </form>

        <form className="settings-card settings-form" onSubmit={submitPhone}>
          <header>
            <Phone size={20} />
            <div><h2>Phone verification</h2></div>
          </header>
          <div className="phone-row">
            <label>
              <span>Country code</span>
              <select value={phoneForm.countryCode} onChange={(event) => updatePhone('countryCode', event.target.value)}>
                {phoneCountryCodes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <label>
              <span>Phone number</span>
              <input inputMode="tel" value={phoneForm.phone} onChange={(event) => updatePhone('phone', event.target.value.replace(/[^\d\s()-]/g, ''))} required />
            </label>
          </div>
          <div className="phone-code-row">
            <label>
              <span>Verification code</span>
              <input inputMode="numeric" value={phoneForm.code} onChange={(event) => updatePhone('code', event.target.value)} required />
            </label>
            <button type="button" className="outline-button" onClick={sendCode} disabled={busy === 'send-code'}>
              {busy === 'send-code' ? 'Sending' : 'Send code'}
            </button>
          </div>
          <button className="primary-button" disabled={busy === 'bind-phone'}>
            <CheckCircle2 size={17} />
            {busy === 'bind-phone' ? 'Binding' : 'Bind phone'}
          </button>
        </form>
      </section>
    </div>
  );
}

function BillingPage({ language, authVersion }) {
  const useChinaBilling = language === 'zh-CN' || language === 'zh-TW';

  if (!useChinaBilling) {
    return <OverseasBillingPage language={language} authVersion={authVersion} />;
  }

  return (
    <div className="china-billing-page">
      <section className="china-billing-hero">
        <div className="china-billing-copy">
          <span className="china-billing-eyebrow">中文服务区</span>
          <h1>账单与套餐</h1>
          <p>中文界面的套餐购买、续费和账单服务统一在喀理小程序中完成。</p>
          <ol>
            <li><span>1</span><div><strong>打开微信扫一扫</strong><small>扫描右侧小程序码进入喀理小程序</small></div></li>
            <li><span>2</span><div><strong>登录同一账号</strong><small>使用与当前工作台一致的账号，确保套餐正确到账</small></div></li>
            <li><span>3</span><div><strong>选择套餐并完成支付</strong><small>支付成功后返回工作台刷新，即可查看最新额度</small></div></li>
          </ol>
          <div className="china-billing-note"><ShieldCheck size={18} /><span>请勿通过私人转账购买套餐，以小程序内展示的订单和支付结果为准。</span></div>
        </div>
        <aside className="china-billing-qr">
          <span>微信扫码进入小程序</span>
          <div><img src="/payments/kali-mini-program.png" alt="喀理小程序码" /></div>
          <strong>喀理小程序</strong>
          <small>套餐购买 · 续费 · 账单查询</small>
        </aside>
      </section>
      <section className="china-billing-help">
        <div><CircleDollarSign size={20} /><span><strong>支付后没有到账？</strong><small>请先返回工作台刷新套餐额度；仍未更新时，保留小程序订单号并联系客服。</small></span></div>
        <a href="mailto:feedback@xyaip.fun">联系支持 <ChevronRight size={16} /></a>
      </section>
    </div>
  );
}

function TemplatesPage({ authVersion }) {
  const templateEndpoints = useMemo(() => pageConfigs.templates.endpoints.slice(0, 2), []);
  const [activeLabel, setActiveLabel] = useState(templateEndpoints[0]?.label || '');
  const [playingTemplateKey, setPlayingTemplateKey] = useState('');
  const gridWrapRef = useRef(null);
  const pendingScrollTopRef = useRef(null);
  const [groups, setGroups] = useState(() =>
    templateEndpoints.map((endpoint) => ({
      endpoint,
      items: [],
      page: 1,
      nextCursor: '',
      hasMore: false,
      loading: false,
      loadingMore: false,
      message: '',
    })),
  );
  const loadTemplateGroup = async (endpoint, { nextPage = 1, append = false, cursor = '' } = {}) => {
    const result = await apiFetch(endpoint.path, {
      ...endpoint,
      params: {
        ...(endpoint.params || {}),
        page: nextPage,
        page_size: TEMPLATE_PAGE_SIZE,
        pageSize: TEMPLATE_PAGE_SIZE,
        limit: TEMPLATE_PAGE_SIZE,
        ...(cursor ? { sid: cursor } : {}),
      },
      timeoutMs: 12000,
    });
    const list = toList(result.data).map((item, index) =>
      normalizeTemplate(item, append ? (nextPage - 1) * TEMPLATE_PAGE_SIZE + index : index, endpoint.label),
    );
    const nextCursor = getTemplateNextCursor(result);

    return {
      endpoint,
      items: list,
      page: nextPage,
      nextCursor,
      hasMore: result.ok && getTemplateHasMore({ result, cursor, list, page: nextPage }),
      loading: false,
      loadingMore: false,
      message: result.ok ? '' : getResultMessage(result, '模板列表获取失败'),
      ok: result.ok,
      authMissing: result.authMissing,
    };
  };

  useEffect(() => {
    let ignore = false;
    setGroups((current) => current.map((group) => ({ ...group, loading: true, message: '' })));

    Promise.all(templateEndpoints.map((endpoint) => loadTemplateGroup(endpoint))).then((loaded) => {
      if (ignore) return;
      setGroups(loaded);
      setActiveLabel((current) => current || loaded[0]?.endpoint.label || '');
    });

    return () => {
      ignore = true;
    };
  }, [authVersion, templateEndpoints]);

  const activeGroup = groups.find((group) => group.endpoint.label === activeLabel) || groups[0];
  const isVideoTemplateGroup = activeGroup?.endpoint.label === 'Video templates';

  useEffect(() => {
    if (pendingScrollTopRef.current === null) return;
    const element = gridWrapRef.current;
    if (!element) return;

    const scrollTop = pendingScrollTopRef.current;
    window.requestAnimationFrame(() => {
      element.scrollTop = scrollTop;
    });
    if (!activeGroup?.loadingMore) pendingScrollTopRef.current = null;
  }, [activeGroup?.items.length, activeGroup?.loadingMore, activeLabel]);

  const loadMoreTemplates = async () => {
    if (!activeGroup || activeGroup.loadingMore || activeGroup.loading || !activeGroup.hasMore) return;
    pendingScrollTopRef.current = gridWrapRef.current?.scrollTop ?? null;
    setGroups((current) =>
      current.map((group) => (group.endpoint.label === activeGroup.endpoint.label ? { ...group, loadingMore: true } : group)),
    );

    const next = await loadTemplateGroup(activeGroup.endpoint, {
      nextPage: activeGroup.page + 1,
      append: true,
      cursor: activeGroup.nextCursor,
    });

    setGroups((current) =>
      current.map((group) =>
        group.endpoint.label === activeGroup.endpoint.label
          ? { ...next, items: group.items.concat(next.items) }
          : group,
      ),
    );
  };
  const switchTemplateGroup = (label) => {
    setActiveLabel(label);
    setPlayingTemplateKey('');
    pendingScrollTopRef.current = null;
    window.requestAnimationFrame(() => {
      if (gridWrapRef.current) gridWrapRef.current.scrollTop = 0;
    });
  };
  const playTemplate = (templateKey, playable) => {
    if (!playable) return;
    setPlayingTemplateKey(templateKey);
  };

  return (
    <div className="template-page">
      <section className="resource-hero template-hero">
        <div>
          <h1>Templates</h1>
          <p>Browse video and cover templates in a compact 9-grid view.</p>
        </div>
        <button className="primary-button" onClick={activeGroup?.hasMore ? loadMoreTemplates : undefined} disabled={!activeGroup?.hasMore || activeGroup?.loadingMore}>
          <Plus size={18} />
          <span>{activeGroup?.loadingMore ? 'Loading' : 'Load more'}</span>
        </button>
      </section>
      <div className="template-tabs">
        {groups.map((group) => (
          <button
            key={group.endpoint.label}
            className={group.endpoint.label === activeGroup?.endpoint.label ? 'is-active' : ''}
            onClick={() => switchTemplateGroup(group.endpoint.label)}
          >
            <span>{group.endpoint.label}</span>
            <strong>{group.items.length}</strong>
          </button>
        ))}
      </div>
      <section className="template-grid-wrap" ref={gridWrapRef} aria-busy={activeGroup?.loading}>
        {activeGroup?.loading ? (
          <div className="endpoint-loading">Loading templates...</div>
        ) : activeGroup?.items.length ? (
          <div className="template-grid">
            {activeGroup.items.map((template, index) => {
              const templateKey = `${activeGroup.endpoint.label}-${template.id}-${index}`;
              const playable = isVideoTemplateGroup && Boolean(template.demo);
              const isPlaying = playingTemplateKey === templateKey;
              const MediaTag = playable && !isPlaying ? 'button' : 'span';
              return (
              <article className={`template-card ${playable ? 'is-playable' : ''}`} key={templateKey}>
                <MediaTag
                  {...(playable ? { type: 'button', onClick: () => playTemplate(templateKey, playable), 'aria-label': `Play ${template.title}` } : {})}
                  className="template-card__media"
                >
                  {isPlaying ? (
                    <video src={template.demo} poster={template.cover || undefined} controls autoPlay playsInline />
                  ) : (
                    <>
                      {template.cover ? <img src={template.cover} alt="" loading="lazy" /> : <GalleryVerticalEnd size={28} />}
                      {playable && (
                        <span className="template-card__demo">
                          <Play size={13} />
                          播放
                        </span>
                      )}
                    </>
                  )}
                </MediaTag>
                <span className="template-card__body">
                  <strong>{template.title}</strong>
                  <small>{template.meta}</small>
                  {template.tags.length > 0 && (
                    <em>
                      {template.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </em>
                  )}
                </span>
              </article>
            );
            })}
          </div>
        ) : (
          <div className="endpoint-empty">{activeGroup?.message || 'No templates yet.'}</div>
        )}
        {activeGroup?.hasMore && !activeGroup.loading && (
          <button className="load-more-button template-load-more" onClick={loadMoreTemplates} disabled={activeGroup.loadingMore}>
            {activeGroup.loadingMore ? 'Loading' : 'Load more'}
          </button>
        )}
      </section>
    </div>
  );
}

const textOf = (value) => (value === null || value === undefined ? '' : `${value}`.trim());
const pick = (...values) => values.map(textOf).find(Boolean) || '';
const arrayOf = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.list)) return value.list;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.records)) return value.records;
  if (Array.isArray(value?.rows)) return value.rows;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};
const categoryFrom = (value) => {
  const name = textOf(value);
  const exact = trendCategories.find((item) =>
    item.aliases.some((alias) => alias.toLowerCase() === name.toLowerCase()),
  );
  if (exact) return exact;
  return trendCategories.find((item) => item.aliases.some((alias) => alias && name.includes(alias))) || trendCategories[0];
};
const categoryRequest = (category) => category.aliases.find((alias) => /^[a-z]+$/i.test(alias)) || category.key;
const normalizeTopic = (item = {}, index = 0) => ({
  id: pick(item.id, item.item_id, item.uuid, item.simHash, item.url, `${index}`),
  rank: Number(item.rank || item.index || item.sort || index + 1),
  title: pick(item.title, item.name, item.keyword, item.hot_title, item.topic, `热点 ${index + 1}`),
  summary: pick(item.summary, item.desc, item.description, item.subtitle, item.content, item.reason, item.brief),
  url: pick(item.url, item.link),
});
const makeBoard = (source = {}, index = 0) => {
  const rawCategory = pick(source.category, source.cat_name, source.channel, source.type_name, source.tab, source.name, '综合');
  const category = categoryFrom(rawCategory);
  const topics = arrayOf(source.items || source.list || source.hot_list || source.rank_list || source.topics).map(normalizeTopic);
  return {
    id: pick(source.id, source.board_id, source.code, source.title, source.name, `${index}`),
    categoryKey: category.key,
    categoryLabel: category.label,
    title: pick(source.title, source.name, `${category.label} 热榜`),
    icon: pick(source.icon, source.emoji) || category.icon,
    topics,
  };
};
const groupToBoards = (items = []) => {
  const groups = {};
  items.forEach((item, index) => {
    const category = categoryFrom(pick(item.category, item.channel, item.type_name, item.tab, item.provider, '综合'));
    if (!groups[category.key]) {
      groups[category.key] = {
        id: category.key,
        categoryKey: category.key,
        categoryLabel: category.label,
        title: category.label,
        icon: category.icon,
        topics: [],
      };
    }
    groups[category.key].topics.push(normalizeTopic(item, index));
  });
  return Object.values(groups).map((board) => ({
    ...board,
    topics: board.topics
      .slice()
      .sort((a, b) => (a.rank || 0) - (b.rank || 0))
      .map((topic, index) => ({ ...topic, rank: index + 1 })),
  }));
};
const normalizeBoards = (response = {}) => {
  const payload = response.data?.data || response.data || response || {};
  const nested = payload.boards || payload.categories || payload.list || arrayOf(payload);
  if (!Array.isArray(nested) || !nested.length) return [];
  if (nested[0]?.items || nested[0]?.list || nested[0]?.hot_list || nested[0]?.rank_list || nested[0]?.topics) {
    return nested.map(makeBoard).filter((board) => board.topics.length);
  }
  return groupToBoards(nested);
};
const mergeBoards = (current, next) => {
  const map = new Map(current.map((board) => [board.id, { ...board, topics: board.topics.slice() }]));
  next.forEach((board) => {
    const existing = map.get(board.id);
    if (existing) existing.topics = existing.topics.concat(board.topics);
    else map.set(board.id, board);
  });
  return Array.from(map.values());
};
const normalizeMediaBoards = (response = {}) => {
  const payload = response.data?.data || response.data || response || {};
  const sourceIconMap = Object.fromEntries(mediaSources.map((item) => [item.key, item.icon]));
  return Object.values(
    arrayOf(payload).reduce((boards, item, index) => {
      const source = pick(item.source, item.platform, item.site, '其他媒体');
      if (!boards[source]) {
        boards[source] = {
          id: `media-${source}`,
          source,
          title: source,
          icon: sourceIconMap[source] || '📰',
          categoryLabel: pick(item.rootCategory, item.category, '媒体'),
          topics: [],
        };
      }
      boards[source].topics.push({ ...normalizeTopic(item, index), heat: '' });
      return boards;
    }, {}),
  ).sort((a, b) => {
    const ai = mediaSources.findIndex((item) => item.key === a.source);
    const bi = mediaSources.findIndex((item) => item.key === b.source);
    return (ai === -1 ? mediaSources.length : ai) - (bi === -1 ? mediaSources.length : bi);
  });
};

const normalizeInstructionType = (type) => {
  const text = textOf(type);
  const normalized = text.toLowerCase();
  const value = instructionTypeAliases[text] || instructionTypeAliases[normalized] || instructionSetTypes[0].value;
  return instructionSetTypes.find((item) => item.value === value) || instructionSetTypes[0];
};
const normalizeTagList = (agent = {}) => {
  const raw = agent.tags || agent.tag_list || agent.labels || agent.label_list;
  const tags = Array.isArray(raw)
    ? raw.map((item) => pick(item.name, item.title, item.label, item))
    : textOf(raw).split(/[,，、\s]+/);
  const single = pick(agent.tag, agent.label, agent.category, agent.type, agent.kind, agent.scene, agent.group);
  return Array.from(new Set([single].concat(tags).map(textOf).filter(Boolean))).slice(0, 3);
};
const normalizePointList = (value) => {
  if (Array.isArray(value)) return value.map((item) => pick(item.name, item.title, item.label, item.content, item.text, item)).filter(Boolean);
  return textOf(value)
    .split(/[,，、；;\n\r]+/)
    .map(textOf)
    .filter(Boolean);
};
const normalizeAgentImage = (url) => {
  const imageUrl = textOf(url);
  if (!imageUrl) return '';
  if (/^\/\//.test(imageUrl)) return `https:${imageUrl}`;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/')) return `https://yixiuapi.xyaip.fun${imageUrl}`;
  if (/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(imageUrl)) return imageUrl;
  return '';
};
const isOwnAgent = (agent = {}) => {
  const flag = agent.isUserCreated ?? agent.is_user_created ?? agent.isMine ?? agent.is_mine ?? agent.editable ?? agent.canEdit ?? agent.can_edit;
  return flag === true || flag === 1 || flag === '1' || `${flag}`.toLowerCase() === 'true';
};
const getInstructionText = (agent = {}) =>
  pick(agent.instructions, agent.instruction, agent.prompt, agent.promptText, agent.prompt_text, agent.systemPrompt, agent.system_prompt, agent.content);
const getAgentList = (result) => {
  const payload = result.data?.data || result.data || result || {};
  if (Array.isArray(payload.instruction_sets)) return payload.instruction_sets;
  if (Array.isArray(payload.instructionSets)) return payload.instructionSets;
  if (Array.isArray(payload.prompts)) return payload.prompts;
  if (Array.isArray(payload.agents)) return payload.agents;
  if (Array.isArray(payload.aihumans)) return payload.aihumans;
  return arrayOf(payload);
};
const agentPayloads = (result = {}) => {
  const raw = compactObject(result.raw);
  const rawData = compactObject(raw.data);
  const rawNestedData = compactObject(rawData.data);
  const payloads = [compactObject(result.data), rawNestedData, rawData, raw];
  return payloads
    .flatMap((payload) => [payload, compactObject(payload.pagination), compactObject(payload.pager), compactObject(payload.meta)])
    .filter((payload) => Object.keys(payload).length);
};
const getAgentNextCursor = (result = {}) => pick(
  ...agentPayloads(result).flatMap((payload) => [
    payload.next_cursor,
    payload.nextCursor,
    payload.start_cursor,
    payload.startCursor,
    payload.cursor,
    payload.sid,
  ]),
);
const normalizePaginationFlag = (value) => {
  if (typeof value !== 'string') return Boolean(value);
  return !['', '0', 'false', 'no', 'off', 'null', 'undefined'].includes(value.trim().toLowerCase());
};
const getAgentHasMore = ({ result, page, list, uniqueCount, loadedCount, cursor }) => {
  if (!result.ok || !list.length || (page > 1 && !uniqueCount)) return false;
  const payloads = agentPayloads(result);
  const nextCursor = getAgentNextCursor(result);
  if (nextCursor && nextCursor !== cursor) return true;

  const total = Number(pick(...payloads.flatMap((payload) => [payload.total, payload.total_count, payload.totalCount, payload.count]))) || 0;
  const totalPage = Number(pick(...payloads.flatMap((payload) => [payload.total_page, payload.totalPage, payload.total_pages, payload.totalPages, payload.pages, payload.last_page, payload.lastPage]))) || 0;
  if (totalPage) return page < totalPage;
  if (total) return loadedCount < total;

  const explicit = payloads
    .map((payload) => (payload.has_more !== undefined ? payload.has_more : payload.hasMore))
    .find((value) => value !== undefined);
  if (explicit !== undefined) return normalizePaginationFlag(explicit);

  const nextPage = Number(pick(...payloads.flatMap((payload) => [payload.next_page, payload.nextPage]))) || 0;
  if (nextPage) return nextPage > page;

  // Some deployments cap the response below the requested page size. Probe the
  // next page once and stop when it is empty or contains no new instruction sets.
  return true;
};
const mapAgent = (item = {}, index = 0) => {
  const type = normalizeInstructionType(
    pick(item.type, item.instructionSetType, item.instruction_set_type, item.creativeType, item.creative_type, item.categoryType, item.category_type),
  );
  const id = pick(
    item.instructionSetId,
    item.instruction_set_id,
    item.promptId,
    item.prompt_id,
    item.id,
    item.agentId,
    item.agent_id,
    item.aihumanId,
    item.aihuman_id,
    item.taskId,
    item.task_id,
    `agent-${index}`,
  );
  const name =
    pick(
      item.name,
      item.title,
      item.custom_tag,
      item.agentName,
      item.agent_name,
      item.instructionSetName,
      item.instruction_set_name,
      item.promptName,
      item.prompt_name,
      item.aihumanName,
      item.aihuman_name,
      item.nickname,
    ) || `创作助手 ${index + 1}`;
  const tags = normalizeTagList(item);
  const points = [
    item.featurePoints,
    item.feature_points,
    item.functionPoints,
    item.function_points,
    item.features,
    item.capabilities,
    item.abilities,
    item.scenes,
  ].flatMap(normalizePointList);
  const image = normalizeAgentImage(
    pick(
      item.icon_url,
      item.iconUrl,
      item.icon,
      item.logo_url,
      item.logoUrl,
      item.avatar,
      item.avatar_url,
      item.avatarUrl,
      item.cover,
      item.cover_url,
      item.image,
      item.image_url,
      item.photo,
      item.head_img,
      item.headImg,
    ),
  );

  return {
    id: String(id),
    name,
    type,
    tags: tags.length ? tags : ['创作助手'],
    points: Array.from(new Set(points.concat(tags))).slice(0, 4),
    desc: pick(item.description, item.desc, item.intro, item.remark, item.welcome) || `${name} 已就绪，可以开始创作。`,
    instructions: getInstructionText(item),
    image,
    isOwn: isOwnAgent(item),
  };
};
const getPendingFlow = () => {
  try {
    const flow = JSON.parse(window.localStorage.getItem(HOT_TOPIC_FLOW_KEY) || 'null');
    return flow?.topic ? flow : null;
  } catch (error) {
    return null;
  }
};

function AssistantPage({ authVersion, useHotTopicFlow, onLogin, onCreateAgent, onOpenGenerator }) {
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [flow, setFlow] = useState(() => (useHotTopicFlow ? getPendingFlow() : null));
  const agentsRef = useRef([]);
  const nextCursorRef = useRef('');
  const loadingRef = useRef(false);
  const loadMoreRef = useRef(null);
  const authed = Boolean(getAccessToken());

  const loadAgents = useCallback(async ({ nextPage = 1, append = false } = {}) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (append) setLoadingMore(true);
    else setLoading(true);
    setLoadError('');
    const cursor = append ? nextCursorRef.current : '';
    try {
      const result = await apiFetch('/api/instruction_sets', {
        auth: authed,
        params: {
          page: nextPage,
          page_size: PAGE_SIZE,
          pageSize: PAGE_SIZE,
          limit: PAGE_SIZE,
          include_total: true,
          ...(cursor ? { start_cursor: cursor, cursor, sid: cursor } : {}),
        },
      });
      if (!result.ok) {
        setLoadError(getResultMessage(result, '创作助手列表获取失败'));
        if (!append) {
          agentsRef.current = [];
          setAgents([]);
          setHasMore(false);
        }
        return;
      }

      const received = getAgentList(result).map((item, index) => mapAgent(item, (nextPage - 1) * PAGE_SIZE + index));
      const current = append ? agentsRef.current : [];
      const knownIds = new Set(current.map((agent) => agent.id));
      const unique = append ? received.filter((agent) => !knownIds.has(agent.id)) : received;
      const combined = append ? current.concat(unique) : unique;
      const nextCursor = getAgentNextCursor(result);

      agentsRef.current = combined;
      nextCursorRef.current = nextCursor && nextCursor !== cursor ? nextCursor : '';
      setAgents(combined);
      setPage(nextPage);
      setHasMore(getAgentHasMore({ result, page: nextPage, list: received, uniqueCount: unique.length, loadedCount: combined.length, cursor }));
    } finally {
      loadingRef.current = false;
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, [authed]);

  useEffect(() => {
    setFlow(useHotTopicFlow ? getPendingFlow() : null);
    loadAgents({ nextPage: 1, append: false });
  }, [authVersion, useHotTopicFlow, loadAgents]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || loading || loadingMore || loadError || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadAgents({ nextPage: page + 1, append: true });
    }, { root: null, rootMargin: '280px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [agents.length, hasMore, loadError, loading, loadingMore, page, loadAgents]);

  const selectAgent = (agent) => {
    if (!authed) {
      onLogin();
      return;
    }
    const context = {
      instructionSetId: agent.id,
      instructionSetTitle: agent.name,
      instructionSetType: agent.type.value,
      description: agent.desc,
      featurePoints: agent.points,
      tags: agent.tags,
      iconUrl: agent.image,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(AGENT_CONTEXT_KEY, JSON.stringify(context));
    if (flow) {
      window.localStorage.setItem(HOT_TOPIC_FLOW_KEY, JSON.stringify({ ...flow, ...context, autoGenerate: false }));
    }
    setSelected(agent.id);
    onOpenGenerator(agent);
  };
  const createAgent = () => {
    if (!authed) onLogin();
    else onCreateAgent();
  };
  const editAgent = (event, agent) => {
    event.stopPropagation();
    if (!authed) {
      onLogin();
      return;
    }
    if (!agent.isOwn) return;
    onCreateAgent(agent);
  };
  return (
    <div className="agent-page">
      <header className="agent-header">
        <div>
          <h1>{flow ? '选择创作助手' : '创作助手'}</h1>
          <span>Creative Agents</span>
        </div>
        <button className="hot-more" aria-label="More options">•••</button>
      </header>
      {flow && (
        <section className="agent-flow">
          <span>当前热点</span>
          <strong>{flow.topic}</strong>
          {flow.summary && <p>{flow.summary}</p>}
        </section>
      )}
      <section className="agent-grid">
        <button className="agent-card agent-card--create" onClick={createAgent}>
          <span className="agent-create-icon">
            <Plus size={42} />
          </span>
          <strong>创建指令集</strong>
          <small>定制专属助手</small>
        </button>
        {agents.map((agent) => {
          const TypeIcon = agent.type.icon;
          const active = selected === agent.id;
          return (
            <button className={`agent-card ${active ? 'is-active' : ''}`} key={agent.id} onClick={() => selectAgent(agent)}>
              {active && <span className="agent-card__check"><Check size={18} /></span>}
              <span className={`agent-avatar ${agent.image ? 'has-image' : ''}`}>
                {agent.image ? <img src={agent.image} alt="" /> : <Cuboid size={34} color={agent.type.color} />}
              </span>
              <span className="agent-title">
                <strong>{agent.name}</strong>
                <em style={{ '--agent-type-color': agent.type.color }}>
                  <TypeIcon size={14} />
                  {agent.type.shortLabel}
                </em>
              </span>
              <span className="agent-tags">
                {agent.tags.map((tag) => <small key={tag}>{tag}</small>)}
              </span>
              {agent.isOwn && (
                <span className="agent-edit" onClick={(event) => editAgent(event, agent)}>
                  <Edit3 size={14} />
                </span>
              )}
            </button>
          );
        })}
        {!agents.length && !loading && !loadError && <div className="agent-empty">暂无创作助手</div>}
        {loading && <div className="agent-empty">加载中…</div>}
        {loadError && !agents.length && <div className="agent-empty agent-empty--error"><span>{loadError}</span><button onClick={() => loadAgents({ nextPage: 1, append: false })}>重试</button></div>}
        {!!agents.length && (hasMore || loadingMore || loadError || page > 1) && (
          <div className="agent-pagination" ref={loadMoreRef}>
            {loadError ? (
              <><span>{loadError}</span><button onClick={() => loadAgents({ nextPage: page + 1, append: true })}>重试加载</button></>
            ) : hasMore || loadingMore ? (
              <button onClick={() => loadAgents({ nextPage: page + 1, append: true })} disabled={loadingMore}>{loadingMore ? '加载中…' : '加载更多'}</button>
            ) : (
              <span>已加载全部创作助手</span>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

const getResultMessage = (result, fallback) => result.message || result.raw?.message || result.raw?.msg || fallback;
const extractSavedId = (result, fallback = '') =>
  pick(result.data?.instructionSetId, result.data?.instruction_set_id, result.data?.id, result.data?.promptId, result.data?.prompt_id, fallback);

function InstructionSetEditorPage({ seed, onBack, onSaved, onLogin }) {
  const isEdit = Boolean(seed?.id);
  const [form, setForm] = useState(() => ({
    name: seed?.name || '',
    description: seed?.desc || seed?.description || '',
    instructions: seed?.instructions || '',
    tagsText: (seed?.tags || []).join('、'),
    type: seed?.type?.value || seed?.type || instructionSetTypes[0].value,
  }));
  const [status, setStatus] = useState({ loading: false, message: '' });
  const authed = Boolean(getAccessToken());
  const typeMeta = normalizeInstructionType(form.type);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event) => {
    event.preventDefault();
    if (!authed) {
      onLogin();
      return;
    }
    const name = textOf(form.name);
    const instructions = textOf(form.instructions);
    const type = normalizeInstructionType(form.type).value;
    const tags = Array.from(new Set(textOf(form.tagsText).split(/[,，、\s]+/).map(textOf).filter(Boolean))).slice(0, 3);

    if (!name || !instructions) {
      setStatus({ loading: false, message: !name ? '请输入指令集名称' : '请输入核心指令' });
      return;
    }

    setStatus({ loading: true, message: '' });
    const body = { name, description: textOf(form.description), instructions, tags, type };
    let result = await apiFetch(isEdit ? '/api/instruction_sets/edit' : '/api/instruction_sets/create', {
      method: 'POST',
      body: isEdit ? { ...body, instruction_set_id: seed.id } : body,
      timeoutMs: 12000,
    });

    if (isEdit && !result.ok && (result.status === 404 || result.status === 405)) {
      result = await apiFetch('/api/instruction_sets/update', {
        method: 'POST',
        body: { ...body, instruction_set_id: seed.id },
        timeoutMs: 12000,
      });
    }

    if (!result.ok) {
      setStatus({ loading: false, message: getResultMessage(result, isEdit ? '修改失败，请重试' : '创建失败，请重试') });
      return;
    }

    window.localStorage.setItem(
      'instruction_set_editor_seed_v1',
      JSON.stringify({ mode: isEdit ? 'edit' : 'create', instructionSetId: extractSavedId(result, seed?.id), updatedAt: Date.now() }),
    );
    setStatus({ loading: false, message: isEdit ? '修改已保存' : '指令集已创建' });
    onSaved();
  };

  return (
    <form className="agent-edit-page" onSubmit={save}>
      <header className="agent-header">
        <div>
          <h1>{isEdit ? '编辑指令集' : '创建指令集'}</h1>
          <span>Creative Agent</span>
        </div>
        <button type="button" className="outline-top-button" onClick={onBack}><ArrowLeft size={16} />返回创作助手</button>
      </header>
      <section className="agent-editor-panel">
        <label>
          <span>指令集名称</span>
          <input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="例如：我的短视频文案助手" />
        </label>
        <label>
          <span>简介</span>
          <input value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="这个助手擅长什么" />
        </label>
        <div className="agent-type-options">
          {instructionSetTypes.map((item) => {
            const Icon = item.icon;
            const active = typeMeta.value === item.value;
            return (
              <button type="button" key={item.value} className={active ? 'is-active' : ''} onClick={() => update('type', item.value)}>
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
        <label>
          <span>核心指令</span>
          <textarea value={form.instructions} onChange={(event) => update('instructions', event.target.value)} placeholder="写清楚角色、输出结构、语气、限制条件" />
        </label>
        <label>
          <span>标签</span>
          <input value={form.tagsText} onChange={(event) => update('tagsText', event.target.value)} placeholder="最多 3 个，用逗号或顿号分隔" />
        </label>
        {status.message && <div className="form-message">{status.message}</div>}
        <div className="modal-actions">
          <button type="button" className="outline-button" onClick={onBack}>取消</button>
          <button type="submit" className="primary-button" disabled={status.loading}>
            <Sparkles size={17} />
            {status.loading ? '保存中' : '保存'}
          </button>
        </div>
      </section>
    </form>
  );
}

const generatedScalar = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return `${value}`.trim();
  if (Array.isArray(value) && value.every((item) => ['string', 'number'].includes(typeof item))) {
    return value.map((item) => `${item}`.trim()).filter(Boolean).join('、');
  }
  return '';
};
const pickGeneratedScalar = (...values) => values.map(generatedScalar).find(Boolean) || '';
const formatGeneratedFields = ({ title = '', topic = '', content = '', contentLabel = '文案' } = {}) => [
  title ? `标题：${title}` : '',
  topic ? `话题：${topic}` : '',
  content ? `${contentLabel}：${content}` : '',
].filter(Boolean).join('\n');
const extractGeneratedTextValue = (value, depth = 0) => {
  if (depth > 8 || value === null || value === undefined) return '';
  const scalar = generatedScalar(value);
  if (scalar) return scalar;
  if (Array.isArray(value)) return value.map((item) => extractGeneratedTextValue(item, depth + 1)).filter(Boolean).join('');
  if (typeof value !== 'object') return '';

  const title = pickGeneratedScalar(value.title, value.scriptTitle, value.script_title, value.name, value.songTitle, value.song_title, value['标题'], value['歌名'], value['歌曲名称']);
  const topic = pickGeneratedScalar(value.topic, value.tags, value.tag, value.style, value.customStyle, value.custom_style, value['话题'], value['标签'], value['风格']);
  const explicitContent = pickGeneratedScalar(value.script, value.copy, value.body, value.lyrics, value.lyric, value['文案'], value['正文'], value['口播'], value['歌词']);
  const titledContent = title || topic ? pickGeneratedScalar(value.content, value.text) : '';
  const directContent = explicitContent || titledContent;
  if (directContent && (title || topic || explicitContent)) {
    return formatGeneratedFields({ title, topic, content: directContent, contentLabel: value.lyrics || value.lyric ? '歌词' : '文案' });
  }

  const choice = Array.isArray(value.choices) ? value.choices[0] || {} : {};
  const candidates = [
    choice.delta?.content,
    choice.message?.content,
    choice.text,
    value.response,
    value.reply,
    value.answer,
    value.output_text,
    value.outputText,
    value.output,
    value.text,
    value.content,
    value.delta,
    value.chunk,
    value.message,
    value.data,
    value.result,
  ];
  for (const candidate of candidates) {
    if (candidate === value) continue;
    const text = extractGeneratedTextValue(candidate, depth + 1);
    if (text) return text;
  }
  return '';
};
const stripGeneratedCodeFence = (value) => {
  const text = textOf(value);
  const match = text.match(/^```(?:json|markdown|text)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : text;
};
const consumeGeneratedJsonObjects = (value) => {
  const source = `${value || ''}`;
  const payloads = [];
  let depth = 0;
  let start = -1;
  let lastEnd = 0;
  let inString = false;
  let escaping = false;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaping) escaping = false;
      else if (character === '\\') escaping = true;
      else if (character === '"') inString = false;
    } else if (character === '"') inString = true;
    else if (character === '{') {
      if (depth === 0) start = index;
      depth += 1;
    } else if (character === '}' && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        payloads.push(source.slice(start, index + 1));
        lastEnd = index + 1;
        start = -1;
      }
    }
  }
  return { payloads, remaining: source.slice(lastEnd).trim(), prefix: payloads.length ? source.slice(0, source.indexOf(payloads[0])).trim() : source.trim() };
};
const decodeGeneratedEnvelopeFragment = (value) => {
  const text = textOf(value);
  const match = text.match(/^\s*\{\s*"(?:response|reply|answer|content|text|output)"\s*:\s*"([\s\S]*)"\s*\}?\s*$/i);
  if (!match) return '';
  let encoded = match[1].replace(/"\s*}\s*$/, '');
  try {
    return JSON.parse(`"${encoded}"`);
  } catch {
    return encoded.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
};
const decodeLooseGeneratedString = (value) => {
  const text = textOf(value);
  if (!(text.startsWith('"') && text.endsWith('"'))) return '';
  try {
    return JSON.parse(text);
  } catch {
    return text.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
};
const extractLooseGeneratedField = (source, markers, stopMarkers = []) => {
  const markerPattern = markers.map((marker) => marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const start = new RegExp(`["']?(?:${markerPattern})["']?\\s*:\\s*["']?`, 'i').exec(source);
  if (!start) return '';
  let value = source.slice(start.index + start[0].length);
  if (stopMarkers.length) {
    const stopPattern = stopMarkers.map((marker) => marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const stop = new RegExp(`["']?\\s*,\\s*["']?(?:${stopPattern})["']?\\s*:`, 'i').exec(value);
    if (stop) value = value.slice(0, stop.index);
  }
  return value.replace(/["']?\s*}\s*$/, '').replace(/["']\s*,?\s*$/, '').trim();
};
const extractLooseGeneratedObject = (value) => {
  const source = textOf(value).replace(/\\"/g, '"');
  if (!source.includes(':') || !source.includes('{')) return '';
  const titleKeys = ['title', 'scriptTitle', 'script_title', 'songTitle', 'song_title', '标题', '歌名', '歌曲名称'];
  const topicKeys = ['topic', 'tags', 'tag', 'style', 'customStyle', 'custom_style', '话题', '标签', '风格'];
  const contentKeys = ['script', 'copy', 'body', 'content', 'text', 'lyrics', 'lyric', '文案', '正文', '口播', '歌词'];
  const title = extractLooseGeneratedField(source, titleKeys, topicKeys.concat(contentKeys));
  const topic = extractLooseGeneratedField(source, topicKeys, contentKeys);
  const content = extractLooseGeneratedField(source, contentKeys);
  return content && (title || topic) ? formatGeneratedFields({ title, topic, content, contentLabel: /歌词|lyrics|lyric/i.test(source) ? '歌词' : '文案' }) : '';
};
const normalizeGeneratedText = (value) => {
  let text = stripGeneratedCodeFence(extractGeneratedTextValue(value));
  for (let pass = 0; pass < 5 && text; pass += 1) {
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    if (parsed !== null) {
      const next = stripGeneratedCodeFence(extractGeneratedTextValue(parsed));
      if (next && next !== text) {
        text = next;
        continue;
      }
    }
    const looseString = decodeLooseGeneratedString(text);
    if (looseString && looseString !== text) {
      text = stripGeneratedCodeFence(looseString);
      continue;
    }
    const looseObject = extractLooseGeneratedObject(text);
    if (looseObject && looseObject !== text) {
      text = looseObject;
      continue;
    }
    const chunks = consumeGeneratedJsonObjects(text);
    if (chunks.payloads.length > 1 && !chunks.prefix && !chunks.remaining) {
      const joined = chunks.payloads.map((payload) => {
        try {
          return extractGeneratedTextValue(JSON.parse(payload));
        } catch {
          return '';
        }
      }).join('');
      if (joined && joined !== text) {
        text = stripGeneratedCodeFence(joined);
        continue;
      }
    }
    const fragment = decodeGeneratedEnvelopeFragment(text);
    if (fragment && fragment !== text) {
      text = stripGeneratedCodeFence(fragment);
      continue;
    }
    break;
  }
  return textOf(text);
};
const decodeGeneratedPartialString = (value) => {
  const source = `${value || ''}`;
  if (!source) return '';
  try {
    return JSON.parse(`"${source}"`);
  } catch {
    return source
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  }
};
const extractPartialGeneratedEnvelopeText = (value) => {
  const source = `${value || ''}`;
  for (const key of ['response', 'content', 'answer', 'text', 'output']) {
    const token = `"${key}"`;
    const keyIndex = source.indexOf(token);
    if (keyIndex < 0) continue;
    const colonIndex = source.indexOf(':', keyIndex + token.length);
    const quoteIndex = source.indexOf('"', colonIndex + 1);
    if (colonIndex < 0 || quoteIndex < 0) continue;
    let encoded = source.slice(quoteIndex + 1);
    let closingQuote = -1;
    let escaping = false;
    for (let index = 0; index < encoded.length; index += 1) {
      const character = encoded[index];
      if (escaping) escaping = false;
      else if (character === '\\') escaping = true;
      else if (character === '"') {
        closingQuote = index;
        break;
      }
    }
    if (closingQuote >= 0) encoded = encoded.slice(0, closingQuote);
    return decodeGeneratedPartialString(encoded);
  }
  return '';
};
const normalizeGeneratedStreamPreview = (value) => {
  const partial = extractPartialGeneratedEnvelopeText(value);
  if (partial) return partial;
  const normalized = normalizeGeneratedText(value);
  return /^[{[]/.test(normalized) ? '' : normalized;
};
const mergeGeneratedStreamText = (currentValue, incomingValue) => {
  const current = `${currentValue || ''}`;
  const incoming = `${incomingValue || ''}`;
  if (!incoming) return current;
  if (!current) return incoming;
  if (incoming === current) return current;
  if (incoming.startsWith(current)) return incoming;
  if (current.endsWith(incoming)) return current;
  return `${current}${incoming}`;
};
const extractGeneratedStreamChunk = (payload, depth = 0) => {
  if (depth > 6 || payload === null || payload === undefined) return '';
  if (typeof payload === 'string' || typeof payload === 'number') return `${payload}`;
  if (Array.isArray(payload)) return payload.map((item) => extractGeneratedStreamChunk(item, depth + 1)).join('');
  if (typeof payload !== 'object') return '';
  const choice = Array.isArray(payload.choices) ? payload.choices[0] || {} : {};
  const candidates = [
    choice.delta?.content,
    choice.message?.content,
    choice.text,
    payload.delta?.content,
    payload.response,
    payload.reply,
    payload.answer,
    payload.output,
    payload.content,
    payload.text,
    payload.chunk,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' || typeof candidate === 'number') return `${candidate}`;
    if (candidate && typeof candidate === 'object') {
      const nested = extractGeneratedStreamChunk(candidate, depth + 1);
      if (nested) return nested;
    }
  }
  if (payload.data && payload.data !== payload) return extractGeneratedStreamChunk(payload.data, depth + 1);
  return '';
};
const getGeneratedStreamError = (payload) => textOf(
  payload?.error?.message || payload?.error || (payload?.type === 'error' ? payload?.message : ''),
);
const parseStreamText = (text) => normalizeGeneratedText(
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*data:\s*/, '').trim())
    .filter((line) => line && line !== '[DONE]' && !/^(?:event|id|retry):/i.test(line))
    .map((line) => {
      try {
        return extractGeneratedTextValue(JSON.parse(line));
      } catch {
        return line;
      }
    })
    .join(''),
);
const extractReply = (payload, prompt = '') => {
  const direct = normalizeGeneratedText(payload);
  return direct && direct !== prompt ? direct : '';
};
const isProInstructionAgent = (agent = {}) => {
  const name = textOf(agent.name || agent.title || agent.instructionSetTitle || agent.instruction_set_name);
  const type = textOf(agent.type?.value || agent.type || agent.instructionSetType || agent.instruction_set_type);
  const suffixSource = `${name} ${type}`.toLowerCase();
  return /(?:^|[\s_-])pro$|pro(?:\s|$)|专业版|高阶/.test(suffixSource);
};
const buildTypedPrompt = (prompt, type, agent = {}) => {
  if (normalizeInstructionType(type).value === '音乐创作') {
    return [
      '请根据用户需求创作一首可直接进入歌曲制作的歌词方案。',
      '请严格按“歌名：”“风格：”“歌词：”三个段落输出。',
      '不要输出 JSON、代码块、花括号或字段引号。',
      '',
      `用户需求：${prompt}`,
    ].join('\n');
  }
  if (isProInstructionAgent(agent)) {
    return [
      '请根据用户需求生成可直接进入 Pro 视频制作的内容。',
      '请严格按“标题：”“话题：”“文案：”“分镜1：”“分镜2：”这样的纯文本段落输出。',
      '话题使用简短主题或标签；文案段落可以留空，正文必须拆成连续分镜。',
      '每个分镜是一句可直接作为字幕的完整内容，不要输出 JSON、代码块、花括号或字段引号。',
      '',
      `用户需求：${prompt}`,
    ].join('\n');
  }
  return [
    '请根据用户需求生成可直接进入视频制作的内容。',
    '请严格按“标题：”“话题：”“文案：”三个段落输出。',
    '话题使用简短主题或标签；文案给出可直接使用的完整正文。',
    '不要输出 JSON、代码块、花括号或字段引号。',
    '',
    `用户需求：${prompt}`,
  ].join('\n');
};
const GENERATED_TITLE_MARKERS = ['【标题】', '标题：', '标题:', '【歌名】', '歌名：', '歌名:', '歌曲名称：', '歌曲名称:'];
const GENERATED_TOPIC_MARKERS = ['【话题】', '话题：', '话题:', '【标签】', '标签：', '标签:', '【风格】', '风格：', '风格:'];
const GENERATED_CONTENT_MARKERS = ['【文案】', '文案：', '文案:', '【歌词正文】', '歌词正文：', '歌词正文:', '【歌词】', '歌词：', '歌词:', '【口播】', '口播：', '口播:', '【正文】', '正文：', '正文:', '【内容】', '内容：', '内容:'];
const findFirstGeneratedMarker = (text, markers) => markers.reduce((matched, marker) => {
  const index = text.indexOf(marker);
  return index >= 0 && (!matched || index < matched.index) ? { index, marker } : matched;
}, null);
const findGeneratedSection = (text, markers, stopMarkers = []) => {
  const start = findFirstGeneratedMarker(text, markers);
  if (!start) return '';
  let remainder = text.slice(start.index + start.marker.length);
  if (stopMarkers.length) {
    const stop = findFirstGeneratedMarker(remainder, stopMarkers);
    if (stop) remainder = remainder.slice(0, stop.index);
  }
  return remainder.replace(/^[\s:：*`"'“”]+/, '').trim();
};
const cleanGeneratedTitle = (value) => textOf(value)
  .replace(/^#{1,6}\s*/, '')
  .replace(/^\*{1,2}|\*{1,2}$/g, '')
  .replace(/^[【\[]?(?:标题|歌名|歌曲名称)[】\]]?\s*[:：]?\s*/i, '')
  .replace(/^[\s{},\[\]"'“”]+|[\s{},\[\]"'“”*`]+$/g, '')
  .trim()
  .slice(0, 80);
const cleanGeneratedTopic = (value) => textOf(value)
  .replace(/^\*{1,2}|\*{1,2}$/g, '')
  .replace(/^[\s{},\[\]"'“”]+|[\s{},\[\]"'“”*`]+$/g, '')
  .trim()
  .slice(0, 120);
const cleanGeneratedContent = (value) => textOf(value)
  .replace(/^\*{1,2}|\*{1,2}$/g, '')
  .replace(/^[\s"'“”]+|[\s"'“”]+$/g, '')
  .trim();
const GENERATED_SCENE_REGEX = /(?:^|[\n\r]+|[\s。！？!?；;，,]+)(?:#{1,6}\s*)?(?:[*`_\-\s]*)?(?:分镜|镜头|场景|片段)\s*[第]?\s*([0-9０-９一二三四五六七八九十百]+)?\s*[）).、:：-]?\s*/g;
const cleanGeneratedScene = (value) => cleanGeneratedContent(value)
  .replace(/^[\s"'“”*`_-]+/, '')
  .replace(/^[，,。；;：:、-]+/, '')
  .trim();
const parseGeneratedScenes = (value) => {
  const text = normalizeGeneratedText(value);
  if (!text) return [];
  const matches = Array.from(text.matchAll(GENERATED_SCENE_REGEX));
  if (!matches.length) return [];
  return matches
    .map((match, index) => {
      const start = match.index + match[0].length;
      const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
      return cleanGeneratedScene(text.slice(start, end));
    })
    .filter(Boolean);
};
const parseGeneratedResult = (value) => {
  const text = normalizeGeneratedText(value);
  if (!text) return { title: '', topic: '', content: '', scenes: [] };
  const title = findGeneratedSection(text, GENERATED_TITLE_MARKERS, GENERATED_TOPIC_MARKERS.concat(GENERATED_CONTENT_MARKERS)).split('\n')[0];
  const topic = findGeneratedSection(text, GENERATED_TOPIC_MARKERS, GENERATED_CONTENT_MARKERS).split('\n')[0];
  const contentSection = findGeneratedSection(text, GENERATED_CONTENT_MARKERS);
  const scenes = parseGeneratedScenes(contentSection || text);
  const content = scenes.length ? scenes.join('\n\n') : contentSection;
  const firstLine = text.split(/\n+/).map(cleanGeneratedTitle).find(Boolean) || 'AI 生成内容';
  return {
    title: cleanGeneratedTitle(title || firstLine),
    topic: cleanGeneratedTopic(topic),
    content: cleanGeneratedContent(content || text),
    scenes,
  };
};
async function requestGeneratedCopy({ prompt, agent, messages, signal, onProgress }) {
  const token = getAccessToken();
  const body = {
    content: buildTypedPrompt(prompt, agent?.type?.value, agent),
    ...(agent?.id ? { instruction_set_id: agent.id } : {}),
    messages: messages
      .filter((item) => item.role !== 'pending')
      .slice(-12)
      .map((item) => ({ role: item.role === 'user' ? 'user' : 'assistant', content: item.text })),
  };
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.body || typeof response.body.getReader !== 'function') {
    const raw = await response.text();
    let fallbackReply = '';
    try {
      fallbackReply = extractReply(JSON.parse(raw), prompt);
    } catch {
      fallbackReply = parseStreamText(raw);
    }
    fallbackReply = normalizeGeneratedText(fallbackReply);
    if (!response.ok || !fallbackReply) throw new Error(fallbackReply || '文案生成失败，请重试');
    onProgress?.(fallbackReply);
    return { text: fallbackReply, script: parseGeneratedResult(fallbackReply) };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let eventBuffer = '';
  let transportText = '';
  let rawReply = '';
  let streamError = '';
  let lastPreview = '';
  const applyEventData = (dataText) => {
    const data = textOf(dataText);
    if (!data || data === '[DONE]') return;
    try {
      const payload = JSON.parse(data);
      streamError = getGeneratedStreamError(payload) || streamError;
      const chunk = extractGeneratedStreamChunk(payload);
      if (!chunk) return;
      rawReply = mergeGeneratedStreamText(rawReply, chunk);
    } catch {
      rawReply = mergeGeneratedStreamText(rawReply, data);
    }
    const preview = normalizeGeneratedStreamPreview(rawReply);
    if (preview && preview !== lastPreview) {
      lastPreview = preview;
      onProgress?.(preview);
    }
  };
  const consumeEventBuffer = (flush = false) => {
    eventBuffer = eventBuffer.replace(/\r\n/g, '\n');
    let boundary = eventBuffer.indexOf('\n\n');
    while (boundary >= 0) {
      const block = eventBuffer.slice(0, boundary);
      eventBuffer = eventBuffer.slice(boundary + 2);
      const data = block
        .split('\n')
        .map((line) => line.trimStart())
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart())
        .join('\n');
      if (data) applyEventData(data);
      boundary = eventBuffer.indexOf('\n\n');
    }
    if (!flush || !eventBuffer.trim()) return;
    const lines = eventBuffer.split('\n').map((line) => line.trim()).filter(Boolean);
    const dataLines = lines.filter((line) => line.startsWith('data:'));
    if (dataLines.length) dataLines.forEach((line) => applyEventData(line.slice(5).trimStart()));
    else applyEventData(eventBuffer);
    eventBuffer = '';
  };
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const decoded = decoder.decode(value, { stream: true });
    transportText += decoded;
    eventBuffer += decoded;
    consumeEventBuffer(false);
  }
  const tail = decoder.decode();
  if (tail) {
    transportText += tail;
    eventBuffer += tail;
  }
  consumeEventBuffer(true);

  let reply = normalizeGeneratedText(rawReply);
  if (!reply) {
    try {
      reply = extractReply(JSON.parse(transportText), prompt);
    } catch {
      reply = parseStreamText(transportText);
    }
  }
  reply = normalizeGeneratedText(reply);
  if (!response.ok || !reply) throw new Error(streamError || reply || '文案生成失败，请重试');
  return { text: reply, script: parseGeneratedResult(reply) };
}

const GENERATED_THINKING_MESSAGES = [
  '正在思考中',
  'Thinking',
  '考えています',
  '생각하고 있어요',
  'Sto pensando',
  'Réflexion en cours',
  'Ich denke nach',
  'Pensando',
  'Думаю',
  'جارٍ التفكير',
];

function CopyGeneratorPage({ agent, useHotTopicFlow, onBack, onLogin, onMakeVideo, onMakeMusic }) {
  const [flow] = useState(() => (useHotTopicFlow ? getPendingFlow() : null));
  const initialPrompt = flow?.prompt || flow?.topic || '';
  const [input, setInput] = useState(initialPrompt);
  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      text: initialPrompt
        ? '热点内容已带入输入框，请确认或修改后再发送。'
        : agent?.desc || '输入你的产品、活动、场景或诉求，生成可直接用于视频制作的文案。',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const chatRef = useRef(null);
  const streamAbortRef = useRef(null);
  const authed = Boolean(getAccessToken());
  const isThinking = loading && messages.some((message) => message.role === 'pending');
  const thinkingText = GENERATED_THINKING_MESSAGES[thinkingIndex % GENERATED_THINKING_MESSAGES.length];

  useEffect(() => () => streamAbortRef.current?.abort(), []);
  useEffect(() => {
    if (!isThinking) return undefined;
    const timer = window.setInterval(() => {
      setThinkingIndex((index) => (index + 1) % GENERATED_THINKING_MESSAGES.length);
    }, 1050);
    return () => window.clearInterval(timer);
  }, [isThinking]);
  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    chat.scrollTop = chat.scrollHeight;
  }, [messages]);

  const generate = async (promptText = input) => {
    const prompt = textOf(promptText);
    if (!authed) {
      onLogin();
      return;
    }
    if (!prompt || loading) return;
    const userMessage = { role: 'user', text: prompt };
    const nextMessages = messages.concat(userMessage);
    setThinkingIndex(0);
    setMessages(nextMessages.concat({ role: 'pending', text: '正在生成文案' }));
    setLoading(true);
    setInput('');
    const controller = new AbortController();
    streamAbortRef.current = controller;
    try {
      const reply = await requestGeneratedCopy({
        prompt,
        agent,
        messages: nextMessages,
        signal: controller.signal,
        onProgress: (partialText) => {
          setMessages(nextMessages.concat({ role: 'assistant', text: partialText, streaming: true }));
        },
      });
      setMessages(nextMessages.concat({ role: 'assistant', text: reply.text, script: reply.script, generated: true }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        setMessages(nextMessages.concat({ role: 'assistant', text: error.message || '文案生成失败，请重试', error: true }));
      }
    } finally {
      if (streamAbortRef.current === controller) streamAbortRef.current = null;
      setLoading(false);
    }
  };
  const makeVideo = (message, productionType) => {
    const result = message.script || parseGeneratedResult(message.text);
    const title = result.title || flow?.title || flow?.topic || 'AI 生成内容';
    const topic = result.topic || flow?.topic || '';
    const scenes = Array.isArray(result.scenes) ? result.scenes.filter(Boolean).map((content) => ({ content })) : [];
    window.localStorage.setItem(VIDEO_PREFILL_KEY, JSON.stringify({
      productionType,
      source: 'videoChat',
      instructionSetId: agent?.id || '',
      instructionSetTitle: agent?.name || '',
      instructionSetType: agent?.type?.value || agent?.type || '',
      title,
      topic,
      script: result.content,
      content: result.content,
      scenes,
      createdAt: Date.now(),
    }));
    onMakeVideo();
  };
  const makeMusic = (message) => {
    const result = message.script || parseGeneratedResult(message.text);
    window.localStorage.setItem(MUSIC_PREFILL_KEY, JSON.stringify({
      inputType: 'lyrics',
      title: result.title,
      lyrics: result.content,
      customStyle: result.topic,
      instructionSetId: agent?.id || '',
      instructionSetTitle: agent?.name || '',
      instructionSetType: agent?.type?.value || agent?.type || '',
      createdAt: Date.now(),
    }));
    onMakeMusic();
  };
  const isMusicAgent = normalizeInstructionType(agent?.type?.value || agent?.type).value === '音乐创作';
  const isProAgent = isProInstructionAgent(agent);
  const agentName = textOf(agent?.name) || '创作助手';
  const agentInitials = Array.from(agentName).slice(0, 2).join('');

  return (
    <div className="copy-page">
      <header className="copy-header">
        <button className="outline-top-button" onClick={onBack}><ArrowLeft size={16} />返回创作助手</button>
        <div>
          <h1>文案生成</h1>
          <span>{agent?.name || 'Creative Agent'}</span>
        </div>
      </header>
      <section className="copy-context">
        <strong>人工智能生成</strong>
        <span>本页文案由人工智能辅助生成，请结合实际业务核验后使用</span>
        {flow?.topic && <em>热点：{flow.topic}</em>}
      </section>
      <section className="copy-chat" ref={chatRef} aria-live="polite">
        {messages.map((message, index) => (
          <article className={`copy-message copy-message--${message.role} ${message.error ? 'is-error' : ''} ${message.streaming ? 'is-streaming' : ''}`} key={`${message.role}-${index}`}>
            <div className="copy-message__speaker">
              <span className="copy-message__speaker-avatar">
                <b>{message.role === 'user' ? '我' : agentInitials}</b>
                {message.role !== 'user' && agent?.image && (
                  <img src={agent.image} alt={agentName} onError={(event) => { event.currentTarget.hidden = true; }} />
                )}
              </span>
              {message.role !== 'user' && <small title={agentName}>{agentName}</small>}
            </div>
            <div className="copy-message__content">
              <p>
                {message.role === 'pending' ? (
                  <span className="copy-thinking" key={thinkingText} translate="no">
                    <span>{thinkingText}</span>
                    <i className="copy-thinking__dots" aria-hidden="true"><i /><i /><i /></i>
                  </span>
                ) : (
                  <>{message.text}{message.streaming && <i className="copy-stream-cursor" />}</>
                )}
              </p>
              {message.generated && !message.error && (
                <div className="copy-message-actions">
                  {isMusicAgent ? (
                    <button className="is-music" onClick={() => makeMusic(message)}><Music2 size={16} />去制作音乐</button>
                  ) : isProAgent ? (
                    <>
                      <button className="is-pro-broadcast" onClick={() => makeVideo(message, 'professional')}><GalleryVerticalEnd size={16} />形象播报 Pro</button>
                      <button className="is-pro-material" onClick={() => makeVideo(message, 'materialPackage')}><Layers3 size={16} />素材成片 Pro</button>
                    </>
                  ) : (
                    <>
                      <button className="is-smart" onClick={() => makeVideo(message, 'mix')}><Clapperboard size={16} />智能成片</button>
                      <button className="is-oral" onClick={() => makeVideo(message, 'oral')}><UserRound size={16} />数字人口播</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
      <form className="copy-submit" onSubmit={(event) => { event.preventDefault(); generate(); }}>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="输入你想生成的文案需求" />
        <button className="primary-button" disabled={loading || !textOf(input)}>
          <Sparkles size={17} />
          {loading ? '生成中' : '发送'}
        </button>
      </form>
    </div>
  );
}

function HotTrendsPage({ onTopicSelect }) {
  const [mode, setMode] = useState('aggregate');
  const [category, setCategory] = useState(trendCategories[0]);
  const [source, setSource] = useState(mediaSources[0]);
  const [boards, setBoards] = useState(() =>
    trendCategories.map((item) => ({
      id: `aggregate-${item.key}`,
      categoryKey: item.key,
      categoryLabel: item.label,
      title: item.label,
      icon: item.icon,
      topics: [],
    })),
  );
  const [mediaBoards, setMediaBoards] = useState(() =>
    mediaSources.map((item) => ({
      id: `media-${item.key}`,
      source: item.key,
      categoryLabel: '媒体',
      title: item.label,
      icon: item.icon,
      topics: [],
    })),
  );
  const [loading, setLoading] = useState(false);
  const [boardLoading, setBoardLoading] = useState({});
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaLoading, setMediaLoading] = useState({});

  const loadAggregateBoard = async (nextCategory) => {
    setBoardLoading((current) => ({ ...current, [nextCategory.key]: true }));
    const result = await apiFetch('/api/hotlist/list', {
      auth: false,
      params: { page: 1, page_size: HOT_PAGE_SIZE, pageSize: HOT_PAGE_SIZE, categories: categoryRequest(nextCategory) },
    });
    const nextBoards = normalizeBoards(result);
    const matchingBoards = nextBoards.filter((board) =>
      nextCategory.key === 'all' || board.categoryKey === nextCategory.key,
    );
    const nextBoard = {
      id: `aggregate-${nextCategory.key}`,
      categoryKey: nextCategory.key,
      categoryLabel: nextCategory.label,
      title: nextCategory.label,
      icon: nextCategory.icon,
      topics: matchingBoards.flatMap((board) => board.topics).slice(0, HOT_PAGE_SIZE),
    };
    setBoards((current) =>
      trendCategories.map((item) =>
        item.key === nextCategory.key
          ? nextBoard
          : current.find((board) => board.categoryKey === item.key) || {
              id: `aggregate-${item.key}`,
              categoryKey: item.key,
              categoryLabel: item.label,
              title: item.label,
              icon: item.icon,
              topics: [],
            },
      ),
    );
    setBoardLoading((current) => ({ ...current, [nextCategory.key]: false }));
  };
  const loadAggregate = async () => {
    setLoading(true);
    await Promise.all(trendCategories.map((item) => loadAggregateBoard(item)));
    setLoading(false);
  };
  const loadMedia = async () => {
    setLoading(true);
    setMediaLoading(Object.fromEntries(mediaSources.map((item) => [item.key, true])));
    const result = await apiFetch('/api/hotlist/search', { auth: false, params: { limit: 0 } });
    const nextBoards = normalizeMediaBoards(result);
    setMediaBoards(
      mediaSources.map((item) =>
        nextBoards.find((board) => board.source === item.key) || {
          id: `media-${item.key}`,
          source: item.key,
          categoryLabel: '媒体',
          title: item.label,
          icon: item.icon,
          topics: [],
        },
      ),
    );
    setMediaLoaded(true);
    setMediaLoading(Object.fromEntries(mediaSources.map((item) => [item.key, false])));
    setLoading(false);
  };
  const loadMediaBoard = async (nextSource) => {
    setMediaLoading((current) => ({ ...current, [nextSource.key]: true }));
    const result = await apiFetch('/api/hotlist/search', { auth: false, params: { limit: 0 } });
    const refreshed = normalizeMediaBoards(result).find((board) => board.source === nextSource.key) || {
      id: `media-${nextSource.key}`,
      source: nextSource.key,
      categoryLabel: '媒体',
      title: nextSource.label,
      icon: nextSource.icon,
      topics: [],
    };
    setMediaBoards((current) => current.map((board) => (board.source === nextSource.key ? refreshed : board)));
    setMediaLoading((current) => ({ ...current, [nextSource.key]: false }));
  };

  useEffect(() => {
    loadAggregate();
  }, []);

  const visibleBoards = mode === 'aggregate' ? boards : mediaBoards;

  const changeMode = async (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    if (nextMode === 'media' && !mediaLoaded) await loadMedia();
  };
  const changeCategory = (nextCategory) => {
    setCategory(nextCategory);
    window.requestAnimationFrame(() => {
      document.getElementById(`hot-board-${nextCategory.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };
  const changeSource = (nextSource) => {
    setSource(nextSource);
    window.requestAnimationFrame(() => {
      document.getElementById(`hot-board-${nextSource.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };
  const chooseTopic = (topic, board) => {
    window.localStorage.setItem(
      HOT_TOPIC_FLOW_KEY,
      JSON.stringify({
        source: 'hotTopic',
        topic: topic.title,
        title: topic.title,
        category: board.categoryLabel,
        url: topic.url,
        prompt: topic.title,
        autoGenerate: false,
        createdAt: Date.now(),
      }),
    );
    onTopicSelect();
  };

  return (
    <div className="hot-page">
      <header className="hot-header">
        <div>
          <h1>热点跟踪</h1>
          <span>Hot Trends</span>
        </div>
        <button className="hot-more" aria-label="More options">•••</button>
      </header>
      <div className="hot-switch">
        <button className={mode === 'aggregate' ? 'is-active' : ''} onClick={() => changeMode('aggregate')}>
          热点聚合
        </button>
        <button className={mode === 'media' ? 'is-active' : ''} onClick={() => changeMode('media')}>
          媒体热点
        </button>
      </div>
      <div className={`hot-cats ${mode === 'aggregate' ? 'is-aggregate' : 'is-media'}`}>
        {(mode === 'aggregate' ? trendCategories : mediaSources).map((item) => (
          <button
            key={item.key}
            className={(mode === 'aggregate' ? category.key : source.key) === item.key ? 'is-active' : ''}
            onClick={() => (mode === 'aggregate' ? changeCategory(item) : changeSource(item))}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
      <section className={`hot-board ${visibleBoards.length > 1 ? 'hot-board--sections' : ''}`}>
        {visibleBoards.map((board) => (
          <div className="hot-board-card" id={`hot-board-${board.categoryKey || board.source}`} key={board.id}>
            <div className="hot-board__title">
              <span>{board.icon}</span>
              <strong>{board.title}</strong>
              <button
                className={`hot-board__refresh ${
                  mode === 'aggregate' ? (boardLoading[board.categoryKey] ? 'is-loading' : '') : (mediaLoading[board.source] ? 'is-loading' : '')
                }`}
                onClick={() =>
                  mode === 'aggregate'
                    ? loadAggregateBoard(trendCategories.find((item) => item.key === board.categoryKey))
                    : loadMediaBoard(mediaSources.find((item) => item.key === board.source))
                }
                disabled={mode === 'aggregate' ? boardLoading[board.categoryKey] : mediaLoading[board.source]}
                aria-label={`刷新${board.title}`}
              >
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="hot-list">
              {board.topics.map((topic, index) => (
                <button
                  className={`hot-row ${index === 0 ? 'is-top' : ''}`}
                  key={`${board.id}-${topic.id}-${index}`}
                  onClick={() => chooseTopic(topic, board)}
                >
                  <span className="hot-rank">{topic.rank}</span>
                  <span className="hot-row__main">
                    <h3>{topic.title}</h3>
                  </span>
                </button>
              ))}
              {!board.topics.length && (
                <div className="hot-board__empty">
                  {(mode === 'aggregate' ? boardLoading[board.categoryKey] : mediaLoading[board.source]) ? '加载中' : '暂无热点'}
                </div>
              )}
            </div>
          </div>
          ))}
        {!visibleBoards.length && !loading && <div className="hot-empty">暂无热点</div>}
        {mode === 'media' && loading && <div className="hot-loading">加载中</div>}
      </section>
    </div>
  );
}

function PublicPageHeader({ eyebrow, title, description, onBack }) {
  return (
    <header className="public-page-hero">
      <button className="public-back" onClick={onBack}><ArrowLeft size={16} />返回工作台</button>
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  );
}

function AgreementCenterPage({ onOpen }) {
  return (
    <div className="public-page">
      <PublicPageHeader
        eyebrow="TRUST CENTER"
        title="协议与合规中心"
        description="查看账号、隐私、声纹、形象和 AI 生成内容的使用边界。"
        onBack={() => onOpen('home')}
      />
      <div className="compliance-notice">
        <ShieldCheck size={21} />
        <div><strong>敏感信息单独同意</strong><span>声纹、面部特征和数字人形象会在对应功能提交前单独确认，不与基础账号协议捆绑。</span></div>
      </div>
      <section className="agreement-card-grid">
        {agreementCards.map(([id, title, description]) => {
          const document = legalDocuments[id];
          const Icon = document.icon;
          return (
            <button key={id} className="agreement-card" onClick={() => onOpen(id)}>
              <span className="agreement-card__icon"><Icon size={22} /></span>
              <span><strong>{title}</strong><small>{description}</small></span>
              <ChevronRight size={18} />
            </button>
          );
        })}
      </section>
      <section className="legal-review-note">
        <AlertCircle size={20} />
        <div><strong>上线前复核</strong><p>专项协议已按当前产品流程补齐，正式商用前还需由法务结合实际数据存储地、模型服务商、跨境传输与目标市场法律做最终审核。</p></div>
      </section>
    </div>
  );
}

function LegalDocumentPage({ document, onOpen }) {
  const Icon = document.icon;
  return (
    <div className="public-page legal-document-page">
      <PublicPageHeader
        eyebrow={document.eyebrow}
        title={document.title}
        description={document.description}
        onBack={() => onOpen('info-agreements')}
      />
      <div className="legal-document-layout">
        <aside className="legal-document-meta">
          <span><Icon size={22} /></span>
          <strong>{document.updated}</strong>
          {document.officialUrl && (
            <a href={document.officialUrl} target="_blank" rel="noreferrer">查看正式全文<ExternalLink size={15} /></a>
          )}
        </aside>
        <article className="legal-document-body">
          {document.sections.map(([heading, text]) => (
            <section key={heading}><h2>{heading}</h2><p>{text}</p></section>
          ))}
          <div className="legal-contact-line">
            <Mail size={18} />
            <span>如需行使个人信息权利或撤回授权，请联系 <a href="mailto:privacy@xyaip.fun">privacy@xyaip.fun</a></span>
          </div>
        </article>
      </div>
    </div>
  );
}

function AboutPage({ onOpen }) {
  return (
    <div className="public-page">
      <PublicPageHeader
        eyebrow="ABOUT KALI"
        title="关于我们"
        description="让热点、创意、数字人、声音与媒体发布成为一条可复用的 AI 内容生产线。"
        onBack={() => onOpen('home')}
      />
      <section className="about-story">
        <div className="about-story__mark"><span className="brand-mark">K</span><small>KALI · YIXIU</small></div>
        <div><h2>我们在解决什么</h2><p>企业做视频内容时，难点不是某一个 AI 工具不够强，而是选题、文案、人物、声音、素材、成片与发布被分散在不同流程中。Kali 将这些环节连成一个可追踪、可复用、可协作的内容工作台。</p></div>
      </section>
      <section className="about-values">
        <article><TrendingUp size={22} /><strong>从趋势到选题</strong><p>聚合公开热点与媒体信号，帮助团队更快找到值得表达的话题。</p></article>
        <article><Sparkles size={22} /><strong>从创意到成片</strong><p>组合文案、数字人、声音、音乐、图片和模板，完成多场景视频生产。</p></article>
        <article><Globe2 size={22} /><strong>面向全球市场</strong><p>独立站版会持续完善多语言、跨时区协作与主流媒体发布能力。</p></article>
      </section>
      <section className="company-facts">
        <div><span>PRODUCT</span><strong>Kali · Yixiu</strong></div>
        <div><span>FOCUS</span><strong>AI Content Production</strong></div>
        <div><span>WORKFLOW</span><strong>Discover · Create · Publish</strong></div>
      </section>
    </div>
  );
}

function ContactPage({ onOpen }) {
  return (
    <div className="public-page">
      <PublicPageHeader
        eyebrow="CONTACT"
        title="联系我们"
        description="根据你的问题选择对应邮箱，便于更快分流和处理。"
        onBack={() => onOpen('home')}
      />
      <section className="contact-grid">
        <a href="mailto:feedback@xyaip.fun" className="contact-card">
          <span><Mail size={22} /></span><div><small>PRODUCT SUPPORT</small><strong>产品反馈与商务合作</strong><p>feedback@xyaip.fun</p></div><ExternalLink size={17} />
        </a>
        <a href="mailto:privacy@xyaip.fun" className="contact-card">
          <span><ShieldCheck size={22} /></span><div><small>PRIVACY REQUEST</small><strong>隐私、删除与撤回授权</strong><p>privacy@xyaip.fun</p></div><ExternalLink size={17} />
        </a>
      </section>
      <section className="contact-guide">
        <h2>联系时请附上</h2>
        <div><span>01</span><p>账号所用邮箱（不要发送密码或登录令牌）</p></div>
        <div><span>02</span><p>问题发生时间、功能页面和可复现步骤</p></div>
        <div><span>03</span><p>需要删除或撤回授权时，说明对应资产类型与任务标识</p></div>
      </section>
    </div>
  );
}

function MediaAccountsPage({ onOpen }) {
  const channels = [
    ['微信公众号', '国内产品动态与使用教程'],
    ['抖音 / 视频号', '产品演示与视频创作案例'],
    ['小红书 / Bilibili', '创作方法、流程拆解与更新日志'],
    ['TikTok / YouTube', '海外版产品演示与创作实践'],
    ['LinkedIn', '海外业务动态与合作信息'],
  ];
  return (
    <div className="public-page">
      <PublicPageHeader
        eyebrow="OFFICIAL CHANNELS"
        title="官方媒体账号"
        description="官方账号正在统一认证和建设中，这里将成为唯一的对外账号索引。"
        onBack={() => onOpen('home')}
      />
      <section className="media-channel-grid">
        {channels.map(([name, description]) => (
          <article key={name}><span className="media-channel-icon"><Globe2 size={21} /></span><div><strong>{name}</strong><p>{description}</p></div><em>筹备中</em></article>
        ))}
      </section>
      <section className="media-safety-note">
        <ShieldCheck size={21} />
        <div><strong>账号安全提醒</strong><p>当前未公布可验证的官方媒体 ID。任何以 Kali 或 Yixiu 名义索要密码、验证码或转账的账号均不可信。如需核验，请发送邮件至 <a href="mailto:feedback@xyaip.fun">feedback@xyaip.fun</a>。</p></div>
      </section>
    </div>
  );
}

function PublicInfoPage({ active, onOpen }) {
  if (active === 'info-agreements') return <AgreementCenterPage onOpen={onOpen} />;
  if (active === 'info-about') return <AboutPage onOpen={onOpen} />;
  if (active === 'info-contact') return <ContactPage onOpen={onOpen} />;
  if (active === 'info-media') return <MediaAccountsPage onOpen={onOpen} />;
  return <LegalDocumentPage document={legalDocuments[active]} onOpen={onOpen} />;
}

function SiteFooter({ onOpen }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand"><span className="brand-mark">K</span><div><strong>Kali</strong><small>AI Content Production Workspace</small></div></div>
      <div className="site-footer__links">
        <div><strong>产品</strong><button onClick={() => onOpen('home')}>工作台</button><button onClick={() => onOpen('info-about')}>关于我们</button><button onClick={() => onOpen('info-media')}>官方媒体</button></div>
        <div><strong>合规</strong><button onClick={() => onOpen('info-agreements')}>协议中心</button><button onClick={() => onOpen('legal-user')}>用户服务协议</button><button onClick={() => onOpen('legal-privacy')}>隐私政策</button><button onClick={() => onOpen('legal-payment')}>支付政策</button><button onClick={() => onOpen('legal-refund')}>退款政策</button></div>
        <div><strong>专项授权</strong><button onClick={() => onOpen('legal-voice')}>声纹授权</button><button onClick={() => onOpen('legal-avatar')}>数字人形象授权</button><button onClick={() => onOpen('legal-image')}>形象信息采集</button></div>
        <div><strong>支持</strong><button onClick={() => onOpen('info-contact')}>联系我们</button><a href="mailto:feedback@xyaip.fun">feedback@xyaip.fun</a><a href="mailto:privacy@xyaip.fun">privacy@xyaip.fun</a></div>
      </div>
      <div className="site-footer__bottom"><span>© 2026 Kali</span><span>Kali · Yixiu</span></div>
    </footer>
  );
}

function PasswordResetPage({ initialEmail = '', onBackToLogin }) {
  const [email, setEmail] = useState(initialEmail);
  const [step, setStep] = useState('request');
  const [resetForm, setResetForm] = useState({ code: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState({ loading: false, message: '' });

  const submitRequest = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '' });
    const result = await requestPasswordReset({ email });
    if (result.ok) {
      setStep('confirm');
      setStatus({
        loading: false,
        message: 'Verification code sent.',
      });
      return;
    }
    setStatus({
      loading: false,
      message: result.message || 'Password reset failed',
    });
  };

  const submitConfirm = async (event) => {
    event.preventDefault();
    if (resetForm.newPassword.length < 8) {
      setStatus({ loading: false, message: 'New password must be at least 8 characters.' });
      return;
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setStatus({ loading: false, message: 'The two new passwords do not match.' });
      return;
    }
    setStatus({ loading: true, message: '' });
    const result = await confirmPasswordReset({
      email,
      code: resetForm.code,
      newPassword: resetForm.newPassword,
    });
    if (result.ok) {
      setStatus({ loading: false, message: 'Password updated. Please keep your new password safe.' });
      setResetForm({ code: '', newPassword: '', confirmPassword: '' });
      return;
    }
    setStatus({ loading: false, message: result.message || 'Password reset failed' });
  };

  const updateResetForm = (key, value) => setResetForm((current) => ({ ...current, [key]: value }));
  const statusIsError = /failed|fail|match|least|验证码|错误|失效|过期/i.test(status.message);

  return (
    <div className="password-reset-page">
      <section className="password-reset-card">
        <button className="password-reset-back" type="button" onClick={onBackToLogin}>
          <ArrowLeft size={17} />
          Back to sign in
        </button>
        <div className="password-reset-icon"><KeyRound size={28} /></div>
        <span>ACCOUNT SECURITY</span>
        <h1>Reset password</h1>
        <p>{step === 'request' ? 'Enter your account email and we will send password reset instructions.' : 'Verification code'}</p>
        <form className="password-reset-form" onSubmit={step === 'request' ? submitRequest : submitConfirm}>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={step === 'confirm'} />
          </label>
          {step === 'confirm' && (
            <>
              <label>
                <span>Verification code</span>
                <input inputMode="numeric" value={resetForm.code} onChange={(event) => updateResetForm('code', event.target.value.trim())} required />
              </label>
              <label>
                <span>New password</span>
                <input type="password" minLength={8} value={resetForm.newPassword} onChange={(event) => updateResetForm('newPassword', event.target.value)} required />
              </label>
              <label>
                <span>Confirm new password</span>
                <input type="password" minLength={8} value={resetForm.confirmPassword} onChange={(event) => updateResetForm('confirmPassword', event.target.value)} required />
              </label>
            </>
          )}
          {status.message && <div className={`form-message ${statusIsError ? 'is-error' : ''}`}>{status.message}</div>}
          {step === 'confirm' && (
            <button type="button" className="outline-button" onClick={submitRequest} disabled={status.loading}>
              {status.loading ? 'Sending' : 'Send code'}
            </button>
          )}
          <button className="primary-button" disabled={status.loading}>
            {step === 'request' ? <Mail size={17} /> : <ShieldCheck size={17} />}
            {status.loading ? (step === 'request' ? 'Sending' : 'Saving') : (step === 'request' ? 'Send code' : 'Reset password')}
          </button>
        </form>
      </section>
    </div>
  );
}

function LoginModal({ open, onClose, onSuccess, onOpenInfo, onForgotPassword }) {
  const [form, setForm] = useState({ email: '', password: '', nickname: '', autoCreate: true, agreement: false });
  const [status, setStatus] = useState({ loading: false, message: '' });

  if (!open) return null;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();

    if (!form.agreement) {
      setStatus({ loading: false, message: '请先阅读并同意用户服务协议和隐私政策' });
      return;
    }
    setStatus({ loading: true, message: '' });
    const result = await emailLogin(form);

    if (result.ok && storeSession(result.data)) {
      setStatus({ loading: false, message: 'Signed in successfully' });
      onSuccess();
      onClose();
      return;
    }

    setStatus({ loading: false, message: result.message || 'Email login failed' });
  };

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Email login">
      <form className="modal-card login-card" onSubmit={submit}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <h2>Email login</h2>
        <p>Use your email and password to access the workspace.</p>
        <div className="modal-grid login-grid">
          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              required
            />
          </label>
          <div className="login-inline-action">
            <button type="button" onClick={() => onForgotPassword(form.email)}>Forgot password?</button>
          </div>
          <label>
            <span>Nickname</span>
            <input value={form.nickname} onChange={(event) => update('nickname', event.target.value)} placeholder="Optional" />
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.autoCreate}
              onChange={(event) => update('autoCreate', event.target.checked)}
            />
            <span>Auto-create account on first login</span>
          </label>
          <div className="login-consent-row">
            <label><input type="checkbox" checked={form.agreement} onChange={(event) => update('agreement', event.target.checked)} /><span>我已阅读并同意</span></label>
            <span><button type="button" onClick={() => onOpenInfo('legal-user')}>《用户服务协议》</button>与<button type="button" onClick={() => onOpenInfo('legal-privacy')}>《隐私政策》</button></span>
          </div>
        </div>
        {status.message && <div className="form-message">{status.message}</div>}
        <div className="modal-actions">
          <button type="button" className="outline-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={status.loading || !form.agreement}>
            <UserRound size={17} />
            {status.loading ? 'Signing in' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}

const NOTIFICATION_POLL_MS = 60 * 1000;

const getInitialWorkspacePage = () => {
  if (typeof window === 'undefined') return 'home';
  const page = new URLSearchParams(window.location.search).get('page');
  return page === 'password-reset' ? 'password-reset' : 'home';
};

const getNotificationDateValue = (raw = {}) => pick(
  raw.updated_at,
  raw.updatedAt,
  raw.completed_at,
  raw.completedAt,
  raw.finish_time,
  raw.finishTime,
  raw.created_at,
  raw.createdAt,
  raw.create_time,
  raw.createTime,
  raw.created_time,
);

const parseNotificationTime = (value) => {
  if (!value) return 0;
  const numeric = Number(value);
  const normalizedValue = typeof value === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
    ? value.replace(' ', 'T')
    : value;
  const date = new Date(Number.isFinite(numeric) && numeric > 0 && numeric < 1000000000000 ? numeric * 1000 : normalizedValue);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const formatNotificationTime = (timestamp) => {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  if (diff >= 0 && diff < 60 * 1000) return '刚刚';
  if (diff >= 0 && diff < 60 * 60 * 1000) return `${Math.max(1, Math.floor(diff / 60000))} 分钟前`;
  if (diff >= 0 && diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`;
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(timestamp);
};

const notificationKindConfig = {
  video: { label: '视频制作', destination: 'video' },
  smartVideo: { label: '智能成片', destination: 'video' },
  image: { label: '图片生成', destination: 'image' },
  human: { label: '数字人训练', destination: 'assets', assetMode: 'video' },
  imageHuman: { label: '图片数字人训练', destination: 'assets', assetMode: 'image' },
  voice: { label: '声音训练', destination: 'assets', assetMode: 'voice' },
  music: { label: '音乐制作', destination: 'music' },
};

const getOfficialNotificationKind = (item = {}) => {
  const taskType = textOf(item.task_type || item.taskType).toLowerCase();
  const notificationType = textOf(item.notification_type || item.notificationType).toLowerCase();
  if (taskType === 'human_image') return 'imageHuman';
  if (['video_mix', 'video_clip'].includes(taskType) || notificationType === 'video_mix') return 'smartVideo';
  if (notificationType === 'image' || taskType === 'gpt_image_2_image') return 'image';
  if (notificationType === 'voice' || taskType === 'voice') return 'voice';
  if (notificationType === 'ai_human' || ['human_video', 'human_voice'].includes(taskType)) return 'human';
  if (['music', 'music_video', 'music_voice'].includes(notificationType) || taskType.startsWith('suno_')) return 'music';
  if (notificationType === 'video' || ['digital_human_video', 'human_broadcast'].includes(taskType)) return 'video';
  return 'video';
};

const getOfficialNotificationDestination = (item = {}, kind) => {
  const path = textOf(item.target_path || item.targetPath).toLowerCase();
  if (/image-generation/.test(path)) return { destination: 'image', assetMode: '' };
  if (/music-generated/.test(path)) return { destination: 'music', assetMode: '' };
  if (/aihuman\?type=voice/.test(path)) return { destination: 'assets', assetMode: 'voice' };
  if (/aihuman\?type=video|mix-video-production/.test(path)) return { destination: 'video', assetMode: '' };
  if (/aihuman/.test(path)) return { destination: 'assets', assetMode: kind === 'imageHuman' ? 'image' : 'video' };
  const config = notificationKindConfig[kind] || notificationKindConfig.video;
  return { destination: config.destination, assetMode: config.assetMode || '' };
};

const notificationReadFlag = (value) => value === true || value === 1 || ['1', 'true', 'yes'].includes(textOf(value).toLowerCase());

const normalizeOfficialNotification = (item = {}, index = 0) => {
  const kind = getOfficialNotificationKind(item);
  const config = notificationKindConfig[kind] || notificationKindConfig.video;
  const status = normalizeStatus(item.status);
  const normalizedStatus = status.key === 'ready' ? { key: 'success', label: '已完成' } : status;
  const id = textOf(item.id || item.notification_id || item.notificationId || `notification-${index}`);
  const timestamp = parseNotificationTime(getNotificationDateValue(item));
  const target = getOfficialNotificationDestination(item, kind);
  return {
    id,
    eventId: `notification:${id}`,
    kind,
    title: textOf(item.title) || `${config.label}${normalizedStatus.key === 'failed' ? '失败' : '完成'}`,
    subject: textOf(item.content) || `${config.label}状态已更新`,
    status: normalizedStatus,
    timestamp,
    timeLabel: formatNotificationTime(timestamp),
    destination: target.destination,
    assetMode: target.assetMode,
    read: notificationReadFlag(item.is_read ?? item.isRead),
    raw: item,
  };
};

const getOfficialNotificationPayload = (result = {}) => {
  const data = result.data && typeof result.data === 'object' ? result.data : {};
  const items = Array.isArray(data.items) ? data.items : toList(data);
  const unreadCount = Number(data.unread_count ?? data.unreadCount ?? 0);
  return { items, unreadCount: Number.isFinite(unreadCount) ? Math.max(0, unreadCount) : 0 };
};

function useTaskNotifications({ authed, authVersion }) {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [desktopPermission, setDesktopPermission] = useState(() => (
    typeof window !== 'undefined' && 'Notification' in window ? window.Notification.permission : 'unsupported'
  ));
  const seenCompletedRef = useRef(null);
  const unreadCountRef = useRef(0);
  const loadingRef = useRef(false);

  const load = useCallback(async () => {
    if (!authed || loadingRef.current) {
      if (!authed) setItems([]);
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    try {
      const result = await apiFetch('/api/notifications', { params: { limit: 60, offset: 0 }, timeoutMs: 12000 });
      if (!result.ok) return;
      const payload = getOfficialNotificationPayload(result);
      const records = payload.items.map(normalizeOfficialNotification).sort((a, b) => b.timestamp - a.timestamp);
      const completedIds = new Set(records.map((item) => item.eventId));
      if (seenCompletedRef.current && desktopPermission === 'granted' && 'Notification' in window) {
        records
          .filter((item) => !seenCompletedRef.current.has(item.eventId))
          .slice(0, 3)
          .forEach((item) => {
            const notice = new window.Notification(item.title, { body: item.subject, tag: item.eventId });
            notice.onclick = () => window.focus();
          });
      }
      seenCompletedRef.current = completedIds;
      unreadCountRef.current = payload.unreadCount;
      setUnreadCount(payload.unreadCount);
      setItems(records);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [authed, authVersion, desktopPermission]);

  const pollUnreadCount = useCallback(async () => {
    if (!authed) return;
    const result = await apiFetch('/api/notifications/unread_count', { timeoutMs: 8000 });
    if (!result.ok) return;
    const value = Number(result.data?.unread_count ?? result.data?.unreadCount ?? 0);
    const nextCount = Number.isFinite(value) ? Math.max(0, value) : 0;
    if (nextCount !== unreadCountRef.current) {
      await load();
    } else {
      setUnreadCount(nextCount);
    }
  }, [authed, load]);

  useEffect(() => {
    seenCompletedRef.current = null;
    if (!authed) {
      setItems([]);
      unreadCountRef.current = 0;
      setUnreadCount(0);
      return undefined;
    }
    load();
    const timer = window.setInterval(pollUnreadCount, NOTIFICATION_POLL_MS);
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [authed, authVersion, load, pollUnreadCount]);

  const markAllRead = async () => {
    if (!unreadCountRef.current) return;
    setItems((current) => current.map((item) => ({ ...item, read: true })));
    unreadCountRef.current = 0;
    setUnreadCount(0);
    const result = await apiFetch('/api/notifications/read_all', { method: 'POST', timeoutMs: 8000 });
    if (!result.ok) load();
  };

  const markRead = async (item) => {
    if (!item?.id || item.read) return;
    setItems((current) => current.map((entry) => (entry.id === item.id ? { ...entry, read: true } : entry)));
    unreadCountRef.current = Math.max(0, unreadCountRef.current - 1);
    setUnreadCount(unreadCountRef.current);
    const result = await apiFetch(`/api/notifications/${encodeURIComponent(item.id)}/read`, { method: 'POST', timeoutMs: 8000 });
    if (!result.ok) load();
  };

  const enableDesktop = async () => {
    if (!('Notification' in window)) return;
    const permission = await window.Notification.requestPermission();
    setDesktopPermission(permission);
  };

  return {
    items,
    unreadCount,
    loading,
    desktopPermission,
    load,
    markAllRead,
    markRead,
    enableDesktop,
  };
}

export default function App() {
  const [language, setLanguage] = useState(getInitialLocale);
  const [active, setActive] = useState(getInitialWorkspacePage);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [videoCreatorOpen, setVideoCreatorOpen] = useState(false);
  const [videoCreatorPrefill, setVideoCreatorPrefill] = useState(false);
  const [videoCreatorType, setVideoCreatorType] = useState('oral');
  const [videoCreatorReturn, setVideoCreatorReturn] = useState({ active: 'video', generator: null });
  const [loginOpen, setLoginOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [authVersion, setAuthVersion] = useState(0);
  const [agentVersion, setAgentVersion] = useState(0);
  const [editorSeed, setEditorSeed] = useState(null);
  const [generatorAgent, setGeneratorAgent] = useState(null);
  const [imageTrainingSeed, setImageTrainingSeed] = useState(null);
  const [assetInitialMode, setAssetInitialMode] = useState('');
  const [assistantUsesHotTopic, setAssistantUsesHotTopic] = useState(false);
  const t = useMemo(() => getCopy(language), [language]);
  const isHome = active === 'home';
  const isPublicInfo = active.startsWith('info-') || Boolean(legalDocuments[active]);
  const authed = Boolean(getAccessToken());
  const taskNotifications = useTaskNotifications({ authed, authVersion });
  useAutoTranslate(language);

  const syncWorkspacePageQuery = (id) => {
    const url = new URL(window.location.href);
    if (id === 'password-reset') {
      url.searchParams.set('page', 'password-reset');
    } else {
      url.searchParams.delete('page');
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };
  const selectNav = (id, { preserveHotTopic = false } = {}) => {
    const useHotTopic = id === 'assistant' && preserveHotTopic;
    if (id === 'assistant' && !useHotTopic) window.localStorage.removeItem(HOT_TOPIC_FLOW_KEY);
    setAssistantUsesHotTopic(useHotTopic);
    syncWorkspacePageQuery(id);
    setActive(id);
    setVideoCreatorOpen(false);
    setVideoCreatorPrefill(false);
    setEditorSeed(null);
    setGeneratorAgent(null);
    setImageTrainingSeed(null);
    setAssetInitialMode('');
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const refreshAuth = () => setAuthVersion((value) => value + 1);
  const logout = () => {
    clearSession();
    refreshAuth();
  };
  const openVideoCreator = ({ prefill = false, returnTo = active, productionType = '' } = {}) => {
    if (!prefill) window.localStorage.removeItem(VIDEO_PREFILL_KEY);
    let storedProductionType = '';
    if (prefill) {
      try {
        const draft = JSON.parse(window.localStorage.getItem(VIDEO_PREFILL_KEY) || '{}');
        storedProductionType = inferCreatorProductionType(
          draft.payload_json,
          draft.payloadJson,
          draft.detail?.payload_json,
          draft.detail?.payloadJson,
          draft.materials_json,
          draft.materialsJson,
          draft.detail?.materials_json,
          draft.detail?.materialsJson,
          draft,
          draft.detail,
        ) || draft.productionType || draft.production_type || draft.detail?.productionType || draft.detail?.production_type || '';
      } catch {
        storedProductionType = '';
      }
    }
    const nextProductionType = prefill && VIDEO_PRODUCTION_TYPES[storedProductionType]
      ? storedProductionType
      : VIDEO_PRODUCTION_TYPES[productionType]
        ? productionType
        : VIDEO_PRODUCTION_TYPES[storedProductionType] ? storedProductionType : 'oral';
    syncWorkspacePageQuery('video');
    setVideoCreatorReturn({
      active: returnTo === 'generator' ? 'assistant' : returnTo,
      generator: returnTo === 'generator' ? generatorAgent : null,
    });
    setVideoCreatorPrefill(prefill);
    setVideoCreatorType(nextProductionType);
    setVideoCreatorOpen(true);
    setActive('video');
    setMobileNav(false);
  };
  const closeVideoCreator = () => {
    setVideoCreatorOpen(false);
    setVideoCreatorPrefill(false);
    setActive(videoCreatorReturn.active || 'video');
    setGeneratorAgent(videoCreatorReturn.generator || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const useAssetInVideo = (asset, kind) => {
    let draft = {};
    try {
      draft = JSON.parse(window.localStorage.getItem(VIDEO_PREFILL_KEY) || '{}');
    } catch {
      draft = {};
    }
    const next = kind === 'voice' ? {
      ...draft,
      productionType: 'oral',
      voiceId: asset.id,
      speakerId: asset.id,
      voiceName: asset.title,
      speakerName: asset.title,
      voiceSpeedRatio: Number(asset.speed) || 1,
    } : {
      ...draft,
      productionType: 'oral',
      humanId: asset.id,
      aiHumanId: asset.id,
      virtualmanId: asset.id,
      humanName: asset.title,
      aiHumanName: asset.title,
      virtualmanName: asset.title,
      humanPreviewUrl: asset.cover || '',
    };
    window.localStorage.setItem(VIDEO_PREFILL_KEY, JSON.stringify(next));
    openVideoCreator({ prefill: true });
  };
  const openNotificationItem = (item) => {
    taskNotifications.markRead(item);
    setVideoCreatorOpen(false);
    setVideoCreatorPrefill(false);
    setEditorSeed(null);
    setGeneratorAgent(null);
    setImageTrainingSeed(null);
    setAssetInitialMode(item.assetMode || '');
    syncWorkspacePageQuery(item.destination);
    setActive(item.destination);
    setMobileNav(false);
  };
  const openPasswordReset = (email = '') => {
    setPasswordResetEmail(email);
    setLoginOpen(false);
    selectNav('password-reset');
  };

  return (
    <div className="app-shell">
      <div className={`mobile-scrim ${mobileNav ? 'is-visible' : ''}`} onClick={() => setMobileNav(false)} />
      <div className={`sidebar-wrap ${mobileNav ? 'is-open' : ''}`}>
        <Sidebar active={active} collapsed={collapsed} onSelect={selectNav} onToggle={() => setCollapsed(!collapsed)} />
      </div>
      <main className={`main-shell ${collapsed ? 'is-expanded' : ''}`}>
        <Topbar
          language={language}
          setLanguage={setLanguage}
          onNewVideo={() => openVideoCreator()}
          onLogin={() => setLoginOpen(true)}
          onLogout={logout}
          onMenu={() => setMobileNav(true)}
          authed={authed}
          notifications={{
            items: taskNotifications.items,
            unreadCount: taskNotifications.unreadCount,
            loading: taskNotifications.loading,
            desktopPermission: taskNotifications.desktopPermission,
            onEnableDesktop: taskNotifications.enableDesktop,
            onMarkAllRead: taskNotifications.markAllRead,
            onOpenItem: openNotificationItem,
            onRefresh: taskNotifications.load,
          }}
        />
        <div className="workspace">
          {generatorAgent && (
            <div className={videoCreatorOpen ? 'preserved-page is-hidden' : 'preserved-page'}>
              <CopyGeneratorPage
                agent={generatorAgent}
                useHotTopicFlow={assistantUsesHotTopic}
                onBack={() => setGeneratorAgent(null)}
                onLogin={() => setLoginOpen(true)}
                onMakeVideo={() => openVideoCreator({ prefill: true, returnTo: 'generator' })}
                onMakeMusic={() => {
                  setGeneratorAgent(null);
                  setActive('music');
                  setMobileNav(false);
                }}
              />
            </div>
          )}
          {isPublicInfo ? (
            <PublicInfoPage active={active} onOpen={selectNav} />
          ) : active === 'password-reset' ? (
            <PasswordResetPage
              initialEmail={passwordResetEmail}
              onBackToLogin={() => {
                setLoginOpen(true);
                selectNav('home');
              }}
            />
          ) : videoCreatorOpen ? (
            <VideoCreatorPage
              authVersion={authVersion}
              usePrefill={videoCreatorPrefill}
              productionType={videoCreatorType}
              backLabel={videoCreatorReturn.generator ? '返回文案生成' : videoCreatorReturn.active === 'assets' ? '返回资产管理' : '返回视频管理'}
              onBack={closeVideoCreator}
              onLogin={() => setLoginOpen(true)}
              onChangeProductionType={setVideoCreatorType}
              onCreated={() => {
                setVideoCreatorOpen(false);
                setVideoCreatorPrefill(false);
                setGeneratorAgent(null);
                setActive('video');
                refreshAuth();
              }}
            />
          ) : editorSeed ? (
            <InstructionSetEditorPage
              seed={editorSeed}
              onBack={() => setEditorSeed(null)}
              onLogin={() => setLoginOpen(true)}
              onSaved={() => {
                setEditorSeed(null);
                setAgentVersion((value) => value + 1);
                setActive('assistant');
              }}
            />
          ) : generatorAgent ? (
            null
          ) : isHome ? (
            <>
              <section className="hero-panel">
                <div className="hero-copy">
                  <span>HOT TOPIC TO VIDEO</span>
                  <h1>{t.workspace}</h1>
                  <div className="hero-actions">
                    <button className="primary-button" onClick={() => selectNav('trends')}>
                      <TrendingUp size={18} />
                      <span>从热点开始</span>
                    </button>
                    <button className="outline-button" onClick={() => openVideoCreator({ productionType: 'oral' })}>
                      <Video size={18} />
                      <span>直接制作视频</span>
                    </button>
                  </div>
                </div>
              </section>
              <HomeWorkflow onSelect={selectNav} onStartVideo={openVideoCreator} />
              <div className="content-grid">
                <div className="content-main">
                  <SupportGrid active={active} onSelect={selectNav} />
                </div>
                <div className="content-side">
                  <TrendsPanel />
                </div>
              </div>
            </>
          ) : (
            active === 'trends' ? (
              <HotTrendsPage onTopicSelect={() => selectNav('assistant', { preserveHotTopic: true })} />
            ) : active === 'assistant' ? (
              <AssistantPage
                authVersion={authVersion + agentVersion}
                useHotTopicFlow={assistantUsesHotTopic}
                onLogin={() => setLoginOpen(true)}
                onCreateAgent={(agent) => setEditorSeed(agent || {})}
                onOpenGenerator={(agent) => setGeneratorAgent(agent)}
              />
            ) : active === 'materials' ? (
              <MaterialsPage
                authVersion={authVersion}
                onLogin={() => setLoginOpen(true)}
              />
            ) : active === 'templates' ? (
              <TemplatesPage
                authVersion={authVersion}
              />
            ) : active === 'image' ? (
              <ImageStudioPage
                authVersion={authVersion}
                onLogin={() => setLoginOpen(true)}
                onOpenBilling={() => { setImageTrainingSeed(null); setActive('billing'); }}
                onOpenInfo={selectNav}
                onUseForDigitalHuman={(image) => {
                  setImageTrainingSeed(image);
                  setAssetInitialMode('image');
                  setActive('assets');
                }}
              />
            ) : active === 'music' ? (
              <MusicStudioPage
                authVersion={authVersion}
                onLogin={() => setLoginOpen(true)}
                onOpenLyrics={() => selectNav('assistant')}
                onOpenBilling={() => selectNav('billing')}
              />
            ) : active === 'video' ? (
              <VideoStudioPage
                authVersion={authVersion}
                onLogin={() => setLoginOpen(true)}
                onNewVideo={openVideoCreator}
              />
            ) : active === 'assets' ? (
              <AssetStudioPage
                authVersion={authVersion}
                language={language}
                onLogin={() => setLoginOpen(true)}
                onOpenInfo={selectNav}
                onUseAsset={useAssetInVideo}
                initialImageId={imageTrainingSeed?.id || ''}
                initialMode={assetInitialMode}
              />
            ) : active === 'billing' ? (
              <BillingPage language={language} authVersion={authVersion} />
            ) : active === 'settings' ? (
              <SettingsPage
                authVersion={authVersion}
                onLogin={() => setLoginOpen(true)}
                onLogout={logout}
              />
            ) : (
              <ResourcePage
                active={active}
                language={language}
                authVersion={authVersion}
                onNewVideo={openVideoCreator}
              />
            )
          )}
          <SiteFooter onOpen={selectNav} />
        </div>
      </main>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={refreshAuth}
        onOpenInfo={(id) => { setLoginOpen(false); selectNav(id); }}
        onForgotPassword={openPasswordReset}
      />
    </div>
  );
}
