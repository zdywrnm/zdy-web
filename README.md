# zdy-web

赵鼎熠（yrjm）的个人网站，部署到 `zhaodingyi.com`。技术栈是 Astro 6、React islands、React Three Fiber、Tailwind CSS v4 和 GitHub Pages。

当前范围只包含首页、作品页、PaperBanana 项目详情、关于页和 404。没有博客、RSS、评论、搜索和分析工具。

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

项目内容放在 `src/content/projects/`。新增项目时复制 `paperbanana.md`，保留这些 frontmatter 字段：

```yaml
title: Project Name
description: 一句话描述
order: 2
tech:
  - Astro
repo: https://github.com/example/repo
featured: false
```

目前首页只取 `featured: true` 的项目展示；如果后续要展示多个项目，可以继续增加 markdown 文件。

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
