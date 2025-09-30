import { hexPalette, previewPalette } from './utils/models';

const themes = ['mono', 'complementary', 'analogous1', 'analogous2'];

// Helper: render an array of swatches into a container
function renderSwatches(
	container: HTMLDivElement,
	colors: string[],
	textColor: string
) {
	container.innerHTML = '';
	colors.forEach(c => {
		const swatch = document.createElement('div');
		swatch.classList.add('swatch');
		swatch.style.backgroundColor = c;
		swatch.textContent = c;
		swatch.style.color = textColor;
		container.appendChild(swatch);
	});
}

// Render color swatches into the DOM
export function renderPalette(palette: hexPalette): void {
	const baseContainer = document.querySelector(
		'#palette #base'
	)! as HTMLDivElement;

	themes.forEach(theme => {
		const lightContainer = document.querySelector(
			`#palette #${theme}-light-theme`
		)! as HTMLDivElement;
		const darkContainer = document.querySelector(
			`#palette #${theme}-dark-theme`
		)! as HTMLDivElement;

		switch (theme) {
			case 'mono':
				renderSwatches(
					lightContainer,
					palette.lightBkgs,
					palette.darkBkgs[palette.darkBkgs.length - 1]
				);
				renderSwatches(
					darkContainer,
					palette.darkBkgs,
					palette.lightBkgs[palette.lightBkgs.length - 1]
				);
				break;

			case 'complementary':
				renderSwatches(
					lightContainer,
					palette.complementary.slice(0, 4),
					palette.darkBkgs[palette.darkBkgs.length - 1]
				);
				renderSwatches(
					darkContainer,
					palette.complementary.slice(4),
					palette.lightBkgs[palette.lightBkgs.length - 1]
				);
				break;

			case 'analogous1':
				renderSwatches(
					lightContainer,
					palette.analogous1.slice(0, 4),
					palette.darkBkgs[palette.darkBkgs.length - 1]
				);
				renderSwatches(
					darkContainer,
					palette.analogous1.slice(4),
					palette.lightBkgs[palette.lightBkgs.length - 1]
				);
				break;

			case 'analogous2':
				renderSwatches(
					lightContainer,
					palette.analogous2.slice(0, 4),
					palette.darkBkgs[palette.darkBkgs.length - 1]
				);
				renderSwatches(
					darkContainer,
					palette.analogous2.slice(4),
					palette.lightBkgs[palette.lightBkgs.length - 1]
				);
				break;
		}
	});

	// Base color swatch
	baseContainer.innerHTML = '';
	const baseSwatch = document.createElement('div');
	baseSwatch.classList.add('swatch', 'base');
	baseSwatch.style.backgroundColor = palette.base;
	baseSwatch.textContent = palette.base;
	baseSwatch.style.color = palette.lightBkgs[palette.lightBkgs.length - 1];
	baseContainer.appendChild(baseSwatch);

	// Hook up swatch clicks
	document.querySelectorAll('.swatch:not(.base)').forEach(s => {
		s.addEventListener('click', (e: Event) => {
			console.log(
				'Swatch clicked:',
				(e.target as HTMLElement).textContent
			);
		});
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
