import { Color } from './Color';
import { hexPalette } from './utils/models';

export class Palette {
	base: Color;
	colors: {
		base: Color;
		lightBkg: Color[];
		darkBkg: Color[];
		analagous: Color[];
		complimentary: Color[];
		icon: Color;
	};

	constructor(base: Color) {
		this.base = base;
		const bkgs = this.getBkgs(base);
		const compColor = this.getComplimentaryColor(base);
		const compBkgs = this.getBkgs(compColor);
		this.colors = {
			base: this.base,
			lightBkg: bkgs.slice(0, 4),
			darkBkg: bkgs.slice(4),
			analagous: this.getAnalagousColors(base),
			complimentary: [compColor, ...compBkgs],
			icon: base,
		};
	}

	/** Relative luminance for WCAG */
	luminance(color: Color): number {
		const a = [color.r, color.g, color.b].map(v => {
			v /= 255;
			return v <= 0.03928
				? v / 12.92
				: Math.pow((v + 0.055) / 1.055, 2.4);
		});
		return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
	}

	getContrast(c1: Color, c2: Color): number {
		const l1 = this.luminance(c1);
		const l2 = this.luminance(c2);
		return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
	}

	/** Adjust color to reach target contrast relative to reference */
	adjustColorForContrast(
		color: Color,
		reference: Color,
		targetRatio: number = 5.5
	): Color {
		let attempts = 0;
		const maxAttempts = 50;
		let adjusted = color;

		while (
			this.getContrast(adjusted, reference) < targetRatio &&
			attempts < maxAttempts
		) {
			const contrast = this.getContrast(adjusted, reference);
			const direction =
				this.luminance(adjusted) > this.luminance(reference);

			// Try luminance adjustment
			const lighterOrDarker = adjusted.adjustLuminance(
				direction,
				0.25
			);
			if (this.getContrast(lighterOrDarker, reference) > contrast) {
				adjusted = lighterOrDarker;
			} else {
				// Try saturation nudge
				const desat = adjusted.adjustSaturation(10);
				if (this.getContrast(desat, reference) > contrast) {
					adjusted = desat;
				} else {
					// fallback
					adjusted = adjusted
						.adjustLuminance(direction, 0.25)
						.adjustSaturation(5);
				}
			}
			attempts++;
		}

		return adjusted;
	}

	/** Generate background colors */
	getBkgs(base: Color): Color[] {
		let lightBase;
		let darkBase;

		if (this.base.rgbToHsl().l < 50) {
			lightBase = this.base.adjustLuminance(true, 0.5);
			darkBase = this.base.adjustLuminance(false, 0.1);
		} else {
			lightBase = this.base.adjustLuminance(true, 0.1);
			darkBase = this.base.adjustLuminance(false, 0.5);
		}

		const light = this.adjustColorForContrast(lightBase, this.base, 3);
		const dark = this.adjustColorForContrast(darkBase, this.base, 3);

		return [
			light,
			light.adjustSaturation(10),
			light.adjustLuminance(true, 0.5),
			this.adjustColorForContrast(
				light.adjustLuminance(true, 0.6).adjustSaturation(15),
				dark,
				7
			),
			dark,
			dark.adjustSaturation(10),
			dark.adjustLuminance(false, 0.4),
			this.adjustColorForContrast(
				dark.adjustLuminance(false, 0.5).adjustSaturation(15),
				light,
				7
			),
		];
	}

	/** Get complimentary colour */
	getComplimentaryColor(base: Color): Color {
		let baseHsl = base.rgbToHsl();
		let complimentaryHue = (baseHsl.h + 180) % 360;
		let newColor = Color.hslToRgb({ ...baseHsl, h: complimentaryHue });
		this.adjustColorForContrast(newColor, base, 4.5);

		return newColor;
	}

	/** Get analgous colours in either direction */
	getAnalagousColors(base: Color): Color[] {
		let baseHsl = base.rgbToHsl();
		let aHue1 = baseHsl.h + 25;
		let aHue2 = baseHsl.h - 25;
		let analagousColors = [
			Color.hslToRgb({ ...baseHsl, h: aHue1 }),
			Color.hslToRgb({ ...baseHsl, h: aHue2 }),
		];

		return analagousColors;
	}

	/** Return all palette colors as HEX */
	getColors(): hexPalette {
		return {
			base: this.colors.base.rgbToHex(),
			lightBkgs: this.colors.lightBkg.map(c => c.rgbToHex()),
			darkBkgs: this.colors.darkBkg.map(c => c.rgbToHex()),
			icon: this.colors.icon.rgbToHex(),
		};
	}
}
