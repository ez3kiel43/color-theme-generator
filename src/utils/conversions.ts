import { Rgb } from './models';

export function hexToRgb(hex: string): Rgb {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return { r, g, b };
}

export function rgbToHex(rgb: Rgb): string {
	const toHex = (value: number) => {
		const hex = value.toString(16); // convert to hex
		return hex.length === 1 ? '0' + hex : hex; // pad single digits
	};

	return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function rgbToHsl(color: Rgb): { h: number; s: number; l: number } {
	// Normalize RGB values to [0, 1]
	color.r /= 255;
	color.g /= 255;
	color.b /= 255;

	const max = Math.max(color.r, color.g, color.b);
	const min = Math.min(color.r, color.g, color.b);
	const delta = max - min;

	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (delta !== 0) {
		s = delta / (1 - Math.abs(2 * l - 1));

		switch (max) {
			case color.r:
				h = ((color.g - color.b) / delta) % 6;
				break;
			case color.g:
				h = (color.b - color.r) / delta + 2;
				break;
			case color.b:
				h = (color.r - color.g) / delta + 4;
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
