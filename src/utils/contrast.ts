import { Color } from './models';
import { luminance, adjustLuminance, adjustSaturation } from './luminance';

export function getContrast(c1: Color, c2: Color): number {
	const l1 = luminance(c1.rgb);
	const l2 = luminance(c2.rgb);
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * BASIC CONTRAST REQUIREMENTS FOR WCAG GUIDELINES
 * Text Regular (AAA) = 7:1
 * Text Large/heading (AAA) = 4.5:1
 * Icons (AAA) = 3:1
 */

function adjustColorForContrast(
	baseColor: Color,
	referenceColor: Color,
	targetRatio: number = 4.5
) {
	let adjusted = baseColor;
	let attempts = 0;
	let maxAttempts = 50;

	// Step 1: Check current contrast
	while (
		getContrast(adjusted, referenceColor) < targetRatio &&
		attempts < maxAttempts
	) {
		let currentContrast = getContrast(adjusted, referenceColor);

		// Decide whether to lighten or darken
		let direction: boolean =
			luminance(adjusted.rgb) < luminance(referenceColor.rgb);

		// Try luminance first
		let testLum = adjustLuminance(adjusted, direction);
		let lumContrast = getContrast(testLum, referenceColor);

		if (lumContrast >= currentContrast + 2) {
			adjusted = testLum;
		} else {
			// If luminance change doesn't help much, nudge saturation
			let testSat = adjustSaturation(adjusted, true); // small desaturation
			let satContrast = getContrast(testSat, referenceColor);

			if (satContrast >= currentContrast + 1) {
				adjusted = testSat;
			} else {
				// Combo move: nudge both slightly
				adjusted = adjustLuminance(adjusted, direction);
				adjusted = adjustSaturation(adjusted, false);
			}
		}

		attempts++;
	}

	return adjusted;
}
