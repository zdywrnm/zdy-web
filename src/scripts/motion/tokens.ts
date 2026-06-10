// 动效语言常量：一套签名缓动贯穿全站
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const DESKTOP = `${MOTION_OK} and (pointer: fine) and (min-width: 861px)`;

export const EASE_OUT = 'expo.out';
export const EASE_MICRO = 'power3.out';
export const EASE_ELASTIC = 'elastic.out(1, 0.4)';

export const SCRAMBLE_CHARS = '<>/[]{}01-_';
export const SCRAMBLE_DIGITS = '0123456789%';

export type Cleanup = () => void;
export const noop: Cleanup = () => {};
