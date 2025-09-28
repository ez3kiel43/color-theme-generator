import { Palette } from './palette';
import {
	renderPalette,
	bindGenerateButton,
	bindAccentColorInput,
	bindBaseColorInput,
	updatePreview,
} from './dom';

// Initialize the app
function init() {
	const palette = new Palette();

	// Function to generate and render a new palette
	function generateAndRenderPalette() {
		const colors = palette.getColors().map(c => c.hex);
		renderPalette(colors);
		updatePreview(colors);
	}

	// Bind UI events
	bindBaseColorInput((color: string) => {
		palette.setBaseColor(color); // color comes from the input event
		palette.setSupportingColors(); // generate supporting colors
	});

	// bindAccentColorInput((color: string) => {
	// 	palette.setAccentColor(color);
	// });

	// Bind the generate button
	bindGenerateButton(() => {
		generateAndRenderPalette();
	});

	// Initial render
	generateAndRenderPalette();
}

document.addEventListener('DOMContentLoaded', init);
