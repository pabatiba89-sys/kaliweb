const guides = {
  'zh-cn': {
    lead: '选剪辑模板，就是给内容选一套合适的呈现方式。先看看字幕、画面和节奏顺不顺眼，再挑适合你这条内容的样式。视频模板和封面模板，可以分开看、分开选。',
    description: '看看喀理的视频和封面模板：三种可播放样式、实际页面截图，以及横竖屏比例、模板预览和制作页选用方法。', toc: '先看样式，再去制作',
    demoTitle: '先点开这几种样式看看', demoNote: '以下是模板自带的演示，人物和文案用于展示样式。实际可选模板以制作页为准。', demoNames: ['高级白', '简约白黄', '商务黑金'], demoDescriptions: ['先看字幕位置、字重和人物的留白。', '看看白黄字幕的重点区分，是否适合你的表达。', '看看深色配色和包装元素，画面会不会太重。'],
    sections: [
      { title: '先分清：视频模板和封面模板', body: '这两个名字看着像，管的其实是不同地方。', items: [['视频模板', '看视频播放时的字幕、文字布局和画面包装。卡片上有「播放」的，可以先看一段演示。'], ['封面模板', '看封面的标题样式和版式。它主要是静态样式，和视频里的字幕包装分开选择。']] },
      { title: '模板页，从哪里进去？', body: '点本页上方「进入工作台」，可以直接打开模板页。已登录时，也能从工作台右上角的账户菜单进入「模板」。', image: 'video-templates.png', caption: '实际模板页：上方切换视频模板和封面模板，下方查看各个样式。模板列表会更新。', items: [] },
      { title: '视频模板，先播放再判断', body: '先挑两三种看着合适的，不用挨个试一遍。比如下面这几种，点播放器就能看演示。', demos: true, items: [['看字幕好不好读', '字是不是太小，重点能不能一眼看见？文案比较长时，还要留意换行后会不会压住人物。'], ['看画面合不合适', '人物有没有被大字、边框或其他元素挡住？包装的颜色和节奏，跟你平时的表达搭不搭？'], ['想多看一些', '在模板页继续往下浏览；还有更多结果时，可以点「加载更多」。有演示的视频模板在原卡片里播放。']] },
      { title: '封面模板，主要看标题和留白', body: '切到「封面模板」，先看标题放在哪里、能放多少字，再看颜色和装饰。用你的真实标题想一想，别只看演示里的字好不好看。', image: 'cover-templates.png', caption: '实际封面模板页：这里看静态封面样式，卡片会显示对应比例。', items: [['标题先短一点', '尽量让人一眼知道这条内容讲什么。标题太长，换一套模板也可能挤。'], ['主体要留出来', '有自己的人物照或产品图时，看看标题会不会盖住脸或重要画面。'], ['留意卡片比例', '封面按卡片显示的实际比例来选。截图里有 3:4 的封面样式，不要直接当成视频的 9:16 或 16:9。']] },
      { title: '横屏、竖屏，先选对再看样式', body: '制作页的视频模板选择弹窗会区分 9:16 和 16:9，打开时默认看 9:16。换成横屏内容时，记得切到 16:9。', items: [['9:16 竖屏', '画面更窄，留意人脸、字幕和标题能不能一起放得下。'], ['16:9 横屏', '左右空间更宽，选横屏模板后再看文字和主体的位置。'], ['模板还要跟制作方式匹配', '数字人口播、混剪和真人视频包装会按当前模式提供模板。展示页看到的样式，是否能用，以对应制作页的列表为准。']] },
      { title: '看中了，怎么用到自己的视频里？', body: '模板展示页先用来浏览和看演示。记住喜欢的样式名称，再回到对应的视频制作页选择。', items: [['在制作页选模板', '找到「视频包装」「混剪模板」或「包装模板」入口，按当前模式和比例挑选。需要封面时，再单独选封面模板。'], ['用自己的内容试一条', '放进真实文案和素材后，先试做一条。检查字幕换行、人物位置和封面标题，再决定要不要继续用这套样式。'], ['给系列留一套常用风格', '找到合适的样式后，可以在同一系列里持续使用，让人更容易认出你的内容。选模板本身不会自动制作或发布视频。']] },
    ],
  },
  'zh-tw': {
    lead: '選剪輯範本，就是替內容選一套合適的呈現方式。先看看字幕、畫面和節奏，再挑適合這支內容的樣式。影片範本和封面範本，可以分開看、分開選。',
    description: '查看喀理影片和封面範本：三種可播放樣式、實際頁面截圖，以及橫豎屏比例、預覽和製作頁選用方法。', toc: '先看樣式，再去製作',
    demoTitle: '先點開這幾種樣式看看', demoNote: '以下是範本自帶的展示，人物和文案用於呈現樣式。實際可選範本以製作頁為準。', demoNames: ['高級白', '簡約白黃', '商務黑金'], demoDescriptions: ['看看字幕位置、字重和人物留白。', '看看白黃字幕的重點區分是否合適。', '看看深色配色和包裝元素會不會太重。'],
    sections: [
      { title: '先分清：影片範本和封面範本', body: '兩者各自處理不同地方。', items: [['影片範本', '看播放時的字幕、文字布局和畫面包裝。有播放入口的卡片，可以先看展示影片。'], ['封面範本', '看封面的標題和版式，主要是靜態樣式，與影片字幕包裝分開選。']] },
      { title: '範本頁，從哪裡進去？', body: '點本頁上方進入工作台可直達範本頁。已登入時，也能從右上角帳戶選單開啟範本。截圖使用簡體中文介面。', image: 'video-templates.png', caption: '實際範本頁：上方切換影片與封面，下方瀏覽樣式，列表會更新。', items: [] },
      { title: '影片範本，先播放再判斷', body: '先挑兩三種合適的看看，下方播放器可直接看展示。', demos: true, items: [['字幕好讀嗎', '檢查字體大小、重點是否清楚，長文案換行後是否擋住人物。'], ['畫面合適嗎', '人物有沒有被大字或邊框擋住？配色和節奏是否符合平時的表達？'], ['想多看一些', '繼續往下瀏覽，有更多結果時點載入更多；有展示影片的範本在原卡片裡播放。']] },
      { title: '封面範本，看標題和留白', body: '切到封面範本，先看標題位置和可放字數，再看配色裝飾。用自己的標題試想一下。', image: 'cover-templates.png', caption: '實際封面頁：查看靜態樣式與卡片標示的比例。', items: [['標題先短一點', '讓人一眼看懂主題，太長的標題換範本也可能擠。'], ['主體要留出來', '留意標題是否遮住人臉或產品重點。'], ['看卡片比例', '依卡片標示選擇。截圖包含 3:4 封面，不要當成影片的 9:16 或 16:9。']] },
      { title: '橫屏、豎屏，先選對比例', body: '製作頁的影片範本彈窗區分 9:16 和 16:9，預設先顯示 9:16。橫屏內容記得切到 16:9。', items: [['9:16 豎屏', '畫面較窄，留意人臉、字幕和標題是否放得下。'], ['16:9 橫屏', '左右較寬，選對範本後再看文字和主體位置。'], ['配合製作方式', '數位人口播、混剪和真人影片包裝提供的範本可能不同，以對應製作頁為準。']] },
      { title: '看中了，怎麼用到自己的影片？', body: '展示頁用來瀏覽和看示範。記住喜歡的樣式名稱，再回到影片製作頁選擇。', items: [['在製作頁挑選', '找到影片包裝、混剪範本或包裝範本入口，按模式和比例挑選，封面另選。'], ['先用自己的內容試一支', '檢查真實文案的換行、人物位置和封面標題，再決定是否沿用。'], ['系列留一套常用樣式', '同系列持續使用合適風格。選範本本身不會自動製作或發布影片。']] },
    ],
  },
  en: {
    lead: 'Choose a template by how it presents your content. Look at the captions, layout, and pacing first, then decide what suits your video. Video and cover templates can be browsed and selected separately.',
    description: 'Explore Kali video and cover templates with three playable examples, actual page screenshots, aspect-ratio guidance, and steps for selecting a template during production.', toc: 'Browse, preview, then create',
    demoTitle: 'Play a few styles first', demoNote: 'These are the templates’ own demo clips. People and scripts illustrate the style. Availability depends on the production page.', demoNames: ['Clean white', 'White and yellow', 'Business black and gold'], demoDescriptions: ['Look at caption placement, weight, and space around the presenter.', 'See whether the white and yellow emphasis fits your message.', 'Check whether the darker styling suits your content.'],
    sections: [
      { title: 'Video templates and cover templates do different jobs', body: 'Choose each for the part of the video it affects.', items: [['Video templates', 'Preview the captions, text layout, and packaging during playback. Cards with a play action have a demo clip.'], ['Cover templates', 'Browse static title and cover layouts. These are selected separately from the video’s caption styling.']] },
      { title: 'Where to find the catalog', body: 'The workspace button above opens Templates directly. When signed in, the account menu also has a Templates entry. Screenshots use the Simplified Chinese interface.', image: 'video-templates.png', caption: 'Actual template page with video and cover tabs. Catalog entries change over time.', items: [] },
      { title: 'Preview video templates before choosing', body: 'Start with two or three suitable styles. The players below show actual template demos.', demos: true, items: [['Can you read the captions?', 'Check size and emphasis. With a longer script, look at line breaks and whether text covers the presenter.'], ['Does the layout fit?', 'Check the space around the person, colors, borders, and pacing against your intended presentation.'], ['Browse more styles', 'Scroll through the catalog and use Load more when available. Playable template demos run inside the original card.']] },
      { title: 'For covers, look at the title and free space', body: 'Switch to Cover templates. Think about where your own title and subject would go, then review color and decoration.', image: 'cover-templates.png', caption: 'Actual cover catalog showing static layouts and their listed ratios.', items: [['Keep the title focused', 'Make the topic easy to understand. A different template may not solve an overly long title.'], ['Leave the subject visible', 'Check that text will not cover a face or important product details.'], ['Read the listed ratio', 'Use the ratio shown on the card. This screenshot includes 3:4 covers; that is separate from 9:16 and 16:9 video layouts.']] },
      { title: 'Choose portrait or landscape first', body: 'The production video-template picker separates 9:16 and 16:9 and opens on 9:16. Switch to 16:9 for landscape content.', items: [['9:16 portrait', 'Check that the face, captions, and title fit the narrower frame.'], ['16:9 landscape', 'Use the wider layout, then review text and subject placement.'], ['Match the production mode', 'Presenter videos, mixed-media videos, and video packaging can offer different template sets. Check the relevant production page.']] },
      { title: 'Use the style in your own production', body: 'The catalog is for browsing and previewing. Remember the style name, then select it on the appropriate video creation page.', items: [['Select during production', 'Open the video packaging or template selector for the current mode and aspect ratio. Select a cover template separately if needed.'], ['Try your own content first', 'Make a first version and check caption wrapping, presenter placement, and the cover title.'], ['Keep a consistent series', 'Reuse a suitable style across related videos. Selecting a template alone does not generate or publish a video.']] },
    ],
  },
};
export const getTemplateGuide = (locale) => guides[locale] || null;
