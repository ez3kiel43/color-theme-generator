import { Rgb, Hsl } from './utils/models';

export class Color {
	constructor(public r: number, public g: number, public b: number) {}

	/** Convert to HEX string */
	rgbToHex(): string {
		const toHex = (value: number) => {
			const num = Math.max(0, Math.min(255, Math.round(value))); // clamp
			const hex = num.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};
		return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
	}

	/** Convert RGB to HSL */
	rgbToHsl(): Hsl {
		const r = this.r / 255;
		const g = this.g / 255;
		const b = this.b / 255;

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
			s: +(s * 100).toFixed(1),
			l: +(l * 100).toFixed(1),
		};
	}

	/** Convert HSL to RGB (static) */
	static hslToRgb({ h, s, l }: Hsl): Color {
		s /= 100;
		l /= 100;

		const c = (1 - Math.abs(2 * l - 1)) * s;
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

		return new Color(
			Math.round((r1 + m) * 255),
			Math.round((g1 + m) * 255),
			Math.round((b1 + m) * 255)
		);
	}

	/** Return a new color with adjusted lightness */
	adjustLuminance(increase: boolean, factor: number): Color {
		const hsl = this.rgbToHsl();
		const newL = Math.max(
			0,
			Math.min(
				100,
				increase
					? hsl.l + factor * Math.min(20, 100 - hsl.l) // only move up to 20 units
					: hsl.l - factor * Math.min(20, hsl.l) // only move down to 20 units
			)
		);
		return Color.hslToRgb({ h: hsl.h, s: hsl.s, l: newL });
	}

	/** Return a new color with adjusted saturation */
	adjustSaturation(amt: number): Color {
		const hsl = this.rgbToHsl();
		const newS = Math.max(0, Math.min(100, hsl.s - amt));
		return Color.hslToRgb({ h: hsl.h, s: newS, l: hsl.l });
	}
}
