// src/dom.ts

import { colorRoles } from './utils/models';
import { Color } from './utils/models';

// Render color swatches into the DOM
export function renderPalette(palette: string[]): void {
	const paletteContainer = document.getElementById('palette');
	if (!paletteContainer) return;
	// console.log('Rendering palette:', palette);
	paletteContainer.innerHTML = ''; // clear old swatches
	palette.forEach((color, i) => {
		//create swatch container
		const swatchContainer = document.createElement('div');
		swatchContainer.classList.add('swatch-container');
		//create swatch and label
		const swatch = document.createElement('div');
		swatch.style.background = color;
		swatch.style.color = palette[1];
		swatch.classList.add('swatch');
		swatch.textContent = color; // Show hex code in swatch
		swatchContainer.appendChild(swatch); //put swatch in container
		//create label
		const swatchLabel = document.createElement('span');
		swatchLabel.textContent = colorRoles[i]; // Show color role below swatch
		swatchContainer.appendChild(swatchLabel); //put label in container
		//add container to palette
		paletteContainer.appendChild(swatchContainer);
	});
}

// Bind the generate theme button click to a callback
export function bindGenerateButton(callback: () => void): void {
	const button = document.getElementById('generate-palette');
	if (button) {
		button.addEventListener('click', callback);
	}
}

// link base color input to callback
export function bindBaseColorInput(callback: (color: string) => void): void {
	const input = document.getElementById(
		'base-input'
	) as HTMLInputElement | null;
	if (input) {
		input.addEventListener('input', (event: Event) => {
			enableInteractiveElement(
				document.getElementById('generate-palette')!
			);
			const target = event.target as HTMLInputElement;
			callback(target.value);
		});
	}
}

// link accent color input to callback
export function bindAccentColorInput(callback: (color: string) => void): void {
	const input = document.getElementById(
		'accent-input'
	) as HTMLInputElement | null;
	if (input) {
		input.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			callback(target.value);
		});
	}
}

//disable interactive element
export function disableInteractiveElement(el: HTMLElement): void {
	if (el) {
		//Check if the element exists
		el.setAttribute('disabled', 'true');
		el.setAttribute('aria-disabled', 'true');
	}
}

//enable interactive element
export function enableInteractiveElement(el: HTMLElement): void {
	if (el) {
		//Check if the element exists
		el.removeAttribute('disabled');
		el.removeAttribute('aria-disabled');
	}
}

export function updatePreview(colors: string[]): void {
	const palettePreview = document.querySelector(
		'#palette-preview'
	) as HTMLDivElement;
	const alertsPreview = document.querySelector(
		'#alerts-preview'
	) as HTMLDivElement;

	palettePreview.style.backgroundColor = colors[0];
	palettePreview.style.color = colors[1];

	alertsPreview.style.backgroundColor = colors[0];
	alertsPreview.style.color = colors[1];
	alertsPreview.querySelectorAll('button').forEach((btn, i) => {
		btn.style.backgroundColor = colors[i + 2];
		btn.style.color = colors[1];
	});
}
