export function hsl( hue: number, saturation: number, value: number ) {
	return `hsl(${hue}deg, ${saturation * 100}%, ${value * 100}%)`;
}

export function oklch( l: number, c: number, h: number ) {
	return `oklch(${l} ${c} ${h}deg)`;
}
