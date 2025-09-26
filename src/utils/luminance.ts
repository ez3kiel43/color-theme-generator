import { Rgb } from './models';

export function luminance(color: Rgb): number {
	const a = [color.r, color.g, color.b].map(v => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
