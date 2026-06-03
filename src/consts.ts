// 站点级常量：跨页面复用的链接与资源路径（与语言无关）。
export const SITE_URL = 'https://zhaodingyi.com';

// 简历 PDF（放在 public/ 下，ASCII 文件名避免 URL 编码问题）。
export const RESUME_PATH = '/resume-zhaodingyi.pdf';

// 社交 / 联系方式。LinkedIn 的中文 vanity 段做了 percent-encode，避免在部分客户端被破坏。
export const SOCIAL = {
  github: 'https://github.com/zdywrnm',
  linkedin: 'https://www.linkedin.com/in/%E9%BC%8E%E7%87%A0-%E8%B5%B5-070b033a2',
  email: 'yrjmdqmmx@gmail.com',
} as const;
