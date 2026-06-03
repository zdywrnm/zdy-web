# zdy-web

赵鼎熠（yrjm）的个人网站，部署到 `zhaodingyi.com`。技术栈是 Astro 6、React islands、React Three Fiber、Tailwind CSS v4 和 GitHub Pages。

当前范围包含首页、作品页、项目详情页、关于页和 404，支持中/英双语切换（中文在 `/`，英文在 `/en/`），并提供简历 PDF 下载、sitemap 与 JSON-LD 结构化数据。没有博客、RSS、评论、搜索和分析工具。

## 双语与文案

- 界面文案集中在 `src/i18n/ui.ts`（`zh` / `en` 两套），辅助函数 `getLangFromUrl`、`localizePath`、`toLangPath` 也在这里。
- 页面正文抽成 `src/components/pages/*.astro`（接受 `lang` prop），中文路由在 `src/pages/`、英文镜像在 `src/pages/en/`，路由文件只负责传 `lang`。
- 站点级链接（GitHub / 领英 / 邮箱 / 简历路径）集中在 `src/consts.ts`。简历 PDF 放在 `public/resume-zhaodingyi.pdf`。

## 本地开发

```sh
pnpm install
pnpm dev
```

常用命令：

```sh
pnpm build
pnpm preview
```

## 内容维护

项目内容按语言放在 `src/content/projects/zh/` 和 `src/content/projects/en/`，**同一项目两种语言用同名文件**（如 `zh/paperbanana.md` 与 `en/paperbanana.md`），slug 由文件名决定。新增项目时复制一对文件，保留这些 frontmatter 字段：

```yaml
title: Project Name
description: 一句话描述
order: 2
tech:
  - Astro
repo: https://github.com/example/repo
demo: https://example.com
cover: /projects/example.png   # 可选：真实截图放在 public/projects/
role: 独立开发者
period: 2026.01 - 至今
location: 宁波
status: 进行中
nodes:
  - web
  - api
featured: false
```

语言由所在文件夹（`zh/` 或 `en/`）决定，见 `src/lib/projects.ts`。项目卡有 `cover` 时显示真实截图，否则回退到抽象示意图。首页重点展示 `featured: true` 的项目并把其他作为补充列表，作品页展示全部。

## GitHub Pages 部署

仓库 Settings → Pages → Build and deployment → Source 选择 `GitHub Actions`。

`.github/workflows/deploy.yml` 会在 push 到 `main` 时运行：

1. `withastro/action@v6` 安装依赖并执行 Astro build。
2. `actions/deploy-pages@v4` 发布到 GitHub Pages。

`public/CNAME` 已写入：

```txt
zhaodingyi.com
```

`astro.config.mjs` 已设置：

```js
site: 'https://zhaodingyi.com'
```

自定义 apex 域名不需要设置 `base`。

## 阿里云 DNS

在阿里云域名解析里为 `zhaodingyi.com` 添加 GitHub Pages 官方记录：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| @ | A | 185.199.108.153 |
| @ | A | 185.199.109.153 |
| @ | A | 185.199.110.153 |
| @ | A | 185.199.111.153 |
| www | CNAME | zdywrnm.github.io |

配置后回到 GitHub 仓库 Settings → Pages，Custom domain 填 `zhaodingyi.com`，等待 DNS 检查通过后开启 Enforce HTTPS。

参考：

- [Astro GitHub Pages deploy guide](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
