import { Color } from './models';
import { luminance } from './luminance';

export function getContrast(c1: Color, c2: Color): number {
	const l1 = luminance(c1.rgb);
	const l2 = luminance(c2.rgb);
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
