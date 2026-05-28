---
title: PaperBanana
description: AI 驱动的学术插图生成工具
order: 1
tech:
  - Astro
  - React
  - Electron
  - pnpm monorepo
repo: https://github.com/zdywrnm/PaperBanana-clients
featured: true
---

PaperBanana 是一个面向学术场景的 AI 插图生成工具，目标是让论文、报告和课程展示里的图示更快进入可用状态。

项目用 pnpm workspaces 组织 monorepo，包含 web、desktop（Electron）和 mobile 三端，并通过共享的 `@paperbanana/api` 包复用接口调用与类型约束。后端跑在 Sealos，组合了 auth-gateway、Laf serverless 和 MongoDB；前端部署在 GitHub Pages，域名是 paperbanana.asia。

这一版个人站先把 PaperBanana 作为唯一展示项目，后续可以继续补充产品截图、技术复盘和发布进度。
