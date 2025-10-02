import { bindGenerateButton, bindBaseColorInput, renderSwatches } from './dom';
import { Palette } from './Palette';
import { hexToRgb } from './utils/models';

// Initialize the app
function init() {
	let palettes: Palette[] = [];
	let currentPalette: Palette;

	// Bind UI events
	bindBaseColorInput((color: string) => {
		currentPalette = new Palette(hexToRgb(color));
	});

	// Bind the generate button
	bindGenerateButton(() => {
		palettes.push(currentPalette);
		renderSwatches(
			document.getElementById('mono-theme')! as HTMLDivElement,
			currentPalette.schemes.monochrome
		);
		// renderSwatches(
		// 	document.getElementById(
		// 		'complementary-theme'
		// 	)! as HTMLDivElement,
		// 	currentPalette.schemes.complementary
		// );
	});
}

document.addEventListener('DOMContentLoaded', init);
