import { hexPalette, previewPalette } from './utils/models';

// Render color swatches into the DOM
export function renderPalette(palette: hexPalette): void {
	const baseContainer = document.querySelector(
		'#palette #base'
	)! as HTMLDivElement;
	const lightContainer = document.querySelector(
		'#palette #light-mode'
	)! as HTMLDivElement;
	const darkContainer = document.querySelector(
		'#palette #dark-mode'
	)! as HTMLDivElement;

	baseContainer.innerHTML = '';
	lightContainer.innerHTML = '';
	darkContainer.innerHTML = '';

	//Add base color swatch to page
	const baseSwatch = document.createElement('div');
	baseSwatch.classList.add('swatch');
	baseSwatch.classList.add('base');
	baseSwatch.style.backgroundColor = palette.base;
	baseSwatch.textContent = palette.base;
	baseSwatch.style.color = palette.lightBkgs[palette.lightBkgs.length - 1];
	baseContainer.appendChild(baseSwatch);

	palette.lightBkgs.map(c => {
		const lightSwatch = document.createElement('div');
		lightSwatch.classList.add('swatch');
		lightSwatch.style.backgroundColor = c;
		lightSwatch.textContent = c;
		lightSwatch.style.color =
			palette.darkBkgs[palette.darkBkgs.length - 1];
		lightContainer.appendChild(lightSwatch);
	});

	palette.darkBkgs.map(c => {
		const darkSwatch = document.createElement('div');
		darkSwatch.classList.add('swatch');
		darkSwatch.style.backgroundColor = c;
		darkSwatch.textContent = c;
		darkSwatch.style.color =
			palette.lightBkgs[palette.lightBkgs.length - 1];
		darkContainer.appendChild(darkSwatch);
	});

	document.querySelectorAll('.swatch:not(.base)').forEach(s => {
		s.addEventListener('click', (e: Event) => {});
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

//bind swatches to update preview function !Call when generating new palette!
export function bindSwatches(callback: (colors: previewPalette) => void): void {
	document.querySelectorAll('.swatch').forEach(s => {
		s.addEventListener('click', (e: Event) => {
			const target = e.target as HTMLDivElement;
			const base = document.querySelector(
				'.swatch.base'
			) as HTMLDivElement;
			const p: previewPalette = {
				base: base.style.backgroundColor,
				text: target.style.color,
				bkg: target.style.backgroundColor,
			};
			callback(p);
		});
	});
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

export function updatePreview(colors: previewPalette): void {
	console.log('updating preview');
	const palettePreview = document.querySelector(
		'#palette-preview'
	) as HTMLDivElement;
	if (!palettePreview) {
		alert('An error ocurred rendering the Palette');
		return;
	}

	palettePreview.style.backgroundColor = colors.bkg;
	palettePreview.style.color = colors.text;
	let btn1 = palettePreview.querySelector(
		'.cta-btn.primary'
	)! as HTMLButtonElement;
	let btn2 = palettePreview.querySelector(
		'.cta-btn.alternate'
	)! as HTMLButtonElement;

	btn1.style.backgroundColor = colors.base;
	btn1.style.color = colors.bkg;
	btn2.style.borderColor = colors.base;
	btn2.style.color = colors.base;
	btn2.style.backgroundColor = colors.bkg;
}
