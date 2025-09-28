import { Color, Rgb } from './models';
import { getContrast } from './contrast';
import { rgbToHsl, hslToRgb, rgbToHex } from './conversions';

export function luminance(color: Rgb): number {
	const a = [color.r, color.g, color.b].map(v => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function adjustLuminance(color: Color, increase: boolean): Color {
	let converted = rgbToHsl({ ...color.rgb });
	let newRGB = hslToRgb(
		converted.h,
		converted.s,
		increase ? converted.l + 10 : converted.l - 10
	);
	color.hex = rgbToHex(newRGB);
	color.rgb = newRGB;

	return color;
}

export function adjustSaturation(color: Color, full: boolean): Color {
	let converted = rgbToHsl({ ...color.rgb });
	let newRGB = hslToRgb(
		converted.h,
		converted.l,
		full ? converted.s - 10 : converted.s - 5
	);
	color.hex = rgbToHex(newRGB);
	color.rgb = newRGB;

	return color;
}
