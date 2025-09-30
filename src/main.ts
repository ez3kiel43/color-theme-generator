import {
	renderPalette,
	bindGenerateButton,
	bindBaseColorInput,
	updatePreview,
	bindSwatches,
} from './dom';
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
		renderPalette(currentPalette?.getColors());
		bindSwatches(updatePreview);
	});
}

document.addEventListener('DOMContentLoaded', init);
