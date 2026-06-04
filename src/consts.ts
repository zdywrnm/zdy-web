// 站点级常量：跨页面复用的链接与资源路径（与语言无关）。
export const SITE_URL = 'https://zhaodingyi.com';

// 简历 PDF（放在 public/ 下，ASCII 文件名避免 URL 编码问题）。
export const RESUME_PATH = '/resume-zhaodingyi.pdf';

// 社交 / 联系方式。
export const SOCIAL = {
  github: 'https://github.com/zdywrnm',
  linkedin: 'https://www.linkedin.com/in/鼎熠-赵-070b033a2',
  email: 'yrjmdqmmx@gmail.com',
} as const;
