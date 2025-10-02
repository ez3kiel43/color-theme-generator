import { colorScheme } from './utils/models';

// Helper: render an array of swatches into a container
export function renderSwatches(container: HTMLDivElement, colors: colorScheme) {
	console.log(colors);
	container.innerHTML = '';
	for (const c of Object.keys(colors) as (keyof typeof colors)[]) {
		// console.log(colors[c]);
		const swatch = document.createElement('div');
		swatch.classList.add('swatch');
		swatch.style.backgroundColor = colors[c].rgbToHex();
		swatch.textContent = colors[c].rgbToHex();
		swatch.style.color = colors.text.rgbToHex();
		container.appendChild(swatch);
	}
}

// Render color swatches into the DOM

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
		input.addEventListener('change', (event: Event) => {
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

export function updatePreview(colors: colorScheme): void {
	console.log('updating preview');
	const palettePreview = document.querySelector(
		'#palette-preview'
	) as HTMLDivElement;
	if (!palettePreview) {
		alert('An error ocurred rendering the Palette');
		return;
	}

	palettePreview.style.backgroundColor = colors.background.rgbToHex();
	palettePreview.style.color = colors.text.rgbToHex();
	let btn1 = palettePreview.querySelector(
		'.cta-btn.primary'
	)! as HTMLButtonElement;
	let btn2 = palettePreview.querySelector(
		'.cta-btn.alternate'
	)! as HTMLButtonElement;

	btn1.style.backgroundColor = colors.base.rgbToHex();
	btn1.style.color = colors.background.rgbToHex();
	btn2.style.borderColor = colors.base.rgbToHex();
	btn2.style.color = colors.base.rgbToHex();
	btn2.style.backgroundColor = colors.background.rgbToHex();
}
