import { Palette } from './palette';

const palette = new Palette();

const inputEl = document.getElementById('color-input') as HTMLInputElement;
const addBtn = document.getElementById('generate-palette') as HTMLButtonElement;
const paletteDiv = document.getElementById('palette') as HTMLDivElement;

addBtn.addEventListener('click', () => {
	const hex = inputEl.value;
	palette.addColor(hex);
	renderPalette();
});

function renderPalette() {
	paletteDiv.innerHTML = '';
	palette.getColors().forEach(color => {
		const div = document.createElement('div');
		div.style.backgroundColor = color.hex;
		div.textContent = color.hex;
		div.className = 'color-box';
		paletteDiv.appendChild(div);
	});
}
