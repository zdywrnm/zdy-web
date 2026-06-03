import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { localizePath } from '../i18n/ui';

export type Project = CollectionEntry<'projects'>;

// 项目内容放在 src/content/projects/{zh,en}/*.md，id 形如 "zh/paperbanana"。
// 从 id 前缀推语言，并还原出语言无关的 slug。
export function projectLang(p: Project): Lang {
  return p.id.startsWith('en/') ? 'en' : 'zh';
}

export function projectSlug(p: Project): string {
  return p.id.replace(/^(zh|en)\//, '');
}

/** 项目详情页的本地化 URL（zh 无前缀，en 加 /en）。 */
export function projectHref(p: Project): string {
  return localizePath(`/projects/${projectSlug(p)}/`, projectLang(p));
}

/** 按语言取项目，按 order 升序。 */
export async function getProjectsByLang(lang: Lang): Promise<Project[]> {
  const all = await getCollection('projects');
  return all
    .filter((p) => projectLang(p) === lang)
    .sort((a, b) => a.data.order - b.data.order);
}
