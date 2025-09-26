// src/dom.ts

// Render color swatches into the DOM
export function renderPalette(palette: [string, string]): void {
	const container = document.getElementById('palette');
	if (!container) return;

	container.innerHTML = ''; // clear old swatches
	palette.forEach(color => {
		const swatch = document.createElement('div');
		swatch.style.background = color;
		swatch.style.width = '80px';
		swatch.style.height = '80px';
		swatch.style.display = 'inline-block';
		container.appendChild(swatch);
	});
}

// Bind the button click to a callback
export function bindGenerateButton(callback: () => void): void {
	const button = document.getElementById('generate');
	if (button) {
		button.addEventListener('click', callback);
	}
}
