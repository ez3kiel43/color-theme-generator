export interface Color {
	label: ColorRole;
	hex: string;
	rgb: Rgb;
}
export interface Rgb {
	r: number;
	g: number;
	b: number;
}

export const colorRoles = [
	'Base',
	// 'Accent',
	'BkgLight',
	'BkgDark',
	'Text',
	'Icon',
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
