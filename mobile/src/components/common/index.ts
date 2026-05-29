/**
 * components/common/index.ts — Barrel export UI Components Kinclong
 *
 * Import semua komponen UI dari satu lokasi:
 *   import { Button, Card, Input, Badge, TextHeading, Loading } from '@components/common';
 */

// Primitive components
export { Button }       from './Button';
export { Card }         from './Card';
export { Input }        from './Input';
export { Loading }      from './Loading';

// Typography
export { TextHeading }  from './TextHeading';

// Feedback / Status
export { Badge }        from './Badge';

// Type exports
export type { ButtonProps, ButtonVariant, ButtonSize }         from './Button';
export type { CardProps, CardVariant, CardPadding }            from './Card';
export type { InputProps }                                      from './Input';
export type { TextHeadingProps, HeadingLevel, HeadingColor }  from './TextHeading';
export type { BadgeProps, BadgeVariant, BadgeSize }            from './Badge';
