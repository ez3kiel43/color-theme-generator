import { Color } from '../Color';

export interface Rgb {
	r: number;
	g: number;
	b: number;
}

export interface Hsl {
	h: number;
	s: number;
	l: number;
}

export function hexToRgb(hex: string): Color {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return new Color(r, g, b);
}

export interface colorScheme {
	[key: string]: Color;
	base: Color;
	background: Color;
	text: Color;
	accent: Color;
}
