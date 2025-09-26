import { Color, hexToRgb, contrast, ColorRole } from './models';

export class Palette {
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
				if (contrast(this.colors[i], this.colors[j]) >= 4.5) {
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
			rgb: [255, 255, 255],
		};
		const black: Color = {
			label: 'Text',
			hex: '#000000',
			rgb: [0, 0, 0],
		};
		const whiteContrast = contrast(baseColor, white);
		const blackContrast = contrast(baseColor, black);
		const textColor = whiteContrast > blackContrast ? white : black;
		//add text color
		this.addColor('Text', textColor.hex);
		console.log('Selected text color:', textColor.hex);
	}
}
