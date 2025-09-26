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

// Type is "Success" | "Warning" | "Error" | ...
export type ColorRole = (typeof colorRoles)[number];

export function hexToRgb(hex: string): [number, number, number] {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return [r, g, b];
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
