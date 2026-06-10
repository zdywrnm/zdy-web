// 站点文案字典 + i18n 辅助函数。中文为默认语言，英文镜像在 /en/ 下。
// 组件里直接 `const t = ui[lang]` 取结构化文案，避免扁平 key 查找的麻烦。

export const languages = { zh: '中文', en: 'English' } as const;
export const defaultLang = 'zh';
export type Lang = keyof typeof languages;

/** 从 URL 推断当前语言：/en/... → en，其余 → zh。 */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return seg === 'en' ? 'en' : 'zh';
}

/** 给一条「语言无关」的相对路径加上语言前缀（zh 无前缀，en 加 /en）。 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return clean === '/' ? '/en/' : `/en${clean}`;
  return clean;
}

/** 把当前 pathname 转换到目标语言对应的 pathname（语言切换器用）。 */
export function toLangPath(pathname: string, target: Lang): string {
  let rest = pathname.replace(/^\/en(?=\/|$)/, '');
  if (rest === '') rest = '/';
  return localizePath(rest, target);
}

export const ui = {
  zh: {
    common: { backToTop: '回到顶部', scrollHint: 'SCROLL' },
    nav: { work: '作品', experience: '经历', about: '关于', themeToggle: '切换主题', langSwitch: 'EN' },
    hero: {
      title: '赵鼎熠 / yrjm',
      display: '赵鼎熠',
      kicker: 'PORTFOLIO — 2026 · NINGBO',
      subtitle: '国际经济与贸易在读，用 AI 工具链做全栈产品，也关注跨境电商与市场营销。',
      seeWork: '看作品',
      seeExperience: '看经历',
      downloadResume: '下载简历',
      next: 'full-stack / commerce — b.2006 — Ningbo',
    },
    home: {
      positioningTitle: '定位',
      positioningCopy: '求职方向：全栈开发、市场营销。目标城市：北京、上海、深圳、杭州、宁波。',
      fullProfile: '完整资料',
      rules: {
        focus: ['01 / 定位', 'FOCUS'],
        work: ['02 / 作品', 'WORK'],
        proof: ['03 / 数字', 'PROOF'],
        path: ['04 / 经历', 'PATH'],
        contact: ['05 / 联系', 'CONTACT'],
      },
      stats: [
        { value: '05', label: '端产品独立交付', tag: 'PLATFORMS' },
        { value: '50%', label: '招聘周期缩短', tag: 'FASTER HIRING' },
        { value: '03', label: '在研项目', tag: 'IN FLIGHT' },
        { value: '2029', label: '预计毕业', tag: 'GRADUATION' },
      ],
      contactCta: '和我聊聊',
      capabilities: [
        { title: 'AI 全栈交付', copy: '熟练用 Claude Code、Codex、Cursor 等 AI 工具完成需求拆解、编码调试到部署上线的完整闭环。' },
        { title: '商业场景理解', copy: '国际经济与贸易专业在读，关注跨境电商、市场营销和产品增长，能把工程能力落到真实业务问题上。' },
        { title: '多端产品推进', copy: '主导 PaperBanana 多端产品开发，覆盖 Web、桌面端、移动端和微信小程序。' },
      ],
      worksTitle: '作品',
      worksCopy: '代表项目来自简历里的真实交付：PaperBanana、万里国贸之家等。',
      allWorks: '全部作品',
      experienceTitle: '经历',
      experienceCopy: '简历里的经历重点不是堆岗位，而是持续把 AI 工具、开发能力和业务理解组合起来。',
      moreExperience: '更多经历',
      experiences: [
        { title: '北京安尘科技有限公司', meta: 'AI 赋能招聘专员 / 2025.07 - 2025.09', copy: '创新性使用 ChatGPT、DeepSeek 等工具做人才简历智能对比筛选，并通过流程优化将招聘周期缩短 50%。' },
        { title: '中国科学院大学他山协会', meta: 'AIGC 开发组 / 2026.03 - 至今', copy: '参与组内 AI 工具链建设，推动模型适配、零环境运行工具封装和标准化 Skill 资产沉淀。' },
      ],
      contactTitle: '联系',
      contactCopy: '求职、合作或交流都欢迎。最快的方式是邮箱或领英，简历也可以直接下载。',
      emailLabel: '邮箱',
      linksLabel: 'GitHub / 领英',
      resumeLabel: '简历',
      downloadResumePdf: '下载 PDF 简历',
    },
    about: {
      pageTitle: '关于赵鼎熠',
      kicker: 'PROFILE — 关于',
      rules: {
        summary: ['01 / 个人总结', 'SUMMARY'],
        path: ['02 / 经历', 'PATH'],
        stack: ['03 / 技能', 'STACK'],
        now: ['04 / 状态', 'NOW'],
      },
      pageCopy: 'yrjm，浙江万里学院国际经济与贸易专业在读，常驻宁波。求职方向是全栈开发和市场营销，目标城市包括北京、上海、深圳、杭州、宁波。',
      summaryTitle: '个人总结',
      summaryCopy: '我的优势是把 AI 工具链、工程实现和商业问题放在同一张图里看。',
      summaryItems: [
        '国际经济与贸易专业在读，兼具 AI 全栈开发能力与真实跨境电商实践经验，能独立把想法做成可以上线的产品。',
        '熟练使用 Claude Code、Codex、Cursor 等 AI 工具完成需求拆解、编码调试、部署上线和 GitHub 版本管理。',
        '主导 PaperBanana 项目开发，独立交付覆盖网站、小程序、Android、Windows、macOS 的五端产品。',
      ],
      experienceTitle: '经历',
      experienceCopy: '从学校、实习、比赛到协会项目，核心线索都是“用 AI 提升交付效率”。',
      experienceItems: [
        { kind: '教育经历', title: '浙江万里学院', role: '国际经济与贸易 / 本科 / 商学院 / 全日制', meta: '2025.09 - 2029.06 / 宁波', detail: '核心课程包括微观经济学、宏观经济学、计算机基础、外贸英语函电、国际贸易实务。' },
        { kind: '实习经历', title: '北京安尘科技有限公司', role: 'AI 赋能招聘专员 / 人力资源部', meta: '2025.07 - 2025.09 / 北京', detail: '面对技术岗位人才紧缺问题，使用 ChatGPT、DeepSeek 等 AI 工具实现需求与简历的智能对比筛选，并优化沟通流程，将招聘周期缩短 50%。' },
        { kind: '社团和组织经历', title: '“挑战杯”中国大学生创业计划大赛', role: '技术开发 / 材料组', meta: '2025.11 - 2025.12 / 宁波', detail: '作为技术开发负责人，主导微信小程序页面设计与核心功能开发，使用 Gemini、Claude Code、Codex 等工具实现数据展示功能，并参与创业计划书撰写与行业资料整理。' },
        { kind: '社团和组织经历', title: '中国科学院大学他山协会', role: 'PaperBanana 项目核心开发者 / AIGC 开发组', meta: '2026.03 - 至今 / 宁波', detail: '参与组内 AI 工具链建设，将国产模型适配任务改造为零环境依赖、可独立运行的工具，并封装为标准化 Skill 资产，推动组内开源协作与进度汇报。' },
      ],
      skillsTitle: '技能',
      skillsCopy: '围绕 AI 编程、部署、自动化和跨境电商运营建立的工具箱。',
      skills: ['Claude Code', 'Codex', 'Cursor', 'GitHub Actions', 'Sealos', 'Better Auth', 'Laf', 'TikTok Shop', '跨境电商运营', 'AI 产品'],
      nowTitle: '正在做',
      now: 'PaperBanana、万里国贸之家、他山协会 AIGC 工具链、跨境电商实践。',
      interestTitle: '兴趣',
      interest: 'AI 工具、男士穿搭、投资、历史与航天。',
      contactTitle: '联系方式',
      resumeLink: '下载 PDF 简历',
    },
    projects: {
      title: '作品',
      kicker: 'INDEX — 全部作品',
      copy: '这里收录我从简历中提炼出来的真实项目：AI 学术配图产品、专业学习平台，以及后续会继续补充的工具链实践。',
    },
    project: {
      learnMore: '了解更多',
      nextProject: '下一个项目',
      techStackSuffix: '技术栈',
      coverAltSuffix: '产品界面截图',
      labelProject: '项目',
      labelRole: '角色',
      labelPeriod: '周期',
      labelStatus: '状态',
      labelLocation: '地点',
      labelOnline: '线上',
      labelCode: '代码',
      visitSite: '访问网站',
      github: 'GitHub',
      statusDefault: '进行中',
    },
    notFound: { title: '404', copy: '这个页面不存在，回到首页继续看作品。', backHome: '回到首页' },
    meta: {
      home: { title: '赵鼎熠 / yrjm', desc: '赵鼎熠（yrjm）的个人网站，展示 PaperBanana 等正在做的产品与个人介绍。' },
      about: { title: '关于', desc: '赵鼎熠（yrjm）的个人介绍、教育经历、实习经历、项目经历、组织经历与联系方式。' },
      projects: { title: '作品', desc: '赵鼎熠（yrjm）的作品项目，包括 PaperBanana 和万里国贸之家。' },
      notFound: { title: '404', desc: '页面不存在。' },
    },
  },
  en: {
    common: { backToTop: 'Back to top', scrollHint: 'SCROLL' },
    nav: { work: 'Work', experience: 'Experience', about: 'About', themeToggle: 'Toggle theme', langSwitch: '中' },
    hero: {
      title: '赵鼎熠 / yrjm',
      display: 'ZHAO DINGYI',
      kicker: 'PORTFOLIO — 2026 · NINGBO',
      subtitle: 'An International Economics & Trade student building full-stack products with an AI tool-chain — also into cross-border e-commerce and marketing.',
      seeWork: 'View work',
      seeExperience: 'View experience',
      downloadResume: 'Download CV',
      next: 'full-stack / commerce — b.2006 — Ningbo',
    },
    home: {
      positioningTitle: 'Positioning',
      positioningCopy: 'Target roles: full-stack development and marketing. Target cities: Beijing, Shanghai, Shenzhen, Hangzhou, Ningbo.',
      fullProfile: 'Full profile',
      rules: {
        focus: ['01 / Focus', '定位'],
        work: ['02 / Work', '作品'],
        proof: ['03 / Proof', '数字'],
        path: ['04 / Path', '经历'],
        contact: ['05 / Contact', '联系'],
      },
      stats: [
        { value: '05', label: 'platforms shipped solo', tag: 'PLATFORMS' },
        { value: '50%', label: 'shorter hiring cycle', tag: 'FASTER HIRING' },
        { value: '03', label: 'projects in flight', tag: 'IN FLIGHT' },
        { value: '2029', label: 'expected graduation', tag: 'GRADUATION' },
      ],
      contactCta: "LET'S TALK",
      capabilities: [
        { title: 'AI full-stack delivery', copy: 'Fluent with Claude Code, Codex and Cursor to run the full loop — from breaking down requirements to coding, debugging, deploying and shipping.' },
        { title: 'Business sense', copy: 'An International Economics & Trade student focused on cross-border e-commerce, marketing and product growth, grounding engineering in real business problems.' },
        { title: 'Multi-platform shipping', copy: 'Led PaperBanana across Web, desktop, mobile and the WeChat mini-program.' },
      ],
      worksTitle: 'Work',
      worksCopy: 'Selected projects — all real deliverables: PaperBanana, the Wanli Trade Home site and more.',
      allWorks: 'All work',
      experienceTitle: 'Experience',
      experienceCopy: 'The thread isn’t a pile of titles — it’s combining AI tools, engineering and business sense to ship faster.',
      moreExperience: 'More experience',
      experiences: [
        { title: 'Beijing Anchen Technology', meta: 'AI-Enabled Recruiter / 2025.07 - 2025.09', copy: 'Used ChatGPT and DeepSeek to match job requirements against résumés and streamlined the process, cutting the hiring cycle by 50%.' },
        { title: 'UCAS Tashan Association', meta: 'AIGC Dev Group / 2026.03 - present', copy: 'Contributed to the group’s AI tool-chain: model adaptation, zero-setup tool packaging and reusable standardized Skills.' },
      ],
      contactTitle: 'Contact',
      contactCopy: 'Open to roles, collaboration or just a chat. Email or LinkedIn is fastest; the CV is one click away.',
      emailLabel: 'Email',
      linksLabel: 'GitHub / LinkedIn',
      resumeLabel: 'Résumé',
      downloadResumePdf: 'Download PDF résumé',
    },
    about: {
      pageTitle: 'About Zhao Dingyi',
      kicker: 'PROFILE — ABOUT',
      rules: {
        summary: ['01 / Summary', '总结'],
        path: ['02 / Path', '经历'],
        stack: ['03 / Stack', '技能'],
        now: ['04 / Now', '状态'],
      },
      pageCopy: 'yrjm — an International Economics & Trade student at Zhejiang Wanli University, based in Ningbo. Looking for full-stack development and marketing roles in Beijing, Shanghai, Shenzhen, Hangzhou or Ningbo.',
      summaryTitle: 'Summary',
      summaryCopy: 'My edge: seeing the AI tool-chain, engineering and business problems on one canvas.',
      summaryItems: [
        'An International Economics & Trade student with AI full-stack skills and hands-on cross-border e-commerce experience — able to take an idea to a shippable product solo.',
        'Fluent with Claude Code, Codex and Cursor for requirement breakdown, coding, debugging, deployment and GitHub version control.',
        'Led PaperBanana, delivering a five-platform product across web, mini-program, Android, Windows and macOS — solo.',
      ],
      experienceTitle: 'Experience',
      experienceCopy: 'From school and internship to competitions and association projects, the through-line is “using AI to ship faster.”',
      experienceItems: [
        { kind: 'Education', title: 'Zhejiang Wanli University', role: 'International Economics & Trade / Bachelor / Business School / Full-time', meta: '2025.09 - 2029.06 / Ningbo', detail: 'Core courses: microeconomics, macroeconomics, computing fundamentals, business English correspondence and international trade practice.' },
        { kind: 'Internship', title: 'Beijing Anchen Technology', role: 'AI-Enabled Recruiter / HR Dept.', meta: '2025.07 - 2025.09 / Beijing', detail: 'Facing a shortage of technical talent, used ChatGPT and DeepSeek to match requirements against résumés and streamlined communication, cutting the hiring cycle by 50%.' },
        { kind: 'Clubs & Organizations', title: '“Challenge Cup” National Entrepreneurship Plan Competition', role: 'Tech Development / Materials Team', meta: '2025.11 - 2025.12 / Ningbo', detail: 'As tech lead, drove the WeChat mini-program’s page design and core features, building data-display functionality with Gemini, Claude Code and Codex, and helped write the business plan and gather industry research.' },
        { kind: 'Clubs & Organizations', title: 'UCAS Tashan Association', role: 'PaperBanana Core Developer / AIGC Dev Group', meta: '2026.03 - present / Ningbo', detail: 'Contributed to the group’s AI tool-chain, turning domestic-model adaptation into a zero-setup standalone tool, packaging it as a reusable standardized Skill, and driving open-source collaboration and progress reporting.' },
      ],
      skillsTitle: 'Skills',
      skillsCopy: 'A toolbox around AI coding, deployment, automation and cross-border e-commerce.',
      skills: ['Claude Code', 'Codex', 'Cursor', 'GitHub Actions', 'Sealos', 'Better Auth', 'Laf', 'TikTok Shop', 'Cross-border e-commerce', 'AI products'],
      nowTitle: 'Now',
      now: 'PaperBanana, the Wanli Trade Home site, the Tashan AIGC tool-chain, and cross-border e-commerce.',
      interestTitle: 'Interests',
      interest: 'AI tools, menswear, investing, history and spaceflight.',
      contactTitle: 'Contact',
      resumeLink: 'Download PDF résumé',
    },
    projects: {
      title: 'Work',
      kicker: 'INDEX — ALL WORK',
      copy: 'Real projects distilled from my résumé: an AI academic-illustration product, a major-specific learning platform, and more tool-chain work to come.',
    },
    project: {
      learnMore: 'Learn more',
      nextProject: 'NEXT PROJECT',
      techStackSuffix: 'tech stack',
      coverAltSuffix: 'product screenshot',
      labelProject: 'Project',
      labelRole: 'Role',
      labelPeriod: 'Timeline',
      labelStatus: 'Status',
      labelLocation: 'Location',
      labelOnline: 'Live',
      labelCode: 'Code',
      visitSite: 'Visit site',
      github: 'GitHub',
      statusDefault: 'In progress',
    },
    notFound: { title: '404', copy: 'This page doesn’t exist — head back home to keep browsing.', backHome: 'Back home' },
    meta: {
      home: { title: '赵鼎熠 / yrjm', desc: 'Zhao Dingyi (yrjm)’s personal site — products like PaperBanana and a short intro.' },
      about: { title: 'About', desc: 'Zhao Dingyi (yrjm): intro, education, internship, projects, organizations and contact.' },
      projects: { title: 'Work', desc: 'Zhao Dingyi (yrjm)’s projects, including PaperBanana and the Wanli Trade Home site.' },
      notFound: { title: '404', desc: 'Page not found.' },
    },
  },
} as const;
