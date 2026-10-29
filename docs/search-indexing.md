# 全语言与工作台收录

2026-10-29，用户将收录范围扩大到全部 24 种界面语言、公开官网页面和工作台。此决定取代此前仅英文进入索引、工作台保持 noindex 的规则。

官网沿用各语言独立 URL。工作台各语言首页与功能页使用 `/app/{locale}/`、`/app/{locale}/{page}/`；原 `/app/` 与 `?page=` 链接继续兼容。热点仍只提供简体和繁体中文入口。每个工作台入口有静态说明、导航、语言声明、canonical、hreflang 和结构化数据；相同说明对访客和爬虫可见，不使用爬虫专属内容。

工作台索引公开入口，不改变登录、数据请求和团队权限。账号信息、订单、素材与生成记录不会写入静态页面或站点地图。搜索抓取权限不能替代接口鉴权。

网站根路径继续按地区和用户语言选择重定向。`/app/` 兼容入口的 canonical 指向 `/app/en/`；站点地图列出各独立语言和功能的正式地址，不重复提交重定向和兼容地址。索引语言不再受旧的 `SEO_INDEXABLE_LOCALES=en` 设置限制。

## Cloudflare

2026-10-29 已关闭域名 AI Crawl Control → Signals → Enable Bot Preference Sync。此前它向最终 robots.txt 注入了 Baiduspider、KimiBot 等 `Disallow: /`，而项目源文件本身允许抓取。修改项目的 robots.txt 不能证明 Cloudflare 的最终响应正确；每周线上检查会单独校验 Googlebot、bingbot、Baiduspider、OAI-SearchBot 和 KimiBot。

相关说明：[Cloudflare robots.txt 设置](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)。

## 验证与提交

`npm run verify` 检查多语言边界、入口导航、旧链接兼容、构建结果与全部 sitemap 地址。`npm run seo:audit` 检查线上可抓取性、状态码、同语言内元信息唯一性、结构化数据及内链；不同语言允许使用相同的产品名或技术术语。

Google Search Console 已使用 `https://www.kaliai.fun/` 的 `/sitemap.xml`，地图地址不变。Bing 等支持方可通过 `node scripts/submit-indexnow.mjs` 提交当前线上地图。百度需在已验证站点中提交同一个地图；若站点尚未验证，必须取得平台实际提供的验证标记或文件，不生成假标记。提交只代表发现请求，不代表已经收录。

此次扩大索引并不代表全部内容完成母语审校。三个方案页已补各语言的独立标题与描述；此前没有翻译的正文段落仍需后续逐语种补齐。Google 也建议让索引页面直接提供可读取正文：[JavaScript SEO 基础](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)。
