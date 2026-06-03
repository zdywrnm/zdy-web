---
title: PaperBanana
description: AI 驱动的学术插图生成工具
order: 1
tech:
  - React
  - TypeScript
  - Electron
  - Better Auth
  - Laf
  - Sealos
  - pnpm monorepo
repo: https://github.com/zdywrnm/PaperBanana-clients
demo: https://paperbanana.asia
role: 项目核心开发者
period: 2026.03 - 至今
location: 宁波
status: 进行中
nodes:
  - web
  - desktop
  - mobile
  - api
featured: true
---

PaperBanana 是一个面向学术场景的 AI 插图生成工具，目标是让论文、报告和课程展示里的图示更快进入可用状态。

我在项目中负责核心开发，使用 Codex 主力实现、Claude 辅助架构决策，把一个科研配图方向的产品想法拆成可以交付的多端系统。

## 交付范围

- 从单一代码库交付 Web、macOS、Windows、Android、微信小程序五端产品。
- 用 pnpm workspaces 组织 monorepo，通过共享包复用接口调用、类型约束和产品逻辑。
- 将上游 Python 原型改写为零依赖 TypeScript CLI，并发布到 npm，把“配置 Python 环境 + 多步安装”压缩为一行命令。
- 在 Sealos 上部署 Better Auth 登录网关和 Laf 云函数，实现跨端账号、任务与生成记录同步。

## 当前进展

生产站点 `paperbanana.asia` 已上线。下一步重点是补充真实科研场景的模板、完善生成结果编辑流程，并沉淀从模型适配到多端发布的技术复盘。
