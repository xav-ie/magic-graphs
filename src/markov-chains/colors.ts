
/**
 * alias used for all types that represent a color value
 */
export type Color = string;

/**
 * tailwinds 500 level color palette
 */
export const TAILWIND_500_COLORS = {
  RED: '#EF4444',
  ORANGE: '#F97316',
  AMBER: '#F59E0B',
  YELLOW: '#EAB308',
  LIME: '#84CC16',
  GREEN: '#22C55E',
  EMERALD: '#10B981',
  TEAL: '#14B8A6',
  CYAN: '#06B6D4',
  SKY: '#0EA5E9',
  BLUE: '#3B82F6',
  INDIGO: '#6366F1',
  VIOLET: '#8B5CF6',
  PURPLE: '#A855F7',
  FUCHSIA: '#D946EF',
  PINK: '#EC4899',
  ROSE: '#F43F5E',
  STONE: '#9CA3AF',
  NEUTRAL: '#6B7280',
  ZINC: '#4B5563',
  GRAY: '#374151',
  SLATE: '#1F2937',
} as const;

/**
 * color used to represent transient states
 * pulled from the tailwind color palette
 */
export const TRANSIENT_COLOR = '#030712'

/**
 * all tailwind gray colors
 */
export const GRAY_50 = '#f9fafb';
export const GRAY_100 = '#f3f4f6';
export const GRAY_200 = '#e5e7eb';
export const GRAY_300 = '#d1d5db';
export const GRAY_400 = '#9ca3af';
export const GRAY_500 = '#6b7280';
export const GRAY_600 = '#4b5563';
export const GRAY_700 = '#374151';
export const GRAY_800 = '#1f2937';
export const GRAY_900 = '#111827';

/**
 * all tailwind red colors
 */
export const RED_50 = '#fef2f2';
export const RED_100 = '#fee2e2';
export const RED_200 = '#fecaca';
export const RED_300 = '#fca5a5';
export const RED_400 = '#f87171';
export const RED_500 = '#ef4444';
export const RED_600 = '#dc2626';
export const RED_700 = '#b91c1c';
export const RED_800 = '#991b1b';
export const RED_900 = '#7f1d1d';

/**
 * all tailwind orange colors
 */
export const ORANGE_50 = '#fff7ed';
export const ORANGE_100 = '#ffedd5';
export const ORANGE_200 = '#fed7aa';
export const ORANGE_300 = '#fdba74';
export const ORANGE_400 = '#fb923c';
export const ORANGE_500 = '#f97316';
export const ORANGE_600 = '#ea580c';
export const ORANGE_700 = '#c2410c';
export const ORANGE_800 = '#9a3412';
export const ORANGE_900 = '#7c2d12';

/**
 * all tailwind amber colors
 */
export const AMBER_50 = '#fffbeb';
export const AMBER_100 = '#fef3c7';
export const AMBER_200 = '#fde68a';
export const AMBER_300 = '#fcd34d';
export const AMBER_400 = '#fbbf24';
export const AMBER_500 = '#f59e0b';
export const AMBER_600 = '#d97706';
export const AMBER_700 = '#b45309';
export const AMBER_800 = '#92400e';
export const AMBER_900 = '#78350f';

/**
 * all tailwind yellow colors
 */
export const YELLOW_50 = '#fefce8';
export const YELLOW_100 = '#fef9c3';
export const YELLOW_200 = '#fef08a';
export const YELLOW_300 = '#fde047';
export const YELLOW_400 = '#facc15';
export const YELLOW_500 = '#eab308';
export const YELLOW_600 = '#ca8a04';
export const YELLOW_700 = '#a16207';
export const YELLOW_800 = '#854d0e';
export const YELLOW_900 = '#713f12';

/**
 * all tailwind lime colors
 */
export const LIME_50 = '#f7fee7';
export const LIME_100 = '#ecfccb';
export const LIME_200 = '#d9f99d';
export const LIME_300 = '#bef264';
export const LIME_400 = '#a3e635';
export const LIME_500 = '#84cc16';
export const LIME_600 = '#65a30d';
export const LIME_700 = '#4d7c0f';
export const LIME_800 = '#3f6212';
export const LIME_900 = '#365314';

