import { Color } from './Color';
import { colorScheme } from './utils/models';

export class Palette {
	base: Color;
	schemes: {
		monochrome: colorScheme;
		// complementary: colorScheme;
		// analogous: colorScheme;
	};

	constructor(base: Color) {
		this.base = base;
		this.schemes = this.generatePalette(base);
	}

	/* ---------- Static Utilities ---------- */

	/** Relative luminance for WCAG */
	static luminance(color: Color): number {
		const a = [color.r, color.g, color.b].map(v => {
			v /= 255;
			return v <= 0.03928
				? v / 12.92
				: Math.pow((v + 0.055) / 1.055, 2.4);
		});
		return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
	}

	/** Contrast ratio between two colors */
	static getContrast(c1: Color, c2: Color): number {
		const l1 = Palette.luminance(c1);
		const l2 = Palette.luminance(c2);
		return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
	}

	/* ---------- Palette Generators ---------- */

	private generatePalette(base: Color) {
		return {
			monochrome: this.generateMonochrome(base),
			// complementary: this.generateComplementary(base),
		};
	}

	/** Generate monochrome theme colors */
	private generateMonochrome(base: Color): colorScheme {
		const highSaturation = base.rgbToHsl().s > 80;
		const highLuminance = base.rgbToHsl().l > 50;

		const bkg = new Color(255, 255, 255);
		const txt = new Color(0, 0, 0);

		return {
			base: base,
			//find a light, neutral colour for background
			background: bkg,
			//find a dark, neutral colour for text
			text: txt,
			//find a different luminance / saturation variant of the base
			accent:
				Palette.luminance(base) > 0.5
					? base
							.adjustLuminance(false, 0.3)
							.adjustSaturation(-25)
					: base
							.adjustLuminance(true, 0.3)
							.adjustSaturation(-25),
		};
	}

	// private generateComplementary(base: Color): colorScheme {
	// 	const baseHsl = base.rgbToHsl();
	// 	const compHue = (baseHsl.h + 180) % 360;
	// 	const compColor = Color.hslToRgb({ ...baseHsl, h: compHue });
	// 	const lightComp = this.adjustColorForContrast(
	// 		compColor.adjustLuminance(true, 0.25),
	// 		base,
	// 		7
	// 	);
	// 	const darkComp = this.adjustColorForContrast(
	// 		this.adjustColorForContrast(
	// 			compColor.adjustLuminance(false, 0.25),
	// 			lightComp,
	// 			7
	// 		),
	// 		base,
	// 		4.5
	// 	);

	// 	return {
	// 		base: base,
	// 		background: lightComp,
	// 		text: darkComp,
	// 		accent: this.adjustColorForContrast(compColor, base, 3),
	// 	};
	// }
}
