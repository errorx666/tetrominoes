import { Grid } from './grid';
import { Renderable } from './renderable';

export class Board extends Grid implements Renderable {
	constructor() {
		super( 10, 24 );
	}
}
