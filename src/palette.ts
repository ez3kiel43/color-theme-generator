import { Color } from './Color';
import { hexPalette } from './utils/models';

export class Palette {
	base: Color;
	colors: {
		base: Color;
		lightBkg: Color[];
		darkBkg: Color[];
		analogous1: Color[];
		analogous2: Color[];
		complementary: Color[];
		icon: Color;
	};

	constructor(base: Color) {
		this.base = base;
		this.colors = this.generatePalette(base);
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

	/* ---------- Adjustment Helpers ---------- */

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
			Palette.getContrast(adjusted, reference) < targetRatio &&
			attempts < maxAttempts
		) {
			const contrast = Palette.getContrast(adjusted, reference);
			const direction =
				Palette.luminance(adjusted) > Palette.luminance(reference);

			// Try luminance adjustment
			const lighterOrDarker = adjusted.adjustLuminance(
				direction,
				0.25
			);
			if (Palette.getContrast(lighterOrDarker, reference) > contrast) {
				adjusted = lighterOrDarker;
			} else {
				// Try saturation nudge
				const desat = adjusted.adjustSaturation(10);
				if (Palette.getContrast(desat, reference) > contrast) {
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

	/* ---------- Palette Generators ---------- */

	private generatePalette(base: Color) {
		return {
			base,
			lightBkg: this.generateLightBkgs(base),
			darkBkg: this.generateDarkBkgs(base),
			analogous1: this.generateAnalogousBkgs(base, +35),
			analogous2: this.generateAnalogousBkgs(base, -35),
			complementary: this.generateComplementaryBkgs(base),
			icon: base,
		};
	}

	/** Generate light background colors */
	private generateLightBkgs(base: Color): Color[] {
		const start = base.adjustLuminance(true, 0.8);

		const light = this.adjustColorForContrast(start, base, 3);

		return [
			light,
			light.adjustSaturation(10),
			light.adjustLuminance(true, 0.5),
			this.adjustColorForContrast(
				light.adjustLuminance(true, 0.6).adjustSaturation(15),
				base,
				7
			),
		];
	}

	/** Generate dark background colors */
	private generateDarkBkgs(base: Color): Color[] {
		const start = base.adjustLuminance(false, 0.5);

		const dark = this.adjustColorForContrast(start, base, 3);

		return [
			dark,
			dark.adjustSaturation(10),
			dark.adjustLuminance(false, 0.4),
			this.adjustColorForContrast(
				dark.adjustLuminance(false, 0.5).adjustSaturation(15),
				base,
				7
			),
		];
	}

	/** Generate complementary background colors */
	private generateComplementaryBkgs(base: Color): Color[] {
		const baseHsl = base.rgbToHsl();
		const compHue = (baseHsl.h + 180) % 360;

		const compColor = Color.hslToRgb({ ...baseHsl, h: compHue });
		const adjusted = this.adjustColorForContrast(compColor, base, 4.5);

		return this.generateLightBkgs(adjusted).concat(
			this.generateDarkBkgs(adjusted)
		);
	}

	/** Generate analogous background colors */
	private generateAnalogousBkgs(base: Color, shift: number): Color[] {
		const baseHsl = base.rgbToHsl();
		const newHue = (baseHsl.h + shift + 360) % 360;

		const aColor = Color.hslToRgb({ ...baseHsl, h: newHue });
		const adjusted = this.adjustColorForContrast(aColor, base, 4.5);

		return this.generateLightBkgs(adjusted).concat(
			this.generateDarkBkgs(adjusted)
		);
	}

	/* ---------- Public API ---------- */

	/** Return all palette colors as HEX */
	getColors(): hexPalette {
		return {
			base: this.colors.base.rgbToHex(),
			lightBkgs: this.colors.lightBkg.map(c => c.rgbToHex()),
			darkBkgs: this.colors.darkBkg.map(c => c.rgbToHex()),
			analogous1: this.colors.analogous1.map(c => c.rgbToHex()),
			analogous2: this.colors.analogous2.map(c => c.rgbToHex()),
			complementary: this.colors.complementary.map(c => c.rgbToHex()),
			icon: this.colors.icon.rgbToHex(),
		};
	}
}
