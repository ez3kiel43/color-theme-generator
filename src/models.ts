export interface Color {
	label: ColorRole;
	hex: string;
	rgb: [number, number, number];
}

export const colorRoles = [
	'Background',
	// 'Accent',
	'Text',
	'Info',
	'Success',
	'Warning',
	'Error',
	'Neutral',
] as const;

export const defaultPaletteHex = [
	'#333333',
	'#ffffff',
	'#0099FF',
	'#33CC66',
	'#ffae00',
	'#FF3333',
	'#808099',
];

// Type is "Success" | "Warning" | "Error" | ...
export type ColorRole = (typeof colorRoles)[number];

export function hexToRgb(hex: string): [number, number, number] {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return [r, g, b];
}

export function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (value: number) => {
		const hex = value.toString(16); // convert to hex
		return hex.length === 1 ? '0' + hex : hex; // pad single digits
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(
	r: number,
	g: number,
	b: number
): { h: number; s: number; l: number } {
	// Normalize RGB values to [0, 1]
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (delta !== 0) {
		s = delta / (1 - Math.abs(2 * l - 1));

		switch (max) {
			case r:
				h = ((g - b) / delta) % 6;
				break;
			case g:
				h = (b - r) / delta + 2;
				break;
			case b:
				h = (r - g) / delta + 4;
				break;
		}

		h = Math.round(h * 60);
		if (h < 0) h += 360;
	}

	return {
		h,
		s: +(s * 100).toFixed(1), // percentage
		l: +(l * 100).toFixed(1), // percentage
	};
}

export function hslToRgb(
	h: number,
	s: number,
	l: number
): { r: number; g: number; b: number } {
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s; // Chroma
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r1 = 0,
		g1 = 0,
		b1 = 0;

	if (h >= 0 && h < 60) [r1, g1, b1] = [c, x, 0];
	else if (h >= 60 && h < 120) [r1, g1, b1] = [x, c, 0];
	else if (h >= 120 && h < 180) [r1, g1, b1] = [0, c, x];
	else if (h >= 180 && h < 240) [r1, g1, b1] = [0, x, c];
	else if (h >= 240 && h < 300) [r1, g1, b1] = [x, 0, c];
	else if (h >= 300 && h < 360) [r1, g1, b1] = [c, 0, x];

	return {
		r: Math.round((r1 + m) * 255),
		g: Math.round((g1 + m) * 255),
		b: Math.round((b1 + m) * 255),
	};
}

export function luminance([r, g, b]: [number, number, number]): number {
	const a = [r, g, b].map(v => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function contrast(c1: Color, c2: Color): number {
	const l1 = luminance(c1.rgb);
	const l2 = luminance(c2.rgb);
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