/**
 * all tailwind green colors
 */
export const GREEN_50 = '#f0fdf4';
export const GREEN_100 = '#dcfce7';
export const GREEN_200 = '#bbf7d0';
export const GREEN_300 = '#86efac';
export const GREEN_400 = '#4ade80';
export const GREEN_500 = '#22c55e';
export const GREEN_600 = '#16a34a';
export const GREEN_700 = '#15803d';
export const GREEN_800 = '#166534';
export const GREEN_900 = '#14532d';

/**
 * all tailwind emerald colors
 */
export const EMERALD_50 = '#ecfdf5';
export const EMERALD_100 = '#d1fae5';
export const EMERALD_200 = '#a7f3d0';
export const EMERALD_300 = '#6ee7b7';
export const EMERALD_400 = '#34d399';
export const EMERALD_500 = '#10b981';
export const EMERALD_600 = '#059669';
export const EMERALD_700 = '#047857';
export const EMERALD_800 = '#065f46';
export const EMERALD_900 = '#064e3b';

/**
 * all tailwind teal colors
 */
export const TEAL_50 = '#f0fdfa';
export const TEAL_100 = '#ccfbf1';
export const TEAL_200 = '#99f6e4';
export const TEAL_300 = '#5eead4';
export const TEAL_400 = '#2dd4bf';
export const TEAL_500 = '#14b8a6';
export const TEAL_600 = '#0d9488';
export const TEAL_700 = '#0f766e';
export const TEAL_800 = '#115e59';
export const TEAL_900 = '#134e4a';

/**
 * all tailwind cyan colors
 */
export const CYAN_50 = '#ecfeff';
export const CYAN_100 = '#cffafe';
export const CYAN_200 = '#a5f3fc';
export const CYAN_300 = '#67e8f9';
export const CYAN_400 = '#22d3ee';
export const CYAN_500 = '#06b6d4';
export const CYAN_600 = '#0891b2';
export const CYAN_700 = '#0e7490';
export const CYAN_800 = '#155e75';
export const CYAN_900 = '#164e63';

/**
 * all tailwind sky colors
 */
export const SKY_50 = '#f0f9ff';
export const SKY_100 = '#e0f2fe';
export const SKY_200 = '#bae6fd';
export const SKY_300 = '#7dd3fc';
export const SKY_400 = '#38bdf8';
export const SKY_500 = '#0ea5e9';
export const SKY_600 = '#0284c7';
export const SKY_700 = '#0369a1';
export const SKY_800 = '#075985';
export const SKY_900 = '#0c4a6e';


/**
 * all tailwind blue colors
 */
export const BLUE_50 = '#eff6ff';
export const BLUE_100 = '#dbeafe';
export const BLUE_200 = '#bfdbfe';
export const BLUE_300 = '#93c5fd';
export const BLUE_400 = '#60a5fa';
export const BLUE_500 = '#3b82f6';
export const BLUE_600 = '#2563eb';
export const BLUE_700 = '#1d4ed8';
export const BLUE_800 = '#1e40af';
export const BLUE_900 = '#1e3a8a';

/**
 * all tailwind indigo colors
 */
export const INDIGO_50 = '#eef2ff';
export const INDIGO_100 = '#e0e7ff';
export const INDIGO_200 = '#c7d2fe';
export const INDIGO_300 = '#a5b4fc';
export const INDIGO_400 = '#818cf8';
export const INDIGO_500 = '#6366f1';
export const INDIGO_600 = '#4f46e5';
export const INDIGO_700 = '#4338ca';
export const INDIGO_800 = '#3730a3';
export const INDIGO_900 = '#312e81';

/**
 * all tailwind violet colors,
 */
export const VIOLET_50 = '#f5f3ff';
export const VIOLET_100 = '#ede9fe';
export const VIOLET_200 = '#ddd6fe';
export const VIOLET_300 = '#c4b5fd';
export const VIOLET_400 = '#a78bfa';
export const VIOLET_500 = '#8b5cf6';
export const VIOLET_600 = '#7c3aed';
export const VIOLET_700 = '#6d28d9';
export const VIOLET_800 = '#5b21b6';
export const VIOLET_900 = '#4c1d95';
