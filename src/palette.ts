import {
	Color,
	ColorRole,
	defaultPaletteHex,
	colorRoles,
} from './utils/models';
import { luminance } from './utils/luminance';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './utils/conversions';
import { getContrast } from './utils/contrast';
export class Palette {
	constructor() {
		//set default Colors

		for (const role in colorRoles) {
			this.addColor(colorRoles[role], defaultPaletteHex[role]);
		}
	}

	private colors: Color[] = [];

	addColor(label: ColorRole, hex: string): void {
		this.colors.push({ label, hex, rgb: hexToRgb(hex) });
	}

	getColors(): Color[] {
		return this.colors;
	}

	getAccessiblePairs(): [Color, Color][] {
		const pairs: [Color, Color][] = [];
		for (let i = 0; i < this.colors.length; i++) {
			for (let j = i + 1; j < this.colors.length; j++) {
				if (getContrast(this.colors[i], this.colors[j]) >= 4.5) {
					pairs.push([this.colors[i], this.colors[j]]);
				}
			}
		}
		return pairs;
	}

	setBaseColor(hex: string): void {
		// Example logic to set base color and regenerate palette
		this.colors = []; // Clear existing colors
		this.addColor('Background', hex);
	}

	// setAccentColor(hex: string): void {
	// 	// Example logic to set accent color and regenerate palette
	// 	// This is just a placeholder; implement your own logic
	// 	this.addColor('Accent', hex);
	// }

	setSupportingColors(): void {
		//Define the base and accent colors first
		// if (this.colors.length < 2) return; // Need at least base and accent
		const baseColor = this.colors[0];
		// const accentColor = this.colors[1];

		//determine text color (black or white) based on contrast with base
		const white: Color = {
			label: 'Text',
			hex: '#FFFFFF',
			rgb: { r: 255, g: 255, b: 255 },
		};
		const black: Color = {
			label: 'Text',
			hex: '#000000',
			rgb: { r: 0, g: 0, b: 0 },
		};
		const whiteContrast = getContrast(baseColor, white);
		const blackContrast = getContrast(baseColor, black);
		const textColor = whiteContrast > blackContrast ? white : black;
		//add text color
		this.addColor('Text', textColor.hex);
		console.log('Selected text color:', textColor.hex);

		// if text color is white, make info/success/warning/error darker shades of default
		const isTextWhite = textColor.hex === '#FFFFFF';
		/** start with default colors for supports
		 * info = blue #0099FF
		 * success = green #33CC66
		 * warning = orangey-yellow #FFCC00
		 * error = red #FF3333
		 * neutral = mid-gray #808099
		 *
		 * For Each Color
		 * 		1) Calculate luminance of each
		 * 		2) get contrast ratio with text color (white or black), goal is 7 or greater (AAA standard)
		 * 		3) If color does not meet standard convert to HSL and raise or lower luminance through altering HSL Value
		 * 		4) Convert back to RGB and re-check contrast ratio
		 * 		5) repeat steps 3&4 as much as necessary
		 * 		6) return final colour selection
		 *
		 * Assign colours to their 'roles' in the palette
		 * */

		for (
			let i = this.colors.findIndex(c => c.label === 'Info');
			i < this.colors.length;
			i++
		) {
			if (isTextWhite) {
				//darken the color (possibly change saturation and hue for future)
				let color = this.colors[i];

				let contrast: number = getContrast(textColor, color);

				do {
					let converted = rgbToHsl({ ...color.rgb });
					let newRGB = hslToRgb(
						converted.h,
						converted.s,
						converted.l - 0.1
					);
					color.hex = rgbToHex(newRGB);
					color.rgb = newRGB;

					contrast = getContrast(textColor, color);
				} while (contrast < 7);
			} else {
				//lighten the color (possibly add more saturation for future updates)
			}
		}
	}
}
