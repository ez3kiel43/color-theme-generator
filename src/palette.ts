import { Color, hexToRgb, contrast } from './models';

export class Palette {
	private colors: Color[] = [];

	addColor(hex: string): void {
		this.colors.push({ hex, rgb: hexToRgb(hex) });
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
}
